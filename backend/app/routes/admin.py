from typing import Type
from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session
from app.core.config import get_settings
from app.core.email import send_email
from app.database.session import get_db
from app.models import Project, Skill, Experience, Education, Certification, ContactMessage
from app.models.admin_user import AdminUser
from app.schemas.admin import (
    AdminIdentity,
    LoginRequest,
    ChangePasswordRequest,
    ProjectInput,
    SkillInput,
    ExperienceInput,
    EducationInput,
    CertificationInput,
    MessageStatusInput,
    MessageReplyInput,
)
from app.security import create_token, get_current_admin, verify_password, hash_password

router = APIRouter(prefix="/admin", tags=["admin"])

RESOURCE_MODELS: dict[str, Type] = {
    "projects": Project,
    "skills": Skill,
    "experience": Experience,
    "education": Education,
    "certifications": Certification,
}

RESOURCE_INPUTS = {
    "projects": ProjectInput,
    "skills": SkillInput,
    "experience": ExperienceInput,
    "education": EducationInput,
    "certifications": CertificationInput,
}


def resource_or_404(resource: str):
    if resource not in RESOURCE_MODELS:
        raise HTTPException(status_code=404, detail=f"Unknown resource: {resource}")
    return RESOURCE_MODELS[resource]


@router.post("/login", response_model=AdminIdentity)
def login(payload: LoginRequest, response: Response, db: Session = Depends(get_db)):
    admin = db.query(AdminUser).filter(AdminUser.username == payload.username).first()
    if not admin or not admin.is_active or not verify_password(payload.password, admin.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid username or password")

    settings = get_settings()
    response.set_cookie(
        key="admin_session",
        value=create_token(admin),
        httponly=True,
        secure=settings.cookie_secure,
        samesite="lax",
        max_age=settings.admin_session_minutes * 60,
        path="/",
    )
    return admin


@router.get("/me", response_model=AdminIdentity)
def me(admin: AdminUser = Depends(get_current_admin)):
    return admin


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(response: Response, admin: AdminUser = Depends(get_current_admin)):
    response.status_code = status.HTTP_204_NO_CONTENT
    response.delete_cookie("admin_session", path="/")
    return response


@router.post("/change-password")
@router.put("/password")
def change_password(payload: ChangePasswordRequest, admin: AdminUser = Depends(get_current_admin), db: Session = Depends(get_db)):
    if not verify_password(payload.current_password, admin.password_hash):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Current password is incorrect")
    admin.password_hash = hash_password(payload.new_password)
    db.commit()
    return {"message": "Password updated successfully"}


@router.get("/dashboard")
def dashboard(admin: AdminUser = Depends(get_current_admin), db: Session = Depends(get_db)):
    return {
        "projects": db.query(Project).count(),
        "skills": db.query(Skill).count(),
        "experience": db.query(Experience).count(),
        "education": db.query(Education).count(),
        "certifications": db.query(Certification).count(),
        "new_messages": db.query(ContactMessage).filter(ContactMessage.status == "new").count(),
        "total_messages": db.query(ContactMessage).count(),
    }


# Messages routes (Explicitly defined before /{resource} to prevent matching conflicts)
@router.get("/messages")
@router.get("/messages/list")
def list_messages(admin: AdminUser = Depends(get_current_admin), db: Session = Depends(get_db)):
    return db.query(ContactMessage).order_by(ContactMessage.created_at.desc()).all()


@router.get("/messages/{message_id}")
def get_message(message_id: int, admin: AdminUser = Depends(get_current_admin), db: Session = Depends(get_db)):
    item = db.get(ContactMessage, message_id)
    if not item:
        raise HTTPException(status_code=404, detail="Message not found")
    return item


@router.patch("/messages/{message_id}")
@router.put("/messages/{message_id}")
def update_message(message_id: int, payload: MessageStatusInput, admin: AdminUser = Depends(get_current_admin), db: Session = Depends(get_db)):
    item = db.get(ContactMessage, message_id)
    if not item:
        raise HTTPException(status_code=404, detail="Message not found")
    item.status = payload.status
    db.commit()
    db.refresh(item)
    return item


@router.post("/messages/{message_id}/reply")
def reply_to_message(
    message_id: int,
    payload: MessageReplyInput,
    admin: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    item = db.get(ContactMessage, message_id)
    if not item:
        raise HTTPException(status_code=404, detail="Message not found")

    if not item.email:
        raise HTTPException(status_code=400, detail="Recipient has no email address configured")

    success, error_msg = send_email(
        to_email=item.email,
        subject=payload.subject,
        body_text=payload.message,
    )

    if not success:
        raise HTTPException(
            status_code=502,
            detail=f"Email dispatch failed: {error_msg or 'Failed to send reply'}",
        )

    # Only transition status upon verified delivery
    item.status = "replied"
    db.commit()
    db.refresh(item)
    return {
        "success": True,
        "message": f"Reply successfully dispatched to {item.email}",
        "status": item.status,
    }


@router.delete("/messages/{message_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_message(message_id: int, admin: AdminUser = Depends(get_current_admin), db: Session = Depends(get_db)):
    item = db.get(ContactMessage, message_id)
    if not item:
        raise HTTPException(status_code=404, detail="Message not found")
    db.delete(item)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


# Generic CRUD for portfolio resources
@router.get("/{resource}")
def list_resources(resource: str, admin: AdminUser = Depends(get_current_admin), db: Session = Depends(get_db)):
    model = resource_or_404(resource)
    order_col = getattr(model, "display_order", model.id)
    return db.query(model).order_by(order_col, model.id).all()


@router.get("/{resource}/{item_id}")
def get_resource(resource: str, item_id: int, admin: AdminUser = Depends(get_current_admin), db: Session = Depends(get_db)):
    model = resource_or_404(resource)
    item = db.get(model, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Record not found")
    return item


@router.post("/{resource}", status_code=status.HTTP_201_CREATED)
def create_resource(resource: str, payload: dict, admin: AdminUser = Depends(get_current_admin), db: Session = Depends(get_db)):
    model = resource_or_404(resource)
    schema_cls = RESOURCE_INPUTS[resource]
    validated = schema_cls(**payload).model_dump()
    valid_cols = {c.name for c in model.__table__.columns}
    filtered_data = {k: v for k, v in validated.items() if k in valid_cols}
    item = model(**filtered_data)
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.put("/{resource}/{item_id}")
@router.patch("/{resource}/{item_id}")
def update_resource(resource: str, item_id: int, payload: dict, admin: AdminUser = Depends(get_current_admin), db: Session = Depends(get_db)):
    model = resource_or_404(resource)
    item = db.get(model, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Record not found")
    schema_cls = RESOURCE_INPUTS[resource]
    validated = schema_cls(**payload).model_dump()
    valid_cols = {c.name for c in model.__table__.columns}
    for field, value in validated.items():
        if field in valid_cols:
            setattr(item, field, value)
    db.commit()
    db.refresh(item)
    return item


@router.delete("/{resource}/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_resource(resource: str, item_id: int, admin: AdminUser = Depends(get_current_admin), db: Session = Depends(get_db)):
    model = resource_or_404(resource)
    item = db.get(model, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Record not found")
    db.delete(item)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)

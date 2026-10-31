import logging
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.core.email import send_email, send_visitor_confirmation
from app.database.session import get_db
from app.models.contact_message import ContactMessage
from app.schemas.contact_message import ContactMessageCreate, ContactMessageResponse

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/contact", tags=["contact"])


@router.post("", response_model=ContactMessageResponse)
def create_contact_message(message: ContactMessageCreate, db: Session = Depends(get_db)):
    """
    Create a new contact message.
    The message is always persisted to SQLite first before any email notification is attempted.
    """
    try:
        db_message = ContactMessage(**message.model_dump())
        db.add(db_message)
        db.commit()
        db.refresh(db_message)
    except Exception as e:
        db.rollback()
        logger.error("Failed to persist contact message to SQLite: %s", type(e).__name__)
        raise HTTPException(status_code=500, detail="Failed to save message to database")

    # Message safely saved to database! Attempt email notification if SMTP is configured.
    settings = get_settings()
    receiver = settings.contact_receiver_email or settings.smtp_username or settings.smtp_from_email

    if receiver and settings.smtp_host:
        email_subject = f"[Portfolio] {db_message.subject or 'New Inquiry from ' + db_message.name}"
        email_body = (
            f"You have received a new inquiry on your portfolio website:\n\n"
            f"From: {db_message.name} <{db_message.email}>\n"
            f"Subject: {db_message.subject or 'None'}\n\n"
            f"Message:\n{db_message.message}\n\n"
            f"---\n"
            f"Manage and reply to this inquiry in your Admin CMS: {settings.frontend_url}/admin/messages\n"
        )
        try:
            success, err = send_email(
                to_email=receiver,
                subject=email_subject,
                body_text=email_body,
            )
            if not success:
                logger.warning("Message #%s saved, but notification email failed: %s", db_message.id, err)
        except Exception as mail_err:
            logger.error("Error during contact email notification: %s", type(mail_err).__name__)

    # Automatically send professional confirmation email to the visitor
    if settings.smtp_host and db_message.email:
        portfolio_url = settings.portfolio_url or settings.frontend_url
        try:
            v_success, v_err = send_visitor_confirmation(
                visitor_email=db_message.email,
                visitor_name=db_message.name,
                message_subject=db_message.subject,
                message_text=db_message.message,
                portfolio_url=portfolio_url,
            )
            if not v_success:
                logger.warning(
                    "Message #%s saved, but visitor confirmation email failed: %s",
                    db_message.id,
                    v_err,
                )
            else:
                logger.info("Visitor confirmation email successfully sent to %s", db_message.email)
        except Exception as conf_err:
            logger.error("Error during visitor confirmation email: %s", type(conf_err).__name__)

    return db_message
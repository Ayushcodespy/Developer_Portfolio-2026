import json
import re
from typing import Any, Optional
from pydantic import BaseModel, Field, field_validator, model_validator


def _normalize_json_field(v: Any) -> Optional[str]:
    if v is None:
        return None
    if isinstance(v, list):
        items = [str(x).strip() for x in v if str(x).strip()]
        return json.dumps(items)
    if isinstance(v, str):
        v_str = v.strip()
        if not v_str:
            return "[]"
        if v_str.startswith("[") and v_str.endswith("]"):
            try:
                parsed = json.loads(v_str)
                if isinstance(parsed, list):
                    return json.dumps([str(x).strip() for x in parsed if str(x).strip()])
            except Exception:
                pass
        # Split by comma or newline
        items = [x.strip() for x in re.split(r"[,\n\r]+", v_str) if x.strip()]
        return json.dumps(items)
    return json.dumps([str(v).strip()])


class LoginRequest(BaseModel):
    username: str = Field(min_length=1, max_length=100)
    password: str = Field(min_length=1, max_length=256)


class AdminIdentity(BaseModel):
    id: int
    username: str
    model_config = {"from_attributes": True}


class ChangePasswordRequest(BaseModel):
    current_password: str = Field(min_length=1, max_length=256)
    new_password: str = Field(min_length=6, max_length=256)


class ProjectInput(BaseModel):
    title: str = Field(min_length=1, max_length=255)
    description: str = Field(min_length=1)
    subtitle: Optional[str] = None
    category: Optional[str] = None
    technologies: Optional[Any] = None
    features: Optional[Any] = None
    github_url: Optional[str] = None
    live_url: Optional[str] = None
    image_url: Optional[str] = None
    visual_type: Optional[str] = None
    featured: bool = False
    display_order: int = Field(default=0, ge=0)

    @field_validator("technologies", "features", mode="before")
    @classmethod
    def serialize_json_fields(cls, v: Any) -> Optional[str]:
        return _normalize_json_field(v)


class SkillInput(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    category: str = Field(min_length=1, max_length=50)
    display_order: int = Field(default=0, ge=0)


class ExperienceInput(BaseModel):
    company: str = Field(min_length=1, max_length=255)
    role: str = Field(min_length=1, max_length=255)
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    duration: Optional[str] = None
    description: Optional[str] = None
    responsibilities: Optional[Any] = None
    technologies: Optional[Any] = None
    display_order: int = Field(default=0, ge=0)

    @field_validator("responsibilities", "technologies", mode="before")
    @classmethod
    def serialize_json_fields(cls, v: Any) -> Optional[str]:
        return _normalize_json_field(v)


class EducationInput(BaseModel):
    institution: str = Field(min_length=1, max_length=255)
    degree: str = Field(min_length=1, max_length=255)
    field: Optional[str] = None
    location: Optional[str] = None
    start_year: Optional[str] = None
    end_year: Optional[str] = None
    cgpa: Optional[str] = None
    percentage: Optional[str] = None
    description: Optional[str] = None
    display_order: int = Field(default=0, ge=0)


class CertificationInput(BaseModel):
    name: Optional[str] = None
    title: Optional[str] = None
    provider: Optional[str] = None
    issuer: Optional[str] = None
    type: Optional[str] = None
    score: Optional[str] = None
    credential_url: Optional[str] = None
    image_url: Optional[str] = None
    display_order: int = Field(default=0, ge=0)

    @model_validator(mode="after")
    def validate_names(self):
        final_name = self.name or self.title
        final_provider = self.provider or self.issuer
        if not final_name or not final_name.strip():
            raise ValueError("Certification name/title is required")
        if not final_provider or not final_provider.strip():
            raise ValueError("Certification provider/issuer is required")
        self.name = final_name.strip()
        self.provider = final_provider.strip()
        return self


class MessageStatusInput(BaseModel):
    status: str

    @field_validator("status")
    @classmethod
    def valid_status(cls, value: str) -> str:
        if value not in {"new", "read", "replied"}:
            raise ValueError("Status must be new, read, or replied")
        return value


class MessageReplyInput(BaseModel):
    subject: str = Field(default="Re: In response to your message", min_length=1, max_length=255)
    message: str = Field(min_length=1)


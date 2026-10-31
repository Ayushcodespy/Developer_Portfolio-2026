import base64
import hashlib
import hmac
import json
import os
import time
from fastapi import Cookie, Depends, Header, HTTPException, status
from sqlalchemy.orm import Session
from app.core.config import get_settings
from app.database.session import get_db
from app.models.admin_user import AdminUser


def hash_password(password: str) -> str:
    salt = os.urandom(16)
    digest = hashlib.scrypt(password.encode(), salt=salt, n=2**14, r=8, p=1)
    return f"scrypt${base64.urlsafe_b64encode(salt).decode()}${base64.urlsafe_b64encode(digest).decode()}"


def verify_password(password: str, encoded: str) -> bool:
    try:
        algorithm, salt_b64, digest_b64 = encoded.split("$")
        if algorithm != "scrypt": return False
        digest = hashlib.scrypt(password.encode(), salt=base64.urlsafe_b64decode(salt_b64), n=2**14, r=8, p=1)
        return hmac.compare_digest(digest, base64.urlsafe_b64decode(digest_b64))
    except (ValueError, TypeError):
        return False


def _b64(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b"=").decode()


def _unb64(data: str) -> bytes:
    return base64.urlsafe_b64decode(data + "=" * (-len(data) % 4))


def create_token(admin: AdminUser) -> str:
    settings = get_settings()
    if not settings.jwt_secret:
        raise RuntimeError("JWT_SECRET must be configured")
    header = _b64(b'{"alg":"HS256","typ":"JWT"}')
    payload = _b64(json.dumps({"sub": admin.id, "exp": int(time.time()) + settings.admin_session_minutes * 60}, separators=(",", ":")).encode())
    signature = _b64(hmac.new(settings.jwt_secret.encode(), f"{header}.{payload}".encode(), hashlib.sha256).digest())
    return f"{header}.{payload}.{signature}"


def get_current_admin(
    admin_session: str | None = Cookie(default=None),
    authorization: str | None = Header(default=None),
    db: Session = Depends(get_db),
) -> AdminUser:
    settings = get_settings()
    credentials_error = HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication required")
    
    token = admin_session
    if not token and authorization:
        parts = authorization.split()
        if len(parts) == 2 and parts[0].lower() == "bearer":
            token = parts[1]

    if not token or not settings.jwt_secret:
        raise credentials_error
    try:
        header, payload, signature = token.split(".")
        expected = _b64(hmac.new(settings.jwt_secret.encode(), f"{header}.{payload}".encode(), hashlib.sha256).digest())
        claims = json.loads(_unb64(payload))
        if not hmac.compare_digest(signature, expected) or claims["exp"] < time.time():
            raise ValueError
        admin = db.get(AdminUser, claims["sub"])
        if not admin or not admin.is_active:
            raise ValueError
        return admin
    except (ValueError, KeyError, json.JSONDecodeError):
        raise credentials_error

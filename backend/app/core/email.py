import logging
import re
import smtplib
from email.header import Header
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.utils import formataddr
from typing import Optional, Tuple

from app.core.config import get_settings

logger = logging.getLogger(__name__)

# Basic regex for email validation
EMAIL_REGEX = re.compile(r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$")


def sanitize_header(value: str) -> str:
    """Sanitize email header values to prevent CRLF injection attacks."""
    if not value:
        return ""
    # Remove any newline or carriage return characters
    cleaned = re.sub(r"[\r\n]+", " ", str(value)).strip()
    return cleaned


def is_valid_email(email: str) -> bool:
    """Check if the provided email string has a valid format."""
    if not email or not isinstance(email, str):
        return False
    return bool(EMAIL_REGEX.match(email.strip()))


def send_email(
    to_email: str,
    subject: str,
    body_text: str,
    body_html: Optional[str] = None,
) -> Tuple[bool, Optional[str]]:
    """
    Send an email via configured SMTP server using standard library smtplib.

    Returns:
        (success: bool, error_message: Optional[str])
    """
    settings = get_settings()

    if not settings.smtp_host:
        logger.info("SMTP host is not configured. Email dispatch skipped.")
        return False, "SMTP server is not configured."

    sanitized_to = sanitize_header(to_email)
    if not is_valid_email(sanitized_to):
        return False, f"Invalid recipient email address: '{sanitized_to}'"

    sanitized_subject = sanitize_header(subject) or "Message from Ayush Patel Portfolio"
    from_email = (
        sanitize_header(settings.smtp_from_email)
        or sanitize_header(settings.smtp_username)
        or "noreply@ayushpatel.dev"
    )
    from_name = sanitize_header(settings.smtp_from_name) or "Ayush Patel Portfolio"

    msg = MIMEMultipart("alternative")
    msg["Subject"] = Header(sanitized_subject, "utf-8")
    msg["From"] = formataddr((from_name, from_email))
    msg["To"] = sanitized_to

    # Attach plain text
    part_text = MIMEText(body_text, "plain", "utf-8")
    msg.attach(part_text)

    # Attach optional HTML
    if body_html:
        part_html = MIMEText(body_html, "html", "utf-8")
        msg.attach(part_html)

    timeout = 10  # 10 seconds timeout

    try:
        if settings.smtp_port == 465:
            server = smtplib.SMTP_SSL(settings.smtp_host, settings.smtp_port, timeout=timeout)
        else:
            server = smtplib.SMTP(settings.smtp_host, settings.smtp_port, timeout=timeout)
            if settings.smtp_use_tls:
                server.starttls()

        if settings.smtp_username and settings.smtp_password:
            server.login(settings.smtp_username, settings.smtp_password)

        server.send_message(msg)
        server.quit()
        logger.info("Email successfully dispatched to %s with subject '%s'", sanitized_to, sanitized_subject)
        return True, None

    except smtplib.SMTPAuthenticationError:
        logger.error("SMTP Authentication Error while connecting to %s:%s", settings.smtp_host, settings.smtp_port)
        return False, "SMTP authentication failed. Please verify username and app password."

    except (smtplib.SMTPConnectError, TimeoutError, OSError) as e:
        logger.error("SMTP Connection Error to %s:%s - %s", settings.smtp_host, settings.smtp_port, type(e).__name__)
        return False, f"Failed to connect to SMTP server ({settings.smtp_host}:{settings.smtp_port})."

    except smtplib.SMTPException as e:
        logger.error("SMTP Protocol Error: %s", type(e).__name__)
        return False, f"SMTP protocol error: {type(e).__name__}"

    except Exception as e:
        logger.error("Unexpected error during email dispatch: %s", type(e).__name__)
        return False, f"Failed to send email: {type(e).__name__}"

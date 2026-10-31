import html
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


def generate_visitor_confirmation_content(
    name: str,
    subject: Optional[str] = None,
    message: Optional[str] = None,
    portfolio_url: Optional[str] = None,
) -> Tuple[str, str, str]:
    """
    Generate the subject, plain-text fallback, and polished HTML confirmation email
    for a portfolio visitor.

    Returns:
        (email_subject: str, text_body: str, html_body: str)
    """
    settings = get_settings()
    clean_name = (name or "there").strip()
    clean_subject = (subject or "General Inquiry").strip()
    clean_message = (message or "").strip()
    clean_url = (portfolio_url or settings.portfolio_url).strip()

    email_subject = f"Thank you for reaching out, {clean_name}! | Ayush Patel"

    # Plain text fallback
    text_body = (
        f"Hello {clean_name},\n\n"
        f"Thank you for reaching out and contacting me. I have successfully received your message "
        f"and will review it shortly. I will get back to you as soon as possible.\n\n"
        f"--- Summary of Your Inquiry ---\n"
        f"Subject: {clean_subject}\n"
        f"Message:\n{clean_message}\n"
        f"-------------------------------\n\n"
        f"In the meantime, feel free to explore my latest software development and data analysis work:\n"
        f"{clean_url}\n\n"
        f"Best regards,\n"
        f"Ayush Patel | Python Developer & Data Analyst\n"
        f"Portfolio: {clean_url}\n"
        f"LinkedIn: https://www.linkedin.com/in/ayushcodespy\n"
        f"GitHub: https://github.com/Ayushcodespy\n"
        f"Email: ayush.jnv54@gmail.com\n"
    )

    # HTML Escaping for injection safety
    safe_name = html.escape(clean_name)
    safe_subject = html.escape(clean_subject)
    safe_message = html.escape(clean_message).replace("\n", "<br>")
    safe_url = html.escape(clean_url)

    # Futuristic Dark Theme HTML Email
    html_body = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{html.escape(email_subject)}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0A0A0A; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #F5F7FA;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #0A0A0A; padding: 32px 16px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #12161A; border: 1px solid #26333A; border-radius: 16px; overflow: hidden; box-shadow: 0 16px 40px rgba(0, 0, 0, 0.6);">
          
          <!-- Top Gradient Accent Bar (Cerulean to Neon Rose) -->
          <tr>
            <td style="height: 4px; background: linear-gradient(90deg, #007BA7 0%, #00A6DB 50%, #FF2D95 100%);"></td>
          </tr>

          <!-- Header Section -->
          <tr>
            <td style="padding: 32px 32px 20px 32px; border-bottom: 1px solid #1E272D;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td>
                    <!-- Brand Identifier -->
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="vertical-align: middle;">
                          <div style="width: 44px; height: 44px; border-radius: 12px; background: linear-gradient(135deg, rgba(0, 123, 167, 0.2) 0%, rgba(255, 45, 149, 0.2) 100%); border: 1px solid #00A6DB; text-align: center; line-height: 44px; font-weight: 800; color: #00A6DB; font-size: 16px; letter-spacing: 0.5px;">
                            AP
                          </div>
                        </td>
                        <td style="padding-left: 14px; vertical-align: middle;">
                          <div style="font-size: 17px; font-weight: 700; color: #F5F7FA; letter-spacing: 0.5px; text-transform: uppercase;">
                            Ayush Patel
                          </div>
                          <div style="font-size: 12px; font-weight: 500; color: #00A6DB; letter-spacing: 0.3px;">
                            Python Developer &bull; Data Analyst
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td align="right" style="vertical-align: middle;">
                    <span style="display: inline-block; padding: 4px 10px; border-radius: 999px; background: rgba(0, 166, 219, 0.1); border: 1px solid rgba(0, 166, 219, 0.3); font-size: 11px; font-weight: 600; color: #38BDF8;">
                      Received &bull; Inquiry
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 32px 32px 24px 32px;">
              <h1 style="margin: 0 0 16px 0; font-size: 22px; font-weight: 700; color: #F5F7FA; line-height: 1.3;">
                Thank you for reaching out!
              </h1>
              
              <p style="margin: 0 0 18px 0; font-size: 15px; color: #CBD5E1; line-height: 1.6;">
                Hello <strong style="color: #F5F7FA;">{safe_name}</strong>,
              </p>

              <p style="margin: 0 0 24px 0; font-size: 15px; color: #CBD5E1; line-height: 1.6;">
                Thank you for reaching out and contacting me. I have successfully received your message and will review it shortly. I will get back to you as soon as possible.
              </p>

              <!-- Message Summary Glass Card -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #0E1317; border: 1px solid #26333A; border-left: 4px solid #00A6DB; border-radius: 10px; margin: 0 0 28px 0;">
                <tr>
                  <td style="padding: 18px 20px;">
                    <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; color: #00A6DB; margin-bottom: 8px;">
                      Your Message Summary
                    </div>
                    <div style="font-size: 14px; font-weight: 600; color: #F5F7FA; margin-bottom: 8px;">
                      Subject: <span style="font-weight: 400; color: #CBD5E1;">{safe_subject}</span>
                    </div>
                    <div style="font-size: 13px; color: #94A3B8; line-height: 1.55;">
                      {safe_message}
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Portfolio CTA Button -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin: 0 0 28px 0;">
                <tr>
                  <td align="center" style="border-radius: 10px; background: linear-gradient(135deg, #007BA7 0%, #00A6DB 50%, #FF2D95 100%);">
                    <a href="{safe_url}" target="_blank" style="display: inline-block; padding: 13px 28px; font-size: 14px; font-weight: 600; color: #FFFFFF; text-decoration: none; border-radius: 10px; letter-spacing: 0.3px;">
                      Explore My Portfolio &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Closing Sign-off -->
              <div style="border-top: 1px solid #1E272D; padding-top: 20px;">
                <p style="margin: 0 0 4px 0; font-size: 14px; color: #CBD5E1;">
                  Best regards,
                </p>
                <p style="margin: 0; font-size: 15px; font-weight: 700; color: #F5F7FA;">
                  Ayush Patel
                </p>
                <p style="margin: 2px 0 12px 0; font-size: 12px; color: #00A6DB; font-weight: 500;">
                  Python Developer &bull; Data Analyst
                </p>

                <!-- Social Links -->
                <p style="margin: 0; font-size: 12px; color: #8B98A5;">
                  <a href="mailto:ayush.jnv54@gmail.com" style="color: #38BDF8; text-decoration: none; margin-right: 12px;">ayush.jnv54@gmail.com</a>
                  <a href="https://www.linkedin.com/in/ayushcodespy" style="color: #38BDF8; text-decoration: none; margin-right: 12px;">LinkedIn</a>
                  <a href="https://github.com/Ayushcodespy" style="color: #38BDF8; text-decoration: none;">GitHub</a>
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer Bar -->
          <tr>
            <td style="padding: 20px 32px; background-color: #0A0D10; border-top: 1px solid #1E272D; text-align: center;">
              <p style="margin: 0; font-size: 11px; color: #64748B; line-height: 1.5;">
                This is an automated confirmation verifying receipt of your contact message on
                <a href="{safe_url}" style="color: #00A6DB; text-decoration: none;">ayushcodespy.vercel.app</a>.
                I will respond to you directly from my email shortly.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>"""

    return email_subject, text_body, html_body


def send_visitor_confirmation(
    visitor_email: str,
    visitor_name: str,
    message_subject: Optional[str] = None,
    message_text: Optional[str] = None,
    portfolio_url: Optional[str] = None,
) -> Tuple[bool, Optional[str]]:
    """
    Send an automated confirmation email to a portfolio visitor after their message
    is saved.
    """
    if not is_valid_email(visitor_email):
        return False, f"Invalid visitor email address: '{visitor_email}'"

    subject, body_text, body_html = generate_visitor_confirmation_content(
        name=visitor_name,
        subject=message_subject,
        message=message_text,
        portfolio_url=portfolio_url,
    )

    return send_email(
        to_email=visitor_email,
        subject=subject,
        body_text=body_text,
        body_html=body_html,
    )


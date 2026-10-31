import unittest
from unittest.mock import patch, MagicMock

from app.core.email import (
    generate_visitor_confirmation_content,
    send_visitor_confirmation,
    is_valid_email,
)
from app.database.session import SessionLocal
from app.models.contact_message import ContactMessage
from app.schemas.contact_message import ContactMessageCreate
from app.routes.contact import create_contact_message


class TestContactConfirmation(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.db = SessionLocal()

    @classmethod
    def tearDownClass(cls):
        cls.db.close()

    def test_01_template_content_and_styling(self):
        """Verify subject, greeting, required thank-you text, styling tokens, and closing."""
        subject, text_body, html_body = generate_visitor_confirmation_content(
            name="Sarah Connor",
            subject="Collaboration on AI Project",
            message="Hi Ayush, let's discuss a Python FastAPI collaboration.",
            portfolio_url="https://ayushcodespy.vercel.app",
        )

        # Subject verification
        self.assertIn("Sarah Connor", subject)
        self.assertIn("Ayush Patel", subject)

        # Plain text verification
        self.assertIn("Hello Sarah Connor", text_body)
        self.assertIn(
            "Thank you for reaching out and contacting me. I have successfully received your message and will review it shortly. I will get back to you as soon as possible.",
            text_body,
        )
        self.assertIn("Collaboration on AI Project", text_body)
        self.assertIn("Best regards,", text_body)
        self.assertIn("Ayush Patel | Python Developer & Data Analyst", text_body)
        self.assertIn("https://ayushcodespy.vercel.app", text_body)

        # HTML Theme styling verification
        self.assertIn("#0A0A0A", html_body)  # Jet Black
        self.assertIn("#007BA7", html_body)  # Cerulean Blue
        self.assertIn("#FF2D95", html_body)  # Neon Rose
        self.assertIn("Sarah Connor", html_body)
        self.assertIn("Collaboration on AI Project", html_body)
        self.assertIn("Python Developer &bull; Data Analyst", html_body)
        self.assertIn("https://ayushcodespy.vercel.app", html_body)

    def test_02_html_escaping_prevents_injection(self):
        """Verify user input is safely escaped in HTML email."""
        malicious_name = '<script>alert("hack")</script>'
        malicious_msg = '<b>Bold text</b> & <img src=x onerror=alert(1)>'
        _, _, html_body = generate_visitor_confirmation_content(
            name=malicious_name,
            subject="Test Injection",
            message=malicious_msg,
        )

        self.assertNotIn("<script>", html_body)
        self.assertIn("&lt;script&gt;alert(&quot;hack&quot;)&lt;/script&gt;", html_body)
        self.assertNotIn("<img src=x", html_body)
        self.assertIn("&lt;img src=x onerror=alert(1)&gt;", html_body)

    def test_03_send_visitor_confirmation_validates_email(self):
        """Verify invalid email returns error without calling send_email."""
        with patch("app.core.email.send_email") as mock_send:
            success, err = send_visitor_confirmation(
                visitor_email="not-an-email",
                visitor_name="Test",
            )
            self.assertFalse(success)
            self.assertIn("Invalid visitor email address", err)
            mock_send.assert_not_called()

    @patch("app.routes.contact.send_email")
    @patch("app.routes.contact.send_visitor_confirmation")
    def test_04_create_contact_message_dispatches_both_emails(self, mock_visitor_confirm, mock_admin_send):
        """Verify contact message saves to DB and triggers both admin notification and visitor confirmation."""
        mock_admin_send.return_value = (True, None)
        mock_visitor_confirm.return_value = (True, None)

        payload = ContactMessageCreate(
            name="John Developer",
            email="john@example.com",
            subject="FastAPI Backend Inquiry",
            message="Looking for a Python backend engineer for our project.",
        )

        saved = create_contact_message(payload, db=self.db)
        self.assertIsNotNone(saved.id)
        self.assertEqual(saved.name, "John Developer")
        self.assertEqual(saved.email, "john@example.com")

        # Verify visitor confirmation email was called with correct parameters
        mock_visitor_confirm.assert_called_once()
        call_kwargs = mock_visitor_confirm.call_args[1]
        self.assertEqual(call_kwargs["visitor_email"], "john@example.com")
        self.assertEqual(call_kwargs["visitor_name"], "John Developer")
        self.assertEqual(call_kwargs["message_subject"], "FastAPI Backend Inquiry")
        self.assertEqual(call_kwargs["message_text"], "Looking for a Python backend engineer for our project.")

    @patch("app.routes.contact.send_email", return_value=(False, "SMTP Timeout"))
    @patch("app.routes.contact.send_visitor_confirmation", side_effect=Exception("Network Down"))
    def test_05_graceful_failure_handling(self, mock_visitor_confirm, mock_admin_send):
        """Verify that email errors do not prevent message from saving or fail the request."""
        payload = ContactMessageCreate(
            name="Resilient Visitor",
            email="resilient@example.com",
            subject="Test Failure Resilience",
            message="The database record must be safely persisted even if SMTP fails.",
        )

        saved = create_contact_message(payload, db=self.db)
        self.assertIsNotNone(saved.id)
        self.assertEqual(saved.name, "Resilient Visitor")

        # Confirm persisted in DB
        db_record = self.db.get(ContactMessage, saved.id)
        self.assertIsNotNone(db_record)
        self.assertEqual(db_record.email, "resilient@example.com")


if __name__ == "__main__":
    unittest.main()


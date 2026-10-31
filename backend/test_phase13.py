import unittest
from unittest.mock import patch, MagicMock
from fastapi import HTTPException

from app.core.email import sanitize_header, is_valid_email
from app.database.session import SessionLocal
from app.models.contact_message import ContactMessage
from app.models.admin_user import AdminUser
from app.schemas.contact_message import ContactMessageCreate
from app.schemas.admin import MessageReplyInput
from app.routes.contact import create_contact_message
from app.routes.admin import reply_to_message


class TestPhase13(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.db = SessionLocal()

        # Ensure admin user exists
        admin = cls.db.query(AdminUser).filter(AdminUser.username == "testadmin_phase13").first()
        if not admin:
            admin = AdminUser(
                username="testadmin_phase13",
                password_hash="testhash",
                is_active=True,
            )
            cls.db.add(admin)
            cls.db.commit()
            cls.db.refresh(admin)
        cls.admin = admin

    @classmethod
    def tearDownClass(cls):
        cls.db.close()

    def test_01_header_sanitization(self):
        """Verify CRLF characters are removed to prevent email header injection."""
        malicious = "Subject\r\nBcc: victim@example.com\r\nAnotherLine"
        cleaned = sanitize_header(malicious)
        self.assertNotIn("\r", cleaned)
        self.assertNotIn("\n", cleaned)
        self.assertEqual(cleaned, "Subject Bcc: victim@example.com AnotherLine")
        self.assertTrue(is_valid_email("ayush@example.com"))
        self.assertFalse(is_valid_email("not-an-email"))

    def test_02_contact_message_persistence(self):
        """Verify contact message persists to SQLite even without active SMTP."""
        payload = ContactMessageCreate(
            name="Jane Tester",
            email="jane@example.com",
            subject="Phase 13 Inbound Test",
            message="Testing reliable database persistence for contact inquiries.",
        )
        saved = create_contact_message(payload, db=self.db)
        self.assertIsNotNone(saved.id)
        self.assertEqual(saved.name, "Jane Tester")
        self.assertEqual(saved.email, "jane@example.com")
        self.assertEqual(saved.status, "new")

        # Verify in DB
        db_msg = self.db.get(ContactMessage, saved.id)
        self.assertIsNotNone(db_msg)
        self.assertEqual(db_msg.name, "Jane Tester")

    def test_03_admin_reply_success_workflow(self):
        """Verify successful reply dispatches email and updates status to 'replied'."""
        msg = ContactMessage(
            name="Alice",
            email="alice@example.com",
            subject="Project Discussion",
            message="Let's build something awesome.",
            status="new",
        )
        self.db.add(msg)
        self.db.commit()
        self.db.refresh(msg)

        reply_payload = MessageReplyInput(
            subject="Re: Project Discussion",
            message="Hi Alice, thank you for reaching out! I'd love to chat.",
        )

        with patch("app.routes.admin.send_email", return_value=(True, None)) as mock_send:
            result = reply_to_message(
                message_id=msg.id,
                payload=reply_payload,
                admin=self.admin,
                db=self.db,
            )
            self.assertTrue(result["success"])
            self.assertEqual(result["status"], "replied")
            mock_send.assert_called_once_with(
                to_email="alice@example.com",
                subject="Re: Project Discussion",
                body_text="Hi Alice, thank you for reaching out! I'd love to chat.",
            )

            # Check DB status
            self.db.refresh(msg)
            self.assertEqual(msg.status, "replied")

    def test_04_admin_reply_failure_preserves_status(self):
        """Verify failed email dispatch raises 502 and does NOT mark as replied."""
        msg = ContactMessage(
            name="Bob",
            email="bob@example.com",
            subject="Bug Report",
            message="Found an issue.",
            status="new",
        )
        self.db.add(msg)
        self.db.commit()
        self.db.refresh(msg)

        reply_payload = MessageReplyInput(
            subject="Re: Bug Report",
            message="Investigating now.",
        )

        with patch("app.routes.admin.send_email", return_value=(False, "Connection timed out")) as mock_send:
            with self.assertRaises(HTTPException) as ctx:
                reply_to_message(
                    message_id=msg.id,
                    payload=reply_payload,
                    admin=self.admin,
                    db=self.db,
                )

            self.assertEqual(ctx.exception.status_code, 502)
            self.assertIn("Email dispatch failed", ctx.exception.detail)

            # Check status was preserved
            self.db.refresh(msg)
            self.assertEqual(msg.status, "new")

    def test_05_admin_reply_missing_message(self):
        """Verify 404 is raised when replying to a non-existent message ID."""
        reply_payload = MessageReplyInput(
            subject="Re: None",
            message="Test message",
        )
        with self.assertRaises(HTTPException) as ctx:
            reply_to_message(
                message_id=9999999,
                payload=reply_payload,
                admin=self.admin,
                db=self.db,
            )
        self.assertEqual(ctx.exception.status_code, 404)


if __name__ == "__main__":
    unittest.main()

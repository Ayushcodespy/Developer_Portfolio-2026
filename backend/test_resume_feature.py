import unittest
from pydantic import ValidationError
from app.database.session import SessionLocal
from app.models.admin_user import AdminUser
from app.models.setting import SiteSetting, DEFAULT_RESUME_URL
from app.schemas.admin import ResumeSettingInput
from app.routes.settings import get_public_resume
from app.routes.admin import get_admin_resume, update_admin_resume


class TestResumeFeature(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.db = SessionLocal()

        # Ensure admin user exists
        admin = cls.db.query(AdminUser).filter(AdminUser.username == "admin").first()
        if not admin:
            admin = AdminUser(
                username="admin",
                password_hash="testhash",
                is_active=True,
            )
            cls.db.add(admin)
            cls.db.commit()
            cls.db.refresh(admin)
        cls.admin = admin

    @classmethod
    def tearDownClass(cls):
        # Reset resume URL to canonical default after tests
        setting = cls.db.query(SiteSetting).filter(SiteSetting.key == "resume_url").first()
        if setting:
            setting.value = DEFAULT_RESUME_URL
            cls.db.commit()
        cls.db.close()

    def test_01_public_and_admin_return_resume_url(self):
        """Test both public and admin routes return the active resume URL."""
        pub_res = get_public_resume(db=self.db)
        self.assertIn("resume_url", pub_res)
        self.assertTrue(pub_res["resume_url"].startswith("http"))

        admin_res = get_admin_resume(admin=self.admin, db=self.db)
        self.assertIn("resume_url", admin_res)
        self.assertEqual(admin_res["resume_url"], pub_res["resume_url"])

    def test_02_admin_can_update_and_persist_resume_url(self):
        """Test updating resume URL via admin route and verifying database persistence."""
        new_url = "https://drive.google.com/file/d/test-updated-resume-abc123/view?usp=sharing"
        payload = ResumeSettingInput(resume_url=new_url)
        update_res = update_admin_resume(payload=payload, admin=self.admin, db=self.db)

        self.assertTrue(update_res.get("success"))
        self.assertEqual(update_res["resume_url"], new_url)

        # Verify admin GET returns the new URL
        admin_get = get_admin_resume(admin=self.admin, db=self.db)
        self.assertEqual(admin_get["resume_url"], new_url)

        # Verify public GET dynamically returns the new URL
        pub_get = get_public_resume(db=self.db)
        self.assertEqual(pub_get["resume_url"], new_url)

    def test_03_url_validation(self):
        """Test URL validation on backend."""
        # Empty string
        with self.assertRaises(ValidationError):
            ResumeSettingInput(resume_url="   ")

        # Non http/https protocol
        with self.assertRaises(ValidationError):
            ResumeSettingInput(resume_url="ftp://files.example.com/cv.pdf")

        # Plain text without protocol
        with self.assertRaises(ValidationError):
            ResumeSettingInput(resume_url="just-a-plain-string")

        # Valid Google Drive link
        valid_drive = ResumeSettingInput(
            resume_url="https://drive.google.com/file/d/138oZq3lHvm-3PsaHVz7hmR0SrOmvs_1G/view?usp=sharing"
        )
        self.assertEqual(
            valid_drive.resume_url,
            "https://drive.google.com/file/d/138oZq3lHvm-3PsaHVz7hmR0SrOmvs_1G/view?usp=sharing",
        )

        # Valid direct PDF link
        valid_pdf = ResumeSettingInput(resume_url="https://example.com/docs/ayush-resume.pdf")
        self.assertEqual(valid_pdf.resume_url, "https://example.com/docs/ayush-resume.pdf")

    def test_04_reupdate_and_restore_default(self):
        """Test updating to another URL and then restoring to canonical default."""
        pdf_url = "https://example.com/ayush-patel-resume.pdf"
        res1 = update_admin_resume(payload=ResumeSettingInput(resume_url=pdf_url), admin=self.admin, db=self.db)
        self.assertEqual(res1["resume_url"], pdf_url)

        # Confirm public route receives it
        self.assertEqual(get_public_resume(db=self.db)["resume_url"], pdf_url)

        # Reset back to default
        res2 = update_admin_resume(
            payload=ResumeSettingInput(resume_url=DEFAULT_RESUME_URL),
            admin=self.admin,
            db=self.db,
        )
        self.assertEqual(res2["resume_url"], DEFAULT_RESUME_URL)
        self.assertEqual(get_public_resume(db=self.db)["resume_url"], DEFAULT_RESUME_URL)


if __name__ == "__main__":
    unittest.main()

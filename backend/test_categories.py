import unittest
from pydantic import ValidationError
from app.database.session import SessionLocal
from app.models.admin_user import AdminUser
from app.models.project import Project
from app.models.skill import Skill
from app.schemas.admin import ProjectInput, SkillInput
from app.routes.projects import get_projects
from app.routes.skills import get_skills
from app.routes.admin import create_resource, update_resource, delete_resource

class TestCategoriesFeature(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.db = SessionLocal()
        cls.admin = cls.db.query(AdminUser).filter(AdminUser.username == "admin").first()

    @classmethod
    def tearDownClass(cls):
        # Clean up test records
        cls.db.query(Project).filter(Project.title.like("Test Category%")).delete()
        cls.db.query(Skill).filter(Skill.name.like("TestSkill%")).delete()
        cls.db.commit()
        cls.db.close()

    def test_01_public_projects_filter(self):
        """Verify get_projects filters by category properly."""
        all_projs = get_projects(category=None, db=self.db)
        self.assertGreater(len(all_projs), 0)

        dev_projs = get_projects(category="Development", db=self.db)
        self.assertGreater(len(dev_projs), 0)
        for p in dev_projs:
            self.assertEqual(p.category, "Development")

        da_projs = get_projects(category="Data Analysis", db=self.db)
        for p in da_projs:
            self.assertEqual(p.category, "Data Analysis")

    def test_02_public_skills_filter(self):
        """Verify get_skills filters by category properly."""
        all_skills = get_skills(category=None, db=self.db)
        self.assertGreater(len(all_skills), 0)

        dev_skills = get_skills(category="Development", db=self.db)
        self.assertGreater(len(dev_skills), 0)
        for s in dev_skills:
            self.assertIn(s.category, ["Development", "Both"])

        da_skills = get_skills(category="Data Analysis", db=self.db)
        self.assertGreater(len(da_skills), 0)
        for s in da_skills:
            self.assertIn(s.category, ["Data Analysis", "Both"])
        da_names = [s.name for s in da_skills]
        self.assertTrue(any(n in da_names for n in ["SQL", "Pandas", "NumPy", "MS Excel"]))

    def test_03_admin_project_crud_with_category(self):
        """Verify Admin can create, edit and delete projects with Development and Data Analysis."""
        payload_da = {
            "title": "Test Category Customer Churn Analysis",
            "subtitle": "Predictive ML & EDA",
            "description": "Exploratory data analysis and predictive churn models with Pandas.",
            "category": "Data Analysis",
            "technologies": ["Python", "Pandas", "Matplotlib", "Seaborn"],
            "features": ["EDA", "Data Cleaning"],
            "image_url": "https://example.com/churn.webp",
            "github_url": "https://github.com/example/churn",
            "featured": False,
            "display_order": 99,
        }
        created = create_resource(
            resource="projects",
            payload=payload_da,
            admin=self.admin,
            db=self.db,
        )
        self.assertEqual(created.category, "Data Analysis")
        self.assertEqual(created.title, payload_da["title"])
        proj_id = created.id

        # Check in get_projects with category='Data Analysis'
        da_projs = get_projects(category="Data Analysis", db=self.db)
        self.assertTrue(any(p.id == proj_id for p in da_projs))

        # Update category to Development and edit fields
        update_payload = {
            "title": "Test Category Customer Churn Analysis (Updated)",
            "description": "Updated description preserving all fields.",
            "category": "Development",
            "technologies": ["FastAPI", "React"],
            "features": ["REST APIs"],
            "image_url": "https://example.com/churn.webp",
            "github_url": "https://github.com/example/churn",
            "display_order": 99,
        }
        updated = update_resource(
            resource="projects",
            item_id=proj_id,
            payload=update_payload,
            admin=self.admin,
            db=self.db,
        )
        self.assertEqual(updated.category, "Development")
        self.assertEqual(updated.title, update_payload["title"])

        # Delete project
        resp = delete_resource(
            resource="projects",
            item_id=proj_id,
            admin=self.admin,
            db=self.db,
        )
        self.assertEqual(resp.status_code, 204)

    def test_04_admin_skill_crud_with_category(self):
        """Verify Admin can create skills for either Development or Data Analysis."""
        payload_skill = {
            "name": "TestSkill Power BI",
            "category": "Data Analysis",
            "display_order": 50,
        }
        created = create_resource(
            resource="skills",
            payload=payload_skill,
            admin=self.admin,
            db=self.db,
        )
        self.assertEqual(created.category, "Data Analysis")
        skill_id = created.id

        # Check in get_skills with category='Data Analysis'
        da_skills = get_skills(category="Data Analysis", db=self.db)
        self.assertTrue(any(s.id == skill_id for s in da_skills))

        # Update category to Development
        updated = update_resource(
            resource="skills",
            item_id=skill_id,
            payload={
                "name": "TestSkill Power BI Embedded",
                "category": "Development",
                "display_order": 51,
            },
            admin=self.admin,
            db=self.db,
        )
        self.assertEqual(updated.category, "Development")

        # Delete skill
        resp = delete_resource(
            resource="skills",
            item_id=skill_id,
            admin=self.admin,
            db=self.db,
        )
        self.assertEqual(resp.status_code, 204)

    def test_05_category_validation(self):
        """Verify backend rejects invalid category inputs and accepts valid ones."""
        with self.assertRaises(ValidationError):
            ProjectInput(
                title="Invalid",
                description="Invalid",
                category="RandomInvalidCategory"
            )

        with self.assertRaises(ValidationError):
            SkillInput(
                name="Invalid",
                category="RandomInvalidCategory"
            )

        # Valid cases
        p1 = ProjectInput(title="P", description="D", category="Development")
        self.assertEqual(p1.category, "Development")
        p2 = ProjectInput(title="P", description="D", category="data analysis")
        self.assertEqual(p2.category, "Data Analysis")

        s1 = SkillInput(name="S", category="Data Analysis")
        self.assertEqual(s1.category, "Data Analysis")
        s2 = SkillInput(name="S", category="development")
        self.assertEqual(s2.category, "Development")


if __name__ == "__main__":
    unittest.main()

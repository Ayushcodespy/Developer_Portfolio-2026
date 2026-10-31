import json
import urllib.request
import urllib.error
import http.cookiejar
import sys

BASE_URL = "http://localhost:8000"

# Setup cookie-enabled opener
cj = http.cookiejar.CookieJar()
opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj))

def request(method, path, data=None, headers=None, use_cookie=True):
    if headers is None:
        headers = {}
    url = f"{BASE_URL}{path}"
    req_data = None
    if data is not None:
        req_data = json.dumps(data).encode("utf-8")
        headers["Content-Type"] = "application/json"
    
    req = urllib.request.Request(url, data=req_data, headers=headers, method=method)
    
    try:
        if use_cookie:
            resp = opener.open(req)
        else:
            resp = urllib.request.urlopen(req)
        body = resp.read().decode("utf-8")
        return resp.status, json.loads(body) if body else None, resp.headers
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8")
        try:
            parsed = json.loads(body)
        except Exception:
            parsed = body
        return e.code, parsed, e.headers


print("=" * 60)
print("RUNNING PHASE 9 BACKEND & ADMIN CMS END-TO-END VERIFICATION")
print("=" * 60)

# 1. TEST PROTECTED ROUTES REJECT UNAUTHENTICATED USERS
print("\n[TEST 1] Protected Routes Reject Unauthenticated Access:")
status, res, _ = request("GET", "/api/admin/me", use_cookie=False)
assert status == 401, f"Expected 401 for /api/admin/me, got {status}"
print("  ✓ GET /api/admin/me correctly returned 401")

status, res, _ = request("GET", "/api/admin/dashboard", use_cookie=False)
assert status == 401, f"Expected 401 for /api/admin/dashboard, got {status}"
print("  ✓ GET /api/admin/dashboard correctly returned 401")

status, res, _ = request("POST", "/api/admin/projects", data={"title": "Hack", "description": "test"}, use_cookie=False)
assert status == 401, f"Expected 401 for POST /api/admin/projects, got {status}"
print("  ✓ POST /api/admin/projects correctly returned 401")

status, res, _ = request("POST", "/api/admin/skills", data={"name": "Hack", "category": "tools"}, use_cookie=False)
assert status == 401, f"Expected 401 for POST /api/admin/skills, got {status}"
print("  ✓ POST /api/admin/skills correctly returned 401")


# 2. TEST AUTHENTICATION (LOGIN)
print("\n[TEST 2] Authentication:")
# Invalid login
status, res, _ = request("POST", "/api/admin/login", data={"username": "admin", "password": "wrongpassword"})
assert status == 401, f"Expected 401 for invalid login, got {status}"
print("  ✓ Failed login correctly returned 401")

# Successful login
status, res, headers = request("POST", "/api/admin/login", data={"username": "admin", "password": "Admin@123456"})
assert status == 200, f"Expected 200 for valid login, got {status}: {res}"
assert res.get("username") == "admin", "Username mismatch"
assert "password" not in res and "password_hash" not in res, "Password or hash exposed in response!"
print("  ✓ Login succeeded with safe AdminIdentity returned")

# Session verification
status, res, _ = request("GET", "/api/admin/me")
assert status == 200 and res.get("username") == "admin", f"Session check failed: {res}"
print("  ✓ GET /api/admin/me validated session cookie")

# Dashboard metrics verification
status, res, _ = request("GET", "/api/admin/dashboard")
assert status == 200, f"Dashboard metrics failed: {res}"
assert "projects" in res and "skills" in res and "experience" in res
print(f"  ✓ Dashboard metrics: {res}")


# 3. TEST PROJECT CRUD & PUBLIC REFLECTION
print("\n[TEST 3] Project CRUD & Public Reflection:")
# Create project
project_payload = {
    "title": "Phase 9 E2E Verification Project",
    "subtitle": "Admin CMS Test",
    "description": "Full end-to-end integration test of SQLite database and React public portfolio.",
    "category": "Full Stack",
    "technologies": ["FastAPI", "React", "SQLite", "TailwindCSS"],
    "features": ["Secure Admin CMS", "Live Public Reflection", "Scrypt Hashing"],
    "github_url": "https://github.com/example/e2e",
    "live_url": "https://example.com/e2e",
    "image_url": "https://example.com/project.webp",
    "featured": True,
    "display_order": 99,
}
status, created_project, _ = request("POST", "/api/admin/projects", data=project_payload)
assert status == 201, f"Create project failed: {created_project}"
project_id = created_project["id"]
print(f"  ✓ Admin created project ID {project_id}: '{created_project['title']}'")

# Verify in public GET /api/projects
status, public_projects, _ = request("GET", "/api/projects", use_cookie=False)
assert any(p["id"] == project_id for p in public_projects), "Project missing from public GET /api/projects"
print("  ✓ Public GET /api/projects immediately reflects new project in SQLite")

# Update project
update_payload = {
    "title": "Phase 9 E2E Project (Updated)",
    "description": "Updated project description to test mutation persistence.",
    "category": "AI / ML",
    "featured": False,
    "display_order": 5,
}
status, updated_project, _ = request("PUT", f"/api/admin/projects/{project_id}", data=update_payload)
assert status == 200 and updated_project["title"] == "Phase 9 E2E Project (Updated)"
print("  ✓ Admin updated project title and category")

# Verify public update
status, public_projects, _ = request("GET", "/api/projects", use_cookie=False)
match = next((p for p in public_projects if p["id"] == project_id), None)
assert match and match["title"] == "Phase 9 E2E Project (Updated)", "Public projects does not reflect updated title"
print("  ✓ Public GET /api/projects reflects updated project")

# Delete project
status, _, _ = request("DELETE", f"/api/admin/projects/{project_id}")
assert status == 204, f"Delete project failed: status {status}"
print("  ✓ Admin deleted project ID")

# Verify public removal
status, public_projects, _ = request("GET", "/api/projects", use_cookie=False)
assert not any(p["id"] == project_id for p in public_projects), "Deleted project still in public API!"
print("  ✓ Public GET /api/projects no longer contains deleted project")


# 4. TEST SKILL CRUD & PUBLIC REFLECTION
print("\n[TEST 4] Skill CRUD & Public Reflection:")
skill_payload = {"name": "Phase9-GraphQL-Test", "category": "frameworks", "display_order": 99}
status, created_skill, _ = request("POST", "/api/admin/skills", data=skill_payload)
assert status == 201, f"Create skill failed: {created_skill}"
skill_id = created_skill["id"]
print(f"  ✓ Admin created skill ID {skill_id}: '{created_skill['name']}'")

# Public reflection
status, public_skills, _ = request("GET", "/api/skills", use_cookie=False)
assert any(s["id"] == skill_id for s in public_skills), "Skill missing in public /api/skills"
print("  ✓ Public GET /api/skills reflects new skill")

# Update skill
status, updated_skill, _ = request("PUT", f"/api/admin/skills/{skill_id}", data={"name": "Phase9-GraphQL-Updated", "category": "tools", "display_order": 1})
assert status == 200 and updated_skill["name"] == "Phase9-GraphQL-Updated"
print("  ✓ Admin updated skill")

# Delete skill
status, _, _ = request("DELETE", f"/api/admin/skills/{skill_id}")
assert status == 204
status, public_skills, _ = request("GET", "/api/skills", use_cookie=False)
assert not any(s["id"] == skill_id for s in public_skills)
print("  ✓ Admin deleted skill and public API confirmed removal")


# 5. TEST EXPERIENCE CRUD & PUBLIC REFLECTION
print("\n[TEST 5] Experience CRUD & Public Reflection:")
exp_payload = {
    "company": "Test Innovators Inc",
    "role": "Lead Architect",
    "start_date": "Jan 2025",
    "end_date": "Present",
    "duration": "1 yr",
    "description": "Architected cloud services.",
    "responsibilities": ["Designed APIs", "Led engineering"],
    "technologies": ["Python", "FastAPI"],
    "display_order": 10
}
status, created_exp, _ = request("POST", "/api/admin/experience", data=exp_payload)
assert status == 201
exp_id = created_exp["id"]
print(f"  ✓ Admin created experience ID {exp_id}")

status, public_exp, _ = request("GET", "/api/experience", use_cookie=False)
assert any(e["id"] == exp_id for e in public_exp)
print("  ✓ Public GET /api/experience reflects new experience")

# Update experience
status, updated_exp, _ = request("PUT", f"/api/admin/experience/{exp_id}", data={
    "company": "Test Innovators Inc (Updated)",
    "role": "Principal Architect",
    "display_order": 1
})
assert status == 200

# Delete experience
status, _, _ = request("DELETE", f"/api/admin/experience/{exp_id}")
assert status == 204
status, public_exp, _ = request("GET", "/api/experience", use_cookie=False)
assert not any(e["id"] == exp_id for e in public_exp)
print("  ✓ Admin deleted experience and public API confirmed removal")


# 6. TEST EDUCATION CRUD & PUBLIC REFLECTION
print("\n[TEST 6] Education CRUD & Public Reflection:")
edu_payload = {
    "institution": "Stanford University Online",
    "degree": "Professional Certificate",
    "field": "Artificial Intelligence",
    "location": "Online",
    "start_year": "2024",
    "end_year": "2025",
    "cgpa": "4.0",
    "description": "Machine Learning, Deep Learning",
    "display_order": 2
}
status, created_edu, _ = request("POST", "/api/admin/education", data=edu_payload)
assert status == 201
edu_id = created_edu["id"]
print(f"  ✓ Admin created education ID {edu_id}")

status, public_edu, _ = request("GET", "/api/education", use_cookie=False)
assert any(e["id"] == edu_id for e in public_edu)
print("  ✓ Public GET /api/education reflects new education")

# Update & Delete
status, _, _ = request("PUT", f"/api/admin/education/{edu_id}", data={
    "institution": "Stanford University Online",
    "degree": "Master Certificate",
    "display_order": 2
})
assert status == 200

status, _, _ = request("DELETE", f"/api/admin/education/{edu_id}")
assert status == 204
status, public_edu, _ = request("GET", "/api/education", use_cookie=False)
assert not any(e["id"] == edu_id for e in public_edu)
print("  ✓ Admin deleted education and public API confirmed removal")


# 7. TEST CERTIFICATIONS CRUD & PUBLIC REFLECTION
print("\n[TEST 7] Certifications CRUD & Public Reflection:")
cert_payload = {
    "name": "AWS Certified Solutions Architect",
    "provider": "Amazon Web Services",
    "type": "Certification",
    "score": "920/1000",
    "credential_url": "https://aws.amazon.com/verify",
    "image_url": "https://example.com/badge.webp",
    "display_order": 5
}
status, created_cert, _ = request("POST", "/api/admin/certifications", data=cert_payload)
assert status == 201
cert_id = created_cert["id"]
print(f"  ✓ Admin created certification ID {cert_id}")

status, public_certs, _ = request("GET", "/api/certifications", use_cookie=False)
assert any(c["id"] == cert_id for c in public_certs)
print("  ✓ Public GET /api/certifications reflects new certification")

# Update & Delete
status, _, _ = request("PUT", f"/api/admin/certifications/{cert_id}", data={
    "name": "AWS Certified Solutions Architect - Associate",
    "provider": "Amazon Web Services",
    "display_order": 5
})
assert status == 200

status, _, _ = request("DELETE", f"/api/admin/certifications/{cert_id}")
assert status == 204
status, public_certs, _ = request("GET", "/api/certifications", use_cookie=False)
assert not any(c["id"] == cert_id for c in public_certs)
print("  ✓ Admin deleted certification and public API confirmed removal")


# 8. TEST CONTACT MESSAGES LIFECYCLE
print("\n[TEST 8] Contact Messages Lifecycle:")
msg_payload = {
    "name": "Alex Recruiter",
    "email": "alex@recruittech.org",
    "subject": "Interview Invitation",
    "message": "Hi Ayush, we reviewed your portfolio and would love to schedule a technical discussion."
}
# Submit publicly
status, created_msg, _ = request("POST", "/api/contact", data=msg_payload, use_cookie=False)
assert status == 200 or status == 201
msg_id = created_msg["id"]
print(f"  ✓ Public contact form submission succeeded, ID {msg_id}")

# Admin reads messages
status, admin_msgs, _ = request("GET", "/api/admin/messages")
assert status == 200
msg_found = next((m for m in admin_msgs if m["id"] == msg_id), None)
assert msg_found is not None, "Submitted message not found in admin inbox"
assert msg_found["status"] == "new"
print(f"  ✓ Admin retrieved inquiry ID {msg_id} with status 'new'")

# Update status to 'read'
status, updated_msg, _ = request("PATCH", f"/api/admin/messages/{msg_id}", data={"status": "read"})
assert status == 200 and updated_msg["status"] == "read"
print("  ✓ Status successfully updated to 'read'")

# Update status to 'replied'
status, updated_msg, _ = request("PATCH", f"/api/admin/messages/{msg_id}", data={"status": "replied"})
assert status == 200 and updated_msg["status"] == "replied"
print("  ✓ Status successfully updated to 'replied'")

# Delete message
status, _, _ = request("DELETE", f"/api/admin/messages/{msg_id}")
assert status == 204
status, admin_msgs, _ = request("GET", "/api/admin/messages")
assert not any(m["id"] == msg_id for m in admin_msgs)
print("  ✓ Admin deleted message and confirmed removal from SQLite")


# 9. TEST LOGOUT & POST-LOGOUT REJECTION
print("\n[TEST 9] Logout & Session Invalidation:")
status, _, _ = request("POST", "/api/admin/logout")
assert status == 204
print("  ✓ POST /api/admin/logout returned 204 and cleared session cookie")

# Verify subsequent request is rejected
status, res, _ = request("GET", "/api/admin/me")
assert status == 401, f"Expected 401 after logout, got {status}"
print("  ✓ Protected route /api/admin/me rejects request after logout")

print("\n" + "=" * 60)
print("ALL PHASE 9 END-TO-END VERIFICATION CHECKS PASSED SUCCESSFULLY!")
print("=" * 60)

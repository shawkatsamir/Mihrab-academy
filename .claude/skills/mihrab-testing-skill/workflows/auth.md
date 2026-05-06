## Student Login Flow

1a. Successful Login
```bash
playwright-cli -s=mihrab-student goto <BASE_URL>/auth/login
playwright-cli -s=mihrab-student screenshot --filename=auth-login-start.png
playwright-cli -s=mihrab-student snapshot

# Identify email, password inputs and submit button refs from snapshot

playwright-cli -s=mihrab-student fill <email-ref> "student@mihrab.test"
playwright-cli -s=mihrab-student fill <password-ref> "MVPtest123!"
playwright-cli -s=mihrab-student click <submit-ref>

# Login triggers a full page reload (window.location.href) — wait for navigation to settle

playwright-cli -s=mihrab-student snapshot

# Assert: admin → /dashboard | all other roles → /sessions

playwright-cli -s=mihrab-student screenshot --filename=auth-login-pass.png
```

Expected: Admin redirects to /dashboard. Student/Teacher/Supervisor redirects to /sessions.
User name and role visible in nav (top right).

---

1b. Login with Wrong Password
```bash
playwright-cli -s=mihrab-student goto <BASE_URL>/auth/login
playwright-cli -s=mihrab-student fill <email-ref> "student@mihrab.test"
playwright-cli -s=mihrab-student fill <password-ref> "wrongpassword"
playwright-cli -s=mihrab-student click <submit-ref>
playwright-cli -s=mihrab-student snapshot
playwright-cli -s=mihrab-student screenshot --filename=auth-login-wrong-pass.png
```

Expected: Error message shown (e.g. "Invalid credentials"), stays on /auth/login.

---

1c. Registration — SKIP

Accounts are admin-provisioned only. `/auth/sign-up` immediately redirects to `/auth/login`.
Use pre-seeded staging users from `helpers/test-data.md` instead.

---

1d. Logout
```bash
# Assumes already logged in (mihrab-student session)

playwright-cli -s=mihrab-student snapshot

# Find logout button/link ref from snapshot

playwright-cli -s=mihrab-student click <logout-ref>
playwright-cli -s=mihrab-student snapshot
playwright-cli -s=mihrab-student screenshot --filename=auth-logout.png
```

Expected: Redirected to /auth/login.

---

1e. Password Reset
```bash
playwright-cli -s=mihrab-reset goto <BASE_URL>/auth/forgot-password
playwright-cli -s=mihrab-reset snapshot
playwright-cli -s=mihrab-reset fill <email-ref> "student@mihrab.test"
playwright-cli -s=mihrab-reset click <submit-ref>
playwright-cli -s=mihrab-reset snapshot
playwright-cli -s=mihrab-reset screenshot --filename=auth-reset-sent.png
```

Expected: Confirmation that reset email was sent.

---

**Assertions**:

- Admin: URL is /dashboard
- Non-admin (Student/Teacher/Supervisor): URL is /sessions
- No console errors: `playwright-cli console`

## When a Ref Is Missing

If `snapshot` doesn't show the expected element:

1. Wait 500ms: `playwright-cli eval "await new Promise(r=>setTimeout(r,500))"`
2. Re-snapshot: `playwright-cli snapshot`
3. Fallback to role selector: `playwright-cli click "role=button[name='Login']"`
4. If still missing: `playwright-cli screenshot --filename=missing-element.png` + report

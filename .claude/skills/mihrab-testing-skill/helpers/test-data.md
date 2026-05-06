# Test Credentials & Fixtures

Base URL
BASE_URL=http://localhost:3000

🔒 Never use real credentials. Create dedicated test accounts in your staging DB.

## Staging Users

| Role    | Email               | Password    | Notes                               |
| ------- | ------------------- | ----------- | ----------------------------------- |
| Student | student@mihrab.test | MVPtest123! | Redirects to /sessions after login  |
| Teacher | teacher@mihrab.test | MVPtest123! | Redirects to /sessions after login  |
| Admin   | admin@mihrab.test   | MVPtest123! | Redirects to /dashboard after login |

## Post-Login Routing

- **Admin** → `/dashboard`
- **Student / Teacher / Supervisor** → `/sessions`

## MVP Constraints

- Accounts are admin-provisioned — `/auth/sign-up` redirects to `/auth/login`
- No course data exists yet → expect empty states
- Profile updates are read-only in MVP
- No payment/subscription flows
- All API calls hit `https://api.mihrab.test` (staging)

## Session Tips

```bash
# Reuse login state across tests (always pair with a named session)
playwright-cli -s=mihrab-student state-save student-auth.json
playwright-cli -s=mihrab-student state-load student-auth.json
playwright-cli -s=mihrab-student goto <BASE_URL>/sessions

playwright-cli -s=mihrab-admin state-save admin-auth.json
playwright-cli -s=mihrab-admin state-load admin-auth.json
playwright-cli -s=mihrab-admin goto <BASE_URL>/dashboard
```

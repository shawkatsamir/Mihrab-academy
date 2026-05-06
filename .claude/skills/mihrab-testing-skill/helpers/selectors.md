# Locator Strategy for Mihrab

## Priority Order

1. **Refs from snapshot** → `click e15` (fastest, most accurate)
2. **Role-based** → `role=button[name="Login"]`
3. **Label/Input** → `getByLabel("Email")`
4. **Test IDs** → `getByTestId("nav-profile")` (add to React components when possible)
5. **CSS** → `.btn-primary` (last resort)

## Ref Rules

- Always run `snapshot` before noting refs
- Refs reset on navigation/reload
- Chain: `snapshot → note → act → snapshot`
- Never hardcode refs across sessions
- Never use `e#` without fresh snapshot context

## MVP-Specific Selectors

```bash
# Auth page — inputs use <Label htmlFor="..."> association, no aria-label on inputs
playwright-cli fill "getByLabel('Email')" "user@mihrab.test"
playwright-cli fill "getByLabel('Password')" "MVPtest123!"
playwright-cli click "role=button[name='Login']"

# Dashboard nav
playwright-cli click "role=link[name='Profile']"
playwright-cli click "role=button[name='Logout']"

# Profile page
playwright-cli snapshot | grep -i "avatar\|name\|email"
```

## Session Hygiene

After test completion:

```bash
# Close a specific named session
playwright-cli -s=mihrab-student close

# Close all active sessions between test suites
playwright-cli close-all

# Force-kill unresponsive browsers
playwright-cli kill-all

# List all active sessions
playwright-cli list
```

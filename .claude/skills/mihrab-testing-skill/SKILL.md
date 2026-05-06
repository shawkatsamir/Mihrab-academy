name: mihrab-testing
description: E2E testing for Mihrab Academy using Playwright.
license: MIT
category: testing
parent: playwright-cli
disable-model-invocation: false

You are a QA engineer testing Mihrab, an online school platform currently running
on a staging/local environment (no production domain yet). Use playwright-cli for
all browser automation.

capabilities:

- browser-automation
- auth-flows
- basic-navigation
- error-capture

1. Environment Setup
   Before starting any test, confirm the base URL with the user if not already provided.
   Common staging patterns:
   http://localhost:3000
   http://localhost:8000
   http://127.0.0.1:PORT

Check playwright-cli is available:
npx playwright-cli --help

# or if installed globally:

playwright-cli --help
If not installed:
npm install -g @playwright/cli@latest
playwright-cli install --skills

2. Session Strategy
   Always use named sessions so state persists across related test steps:

# Start a named session for the current test suite

playwright-cli -s=mihrab open <BASE_URL>

# Reuse the same session for follow-up commands

playwright-cli -s=mihrab goto <BASE_URL>/auth/login
Use separate sessions for different roles:

- s=mihrab-student → student/learner flows
- s=mihrab-instructor → instructor/teacher flows
- s=mihrab-admin → admin panel flows
  Save auth state after login to reuse across tests:
  playwright-cli -s=mihrab-student state-save student-auth.json
  playwright-cli -s=mihrab-student state-load student-auth.json

3. ## 🔄 Core Workflow Pattern
1. `playwright-cli snapshot` → get current refs
1. Note relevant refs (e.g., `e12: input email`, `e18: button login`)
1. `playwright-cli click e12` / `type "text"` / `press Enter`
1. `playwright-cli snapshot` → verify state changed
1. `playwright-cli screenshot` → capture results

## ✅ Best Practices

- Always use refs from fresh snapshots
- Chain commands in one prompt when possible
- Use `--headed` only for debugging
- Capture errors: `playwright-cli console` + `screenshot`

## Available Workflows

| File                | Purpose                           |
| ------------------- | --------------------------------- |
| `workflows/auth.md` | Login/logout, session persistence |

## Need a new workflow?

Ask: `"Create a workflow for [feature] using ref-based snapshots and MVP constraints"`

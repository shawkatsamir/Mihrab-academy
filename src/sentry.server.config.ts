import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,

  // Disable Sentry in dev to avoid blocking server requests on network calls
  // to the ingest endpoint.
  enabled: process.env.NODE_ENV === "production",

  sendDefaultPii: true,
  tracesSampleRate: 0.1,

  // Attach local variable values to stack frames for richer stack traces
  includeLocalVariables: true,

  enableLogs: true,
});

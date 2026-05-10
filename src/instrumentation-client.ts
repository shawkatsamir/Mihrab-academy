import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Disable Sentry in dev to avoid blocking the dev server with network calls
  // to the ingest endpoint (each ETIMEDOUT hangs requests ~30s).
  enabled: process.env.NODE_ENV === "production",

  sendDefaultPii: true,

  tracesSampleRate: 0.1,

  // Session Replay: 10% of all sessions, 100% of sessions with errors
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,

  enableLogs: true,

  integrations: [Sentry.replayIntegration()],
});

// Hook into App Router navigation transitions
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;

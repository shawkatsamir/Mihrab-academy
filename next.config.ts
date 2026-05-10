import type { NextConfig } from "next";
import createBundleAnalyzer from "@next/bundle-analyzer";
import { withSentryConfig } from "@sentry/nextjs";
import path from "path";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "recharts",
      "radix-ui",
      "date-fns",
      "react-day-picker",
      "sonner",
      "motion",
    ],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  webpack: (config, { isServer }) => {
    // Force client bundles to resolve `react` to the project's react@19.2.3
    // (which exports `useEffectEvent`), instead of Next.js's stale compiled
    // React. Required by Sanity Studio's structureTool. Server bundles still
    // use Next's compiled React for RSC.
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        react: path.resolve("./node_modules/react"),
        "react-dom": path.resolve("./node_modules/react-dom"),
      };
    }
    return config;
  },
};

const withBundleAnalyzer = createBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const wrapped = withBundleAnalyzer(nextConfig);

// Only wrap with Sentry in production builds. In dev, Sentry's webpack
// instrumentation adds significant compile overhead and its tunnel route
// causes ETIMEDOUT hangs when the ingest endpoint is unreachable.
export default process.env.NODE_ENV === "production"
  ? withSentryConfig(wrapped, {
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      authToken: process.env.SENTRY_AUTH_TOKEN,
      widenClientFileUpload: true,
      tunnelRoute: "/monitoring",
      silent: !process.env.CI,
    })
  : wrapped;

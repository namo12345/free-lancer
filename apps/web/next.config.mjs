import createNextIntlPlugin from "next-intl/plugin";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Monorepo root (two levels up from apps/web)
const monorepoRoot = path.join(__dirname, "../../");

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@hiresense/ui", "@hiresense/shared", "@hiresense/db"],

  // Keep Prisma as external so the engine binary is loaded at runtime (not bundled by webpack)
  serverExternalPackages: ["@prisma/client", "prisma"],

  // Set tracing root to monorepo root so cross-package files are reachable
  outputFileTracingRoot: monorepoRoot,

  // Include the Prisma generated client (with engine binary) in the serverless function bundle
  // Path is relative to outputFileTracingRoot (monorepo root)
  outputFileTracingIncludes: {
    "/**": [
      "packages/db/generated/client/**",
    ],
  },
};

export default withNextIntl(nextConfig);

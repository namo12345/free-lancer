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

  // Don't bundle Prisma — keep it as external so the engine binary is loaded at runtime
  serverExternalPackages: ["@prisma/client", "prisma"],

  // Set tracing root to monorepo root so pnpm node_modules are reachable
  outputFileTracingRoot: monorepoRoot,

  // Paths are relative to outputFileTracingRoot (monorepo root)
  // apps/web/.prisma/client is where `prisma generate` outputs the engine binary
  outputFileTracingIncludes: {
    "/**": [
      "apps/web/.prisma/client/**",
      "node_modules/.pnpm/@prisma+client@*/node_modules/.prisma/client/**",
      "node_modules/.pnpm/@prisma+client@*/node_modules/@prisma/client/**",
    ],
  },
};

export default withNextIntl(nextConfig);

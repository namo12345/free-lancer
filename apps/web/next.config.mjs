import createNextIntlPlugin from "next-intl/plugin";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@hiresense/ui", "@hiresense/shared", "@hiresense/db"],
  // Point tracing root to monorepo root so pnpm node_modules are visible
  outputFileTracingRoot: path.join(__dirname, "../../"),
  // Explicitly include the Prisma engine binary (output to apps/web/.prisma/client)
  outputFileTracingIncludes: {
    "/**": [
      ".prisma/client/**",
      "../../node_modules/.pnpm/@prisma+client@*/node_modules/.prisma/client/**",
      "../../node_modules/.pnpm/@prisma+client@*/node_modules/@prisma/client/**",
    ],
  },
};

export default withNextIntl(nextConfig);

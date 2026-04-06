import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@hiresense/ui", "@hiresense/shared", "@hiresense/db"],
  // Tell Vercel's bundler to include the Prisma engine binary
  outputFileTracingIncludes: {
    "/**": [
      "../../packages/db/node_modules/.prisma/client/**",
      "../../node_modules/.pnpm/@prisma+client@*/node_modules/.prisma/client/**",
      "../../node_modules/.pnpm/@prisma+client@*/node_modules/@prisma/client/**",
    ],
  },
};

export default withNextIntl(nextConfig);

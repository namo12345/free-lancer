import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@hiresense/ui", "@hiresense/shared", "@hiresense/db"],
};

export default withNextIntl(nextConfig);

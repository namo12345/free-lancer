import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@baseedwork/ui", "@baseedwork/shared", "@baseedwork/db"],
};

export default withNextIntl(nextConfig);

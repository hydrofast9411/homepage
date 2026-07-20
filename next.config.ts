import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    // We resize to fixed widths server-side at upload time (see lib/images.ts) and
    // serve the exact Supabase Storage URL directly, so Next's on-demand optimizer
    // is disabled — this avoids the Vercel Hobby 1,000-images/month optimization cap
    // as the product catalog grows. remotePatterns is kept for safety/typing only.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "wmxfomqysadfmbxequsx.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default withNextIntl(nextConfig);

import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

// Para IIS/Cloudflare Pages STATIC
const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  distDir: 'dist',
};

// Para server (Vercel/Docker)
// const nextConfig: NextConfig = {
//   output: 'standalone',
// };

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);

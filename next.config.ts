import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  async redirects() {
    return [
      {
        source: '/product-category/:slug*',
        destination: '/produkt-kategoria/:slug*',
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ngifengeshwvyzhqvprn.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'ngifengeshwvyzhqvprn.supabase.co',
        pathname: '/storage/v1/render/image/public/**',
      },
      {
        protocol: 'https',
        hostname: 'kochlik.netlify.app',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'kochlik.sk',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.kochlik.sk',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;

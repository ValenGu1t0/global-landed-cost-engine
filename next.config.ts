import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.slingacademy.com',
        port: ''
      },
      {
        protocol: 'https',
        hostname: 'storagehemibrands.blob.core.windows.net',
        port: ''
      }
    ]
  },
  transpilePackages: ['geist'],
  serverExternalPackages: ['exceljs']
};

export default nextConfig;

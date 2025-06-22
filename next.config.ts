
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Exclude Node.js core modules from client-side bundles
      // to prevent "Module not found" errors.
      config.resolve.fallback = {
        ...config.resolve.fallback,
        async_hooks: false, // Specifically for the error encountered.
        // Add other Node.js core modules here if similar errors appear:
        // fs: false,
        // net: false,
        // tls: false,
        // child_process: false,
        // vm: false, // Another module that can sometimes cause issues
      };
    }
    return config;
  },
};

export default nextConfig;

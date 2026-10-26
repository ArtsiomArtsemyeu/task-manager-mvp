import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  outputFileTracingExcludes: {
    '*': ['./docs/**/*'],
  },
};

export default nextConfig;

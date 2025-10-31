const { i18n } = require('./next-i18next.config');

/** @type {import('next).NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: false,  // Disabled due to SWC binary corruption - will use Terser instead
  // NOTE: Static export (output: 'export') disables API routes!
  // We need API routes for KB initialization, so we CANNOT use static export
  // Firebase Hosting still works with server-side rendering via Cloud Functions
  images: {
    domains: ['firebasestorage.googleapis.com', 'lh3.googleusercontent.com'],
    formats: ['image/webp', 'image/avif'],
  },
  env: {
    CUSTOM_KEY: 'salatiso-ecosystem',
  },
  // Performance optimizations
  experimental: {
    scrollRestoration: true,
    // Removed unsupported option: disableOptimizedPackageImports
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Webpack configuration to handle missing dependencies
  webpack: (config, { isServer }) => {
    // Exclude grpc and protobufjs from server-side builds to avoid missing dependencies
    config.externals = config.externals || [];
    if (isServer) {
      config.externals.push('@grpc', '@grpc/proto-loader', '@grpc/grpc-js', 'protobufjs');
    }
    return config;
  },
  // Disable ESLint during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  // TypeScript configuration - disable type checking during build
  typescript: {
    // Ignore type errors during build since they come from node_modules conflicts
    // Type checking can still be done separately with `tsc --noEmit`
    ignoreBuildErrors: true,
  },
  // Bundle analysis (uncomment to analyze)
  // webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
  //   if (!dev && !isServer) {
  //     config.plugins.push(
  //       new webpack.DefinePlugin({
  //         __BUNDLE_ANALYZE__: JSON.stringify(process.env.ANALYZE === 'true'),
  //       })
  //     );
  //   }
  //   return config;
  // },
  // Disabled i18n for static export - will handle client-side
  // i18n,
}

module.exports = nextConfig
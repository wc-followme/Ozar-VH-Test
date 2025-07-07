/** @type {import('next').NextConfig} */
const nextConfig = {
  // 🚀 Enable strict checking (REMOVED ignore flags for production safety)
  eslint: {
    dirs: ["app", "components", "lib", "hooks", "constants"], // Only lint these directories
    ignoreDuringBuilds: false, // Enable linting during builds
  },
  typescript: {
    ignoreBuildErrors: false, // Enable TypeScript error checking during builds
  },

  // 🚀 Performance optimizations
  images: {
    unoptimized: true,
  },

  // 🚀 Security and performance headers
  poweredByHeader: false,
  reactStrictMode: true,
  swcMinify: true,

  // 🚀 Experimental features for enterprise
  experimental: {
    optimizePackageImports: ["@radix-ui/react-icons", "lucide-react"],
    turbo: {
      rules: {
        "*.svg": {
          loaders: ["@svgr/webpack"],
          as: "*.js",
        },
      },
    },
  },

  // 🚀 Build optimizations
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? {
            exclude: ["error", "warn"],
          }
        : false,
  },

  // 🚀 Bundle analyzer setup (run with ANALYZE=true npm run build)
  ...(process.env.ANALYZE === "true" && {
    webpack: (config) => {
      const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: "static",
          openAnalyzer: true,
        })
      );
      return config;
    },
  }),
};

export default nextConfig;

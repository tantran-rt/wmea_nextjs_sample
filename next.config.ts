import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    // CRITICAL: Prevent webpack from analyzing dynamic imports in the embedded app
    // Mark any imports matching wmea path patterns as external
    if (!isServer) {
      config.externals = config.externals || [];

      // Make webpack ignore any imports that match the wmea path pattern
      // Be specific - only match paths that actually contain "wmea" to avoid
      // breaking Next.js internal loaders
      config.externals.push(function (
        { request }: { request?: string },
        callback: (err?: Error | null, result?: string) => void
      ) {
        // Only mark as external if it specifically references wmea
        if (
          request &&
          (request.includes("./wmea") ||
            request.includes("/wmea") ||
            request === "./wmea" ||
            request === "wmea")
        ) {
          return callback(null, `commonjs ${request}`);
        }
        callback();
      });
    }

    // Handle .mjs files from the embedded app package
    config.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules\/@nuralogix\.ai\/web-measurement-embedded-app/,
      type: "javascript/auto",
      resolve: {
        fullySpecified: false,
      },
      parser: {
        // Disable parsing of dynamic imports in the embedded app
        javascript: {
          dynamicImportMode: "eager",
        },
      },
    });

    // Disable webpack's analysis of dynamic import expressions
    // This prevents "expression is too dynamic" errors
    config.module.parser = {
      ...config.module.parser,
      javascript: {
        ...config.module.parser?.javascript,
        // Don't try to analyze dynamic imports
        dynamicImportMode: "eager",
        // Ignore require expressions that are too dynamic
        requireContext: false,
        requireEnsure: false,
        requireInclude: false,
      },
    };

    // Don't try to resolve imports from public/wmea
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
    };

    // Disable module concatenation for the embedded app package
    config.optimization = {
      ...config.optimization,
      concatenateModules: false,
    };

    return config;
  },

  async headers() {
    return [
      // Global headers for SharedArrayBuffer support (required for embedded app)
      // These must be set on ALL routes, not just wmea routes
      {
        source: "/:path*",
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "require-corp",
          },
        ],
      },
      // Specific headers for wmea static files
      // {
      //   source: "/wmea/:path*",
      //   headers: [
      //     {
      //       key: "Cache-Control",
      //       value: "public, max-age=31536000, immutable",
      //     },
      //     {
      //       key: "Content-Type",
      //       value: "application/javascript; charset=utf-8",
      //     },
      //     // Also ensure COOP/COEP are set on wmea files (redundant but safe)
      //     {
      //       key: "Cross-Origin-Opener-Policy",
      //       value: "same-origin",
      //     },
      //     {
      //       key: "Cross-Origin-Embedder-Policy",
      //       value: "require-corp",
      //     },
      //   ],
      // },
    ];
  },
};

export default nextConfig;

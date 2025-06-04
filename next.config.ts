import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false, // Ne pas divulguer que tu utilises Next.js
  productionBrowserSourceMaps: false, // Désactiver les sourcemaps en production pour des raisons de sécurité
  
  headers: async () => [
    {
      source: "/(.*)", // Toutes les routes
      headers: [
        {
          key: "Content-Security-Policy",
          value: "default-src 'self'; img-src * data:; script-src 'self'; style-src 'self' 'unsafe-inline'",
        },
        {
          key: "X-Content-Type-Options",
          value: "nosniff",
        },
        {
          key: "X-Frame-Options",
          value: "DENY",
        },
        {
          key: "Referrer-Policy",
          value: "strict-origin-when-cross-origin",
        },
        {
          key: "Strict-Transport-Security",
          value: "max-age=63072000; includeSubDomains; preload",
        },
      ],
    },
  ],
};

export default nextConfig;

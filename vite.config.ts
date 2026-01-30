import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import sitemap from "vite-plugin-sitemap";

const SUPPORTED_LANGS = ["fr", "ko", "ja", "en"];

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const siteUrl = (env.VITE_SITE_URL || "https://example.com").replace(/\/+$/, "");

  const baseRoutes = [
    "/",
    "/search",
    "/trends",
    "/events",
    "/phrasebook",
    "/popups",
    "/local-support/services",
    "/local-support/apps",
    "/local-support/community",
    "/culture-test"
  ];

  const localizedRoutes = SUPPORTED_LANGS.map((lang) => `/${lang}`);

  const routeEntries = [...baseRoutes, ...localizedRoutes].map((path) => ({
    url: path,
    changefreq: "weekly" as const,
    priority: 0.7
  }));

  return {
    plugins: [
      react(),
      sitemap({
        hostname: siteUrl,
        routes: routeEntries,
        sitemapName: "sitemap",
        outDir: "dist"
      })
    ],
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            // Vendor chunks
            "react-vendor": ["react", "react-dom", "react-router-dom"],
            "helmet-vendor": ["react-helmet-async"],
            // Feature chunks
            "admin": [
              "./src/pages/AdminListPage",
              "./src/pages/AdminEditorPage"
            ],
            "auth": [
              "./src/pages/LoginPage",
              "./src/pages/SignupPage",
              "./src/pages/ProfilePage"
            ],
            "content": [
              "./src/pages/TrendDetailPage",
              "./src/pages/EventDetailPage",
              "./src/pages/PopupDetailPage",
              "./src/pages/NewsletterDetailPage"
            ]
          }
        }
      },
      chunkSizeWarningLimit: 1000,
      cssCodeSplit: true,
      sourcemap: false,
      minify: "esbuild",
      target: "esnext",
      assetsInlineLimit: 4096
    },
    server: {
      port: 5173
    },
    preview: {
      port: 4173
    }
  };
});

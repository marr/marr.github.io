import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  modules: ["@nuxt/ui", "@nuxt/content"],
  devtools: { enabled: true },
  build: {
    transpile: ["dithered-logo-vue"],
  },
  app: {
    head: {
      link: [
        { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
        { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32.png" },
        { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
        { rel: "preload", href: "/logo-david-marr.png", as: "image" },
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossorigin: "",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Public+Sans:ital,wght@0,300..800;1,300..800&display=swap",
        },
      ],
    },
  },
  // Make content components global to avoid async loading hydration issues
  hooks: {
    "components:extend": (components) => {
      // Mark all content directory components as global for synchronous loading
      const contentComponents = components.filter((c) =>
        c.filePath?.includes("/components/content/"),
      );
      contentComponents.forEach((c) => (c.global = true));
    },
  },
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: ["clsx", "tailwind-merge", "dithered-logo-vue"],
    },
    // Cloud / port-forward hostnames are not localhost; allow them so the app loads
    // in Cursor’s Simple Browser and in the browser tab that uses the forwarded URL.
    server: {
      allowedHosts: true,
    },
  },
  css: ["~/assets/css/main.css"],
  compatibilityDate: "2026-03-03",
  icon: {
    // Use CSS mode for consistent SSR rendering (icons as background-image)
    mode: "css",
    // Bundle icons at build time
    clientBundle: {
      scan: true,
    },
    // Ensure collections are available on server
    serverBundle: {
      collections: ["lucide", "simple-icons"],
    },
  },
  content: {
    build: {
      markdown: {
        toc: {
          depth: 3,
          searchDepth: 4,
        },
        highlight: {
          theme: {
            // Default theme (same as single string)
            default: "github-light",
            // Theme used if `html.dark`
            dark: "github-dark",
            // Theme used if `html.sepia`
            sepia: "monokai",
          },
        },
      },
    },
    renderer: {
      alias: {
        button: "UButton",
      },
    },
  },
  routeRules: {
    "/nuxt-maplibre": { prerender: false },
    "/vue-squircle": { prerender: false },
    "/dithered-logo-vue": { prerender: false },
    "/about": { redirect: { to: "/ai#career", statusCode: 301 } },
  },
});

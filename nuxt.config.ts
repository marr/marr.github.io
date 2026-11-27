import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  future: {
    compatibilityVersion: 5,
  },
  modules: ["@nuxt/ui", "@nuxt/content", "nuxt-llms"],
  llms: {
    domain: "https://marr.github.io",
    title: "David Marr",
    description:
      "Writing and open source on agent tooling, homelab GitOps, and interface craft.",
    notes: [
      "Personal lab notebook for peers, not a job pitch.",
      "Flagship OSS: create-react-reps, nuxt-maplibre, flux-homelab-skill.",
    ],
    full: {
      title: "Full site content",
      description: "All pages and blog posts as markdown, suitable for agent ingestion.",
    },
    sections: [
      {
        title: "Site pages",
        description: "Home, bookmarks, stars, background.",
        contentCollection: "content",
      },
      {
        title: "Writing",
        description: "Blog posts on homelab GitOps, agents, and tooling.",
        contentCollection: "blog",
      },
      {
        title: "Profiles",
        links: [
          {
            title: "GitHub",
            description: "Source repos and issues.",
            href: "https://github.com/marr",
          },
          {
            title: "X",
            description: "Threads and links to new posts.",
            href: "https://x.com/dmarr",
          },
        ],
      },
    ],
  },
  runtimeConfig: {
    github: {
      token: process.env.GITHUB_TOKEN || "",
    },
    public: {
      githubUsername: "marr",
    },
  },
  devtools: { enabled: true },
  build: {
    transpile: ["dithered-logo-vue"],
  },
  app: {
    head: {
      link: [
        { rel: "icon", href: "/favicon.ico", sizes: "32x32" },
        { rel: "icon", type: "image/svg+xml", href: "/favicon.svg", sizes: "any" },
        { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
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
    "vite:extendConfig"(config, { isDev }) {
      // Vite 8: css.devSourcemap is deprecated; nuxt/vite-builder still sets it.
      if (isDev && config.css && "devSourcemap" in config.css) {
        const enabled = Boolean(config.css.devSourcemap);
        delete config.css.devSourcemap;
        config.dev ??= {};
        config.dev.sourcemap ??= {};
        if (config.dev.sourcemap.css === undefined) {
          config.dev.sourcemap.css = enabled;
        }
      }
    },
  },
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: ["clsx", "tailwind-merge"],
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
    "/about": { redirect: { to: "/resume", statusCode: 301 } },
    "/ai": { redirect: { to: "/", statusCode: 301 } },
  },
});

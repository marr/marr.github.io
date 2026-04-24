import tailwindcss from "@tailwindcss/vite";

// Remote dev VMs (e.g. Cursor cloud under `/workspace`, Codespaces) often do not deliver reliable
// native `fs.watch` events. @nuxt/content uses chokidar; without polling, markdown edits may not
// update the local SQLite DB or trigger `nuxt-content:update` HMR without a full dev restart.
// Set DEV_USE_POLLING=1 in dev to opt in; we also enable when the env looks like a cloud workspace.
const cwd = process.cwd();
const isLikelyCloudDevFs =
  process.env.DEV_USE_POLLING === "1" ||
  process.env.CODESPACES === "true" ||
  process.env.REMOTE_CONTAINERS === "true" ||
  process.env.GITPOD_WORKSPACE_ID !== undefined ||
  cwd === "/workspace" ||
  cwd.startsWith("/workspaces/");
if (isLikelyCloudDevFs) {
  if (!process.env.CHOKIDAR_USEPOLLING) {
    process.env.CHOKIDAR_USEPOLLING = "true";
  }
  if (!process.env.CHOKIDAR_INTERVAL) {
    process.env.CHOKIDAR_INTERVAL = "300";
  }
}

// @nuxt/content ~3.11.x until https://github.com/nuxt/content/issues/3742 (broken import in 3.12.0)
export default defineNuxtConfig({
  modules: ["@nuxt/ui", "@nuxt/content", "nuxt-studio"],
  $production: { studio: false },
  devtools: { enabled: true },
  app: {
    head: {
      link: [
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
      include: ["clsx", "tailwind-merge"],
    },
    // Cloud / port-forward hostnames are not localhost; allow them so the app loads
    // in Cursor’s Simple Browser and in the browser tab that uses the forwarded URL.
    server: {
      allowedHosts: true,
      ...(isLikelyCloudDevFs
        ? {
            watch: {
              usePolling: true,
              interval: 300,
            },
          }
        : {}),
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
      collections: ["lucide", "mdi"],
    },
  },
  content: {
    build: {
      markdown: {
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
  studio: {
    // Studio admin route (default: '/_studio')
    route: "/_studio",

    // Git repository configuration (owner and repo are required)
    repository: {
      provider: "github", // 'github' or 'gitlab'
      owner: "marr", // your GitHub/GitLab username or organization
      repo: "marr.github.io", // your repository name
      branch: "main", // the branch to commit to (default: main)
    },
  },
  routeRules: {
    "/nuxt-maplibre": { prerender: false },
    "/vue-squircle": { prerender: false },
    "/resume.pdf": {
      headers: {
        "Content-Type": "application/pdf",
        "Cache-Control": "public, max-age=31536000",
      },
    },
  },
});

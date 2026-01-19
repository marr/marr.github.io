import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  modules: ["@nuxt/ui", "@nuxt/content", "nuxt-studio"],
  devtools: { enabled: true },
  // Make content components global to avoid async loading hydration issues
  hooks: {
    "components:extend": (components) => {
      // Mark all content directory components as global for synchronous loading
      const contentComponents = components.filter((c) =>
        c.filePath?.includes("/components/content/")
      );
      contentComponents.forEach((c) => (c.global = true));
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
  css: ["~/assets/css/main.css"],
  compatibilityDate: "2024-04-03",
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
  },
});

export default defineNuxtConfig({
  modules: [
    "@nuxtjs/tailwindcss",
    "shadcn-nuxt",
    "@nuxtjs/color-mode",
    "@nuxt/content",
  ],
  devtools: { enabled: true },
  future: {
    compatibilityVersion: 4,
  },
  colorMode: {
    preference: "system",
    fallback: "dark",
    classSuffix: "",
  },
  shadcn: {
    componentDir: "./app/components/ui",
    prefix: "",
  },
  tailwindcss: {
    config: {
      content: ["./app/components/**/*.{vue,ts}", "./app/pages/**/*.{vue,ts}"],
    },
  },
  compatibilityDate: "2024-04-03",
  content: {
    build: {
      markdown: {
        highlight: {
          theme: {
            // Default theme (same as single string)
            default: 'github-light',
            // Theme used if `html.dark`
            dark: 'github-dark',
            // Theme used if `html.sepia`
            sepia: 'monokai'
          }
        }
      }
    },
    renderer: {
      alias: {
        button: "Button",
      },
    },
  },

});

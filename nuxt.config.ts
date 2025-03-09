import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  modules: [
    '@nuxt/ui',
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
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  css: ['~/assets/css/main.css'],
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
        button: "UButton",
      },
    },
  },

});

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    "@nuxt/content",
    "@nuxtjs/tailwindcss",
    "shadcn-nuxt",
    "@nuxtjs/color-mode",
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
  components: [
    "~/components",
    {
      path: "~/components/ui",
      global: true, // sets the path to global so you can use the components in your markdown
      pathPrefix: false,
    },
  ],
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

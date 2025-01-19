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
    componentDir: "~/components/ui",
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
    renderer: {
      alias: {
        button: "Button",
      },
    },
  },

});

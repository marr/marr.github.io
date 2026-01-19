import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    // Main pages (home, about, etc.)
    content: defineCollection({
      type: 'page',
      source: '*.md',
    }),

    // Blog listing page metadata
    pages: defineCollection({
      type: 'data',
      source: 'blog.yml',
      schema: z.object({
        title: z.string(),
        description: z.string(),
      }),
    }),

    // Blog posts
    blog: defineCollection({
      type: 'page',
      source: 'blog/*.md',
      schema: z.object({
        date: z.date(),
        image: z.string().optional(),
      }),
    }),
  },
})

import { defineContentConfig, defineCollection, z } from '@nuxt/content'

const resumeLinkSchema = z.object({
  label: z.string(),
  text: z.string(),
  href: z.string().optional(),
  icon: z.string().optional(),
  external: z.boolean().optional(),
})

const resumeProfileSchema = z.object({
  name: z.string(),
  headline: z.string().optional(),
  pdfHref: z.string(),
  links: z.array(resumeLinkSchema),
})

export default defineContentConfig({
  collections: {
    // Main pages (home, about, etc.)
    content: defineCollection({
      type: 'page',
      source: '*.md',
      schema: z.object({
        resumeProfile: resumeProfileSchema.optional(),
      }),
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

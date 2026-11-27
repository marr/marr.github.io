<script setup lang="ts">
interface Props {
  title?: string
  description?: string
  /** Max posts when slugs is omitted. */
  limit?: number
  /** Post paths, e.g. `/blog/my-post`. */
  slugs?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  title: "Writing",
  description:
    "Longer notes on homelab GitOps, agents, and tools - meant to be linked, not skimmed.",
  limit: 3,
  slugs: () => [],
})

const { data: posts, pending } = await useAsyncData(
  "home-featured-posts",
  async () => {
    const all = await queryCollection("blog").order("date", "DESC").all()
    if (props.slugs.length > 0) {
      return props.slugs
        .map((slug) => all.find((post) => post.path === slug))
        .filter((post): post is NonNullable<typeof post> => Boolean(post))
    }
    return all.slice(0, props.limit)
  },
)
</script>

<template>
  <section class="py-10 first:pt-4" aria-labelledby="featured-writing-heading">
    <header class="mb-8 max-w-prose border-l-2 border-primary/40 pl-4">
      <h2
        id="featured-writing-heading"
        class="text-2xl font-bold tracking-tight text-default"
      >
        {{ title }}
      </h2>
      <p class="mt-2 text-sm leading-relaxed text-muted text-pretty">
        {{ description }}
      </p>
    </header>

    <div
      v-if="pending"
      class="space-y-6"
      aria-busy="true"
      aria-label="Loading featured posts"
    >
      <div
        v-for="n in limit"
        :key="n"
        class="h-20 animate-pulse rounded-lg bg-elevated/60"
      />
    </div>

    <ul v-else-if="posts?.length" class="space-y-8">
      <li v-for="post in posts" :key="post.path">
        <article>
          <NuxtLink
            :to="post.path"
            class="group block rounded-lg outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-default"
          >
            <h3
              class="text-lg font-semibold text-default group-hover:text-primary transition-colors"
            >
              {{ post.title }}
            </h3>
            <p
              v-if="post.description"
              class="mt-2 text-sm leading-relaxed text-muted text-pretty"
            >
              {{ post.description }}
            </p>
            <NuxtTime
              v-if="post.date"
              :datetime="post.date"
              locale="en-US"
              year="numeric"
              month="long"
              day="numeric"
              time-zone="UTC"
              class="mt-2 block text-xs text-muted"
            />
          </NuxtLink>
        </article>
      </li>
    </ul>

    <p v-else class="text-sm text-muted">
      No posts yet.
      <NuxtLink to="/blog" class="text-primary hover:underline">Blog index</NuxtLink>
    </p>

    <p v-if="posts?.length" class="mt-8 text-sm text-muted">
      <NuxtLink to="/blog" class="font-medium text-primary hover:underline">
        All posts →
      </NuxtLink>
    </p>
  </section>
</template>
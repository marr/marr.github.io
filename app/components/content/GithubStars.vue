<template>
  <section class="py-10 first:pt-4">
    <header
      v-if="title || description"
      class="mb-8 max-w-prose border-l-2 border-primary/40 pl-4"
    >
      <h2
        v-if="title"
        class="text-2xl font-bold tracking-tight text-default"
      >
        {{ title }}
      </h2>
      <p
        v-if="description"
        class="mt-2 text-sm leading-relaxed text-muted"
      >
        {{ description }}
      </p>
    </header>

    <div
      v-if="pending"
      class="grid gap-4 sm:grid-cols-2"
      aria-busy="true"
      aria-label="Loading recent GitHub stars"
    >
      <UCard
        v-for="n in limit"
        :key="n"
        :ui="{ root: 'ring-1 ring-inset ring-default/40' }"
      >
        <div class="flex items-start gap-4">
          <USkeleton class="size-10 shrink-0 rounded-lg" />
          <div class="flex flex-1 flex-col gap-2">
            <USkeleton class="h-4 w-2/3" />
            <USkeleton class="h-3 w-full" />
            <USkeleton class="h-3 w-4/5" />
          </div>
        </div>
      </UCard>
    </div>

    <p
      v-else-if="error"
      class="text-sm text-muted"
    >
      Couldn't load recent stars right now.
    </p>

    <div
      v-else-if="stars?.length"
      class="home-stagger-grid grid gap-4 sm:grid-cols-2"
    >
      <UCard
        v-for="star in stars"
        :key="star.url"
        :ui="{
          root: 'group ring-1 ring-inset ring-default/40 transition-[transform,box-shadow,ring-color] duration-200 [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] motion-safe:hover:-translate-y-0.5 hover:ring-primary/50 hover:shadow-md hover:shadow-primary/5',
        }"
      >
        <div class="flex items-start gap-4">
          <div
            class="flex items-center justify-center rounded-lg bg-elevated/80 p-1 ring-1 ring-inset ring-default/30 group-hover:bg-primary/10 group-hover:ring-primary/25 transition-[background-color,ring-color,opacity] duration-200 [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] shrink-0"
          >
            <img
              :src="star.ownerAvatar"
              :alt="`${star.owner} avatar`"
              class="size-8 rounded-md object-cover group-hover:opacity-90 transition-opacity"
              loading="lazy"
              width="32"
              height="32"
            />
          </div>
          <div class="flex min-w-0 flex-col gap-1">
            <ULink
              :to="star.url"
              target="_blank"
              class="truncate font-semibold text-default hover:text-primary transition-colors"
            >
              {{ star.title }}
            </ULink>
            <p
              v-if="star.description"
              class="line-clamp-2 text-sm text-muted"
            >
              {{ star.description }}
            </p>
            <div
              v-if="star.language"
              class="mt-2 flex flex-wrap gap-2"
            >
              <UBadge
                color="neutral"
                variant="subtle"
                size="xs"
              >
                {{ star.language }}
              </UBadge>
            </div>
          </div>
        </div>
      </UCard>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Props {
  title?: string
  description?: string
  limit?: number
  username?: string
}

const {
  title = "Recently starred",
  description = "Repos I’ve bookmarked lately—tools and ideas worth a closer look.",
  limit = 8,
  username = "",
} = defineProps<Props>();

const { data: stars, pending, error } = await useFetch("/api/github/stars", {
  query: {
    limit,
    ...(username ? { username } : {}),
  },
});
</script>

<template>
  <section
    v-if="showSection"
    class="py-10"
  >
    <header class="mb-8 max-w-prose border-l-2 border-primary/40 pl-4">
      <h2 class="text-2xl font-bold tracking-tight text-default">
        {{ title }}
      </h2>
      <p
        v-if="description"
        class="mt-2 text-sm leading-relaxed text-muted"
      >
        {{ description }}
      </p>
    </header>

    <p
      v-if="error"
      class="mb-4 text-sm text-muted"
    >
      Watched repos are temporarily unavailable.
    </p>

    <div class="home-stagger-grid grid gap-4 sm:grid-cols-2">
      <ProjectCard
        v-for="repo in repos"
        :key="repo.url"
        :title="repo.title"
        :url="repo.url"
        :description="repo.description"
        :icon="repo.icon"
        :tags="repo.tags"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import ProjectCard from '~/components/content/ProjectCard.vue'

interface WatchedRepo {
  title: string
  url: string
  description?: string
  tags?: string[]
  icon?: string
}

interface Props {
  title?: string
  description?: string
}

const {
  title = 'Watching',
  description = 'GitHub repos I follow—synced from Redis Iris context at build time.',
} = defineProps<Props>()

const { data } = await useFetch('/api/watched-repos')

const repos = computed(() => data.value?.repos ?? [])
const error = computed(() => data.value?.error)
const showSection = computed(
  () => data.value?.enabled === true && repos.value.length > 0,
)
</script>

<template>
  <UCard
    :ui="{
      root: 'group ring-1 ring-inset ring-default/40 transition-all duration-300 hover:-translate-y-0.5 hover:ring-primary/50 hover:shadow-md hover:shadow-primary/5',
    }"
  >
    <div class="flex items-start gap-4">
      <!-- Icon or custom image (e.g. project logo from public/) -->
      <div
        v-if="image || icon"
        class="flex items-center justify-center rounded-lg bg-elevated/80 p-2.5 ring-1 ring-inset ring-default/30 group-hover:bg-primary/10 group-hover:ring-primary/25 transition-all duration-300 shrink-0"
      >
        <img
          v-if="image"
          :src="image"
          :alt="title"
          class="size-5 object-contain invert dark:invert-0 group-hover:opacity-90 transition-opacity"
        />
        <UIcon
          v-else
          :name="icon"
          class="size-5 group-hover:text-primary transition-colors"
        />
      </div>
      <div class="flex flex-col gap-1">
        <ULink
          :to="url"
          target="_blank"
          class="font-semibold text-default hover:text-primary transition-colors"
        >
          {{ title }}
        </ULink>
        <p v-if="description" class="text-sm text-muted">
          {{ description }}
        </p>
        <div v-if="tags?.length" class="flex flex-wrap gap-2 mt-2">
          <UBadge
            v-for="tag in tags"
            :key="tag"
            color="neutral"
            variant="subtle"
            size="xs"
          >
            {{ tag }}
          </UBadge>
        </div>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
interface Props {
  title: string
  url: string
  /** Nuxt Icon collection name (e.g. i-mdi-github) */
  icon?: string
  /** Path under public/ or absolute URL for project logo */
  image?: string
  description?: string
  tags?: string[]
}

const {
  title,
  url,
  icon = '',
  image = '',
  description = '',
  tags = [],
} = defineProps<Props>()
</script>

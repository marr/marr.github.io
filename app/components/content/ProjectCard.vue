<template>
  <UCard
    :ui="{
      root: 'group hover:ring-primary hover:ring-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10',
    }"
  >
    <div class="flex items-start gap-4">
      <div v-if="icon" class="flex items-center justify-center rounded-lg bg-muted p-2.5 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
        <UIcon :name="icon" class="size-5 group-hover:text-primary transition-colors" />
      </div>
      <div class="flex flex-col gap-1">
        <ULink
          :to="url"
          target="_blank"
          class="font-semibold hover:text-primary transition-colors"
        >
          {{ title }}
        </ULink>
        <p class="text-sm text-muted">
          <slot />
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
  icon?: string
  tags?: string[]
}

const {
  title,
  url,
  icon = '',
  tags = [],
} = defineProps<Props>()
</script>

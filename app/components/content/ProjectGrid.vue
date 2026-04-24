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
    <div class="home-stagger-grid grid gap-4 sm:grid-cols-2">
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
interface Props {
  title?: string
  /** One line under the heading: what belongs in this section (homepage IA). */
  description?: string
}

const { title = '', description = '' } = defineProps<Props>()
</script>

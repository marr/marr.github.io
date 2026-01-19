<template>
  <section class="py-8">
    <h2 v-if="title" class="text-2xl font-bold mb-6">{{ title }}</h2>
    <div class="grid gap-4 sm:grid-cols-2">
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
interface Props {
  title?: string
}

const { title = '' } = defineProps<Props>()
</script>

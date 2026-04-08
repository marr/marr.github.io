<template>
  <section class="py-10 first:pt-4">
    <div v-if="title" class="mb-8 border-l-2 border-primary/40 pl-4">
      <h2 class="text-2xl font-bold tracking-tight text-default">
        {{ title }}
      </h2>
    </div>
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

<template>
  <header class="pb-8 pt-2">
    <figure
      class="relative overflow-hidden rounded-lg ring-1 ring-default/40"
    >
      <img
        :src="image"
        :alt="imageAlt"
        class="h-auto w-full object-cover"
        :width="width"
        :height="height"
        fetchpriority="high"
      />
      <figcaption
        class="absolute inset-0 flex flex-col justify-center bg-linear-to-r from-black/75 via-black/35 to-transparent px-6 py-8 md:px-10 md:py-10"
      >
        <h1 class="max-w-md text-2xl font-bold tracking-tight text-white md:text-3xl">
          {{ title }}
        </h1>
        <p
          v-if="description"
          class="mt-2 max-w-prose text-sm leading-relaxed text-white/85 text-pretty md:text-base"
        >
          {{ description }}
        </p>
      </figcaption>
    </figure>
  </header>
</template>

<script setup lang="ts">
interface Props {
  title?: string
  description?: string
  image?: string
  imageAlt?: string
  width?: number
  height?: number
}

withDefaults(defineProps<Props>(), {
  title: 'Building with AI',
  description: 'Career timeline and how I work with AI tooling.',
  image: '/ai-header.jpg',
  imageAlt: 'Mountain landscape blended with a hexagonal technology network pattern.',
  width: 1024,
  height: 409,
})
</script>

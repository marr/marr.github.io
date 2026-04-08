<template>
  <section class="relative py-16 md:py-28">
    <div class="flex flex-col items-center text-center">
      <div v-if="avatar" class="relative mb-10 p-4 motion-safe:transition-transform motion-safe:duration-500">
        <div
          class="absolute inset-2 rounded-full bg-primary/20 blur-2xl motion-safe:animate-pulse motion-reduce:animate-none"
          aria-hidden="true"
        />
        <img
          :src="avatar"
          :alt="title"
          class="relative size-32 md:size-40 rounded-full ring-2 ring-default object-cover shadow-sm"
          width="160"
          height="160"
        />
      </div>

      <h1 class="text-4xl md:text-5xl font-bold tracking-tight text-default mb-3">
        {{ title }}
      </h1>

      <MorphingText
        v-if="roles?.length"
        :texts="roles"
        class="text-primary mb-6"
      />

      <p v-if="description" class="text-lg text-muted max-w-2xl text-pretty mb-10 leading-relaxed">
        {{ description }}
      </p>

      <div v-if="socials?.length" class="flex items-center justify-center gap-4">
        <UButton
          v-for="social in socials"
          :key="social.url"
          :to="social.url"
          target="_blank"
          :icon="social.icon"
          color="neutral"
          variant="ghost"
          size="lg"
          :aria-label="social.label || social.icon"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Social {
  icon: string
  url: string
  label?: string
}

interface Props {
  title?: string
  description?: string
  avatar?: string
  roles?: string[]
  socials?: Social[]
}

const {
  title = '',
  description = '',
  avatar = '',
  roles = ['Engineering Leader', 'Open Source Creator', 'Building for the Future'],
  socials = [],
} = defineProps<Props>()
</script>

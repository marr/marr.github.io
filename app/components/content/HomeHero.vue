<template>
  <section class="relative py-16 md:py-24">
    <div class="flex flex-col items-center text-center">
      <!-- Animated Ring Avatar -->
      <div v-if="avatar" class="relative mb-8 p-4">
        <!-- Pulsing gradient glow -->
        <div class="absolute inset-0 rounded-full bg-gradient-to-r from-primary via-emerald-400 to-primary opacity-60 blur-xl animate-pulse" />
        <!-- Avatar -->
        <img
          :src="avatar"
          :alt="title"
          class="relative size-32 md:size-40 rounded-full ring-2 ring-primary/50"
          width="160"
          height="160"
        />
      </div>

      <!-- Title -->
      <h1 class="text-4xl md:text-5xl font-bold tracking-tight mb-4">
        {{ title }}
      </h1>

      <!-- Morphing Roles - component handles SSR by showing first role until mounted -->
      <MorphingText
        v-if="roles?.length"
        :texts="roles"
        class="text-muted mb-6"
      />

      <p v-if="description" class="text-lg text-muted max-w-2xl mb-8">
        {{ description }}
      </p>

      <!-- Social Links -->
      <div v-if="socials?.length" class="flex items-center gap-4">
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

<template>
  <section class="relative py-16 md:py-24">

    <div class="flex flex-col items-center text-center">
      <!-- Animated Ring Avatar -->
      <div v-if="avatar" class="relative mb-8 p-4">
        <!-- Pulsing gradient glow -->
        <div class="absolute inset-0 rounded-full bg-gradient-to-r from-primary via-emerald-400 to-primary opacity-60 blur-xl animate-pulse" />
        <!-- Avatar using Nuxt UI -->
        <UAvatar
          :src="avatar"
          :alt="title"
          size="3xl"
          :ui="{
            root: 'relative size-32 md:size-40 ring-2 ring-primary/50',
          }"
        />
      </div>

      <!-- Name -->
      <h1 class="text-4xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-white to-white/70 bg-clip-text">
        <slot name="title">{{ title }}</slot>
      </h1>

      <!-- Morphing subtitle -->
      <div class="h-12 md:h-14 mb-8 w-full">
        <MorphingText
          :texts="roles"
          :morph-time="1.5"
          :cool-down-time="2"
          class="text-primary"
        />
      </div>

      <!-- Description -->
      <p class="text-lg md:text-xl text-muted max-w-2xl mb-10">
        <slot name="description" />
      </p>

      <!-- Social links -->
      <div v-if="socials?.length" class="flex gap-4">
        <UButton
          v-for="social in socials"
          :key="social.url"
          :to="social.url"
          :icon="social.icon"
          color="neutral"
          variant="ghost"
          size="lg"
          target="_blank"
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
  avatar?: string
  roles?: string[]
  socials?: Social[]
}

const {
  title = '',
  avatar = '',
  roles = ['Engineering Leader', 'Open Source Creator', 'Building for the Future'],
  socials = [],
} = defineProps<Props>()
</script>

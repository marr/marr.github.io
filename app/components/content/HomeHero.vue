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

const props = withDefaults(defineProps<Props>(), {
  title: '',
  description: '',
  avatar: '',
  roles: () => [
    'Engineering Leader',
    'Open Source Creator',
    'Building for the Future',
  ],
  socials: () => [],
})

</script>

<template>
  <section class="relative py-16 md:py-28">
    <div class="flex flex-col items-center text-center">
      <div
        v-if="avatar"
        class="relative mb-10 p-4 home-hero-avatar"
      >
        <div
          class="pointer-events-none absolute inset-2 z-0 rounded-full bg-primary/20 blur-2xl"
          aria-hidden="true"
        />
        <img
          :src="avatar"
          :alt="title"
          class="relative z-10 size-32 rounded-full object-cover shadow-sm ring-2 ring-default md:size-40"
          width="160"
          height="160"
          decoding="async"
        />
      </div>

      <h1 class="mb-3 text-4xl font-bold tracking-tight text-default md:text-5xl">
        {{ title }}
      </h1>

      <MorphingText
        v-if="roles?.length"
        :texts="roles"
        class="mb-6 text-primary"
      />

      <p v-if="description" class="mb-10 max-w-2xl text-pretty text-lg leading-relaxed text-muted">
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
          class="inline-flex transition-transform duration-150 [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] motion-safe:active:scale-[0.97] motion-reduce:transition-none"
        />
      </div>
    </div>
  </section>
</template>

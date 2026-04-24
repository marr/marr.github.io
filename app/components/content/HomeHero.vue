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
          :key="avatarSrc"
          :src="avatarSrc"
          :alt="title"
          class="relative z-10 size-32 md:size-40 rounded-full ring-2 ring-default object-cover shadow-sm"
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
          class="inline-flex transition-transform duration-150 [transition-timing-function:cubic-bezier(0.23,1,0.32,1)] motion-safe:active:scale-[0.97] motion-reduce:transition-none"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { usePreferredColorScheme } from '@vueuse/core'

interface Social {
  icon: string
  url: string
  label?: string
}

interface Props {
  title?: string
  description?: string
  /** Shown in light mode (and for SSR / unknown theme). */
  avatar?: string
  /** Shown in dark mode; defaults to `/avatar.png`. */
  avatarDark?: string
  roles?: string[]
  socials?: Social[]
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  description: '',
  avatar: '',
  avatarDark: '/avatar.png',
  roles: () => [
    'Engineering Leader',
    'Open Source Creator',
    'Building for the Future',
  ],
  socials: () => [],
})

const colorMode = useColorMode()
const preferredScheme = usePreferredColorScheme()

const isDark = computed(() => {
  const v = colorMode.value
  if (v === 'dark') return true
  if (v === 'light') return false
  return preferredScheme.value === 'dark'
})

const avatarSrc = computed(() =>
  isDark.value ? props.avatarDark : props.avatar,
)
</script>

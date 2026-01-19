<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps<{
  error: NuxtError
}>()

useHead({
  title: 'Page not found',
})

useSeoMeta({
  title: 'Page not found',
  description: 'The page you are looking for could not be found.',
})
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <SiteHeader />
    <main class="flex-1 flex items-center justify-center">
      <div class="text-center px-4">
        <h1 class="text-6xl font-bold text-muted-foreground mb-4">{{ error.statusCode }}</h1>
        <p class="text-xl text-muted-foreground mb-8">{{ error.statusMessage || 'Page not found' }}</p>
        <UButton to="/" variant="outline">
          Go home
        </UButton>
      </div>
    </main>
    <SiteFooter />
  </div>
</template>

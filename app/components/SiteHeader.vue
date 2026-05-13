<script setup lang="ts">
import { ref } from 'vue'

const items = ref([
  {
    label: "Home",
    to: "/",
    icon: "i-mdi-home",
  },
  {
    label: "Résumé",
    to: "/resume",
    icon: "i-mdi-file-document-outline",
  },
  {
    label: "Blog",
    to: "/blog",
    icon: "i-mdi-book-open-page-variant",
    // Explicit active class so NuxtLink / RouterLink applies it when route is /blog or any child
    activeClass: "text-primary before:bg-elevated",
  },
])
</script>

<template>
  <header
    class="sticky top-0 z-50 border-b border-default/60 bg-default/75 backdrop-blur-md supports-backdrop-filter:bg-default/65"
  >
    <div class="max-w-4xl mx-auto px-4">
      <div class="flex gap-3 items-center py-4 w-full">
        <UNavigationMenu :items="items" />
        <div class="ml-auto">
          <UColorModeButton />
        </div>
      </div>
    </div>
  </header>
</template>

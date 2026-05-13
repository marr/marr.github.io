<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
const route = useRoute()

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
  },
])

function updateActive() {
  const p = (route.path || '').replace(/\/+$/, '')
  items.value = items.value.map((i) => ({
    ...i,
    // Only set active on client to avoid SSR mismatches
    active: i.to === '/blog' ? p.startsWith('/blog') : undefined,
  }))
}

onMounted(() => {
  updateActive()
})

watch(() => route.path, () => updateActive())
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

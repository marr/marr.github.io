<script setup lang="ts">
const route = useRoute();

const items = computed(() => [
  {
    label: "Home",
    to: "/",
    icon: "i-mdi-home",
    active: route.path === "/",
  },
  {
    label: "Résumé",
    to: "/resume",
    icon: "i-mdi-file-document-outline",
    active: route.path === "/resume",
  },
  {
    label: "Blog",
    to: "/blog",
    icon: "i-mdi-book-open-page-variant",
    active: route.path.startsWith("/blog"),
  },
  {
    label: "Streaming",
    to: "/streaming-chart",
    icon: "i-mdi-chart-line",
    active: route.path.startsWith("/streaming-chart"),
  },
]);
</script>

<template>
  <header
    class="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-muted/20"
  >
    <div class="max-w-3xl mx-auto px-4">
      <div class="flex gap-3 items-center py-4 w-full">
        <UNavigationMenu :items="items" />
        <div class="ml-auto">
          <UColorModeButton />
        </div>
      </div>
    </div>
  </header>
</template>

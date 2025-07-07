<script setup lang="ts">
const items = ref([
  { label: 'Home', to: '/' },
  { label: 'Blog', to: '/blog' },
  // { title: 'Posts', to: '/posts' },
  // { title: 'Tags', to: '/tags' }
])
</script>
<template>
  <UContainer>
    <div class="flex flex-end gap-3 items-center py-4 w-full">
      <UNavigationMenu :items="items" />
      <div class="ml-auto">
        <ColorModeButton />
      </div>
    </div>
    <slot />
  </UContainer>
</template>

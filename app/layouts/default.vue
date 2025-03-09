<script setup lang="ts">
const items = ref([
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  // { title: 'Posts', to: '/posts' },
  // { title: 'Tags', to: '/tags' }
])
</script>
<template>
  <UContainer>
    <div class="flex items-center w-full">
      <UNavigationMenu :items="items" />
      <div class="ml-auto">
        <ColorModeButton class="ml-auto" />
      </div>
    </div>
    <slot />
  </UContainer>
</template>

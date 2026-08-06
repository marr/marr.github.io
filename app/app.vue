<script setup lang="ts">
const route = useRoute()
const isLabPage = computed(() =>
  route.path === '/logo-demo' || route.path === '/logo-demo2',
)
</script>

<template>
  <UApp>
    <div class="flex min-h-screen flex-col">
      <SiteHeader v-if="!isLabPage" />
      <UMain class="flex-1">
        <NuxtLayout>
          <NuxtPage />
        </NuxtLayout>
      </UMain>
      <SiteFooter v-if="!isLabPage" />
    </div>
  </UApp>
</template>

<script setup lang="ts">
const route = useRoute()

function normalizePath(path: string) {
  const trimmed = (path || '').replace(/\/+$/, '')
  return trimmed || '/'
}

function isNavActive(to: string, path: string) {
  if (to === '/') return path === '/'
  if (to === '/blog') return path.startsWith('/blog')
  return path === to
}

const items = computed(() => {
  const path = normalizePath(route.path)
  return [
    { label: 'Home', to: '/', icon: 'i-lucide-house', exact: true, active: isNavActive('/', path) },
    { label: 'AI', to: '/ai', icon: 'i-lucide-bot', active: isNavActive('/ai', path) },
    { label: 'Blog', to: '/blog', icon: 'i-lucide-rss', active: isNavActive('/blog', path) },
    { label: 'CV', to: '/resume', icon: 'i-lucide-file-user', active: isNavActive('/resume', path) },
  ]
})
</script>

<template>
  <UHeader
    :ui="{
      root: 'sticky top-0 z-50 border-b border-default/60 bg-default/75 backdrop-blur-md supports-backdrop-filter:bg-default/65',
      container: 'max-w-4xl',
      center: 'hidden md:flex',
      right: 'gap-1.5',
    }"
  >
    <template #title>
      <SiteLogo />
    </template>

    <UNavigationMenu :items="items" />

    <template #right>
      <UColorModeButton />
    </template>

    <template #body>
      <UNavigationMenu
        :items="items"
        orientation="vertical"
        class="-mx-2.5"
      />
    </template>
  </UHeader>
</template>

<template>
  <div class="min-h-screen flex flex-col">
    <SiteHeader />
    <main class="flex-1 w-full">
      <slot />
    </main>
    <SiteFooter />
  </div>
</template>

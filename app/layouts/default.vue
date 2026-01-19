<template>
  <div class="min-h-screen flex flex-col">
    <SiteHeader />
    <main class="flex-1">
      <div class="max-w-3xl mx-auto px-4">
        <slot />
      </div>
    </main>
    <SiteFooter />
  </div>
</template>

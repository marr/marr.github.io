<template>
  <div class="min-h-screen flex flex-col">
    <SiteHeader />
    <main class="flex-1">
      <div class="max-w-4xl mx-auto px-4">
        <slot />
      </div>
    </main>
    <SiteFooter />
  </div>
</template>

<template>
  <div class="container mx-auto">
    <p class="flex p-4 pb-2">
      <ColorMode />
      <NuxtLink v-if="$route.path === '/'" to="/about" class="ml-auto">About</NuxtLink>
    </p>
    <div class="mx-auto p-4">
      <slot />
    </div>
  </div>
</template>

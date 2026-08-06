<script setup lang="ts">
const LOGO_W = `calc(2.5rem * ${348} / ${225})`
</script>

<template>
  <img
    src="/logo-david-marr.png"
    alt=""
    class="site-logo block h-10 w-auto shrink-0 object-contain"
    :style="{ width: LOGO_W }"
    width="348"
    height="225"
    decoding="async"
    fetchpriority="high"
  />
</template>

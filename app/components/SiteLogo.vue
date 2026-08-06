<script setup lang="ts">
/** Header logo — h-10 viewport; grid-size tracks inner canvas height (~38px). */
const LOGO_W = 'calc(2.5rem * 669 / 493)'

/** Finer halftone — ~32 cells across ~38px inner height. */
const GRID_SIZE = 32
</script>

<template>
  <div
    class="site-logo box-border h-10 shrink-0 overflow-hidden rounded-lg"
    :style="{ width: LOGO_W }"
    aria-hidden="true"
  >
    <ClientOnly>
      <SiteDitheredLogo
        image-src="/logo-dither-source.png"
        class="site-logo__canvas size-full dark:invert"
        :grid-size="GRID_SIZE"
        :scale="1"
        :dot-scale="0.68"
        :contrast="35"
        invert
        :corner-radius="0.2"
      />
      <template #fallback>
        <img
          src="/logo-halftone.png"
          alt=""
          class="block size-full dark:invert"
          width="54"
          height="40"
          decoding="async"
        />
      </template>
    </ClientOnly>
  </div>
</template>

<style scoped>
.site-logo__canvas {
  pointer-events: auto;
}
</style>

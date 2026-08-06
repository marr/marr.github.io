<script setup lang="ts">
/** Positive-space dither lab — /logo-demo2 (stock dithered-logo-vue) */

const LOGO_ASPECT = 669 / 493
const IMAGE_SRC = '/logo-dither-demo2.png'

const gridSize = ref(160)
const scale = ref(0.9)
const dotScale = ref(1)
const invert = ref(false)
const cornerRadius = ref(0.2)
const contrast = ref(40)
const gamma = ref(1)
const blur = ref(2)
const diffusionStrength = ref(1)
const threshold = ref(165)
const largeHeight = ref(240)

const logoWidth = (heightPx: number) => `${heightPx * LOGO_ASPECT}px`

const ditherProps = computed(() => ({
  imageSrc: IMAGE_SRC,
  gridSize: gridSize.value,
  scale: scale.value,
  dotScale: dotScale.value,
  invert: invert.value,
  cornerRadius: cornerRadius.value,
  contrast: contrast.value,
  gamma: gamma.value,
  blur: blur.value,
  diffusionStrength: diffusionStrength.value,
  threshold: threshold.value,
}))

const configSnippet = computed(() =>
  JSON.stringify(
    {
      imageSrc: IMAGE_SRC,
      gridSize: gridSize.value,
      scale: scale.value,
      dotScale: dotScale.value,
      invert: invert.value,
      cornerRadius: cornerRadius.value,
      contrast: contrast.value,
      gamma: gamma.value,
      blur: blur.value,
      diffusionStrength: diffusionStrength.value,
      threshold: threshold.value,
      class: invert.value ? 'dark:invert' : '',
    },
    null,
    2,
  ),
)

async function copyConfig() {
  await navigator.clipboard.writeText(configSnippet.value)
}
</script>

<template>
  <div class="mx-auto max-w-4xl space-y-10">
    <header class="space-y-2">
      <p class="text-sm font-medium text-primary">
        Logo lab 2
      </p>
      <h1 class="text-2xl font-semibold tracking-tight text-default">
        Floyd–Steinberg dither
      </h1>
      <p class="max-w-2xl text-sm text-muted">
        Stock
        <a
          href="https://github.com/marr/dithered-logo-vue"
          class="text-primary hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >dithered-logo-vue</a>
        port — particle halftone with cursor repulsion and click ripples (interaction scales to canvas size).
        Separate from
        <NuxtLink to="/logo-demo" class="text-primary hover:underline">
          negative-space lab
        </NuxtLink>.
      </p>
    </header>

    <section class="space-y-3">
      <h2 class="text-sm font-medium text-default">
        Source asset
      </h2>
      <div class="flex flex-wrap items-end gap-6 rounded-xl border border-default/50 bg-elevated/30 p-6">
        <div class="space-y-2">
          <p class="text-xs text-muted">
            Solid mark (base)
          </p>
          <img
            src="/logo-solid.png"
            alt="DM logo solid"
            class="h-24 w-auto dark:invert"
            width="116"
            height="150"
          />
        </div>
        <div class="space-y-2">
          <p class="text-xs text-muted">
            Dither input (white silhouette)
          </p>
          <img
            :src="IMAGE_SRC"
            alt="DM logo dither source"
            class="h-24 w-auto rounded-md border border-default/40 bg-[#1a1a1a] p-3"
            width="669"
            height="493"
          />
        </div>
      </div>
    </section>

    <section class="space-y-3">
      <h2 class="text-sm font-medium text-default">
        Large preview
        <span class="font-normal text-muted">— hover / click for ripples</span>
      </h2>
      <div class="rounded-xl border border-default/50 bg-elevated/50 p-8">
        <div
          class="mx-auto overflow-visible"
          :style="{ width: logoWidth(largeHeight), height: `${largeHeight}px` }"
        >
          <ClientOnly>
            <SiteDitheredLogo
              v-bind="ditherProps"
              :class="invert ? 'size-full dark:invert' : 'size-full'"
            />
          </ClientOnly>
        </div>
      </div>
    </section>

    <section class="space-y-3">
      <h2 class="text-sm font-medium text-default">
        Header size (h-10)
      </h2>
      <div class="flex h-14 items-center border-b border-default/40 px-4">
        <div
          class="h-10 shrink-0 overflow-visible"
          :style="{ width: logoWidth(40) }"
        >
          <ClientOnly>
            <SiteDitheredLogo
              v-bind="ditherProps"
              :class="invert ? 'size-full dark:invert' : 'size-full'"
            />
          </ClientOnly>
        </div>
      </div>
    </section>

    <UCard>
      <template #header>
        <h2 class="font-medium text-default">
          Controls
        </h2>
      </template>

      <div class="grid gap-6 sm:grid-cols-2">
        <UFormField label="Grid size">
          <USlider v-model="gridSize" :min="80" :max="320" :step="10" />
        </UFormField>

        <UFormField label="Large preview height (px)">
          <USlider v-model="largeHeight" :min="120" :max="320" :step="8" />
        </UFormField>

        <UFormField label="Scale">
          <USlider v-model="scale" :min="0.2" :max="1" :step="0.05" />
        </UFormField>

        <UFormField label="Dot scale">
          <USlider v-model="dotScale" :min="0.5" :max="2" :step="0.1" />
        </UFormField>

        <UFormField label="Corner radius">
          <USlider v-model="cornerRadius" :min="0" :max="0.5" :step="0.05" />
        </UFormField>

        <UFormField label="Contrast">
          <USlider v-model="contrast" :min="0" :max="120" :step="5" />
        </UFormField>

        <UFormField label="Gamma">
          <USlider v-model="gamma" :min="0.5" :max="2" :step="0.05" />
        </UFormField>

        <UFormField label="Pre-blur (px)">
          <USlider v-model="blur" :min="0" :max="8" :step="0.25" />
        </UFormField>

        <UFormField label="Diffusion strength">
          <USlider v-model="diffusionStrength" :min="0" :max="1.5" :step="0.05" />
        </UFormField>

        <UFormField label="Dither threshold">
          <USlider v-model="threshold" :min="100" :max="220" :step="2" />
        </UFormField>

        <UFormField
          label="Invert mask"
          hint="Off: halftone on the mark. On: dots fill a rounded field with letters cut out (the whole canvas becomes the bubble)."
        >
          <USwitch v-model="invert" />
        </UFormField>
      </div>

      <template #footer>
        <div class="space-y-3">
          <div class="flex items-center justify-between gap-3">
            <p class="text-sm text-muted">
              Copy JSON when ready to wire into a component.
            </p>
            <UButton size="sm" label="Copy JSON" @click="copyConfig" />
          </div>
          <pre class="overflow-x-auto rounded-lg bg-muted/50 p-3 text-xs text-default">{{ configSnippet }}</pre>
        </div>
      </template>
    </UCard>

    <p class="text-center text-sm text-muted">
      <NuxtLink to="/" class="text-primary hover:underline">
        ← Back home
      </NuxtLink>
    </p>
  </div>
</template>

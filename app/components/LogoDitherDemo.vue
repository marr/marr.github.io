<script setup lang="ts">
/** Negative-space dither lab — /logo-demo */

const LOGO_ASPECT = 658 / 395
const FIELD_DOTS: [number, number, number] = [52, 58, 70]
const IMAGE_SRC = '/logo-dither-source-dm.png'

const gridSize = ref(32)
const dotScale = ref(0.66)
const contrast = ref(42)
const threshold = ref(165)
const letterLumaMin = ref(150)
const blur = ref(0)
const diffusionStrength = ref(0.75)
const cornerRadius = ref(0.2)
const largeHeight = ref(160)

const dotR = ref(FIELD_DOTS[0])
const dotG = ref(FIELD_DOTS[1])
const dotB = ref(FIELD_DOTS[2])

const dotRgb = computed<[number, number, number]>(() => [dotR.value, dotG.value, dotB.value])
const logoWidth = (heightPx: number) => `${heightPx * LOGO_ASPECT}px`

const ditherProps = computed(() => ({
  imageSrc: IMAGE_SRC,
  gridSize: gridSize.value,
  scale: 1,
  dotScale: dotScale.value,
  contrast: contrast.value,
  blur: blur.value,
  threshold: threshold.value,
  diffusionStrength: diffusionStrength.value,
  letterLumaMin: letterLumaMin.value,
  dotRgb: dotRgb.value,
  invert: true,
  cornerRadius: cornerRadius.value,
}))

const configSnippet = computed(() =>
  JSON.stringify(
    {
      gridSize: gridSize.value,
      dotScale: dotScale.value,
      contrast: contrast.value,
      threshold: threshold.value,
      blur: blur.value,
      diffusionStrength: diffusionStrength.value,
      letterLumaMin: letterLumaMin.value,
      dotRgb: dotRgb.value,
      invert: true,
      cornerRadius: cornerRadius.value,
      imageSrc: IMAGE_SRC,
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
        Logo lab
      </p>
      <h1 class="text-2xl font-semibold tracking-tight text-default">
        Negative-space halftone
      </h1>
      <p class="max-w-2xl text-sm text-muted">
        Dots fill the rounded field; D/M letters are punched out as negative space.
        Letter luma cutoff keeps edges crisp — raise it for wider cutout, lower for tighter letters.
        See also
        <NuxtLink to="/logo-demo2" class="text-primary hover:underline">
          Floyd–Steinberg lab
        </NuxtLink>.
      </p>
    </header>

    <section class="space-y-3">
      <h2 class="text-sm font-medium text-default">
        Large preview
        <span class="font-normal text-muted">— hover / click for ripples</span>
      </h2>
      <div class="rounded-xl border border-default/50 bg-elevated/50 p-8">
        <div
          class="mx-auto overflow-visible rounded-lg"
          :style="{ width: logoWidth(largeHeight), height: `${largeHeight}px` }"
        >
          <ClientOnly>
            <SiteDitheredLogo
              v-bind="ditherProps"
              class="size-full dark:invert"
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
          class="h-10 shrink-0 overflow-visible rounded-lg"
          :style="{ width: logoWidth(40) }"
        >
          <ClientOnly>
            <SiteDitheredLogo
              v-bind="ditherProps"
              class="size-full dark:invert"
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
          <USlider v-model="gridSize" :min="24" :max="80" :step="2" />
        </UFormField>

        <UFormField label="Large preview height (px)">
          <USlider v-model="largeHeight" :min="80" :max="280" :step="8" />
        </UFormField>

        <UFormField label="Dot scale">
          <USlider v-model="dotScale" :min="0.5" :max="1" :step="0.02" />
        </UFormField>

        <UFormField label="Corner radius">
          <USlider v-model="cornerRadius" :min="0" :max="0.4" :step="0.02" />
        </UFormField>

        <UFormField label="Contrast">
          <USlider v-model="contrast" :min="0" :max="60" :step="1" />
        </UFormField>

        <UFormField
          label="Letter luma cutoff"
          hint="Cells at or above this luma stay cut out (negative space)."
        >
          <USlider v-model="letterLumaMin" :min="100" :max="220" :step="2" />
          <p class="mt-1 text-xs text-muted">
            {{ letterLumaMin }} — white letters ~255, field ~78
          </p>
        </UFormField>

        <UFormField label="Dither threshold">
          <USlider v-model="threshold" :min="100" :max="220" :step="2" />
        </UFormField>

        <UFormField label="Pre-blur (px)">
          <USlider v-model="blur" :min="0" :max="4" :step="0.25" />
        </UFormField>

        <UFormField label="Diffusion strength">
          <USlider v-model="diffusionStrength" :min="0.5" :max="1" :step="0.05" />
        </UFormField>

        <UFormField label="Dot R">
          <USlider v-model="dotR" :min="0" :max="255" :step="1" />
        </UFormField>

        <UFormField label="Dot G">
          <USlider v-model="dotG" :min="0" :max="255" :step="1" />
        </UFormField>

        <UFormField label="Dot B">
          <USlider v-model="dotB" :min="0" :max="255" :step="1" />
        </UFormField>
      </div>

      <template #footer>
        <div class="space-y-3">
          <div class="flex items-center justify-between gap-3">
            <p class="text-sm text-muted">
              Copy JSON when ready to update SiteLogo.
            </p>
            <UButton size="sm" label="Copy JSON" @click="copyConfig" />
          </div>
          <pre class="overflow-x-auto rounded-lg bg-muted/50 p-3 text-xs text-default">{{ configSnippet }}</pre>
        </div>
      </template>
    </UCard>
  </div>
</template>

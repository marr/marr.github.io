<script setup lang="ts">
import { useSlots } from 'vue'

const props = defineProps<{
  href?: string
}>()

const slots = useSlots()

// Map social URLs and labels to Iconify icons
const socialIconMap: Record<string, string> = {
  'github.com': 'i-mdi-github',
  'linkedin.com': 'i-mdi-linkedin',
  'x.com': 'i-mdi-twitter',
  'twitter.com': 'i-mdi-twitter',
  'tel:': 'i-mdi-phone',
  'mailto:': 'i-mdi-email',
  'geo:': 'i-mdi-map-marker',
  'maps.google.com': 'i-mdi-map-marker',
  'nuxt-maplibre/demo/map/markers': 'i-mdi-map-marker',
  'marr.github.io': 'i-mdi-web',
}

// Map text labels to icons (handles both "Website:" and "Website" formats)
const textLabelMap: Record<string, string> = {
  'github': 'i-mdi-github',
  'linkedin': 'i-mdi-linkedin',
  'x': 'i-mdi-twitter',
  'twitter': 'i-mdi-twitter',
  'tel': 'i-mdi-phone',
  'phone': 'i-mdi-phone',
  'email': 'i-mdi-email',
  'location': 'i-mdi-map-marker',
  'website': 'i-mdi-web',
  'web': 'i-mdi-web',
}

// Determine if this is a social link and get the appropriate icon
const socialInfo = computed(() => {
  if (!props.href) return null

  // First check if href matches a social pattern
  for (const [pattern, icon] of Object.entries(socialIconMap)) {
    if (props.href.includes(pattern)) {
      return { icon }
    }
  }

  // Then check if slot content matches a text label (handling "Label: " prefix from rendercv)
  const slotContent = slots.default?.()[0]?.children?.toString()?.toLowerCase().trim()
  if (slotContent) {
    // Strip potential "Label: " prefix from rendercv
    const cleanedContent = slotContent.replace(/^\w+:\s*/, '')
    for (const [label, icon] of Object.entries(textLabelMap)) {
      if (cleanedContent === label || slotContent === label) {
        return { icon }
      }
    }
  }

  return null
})
</script>

<template>
  <!-- Render icon + text for social links -->
  <span v-if="socialInfo" class="inline-flex items-center gap-1">
    <UIcon :name="socialInfo.icon" class="w-4 h-4" />
    <a
      :href="href"
      target="_blank"
      rel="noopener noreferrer"
      class="hover:underline"
    >
      <slot />
    </a>
  </span>
  <!-- Regular links render normally -->
  <NuxtLink
    v-else
    :href="href"
    target="_blank"
    rel="noopener noreferrer"
  >
    <slot />
  </NuxtLink>
</template>

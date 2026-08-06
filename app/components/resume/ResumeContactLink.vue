<script setup lang="ts">
import type { ResumeProfileLink } from "~/types/resume";

const props = defineProps<{
  link: ResumeProfileLink;
}>();

const iconName = computed(() => {
  const key = props.link.icon ?? props.link.label.toLowerCase();
  const map: Record<string, string> = {
    mail: "i-lucide-mail",
    email: "i-lucide-mail",
    "map-pin": "i-lucide-map-pin",
    location: "i-lucide-map-pin",
    globe: "i-lucide-globe",
    website: "i-lucide-globe",
    github: "i-simple-icons-github",
    linkedin: "i-simple-icons-linkedin",
    x: "i-simple-icons-x",
    bluesky: "i-simple-icons-bluesky",
    phone: "i-lucide-phone",
    link: "i-lucide-link",
  };
  return map[key] ?? "i-lucide-link";
});
</script>

<template>
  <div class="flex items-center gap-2 text-sm min-w-0">
    <UIcon
      :name="iconName"
      class="size-4 shrink-0 text-muted"
      aria-hidden="true"
    />
    <a
      v-if="link.href"
      :href="link.href"
      class="truncate text-default underline decoration-primary/40 underline-offset-2 hover:text-primary"
      :aria-label="`${link.label}: ${link.text}`"
      :target="link.external || link.href.startsWith('http') ? '_blank' : undefined"
      :rel="
        link.external || link.href.startsWith('http')
          ? 'noopener noreferrer'
          : undefined
      "
    >
      {{ link.text }}
    </a>
    <span v-else class="truncate text-default">{{ link.text }}</span>
  </div>
</template>

<template>
  <section
    id="career"
    aria-labelledby="career-timeline-heading"
    class="scroll-mt-24 border-t border-default/20 py-10"
  >
    <header class="mb-8 max-w-prose border-l-2 border-primary/40 pl-4">
      <p class="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
        Timeline
      </p>
      <h2
        id="career-timeline-heading"
        class="mt-2 text-2xl font-bold tracking-tight text-default"
      >
        How the work evolved
      </h2>
    </header>

    <UTimeline
      :items="items"
      :default-value="activeIndex"
      color="primary"
      class="w-full"
      :ui="{ description: 'text-pretty max-w-prose' }"
    />
  </section>
</template>

<script setup lang="ts">
import type { TimelineItem } from "@nuxt/ui";
import { careerTimelineItems } from "~/utils/homeStoryContent";

interface Props {
  items?: TimelineItem[];
}

const props = defineProps<Props>();

const items = computed(() => props.items ?? careerTimelineItems);
const activeIndex = computed(() => items.value.length - 1);
</script>

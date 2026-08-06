<template>
  <section id="home-story" aria-labelledby="home-story-heading" class="pb-4 pt-2">
    <h2 id="home-story-heading" class="sr-only">
      What I focus on
    </h2>
    <ul class="grid gap-4 md:grid-cols-3">
      <li
        v-for="pillar in pillars"
        :key="pillar.title"
        class="rounded-lg border border-default bg-elevated/30 p-5"
      >
        <h2 class="text-sm font-semibold text-default">
          {{ pillar.title }}
        </h2>
        <p class="mt-2 text-sm leading-relaxed text-muted text-pretty">
          {{ pillar.body }}
        </p>
        <ul
          v-if="pillar.highlights?.length"
          class="mt-3 space-y-1.5 border-t border-default/40 pt-3"
        >
          <li
            v-for="highlight in pillar.highlights"
            :key="highlight"
            class="flex gap-2 text-xs leading-relaxed text-muted text-pretty"
          >
            <span class="text-primary" aria-hidden="true">·</span>
            <span>{{ highlight }}</span>
          </li>
        </ul>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import { executiveSummary } from "~/utils/homeStoryContent";

interface Props {
  pillars?: typeof executiveSummary.pillars;
}

const props = defineProps<Props>();

const pillars = computed(() => props.pillars ?? executiveSummary.pillars);
</script>

<template>
  <section aria-labelledby="home-story" class="pb-4 pt-2">
    <div id="home-story" class="mx-auto max-w-4xl">
      <UCarousel
        v-slot="{ item }"
        :items="graphics"
        arrows
        dots
        class="w-full"
        :ui="{
          item: 'basis-full min-w-0 ps-0',
          viewport: 'overflow-hidden rounded-lg ring-1 ring-default/40',
        }"
      >
        <figure>
          <img
            :src="item.src"
            :alt="item.alt"
            :width="item.width"
            :height="item.height"
            class="h-auto w-full"
            loading="lazy"
          />
          <figcaption class="sr-only">
            {{ item.caption }}
          </figcaption>
        </figure>
      </UCarousel>
    </div>

    <ul class="mt-10 grid gap-4 md:grid-cols-3">
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
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import {
  careerGraphics,
  executiveSummary,
  type CareerGraphic,
} from "~/utils/homeStoryContent";

interface Props {
  graphics?: CareerGraphic[];
  pillars?: typeof executiveSummary.pillars;
}

const props = defineProps<Props>();

const graphics = computed(() => props.graphics ?? careerGraphics);
const pillars = computed(() => props.pillars ?? executiveSummary.pillars);
</script>

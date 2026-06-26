<template>
  <section
    aria-labelledby="home-ai-approach"
    class="border-t border-default/20 py-10"
  >
    <header class="mb-6 max-w-prose border-l-2 border-primary/40 pl-4">
      <p class="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
        Approach
      </p>
      <h2
        id="home-ai-approach"
        class="mt-2 text-2xl font-bold tracking-tight text-default"
      >
        How I work with AI
      </h2>
    </header>

    <article class="max-w-prose rounded-lg border border-default bg-elevated/30 p-5">
      <p class="text-sm leading-relaxed text-muted text-pretty">
        {{ intro }}
      </p>
      <ul class="mt-4 space-y-2">
        <li
          v-for="link in links"
          :key="link.url"
          class="text-sm leading-relaxed"
        >
          <ULink
            :to="link.url"
            target="_blank"
            class="font-medium text-default hover:text-primary transition-colors"
          >
            {{ link.label }}
          </ULink>
          <span class="text-muted"> — {{ link.hint }}</span>
        </li>
      </ul>
    </article>
  </section>
</template>

<script setup lang="ts">
import {
  aiTasteIntro,
  tasteLinks,
  type TasteLink,
} from "~/utils/homeStoryContent";

interface Props {
  intro?: string;
  links?: TasteLink[];
}

const props = defineProps<Props>();

const intro = computed(() => props.intro ?? aiTasteIntro);
const links = computed(() => props.links ?? tasteLinks);
</script>

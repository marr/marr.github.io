<template>
  <section
    aria-labelledby="home-ai-approach"
    :class="embedded ? 'min-w-0' : 'border-t border-default/20 py-10'"
  >
    <header
      class="mb-6 border-l-2 border-primary/40 pl-4"
      :class="embedded ? 'max-w-none' : 'max-w-prose'"
    >
      <p class="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
        Approach
      </p>
      <h2
        id="home-ai-approach"
        class="mt-2 font-bold tracking-tight text-default"
        :class="embedded ? 'text-lg' : 'text-2xl'"
      >
        How I work with AI
      </h2>
    </header>

    <article
      class="rounded-lg border border-default bg-elevated/30 p-4"
      :class="embedded ? 'max-w-none' : 'max-w-prose p-5'"
    >
      <p
        class="leading-relaxed text-muted text-pretty"
        :class="embedded ? 'text-xs' : 'text-sm'"
      >
        {{ intro }}
      </p>
      <ul class="mt-3 space-y-2">
        <li
          v-for="link in links"
          :key="link.url"
          class="leading-relaxed"
          :class="embedded ? 'text-xs' : 'text-sm'"
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
  embedded?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  embedded: false,
});

const intro = computed(() => props.intro ?? aiTasteIntro);
const links = computed(() => props.links ?? tasteLinks);
</script>

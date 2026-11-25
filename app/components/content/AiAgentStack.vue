<template>
  <section aria-labelledby="ai-agent-stack" class="pb-6 pt-2">
    <header class="mb-6 max-w-prose border-l-2 border-primary/40 pl-4">
      <p class="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
        Stack
      </p>
      <h2
        id="ai-agent-stack"
        class="mt-2 text-2xl font-bold tracking-tight text-default"
      >
        Pi, Cursor, and the bridge
      </h2>
      <p class="mt-3 text-sm leading-relaxed text-muted text-pretty">
        {{ introText }}
      </p>
    </header>

    <ul class="grid gap-4 md:grid-cols-3">
      <li
        v-for="item in items"
        :key="item.title"
        class="rounded-lg border border-default bg-elevated/30 p-5"
      >
        <div class="flex items-start gap-3">
          <div
            v-if="item.image || item.icon"
            class="flex shrink-0 items-center justify-center rounded-lg bg-elevated/80 p-2.5 ring-1 ring-inset ring-default/30"
          >
            <img
              v-if="item.image"
              :src="item.image"
              :alt="item.title"
              :class="[
                'size-5 object-contain',
                item.imageInvert ? 'invert dark:invert-0' : '',
              ]"
            />
            <UIcon
              v-else
              :name="item.icon"
              class="size-5 text-default"
            />
          </div>
          <div class="min-w-0">
            <ULink
              :to="item.url"
              target="_blank"
              class="font-semibold text-default hover:text-primary transition-colors"
            >
              {{ item.title }}
            </ULink>
            <p class="mt-2 text-sm leading-relaxed text-muted text-pretty">
              {{ item.description }}
            </p>
          </div>
        </div>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import {
  agentStackIntro,
  agentStackItems,
  type AgentStackItem,
} from "~/utils/aiPageContent";

interface Props {
  intro?: string;
  items?: AgentStackItem[];
}

const props = defineProps<Props>();

const introText = computed(() => props.intro ?? agentStackIntro);
const items = computed(() => props.items ?? agentStackItems);
</script>
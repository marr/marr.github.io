<template>
  <section class="pt-10 mt-4 border-t border-default/20">
    <header
      v-if="title || description"
      class="mb-6 max-w-prose border-l-2 border-primary/25 pl-4"
    >
      <h2
        v-if="title"
        class="text-xl font-semibold tracking-tight text-default"
      >
        {{ title }}
      </h2>
      <p
        v-if="description"
        class="mt-2 text-sm leading-relaxed text-muted"
      >
        {{ description }}
      </p>
    </header>
    <ul class="home-stagger-list space-y-3 max-w-prose">
      <li
        v-for="(item, i) in items"
        :key="i"
        class="text-sm leading-relaxed"
      >
        <ULink
          :to="item.url"
          target="_blank"
          class="font-medium text-default hover:text-primary transition-colors"
        >
          {{ item.label }}
        </ULink>
        <span
          v-if="item.hint"
          class="text-muted"
        >
          — {{ item.hint }}
        </span>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
interface LinkItem {
  label: string
  url: string
  /** Short gloss after the link (em dash in template). */
  hint?: string
}

interface Props {
  title?: string
  description?: string
  items: LinkItem[]
}

defineProps<Props>()
</script>

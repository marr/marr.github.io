<script setup lang="ts">
import type { ResumeProfile } from "~/types/resume";
import { resumeSectionNav } from "~/types/resume";

defineProps<{
  profile: ResumeProfile;
}>();

const sectionItems = computed(() =>
  resumeSectionNav.map((item) => ({
    label: item.label,
    to: item.to,
  })),
);
</script>

<template>
  <UPageAside
    class="resume-profile-aside"
    :ui="{
      root: 'sticky top-20 self-start w-full lg:max-w-[15rem]',
    }"
  >
    <div class="space-y-6 pb-8">
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
          Résumé
        </p>
        <h1 class="mt-2 text-2xl font-bold tracking-tight text-highlighted">
          {{ profile.name }}
        </h1>
        <p
          v-if="profile.headline"
          class="mt-2 text-sm leading-snug text-muted text-pretty"
        >
          {{ profile.headline }}
        </p>
      </div>

      <UButton
        :to="profile.pdfHref"
        target="_blank"
        rel="noopener noreferrer"
        icon="i-lucide-file-down"
        label="Download PDF"
        color="primary"
        variant="soft"
        block
      />

      <nav aria-label="Contact">
        <p class="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted">
          Contact
        </p>
        <ul class="space-y-2.5">
          <li v-for="link in profile.links" :key="link.label">
            <ResumeContactLink :link="link" />
          </li>
        </ul>
      </nav>

      <nav aria-label="Résumé sections">
        <p class="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted">
          On this page
        </p>
        <UNavigationMenu
          :items="sectionItems"
          orientation="vertical"
          :ui="{
            link: 'text-sm text-muted hover:text-default py-1.5',
            linkLeadingIcon: 'hidden',
          }"
        />
      </nav>
    </div>
  </UPageAside>
</template>

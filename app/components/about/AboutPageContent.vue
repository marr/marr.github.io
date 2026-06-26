<script setup lang="ts">
import {
  careerTimelineItems,
  closingStatement,
  executiveSummary,
  journeyAlt,
  journeySections,
  journeySkillGroups,
  journeyGraphicFixes,
  openSourceProjects,
  skillGroups,
  siteRepo,
  staples,
  tasteLinks,
  timelineAlt,
  timelineGraphicFixes,
  timelineGraphicStack,
  workbenchAreas,
} from "~/utils/aboutContent";

/** Highlight through the latest era (read-only career history). */
const careerTimelineActive = careerTimelineItems.length - 1;
</script>

<template>
  <div class="space-y-20 md:space-y-24">
    <!-- Executive summary -->
    <section aria-labelledby="about-intro" class="max-w-prose">
      <p class="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
        About
      </p>
      <h1
        id="about-intro"
        class="mt-3 text-balance text-3xl font-bold tracking-tight text-default md:text-4xl"
      >
        Engineering leadership, 25 years of shipping software
      </h1>
      <p class="mt-5 text-lg leading-relaxed text-muted text-pretty">
        {{ executiveSummary.lede }}
      </p>
    </section>

    <!-- Three pillars -->
    <section aria-labelledby="about-pillars" class="space-y-6">
      <h2 id="about-pillars" class="sr-only">
        Core strengths
      </h2>
      <ul class="grid gap-4 md:grid-cols-3">
        <li
          v-for="pillar in executiveSummary.pillars"
          :key="pillar.title"
          class="rounded-lg border border-default bg-elevated/30 p-5"
        >
          <h3 class="text-sm font-semibold text-default">
            {{ pillar.title }}
          </h3>
          <p class="mt-2 text-sm leading-relaxed text-muted">
            {{ pillar.body }}
          </p>
        </li>
      </ul>
    </section>

    <!-- Journey infographic -->
    <section aria-labelledby="journey-visual" class="space-y-5">
      <header class="max-w-prose border-l-2 border-primary/40 pl-4">
        <p class="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
          Visual overview
        </p>
        <h2
          id="journey-visual"
          class="mt-2 text-xl font-bold tracking-tight text-default"
        >
          Career highlights at a glance
        </h2>
        <p class="mt-2 text-sm leading-relaxed text-muted">
          Corrected text is below—the graphic may still show a few NotebookLM typos
          in small labels.
        </p>
      </header>
      <figure class="space-y-6">
        <img
          src="/about-journey.webp"
          :alt="journeyAlt"
          class="h-auto w-full rounded-lg ring-1 ring-default/40"
          width="2048"
          height="1142"
          sizes="(min-width: 896px) 864px, calc(100vw - 2rem)"
          loading="eager"
          fetchpriority="high"
          decoding="async"
          aria-describedby="journey-details"
        />

        <figcaption id="journey-details" class="space-y-8">
          <div
            v-for="section in journeySections"
            :key="section.label"
            class="space-y-4"
          >
            <h3 class="text-sm font-semibold uppercase tracking-[0.1em] text-muted">
              {{ section.label }}
            </h3>
            <ul class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <li
                v-for="highlight in section.highlights"
                :key="highlight.title"
                class="rounded-lg border border-default bg-default/50 p-4"
              >
                <h4 class="text-sm font-semibold leading-snug text-default">
                  {{ highlight.title }}
                </h4>
                <p class="mt-2 text-sm leading-relaxed text-muted text-pretty">
                  {{ highlight.body }}
                </p>
              </li>
            </ul>
          </div>

          <div class="space-y-4">
            <h3 class="text-sm font-semibold uppercase tracking-[0.1em] text-muted">
              Core technical skills
            </h3>
            <div class="space-y-4">
              <div
                v-for="group in journeySkillGroups"
                :key="group.label"
                class="space-y-2"
              >
                <p class="text-xs font-medium text-default">
                  {{ group.label }}
                </p>
                <ul class="flex flex-wrap gap-2">
                  <li v-for="item in group.items" :key="item">
                    <UBadge color="neutral" variant="subtle" size="sm">
                      {{ item }}
                    </UBadge>
                  </li>
                </ul>
              </div>
            </div>
            <ul class="space-y-1 border-t border-default pt-4 text-xs leading-relaxed text-muted">
              <li v-for="fix in journeyGraphicFixes" :key="fix">
                {{ fix }}
              </li>
            </ul>
          </div>
        </figcaption>
      </figure>
    </section>

    <!-- Timeline infographic -->
    <section aria-labelledby="timeline-visual" class="space-y-5">
      <header class="max-w-prose border-l-2 border-primary/40 pl-4">
        <p class="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
          Career map
        </p>
        <h2
          id="timeline-visual"
          class="mt-2 text-xl font-bold tracking-tight text-default"
        >
          Four phases of the career
        </h2>
        <p class="mt-2 text-sm leading-relaxed text-muted">
          From factory-floor software to AI-assisted teams. Corrected labels are
          below—the graphic may still show NotebookLM typos in small text.
        </p>
      </header>
      <figure class="space-y-6">
        <img
          src="/about-timeline.webp"
          :alt="timelineAlt"
          class="h-auto w-full rounded-lg ring-1 ring-default/40"
          width="2048"
          height="1142"
          sizes="(min-width: 896px) 864px, calc(100vw - 2rem)"
          loading="lazy"
          decoding="async"
          aria-describedby="timeline-details"
        />
        <figcaption id="timeline-details" class="space-y-4 rounded-lg border border-default bg-default/50 p-4">
          <h3 class="text-sm font-semibold text-default">
            Modern stack (corrected)
          </h3>
          <div class="grid gap-4 sm:grid-cols-2">
            <div>
              <p class="text-xs font-medium uppercase tracking-wide text-muted">
                Staples
              </p>
              <ul class="mt-2 flex flex-wrap gap-2">
                <li v-for="item in timelineGraphicStack.staples" :key="item">
                  <UBadge color="neutral" variant="subtle" size="sm">
                    {{ item }}
                  </UBadge>
                </li>
              </ul>
            </div>
            <div>
              <p class="text-xs font-medium uppercase tracking-wide text-muted">
                Workbench
              </p>
              <ul class="mt-2 flex flex-wrap gap-2">
                <li v-for="item in timelineGraphicStack.workbench" :key="item">
                  <UBadge color="neutral" variant="subtle" size="sm">
                    {{ item }}
                  </UBadge>
                </li>
              </ul>
            </div>
          </div>
          <ul class="space-y-1 border-t border-default pt-4 text-xs leading-relaxed text-muted">
            <li v-for="fix in timelineGraphicFixes" :key="fix">
              {{ fix }}
            </li>
          </ul>
        </figcaption>
      </figure>
    </section>

    <!-- Narrative timeline -->
    <section aria-labelledby="career-timeline" class="space-y-8">
      <header class="max-w-prose border-l-2 border-primary/40 pl-4">
        <p class="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
          Timeline
        </p>
        <h2
          id="career-timeline"
          class="mt-2 text-2xl font-bold tracking-tight text-default"
        >
          How the work evolved
        </h2>
      </header>

      <UTimeline
        :items="careerTimelineItems"
        :default-value="careerTimelineActive"
        color="primary"
        class="w-full"
        :ui="{ description: 'text-pretty max-w-prose' }"
      />
    </section>

    <!-- Staples -->
    <section aria-labelledby="about-staples" class="space-y-6">
      <header class="max-w-prose border-l-2 border-primary/40 pl-4">
        <p class="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
          Stack
        </p>
        <h2
          id="about-staples"
          class="mt-2 text-2xl font-bold tracking-tight text-default"
        >
          Tools I reach for often
        </h2>
        <p class="mt-2 text-sm leading-relaxed text-muted">
          Long-running choices for shipping real products.
        </p>
      </header>

      <div class="overflow-hidden rounded-lg border border-default">
        <div
          class="hidden grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,2fr)] gap-4 border-b border-default bg-elevated/50 px-4 py-3 text-xs font-semibold uppercase tracking-[0.1em] text-muted md:grid"
        >
          <span>Category</span>
          <span>Technology</span>
          <span>Why it matters</span>
        </div>
        <ul class="divide-y divide-default">
          <li
            v-for="row in staples"
            :key="row.technology"
            class="grid gap-1 px-4 py-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,2fr)] md:gap-4 md:py-3"
          >
            <p class="text-xs font-medium uppercase tracking-wide text-muted md:hidden">
              {{ row.category }}
            </p>
            <p class="hidden text-sm text-muted md:block">
              {{ row.category }}
            </p>
            <p class="text-sm font-semibold text-default">
              {{ row.technology }}
            </p>
            <p class="text-sm leading-relaxed text-muted md:col-start-3">
              {{ row.utility }}
            </p>
          </li>
        </ul>
      </div>
    </section>

    <!-- Workbench -->
    <section aria-labelledby="about-workbench" class="space-y-6">
      <header class="max-w-prose border-l-2 border-primary/40 pl-4">
        <p class="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
          Exploring
        </p>
        <h2
          id="about-workbench"
          class="mt-2 text-2xl font-bold tracking-tight text-default"
        >
          On the workbench
        </h2>
        <p class="mt-2 text-sm leading-relaxed text-muted">
          Infrastructure and tools worth trying in depth.
        </p>
      </header>

      <ul class="grid gap-4 md:grid-cols-3">
        <li
          v-for="area in workbenchAreas"
          :key="area.title"
          class="rounded-lg border border-default bg-default/50 p-5"
        >
          <h3 class="text-sm font-semibold text-default">
            {{ area.title }}
          </h3>
          <p class="mt-2 text-sm leading-relaxed text-muted">
            {{ area.thesis }}
          </p>
          <ul class="mt-4 space-y-1.5">
            <li
              v-for="item in area.items"
              :key="item"
              class="text-sm text-default before:mr-2 before:text-primary before:content-['·']"
            >
              {{ item }}
            </li>
          </ul>
        </li>
      </ul>
    </section>

    <!-- Innovation -->
    <section aria-labelledby="about-innovation" class="space-y-6">
      <header class="max-w-prose border-l-2 border-primary/40 pl-4">
        <p class="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
          Approach
        </p>
        <h2
          id="about-innovation"
          class="mt-2 text-2xl font-bold tracking-tight text-default"
        >
          How I work with AI
        </h2>
      </header>

      <div class="grid gap-4 md:grid-cols-2">
        <article class="rounded-lg border border-default p-5">
          <h3 class="text-sm font-semibold text-default">
            The Ralph Loop
          </h3>
          <p class="mt-2 text-sm leading-relaxed text-muted text-pretty">
            An experiment in AI-driven development—now in the archive, but it
            shaped how I think about agent workflows. I retire experiments the
            same way I cut features: keep what earns its place.
          </p>
          <ULink
            to="https://claytonfarr.github.io/ralph-playbook/"
            target="_blank"
            class="mt-3 inline-block text-sm font-medium text-primary hover:underline underline-offset-3"
          >
            Ralph Loop playbook →
          </ULink>
        </article>

        <article class="rounded-lg border border-default p-5">
          <h3 class="text-sm font-semibold text-default">
            AI with taste
          </h3>
          <p class="mt-2 text-sm leading-relaxed text-muted text-pretty">
            Small UI details and clear layouts matter more when AI generates the
            first draft. Polish is what makes the result feel intentional.
          </p>
          <ul class="mt-4 space-y-2">
            <li
              v-for="link in tasteLinks"
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
      </div>
    </section>

    <!-- Open source -->
    <section aria-labelledby="about-oss" class="space-y-6">
      <header class="max-w-prose border-l-2 border-primary/40 pl-4">
        <p class="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
          Open source
        </p>
        <h2
          id="about-oss"
          class="mt-2 text-2xl font-bold tracking-tight text-default"
        >
          Open source projects
        </h2>
        <p class="mt-2 text-sm leading-relaxed text-muted">
          Code you can read and reuse—plus notes when the web platform catches up.
        </p>
      </header>

      <ul class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <li v-for="project in openSourceProjects" :key="project.title">
          <UCard
            :ui="{
              root: 'h-full ring-1 ring-inset ring-default/40',
            }"
          >
            <div class="flex h-full flex-col gap-3">
              <div class="flex items-start gap-3">
                <div
                  v-if="project.icon"
                  class="flex shrink-0 items-center justify-center rounded-lg bg-elevated/80 p-2 ring-1 ring-inset ring-default/30"
                >
                  <UIcon :name="project.icon" class="size-5" />
                </div>
                <div>
                  <ULink
                    :to="project.url"
                    target="_blank"
                    class="font-semibold text-default hover:text-primary transition-colors"
                  >
                    {{ project.title }}
                  </ULink>
                  <p class="mt-1 text-sm leading-relaxed text-muted">
                    {{ project.description }}
                  </p>
                </div>
              </div>
              <div class="mt-auto flex flex-wrap gap-2">
                <UBadge
                  v-for="tag in project.tags"
                  :key="tag"
                  color="neutral"
                  variant="subtle"
                  size="xs"
                >
                  {{ tag }}
                </UBadge>
              </div>
            </div>
          </UCard>
        </li>
      </ul>
    </section>

    <!-- Skills -->
    <section aria-labelledby="about-skills" class="space-y-6">
      <header class="max-w-prose border-l-2 border-primary/40 pl-4">
        <p class="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
          Skills
        </p>
        <h2
          id="about-skills"
          class="mt-2 text-2xl font-bold tracking-tight text-default"
        >
          What I work with
        </h2>
      </header>

      <div class="space-y-6">
        <div
          v-for="group in skillGroups"
          :key="group.title"
          class="space-y-3"
        >
          <h3 class="text-sm font-semibold text-default">
            {{ group.title }}
          </h3>
          <ul class="flex flex-wrap gap-2">
            <li v-for="item in group.items" :key="item">
              <UBadge color="neutral" variant="subtle" size="sm">
                {{ item }}
              </UBadge>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Site source -->
    <section aria-labelledby="about-source" class="space-y-6">
      <header class="max-w-prose border-l-2 border-primary/40 pl-4">
        <p class="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
          Source
        </p>
        <h2
          id="about-source"
          class="mt-2 text-2xl font-bold tracking-tight text-default"
        >
          This site
        </h2>
        <p class="mt-2 text-sm leading-relaxed text-muted">
          The repo for the portfolio you are reading.
        </p>
      </header>

      <UCard
        :ui="{
          root: 'ring-1 ring-inset ring-default/40',
        }"
      >
        <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div class="flex gap-3">
            <div
              class="flex shrink-0 items-center justify-center rounded-lg bg-elevated/80 p-2.5 ring-1 ring-inset ring-default/30"
            >
              <UIcon name="i-mdi-github" class="size-5" />
            </div>
            <div>
              <ULink
                :to="siteRepo.url"
                target="_blank"
                class="font-semibold text-default hover:text-primary transition-colors"
              >
                {{ siteRepo.title }}
              </ULink>
              <p class="mt-1 max-w-prose text-sm leading-relaxed text-muted text-pretty">
                {{ siteRepo.description }}
              </p>
              <div class="mt-3 flex flex-wrap gap-2">
                <UBadge
                  v-for="tag in siteRepo.tags"
                  :key="tag"
                  color="neutral"
                  variant="subtle"
                  size="xs"
                >
                  {{ tag }}
                </UBadge>
              </div>
            </div>
          </div>
          <UButton
            :to="siteRepo.url"
            target="_blank"
            color="neutral"
            variant="outline"
            icon="i-mdi-open-in-new"
            class="shrink-0"
          >
            View on GitHub
          </UButton>
        </div>
      </UCard>
    </section>

    <!-- Closing -->
    <section
      aria-labelledby="about-closing"
      class="rounded-lg border border-default bg-elevated/30 px-6 py-8 md:px-8"
    >
      <h2 id="about-closing" class="sr-only">
        Summary
      </h2>
      <p class="max-w-prose text-base leading-relaxed text-default text-pretty">
        {{ closingStatement }}
      </p>
      <div class="mt-6 flex flex-wrap gap-3">
        <UButton to="/resume" color="primary" variant="solid">
          Read the résumé
        </UButton>
        <UButton to="/" color="neutral" variant="outline">
          View projects
        </UButton>
      </div>
    </section>
  </div>
</template>

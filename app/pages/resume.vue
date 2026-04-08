<script setup lang="ts">
import ResumeProseExperienceH3 from "~/components/resume/ResumeProseExperienceH3.vue";

const { data: page } = await useAsyncData("resume-page", () =>
  queryCollection("content").path("/resume").first(),
);

if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Page not found",
    fatal: true,
  });
}

useSeoMeta({
  title: page.value.seo?.title || page.value.title,
  description: page.value.seo?.description || page.value.description,
});

/** Maps markdown `h3` to SSR logo + heading (see components/resume/ResumeProseExperienceH3.vue). */
const resumeContentComponents = { h3: ResumeProseExperienceH3 };
</script>

<template>
  <UPageBody v-if="page" class="pb-16 pt-2 md:pt-4">
    <div
      class="resume-shell relative overflow-hidden rounded-2xl border border-default/60 bg-elevated/40 shadow-sm ring-1 ring-inset ring-default/10 md:rounded-3xl"
    >
      <div
        class="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-default/20 to-transparent"
        aria-hidden="true"
      />
      <div class="relative px-5 py-8 sm:px-8 sm:py-10 md:px-12 md:py-12">
        <div>
          <ContentRenderer
            :value="page"
            class="resume-content"
            :components="resumeContentComponents"
          />
        </div>
      </div>
    </div>
  </UPageBody>
</template>

<style scoped>
/*
 * Web résumé DOM contract (content/resume.md):
 * - scripts/harmonize_resume_headings.py: one h1 (name), section h2 (Summary, Experience, …),
 *   each role/school is h3 (**Company**, title).
 * - Typical role block: h3 → p (location) → p (dates) → p (summary) → ul (bullets).
 * - Education (RenderCV md): h3 → p (location) → p (dates) → p (degree) → p (e.g. Dean's List).
 * - Section h2 headings are plain text; role h3 lines use <strong> for the company name (logo match).
 */

.resume-content {
  font-size: 0.9375rem;
  line-height: 1.65;
  color: var(--ui-text);
}

.resume-content :deep(p:first-child) {
  margin: 0 0 1.75rem;
  padding: 0.65rem 1rem;
  border-radius: var(--ui-radius);
  border: 1px solid var(--ui-border);
  background: color-mix(in oklab, var(--ui-bg-muted) 65%, transparent);
  font-size: 0.875rem;
}

.resume-content :deep(p:first-child a) {
  font-weight: 600;
}

.resume-content :deep(h1) {
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.2;
  color: var(--ui-text-highlighted);
  scroll-margin-top: 5rem;
}

.resume-content :deep(h1:first-of-type) {
  margin: 0 0 0.5rem;
  font-size: clamp(1.625rem, 4vw, 2.125rem);
}

/* Section labels: Summary, Experience, Education, Skills (no <strong> in the heading) */
.resume-content :deep(h2:not(:has(strong))) {
  margin: 2.75rem 0 1rem;
  padding-bottom: 0.5rem;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--ui-primary);
  border-bottom: 1px solid color-mix(in oklab, var(--ui-border) 80%, transparent);
}

.resume-content :deep(h2:not(:has(strong)):first-of-type) {
  margin-top: 1.25rem;
}

.resume-content :deep(ul:first-of-type) {
  margin: 0 0 2rem;
  padding: 0;
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem 1.25rem;
  font-size: 0.875rem;
  color: var(--ui-text-muted);
}

.resume-content :deep(ul:first-of-type li) {
  position: relative;
  padding-left: 0;
}

.resume-content :deep(ul:first-of-type li::before) {
  display: none;
}

.resume-content :deep(ul:first-of-type a) {
  color: var(--ui-text);
  text-decoration: underline;
  text-decoration-color: color-mix(in oklab, var(--ui-primary) 45%, transparent);
  text-underline-offset: 3px;
}

.resume-content :deep(ul:first-of-type a:hover) {
  color: var(--ui-primary);
}

.resume-content :deep(h2:first-of-type + p) {
  margin-top: 0;
  margin-bottom: 1.25rem;
  max-width: 65ch;
  font-size: 0.9375rem;
  line-height: 1.65;
  color: var(--ui-text);
}

.resume-content :deep(h3) {
  margin: 2rem 0 0.35rem;
  padding-left: 0;
  border-left: none;
  font-size: 1.05rem;
  font-weight: 600;
  line-height: 1.35;
  color: var(--ui-text-highlighted);
  text-wrap: balance;
  scroll-margin-top: 4rem;
}

.resume-content :deep(h2 + h3) {
  margin-top: 1rem;
}

.resume-content :deep(h3 + h3) {
  margin-top: 2rem;
}

/* Logo chip(s), company line, and role title on one line (wraps when narrow) */
.resume-content :deep(h3:has(.resume-exp-logo-wrap)) {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  column-gap: 0.65rem;
  row-gap: 0.35rem;
  padding-left: 0;
}

.resume-content :deep(h3:has(.resume-exp-logo-wrap) > .resume-exp-logo-wrap),
.resume-content :deep(h3:has(.resume-exp-logo-wrap) > .resume-exp-logo-group) {
  flex-shrink: 0;
  min-width: 2.75rem;
}

.resume-content :deep(.resume-exp-logo-group) {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.35rem 0.5rem;
  width: auto;
  max-width: 100%;
}

.resume-content :deep(.resume-exp-logo-group--stack) {
  flex-direction: column;
  align-items: flex-start;
  align-self: flex-start;
  gap: 0.4rem;
}

/* OneMarket + Westfield: row + gradient rule + staggered fade-in */
.resume-content :deep(.resume-exp-logo-group--pair) {
  align-items: center;
  gap: 0.35rem 0.55rem;
}

.resume-content :deep(.resume-exp-logo-divider) {
  display: inline-flex;
  align-items: center;
  align-self: stretch;
  padding: 0 0.05rem;
  flex-shrink: 0;
}

.resume-content :deep(.resume-exp-logo-divider__line) {
  display: block;
  width: 1px;
  height: 1.35rem;
  border-radius: 1px;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    color-mix(in oklab, var(--ui-border) 85%, var(--ui-text-muted)) 40%,
    color-mix(in oklab, var(--ui-border) 85%, var(--ui-text-muted)) 60%,
    transparent 100%
  );
  opacity: 0.72;
  transition: opacity 0.22s ease, transform 0.22s ease;
}

.resume-content :deep(.resume-exp-logo-group--pair:hover .resume-exp-logo-divider__line) {
  opacity: 1;
}

@keyframes resume-exp-logo-pair-enter {
  from {
    opacity: 0;
    transform: translateY(0.28rem);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.resume-content :deep(.resume-exp-logo-group--pair .resume-exp-logo-wrap) {
  animation: resume-exp-logo-pair-enter 0.48s ease backwards;
}

.resume-content :deep(.resume-exp-logo-group--pair .resume-exp-logo-divider) {
  animation: resume-exp-logo-pair-enter 0.38s ease 0.05s backwards;
}

.resume-content :deep(.resume-exp-logo-group--pair .resume-exp-logo-wrap:nth-child(3)) {
  animation-delay: 0.1s;
}

@media (prefers-reduced-motion: reduce) {
  .resume-content :deep(.resume-exp-logo-group--pair .resume-exp-logo-wrap),
  .resume-content :deep(.resume-exp-logo-group--pair .resume-exp-logo-divider) {
    animation: none;
  }

  .resume-content :deep(.resume-exp-logo-divider__line) {
    transition: none;
  }
}

.resume-content :deep(.resume-exp-logo-group .resume-exp-logo-wrap--wide) {
  width: auto;
  flex: 0 1 auto;
  box-sizing: border-box;
  align-self: center;
}

.resume-content :deep(
  .resume-exp-logo-group .resume-exp-logo-wrap:not(.resume-exp-logo-wrap--wide)
) {
  align-self: center;
}

.resume-content :deep(.resume-exp-heading-text) {
  margin: 0;
  padding-left: 0;
  border-left: none;
  min-width: 0;
  flex: 1 1 auto;
}

.resume-content :deep(.resume-exp-logo-wrap) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: fit-content;
  max-width: 100%;
  min-height: 1.875rem;
  height: auto;
  min-width: 2.75rem;
  flex-shrink: 0;
  padding: 0 0.35rem;
  border-radius: calc(var(--ui-radius) + 2px);
  border: none;
  background: transparent;
}

.resume-content :deep(.resume-exp-logo-wrap--wide) {
  min-width: 5rem;
  padding: 0 0.5rem;
}

.resume-content :deep(.resume-exp-logo-wrap--light-foreground) {
  background: transparent;
}

.resume-content :deep(.resume-exp-logo-img) {
  display: block;
  width: 2.75rem;
  height: auto;
  max-height: 2.75rem;
  object-fit: contain;
  opacity: 0.95;
}

/* Companion mark smaller than primary (e.g. Westfield vs OneMarket) */
.resume-content :deep(.resume-exp-logo-img--companion-sm) {
  width: 2.125rem;
  max-height: 2.125rem;
}

.resume-content :deep(.resume-exp-logo-wrap--companion-sm) {
  min-width: 2.35rem;
  padding: 0 0.25rem;
}

/* Wide marks (wordmarks / rasters): keep below default chips so none dominate */
.resume-content :deep(.resume-exp-logo-img--wide) {
  width: auto;
  max-width: 7rem;
  max-height: 1.65rem;
}

.resume-content :deep(.resume-exp-logo-img--wide.resume-exp-logo-img--wide-tall) {
  max-height: 2.5rem;
}

.resume-content :deep(.resume-exp-logo-img--wide.resume-exp-logo-img--wide-tall-xl) {
  max-height: 3.125rem;
  max-width: 10rem;
}

.resume-content :deep(.resume-exp-logo-img--invert-dark) {
  @media (prefers-color-scheme: dark) {
    filter: invert(1) brightness(1.05);
  }
}

.dark .resume-content :deep(.resume-exp-logo-img--invert-dark) {
  filter: invert(1) brightness(1.05);
}

/* Light/dark asset pairs (e.g. black eyes vs pink eyes): no CSS filter */
.resume-content :deep(.resume-exp-logo-img--theme-light) {
  display: block;
}

.resume-content :deep(.resume-exp-logo-img--theme-dark) {
  display: none;
}

@media (prefers-color-scheme: dark) {
  .resume-content :deep(.resume-exp-logo-img--theme-light) {
    display: none;
  }

  .resume-content :deep(.resume-exp-logo-img--theme-dark) {
    display: block;
  }
}

.dark .resume-content :deep(.resume-exp-logo-img--theme-light) {
  display: none;
}

.dark .resume-content :deep(.resume-exp-logo-img--theme-dark) {
  display: block;
}

html.light .resume-content :deep(.resume-exp-logo-img--theme-light) {
  display: block;
}

html.light .resume-content :deep(.resume-exp-logo-img--theme-dark) {
  display: none;
}

/* Role meta: location, dates, then intro paragraph */
.resume-content :deep(h3 + p) {
  margin: 0.15rem 0 0;
  padding-left: 0;
  font-size: 0.8125rem;
  color: var(--ui-text-muted);
}

.resume-content :deep(h3 + p + p) {
  margin: 0.1rem 0 0;
  padding-left: 0;
  font-size: 0.8125rem;
  font-weight: 500;
  color: color-mix(in oklab, var(--ui-text-muted) 92%, var(--ui-text) 8%);
}

.resume-content :deep(h3 + p + p + p) {
  margin: 0.85rem 0 0;
  padding-left: 0;
  max-width: 65ch;
  font-size: 0.875rem;
  line-height: 1.6;
  color: var(--ui-text);
}

/*
 * Education: same paragraph order as Experience for the first two lines (location, dates),
 * then degree, then summary — overrides generic h3+p+p+p so the degree line isn’t body-sized.
 */
.resume-content :deep(h2:nth-of-type(3) + h3 + p + p + p) {
  margin: 0.5rem 0 0;
  padding-left: 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--ui-text);
}

.resume-content :deep(h2:nth-of-type(3) + h3 + p + p + p + p) {
  margin: 0.35rem 0 0;
  padding-left: 0;
  max-width: 65ch;
  font-size: 0.875rem;
  line-height: 1.6;
  font-weight: 400;
  color: var(--ui-text);
}

/* Roles without a mapped logo: slight inset so meta + body align with the shell */
.resume-content :deep(h3:not(:has(.resume-exp-logo-wrap)) + p) {
  padding-left: 0.65rem;
}

.resume-content :deep(h3:not(:has(.resume-exp-logo-wrap)) + p + p) {
  padding-left: 0.65rem;
}

.resume-content :deep(h3:not(:has(.resume-exp-logo-wrap)) + p + p + p) {
  padding-left: 0.65rem;
}

.resume-content :deep(h3:has(.resume-exp-logo-wrap) + p) {
  padding-left: 0;
}

.resume-content :deep(h3:has(.resume-exp-logo-wrap) + p + p) {
  padding-left: 0;
}

.resume-content :deep(h3:has(.resume-exp-logo-wrap) + p + p + p) {
  padding-left: 0;
}

.resume-content :deep(h3:has(.resume-exp-logo-wrap) + p + p + p + p) {
  padding-left: 0;
}

.resume-content :deep(p) {
  margin: 0 0 1rem;
  text-wrap: pretty;
}

.resume-content :deep(ul:not(:first-of-type)) {
  margin: 0.5rem 0 1.25rem;
  padding-left: 1.15rem;
}

.resume-content :deep(ul:not(:first-of-type) li) {
  margin: 0.35rem 0;
  padding-left: 0.35rem;
}

.resume-content :deep(ul:not(:first-of-type) li::marker) {
  color: color-mix(in oklab, var(--ui-text-muted) 88%, var(--ui-text) 12%);
}

.resume-content :deep(a) {
  color: var(--ui-primary);
}

.resume-content :deep(a:hover) {
  text-decoration: underline;
  text-underline-offset: 3px;
}

/* MDC wraps section labels (Summary, …) in <a href="#…">; keep them label-like, not body links */
.resume-content :deep(h2:not(:has(strong)) a) {
  color: inherit;
  text-decoration: none;
  font-weight: inherit;
  letter-spacing: inherit;
}

.resume-content :deep(h2:not(:has(strong)) a:hover) {
  text-decoration: underline;
  text-decoration-color: color-mix(in oklab, var(--ui-primary) 50%, transparent);
  text-underline-offset: 3px;
}

.resume-content :deep(h2:not(:has(strong)) a:focus-visible) {
  outline: 2px solid color-mix(in oklab, var(--ui-primary) 45%, transparent);
  outline-offset: 3px;
  border-radius: 2px;
}

.resume-content :deep(strong) {
  font-weight: 600;
  color: var(--ui-text-highlighted);
}

/* Skills block: paragraphs after the last section h2 */
.resume-content :deep(h2:last-of-type ~ p) {
  margin-bottom: 0.65rem;
  font-size: 0.875rem;
  line-height: 1.55;
}

.resume-content :deep(h2:last-of-type ~ p strong) {
  min-width: fit-content;
  margin-right: 0.35rem;
}
</style>

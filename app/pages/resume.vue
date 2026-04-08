<script setup lang="ts">
import { nextTick, onMounted, onUpdated, ref, watch } from "vue";
import { useMutationObserver } from "@vueuse/core";
import type { EarlierLogoItem } from "~/utils/resumeEarlierLogos";
import { RESUME_EARLIER_LOGOS } from "~/utils/resumeEarlierLogos";
import {
  logoForResumeCompany,
  parseCompanyFromExperienceHeading,
  resumeExperienceLogoSignature,
} from "~/utils/resumeExperienceLogos";

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

const resumeRoot = ref<HTMLElement | null>(null);

/** Undo experience h2 decoration (logo group/pill + heading text wrapper). */
function stripExperienceHeadingDecoration(h2: HTMLElement) {
  const textWrap = h2.querySelector(":scope > .resume-exp-heading-text");
  if (textWrap) {
    while (textWrap.firstChild) {
      h2.insertBefore(textWrap.firstChild, textWrap);
    }
    textWrap.remove();
  }
  h2.querySelector(":scope > .resume-exp-logo-group")?.remove();
  h2.querySelector(":scope > .resume-exp-logo-wrap")?.remove();
}

function decorateExperienceLogos(root: HTMLElement) {
  root.querySelectorAll("h2").forEach((node) => {
    const h2 = node as HTMLElement;
    const company = parseCompanyFromExperienceHeading(
      h2.textContent ?? "",
    );
    if (!company) {
      return;
    }
    const logo = logoForResumeCompany(company);
    if (!logo) {
      return;
    }
    const cfg = logo;

    const sig = resumeExperienceLogoSignature(cfg);
    const existing =
      h2.querySelector(":scope > .resume-exp-logo-group") ??
      h2.querySelector(":scope > .resume-exp-logo-wrap");
    if (existing?.getAttribute("data-resume-logo") === sig) {
      return;
    }

    stripExperienceHeadingDecoration(h2);

    function makeLogoPill(src: string, pillWide: boolean): HTMLSpanElement {
      const wrap = document.createElement("span");
      wrap.className = [
        "resume-exp-logo-wrap",
        pillWide ? "resume-exp-logo-wrap--wide" : "",
        cfg.lightForeground ? "resume-exp-logo-wrap--light-foreground" : "",
      ]
        .filter(Boolean)
        .join(" ");
      wrap.setAttribute("aria-hidden", "true");
      const img = document.createElement("img");
      img.src = src;
      img.alt = "";
      img.className = [
        "resume-exp-logo-img",
        pillWide ? "resume-exp-logo-img--wide" : "",
        cfg.invertInDarkMode ? "resume-exp-logo-img--invert-dark" : "",
      ]
        .filter(Boolean)
        .join(" ");
      wrap.appendChild(img);
      return wrap;
    }

    const companionPillWide =
      cfg.companionWide !== undefined ? cfg.companionWide : !!cfg.wide;

    const companions = cfg.companionSrcs ?? [];
    let first: HTMLElement;
    if (companions.length > 0) {
      const group = document.createElement("span");
      group.className = "resume-exp-logo-group";
      group.setAttribute("data-resume-logo", sig);
      group.setAttribute("aria-hidden", "true");
      group.appendChild(makeLogoPill(cfg.src, !!cfg.wide));
      for (const src of companions) {
        group.appendChild(makeLogoPill(src, companionPillWide));
      }
      first = group;
    } else {
      const wrap = makeLogoPill(cfg.src, !!cfg.wide);
      wrap.setAttribute("data-resume-logo", sig);
      first = wrap;
    }

    h2.insertBefore(first, h2.firstChild);

    const textWrap = document.createElement("span");
    textWrap.className = "resume-exp-heading-text";
    while (first.nextSibling) {
      textWrap.appendChild(first.nextSibling);
    }
    h2.appendChild(textWrap);
  });
}

function fillEarlierRowTitle(el: HTMLDivElement, item: EarlierLogoItem) {
  const headline = document.createElement("div");
  headline.className = "resume-earlier-row__headline";

  if (item.kind === "text") {
    const s = document.createElement("strong");
    s.textContent = item.text;
    headline.appendChild(s);
    if (item.role) {
      headline.appendChild(document.createTextNode(", "));
      headline.appendChild(document.createTextNode(item.role));
    }
    el.appendChild(headline);
    if (item.dates) {
      const d = document.createElement("div");
      d.className = "resume-earlier-row__dates";
      d.textContent = item.dates;
      el.appendChild(d);
    }
    return;
  }

  const company = item.company ?? item.label;
  const strong = document.createElement("strong");
  strong.textContent = company;
  headline.appendChild(strong);
  if (item.role) {
    headline.appendChild(document.createTextNode(", "));
    headline.appendChild(document.createTextNode(item.role));
  }
  el.appendChild(headline);
  if (item.dates) {
    const d = document.createElement("div");
    d.className = "resume-earlier-row__dates";
    d.textContent = item.dates;
    el.appendChild(d);
  }
}

function decorateEarlierRolesStrip(root: HTMLElement) {
  root.querySelectorAll("h2").forEach((node) => {
    const h2 = node as HTMLElement;
    const title = h2.textContent ?? "";
    if (!/Earlier roles/i.test(title)) {
      return;
    }
    const loc = h2.nextElementSibling;
    if (!loc || loc.tagName !== "P") {
      return;
    }
    const dates = loc.nextElementSibling;
    if (!dates || dates.tagName !== "P") {
      return;
    }
    if (dates.nextElementSibling?.classList.contains("resume-earlier-list")) {
      return;
    }

    const list = document.createElement("div");
    list.className = "resume-earlier-list";
    list.setAttribute("role", "list");

    for (const item of RESUME_EARLIER_LOGOS) {
      const row = document.createElement("div");
      row.className = "resume-earlier-row";
      row.setAttribute("role", "listitem");

      const title = document.createElement("div");
      title.className = "resume-earlier-row__title";

      if (item.kind === "text") {
        const spacer = document.createElement("div");
        spacer.className = "resume-earlier-row__mark resume-earlier-row__mark--spacer";
        spacer.setAttribute("aria-hidden", "true");
        fillEarlierRowTitle(title, item);
        row.appendChild(spacer);
        row.appendChild(title);
        list.appendChild(row);
        continue;
      }

      const mark = document.createElement("div");
      mark.className = "resume-earlier-row__mark";
      mark.setAttribute("aria-hidden", "true");

      const cell = document.createElement("span");
      cell.className = "resume-earlier-logo";
      cell.title = item.label;
      if (item.prominent) {
        cell.classList.add("resume-earlier-logo--prominent");
      }
      if (item.squareContainer) {
        cell.classList.add("resume-earlier-logo--square");
      }
      if (item.frogSilhouette) {
        cell.classList.add("resume-earlier-logo--frog");
      }
      if (item.onDarkField) {
        cell.classList.add("resume-earlier-logo--dark-field");
      }
      const img = document.createElement("img");
      img.src = item.src;
      img.alt = "";
      if (item.invertInDarkMode) {
        img.classList.add("resume-exp-logo-img--invert-dark");
      }
      cell.appendChild(img);
      mark.appendChild(cell);

      fillEarlierRowTitle(title, item);

      row.appendChild(mark);
      row.appendChild(title);
      list.appendChild(row);
    }

    dates.insertAdjacentElement("afterend", list);
  });
}

function runDecorate() {
  const el = resumeRoot.value;
  if (el) {
    decorateExperienceLogos(el);
    decorateEarlierRolesStrip(el);
  }
}

onMounted(() => {
  void nextTick(() => {
    runDecorate();
    requestAnimationFrame(runDecorate);
  });
});

onUpdated(() => {
  void nextTick(runDecorate);
});

watch(page, () => void nextTick(runDecorate));

useMutationObserver(
  resumeRoot,
  () => {
    void nextTick(runDecorate);
  },
  {
    childList: true,
    subtree: true,
  },
);
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
        <div ref="resumeRoot">
          <ContentRenderer :value="page" class="resume-content" />
        </div>
      </div>
    </div>
  </UPageBody>
</template>

<style scoped>
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

.resume-content :deep(h1:nth-of-type(1)) {
  margin: 0 0 0.5rem;
  font-size: clamp(1.625rem, 4vw, 2.125rem);
}

.resume-content :deep(h1:nth-of-type(n + 2)) {
  margin: 2.75rem 0 1rem;
  padding-bottom: 0.5rem;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--ui-primary);
  border-bottom: 1px solid color-mix(in oklab, var(--ui-border) 80%, transparent);
}

.resume-content :deep(h1:nth-of-type(2)) {
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

.resume-content :deep(h2) {
  margin: 2rem 0 0.35rem;
  padding-left: 0;
  border-left: none;
  font-size: 1.05rem;
  font-weight: 600;
  line-height: 1.35;
  color: var(--ui-text-highlighted);
  text-wrap: balance;
}

/* Logo chip(s), company, and role title on one line (wraps when narrow) */
.resume-content :deep(h2:has(.resume-exp-logo-wrap)) {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  column-gap: 0.65rem;
  row-gap: 0.35rem;
  padding-left: 0;
}

.resume-content :deep(h2:has(.resume-exp-logo-wrap) > .resume-exp-logo-wrap),
.resume-content :deep(h2:has(.resume-exp-logo-wrap) > .resume-exp-logo-group) {
  flex-shrink: 0;
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
  height: 2.125rem;
  min-width: 2rem;
  padding: 0 0.5rem;
  border-radius: calc(var(--ui-radius) + 2px);
  border: 1px solid color-mix(in oklab, var(--ui-border) 88%, transparent);
  background: color-mix(in oklab, var(--ui-bg-muted) 50%, transparent);
}

.resume-content :deep(.resume-exp-logo-wrap--wide) {
  min-width: 6rem;
  padding: 0 0.55rem;
}

/* Light-colored logos (white wordmarks): readable on light theme */
.resume-content :deep(.resume-exp-logo-wrap--light-foreground) {
  background: color-mix(in oklab, var(--ui-text) 90%, var(--ui-bg-muted));
  border-color: color-mix(in oklab, var(--ui-text) 22%, var(--ui-border));
}

@media (prefers-color-scheme: dark) {
  .resume-content :deep(.resume-exp-logo-wrap--light-foreground) {
    background: color-mix(in oklab, var(--ui-bg-muted) 50%, transparent);
    border-color: color-mix(in oklab, var(--ui-border) 88%, transparent);
  }
}

.dark .resume-content :deep(.resume-exp-logo-wrap--light-foreground) {
  background: color-mix(in oklab, var(--ui-bg-muted) 50%, transparent);
  border-color: color-mix(in oklab, var(--ui-border) 88%, transparent);
}

.resume-content :deep(.resume-exp-logo-img) {
  display: block;
  max-width: 1.4rem;
  max-height: 1.28rem;
  width: auto;
  height: auto;
  object-fit: contain;
  opacity: 0.9;
}

.resume-content :deep(.resume-exp-logo-img--wide) {
  max-width: 7.4rem;
  max-height: 1.52rem;
}

.resume-content :deep(.resume-exp-logo-img--invert-dark) {
  @media (prefers-color-scheme: dark) {
    filter: invert(1) brightness(1.05);
  }
}

.dark .resume-content :deep(.resume-exp-logo-img--invert-dark) {
  filter: invert(1) brightness(1.05);
}

.resume-content :deep(h2:first-of-type) {
  margin-top: 0.5rem;
}

.resume-content :deep(h2 + p) {
  margin: 0.15rem 0 0;
  padding-left: 0;
  font-size: 0.8125rem;
  color: var(--ui-text-muted);
}

.resume-content :deep(h2 + p + p) {
  margin: 0.1rem 0 0;
  padding-left: 0;
  font-size: 0.8125rem;
  font-weight: 500;
  color: color-mix(in oklab, var(--ui-text-muted) 92%, var(--ui-text) 8%);
}

.resume-content :deep(h2 + p + p + p) {
  margin: 0.85rem 0 0;
  padding-left: 0;
  max-width: 65ch;
  font-size: 0.875rem;
  line-height: 1.6;
  color: var(--ui-text);
}

/* Headings without a logo chip: light inset so meta + body aren’t flush to the shell edge */
.resume-content :deep(h2:not(:has(.resume-exp-logo-wrap)) + p) {
  padding-left: 0.65rem;
}

.resume-content :deep(h2:not(:has(.resume-exp-logo-wrap)) + p + p) {
  padding-left: 0.65rem;
}

.resume-content :deep(h2:not(:has(.resume-exp-logo-wrap)) + p + p + p) {
  padding-left: 0.65rem;
}

/*
 * Earlier roles: one row per employer — same rhythm as experience (mark column + title line)
 */
.resume-content :deep(.resume-earlier-list) {
  --resume-earlier-inline: 0.65rem;

  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  box-sizing: border-box;
  max-width: 65ch;
  margin: 0.75rem 0 0;
  padding: 0.45rem 0 0;
  padding-left: var(--resume-earlier-inline);
  border-top: 1px solid color-mix(in oklab, var(--ui-border) 38%, transparent);
}

.resume-content :deep(.resume-earlier-row) {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  column-gap: 0.65rem;
  min-width: 0;
}

.resume-content :deep(.resume-earlier-row__mark) {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  min-width: 3.375rem;
}

.resume-content :deep(.resume-earlier-row__mark--spacer) {
  min-height: 2.125rem;
  box-sizing: border-box;
}

.resume-content :deep(.resume-earlier-row__title) {
  margin: 0;
  min-width: 0;
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.resume-content :deep(.resume-earlier-row__headline) {
  font-size: 1.05rem;
  font-weight: 600;
  line-height: 1.35;
  color: var(--ui-text-highlighted);
  text-wrap: balance;
}

.resume-content :deep(.resume-earlier-row__dates) {
  font-size: 0.8125rem;
  font-weight: 500;
  line-height: 1.35;
  color: color-mix(in oklab, var(--ui-text-muted) 92%, var(--ui-text) 8%);
}

.resume-content :deep(.resume-earlier-logo) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  min-height: 2.125rem;
  min-width: 2rem;
  padding: 0.2rem 0.45rem;
  border-radius: calc(var(--ui-radius) + 2px);
  /* Softer frame than main experience pills — marks read as supporting, not primary */
  border: 1px solid color-mix(in oklab, var(--ui-border) 52%, transparent);
  background: color-mix(in oklab, var(--ui-bg-muted) 42%, transparent);
}

.resume-content :deep(.resume-earlier-logo img) {
  display: block;
  max-width: 1.72rem;
  max-height: 1.6rem;
  width: auto;
  height: auto;
  object-fit: contain;
  opacity: 0.92;
}

/* Optional square tile wrapper for raster marks */
.resume-content :deep(.resume-earlier-logo--square) {
  width: 2.5rem;
  height: 2.5rem;
  min-width: 2.5rem;
  min-height: 2.5rem;
  padding: 0;
  border-radius: calc(var(--ui-radius) + 1px);
  overflow: hidden;
}

.resume-content :deep(.resume-earlier-logo--square img) {
  width: 100%;
  height: 100%;
  max-width: none;
  max-height: none;
  object-fit: contain;
  opacity: 1;
}

/* Frog: silhouette only (SVG has no green plate); transparent chip */
.resume-content :deep(.resume-earlier-logo--frog) {
  border-color: transparent;
  background: transparent;
  padding: 0;
  min-height: auto;
}

.resume-content :deep(.resume-earlier-logo--frog img) {
  max-width: 2rem;
  max-height: 2rem;
  opacity: 1;
}

@media (prefers-color-scheme: dark) {
  .resume-content :deep(.resume-earlier-logo--frog img) {
    filter: invert(1) brightness(1.08);
  }
}

.dark .resume-content :deep(.resume-earlier-logo--frog img) {
  filter: invert(1) brightness(1.08);
}

/* Larger drawable for detailed non-square marks (e.g. Secret Feature eyes) */
.resume-content :deep(.resume-earlier-logo--prominent:not(.resume-earlier-logo--square)) {
  min-width: 3rem;
  min-height: 2.45rem;
  padding: 0.2rem 0.5rem;
}

.resume-content :deep(.resume-earlier-logo--prominent:not(.resume-earlier-logo--square) img) {
  max-width: 2.65rem;
  max-height: 2.35rem;
  opacity: 1;
}

/* Light / transparent PNG on a near-white strip: dark field in light theme */
.resume-content :deep(.resume-earlier-logo--dark-field) {
  background: color-mix(in oklab, var(--ui-text) 88%, var(--ui-bg-muted));
  border-color: color-mix(in oklab, var(--ui-text) 22%, var(--ui-border));
}

@media (prefers-color-scheme: dark) {
  .resume-content :deep(.resume-earlier-logo--dark-field) {
    background: color-mix(in oklab, var(--ui-bg-muted) 50%, transparent);
    border-color: color-mix(in oklab, var(--ui-border) 52%, transparent);
  }
}

.dark .resume-content :deep(.resume-earlier-logo--dark-field) {
  background: color-mix(in oklab, var(--ui-bg-muted) 50%, transparent);
  border-color: color-mix(in oklab, var(--ui-border) 52%, transparent);
}

.resume-content :deep(.resume-earlier-logo-text) {
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: var(--ui-text-muted);
  white-space: nowrap;
  max-width: 7rem;
  overflow: hidden;
  text-overflow: ellipsis;
}

.resume-content :deep(.resume-earlier-logo-text--lower) {
  text-transform: lowercase;
  letter-spacing: 0.08em;
}

.resume-content :deep(.resume-earlier-list + p) {
  margin: 0.875rem 0 0;
  padding-left: 0.65rem;
  max-width: 65ch;
  font-size: 0.875rem;
  line-height: 1.6;
  color: var(--ui-text);
}

/* Meta + body share the same left edge as the title (logo sits above) */
.resume-content :deep(h2:has(.resume-exp-logo-wrap) + p) {
  padding-left: 0;
}

.resume-content :deep(h2:has(.resume-exp-logo-wrap) + p + p) {
  padding-left: 0;
}

.resume-content :deep(h2:has(.resume-exp-logo-wrap) + p + p + p) {
  padding-left: 0;
}

.resume-content :deep(p) {
  margin: 0 0 1rem;
  text-wrap: pretty;
}

.resume-content :deep(h1 + p) {
  margin-top: 0;
  margin-bottom: 1.25rem;
  max-width: 65ch;
  font-size: 0.9375rem;
  line-height: 1.65;
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

.resume-content :deep(strong) {
  font-weight: 600;
  color: var(--ui-text-highlighted);
}

.resume-content :deep(h1:last-of-type ~ p) {
  margin-bottom: 0.65rem;
  font-size: 0.875rem;
  line-height: 1.55;
}

.resume-content :deep(h1:last-of-type ~ p strong) {
  min-width: fit-content;
  margin-right: 0.35rem;
}
</style>

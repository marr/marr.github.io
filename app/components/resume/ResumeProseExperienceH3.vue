<template>
  <h3 :id="props.id" :class="{ 'resume-exp-h3--with-logo': !!decoration }">
    <template v-if="decoration">
      <template v-if="decoration.kind === 'group'">
        <span
          class="resume-exp-logo-group"
          :class="{
            'resume-exp-logo-group--stack': decoration.stack,
            'resume-exp-logo-group--pair': decoration.divider && !decoration.stack,
          }"
          :data-resume-logo="decoration.sig"
          aria-hidden="true"
        >
          <template
            v-for="(pill, idx) in decoration.pills"
            :key="idx"
          >
            <span
              v-if="idx > 0 && decoration.divider"
              class="resume-exp-logo-divider"
            ><span class="resume-exp-logo-divider__line" /></span>
            <span
              class="resume-exp-logo-wrap"
              :class="[
                pill.wide ? 'resume-exp-logo-wrap--wide' : '',
                pill.lightForeground ? 'resume-exp-logo-wrap--light-foreground' : '',
                pill.companionSm ? 'resume-exp-logo-wrap--companion-sm' : '',
              ]"
            >
              <template v-if="pill.srcDark">
                <img
                  :src="pill.src"
                  alt=""
                  :class="pill.imgClassLight"
                  loading="lazy"
                  decoding="async"
                >
                <img
                  :src="pill.srcDark"
                  alt=""
                  :class="pill.imgClassDark"
                  loading="lazy"
                  decoding="async"
                >
              </template>
              <span
                v-else-if="pill.themeTint"
                :class="pill.imgClass"
                :style="{
                  '--resume-logo-src': `url(${JSON.stringify(pill.src)})`,
                }"
              />
              <img
                v-else
                :src="pill.src"
                alt=""
                :class="pill.imgClass"
                loading="lazy"
                decoding="async"
              >
            </span>
          </template>
        </span>
      </template>
      <template v-else>
        <span
          class="resume-exp-logo-wrap"
          :class="[
            decoration.primary.wide ? 'resume-exp-logo-wrap--wide' : '',
            decoration.primary.lightForeground
              ? 'resume-exp-logo-wrap--light-foreground'
              : '',
          ]"
          :data-resume-logo="decoration.sig"
          aria-hidden="true"
        >
          <template v-if="decoration.primary.srcDark">
            <img
              :src="decoration.primary.src"
              alt=""
              :class="decoration.imgClassLight"
              loading="lazy"
              decoding="async"
            >
            <img
              :src="decoration.primary.srcDark"
              alt=""
              :class="decoration.imgClassDark"
              loading="lazy"
              decoding="async"
            >
          </template>
          <span
            v-else-if="decoration.themeTint"
            :class="decoration.imgClass"
            :style="{
              '--resume-logo-src': `url(${JSON.stringify(decoration.primary.src)})`,
            }"
          />
          <img
            v-else
            :src="decoration.primary.src"
            alt=""
            :class="decoration.imgClass"
            loading="lazy"
            decoding="async"
          >
        </span>
      </template>
      <span class="resume-exp-heading-text">
        <a
          v-if="generate"
          :href="`#${props.id}`"
        ><slot /></a>
        <slot v-else />
      </span>
    </template>
    <template v-else>
      <a
        v-if="generate"
        :href="`#${props.id}`"
      ><slot /></a>
      <slot v-else />
    </template>
  </h3>
</template>

<script setup lang="ts">
import { computed, useSlots } from "vue";
import { nodeTextContent } from "@nuxtjs/mdc/runtime";
import type { CompanionLogo, ResumeExperienceLogo } from "~/utils/resumeExperienceLogos";
import {
  logoForResumeCompany,
  parseCompanyFromExperienceHeading,
  resumeExperienceLogoSignature,
} from "~/utils/resumeExperienceLogos";

const props = defineProps<{
  id?: string;
}>();

const { headings } = useRuntimeConfig().public.mdc;
const generate = computed(
  () =>
    props.id
    && (typeof headings?.anchorLinks === "boolean" && headings.anchorLinks === true
      || typeof headings?.anchorLinks === "object"
        && headings?.anchorLinks?.h3),
);

const slots = useSlots();

/** MDC’s walker handles Text nodes (`value` vs `children`) and component slots — required for company matching (e.g. Tilt.com). */
const headingPlainText = computed(() => {
  const raw = slots.default?.();
  if (raw == null) {
    return "";
  }
  if (typeof raw === "string" || typeof raw === "number") {
    return String(raw);
  }
  return nodeTextContent(raw as never);
});

const company = computed(() =>
  parseCompanyFromExperienceHeading(headingPlainText.value),
);

const logoCfg = computed(() =>
  company.value ? logoForResumeCompany(company.value) : null,
);

function normalizeCompanion(c: CompanionLogo): {
  src: string;
  srcDark?: string;
  invertInDarkMode: boolean;
  wideTall?: boolean | "xl";
  smaller?: boolean;
} {
  if (typeof c === "string") {
    return { src: c, invertInDarkMode: false };
  }
  return {
    src: c.src,
    srcDark: c.srcDark,
    invertInDarkMode: !!c.invertInDarkMode,
    wideTall: c.wideTall,
    smaller: !!c.smaller,
  };
}

function imgClassList(
  wide: boolean,
  invert: boolean,
  wideTall: boolean | "xl" | undefined,
  themeTint?: boolean,
  maskAlpha?: boolean,
): string {
  const base = [
    "resume-exp-logo-img",
    wide ? "resume-exp-logo-img--wide" : "",
    wide && wideTall === true ? "resume-exp-logo-img--wide-tall" : "",
    wide && wideTall === "xl" ? "resume-exp-logo-img--wide-tall-xl" : "",
  ].filter(Boolean);
  if (themeTint) {
    return [
      ...base,
      "resume-exp-logo-img--theme-tint",
      maskAlpha ? "resume-exp-logo-img--mask-alpha" : "",
    ]
      .filter(Boolean)
      .join(" ");
  }
  return [...base, invert ? "resume-exp-logo-img--invert-dark" : ""]
    .filter(Boolean)
    .join(" ");
}

type Pill = {
  src: string;
  srcDark?: string;
  wide: boolean;
  lightForeground?: boolean;
  /** Companion pill scaled down vs primary (see `resume-exp-logo-img--companion-sm`). */
  companionSm?: boolean;
  /** Dark-on-transparent marks: CSS mask + `var(--ui-text)` (see resume.vue). */
  themeTint?: boolean;
  imgClass: string;
  imgClassLight?: string;
  imgClassDark?: string;
};

const decoration = computed(() => {
  const cfg = logoCfg.value;
  if (!cfg) {
    return null;
  }

  const sig = resumeExperienceLogoSignature(cfg);
  const companions = cfg.companionSrcs ?? [];
  const companionPillWide =
    cfg.companionWide !== undefined ? cfg.companionWide : !!cfg.wide;

  const primaryInvert = cfg.srcDark ? false : !!cfg.invertInDarkMode;
  const primaryThemeTint = primaryInvert && !cfg.srcDark;
  const primaryMaskAlpha = !!cfg.maskAlpha;
  const primaryBaseClass = imgClassList(
    !!cfg.wide,
    primaryThemeTint ? false : primaryInvert,
    cfg.wideTall,
    primaryThemeTint,
    primaryMaskAlpha,
  );

  if (companions.length > 0) {
    const pills: Pill[] = [
      cfg.srcDark
        ? {
            src: cfg.src,
            srcDark: cfg.srcDark,
            wide: !!cfg.wide,
            lightForeground: cfg.lightForeground,
            themeTint: false,
            imgClass: "",
            imgClassLight: `${primaryBaseClass} resume-exp-logo-img--theme-light`,
            imgClassDark: `${primaryBaseClass} resume-exp-logo-img--theme-dark`,
          }
        : {
            src: cfg.src,
            wide: !!cfg.wide,
            lightForeground: cfg.lightForeground,
            themeTint: primaryThemeTint,
            imgClass: primaryBaseClass,
          },
    ];
    for (const c of companions) {
      const {
        src,
        srcDark: companionSrcDark,
        invertInDarkMode,
        wideTall: companionWideTall,
        smaller: companionSmaller,
      } = normalizeCompanion(c);
      const companionThemeTint = !companionSrcDark && invertInDarkMode;
      const companionBase = imgClassList(
        companionPillWide,
        companionThemeTint ? false : (companionSrcDark ? false : invertInDarkMode),
        companionWideTall,
        companionThemeTint,
        false,
      );
      const sm = companionSmaller ? " resume-exp-logo-img--companion-sm" : "";
      if (companionSrcDark) {
        pills.push({
          src,
          srcDark: companionSrcDark,
          wide: companionPillWide,
          companionSm: companionSmaller,
          themeTint: false,
          imgClass: "",
          imgClassLight: `${companionBase}${sm} resume-exp-logo-img--theme-light`,
          imgClassDark: `${companionBase}${sm} resume-exp-logo-img--theme-dark`,
        });
      } else {
        pills.push({
          src,
          wide: companionPillWide,
          companionSm: companionSmaller,
          themeTint: companionThemeTint,
          imgClass: `${companionBase}${sm}`,
        });
      }
    }
    return {
      kind: "group" as const,
      sig,
      pills,
      stack: !!cfg.companionStack,
      divider: !!cfg.companionDivider,
    };
  }

  return cfg.srcDark
    ? {
        kind: "single" as const,
        sig,
        primary: cfg,
        themeTint: false,
        imgClass: "",
        imgClassLight: `${primaryBaseClass} resume-exp-logo-img--theme-light`,
        imgClassDark: `${primaryBaseClass} resume-exp-logo-img--theme-dark`,
      }
    : {
        kind: "single" as const,
        sig,
        primary: cfg,
        themeTint: primaryThemeTint,
        imgClass: primaryBaseClass,
      };
});
</script>

<template>
  <h3 :id="props.id" :class="{ 'resume-exp-h3--with-logo': !!decoration }">
    <template v-if="decoration">
      <template v-if="decoration.kind === 'group'">
        <span
          class="resume-exp-logo-group"
          :data-resume-logo="decoration.sig"
          aria-hidden="true"
        >
          <span
            v-for="(pill, idx) in decoration.pills"
            :key="idx"
            class="resume-exp-logo-wrap"
            :class="[
              pill.wide ? 'resume-exp-logo-wrap--wide' : '',
              pill.lightForeground ? 'resume-exp-logo-wrap--light-foreground' : '',
            ]"
          >
            <img
              :src="pill.src"
              alt=""
              :class="pill.imgClass"
              loading="lazy"
              decoding="async"
            >
          </span>
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
          <img
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
import { computed, useSlots, type VNode, type VNodeChild } from "vue";
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

function vnodeChildrenToText(children: VNodeChild | VNodeChild[]): string {
  if (children == null || children === false) {
    return "";
  }
  if (typeof children === "string" || typeof children === "number") {
    return String(children);
  }
  if (Array.isArray(children)) {
    return children.map((c) => vnodeChildrenToText(c)).join("");
  }
  if (typeof children === "object") {
    const vn = children as VNode;
    if (vn.children != null) {
      if (typeof vn.children === "string") {
        return vn.children;
      }
      if (Array.isArray(vn.children)) {
        return vnodeChildrenToText(vn.children);
      }
      // Component / slot vnodes
      const slotFn = (vn.children as { default?: () => VNodeChild[] }).default;
      if (typeof slotFn === "function") {
        return vnodeChildrenToText(slotFn());
      }
    }
  }
  return "";
}

const headingPlainText = computed(() => {
  const raw = slots.default?.();
  if (!raw) {
    return "";
  }
  return vnodeChildrenToText(raw);
});

const company = computed(() =>
  parseCompanyFromExperienceHeading(headingPlainText.value),
);

const logoCfg = computed(() =>
  company.value ? logoForResumeCompany(company.value) : null,
);

function normalizeCompanion(c: CompanionLogo): {
  src: string;
  invertInDarkMode: boolean;
} {
  if (typeof c === "string") {
    return { src: c, invertInDarkMode: false };
  }
  return { src: c.src, invertInDarkMode: !!c.invertInDarkMode };
}

function imgClassList(
  wide: boolean,
  invert: boolean,
  wideTall: boolean | "xl" | undefined,
): string {
  return [
    "resume-exp-logo-img",
    wide ? "resume-exp-logo-img--wide" : "",
    wide && wideTall === true ? "resume-exp-logo-img--wide-tall" : "",
    wide && wideTall === "xl" ? "resume-exp-logo-img--wide-tall-xl" : "",
    invert ? "resume-exp-logo-img--invert-dark" : "",
  ]
    .filter(Boolean)
    .join(" ");
}

type Pill = {
  src: string;
  wide: boolean;
  lightForeground?: boolean;
  imgClass: string;
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

  if (companions.length > 0) {
    const pills: Pill[] = [
      {
        src: cfg.src,
        wide: !!cfg.wide,
        lightForeground: cfg.lightForeground,
        imgClass: imgClassList(
          !!cfg.wide,
          !!cfg.invertInDarkMode,
          cfg.wideTall,
        ),
      },
    ];
    for (const c of companions) {
      const { src, invertInDarkMode } = normalizeCompanion(c);
      pills.push({
        src,
        wide: companionPillWide,
        imgClass: imgClassList(
          companionPillWide,
          invertInDarkMode,
          undefined,
        ),
      });
    }
    return { kind: "group" as const, sig, pills };
  }

  return {
    kind: "single" as const,
    sig,
    primary: cfg as ResumeExperienceLogo,
    imgClass: imgClassList(
      !!cfg.wide,
      !!cfg.invertInDarkMode,
      cfg.wideTall,
    ),
  };
});
</script>

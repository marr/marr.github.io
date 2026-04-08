/** Company name as it appears before the comma in rendered resume.md h3 role titles. */
export type ResumeCompanyName =
  | "Context Labs"
  | "Filtered.ai"
  | "Turo"
  | "OneMarket / Westfield Labs"
  | "Tilt.com"
  | "Say Media"
  | "Secret Feature"
  | "CBS Interactive"
  | "Frog Design"
  | "Yahoo"
  | "Monster.com"
  | "GE Fanuc / Intellution"
  | "SoftArtisans"
  | "University of New Hampshire";

/** Companion slot: string or explicit invert for dark UI (slate glyphs on light → invert on dark). */
export type CompanionLogo =
  | string
  | {
      src: string;
      /** Alternate asset for dark UI (e.g. white mark vs slate on light). */
      srcDark?: string;
      invertInDarkMode?: boolean;
      /** Match primary `wideTall` when set (e.g. Westfield square next to OneMarket wordmark). */
      wideTall?: boolean | "xl";
      /** Render smaller than the primary pill (e.g. Westfield next to OneMarket). */
      smaller?: boolean;
    };

export type ResumeExperienceLogo = {
  src: string;
  companionSrcs?: CompanionLogo[];
  /** Stack primary + companion logo pills vertically (default: row). */
  companionStack?: boolean;
  /** Between pills: gradient rule + stagger animation (implies row; use without stack). */
  companionDivider?: boolean;
  /**
   * Optional alternate asset for dark UI (e.g. pink mark on dark vs black on light).
   * When set, `invertInDarkMode` is ignored for this logo.
   */
  srcDark?: string;
  /**
   * When set, overrides `wide` for companion pills only.
   * Omit to match the primary (`wide`).
   */
  companionWide?: boolean;
  /** Invert raster/SVG in dark mode (works well with dark fills on light backgrounds). */
  invertInDarkMode?: boolean;
  /**
   * Legacy: light assets on transparent; prefer editing SVG fills instead.
   */
  lightForeground?: boolean;
  /** Icon + wordmark: wider logo cell for readability. */
  wide?: boolean;
  /**
   * With `wide`, default max-height is 2rem. `true` → 3rem cap; `"xl"` → taller + wider
   * max-width for very horizontal marks (UNH is width-limited before height).
   */
  wideTall?: boolean | "xl";
};

const LOGO_BY_COMPANY: Partial<
  Record<ResumeCompanyName, ResumeExperienceLogo>
> = {
  "Context Labs": {
    src: "/resume-logos/contextlabs.svg?v=1",
  },
  "Filtered.ai": { src: "/resume-logos/filtered.png" },
  Turo: { src: "/resume-logos/turo.svg", invertInDarkMode: true },
  /* Icon-only SVG (full wordmark asset not kept in repo) */
  "OneMarket / Westfield Labs": {
    src: "/resume-logos/one-market-icon.svg?v=5",
    companionSrcs: [
      {
        src: "/resume-logos/westfield-logo.svg?v=2",
        srcDark: "/resume-logos/westfield-logo-white.svg?v=1",
        smaller: true,
      },
    ],
    companionStack: false,
    companionDivider: true,
    companionWide: false,
  },
  "Tilt.com": { src: "/resume-logos/tilt-icon.svg?v=4" },
  /* SAY on black square — invert on dark UI for contrast */
  "Say Media": {
    src: "/resume-logos/say-bw.png?v=2",
    invertInDarkMode: true,
  },
  /* Eyes mark from brand SVG: slate on light UI, pink on dark */
  "Secret Feature": {
    src: "/resume-logos/secret-feature-eyes.svg?v=1",
    srcDark: "/resume-logos/secret-feature-eyes-dark.svg?v=2",
    wide: true,
    wideTall: true,
  },
  /* Red eye icon only (full wordmark too wide at chip size) */
  "CBS Interactive": {
    src: "/resume-logos/CBSi-icon.svg?v=2",
  },
  "Frog Design": {
    src: "/resume-logos/frog-design.svg",
    invertInDarkMode: true,
  },
  Yahoo: { src: "/resume-logos/earlier-yahoo.svg", invertInDarkMode: true },
  "Monster.com": {
    src: "/resume-logos/earlier-monster.svg",
    invertInDarkMode: true,
  },
  "GE Fanuc / Intellution": {
    src: "/resume-logos/earlier-ge.svg",
    invertInDarkMode: true,
  },
  /* Navy/grey on white — works on light UI; invert on dark */
  SoftArtisans: {
    src: "/resume-logos/softartisans-logo-light.png?v=1",
    wide: true,
    wideTall: true,
  },
  "University of New Hampshire": {
    src: "/resume-logos/unh-icon.svg?v=2",
    invertInDarkMode: true,
  },
};

/** Strip markdown bold markers from the company segment (handles unbalanced `**` from MDC). */
function normalizeCompanySegment(raw: string): string {
  return raw
    .trim()
    .replace(/\s+/g, " ")
    .replace(/\*\*/g, "")
    .trim();
}

export function parseCompanyFromExperienceHeading(
  text: string,
): ResumeCompanyName | null {
  const t = text
    .trim()
    .replace(/\u200b/g, "")
    .replace(/\s+/g, " ");
  const commaMatch = t.match(/[,\uFF0C]/);
  const comma = commaMatch?.index ?? -1;
  if (comma <= 0) {
    return null;
  }
  const name = normalizeCompanySegment(t.slice(0, comma));
  if (name in LOGO_BY_COMPANY) {
    return name as ResumeCompanyName;
  }
  const lower = name.toLowerCase();
  for (const key of Object.keys(LOGO_BY_COMPANY) as ResumeCompanyName[]) {
    if (key.toLowerCase() === lower) {
      return key;
    }
  }
  return null;
}

export function logoForResumeCompany(
  company: ResumeCompanyName,
): ResumeExperienceLogo | null {
  return LOGO_BY_COMPANY[company] ?? null;
}

function companionKey(c: CompanionLogo): string {
  if (typeof c === "string") {
    return c;
  }
  const wt =
    c.wideTall === "xl" ? "wtxl" : c.wideTall ? "wt" : "";
  const sm = c.smaller ? "s" : "";
  return `${c.src}|${c.srcDark ?? ""}|${c.invertInDarkMode ? "i" : ""}|${wt}|${sm}`;
}

/** Stable fingerprint for DOM: bump when mapping changes so resume page re-decorates. */
export function resumeExperienceLogoSignature(logo: ResumeExperienceLogo): string {
  return [
    logo.src,
    logo.srcDark ?? "",
    ...(logo.companionSrcs ?? []).map(companionKey),
    logo.companionStack ? "stack" : "",
    logo.companionDivider ? "div" : "",
    logo.wide ? "w" : "",
    logo.wideTall === "xl"
      ? "wtxl"
      : logo.wideTall
        ? "wt"
        : "",
    logo.companionWide === undefined ? "" : logo.companionWide ? "cw1" : "cw0",
    logo.lightForeground ? "l" : "",
    logo.invertInDarkMode ? "i" : "",
  ]
    .filter((segment) => segment !== "")
    .join("|");
}

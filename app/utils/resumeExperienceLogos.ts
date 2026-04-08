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
  | { src: string; invertInDarkMode?: boolean };

export type ResumeExperienceLogo = {
  src: string;
  companionSrcs?: CompanionLogo[];
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
    src: "/resume-logos/cxl-icon.svg",
    invertInDarkMode: true,
  },
  "Filtered.ai": { src: "/resume-logos/filtered.png" },
  Turo: { src: "/resume-logos/turo.svg", invertInDarkMode: true },
  "OneMarket / Westfield Labs": {
    src: "/resume-logos/one-market-logo.svg?v=2",
    companionSrcs: [
      { src: "/resume-logos/westfield-logo.svg?v=2", invertInDarkMode: true },
    ],
    companionWide: false,
    wide: true,
  },
  "Tilt.com": { src: "/resume-logos/tilt.svg?v=2", wide: true },
  /* Wordmark: same compact sizing as other marks (use a tight crop if illegible). */
  "Say Media": { src: "/resume-logos/say-logotype.jpeg" },
  /* Circular badge from brand sheet (secretfeature_seb.ai); invert on dark UI */
  "Secret Feature": {
    src: "/resume-logos/secret-feature-badge.png",
    invertInDarkMode: true,
  },
  /* Red eye + wordmark: slate on light / white in dark (SVG @media, like OneMarket) */
  "CBS Interactive": {
    src: "/resume-logos/CBSi-white.svg?v=3",
    wide: true,
    wideTall: true,
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
  /**
   * Options in public/resume-logos/: `softartisans-logo-light.png` (navy/grey on white, best on light UI),
   * `softartisans-logo-dark.png` (white on dark texture), legacy `softartisans-logo.gif` (horizontal strip).
   * `header-logo.png` in assets is a wide banner — poor at small sizes.
   */
  SoftArtisans: {
    src: "/resume-logos/softartisans-logo-light.png?v=1",
    wide: true,
    wideTall: true,
  },
  "University of New Hampshire": {
    src: "/resume-logos/unh-logo.svg?v=2",
    wide: true,
    wideTall: "xl",
    invertInDarkMode: true,
  },
};

/** Strip `**…**` from the company segment (RenderCV uses bold in headings). */
function normalizeCompanySegment(raw: string): string {
  const s = raw.trim();
  const mdBold = /^\*\*(.+)\*\*$/;
  const m = s.match(mdBold);
  return m ? m[1].trim() : s;
}

export function parseCompanyFromExperienceHeading(
  text: string,
): ResumeCompanyName | null {
  const t = text.trim();
  const comma = t.indexOf(",");
  if (comma <= 0) {
    return null;
  }
  const name = normalizeCompanySegment(t.slice(0, comma));
  if (name in LOGO_BY_COMPANY) {
    return name as ResumeCompanyName;
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
    return `${c}|`;
  }
  return `${c.src}|${c.invertInDarkMode ? "i" : ""}`;
}

/** Stable fingerprint for DOM: bump when mapping changes so resume page re-decorates. */
export function resumeExperienceLogoSignature(logo: ResumeExperienceLogo): string {
  return [
    logo.src,
    ...(logo.companionSrcs ?? []).map(companionKey),
    logo.wide ? "w" : "",
    logo.wideTall === "xl"
      ? "wtxl"
      : logo.wideTall
        ? "wt"
        : "",
    logo.companionWide === undefined ? "" : logo.companionWide ? "cw1" : "cw0",
    logo.lightForeground ? "l" : "",
    logo.invertInDarkMode ? "i" : "",
  ].join("|");
}

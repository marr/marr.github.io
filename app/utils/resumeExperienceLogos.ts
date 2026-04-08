/** Company name as it appears before the comma in rendered resume.md h2 titles. */
export type ResumeCompanyName =
  | "Context Labs"
  | "Filtered.ai"
  | "Turo"
  | "OneMarket / Westfield Labs"
  | "Tilt.com"
  | "Earlier roles (2000–2013)"
  | "University of New Hampshire";

export type ResumeExperienceLogo = {
  src: string;
  /** Extra marks in separate pills below the primary (e.g. Westfield under OneMarket). */
  companionSrcs?: string[];
  /**
   * When set, overrides `wide` for companion pills only.
   * Omit to match the primary (`wide`).
   */
  companionWide?: boolean;
  /** Invert colors in dark mode (e.g. wordmarks with dark fills). */
  invertInDarkMode?: boolean;
  /**
   * Logo is light-colored (e.g. white wordmark). Uses a dark pill in light
   * theme so it stays visible; normal muted pill in dark theme.
   */
  lightForeground?: boolean;
  /** Icon + wordmark: wider logo cell for readability. */
  wide?: boolean;
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
    src: "/resume-logos/one-market-logo.svg",
    companionSrcs: ["/resume-logos/westfield-logo.svg"],
    companionWide: false,
    wide: true,
    lightForeground: true,
  },
  "Tilt.com": { src: "/resume-logos/tilt.svg?v=2", wide: true },
  "University of New Hampshire": {
    src: "/resume-logos/unh-logo.svg",
    wide: true,
    lightForeground: true,
  },
};

export function parseCompanyFromExperienceHeading(
  text: string,
): ResumeCompanyName | null {
  const t = text.trim();
  const comma = t.indexOf(",");
  if (comma <= 0) {
    return null;
  }
  const name = t.slice(0, comma).trim();
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

/** Stable fingerprint for DOM: bump when mapping changes so resume page re-decorates. */
export function resumeExperienceLogoSignature(logo: ResumeExperienceLogo): string {
  return [
    logo.src,
    ...(logo.companionSrcs ?? []),
    logo.wide ? "w" : "",
    logo.companionWide === undefined ? "" : logo.companionWide ? "cw1" : "cw0",
    logo.lightForeground ? "l" : "",
    logo.invertInDarkMode ? "i" : "",
  ].join("|");
}

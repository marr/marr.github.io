/** Logos and wordmarks under the “Earlier roles” experience block (HTML only). */
export type EarlierLogoImg = {
  kind: "img";
  src: string;
  /** Tooltip / accessible context */
  label: string;
  invertInDarkMode?: boolean;
  /** Larger pill + image when the mark is detailed (e.g. mascot at small sizes). */
  prominent?: boolean;
  /** Full square frame (e.g. brand tile behind mark) — prefer frogSilhouette for frog. */
  squareContainer?: boolean;
  /** Light-on-transparent asset: dark chip in light theme so it doesn’t sit on near-white. */
  onDarkField?: boolean;
  /** Dark silhouette only (no brand green plate); use with updated frog SVG */
  frogSilhouette?: boolean;
  /** Bold company line; defaults to label if omitted */
  company?: string;
  /** Shown after comma, like the role in main experience headings */
  role?: string;
  /** Optional per-stint dates — add when you want them to appear */
  dates?: string;
};

export type EarlierLogoText = {
  kind: "text";
  text: string;
  label: string;
  /** false = preserve casing (e.g. SoftArtisans); true = lowercase wordmark */
  lowercase?: boolean;
  role?: string;
  dates?: string;
};

export type EarlierLogoItem = EarlierLogoImg | EarlierLogoText;

/** Order matches narrative: industrial → enterprise → media / design / publishing. */
export const RESUME_EARLIER_LOGOS: EarlierLogoItem[] = [
  {
    kind: "img",
    src: "/resume-logos/earlier-ge.svg",
    label: "GE Fanuc / Intellution — industrial automation",
    company: "GE Fanuc / Intellution",
    role: "Industrial automation web interfaces & dashboards",
    invertInDarkMode: true,
  },
  {
    kind: "text",
    text: "SoftArtisans",
    label: "SoftArtisans",
    lowercase: false,
    role: "Enterprise web integrations",
  },
  {
    kind: "img",
    src: "/resume-logos/earlier-monster.svg",
    label: "Monster.com",
    company: "Monster.com",
    role: "Webby-recognized career advice & features",
    invertInDarkMode: true,
  },
  {
    kind: "img",
    src: "/resume-logos/earlier-yahoo.svg",
    label: "Yahoo",
    company: "Yahoo",
    role: "Scalable frontend architecture for high-traffic properties",
    invertInDarkMode: true,
  },
  {
    kind: "img",
    src: "/resume-logos/frog-design.svg",
    label: "Frog Design",
    company: "Frog Design",
    role: "Design-to-production prototyping",
    frogSilhouette: true,
  },
  {
    kind: "img",
    src: "/resume-logos/eyes_bigger.png",
    label: "Secret Feature",
    company: "Secret Feature",
    role: "Co-founder / CTO, early social product",
    prominent: true,
    onDarkField: true,
  },
  {
    kind: "img",
    src: "/resume-logos/say-logotype.jpeg",
    label: "Say Media",
    company: "Say Media",
    role: "Ember publishing tools; monetization, engaged time, headlines & reactions",
    /* Black + red wordmark: avoid invertInDarkMode (would distort red quotes). */
  },
];

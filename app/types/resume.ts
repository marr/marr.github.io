export type ResumeProfileLink = {
  label: string;
  text: string;
  href?: string;
  icon?: string;
  external?: boolean;
};

export type ResumeProfile = {
  name: string;
  headline?: string;
  pdfHref: string;
  links: ResumeProfileLink[];
};

export const resumeSectionNav = [
  { label: "Summary", to: "#summary" },
  { label: "Experience", to: "#experience" },
  { label: "Education", to: "#education" },
  { label: "Skills", to: "#skills" },
] as const;

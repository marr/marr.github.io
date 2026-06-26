import type { TimelineItem } from "@nuxt/ui";

export interface Pillar {
  title: string;
  body: string;
}

export interface Era {
  label: string;
  years: string;
  title: string;
  narrative: string;
  icon: string;
}

export interface Staple {
  category: string;
  technology: string;
  utility: string;
}

export interface WorkbenchArea {
  title: string;
  thesis: string;
  items: string[];
}

export interface OpenSourceProject {
  title: string;
  url: string;
  description: string;
  tags: string[];
  icon?: string;
}

export interface SkillGroup {
  title: string;
  items: string[];
}

export interface TasteLink {
  label: string;
  url: string;
  hint: string;
}

export const executiveSummary = {
  lede: "Twenty-five years building production software—from industrial dashboards and Webby-recognized consumer sites to teams using AI in day-to-day delivery. I lead engineering orgs that ship reliable products, keep infrastructure under their own control, and care about UI polish—not just automation.",
  pillars: [
    {
      title: "Scalable architecture",
      body: "Multi-tenant SaaS analytics—including decarbonization-as-a-Service (DaaS) at Context Labs—plus backend-for-frontend APIs and clear engineering standards. Cut incident recovery time 50% through goals, code review, and AI coding tools.",
    },
    {
      title: "AI with taste",
      body: "Interfaces that feel responsive and considered. AI should shorten the path from idea to working software, not replace thoughtful product work.",
    },
    {
      title: "Breadth across stacks",
      body: "Industrial automation, payment products at £2m/month, and AI-powered hiring tools—enough range to guide teams through stack changes without breaking what already works.",
    },
  ] satisfies Pillar[],
};

export const eras: Era[] = [
  {
    label: "Era 1",
    years: "2000–2008",
    title: "Industrial and enterprise foundations",
    icon: "i-mdi-factory",
    narrative:
      "Built dashboards and web interfaces for GE Fanuc/Intellution and enterprise integrations at SoftArtisans. Also shipped user-facing work for Monster.com, including a Webby-recognized career site.",
  },
  {
    label: "Era 2",
    years: "2009–2015",
    title: "Consumer scale and design",
    icon: "i-mdi-palette-outline",
    narrative:
      "Design technologist at Frog Design—the Disney MagicBand and phone UI prototypes for AT&T and Facebook. Frontend architecture for high-traffic Yahoo sites. At Tilt.com, early React server rendering on a Perl/JavaScript stack helped lift signups 15%.",
  },
  {
    label: "Era 3",
    years: "2016–2022",
    title: "SaaS and product leadership",
    icon: "i-mdi-chart-timeline-variant",
    narrative:
      "Senior architect at OneMarket in London—payment products generating £2m/month. Lead engineer at Turo on host tools, in-car hardware, and better error reporting. At Filtered.ai, a hiring platform with AI grading and resume fraud detection.",
  },
  {
    label: "Era 4",
    years: "2022–2026",
    title: "AI leadership and design teams",
    icon: "i-mdi-robot-outline",
    narrative:
      "Principal engineer to engineering manager at Context Labs, leading a distributed design and frontend team on a decarbonization-as-a-Service (DaaS) SaaS platform. Cut incident recovery time 50% while rolling out AI coding tools and editor integrations—workshops plus review standards so teams shipped faster without cutting corners.",
  },
];

export const careerTimelineItems: TimelineItem[] = eras.map((era) => ({
  date: `${era.label} · ${era.years}`,
  title: era.title,
  description: era.narrative,
  icon: era.icon,
}));

export const staples: Staple[] = [
  {
    category: "Framework",
    technology: "React",
    utility: "Default for product UIs and large codebases—Vue and Nuxt when SSR, file routing, or this site’s stack fit better.",
  },
  {
    category: "Data viz",
    technology: "Vega Lite",
    utility: "Charts and dashboards from concise specs—good for multi-customer analytics.",
  },
  {
    category: "Documentation",
    technology: "Markdown & OKF",
    utility:
      "Markdown for human-readable docs and content; Google's Open Knowledge Format (OKF) for agent-friendly knowledge bundles—one concept per file with YAML frontmatter.",
  },
  {
    category: "Design system",
    technology: "shadcn/ui",
    utility: "Accessible components on Radix and Tailwind.",
  },
  {
    category: "Notes",
    technology: "Obsidian",
    utility: "Local Markdown notes—fast search, no cloud lock-in.",
  },
];

export const workbenchAreas: WorkbenchArea[] = [
  {
    title: "Infrastructure",
    thesis:
      "Self-hosted Git and immutable Linux so you are not tied to one vendor—and security stays in your hands.",
    items: ["Talos (Kubernetes OS)", "Gitea (self-hosted Git)"],
  },
  {
    title: "Web tooling",
    thesis:
      "Faster builds and less toolchain glue between frontend and backend.",
    items: ["TanStack Start", "Vite+"],
  },
  {
    title: "AI tooling",
    thesis:
      "Command-line AI workflows instead of browser-only chat UIs.",
    items: ["pi-mono (AI toolkit)", "shaders.com (WebGPU effects)"],
  },
];

export const tasteLinks: TasteLink[] = [
  {
    label: "Impeccable",
    url: "https://impeccable.style",
    hint: "Design guidance for AI-built UIs",
  },
  {
    label: "Agents with taste",
    url: "https://emilkowal.ski/ui/agents-with-taste",
    hint: "Interfaces that leave room for the user to act",
  },
  {
    label: "compound-engineering",
    url: "https://github.com/EveryInc/compound-engineering-plugin",
    hint: "Editor workflow patterns",
  },
];

export const siteRepo = {
  title: "marr.github.io",
  url: "https://github.com/marr/marr.github.io",
  description:
    "This portfolio—résumé, blog, and about page—is open source. Built with Nuxt 4, Nuxt UI, and Nuxt Content; deployed as static files on GitHub Pages.",
  tags: ["Nuxt", "Nuxt UI", "Nuxt Content", "GitHub Pages"],
};

export const openSourceProjects: OpenSourceProject[] = [
  {
    title: "nuxt-maplibre",
    url: "https://marr.github.io/nuxt-maplibre",
    description: "Nuxt module for swapping map providers in a declarative way.",
    tags: ["Nuxt", "Maps"],
    icon: "i-logos-nuxt-icon",
  },
  {
    title: "flux-homelab-skill",
    url: "https://github.com/marr/flux-homelab-skill",
    description:
      "Agent skill for Flux GitOps homelabs—deployments, encrypted secrets, and cluster upkeep.",
    tags: ["Kubernetes", "GitOps", "AI"],
    icon: "i-simple-icons-flux",
  },
  {
    title: "vue-squircle",
    url: "https://marr.github.io/vue-squircle",
    description:
      "Squircle masks for Vue—mostly replaced by native CSS corner-shape; kept for reference.",
    tags: ["Vue", "UI", "Archive"],
    icon: "i-logos-vue",
  },
];

export const skillGroups: SkillGroup[] = [
  {
    title: "Languages & frameworks",
    items: [
      "TypeScript",
      "JavaScript",
      "Python",
      "Go",
      "React",
      "Vue",
      "Nuxt",
      "TanStack Start",
      "HTML",
      "CSS",
      "Tailwind",
      "Zod",
      "React Hook Form",
      "Vee-Validate",
    ],
  },
  {
    title: "AI & infrastructure",
    items: [
      "Kubernetes",
      "AWS",
      "Docker",
      "Cloudflare Workers",
      "Durable Objects",
      "Vercel AI SDK",
      "Pi",
      "Cursor",
      "Agent Skills",
      "Git",
      "Turborepo",
      "Lerna/NX",
      "Vite",
      "Vitest",
      "PostgreSQL",
      "MongoDB",
      "Trino",
      "ArcadeDB",
    ],
  },
  {
    title: "Maps, charts, and graphics",
    items: [
      "Mapbox",
      "D3",
      "WebGL",
      "WebGPU",
      "Vega Lite",
      "WebRTC",
      "Shaders",
    ],
  },
];

export const closingStatement =
  "I combine solid engineering practice with AI-assisted delivery—helping teams move faster while keeping reliability and good design. Self-hosted infrastructure, thoughtful interfaces, and production habits that survive stack changes.";

export interface JourneyHighlight {
  title: string;
  body: string;
}

export interface JourneySection {
  label: string;
  highlights: JourneyHighlight[];
}

export interface JourneySkillGroup {
  label: string;
  items: string[];
}

export const journeySections: JourneySection[] = [
  {
    label: "Early career (2000–2015)",
    highlights: [
      {
        title: "15% lift in signups at Tilt.com",
        body: "Improved signup and contribution flows with early React server rendering on a Perl/JavaScript stack.",
      },
      {
        title: "Yahoo! and Monster.com",
        body: "Yahoo! Live and a Webby Award for work at Monster.com.",
      },
      {
        title: "Startup CTO",
        body: "Co-founded a company and built the product from scratch.",
      },
    ],
  },
  {
    label: "Recent leadership (2016–present)",
    highlights: [
      {
        title: "Context Labs DaaS platform",
        body: "Led a global team shipping decarbonization-as-a-Service (DaaS)—a SaaS product for tracking greenhouse gas emissions at energy companies.",
      },
      {
        title: "Filtered.ai hiring automation",
        body: "AI grading for technical assessments and resume fraud detection.",
      },
      {
        title: "Turo and OneMarket products",
        body: "Dynamic pricing, indoor maps, smart parking, Stripe payments, and facial recognition.",
      },
    ],
  },
];

export const journeySkillGroups: JourneySkillGroup[] = [
  {
    label: "Languages & frameworks",
    items: [
      "JavaScript",
      "TypeScript",
      "React",
      "Next.js",
      "Svelte",
      "Vue",
      "Go",
      "Python",
      "Tailwind",
    ],
  },
  {
    label: "AI & data visualization",
    items: [
      "AI SDKs (OpenAI, Claude)",
      "Vega Lite",
      "Apache ECharts",
      "Mapbox",
    ],
  },
  {
    label: "Databases & infrastructure",
    items: ["PostgreSQL", "MongoDB", "Kubernetes", "AWS", "Trino"],
  },
];

export const journeyGraphicFixes = [
  "Trino, not Trine, under Databases & Infrastructure",
  "building, not buiiding, in the startup CTO callout",
  "AI SDKs (OpenAI, Claude) as one label—not split across two cells",
];

export const journeyAlt =
  "David Marr: 25 years in engineering leadership. Highlights include signup growth at Tilt, Yahoo and Monster.com, startup CTO work, DaaS SaaS at Context Labs, hiring automation at Filtered.ai, and consumer products at Turo and OneMarket.";

export const timelineGraphicStack = {
  staples: ["React", "Vega Lite", "Tailwind (shadcn/ui)", "Obsidian"],
  workbench: [
    "pi-mono (AI toolkit)",
    "Talos (Kubernetes OS)",
    "VoidAuth (OIDC)",
    "TanStack Start",
  ],
};

export const timelineGraphicFixes = [
  "pi-mono, not pl-mono, in the Workbench column",
  "Talos-based Kubernetes OS, not Taios-based Rubernetes OS, in Era 4",
  "Industrial Automation, not Industrial Automation &, in Era 1",
  "payment products, smart parking, Stripe APIs—not “smart parking Stripe APIs”",
];

export const timelineAlt =
  "David Marr career timeline in four phases: industrial software, consumer and design work, SaaS leadership, and AI-focused engineering.";

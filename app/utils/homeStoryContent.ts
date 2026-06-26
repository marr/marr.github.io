import type { TimelineItem } from "@nuxt/ui";

export interface Pillar {
  title: string;
  body: string;
}

interface Era {
  label: string;
  years: string;
  title: string;
  narrative: string;
  icon: string;
}

export const executiveSummary = {
  pillars: [
    {
      title: "Scalable architecture",
      body: "Multi-tenant SaaS analytics—including Decarbonization-as-a-Service (DaaS) at Context Labs—plus backend-for-frontend APIs and clear engineering standards. Cut incident recovery time 50% through goals, code review, and AI coding tools.",
    },
    {
      title: "Interfaces with intent",
      body: "Interfaces that feel responsive and considered. AI should shorten the path from idea to working software, not replace thoughtful product work.",
    },
    {
      title: "Breadth across stacks",
      body: "Industrial automation, payment products at £2m/month, and AI-powered hiring tools—enough range to guide teams through stack changes without breaking what already works.",
    },
  ] satisfies Pillar[],
};

export interface CareerGraphic {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
}

export const careerGraphics: CareerGraphic[] = [
  {
    src: "/about-timeline.webp",
    caption: "Four phases of the career",
    alt: "David Marr career timeline in four phases: industrial software, consumer and design work, SaaS leadership, and AI-focused engineering.",
    width: 2048,
    height: 1142,
  },
  {
    src: "/about-journey.webp",
    caption: "Career highlights at a glance",
    alt: "David Marr: 25 years in engineering leadership. Highlights include signup growth at Tilt, Yahoo and Monster.com, startup CTO work, decarbonization platform (DaaS) at Context Labs, hiring automation at Filtered.ai, and consumer products at Turo and OneMarket.",
    width: 2048,
    height: 1142,
  },
];

const eras: Era[] = [
  {
    label: "Era 1",
    years: "2000–2008",
    title: "Industrial and enterprise foundations",
    icon: "i-lucide-factory",
    narrative:
      "Built dashboards and web interfaces for GE Fanuc/Intellution and enterprise integrations at SoftArtisans. Also shipped user-facing work for Monster.com, including a Webby-recognized career site.",
  },
  {
    label: "Era 2",
    years: "2009–2015",
    title: "Consumer scale and design",
    icon: "i-lucide-palette",
    narrative:
      "Design technologist at Frog Design—the Disney MagicBand and phone UI prototypes for AT&T and Facebook. Frontend architecture for high-traffic Yahoo sites. At Tilt.com, early React server rendering on a Perl/JavaScript stack helped lift signups 15%.",
  },
  {
    label: "Era 3",
    years: "2016–2022",
    title: "SaaS and product leadership",
    icon: "i-lucide-chart-gantt",
    narrative:
      "Senior architect at OneMarket in London—payment products generating £2m/month. Lead engineer at Turo on host tools, in-car hardware, and better error reporting. At Filtered.ai, a hiring platform with AI grading and resume fraud detection.",
  },
  {
    label: "Era 4",
    years: "2022–2026",
    title: "AI leadership and design teams",
    icon: "i-lucide-bot",
    narrative:
      "Principal engineer to engineering manager at Context Labs, leading a distributed design and frontend team on the Decarbonization-as-a-Service (DaaS) platform. Cut incident recovery time 50% while rolling out AI coding tools and editor integrations—workshops plus review standards so teams shipped faster without cutting corners.",
  },
];

export const careerTimelineItems: TimelineItem[] = eras.map((era) => ({
  date: `${era.label} · ${era.years}`,
  title: era.title,
  description: era.narrative,
  icon: era.icon,
}));

export interface TasteLink {
  label: string;
  url: string;
  hint: string;
}

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

export const aiTasteIntro =
  "Small UI details and clear layouts matter more when AI generates the first draft. Polish is what makes the result feel intentional.";

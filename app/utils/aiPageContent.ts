export interface AgentStackItem {
  title: string;
  url: string;
  description: string;
  icon?: string;
  image?: string;
  imageInvert?: boolean;
}

export const agentStackIntro =
  "Daily agentic work runs through a small stack: Pi for the harness, sessions, and skills; Cursor for the editor and agent loop; pi-cursor-sdk to run that loop inside Pi with bridged MCP tools and shared context.";

export const agentStackItems: AgentStackItem[] = [
  {
    title: "Pi",
    url: "https://github.com/badlogic/pi-mono",
    description:
      "Coding agent harness—CLI, extensions, skills, and a unified LLM API from the pi-mono toolkit.",
    image: "/pi-logo.svg",
    imageInvert: true,
  },
  {
    title: "Cursor",
    url: "https://cursor.com",
    description:
      "AI-native editor where most review, refactors, and pair-programming sessions live.",
    icon: "i-lucide-square-code",
  },
  {
    title: "pi-cursor-sdk",
    url: "https://github.com/fitchmultz/pi-cursor-sdk",
    description:
      "Runs Cursor's agent loop inside Pi—model controls, fast and plan modes, images, and MCP-bridged Pi tools.",
    icon: "i-lucide-cable",
  },
];
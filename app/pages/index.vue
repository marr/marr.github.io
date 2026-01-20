<script setup lang="ts">
// Hero data
const hero = {
  title: 'David Marr',
  description: 'Building tools to monitor and address emissions at Context Labs, and contributing to the Vue/Nuxt ecosystem.',
  avatar: '/avatar.png',
  roles: ['Engineering Leader', 'Open Source Creator', 'Climate Tech Builder'],
  socials: [
    { icon: 'i-mdi-github', url: 'https://github.com/marr' },
    { icon: 'i-mdi-twitter', url: 'https://x.com/dmarr' },
    { icon: 'i-mdi-linkedin', url: 'https://linkedin.com/in/davidmarr' },
  ],
}

// Open source projects
const openSourceProjects = [
  {
    title: 'nuxt-maplibre',
    url: 'https://marr.github.io/nuxt-maplibre',
    icon: 'i-mdi-map',
    description: 'A Nuxt module for swapping map providers in a declarative way.',
    tags: ['Nuxt', 'Maps'],
  },
  {
    title: 'vue-squircle',
    url: 'https://marr.github.io/vue-squircle',
    icon: 'i-mdi-shape',
    description: 'Turn your rounded corners into more interesting squircles.',
    tags: ['Vue', 'UI'],
  },
]

// Currently exploring projects
const exploringProjects = [
  {
    title: 'Talos',
    url: 'https://talos.dev',
    icon: 'i-mdi-kubernetes',
    description: 'Secure, immutable Linux for Kubernetes.',
    tags: ['Infrastructure'],
  },
  {
    title: 'Omarchy',
    url: 'https://omarchy.dev',
    icon: 'i-mdi-desktop-mac',
    description: 'A modern development environment.',
    tags: ['Developer Tools'],
  },
  {
    title: 'TanStack Start',
    url: 'https://tanstack.com/start',
    icon: 'i-mdi-rocket-launch',
    description: 'The next generation of full-stack web applications.',
    tags: ['React', 'Vue'],
  },
  {
    title: 'Vercel AI SDK',
    url: 'https://ai-sdk.dev',
    icon: 'i-mdi-robot',
    description: 'Build integrations between model providers and web frameworks.',
    tags: ['AI', 'SDK'],
  },
  {
    title: 'Obsidian',
    url: 'https://obsidian.md',
    icon: 'i-mdi-notebook',
    description: 'A powerful knowledge base that works on local Markdown files.',
    tags: ['Notes', 'PKM'],
  },
  {
    title: 'Obsidian MCP',
    url: 'https://github.com/smithery-ai/mcp-obsidian',
    icon: 'i-mdi-connection',
    description: 'Connect AI assistants to your Obsidian vault via Model Context Protocol.',
    tags: ['AI', 'MCP'],
  },
]

useSeoMeta({
  title: 'David Marr – Engineering Leader',
  description: 'Engineering leader and open source creator building tools for climate tech and the Vue ecosystem.',
})
</script>

<template>
  <div class="mt-8 pb-24 space-y-12">
    <HomeHero
      :title="hero.title"
      :description="hero.description"
      :avatar="hero.avatar"
      :roles="hero.roles"
      :socials="hero.socials"
    />

    <ProjectGrid title="Open Source">
      <ProjectCard
        v-for="project in openSourceProjects"
        :key="project.title"
        :title="project.title"
        :url="project.url"
        :icon="project.icon"
        :description="project.description"
        :tags="project.tags"
      />
    </ProjectGrid>

    <ProjectGrid title="Currently Exploring">
      <ProjectCard
        v-for="project in exploringProjects"
        :key="project.title"
        :title="project.title"
        :url="project.url"
        :icon="project.icon"
        :description="project.description"
        :tags="project.tags"
      />
    </ProjectGrid>
  </div>
</template>

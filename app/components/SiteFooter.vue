<script setup lang="ts">
/** Single instant for copyright year; NuxtTime keeps SSR + client output aligned. */
const copyrightNow = new Date()

const socialLinks = [
  { icon: 'i-mdi-github', url: 'https://github.com/marr', label: 'GitHub' },
  { icon: 'i-mdi-twitter', url: 'https://x.com/dmarr', label: 'Twitter' },
  { icon: 'i-mdi-linkedin', url: 'https://linkedin.com/in/davidmarr', label: 'LinkedIn' },
]
</script>

<template>
  <footer class="border-t border-muted/20 mt-16">
    <div class="max-w-3xl mx-auto px-4 py-8">
      <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
        <p class="text-sm text-muted-foreground">
          &copy;
          {{ " " }}
          <NuxtTime
            :datetime="copyrightNow"
            locale="en-US"
            year="numeric"
            time-zone="America/New_York"
          />
          {{ " " }}David Marr
        </p>
        <div class="flex items-center gap-4">
          <a
            v-for="link in socialLinks"
            :key="link.url"
            :href="link.url"
            :aria-label="link.label"
            target="_blank"
            rel="noopener noreferrer"
            class="text-muted-foreground hover:text-foreground transition-colors"
          >
            <UIcon :name="link.icon" class="w-5 h-5" />
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

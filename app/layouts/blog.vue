<script setup lang="ts">
const route = useRoute();
const { data: page } = await useAsyncData("blog-layout-" + route.path, () => {
  return queryCollection("blog").path(route.path).first();
});

const formattedDate = computed(() => {
  if (!page.value?.date) return null;
  return new Date(page.value.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
});
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <SiteHeader />
    <main class="flex-1">
      <div class="max-w-3xl mx-auto px-4">
        <article>
          <header v-if="page" class="py-8 border-b border-muted/20 mb-8">
            <h1 class="text-3xl font-bold mb-4">{{ page.title }}</h1>
            <p
              v-if="page.description"
              class="text-muted-foreground text-lg mb-4"
            >
              {{ page.description }}
            </p>
            <time
              v-if="formattedDate"
              :datetime="String(page.date)"
              class="flex items-center gap-1 text-sm text-muted-foreground"
            >
              <UIcon name="i-mdi-calendar" class="w-4 h-4" />
              {{ formattedDate }}
            </time>
          </header>
          <slot />
        </article>
      </div>
    </main>
    <SiteFooter />
  </div>
</template>

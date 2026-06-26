<script setup lang="ts">
const { data: page } = await useAsyncData("about-page", () =>
  queryCollection("content").path("/about").first(),
);

if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Page not found",
    fatal: true,
  });
}

useSeoMeta({
  title: page.value.seo?.title || page.value.title,
  description: page.value.seo?.description || page.value.description,
});
</script>

<template>
  <UPageBody v-if="page" class="py-8 md:py-12">
    <AboutPageContent />
  </UPageBody>
</template>

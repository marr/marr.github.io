<script setup lang="ts">
const contentPath = useContentPath();
const { data: page } = await useAsyncData(
  () => `page-${contentPath.value}`,
  () => queryCollection("content").path(contentPath.value).first(),
  { watch: [contentPath] },
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
  <UPageBody v-if="page">
    <ContentRenderer :value="page" />
  </UPageBody>
</template>

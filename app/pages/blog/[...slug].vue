<script setup lang="ts">
definePageMeta({
  layout: "blog",
});

const contentPath = useContentPath();
const { data: page } = await useAsyncData(
  () => `blog-${contentPath.value}`,
  () => queryCollection("blog").path(contentPath.value).first(),
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
  <UPage v-if="page">
    <ContentRenderer :value="page" />
  </UPage>
</template>

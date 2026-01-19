<script setup lang="ts">
definePageMeta({
  layout: 'blog',
})

const route = useRoute()
const { data: page } = await useAsyncData('blog-' + route.path, () => {
  return queryCollection('blog').path(route.path).first()
})

if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page not found',
    fatal: true,
  })
}

useSeoMeta({
  title: page.value.seo?.title || page.value.title,
  description: page.value.seo?.description || page.value.description,
})
</script>

<template>
  <UPageBody v-if="page">
    <ContentRenderer :value="page" />
  </UPageBody>
</template>

<script setup lang="ts">
// import type { ContentNavigationItem } from '@nuxt/content'

const route = useRoute();
const { data: page } = await useAsyncData("page-" + route.path, () => {
  return queryCollection("content").path(route.path).first();
});

if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Page not found",
    fatal: true,
  });
}
// const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')
</script>

<template>
  <ContentRenderer v-if="page" class="prose dark:prose-invert prose-slate" :value="page" />
</template>

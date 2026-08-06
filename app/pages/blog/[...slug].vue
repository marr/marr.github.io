<script setup lang="ts">
import type { TocLink } from '@nuxt/content'

definePageMeta({
  layout: 'blog',
})

const contentPath = useContentPath()
const { data: page } = await useAsyncData(
  () => `blog-${contentPath.value}`,
  () => queryCollection('blog').path(contentPath.value).first(),
  { watch: [contentPath] },
)

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

const tocLinks = computed(() => (page.value?.body?.toc?.links ?? []) as TocLink[])
</script>

<template>
  <UPage
    v-if="page"
    class="pb-16 pt-2 md:pt-4"
  >
    <UPageBody class="min-w-0">
      <article>
        <header class="mb-8 border-b border-default/60 py-8">
          <h1 class="mb-4 text-3xl font-bold tracking-tight text-default">
            {{ page.title }}
          </h1>
          <p
            v-if="page.description"
            class="mb-4 text-lg leading-relaxed text-muted text-pretty"
          >
            {{ page.description }}
          </p>
          <div
            v-if="page.date"
            class="flex items-center gap-1 text-sm text-muted"
          >
            <UIcon name="i-lucide-calendar" class="size-4" />
            <NuxtTime
              :datetime="page.date"
              locale="en-US"
              year="numeric"
              month="long"
              day="numeric"
              time-zone="UTC"
            />
          </div>
        </header>

        <ContentRenderer :value="page" />
      </article>
    </UPageBody>

    <template v-if="tocLinks.length" #right>
      <UPageAside
        :ui="{
          root: 'sticky top-20 self-start w-full lg:max-w-[14rem]',
        }"
      >
        <UContentToc
          :links="tocLinks"
          highlight
        />
      </UPageAside>
    </template>
  </UPage>
</template>

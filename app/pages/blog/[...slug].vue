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
const hasToc = computed(() => tocLinks.value.length > 0)

const pageUi = computed(() =>
  hasToc.value
    ? {
        center: 'lg:col-span-7 min-w-0',
        right: 'lg:col-span-3 min-w-0',
      }
    : undefined,
)

const tocUi = {
  // Theme defaults use truncate; long post titles need wrapping in a narrow aside.
  root: 'lg:mx-0 lg:px-0 lg:max-h-none',
  title: '!whitespace-normal',
  linkText: '!whitespace-normal text-pretty leading-snug',
  content:
    'lg:min-h-0 lg:max-h-[min(var(--list-height),calc(100vh-var(--ui-header-height)-8rem))] lg:overflow-y-auto',
}
</script>

<template>
  <UPage
    v-if="page"
    class="pb-16 pt-2 md:pt-4"
    :ui="pageUi"
  >
    <UPageBody class="min-w-0">
      <article>
        <header
          class="mb-8 max-w-prose border-b border-default/60 py-8"
          :class="{ 'mx-auto lg:mx-0': !hasToc }"
        >
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

        <ContentRenderer
          :value="page"
          class="max-w-prose"
          :class="{ 'mx-auto lg:mx-0': !hasToc }"
        />
      </article>
    </UPageBody>

    <template v-if="hasToc" #right>
      <UPageAside
        :ui="{
          root: 'lg:max-h-[calc(100vh-var(--ui-header-height))] lg:overflow-y-auto lg:overflow-x-visible',
        }"
      >
        <UContentToc
          :links="tocLinks"
          highlight
          :ui="tocUi"
        />
      </UPageAside>
    </template>
  </UPage>
</template>

<script setup lang="ts">
const { data: page } = await useAsyncData('blog-page', () => {
  return queryCollection('pages').first()
})

if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page not found',
    fatal: true,
  })
}

const { data: posts } = await useAsyncData('blog-posts', () => {
  return queryCollection('blog').order('date', 'DESC').all()
})

useSeoMeta({
  title: page.value.title,
  description: page.value.description,
})
</script>

<template>
  <div v-if="page" class="py-12">
    <header class="mb-12">
      <h1 class="text-3xl font-bold tracking-tight text-default mb-4">{{ page.title }}</h1>
      <p class="text-lg text-muted text-pretty leading-relaxed">{{ page.description }}</p>
    </header>

    <div v-if="posts?.length" class="space-y-10">
      <article v-for="post in posts" :key="post.path" class="group">
        <NuxtLink
          :to="post.path"
          class="block rounded-lg outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-default"
        >
          <h2 class="text-xl font-semibold text-default group-hover:text-primary transition-colors">
            {{ post.title }}
          </h2>
          <p v-if="post.description" class="mt-2 text-muted text-pretty leading-relaxed">
            {{ post.description }}
          </p>
          <NuxtTime
            v-if="post.date"
            :datetime="post.date"
            locale="en-US"
            year="numeric"
            month="long"
            day="numeric"
            time-zone="UTC"
            class="mt-2 block text-sm text-muted"
          />
        </NuxtLink>
      </article>
    </div>

    <p v-else class="text-muted">No posts yet.</p>
  </div>
</template>

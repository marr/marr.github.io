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
  <div class="py-12">
    <header class="mb-12">
      <h1 class="text-3xl font-bold mb-4">{{ page.title }}</h1>
      <p class="text-lg text-muted-foreground">{{ page.description }}</p>
    </header>

    <div v-if="posts?.length" class="space-y-8">
      <article v-for="post in posts" :key="post.path" class="group">
        <NuxtLink :to="post.path" class="block">
          <h2 class="text-xl font-semibold group-hover:text-primary transition-colors">
            {{ post.title }}
          </h2>
          <p v-if="post.description" class="mt-2 text-muted-foreground">
            {{ post.description }}
          </p>
          <time
            v-if="post.date"
            :datetime="post.date.toString()"
            class="mt-2 block text-sm text-muted-foreground"
          >
            {{ new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) }}
          </time>
        </NuxtLink>
      </article>
    </div>

    <p v-else class="text-muted-foreground">No posts yet.</p>
  </div>
</template>

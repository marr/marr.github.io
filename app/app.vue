<template>
  <UApp>
    <div class="flex min-h-screen flex-col">
      <SiteHeader />
      <UMain class="flex-1">
        <NuxtLayout>
          <NuxtPage />
        </NuxtLayout>
      </UMain>
      <SiteFooter />
    </div>
  </UApp>
</template>

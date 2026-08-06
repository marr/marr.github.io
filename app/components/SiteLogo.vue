<template>
  <NuxtLink
    to="/"
    class="site-logo inline-flex items-center text-default transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    aria-label="David Marr — home"
  >
    <span
      class="site-logo__mark inline-block h-7 w-[calc(1.75rem*669/493)] shrink-0 bg-current"
      aria-hidden="true"
    />
  </NuxtLink>
</template>

<style scoped>
.site-logo__mark {
  -webkit-mask-image: url("/logo-mask.png");
  mask-image: url("/logo-mask.png");
  -webkit-mask-size: contain;
  mask-size: contain;
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-position: center;
  mask-position: center;
}
</style>

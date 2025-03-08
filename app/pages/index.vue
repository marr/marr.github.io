<template>
  <div class="flex flex-col h-72 max-w-[950px] items-center justify-center">
    <LiquidLogo class="translate-x-5" image-url="/cxl-icon.svg" />
    <ClientOnly>
      <MorphingText :texts="['Labs', 'Context']" />
    </ClientOnly>
  </div>
</template>
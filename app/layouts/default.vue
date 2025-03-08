<template>
  <div class="container mx-auto">
    <p class="p-4 pb-2">
      <ColorMode />
    </p>
    <div class="mx-auto p-4">
      <Alert>
        <AlertDescription>
          This is a demo of a Nuxt.js app with Tailwind CSS and Radix UI components using nuxt studio.
        </AlertDescription>
      </Alert>
      <slot />
      
    </div>
  </div>
</template>

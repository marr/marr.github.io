<script setup>
const colorMode = useColorMode()
</script>

<template>
  <div class="container mx-auto">
    <p class="p-4 pb-2">
      <Select v-model="colorMode.preference">
        <SelectTrigger  class="w-40">
          <SelectValue placeholder="Color mode" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="system">System</SelectItem>
          <SelectItem value="light">Light</SelectItem>
          <SelectItem value="dark">Dark</SelectItem>
        </SelectContent>
      </Select>
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

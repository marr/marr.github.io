<template>
  <h3>Counter: {{ count }}</h3>
  <div class="flex gap-2">
    <UButton @click="increment">
      Increment
    </UButton>
    <UButton @click="decrement">
      Decrement
    </UButton>
  </div>
</template>

<script setup lang="ts">
const count = ref(0)

const increment = () => {
  count.value++
}

const decrement = () => {
  count.value--
}
</script>

<style scoped>
button {
  margin: 5px;
}
</style>

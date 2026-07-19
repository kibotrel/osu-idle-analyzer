<template>
  <div class="image-container" v-if="url">
    <img :src="url" class="image" />
  </div>
  <div v-else class="image-container">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" class="image">
      <rect width="64" height="64" fill="#a1a1aa"></rect>
      <text
        x="50%"
        y="50%"
        dominant-baseline="middle"
        text-anchor="middle"
        font-family="monospace"
        font-size="24px"
        fill="#0a0a0b"
      >
        ?
      </text>
    </svg>
  </div>
</template>

<script setup lang="ts">
interface Properties {
  url?: string;
}

const properties = defineProps<Properties>();
</script>

<style scoped>
@reference '#/assets/style.css';

.image-container {
  @apply size-12 shrink-0;
}

.image {
  @apply rounded-lg w-full h-full object-cover;
}
</style>

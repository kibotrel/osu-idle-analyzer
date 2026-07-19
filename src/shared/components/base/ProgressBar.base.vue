<template>
  <div class="progress-bar-track">
    <div
      class="progress-bar-fill"
      :style="{ width: `${((properties.current / properties.max) * 100).toFixed(2)}%` }"
    ></div>
  </div>
</template>

<script setup lang="ts">
const properties = defineProps<{
  current: number;
  max: number;
}>();
</script>

<style scoped>
@reference '#/assets/style.css';

.progress-bar-track {
  @apply h-1 bg-faded-primary-1 rounded-full overflow-hidden;
}

.progress-bar-fill {
  @apply h-full rounded-full bg-yellow-500;
}
</style>

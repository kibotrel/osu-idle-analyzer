<template>
  <component :is="variant === 'subtitle' ? 'h2' : 'h1'" :class="variant">
    <slot></slot>
  </component>
</template>

<script setup lang="ts">
import { HeadlineVariants } from '#/shared/constants/designSystem.constants.ts';
import { HeadlineVariant } from '#/shared/types/designSystem.types.ts';

interface Properties {
  variant?: HeadlineVariant;
}

withDefaults(defineProps<Properties>(), { variant: HeadlineVariants.Title });
</script>

<style scoped>
@reference '#/assets/style.css';

.title {
  @apply text-lg font-semibold tracking-tight;
}

.subtitle {
  @apply text-base tracking-tight;
}
</style>

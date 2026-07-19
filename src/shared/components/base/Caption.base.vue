<template>
  <component :is="isInline ? 'span' : 'p'" :class="variant">
    <slot></slot>
  </component>
</template>

<script setup lang="ts">
import { CaptionVariants } from '#/shared/constants/designSystem.constants.ts';
import { CaptionVariant } from '#/shared/types/designSystem.types.ts';

interface Properties {
  isInline?: boolean;
  variant?: CaptionVariant;
}

withDefaults(defineProps<Properties>(), { isInline: false, variant: CaptionVariants.Base });
</script>

<style scoped>
@reference '#/assets/style.css';

.base {
  @apply text-xs font-normal tracking-normal text-balance;
}
</style>

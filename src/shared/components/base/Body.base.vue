<template>
  <component :is="isInline ? 'span' : 'p'" :class="[`body body--${variant}`, $attrs.class]">
    <slot></slot>
  </component>
</template>

<script lang="ts">
export default { inheritAttrs: false };
</script>

<script setup lang="ts">
import { BodyVariants } from '#/shared/constants/designSystem.constants.ts';
import { BodyVariant } from '#/shared/types/designSystem.types.ts';

interface Properties {
  isInline?: boolean;
  variant?: BodyVariant;
}

withDefaults(defineProps<Properties>(), { isInline: false, variant: BodyVariants.Base });
</script>

<style scoped>
@reference '#/assets/style.css';

.body {
  @apply tracking-normal;
}

.body--base {
  @apply text-sm;
}

.body--small {
  @apply text-xs;
}
</style>

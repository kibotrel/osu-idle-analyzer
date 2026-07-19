<template>
  <hr :class="variant" />
</template>

<script setup lang="ts">
import { SeparatorVariants } from '#/shared/constants/designSystem.constants.ts';
import { SeparatorVariant } from '#/shared/types/designSystem.types.ts';

interface Properties {
  variant?: SeparatorVariant;
}

withDefaults(defineProps<Properties>(), {
  variant: SeparatorVariants.Primary,
});
</script>

<style scoped>
@reference '#/assets/style.css';

hr {
  @apply border-primary-3 border-b;
}

.dashed {
  @apply border-dashed;
}
</style>

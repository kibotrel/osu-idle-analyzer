<template>
  <button :id :class="`button--${variant}`" :disabled="isLoading || isDisabled">
    <div v-if="isLoading">
      <Icon class="button-icon" :icon="Icons.Loading" />
    </div>
    <div v-else class="button-content">
      <div v-if="slots.icon" class="button-icon mr-2">
        <slot name="icon" />
      </div>
      <Body>
        <slot> Button </slot>
      </Body>
    </div>
  </button>
</template>

<script setup lang="ts">
import { useSlots } from 'vue';

import { ButtonVariants, Icons } from '#/shared/constants/designSystem.constants.ts';
import { ButtonVariant } from '#/shared/types/designSystem.types.ts';

import Body from './Body.base.vue';
import Icon from './Icon.base.vue';

interface Properties {
  id: string;
  isDisabled?: boolean;
  isLoading?: boolean;
  variant?: ButtonVariant;
}
withDefaults(defineProps<Properties>(), {
  isDisabled: false,
  isLoading: false,
  variant: ButtonVariants.Primary,
});

const slots = useSlots();
</script>

<style scoped>
@reference '#/assets/style.css';

button {
  @apply flex items-center justify-center;
  @apply rounded-md p-2 text-base font-medium;
}

button:disabled {
  @apply bg-primary-2 text-primary-4 cursor-not-allowed;
  @apply hover:bg-primary-2 hover:text-primary-4;
}

button:focus-visible {
  @apply ring-2 ring-yellow-400 outline-hidden;
}

.button--danger {
  @apply text-primary-1 cursor-pointer bg-red-500;
  @apply hover:text-primary-1/90 hover:bg-red-500/90;
  @apply active:text-primary-1/80 active:bg-red-500/80;
}

.button--ghost {
  @apply text-primary-1 cursor-pointer bg-transparent;
  @apply hover:text-primary-1/90;
  @apply active:text-primary-1/80;
}

.button--primary {
  @apply bg-primary-1 text-primary-4 cursor-pointer;
  @apply hover:bg-primary-1/90 hover:text-primary-4/90;
  @apply active:bg-primary-1/80 active:text-primary-4/80;
}

.button--secondary {
  @apply bg-primary-3 text-primary-1 cursor-pointer;
  @apply hover:bg-primary-3/90 hover:text-primary-1/90;
  @apply active:bg-primary-3/80 active:text-primary-1/80;
}

.button--success {
  @apply text-primary-1 cursor-pointer bg-green-500;
  @apply hover:text-primary-1/90 hover:bg-green-500/90;
  @apply active:text-primary-1/80 active:bg-green-500/80;
}

.button--warning {
  @apply text-primary-4 cursor-pointer bg-yellow-400;
  @apply hover:text-primary-4/90 hover:bg-yellow-400/90;
  @apply active:text-primary-4/80 active:bg-yellow-400/80;
}

.button-content {
  @apply flex items-center;
}

.button-icon {
  @apply size-4;
}
</style>

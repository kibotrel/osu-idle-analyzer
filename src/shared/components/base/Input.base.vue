<template>
  <div v-bind="$attrs" :class="[$attrs.class, 'min-w-0']">
    <label
      v-if="label"
      :class="['mb-1 block text-sm', !isDisabled && errorMessage ? 'error' : '']"
      :for="id"
    >
      <Body class="font-semibold!" is-inline variant="small">
        {{ label }}
      </Body>
      <Body v-if="isRequired" class="text-red-400" is-inline variant="small"> * </Body>
    </label>
    <input
      v-if="type === 'number'"
      :id
      inputmode="numeric"
      min="0"
      type="number"
      :autocomplete="doAutoComplete ? 'on' : 'off'"
      :class="[errorMessage ? 'error' : '', variant]"
      :disabled="isDisabled"
      :placeholder
      :value="modelValue"
      @blur="emit('blur')"
      @input="handleInput"
      @keydown="blockInvalidNumberInput"
    />
    <input
      v-else
      :id
      :autocomplete="doAutoComplete ? 'on' : 'off'"
      :class="[errorMessage ? 'error' : '', variant]"
      :disabled="isDisabled"
      :placeholder
      :value="modelValue"
      @blur="emit('blur')"
      @input="handleInput"
    />
    <div v-if="errorMessage" class="mt-1 flex flex-row">
      <Body variant="small" class="text-red-400">
        {{ errorMessage }}
      </Body>
    </div>
  </div>
</template>

<script setup lang="ts">
import { InputType } from 'node:zlib';

import { InputTypes, InputVariants } from '#/shared/constants/designSystem.constants.ts';
import { InputVariant } from '#/shared/types/designSystem.types.ts';

import Body from './Body.base.vue';

interface Properties {
  id: string;
  doAutoComplete?: boolean;
  errorMessage?: string;
  modelValue: string;
  isDisabled?: boolean;
  isRequired?: boolean;
  label?: string;
  placeholder?: string;
  type?: InputType;
  variant?: InputVariant;
}

const emit = defineEmits(['blur', 'update:modelValue']);

withDefaults(defineProps<Properties>(), {
  errorMessage: '',
  doAutoComplete: false,
  isDisabled: false,
  isRequired: false,
  label: '',
  placeholder: '',
  type: InputTypes.Text,
  variant: InputVariants.Primary,
});

const handleInput = (event: Event) => {
  const { value } = event.target as HTMLInputElement;

  emit('update:modelValue', value);
};

const blockInvalidNumberInput = (event: KeyboardEvent) => {
  if (/^[+Ee-]$/.test(event.key)) {
    event.preventDefault();
  }
};
</script>

<style scoped>
@reference '#/assets/style.css';

input {
  @apply block w-full rounded-md border-2 border-transparent p-2 text-sm;
}

input:focus,
input:focus-visible {
  @apply outline-none;
}

input:focus-visible:not(.ghost) {
  @apply border-yellow-400 outline-hidden;
}

input:disabled {
  @apply border-primary-3 bg-primary-3 text-primary-2 cursor-not-allowed;
}

input[type='number'] {
  -moz-appearance: textfield;
  appearance: textfield;
  margin: 0;
}

input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input.error:not(:disabled) {
  @apply border-red-400 bg-red-400/20 text-red-400;
}

.primary {
  @apply border-primary-3;
}

.ghost {
  @apply rounded-none;
}
</style>

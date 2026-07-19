<template>
  <div class="scroll-wrapper">
    <div class="tab-list">
      <div
        v-for="tab in tabs"
        :id="`tab-${tab.value}`"
        :key="tab.value"
        :class="['tab', tab.value === selected ? 'tab--selected' : 'tab--not-selected']"
        :tabindex="selected === tab.value ? -1 : 0"
        @keydown.enter="selectTab(tab.value)"
        @mousedown="selectTab(tab.value)"
      >
        <Icon v-if="tab.icon" :icon="tab.icon" class="tab-list-icon" />
        <Body :variant="BodyVariants.Base">{{ tab.label }}</Body>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import { BodyVariants } from '#/shared/constants/designSystem.constants.ts';
import { Tab } from '#/shared/types/designSystem.types.ts';

import Body from './Body.base.vue';
import Icon from './Icon.base.vue';

interface Properties {
  tabs: Tab[];
  modelValue?: string;
}

const properties = defineProps<Properties>();
const emit = defineEmits(['update:modelValue']);
const selected = ref(properties.modelValue ?? properties.tabs.at(0)?.value);

const selectTab = (value: string) => {
  selected.value = value;
  emit('update:modelValue', value);
};
</script>

<style scoped>
@reference '#/assets/style.css';

.scroll-wrapper {
  @apply overflow-x-auto;

  scrollbar-width: none;
  scrollbar-gutter: stable;
}

.tab-list {
  @apply border-primary-3 flex w-max min-w-full flex-row items-center border-b-2;
}

.tab-list-icon {
  @apply size-6;
}

.tab {
  @apply -mb-0.5 flex flex-row items-center space-x-2 px-4 py-2;
}

.tab--selected {
  @apply cursor-default border-b-2 border-yellow-400;
}

.tab--not-selected {
  @apply text-primary-2 cursor-pointer;
}

.tab--not-selected:hover {
  @apply text-primary-2/80;
}

.tab:focus-visible {
  @apply rounded-md ring-2 ring-yellow-400 outline-hidden ring-inset;
}
</style>

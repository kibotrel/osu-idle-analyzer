<template>
  <div class="sidebar-track">
    <nav
      ref="navigationRef"
      :class="['sidebar', collapsed ? 'sidebar--collapsed' : 'sidebar--expanded']"
    >
      <div
        :class="[
          'sidebar-header',
          collapsed ? 'sidebar-item--collapsed' : 'sidebar-item--expanded',
        ]"
      >
        <img src="/32.png" />
        <Headline v-if="!collapsed"> Toolbox </Headline>
      </div>

      <div class="sidebar-items-container">
        <div
          v-for="item in tabs"
          :key="item.value"
          :id="`${id}-${item.value}`"
          :class="[
            'sidebar-item',
            collapsed ? 'sidebar-item--collapsed' : 'sidebar-item--expanded',
            item.value === selected ? 'sidebar-item--selected' : 'sidebar-item--idle',
          ]"
          :title="item.label"
          tabindex="0"
          @click="selectItem(item.value)"
          @keydown.enter.prevent="selectItem(item.value)"
        >
          <Icon v-if="item.icon" :icon="item.icon" class="sidebar-item-icon" />
          <Headline :variant="HeadlineVariants.Subtitle" v-if="!collapsed">
            {{ item.label }}
          </Headline>
        </div>
      </div>
      <div
        @click="collapsed = !collapsed"
        :class="[
          'sidebar-item sidebar-toggle',
          collapsed ? 'sidebar-item--collapsed' : 'sidebar-item--expanded',
        ]"
      >
        <Icon
          :icon="collapsed ? Icons.ChevronDoubleRight : Icons.ChevronDoubleLeft"
          class="sidebar-item-icon"
        />
        <Headline :variant="HeadlineVariants.Subtitle" v-if="!collapsed"> Collapse </Headline>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';

import { HeadlineVariants, Icons } from '#/shared/constants/designSystem.constants.ts';
import { Tab } from '#/shared/types/designSystem.types.ts';

import Headline from './Headline.base.vue';
import Icon from './Icon.base.vue';

interface Properties {
  id: string;
  tabs: Tab[];
  modelValue?: string;
}

const properties = defineProps<Properties>();
const emit = defineEmits(['update:modelValue']);

const collapsed = ref(true);
const selected = ref(properties.modelValue);
const navigationRef = ref<HTMLElement | null>(null);

const selectItem = (value: string) => {
  selected.value = value;
  collapsed.value = true;

  emit('update:modelValue', value);
};

const onOutsideClick = (event: MouseEvent) => {
  if (
    !collapsed.value &&
    navigationRef.value &&
    !navigationRef.value.contains(event.target as Node)
  ) {
    collapsed.value = true;
  }
};

onMounted(() => document.addEventListener('mousedown', onOutsideClick));
onBeforeUnmount(() => document.removeEventListener('mousedown', onOutsideClick));
</script>

<style scoped>
@reference '#/assets/style.css';

.sidebar-track {
  @apply shrink-0 w-12;
}

.sidebar {
  @apply border-primary-3 z-10 flex flex-col border-r-2 min-h-full bg-primary-4;
}

.sidebar--collapsed {
  @apply relative w-12;
}

.sidebar--expanded {
  @apply absolute w-48;
}

.sidebar-header {
  @apply my-4 flex flex-row items-center gap-1 overflow-hidden;
}

.sidebar-item {
  @apply flex flex-row gap-1 items-center overflow-hidden cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500;
}

.sidebar-item--selected {
  @apply text-primary-1 border-r-2 border-yellow-500 -mr-0.5;
}

.sidebar-item--idle {
  @apply text-primary-2 hover:text-primary-1;
}

.sidebar-item--collapsed {
  @apply justify-center;
}

.sidebar-item--expanded {
  @apply pl-3;
}

.sidebar-item-icon {
  @apply size-6;
}

.sidebar-items-container {
  @apply space-y-4 mt-4;
}

.sidebar-toggle {
  @apply mt-auto mb-4 text-primary-2;
}
</style>

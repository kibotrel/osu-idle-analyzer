<template>
  <component :is="svgComponent()" />
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue';

import { Icon } from '#/shared/types/designSystem.types.ts';

const properties = defineProps<{
  icon: Icon;
}>();

const svgComponent = () => {
  return defineAsyncComponent(() => {
    return import(`#/shared/components/icons/${properties.icon}.icon.vue`);
  });
};
</script>

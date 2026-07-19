<template>
  <div class="popup-container">
    <div class="popup-header">
      <img src="/32.png" />
      <Headline>Toolbox</Headline>
    </div>
    <Tablist :tabs v-model="tab" class="mb-2" />
    <div v-if="tab === TabNames.Extractor">
      <ScoreExtractorTab />
    </div>
    <div v-else-if="tab === TabNames.Simulator">
      <Body class="italic text-primary-2">Work in progress...</Body>
    </div>
    <div v-else-if="tab == TabNames.Settings">
      <SettingsTab />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import Body from '#/shared/components/base/Body.base.vue';
import Headline from '#/shared/components/base/Headline.base.vue';
import Tablist from '#/shared/components/base/TabList.base.vue';
import { Icons } from '#/shared/constants/designSystem.constants.ts';
import { Tab } from '#/shared/types/designSystem.types.ts';

import ScoreExtractorTab from './tabs/score-extractor/ScoreExtractor.tab.vue';
import SettingsTab from './tabs/settings/Settings.tab.vue';

const TabNames = {
  Extractor: 'extractor',
  Settings: 'settings',
  Simulator: 'simulator',
} as const;

type TabName = (typeof TabNames)[keyof typeof TabNames];

const tab = ref<TabName>(TabNames.Extractor);
const tabs: Tab<TabName>[] = [
  {
    label: 'Extractor',
    value: TabNames.Extractor,
    icon: Icons.Calculator,
  },
  {
    label: 'Simulator',
    value: TabNames.Simulator,
    icon: Icons.Cpu,
  },
  {
    label: 'Settings',
    value: TabNames.Settings,
    icon: Icons.Gear,
  },
];
</script>

<style scoped>
@reference '#/assets/style.css';

.popup-container {
  @apply w-lg m-4;
}

.popup-header {
  @apply flex flex-row justify-center items-center gap-2;
}
</style>

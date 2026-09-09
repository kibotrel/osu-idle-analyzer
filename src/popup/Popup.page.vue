<template>
  <div class="popup-container">
    <div class="popup-body">
      <Sidebar id="navigation-sidebar" :tabs v-model="tab" />
      <div class="popup-content">
        <div v-if="tab === TabNames.Extractor">
          <ScoreExtractorTab />
        </div>
        <div v-else-if="tab == TabNames.Settings">
          <SettingsTab />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import Sidebar from '#/shared/components/base/Sidebar.base.vue';
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
    label: 'Score extractor',
    value: TabNames.Extractor,
    icon: Icons.BarsArrowDown,
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
  @apply w-lg;
}

.popup-body {
  @apply flex flex-row items-stretch overflow-visible;
}

.popup-logo {
  @apply flex flex-row items-center gap-2 overflow-hidden px-2 py-2;
}

.popup-content {
  @apply flex-1 min-w-0 m-4;
}
</style>

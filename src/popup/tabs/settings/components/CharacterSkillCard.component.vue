<template>
  <div class="skill-container">
    <div class="skill-data">
      <Body :variant="BodyVariants.Small" class="text-primary-2">{{ name }}</Body>
      <Body class="font-semibold">{{ level }}</Body>
    </div>
    <ProgressBar :current="xp.inCurrentLevel" :max="xp.toNextLevel" />
  </div>
</template>

<script setup lang="ts">
import Body from '#/shared/components/base/Body.base.vue';
import ProgressBar from '#/shared/components/base/ProgressBar.base.vue';
import { BodyVariants } from '#/shared/constants/designSystem.constants.ts';
import { Skill } from '#/shared/types/data.type.ts';

type Properties = Skill;

const properties = defineProps<Properties>();
</script>
<style scoped>
@reference '#/assets/style.css';

.skill-container {
  @apply bg-primary-3 p-2 rounded-lg border border-faded-primary-1;
}

.skill-data {
  @apply flex flex-row justify-between items-center mb-1;
}
</style>

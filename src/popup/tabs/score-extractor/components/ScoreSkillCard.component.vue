<template>
  <div class="skill-card">
    <Body :variant="BodyVariants.Small" class="text-primary-2">{{ name }}</Body>
    <div class="skill-value">
      <Body class="font-semibold">{{ xp.perSecond.toFixed(2) }}</Body>
      <Caption class="text-primary-2">/s</Caption>
    </div>
  </div>
</template>

<script setup lang="ts">
import Body from '#/shared/components/base/Body.base.vue';
import Caption from '#/shared/components/base/Caption.base.vue';
import { BodyVariants } from '#/shared/constants/designSystem.constants.ts';
import { ScoreSkill } from '#/shared/types/data.type.ts';

type Properties = ScoreSkill;

defineProps<Properties>();
</script>

<style scoped>
@reference '#/assets/style.css';

.skill-card {
  @apply bg-primary-3 border border-faded-primary-1 rounded-lg p-2 flex flex-row items-center justify-between gap-1;
}

.skill-value {
  @apply flex items-baseline;
}
</style>

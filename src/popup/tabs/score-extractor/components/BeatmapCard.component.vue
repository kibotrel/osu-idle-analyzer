<template>
  <div class="beatmap-card">
    <img
      v-if="backgroundUrl"
      :src="backgroundUrl"
      alt="beatmap-background-image"
      class="beatmap-background"
    />
    <div class="beatmap-metadata">
      <Body class="font-semibold truncate">{{ title }}</Body>
      <div class="beatmap-details">
        <Body :variant="BodyVariants.Small" class="text-primary-2 truncate">
          {{ difficultyName }}
          <span v-if="starRating !== null"> &#9733;{{ starRating.toFixed(2) }} </span>
        </Body>
        <Body
          v-if="durationInSeconds"
          :variant="BodyVariants.Small"
          class="text-primary-2 shrink-0"
        >
          {{ formatDuration(durationInSeconds) }}
        </Body>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Body from '#/shared/components/base/Body.base.vue';
import { BodyVariants } from '#/shared/constants/designSystem.constants.ts';
import { Beatmap } from '#/shared/types/data.type.ts';

type Properties = Beatmap;

defineProps<Properties>();

const formatDuration = (time: number): string => {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  return `${minutes}:${String(seconds).padStart(2, '0')}`;
};
</script>

<style scoped>
@reference '#/assets/style.css';

.beatmap-card {
  @apply relative flex items-center gap-3 rounded-lg overflow-hidden bg-primary-3 border border-faded-primary-1 p-2;
}

.beatmap-background {
  @apply absolute inset-0 w-full h-full object-cover opacity-25 pointer-events-none;
}

.beatmap-metadata {
  @apply relative flex flex-col gap-0.5 w-full;
}

.beatmap-details {
  @apply flex flex-row justify-between gap-2 w-full;
}
</style>

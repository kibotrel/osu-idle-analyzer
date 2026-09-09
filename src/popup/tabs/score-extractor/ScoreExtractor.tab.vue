<template>
  <div class="extractor-container">
    <div v-if="score" class="score-section">
      <BeatmapCard v-bind="score.beatmap" />
      <Separator />
      <Headline>Skills</Headline>
      <div class="skills-grid">
        <ScoreSkillCard
          v-for="skill in score.gainedSkills.filter((skill) => skill.xp.absolute > 0)"
          :key="`score-skill-${skill.name}`"
          v-bind="skill"
        />
      </div>
      <ScoreSkillCard key="score-skill-total" v-bind="TotalXp" class="border-yellow-500!" />
      <Separator class="mt-1" />
    </div>
    <Caption v-if="actionFeedback" :class="`action-feedback--${actionFeedback.level}`">
      {{ actionFeedback.message }}
    </Caption>

    <div class="flex flex-row gap-2">
      <Button
        :isLoading
        class="w-full"
        id="extract-score-button"
        @keydown.enter="onExtract"
        @mousedown.prevent="onExtract"
      >
        <template #icon>
          <Icon :icon="Icons.Bolt" />
        </template>
        Extract
      </Button>
      <Button
        :isLoading
        :isDisabled="!score?.exportableData"
        :variant="ButtonVariants.Secondary"
        class="w-full"
        id="copy-score-to-clipboard"
        @keydown.enter="onCopyToClipboard"
        @mousedown.prevent="onCopyToClipboard"
      >
        <template #icon>
          <Icon :icon="Icons.ClipboardDocument" />
        </template>
        Copy to clipboard
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ComputedRef, onMounted } from 'vue';

import Button from '#/shared/components/base/Button.base.vue';
import Caption from '#/shared/components/base/Caption.base.vue';
import Headline from '#/shared/components/base/Headline.base.vue';
import Icon from '#/shared/components/base/Icon.base.vue';
import Separator from '#/shared/components/base/Separator.base.vue';
import { Skills } from '#/shared/constants/data.constants.ts';
import { ButtonVariants, Icons } from '#/shared/constants/designSystem.constants.ts';
import { unitsPerSecond } from '#/shared/methods/maths.methods.ts';
import { ScoreSkill } from '#/shared/types/data.type.ts';

import BeatmapCard from './components/BeatmapCard.component.vue';
import ScoreSkillCard from './components/ScoreSkillCard.component.vue';
import { useScoreExtractor } from './composables/useScoreExtractor.composable.ts';

const { actionFeedback, isLoading, score, copyScoreToClipboard, extractScoreData, init } =
  useScoreExtractor();

const TotalXp: ComputedRef<ScoreSkill> = computed(() => {
  const defaultTotalXp = { name: Skills.Total, xp: { absolute: 0, perSecond: 0 } };

  if (!score.value) {
    return defaultTotalXp;
  }

  const totalAbsolute = score.value.gainedSkills.reduce(
    (total, skill) => total + skill.xp.absolute,
    0
  );

  return {
    name: Skills.Total,
    xp: {
      absolute: totalAbsolute,
      perSecond: unitsPerSecond({
        total: totalAbsolute,
        duration: score.value.beatmap.durationInSeconds,
      }),
    },
  };
});

const onCopyToClipboard = async (): Promise<void> => {
  if (!score.value?.exportableData) {
    return;
  }

  await copyScoreToClipboard(score.value?.exportableData);
};

const onExtract = async (): Promise<void> => {
  await extractScoreData();
};

onMounted(init);
</script>

<style scoped>
@reference '#/assets/style.css';

.extractor-container {
  @apply flex flex-col gap-3;
}

.score-section {
  @apply flex flex-col gap-2;
}

.skills-grid {
  @apply grid grid-cols-3 gap-2;
}

.total-xp {
  @apply flex flex-row justify-between items-center bg-primary-3 border border-yellow-400 rounded-lg px-3 py-2;
}

.action-feedback--error {
  @apply text-red-500 text-center;
}

.action-feedback--success {
  @apply text-green-500 text-center;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

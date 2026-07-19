<template>
  <div>
    <CharacterCard />
    <Separator class="my-2" />
    <div>
      <div class="flex flex-row justify-between items-center my-4">
        <Headline>Skills</Headline>
        <Button
          class="w-24 h-9"
          id="refresh-character-skills-button"
          :variant="ButtonVariants.Primary"
          :isLoading
          @keydown.enter="onRefresh"
          @mousedown.prevent="onRefresh"
        >
          <template #icon><Icon :icon="Icons.ArrowPath" /></template>
          Refresh
        </Button>
      </div>
      <div class="grid grid-cols-2 gap-y-2 gap-x-4 mt-1">
        <CharacterSkillCard
          v-for="skill in character.skills"
          :key="`character-skill-card-${skill.name.toLocaleLowerCase()}`"
          v-bind="skill"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';

import Button from '#/shared/components/base/Button.base.vue';
import Headline from '#/shared/components/base/Headline.base.vue';
import Icon from '#/shared/components/base/Icon.base.vue';
import Separator from '#/shared/components/base/Separator.base.vue';
import { ButtonVariants, Icons } from '#/shared/constants/designSystem.constants.ts';

import CharacterCard from './components/CharacterCard.component.vue';
import CharacterSkillCard from './components/CharacterSkillCard.component.vue';
import { useCharacter } from './composables/useCharacter.composable.ts';

const { character, fetchCharacter, isLoading, init } = useCharacter();

const onRefresh = () => {
  fetchCharacter(character.value.id);
};

onMounted(init);
</script>

<style scoped>
@reference '#/assets/style.css';

.reset-btn {
  @apply text-primary-2 hover:text-primary-1 transition-colors cursor-pointer;
}
</style>

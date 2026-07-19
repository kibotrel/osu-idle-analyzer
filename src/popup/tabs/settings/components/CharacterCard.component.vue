<template>
  <div class="character-card-container character-card-row">
    <div class="character-card-row">
      <CharacterAvatar :url="character.avatarUrl" />

      <div v-if="character.id && !isEditing">
        <div class="character-card-row">
          <Headline :class="[{ 'italic text-primary-2': !character.name }]">{{
            character.name || 'Unknown Character'
          }}</Headline>
          <Button
            :variant="ButtonVariants.Ghost"
            @keydown.enter="onEdit"
            @mousedown.prevent="onEdit"
            class="-ml-2"
            id="character-card-reset-id-button"
          >
            <Icon :icon="Icons.PencilSquare" />
          </Button>
        </div>
        <Caption v-if="character.name" class="text-primary-2">ID {{ character.id }}</Caption>
      </div>
      <div v-else class="character-chard-row">
        <Input
          :id="inputComponentId"
          :type="InputTypes.Number"
          @blur="onBlur"
          @keydown.enter="onBlur"
          class="w-30"
          placeholder="Character ID"
          ref="idInputRef"
          v-model="idInput"
        />
      </div>
    </div>

    <div class="character-card-level-container">
      <Headline v-if="character.name">Lv. {{ character.globalLevel }}</Headline>
    </div>
  </div>
</template>
<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue';

import Button from '#/shared/components/base/Button.base.vue';
import Caption from '#/shared/components/base/Caption.base.vue';
import Headline from '#/shared/components/base/Headline.base.vue';
import Icon from '#/shared/components/base/Icon.base.vue';
import Input from '#/shared/components/base/Input.base.vue';
import { ButtonVariants, Icons, InputTypes } from '#/shared/constants/designSystem.constants.ts';

import { useCharacter } from '../composables/useCharacter.composable.ts';
import CharacterAvatar from './CharacterAvatar.component.vue';

const { character, fetchCharacter, init } = useCharacter();

onMounted(init);

const idInput = ref(character.value.id > 0 ? character.value.id.toString() : '');
const idInputRef = ref<InstanceType<typeof Input> | null>(null);
const inputComponentId = 'character-card-input-id';
const isEditing = ref(false);

const onBlur = () => {
  isEditing.value = false;

  const newId = parseInt(idInput.value, 10);

  if (newId === character.value.id) {
    return;
  }

  fetchCharacter(newId);
};

const onEdit = () => {
  isEditing.value = true;

  nextTick(() => {
    idInputRef.value?.$el?.querySelector(`#${inputComponentId}`)?.focus();
  });
};
</script>
<style scoped>
@reference '#/assets/style.css';

.character-card-container {
  @apply bg-primary-3 p-2 rounded-lg justify-between border border-faded-primary-1;
}

.character-card-row {
  @apply flex flex-row items-center gap-2;
}

.character-card-level-container {
  @apply flex flex-row items-center gap-2 ml-2 shrink-0 text-yellow-500;
}
</style>

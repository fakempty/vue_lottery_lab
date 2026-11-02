<script setup lang="ts">
import type { Participant } from '../types/participant';
import WinnerBadge from './WinnerBadge.vue';
import BaseButton from './BaseButton.vue';

defineProps<{
  winners: Participant[];
  canPick: boolean;
}>();

defineEmits<{
  (e: 'pick'): void;
  (e: 'remove', id: string): void;
}>();
</script>

<template>
  <div class="card-box winners-container">
    <div class="winners-list">
      <span class="fw-bold me-2">Winners:</span>
      <span v-if="winners.length === 0" class="text-muted small">No winners yet</span>
      
      <WinnerBadge
        v-for="w in winners"
        :key="w.id"
        :winner="w"
        @remove="$emit('remove', $event)"
      />
    </div>

    <BaseButton :disabled="!canPick" @click="$emit('pick')">
      New winner
    </BaseButton>
  </div>
</template>

<style scoped>
.winners-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
}

.winners-list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
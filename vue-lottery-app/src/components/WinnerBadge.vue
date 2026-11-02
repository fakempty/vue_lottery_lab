<script setup lang="ts">
import type { Participant } from '../types/participant';

defineProps<{
  winner: Participant;
}>();

defineEmits<{
  (e: 'remove', id: string): void;
}>();
</script>

<template>
  <span class="winner-badge">
    <span class="winner-name">{{ winner.name }}</span>
    <button
      type="button"
      class="badge-close-btn"
      title="Видалити"
      @click="$emit('remove', winner.id)"
    >
      &times;
    </button>
  </span>
</template>

<style scoped>
.winner-badge {
  display: inline-flex;
  align-items: center;
  background-color: #0ea5e9;
  color: #ffffff;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
  margin-right: 6px;
}

.winner-name {
  margin-right: 8px;
}

.badge-close-btn {
  background: transparent;
  border: none;
  color: #ffffff;
  font-size: 1.1rem;
  line-height: 1;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.badge-close-btn:hover {
  opacity: 0.8;
}
</style>
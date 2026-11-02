<script setup lang="ts">
import { ref, watch } from 'vue';

const emit = defineEmits<{
  (e: 'filter-by-name', query: string): void;
}>();

const query = ref('');
let timer: ReturnType<typeof setTimeout> | null = null;

watch(query, (newVal) => {
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => {
    emit('filter-by-name', newVal.trim());
  }, 300);
});
</script>

<template>
  <div class="mb-3">
    <input
      v-model="query"
      type="text"
      class="form-control"
      placeholder="Search participant by name..."
    />
  </div>
</template>

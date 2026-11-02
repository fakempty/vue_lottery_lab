<script setup lang="ts">
import type { Participant, SortField, SortOrder } from '../types/participant';
import BaseButton from './BaseButton.vue';

defineProps<{
  participants: Participant[];
  sortField: SortField;
  sortOrder: SortOrder;
}>();

defineEmits<{
  (e: 'sort', field: 'name' | 'dob'): void;
  (e: 'edit', participant: Participant): void;
  (e: 'delete', participant: Participant): void;
}>();
</script>

<template>
  <div class="card-box">
    <table class="table table-hover align-middle mb-0">
      <thead class="table-light">
        <tr>
          <th>#</th>
          <th role="button" class="user-select-none" @click="$emit('sort', 'name')">
            Name {{ sortField === 'name' ? (sortOrder === 'asc' ? '▲' : '▼') : '↕' }}
          </th>
          <th role="button" class="user-select-none" @click="$emit('sort', 'dob')">
            Date of Birth {{ sortField === 'dob' ? (sortOrder === 'asc' ? '▲' : '▼') : '↕' }}
          </th>
          <th>Email</th>
          <th>Phone number</th>
          <th class="text-end">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="participants.length === 0">
          <td colspan="6" class="text-center text-muted py-4">No participants found</td>
        </tr>
        <tr v-for="(p, index) in participants" :key="p.id">
          <td>{{ index + 1 }}</td>
          <td>{{ p.name }}</td>
          <td>{{ p.dob }}</td>
          <td>{{ p.email }}</td>
          <td>{{ p.phone }}</td>
          <td class="text-end">
            <BaseButton variant="secondary" class="btn-sm me-2" @click="$emit('edit', p)">
              Редагувати
            </BaseButton>
            <BaseButton variant="danger" class="btn-sm" @click="$emit('delete', p)">
              Видалити
            </BaseButton>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

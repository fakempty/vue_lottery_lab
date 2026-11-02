<script setup lang="ts">
import { ref, computed, watch, reactive, onMounted } from 'vue';
import type { Participant, SortField, SortOrder } from './types/participant';
import WinnersBlock from './components/WinnersBlock.vue';
import RegisterForm from './components/RegisterForm.vue';
import SearchBar from './components/SearchBar.vue';
import ParticipantsTable from './components/ParticipantsTable.vue';
import Modal from './components/Modal.vue';
import BaseInput from './components/BaseInput.vue';
import BaseButton from './components/BaseButton.vue';

const participants = ref<Participant[]>([]);
const winners = ref<Participant[]>([]);
const searchQuery = ref('');
const sortField = ref<SortField>(null);
const sortOrder = ref<SortOrder>('asc');

onMounted(() => {
  const saved = localStorage.getItem('lottery_participants');
  if (saved) {
    try {
      participants.value = JSON.parse(saved);
    } catch {
      participants.value = [];
    }
  }
});

watch(
  participants,
  (newVal) => {
    localStorage.setItem('lottery_participants', JSON.stringify(newVal));
  },
  { deep: true }
);

const existingEmails = computed(() =>
  participants.value.map((p) => p.email.toLowerCase())
);

const filteredAndSortedParticipants = computed(() => {
  let list = [...participants.value];

  if (searchQuery.value) {
    list = list.filter((p) =>
      p.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }

  if (sortField.value) {
    list.sort((a, b) => {
      const valA = a[sortField.value!].toLowerCase();
      const valB = b[sortField.value!].toLowerCase();
      if (valA < valB) return sortOrder.value === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder.value === 'asc' ? 1 : -1;
      return 0;
    });
  }

  return list;
});

const handleSort = (field: 'name' | 'dob') => {
  if (sortField.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortField.value = field;
    sortOrder.value = 'asc';
  }
};

const addParticipant = (data: Omit<Participant, 'id'>) => {
  participants.value.push({
    id: Date.now().toString(),
    ...data,
  });
};

const availableWinners = computed(() => {
  return participants.value.filter(
    (p) => !winners.value.some((w) => w.id === p.id)
  );
});

const canPickWinner = computed(
  () => winners.value.length < 3 && availableWinners.value.length > 0
);

const pickWinner = () => {
  console.log('Клік спрацював!', {
    canPick: canPickWinner.value,
    availableCount: availableWinners.value.length,
    participantsCount: participants.value.length
  });

  if (!canPickWinner.value || availableWinners.value.length === 0) return;

  const randomIndex = Math.floor(Math.random() * availableWinners.value.length);
  const selected = availableWinners.value[randomIndex];
  winners.value.push({ ...selected });
};  

const removeWinner = (id: string) => {
  winners.value = winners.value.filter((w) => w.id !== id);
};

const isDeleteModalOpen = ref(false);
const participantToDelete = ref<Participant | null>(null);

const openDeleteModal = (participant: Participant) => {
  participantToDelete.value = participant;
  isDeleteModalOpen.value = true;
};

const confirmDelete = () => {
  if (!participantToDelete.value) return;
  const id = participantToDelete.value.id;
  participants.value = participants.value.filter((p) => p.id !== id);
  removeWinner(id);
  isDeleteModalOpen.value = false;
};

const isEditModalOpen = ref(false);
const editForm = reactive({
  id: '',
  name: '',
  dob: '',
  email: '',
  phone: '',
});
const editErrors = reactive({
  name: '',
  dob: '',
  email: '',
  phone: '',
});

const openEditModal = (p: Participant) => {
  editForm.id = p.id;
  editForm.name = p.name;
  editForm.dob = p.dob;
  editForm.email = p.email;
  editForm.phone = p.phone;
  editErrors.name = '';
  editErrors.dob = '';
  editErrors.email = '';
  editErrors.phone = '';
  isEditModalOpen.value = true;
};

const validateEdit = (): boolean => {
  let ok = true;
  editErrors.name = '';
  editErrors.dob = '';
  editErrors.email = '';
  editErrors.phone = '';

  if (!editForm.name.trim()) {
    editErrors.name = 'Required';
    ok = false;
  }
  if (!editForm.dob || new Date(editForm.dob) > new Date()) {
    editErrors.dob = 'Valid date required';
    ok = false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const otherEmails = participants.value
    .filter((p) => p.id !== editForm.id)
    .map((p) => p.email.toLowerCase());

  if (!editForm.email.trim() || !emailRegex.test(editForm.email)) {
    editErrors.email = 'Valid email required';
    ok = false;
  } else if (otherEmails.includes(editForm.email.toLowerCase().trim())) {
    editErrors.email = 'Email already taken';
    ok = false;
  }

  const phoneRegex = /^\+380\d{9}$/;
  if (!phoneRegex.test(editForm.phone)) {
    editErrors.phone = 'Format: +380XXXXXXXXX';
    ok = false;
  }

  return ok;
};

const updateParticipant = () => {
  if (!validateEdit()) return;
  const index = participants.value.findIndex((p) => p.id === editForm.id);
  if (index !== -1) {
    participants.value[index] = { ...editForm };
    const wIndex = winners.value.findIndex((w) => w.id === editForm.id);
    if (wIndex !== -1) winners.value[wIndex] = { ...editForm };
  }
  isEditModalOpen.value = false;
};
</script>

<template>
  <main class="container" style="max-width: 800px;">
    <WinnersBlock
      :winners="winners"
      :can-pick="canPickWinner"
      @pick="pickWinner"
      @remove="removeWinner"
    />

    <RegisterForm
      :existing-emails="existingEmails"
      @submit="addParticipant"
    />

    <SearchBar @filter-by-name="searchQuery = $event" />
    <ParticipantsTable
      :participants="filteredAndSortedParticipants"
      :sort-field="sortField"
      :sort-order="sortOrder"
      @sort="handleSort"
      @edit="openEditModal"
      @delete="openDeleteModal"
    />

    <Modal :is-open="isDeleteModalOpen" @close="isDeleteModalOpen = false">
      <template #header>
        <h5 class="m-0">Видалення учасника</h5>
      </template>
      <template #body>
        <p class="m-0">
          Ви дійсно бажаєте видалити учасника
          <strong>{{ participantToDelete?.name }}</strong>,
          <strong>{{ participantToDelete?.email }}</strong>?
        </p>
      </template>
      <template #footer>
        <BaseButton variant="secondary" @click="isDeleteModalOpen = false">Ні</BaseButton>
        <BaseButton variant="danger" @click="confirmDelete">Так</BaseButton>
      </template>
    </Modal>

    <Modal :is-open="isEditModalOpen" @close="isEditModalOpen = false">
      <template #header>
        <h5 class="m-0">Редагувати дані</h5>
      </template>
      <template #body>
        <BaseInput
          v-model="editForm.name"
          label="Name"
          :error="editErrors.name"
        />
        <BaseInput
          v-model="editForm.dob"
          label="Date of Birth"
          type="date"
          :error="editErrors.dob"
        />
        <BaseInput
          v-model="editForm.email"
          label="Email"
          type="email"
          :error="editErrors.email"
        />
        <BaseInput
          v-model="editForm.phone"
          label="Phone number"
          :error="editErrors.phone"
        />
      </template>
      <template #footer>
        <BaseButton variant="secondary" @click="isEditModalOpen = false">Скасувати</BaseButton>
        <BaseButton @click="updateParticipant">Оновити дані</BaseButton>
      </template>
    </Modal>
  </main>
</template>

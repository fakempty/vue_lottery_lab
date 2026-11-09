<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ServiceProvider } from '../services/service-provider';

const props = defineProps<{ id: string }>();
const router = useRouter();
const form = ref({ firstName: '', lastName: '', email: '', phone: '' });
const isLoading = ref(true);

onMounted(async () => {
  try {
    const user = await ServiceProvider.users.getById(Number(props.id));
    form.value = { firstName: user.firstName, lastName: user.lastName, email: user.email, phone: user.phone };
  } finally {
    isLoading.value = false;
  }
});

const onUpdate = async () => {
  try {
    await ServiceProvider.users.update(Number(props.id), form.value);
    alert('Оновлено (імітація DummyJSON)!');
    router.push('/users');
  } catch (e: any) {
    alert(e.message);
  }
};
</script>

<template>
  <div class="card-box mb-3 border border-warning">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h5 class="fw-bold m-0 text-warning">Редагування ID: {{ id }}</h5>
      <button class="btn btn-sm btn-outline-secondary" @click="router.push('/users')">✕</button>
    </div>
    <div v-if="isLoading">Завантаження...</div>
    <form v-else @submit.prevent="onUpdate">
      <div class="row g-2 mb-2">
        <div class="col"><input v-model="form.firstName" class="form-control" required /></div>
        <div class="col"><input v-model="form.lastName" class="form-control" required /></div>
      </div>
      <div class="mb-2"><input v-model="form.email" type="email" class="form-control" required /></div>
      <div class="mb-3"><input v-model="form.phone" class="form-control" required /></div>
      <button type="submit" class="btn btn-warning">Зберегти зміни</button>
    </form>
  </div>
</template>

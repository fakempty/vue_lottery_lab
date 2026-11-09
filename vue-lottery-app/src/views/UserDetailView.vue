<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ServiceProvider } from '../services/service-provider';
import type { User } from '../types/user';

const props = defineProps<{ id: string }>();
const router = useRouter();
const user = ref<User | null>(null);
const isLoading = ref(true);

onMounted(async () => {
  try {
    user.value = await ServiceProvider.users.getById(Number(props.id));
  } catch (e: any) {
    alert(e.message);
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="card-box mb-3 border border-info">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h5 class="fw-bold m-0 text-primary">Деталі юзера ID: {{ id }}</h5>
      <button class="btn btn-sm btn-outline-secondary" @click="router.push('/users')">✕</button>
    </div>
    <div v-if="isLoading">Завантаження...</div>
    <div v-else-if="user" class="row">
      <div class="col-md-3 text-center">
        <img :src="user.image" class="rounded-circle img-fluid border p-1" style="max-width: 100px;" />
      </div>
      <div class="col-md-9">
        <h4>{{ user.firstName }} {{ user.lastName }}</h4>
        <p class="mb-1"><strong>Email:</strong> {{ user.email }}</p>
        <p class="mb-1"><strong>Phone:</strong> {{ user.phone }}</p>
        <p class="mb-1"><strong>Username:</strong> {{ user.username }}</p>
      </div>
    </div>
  </div>
</template>

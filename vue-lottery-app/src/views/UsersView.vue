<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { ServiceProvider } from '../services/service-provider';
import type { User, CreateUserDto } from '../types/user';
import { useForm, useField } from 'vee-validate';
import { z } from 'zod';
import { toTypedSchema } from '@vee-validate/zod';

const router = useRouter();
const route = useRoute();

const users = ref<User[]>([]);
const total = ref(0);
const limit = 5;
const isLoading = ref(false);
const error = ref<string | null>(null);

const searchQuery = ref((route.query.q as string) || '');
const currentPage = ref(Number(route.query.page) || 1);

const fetchUsers = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    const skip = (currentPage.value - 1) * limit;
    const res = await ServiceProvider.users.getWithTotal({
      limit,
      skip,
      q: searchQuery.value,
    });
    users.value = res.users;
    total.value = res.total;
  } catch (err: any) {
    error.value = err.message || 'Помилка завантаження';
  } finally {
    isLoading.value = false;
  }
};

watch([currentPage, searchQuery], () => {
  router.push({
    path: '/users',
    query: {
      page: currentPage.value,
      ...(searchQuery.value ? { q: searchQuery.value } : {}),
    },
  });
  fetchUsers();
});

onMounted(() => {
  fetchUsers();
});

const isAddModalOpen = ref(false);
const validationSchema = toTypedSchema(
  z.object({
    firstName: z.string().min(1, "Ім'я обов'язкове"),
    lastName: z.string().min(1, "Прізвище обов'язкове"),
    email: z.string().email("Некоректний email"),
    phone: z.string().min(1, "Телефон обов'язковий"),
    username: z.string().min(3, "Мінімум 3 символи"),
    password: z.string().min(6, "Мінімум 6 символів"),
    age: z.number().min(1),
    gender: z.string(),
  })
);

const { handleSubmit, resetForm } = useForm<CreateUserDto>({
  validationSchema,
  initialValues: { firstName: '', lastName: '', email: '', phone: '', username: '', password: '', age: 25, gender: 'male' },
});

const { value: fn, errorMessage: fnErr } = useField<string>('firstName');
const { value: ln, errorMessage: lnErr } = useField<string>('lastName');
const { value: em, errorMessage: emErr } = useField<string>('email');
const { value: ph, errorMessage: phErr } = useField<string>('phone');
const { value: un, errorMessage: unErr } = useField<string>('username');
const { value: pw, errorMessage: pwErr } = useField<string>('password');
const { value: ag } = useField<number>('age');
const { value: gn } = useField<string>('gender');

const onCreateUser = handleSubmit(async (values) => {
  try {
    const newUser = await ServiceProvider.users.create(values);
    users.value = [{ ...newUser, id: Date.now() }, ...users.value];
    isAddModalOpen.value = false;
    resetForm();
  } catch (e: any) {
    alert(e.message);
  }
});

const deleteUser = async (id: number) => {
  if (!confirm(`Видалити користувача ID ${id}?`)) return;
  try {
    await ServiceProvider.users.delete(id);
    users.value = users.value.filter((u) => u.id !== id);
  } catch (e: any) {
    alert(e.message);
  }
};
</script>

<template>
  <div>
    <RouterView />

    <div class="card-box mt-3">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h4 class="fw-bold m-0">Користувачі (DummyJSON)</h4>
        <button class="btn btn-success" @click="isAddModalOpen = true">+ Додати</button>
      </div>

      <div class="mb-3">
        <input v-model="searchQuery" type="text" class="form-control" placeholder="Пошук юзерів..." />
      </div>

      <div v-if="isLoading" class="text-center py-4 text-muted">Завантаження...</div>
      <div v-else-if="error" class="alert alert-danger">{{ error }}</div>

      <table v-else class="table table-hover align-middle mb-3">
        <thead class="table-light">
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th class="text-end">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="u in users" :key="u.id">
            <td>{{ u.id }}</td>
            <td><strong>{{ u.firstName }} {{ u.lastName }}</strong></td>
            <td>{{ u.email }}</td>
            <td>{{ u.phone }}</td>
            <td class="text-end">
              <RouterLink :to="`/users/${u.id}`" class="btn btn-outline-info btn-sm me-2">Деталі</RouterLink>
              <RouterLink :to="`/users/${u.id}/edit`" class="btn btn-outline-warning btn-sm me-2">Редагувати</RouterLink>
              <button class="btn btn-outline-danger btn-sm" @click="deleteUser(u.id)">Видалити</button>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="d-flex justify-content-between align-items-center">
        <span class="text-muted small">Всього: {{ total }}</span>
        <div class="btn-group">
          <button class="btn btn-outline-secondary btn-sm" :disabled="currentPage <= 1" @click="currentPage--">&laquo;</button>
          <button class="btn btn-secondary btn-sm disabled">Сторінка {{ currentPage }}</button>
          <button class="btn btn-outline-secondary btn-sm" :disabled="currentPage * limit >= total" @click="currentPage++">&raquo;</button>
        </div>
      </div>
    </div>

    <!-- Модалка додавання -->
    <div v-if="isAddModalOpen" class="modal-backdrop-custom">
      <div class="modal-dialog-custom">
        <h5>Створити користувача</h5>
        <form @submit.prevent="onCreateUser">
          <div class="row g-2 mb-2">
            <div class="col"><input v-model="fn" placeholder="First Name" class="form-control" /><small class="text-danger">{{ fnErr }}</small></div>
            <div class="col"><input v-model="ln" placeholder="Last Name" class="form-control" /><small class="text-danger">{{ lnErr }}</small></div>
          </div>
          <div class="mb-2"><input v-model="em" placeholder="Email" class="form-control" /><small class="text-danger">{{ emErr }}</small></div>
          <div class="mb-2"><input v-model="ph" placeholder="Phone" class="form-control" /><small class="text-danger">{{ phErr }}</small></div>
          <div class="row g-2 mb-2">
            <div class="col"><input v-model="un" placeholder="Username" class="form-control" /><small class="text-danger">{{ unErr }}</small></div>
            <div class="col"><input v-model="pw" type="password" placeholder="Password" class="form-control" /><small class="text-danger">{{ pwErr }}</small></div>
          </div>
          <div class="d-flex justify-content-end gap-2 mt-3">
            <button type="button" class="btn btn-secondary" @click="isAddModalOpen = false">Скасувати</button>
            <button type="submit" class="btn btn-primary">Зберегти</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop-custom { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1050; }
.modal-dialog-custom { background: white; border-radius: 8px; width: 100%; max-width: 480px; padding: 20px; }
</style>

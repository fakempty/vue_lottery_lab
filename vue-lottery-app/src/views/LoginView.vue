<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useForm, useField } from 'vee-validate';
import { z } from 'zod';
import { toTypedSchema } from '@vee-validate/zod';

const router = useRouter();
const route = useRoute();
const auth = useAuthStore();

const loginError = ref<string | null>(null);
const isLoading = ref(false);

const validationSchema = toTypedSchema(
  z.object({
    username: z.string().min(1, "Ім'я користувача обов'язкове"),
    password: z.string().min(6, "Мінімальна довжина пароля — 6 символів"),
  })
);

const { handleSubmit } = useForm({ validationSchema });
const { value: username, errorMessage: usernameError } = useField<string>('username');
const { value: password, errorMessage: passwordError } = useField<string>('password');

username.value = 'emilys';
password.value = 'emilyspass';

const onSubmit = handleSubmit(async (values) => {
  loginError.value = null;
  isLoading.value = true;
  try {
    await auth.login(values.username, values.password);
    const redirectPath = (route.query.redirect as string) || '/users';
    router.push(redirectPath);
  } catch (err: any) {
    loginError.value = err.message || 'Помилка авторизації. Перевірте дані.';
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="card-box w-100" style="max-width: 420px;">
    <h3 class="fw-bold text-center mb-4">Вхід у систему</h3>
    
    <div v-if="loginError" class="alert alert-danger py-2 mb-3 small">{{ loginError }}</div>

    <form @submit.prevent="onSubmit">
      <div class="mb-3">
        <label class="form-label fw-semibold">Username</label>
        <input v-model="username" type="text" :class="['form-control', { 'is-invalid': !!usernameError }]" />
        <div v-if="usernameError" class="invalid-feedback">{{ usernameError }}</div>
      </div>

      <div class="mb-4">
        <label class="form-label fw-semibold">Password</label>
        <input v-model="password" type="password" :class="['form-control', { 'is-invalid': !!passwordError }]" />
        <div v-if="passwordError" class="invalid-feedback">{{ passwordError }}</div>
      </div>

      <button type="submit" class="btn btn-primary w-100 py-2" :disabled="isLoading">
        {{ isLoading ? 'Вхід...' : 'Увійти' }}
      </button>
    </form>
    <div class="text-center mt-3 small text-muted">
      Тестові дані: <code>emilys</code> / <code>emilyspass</code>
    </div>
  </div>
</template>

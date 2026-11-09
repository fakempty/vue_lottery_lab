import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { ServiceProvider } from '../services/service-provider';

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('accessToken'));
  const user = ref<any>(JSON.parse(localStorage.getItem('authUser') || 'null'));

  const isAuthenticated = computed(() => !!token.value);

  const login = async (username: string, password: string) => {
    const data = await ServiceProvider.auth.login({ username, password });
    token.value = data.accessToken;
    user.value = {
      id: data.id,
      username: data.username,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
    };
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    localStorage.setItem('authUser', JSON.stringify(user.value));
  };

  const logout = () => {
    token.value = null;
    user.value = null;
    localStorage.clear();
  };

  return { token, user, isAuthenticated, login, logout };
});

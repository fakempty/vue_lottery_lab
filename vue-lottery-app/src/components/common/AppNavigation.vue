<script setup lang="ts">
import { useAuthStore } from '../../stores/auth';
import { useRouter } from 'vue-router';

const auth = useAuthStore();
const router = useRouter();

const handleLogout = () => {
  auth.logout();
  router.push('/login');
};
</script>

<template>
  <nav class="d-flex align-items-center gap-3">
    <RouterLink to="/" class="nav-link" active-class="active-link">Home</RouterLink>
    <RouterLink to="/about" class="nav-link" active-class="active-link">About author</RouterLink>
    <RouterLink to="/users" class="nav-link" active-class="active-link">Users</RouterLink>
    
    <button v-if="auth.isAuthenticated" class="btn btn-outline-danger btn-sm ms-2" @click="handleLogout">
      Logout ({{ auth.user?.username }})
    </button>
    <RouterLink v-else to="/login" class="btn btn-outline-primary btn-sm ms-2" active-class="active">
      Login
    </RouterLink>
  </nav>
</template>

<style scoped>
.nav-link {
  text-decoration: none;
  color: #4b5563;
  font-weight: 500;
  transition: color 0.2s;
}
.nav-link:hover {
  color: #2563eb;
}
.active-link {
  color: #2563eb !important;
  font-weight: 700;
  border-bottom: 2px solid #2563eb;
}
</style>

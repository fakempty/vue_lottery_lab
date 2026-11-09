<script setup lang="ts">
import Logo from './Logo.vue';
import AppNavigation from './AppNavigation.vue';
</script>

<template>
  <header class="bg-white border-bottom py-3 px-4 mb-4 shadow-sm">
    <div class="container d-flex justify-content-between align-items-center">
      <Logo />
      <AppNavigation />
    </div>
  </header>
</template>

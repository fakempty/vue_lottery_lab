<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'danger';
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
  }>(),
  {
    variant: 'primary',
    disabled: false,
    type: 'button',
  }
);
</script>

<template>
  <button
    :type="type"
    :class="['btn', `btn-${variant}`]"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>
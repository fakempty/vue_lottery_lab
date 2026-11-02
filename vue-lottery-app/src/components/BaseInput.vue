<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue: string;
    label?: string;
    type?: string;
    placeholder?: string;
    error?: string;
    isValid?: boolean;
  }>(),
  {
    type: 'text',
    placeholder: '',
    error: '',
    isValid: false,
  }
);

defineEmits<{
  (e: 'update:modelValue', val: string): void;
}>();
</script>

<template>
  <div class="mb-3 position-relative">
    <label v-if="label" class="form-label text-secondary fw-semibold">{{ label }}</label>
    <div class="position-relative">
      <input
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :class="['form-control', { 'is-invalid': !!error, 'is-valid': isValid && !error }]"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      />
    </div>
    <div v-if="error" class="text-danger small mt-1">
      {{ error }}
    </div>
  </div>
</template>

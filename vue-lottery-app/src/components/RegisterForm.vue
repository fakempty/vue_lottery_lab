<script setup lang="ts">
import { reactive } from 'vue';
import type { Participant } from '../types/participant';
import BaseInput from './BaseInput.vue';
import BaseButton from './BaseButton.vue';

const props = defineProps<{
  existingEmails: string[];
}>();

const emit = defineEmits<{
  (e: 'submit', participant: Omit<Participant, 'id'>): void;
}>();

const form = reactive({
  name: '',
  dob: '',
  email: '',
  phone: '',
});

const errors = reactive({
  name: '',
  dob: '',
  email: '',
  phone: '',
});

const validate = (): boolean => {
  let isValid = true;
  errors.name = '';
  errors.dob = '';
  errors.email = '';
  errors.phone = '';

  if (!form.name.trim()) {
    errors.name = 'This value is required';
    isValid = false;
  }

  if (!form.dob) {
    errors.dob = 'This value is required';
    isValid = false;
  } else if (new Date(form.dob) > new Date()) {
    errors.dob = 'Date of birth cannot be in the future';
    isValid = false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!form.email.trim()) {
    errors.email = 'This value is required';
    isValid = false;
  } else if (!emailRegex.test(form.email)) {
    errors.email = 'Invalid email address';
    isValid = false;
  } else if (props.existingEmails.includes(form.email.toLowerCase().trim())) {
    errors.email = 'Email already exists';
    isValid = false;
  }

  const phoneRegex = /^\+380\d{9}$/;
  if (!form.phone.trim()) {
    errors.phone = 'This value is required';
    isValid = false;
  } else if (!phoneRegex.test(form.phone)) {
    errors.phone = 'Phone must be in format +380XXXXXXXXX';
    isValid = false;
  }

  return isValid;
};

const handleSave = () => {
  if (!validate()) return;

  emit('submit', {
    name: form.name.trim(),
    dob: form.dob,
    email: form.email.trim(),
    phone: form.phone.trim(),
  });

  form.name = '';
  form.dob = '';
  form.email = '';
  form.phone = '';
  errors.name = '';
  errors.dob = '';
  errors.email = '';
  errors.phone = '';
};
</script>

<template>
  <div class="card-box">
    <h5 class="fw-bold mb-1">REGISTER FORM</h5>
    <p class="text-muted small mb-3">Please fill in all the fields.</p>

    <form @submit.prevent="handleSave" @keydown.enter.prevent="handleSave">
      <BaseInput
        v-model="form.name"
        label="Name"
        placeholder="Enter user name"
        :error="errors.name"
        :is-valid="!!form.name && !errors.name"
      />
      <BaseInput
        v-model="form.dob"
        label="Date of Birth"
        type="date"
        :error="errors.dob"
        :is-valid="!!form.dob && !errors.dob"
      />
      <BaseInput
        v-model="form.email"
        label="Email"
        type="email"
        placeholder="Enter email"
        :error="errors.email"
        :is-valid="!!form.email && !errors.email"
      />
      <BaseInput
        v-model="form.phone"
        label="Phone number"
        placeholder="+380XXXXXXXXX"
        :error="errors.phone"
        :is-valid="!!form.phone && !errors.phone"
      />

      <div class="d-flex justify-content-end mt-3">
        <BaseButton type="submit">Save</BaseButton>
      </div>
    </form>
  </div>
</template>

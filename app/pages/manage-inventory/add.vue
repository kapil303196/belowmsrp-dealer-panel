<template>
  <div class="pb-20">
    <layout-app-header />
    <div class="p-7 max-sm:p-5 max-sm:pt-0">
      <div class="mb-6">
        <NuxtLink to="/manage-inventory" class="text-primary/60 hover:text-primary flex items-center gap-2 mb-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Back to Inventory
        </NuxtLink>
        <h2 class="text-2xl font-semibold text-primary">Upload New Car</h2>
      </div>
      
      <SectionsCarForm
        :is-submitting="isSubmitting"
        @submit="handleSubmit"
        @cancel="handleCancel"
      />
    </div>
    <layout-primary-header />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useApi } from '~/composables/useApi';

const router = useRouter();
const { apiPostForm } = useApi();
const isSubmitting = ref(false);

const handleSubmit = async (formData) => {
  try {
    isSubmitting.value = true;
    
    // Prepare FormData for multipart upload
    const fd = new FormData();
    fd.append('make', formData.make);
    fd.append('model', formData.model);
    fd.append('year', formData.year);
    fd.append('trim', formData.trim || '');
    fd.append('msrp', formData.msrp);
    fd.append('offerPrice', formData.offerPrice);
    fd.append('autoReply', formData.autoReply);
    fd.append('description', formData.description || '');
    
    // Append new images
    if (formData.newImages && formData.newImages.length) {
        formData.newImages.forEach((file, index) => {
            fd.append(`images`, file);
        });
    }

    await apiPostForm('/api/v1/dealer/inventory', fd);
    
    router.push('/manage-inventory');
    
  } catch (error) {
    console.error('Error adding car:', error);
    alert('Failed to add car. Please try again.');
  } finally {
    isSubmitting.value = false;
  }
};

const handleCancel = () => {
  router.push('/manage-inventory');
};
</script>

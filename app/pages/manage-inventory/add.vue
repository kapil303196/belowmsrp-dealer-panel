<template>
  <div class="pb-20 bg-gray-50 min-h-screen">
    <layout-app-header />
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-6">
        <NuxtLink to="/manage-inventory" class="inline-flex items-center gap-2 text-gray-500 hover:text-secondary transition-colors mb-3 font-medium">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Back to Inventory
        </NuxtLink>
        <h2 class="text-3xl font-bold text-gray-900">Upload New Vehicle</h2>
        <p class="text-gray-500 mt-1">Add a new car to your dealership inventory.</p>
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
import Swal from 'sweetalert2';

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
    
    await Swal.fire({
      icon: 'success',
      title: 'Vehicle Added!',
      text: 'The car has been successfully added to your inventory.',
      confirmButtonColor: '#3B82F6',
      timer: 2000,
      showConfirmButton: false
    });
    
    router.push('/manage-inventory');
    
  } catch (error) {
    console.error('Error adding car:', error);
    Swal.fire({
      icon: 'error',
      title: 'Submission Failed',
      text: 'Failed to add car. Please try again.',
      confirmButtonColor: '#3B82F6'
    });
  } finally {
    isSubmitting.value = false;
  }
};

const handleCancel = () => {
  router.push('/manage-inventory');
};
</script>

<template>
  <div class="pb-20 bg-gray-50 min-h-screen">
    <layout-app-header />
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-6">
        <NuxtLink to="/manage-inventory" class="inline-flex items-center gap-2 text-gray-500 hover:text-secondary transition-colors mb-3 font-medium">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Back to Inventory
        </NuxtLink>
        <h2 class="text-3xl font-bold text-gray-900">Edit Vehicle</h2>
        <p class="text-gray-500 mt-1">Update vehicle details and pricing.</p>
      </div>
      
      <div v-if="isLoading" class="flex flex-col items-center justify-center py-20">
        <svg class="animate-spin h-10 w-10 text-secondary" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
        </svg>
        <span class="mt-4 text-gray-500 font-medium">Loading vehicle details...</span>
      </div>
      
      <SectionsCarForm
        v-else-if="carData"
        :edit-mode="true"
        :initial-data="carData"
        :is-submitting="isSubmitting"
        @submit="handleSubmit"
        @cancel="handleCancel"
      />
      
      <div v-else class="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
        <div class="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <h3 class="text-lg font-bold text-gray-900">Vehicle Not Found</h3>
        <p class="text-gray-500 mt-1">The vehicle you are looking for does not exist or has been removed.</p>
        <NuxtLink to="/manage-inventory" class="inline-block mt-4 px-6 py-2 bg-secondary text-white rounded-lg font-medium hover:bg-secondary/90 transition-colors">
          Return to Inventory
        </NuxtLink>
      </div>
    </div>
    <layout-primary-header />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useApi } from '~/composables/useApi';
import Swal from 'sweetalert2';

const route = useRoute();
const router = useRouter();
const { apiGet, apiPutForm } = useApi();

const isLoading = ref(true);
const isSubmitting = ref(false);
const carData = ref(null);

const fetchCarDetails = async () => {
  isLoading.value = true;
  try {
    const carId = route.params.id;
    const response = await apiGet(`/api/v1/dealer/inventory/${carId}`);
    carData.value = response.data || response;
  } catch (error) {
    console.error('Error fetching car details:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to load vehicle details.',
      confirmButtonColor: '#3B82F6'
    });
  } finally {
    isLoading.value = false;
  }
};

const handleSubmit = async (formData) => {
  try {
    isSubmitting.value = true;
    const carId = route.params.id;
    
    // Prepare FormData
    const fd = new FormData();
    fd.append('make', formData.make);
    fd.append('model', formData.model);
    fd.append('year', formData.year);
    fd.append('trim', formData.trim || '');
    fd.append('msrp', formData.msrp);
    fd.append('offerPrice', formData.offerPrice);
    fd.append('autoReply', formData.autoReply);
    fd.append('description', formData.description || '');
    
    // Handle images
    // Existing images to keep
    if (formData.existingImages && formData.existingImages.length) {
        fd.append('existingImages', JSON.stringify(formData.existingImages));
    }
    
    // New images
    if (formData.newImages && formData.newImages.length) {
        formData.newImages.forEach((file) => {
            fd.append('images', file);
        });
    }

    await apiPutForm(`/api/v1/dealer/inventory/${carId}`, fd);
    
    await Swal.fire({
      icon: 'success',
      title: 'Vehicle Updated!',
      text: 'Your changes have been saved successfully.',
      confirmButtonColor: '#3B82F6',
      timer: 2000,
      showConfirmButton: false
    });
    
    router.push('/manage-inventory');
    
  } catch (error) {
    console.error('Error updating car:', error);
    Swal.fire({
      icon: 'error',
      title: 'Update Failed',
      text: 'Failed to update car. Please try again.',
      confirmButtonColor: '#3B82F6'
    });
  } finally {
    isSubmitting.value = false;
  }
};

const handleCancel = () => {
  router.push('/manage-inventory');
};

onMounted(() => {
  fetchCarDetails();
});
</script>

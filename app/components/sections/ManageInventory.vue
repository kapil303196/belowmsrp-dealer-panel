<template>
  <div class="p-7 max-sm:p-5 max-sm:pt-0">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-semibold text-primary">Manage Uploaded Cars</h2>
      <NuxtLink to="/manage-inventory/add"
        class="px-4 py-2 bg-secondary text-white rounded-lg flex items-center gap-2 hover:bg-secondary/90 transition-colors">
        <span>+ Add Car</span>
      </NuxtLink>
    </div>

    <!-- Loading state -->
    <div v-if="isLoading" class="flex items-center justify-center py-10 text-primary/70">
      <svg class="animate-spin h-6 w-6" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
      </svg>
      <span class="ml-2">Loading inventory...</span>
    </div>

    <!-- Empty state -->
    <div v-if="!isLoading && !hasData"
      class="flex flex-col items-center justify-center py-16 text-primary/60 bg-[#F7FAFF] rounded-xl border border-dashed border-primary/20">
      <div class="text-lg font-medium mb-2">No cars uploaded yet</div>
      <p class="text-sm mb-4">Upload a car to start automatically responding to offers.</p>
      <NuxtLink to="/manage-inventory/add"
        class="px-4 py-2 bg-white border border-secondary text-secondary rounded-lg hover:bg-secondary/5 transition-colors">
        Upload First Car
      </NuxtLink>
    </div>

    <!-- Inventory List -->
    <div v-if="!isLoading && hasData" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="car in inventory" :key="car.id"
        class="bg-white rounded-xl shadow-sm border border-[#E8EEF9] overflow-hidden flex flex-col">
        <!-- Car Image Carousel -->
        <div class="h-48 relative">
          <UiCarImageCarousel 
            :images="car.images || []" 
            :alt="`${car.make?.name || 'Car'} ${car.model?.name || ''}`"
          />
          <div v-if="car.sold" class="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
            <span
              class="px-4 py-1 bg-red-500 text-white font-bold rounded-full transform -rotate-12 border-2 border-white">SOLD</span>
          </div>
        </div>

        <!-- Car Details -->
        <div class="p-4 flex-1 flex flex-col">
          <div class="flex justify-between items-start mb-2">
            <div>
              <h3 class="font-semibold text-lg text-primary">{{ getMake(car) }} {{ getModel(car) }}</h3>
              <p class="text-sm text-primary/60">{{ getYearAndTrim(car) }}</p>
            </div>
            <div class="text-right">
              <div class="font-bold text-secondary text-lg">${{ Number(car.offerPrice).toLocaleString() }}</div>
              <div class="text-xs text-primary/50 line-through">MSRP: ${{ Number(car.msrp).toLocaleString() }}</div>
            </div>
          </div>

          <div class="mt-auto pt-4 border-t border-[#E8EEF9] flex items-center justify-between gap-2">
            <div class="flex items-center gap-2">
              <span :class="['w-2 h-2 rounded-full', car.autoReply ? 'bg-green-500' : 'bg-gray-300']"></span>
              <span class="text-xs text-primary/70">{{ car.autoReply ? 'Auto-reply Active' : 'Manual' }}</span>
            </div>

            <div class="flex gap-2">
              <button v-if="!car.sold" @click="markAsSold(car)"
                class="text-xs px-2 py-1 rounded border border-green-600 text-green-600 hover:bg-green-50"
                title="Mark as Sold">
                Mark Sold
              </button>
              <NuxtLink :to="`/manage-inventory/${car._id}`"
                class="text-xs px-2 py-1 rounded border border-blue-600 text-blue-600 hover:bg-blue-50">
                Edit
              </NuxtLink>
              <button @click="deleteCar(car)"
                class="text-xs px-2 py-1 rounded border border-red-600 text-red-600 hover:bg-red-50">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <UiConfirmationModal :is-open="showConfirmation" :title="confirmationConfig.title"
      :message="confirmationConfig.message" :type="confirmationConfig.type"
      :confirm-text="confirmationConfig.confirmText" @confirm="handleConfirmation" @cancel="cancelConfirmation" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useApi } from '~/composables/useApi';

const { apiGet, apiPost, apiDelete } = useApi();

const inventory = ref([]);
const isLoading = ref(false);

const hasData = computed(() => inventory.value.length > 0);

// Helper functions to safely extract data
const getMakeName = (car) => {
  if (typeof car.make === 'object' && car.make?.name) {
    return car.make.name;
  }
  return car.make || '';
};

const getModelName = (car) => {
  if (typeof car.model === 'object' && car.model?.name) {
    return car.model.name;
  }
  return car.model || '';
};

const getMake = (car) => {
  const makeName = getMakeName(car);
  const modelName = getModelName(car);
  
  // If model name already starts with make name, don't show make separately
  if (modelName && makeName && modelName.toLowerCase().startsWith(makeName.toLowerCase())) {
    return '';
  }
  
  return makeName || 'Unknown Make';
};

const getModel = (car) => {
  const modelName = getModelName(car);
  return modelName || 'Unknown Model';
};


const getYearAndTrim = (car) => {
  const year = car.year || '';
  const trim = car.trim || '';
  if (!trim) return year;
  return `${year} • ${trim}`;
};

const fetchInventory = async () => {
  isLoading.value = true;
  try {
    const response = await apiGet('/api/v1/dealer/inventory');
    // Assuming response is array or response.data is array depending on backend format
    // Based on controller: res.status(200).json(inventory); -> inventory is array
    inventory.value = Array.isArray(response) ? response : (response.data || []);
    console.log('Inventory data:', inventory.value);
    if (inventory.value.length > 0) {
      console.log('First car object:', inventory.value[0]);
      console.log('Make:', inventory.value[0].make);
      console.log('Model:', inventory.value[0].model);
    }
  } catch (error) {
    console.error('Error fetching inventory:', error);
  } finally {
    isLoading.value = false;
  }
};

const showConfirmation = ref(false);
const confirmationConfig = ref({
  title: '',
  message: '',
  type: 'info',
  confirmText: 'Confirm'
});
const pendingAction = ref(null);

const openConfirmation = (config, action) => {
  confirmationConfig.value = config;
  pendingAction.value = action;
  showConfirmation.value = true;
};

const handleConfirmation = async () => {
  if (pendingAction.value) {
    await pendingAction.value();
  }
  showConfirmation.value = false;
  pendingAction.value = null;
};

const cancelConfirmation = () => {
  showConfirmation.value = false;
  pendingAction.value = null;
};

const markAsSold = (car) => {
  openConfirmation({
    title: 'Mark as Sold',
    message: 'Are you sure you want to mark this car as sold? This will stop auto-replies.',
    confirmText: 'Mark Sold',
    type: 'info'
  }, async () => {
    try {
      await apiPost(`/api/v1/dealer/inventory/${car._id}/sold`);
      
      // Update local state
      const index = inventory.value.findIndex(c => c._id === car._id);
      if (index !== -1) {
        inventory.value[index].sold = true;
      }
    } catch (error) {
      console.error('Error marking as sold:', error);
      alert('Failed to mark as sold');
    }
  });
}

const deleteCar = (car) => {
  openConfirmation({
    title: 'Delete Car',
    message: 'Are you sure you want to remove this car? This action cannot be undone.',
    confirmText: 'Delete',
    type: 'danger'
  }, async () => {
    try {
      await apiDelete(`/api/v1/dealer/inventory/${car._id}`);
      
      // Update local state
      inventory.value = inventory.value.filter(c => c._id !== car._id);
    } catch (error) {
      console.error('Error deleting car:', error);
      alert('Failed to delete car');
    }
  });
}

onMounted(() => {
  fetchInventory();
});
</script>

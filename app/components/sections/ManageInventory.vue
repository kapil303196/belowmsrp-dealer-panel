<template>
  <div class="p-7 max-sm:p-5 max-sm:pt-0">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">Inventory Management</h2>
        <p class="text-sm text-gray-500 mt-1">Manage your listings and auto-replies</p>
      </div>
      <NuxtLink to="/manage-inventory/add"
        class="px-5 py-2.5 bg-secondary text-white rounded-xl font-medium flex items-center gap-2 hover:bg-secondary/90 transition-all shadow-lg shadow-secondary/20 active:scale-95">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
        </svg>
        <span>Add Car</span>
      </NuxtLink>
    </div>

    <!-- Loading State (Skeleton) -->
    <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="n in 6" :key="n" class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="h-48 bg-gray-200 animate-pulse"></div>
        <div class="p-5 space-y-4">
          <div class="flex justify-between items-start">
            <div class="space-y-2 flex-1">
              <div class="h-6 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              <div class="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
            </div>
            <div class="h-8 bg-gray-200 rounded w-20 animate-pulse"></div>
          </div>
          <div class="h-px bg-gray-100"></div>
          <div class="flex justify-between items-center">
            <div class="h-6 bg-gray-200 rounded w-24 animate-pulse"></div>
            <div class="flex gap-2">
              <div class="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
              <div class="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
              <div class="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!hasData"
      class="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-dashed border-gray-200">
      <div class="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
        <svg class="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
        </svg>
      </div>
      <h3 class="text-lg font-semibold text-gray-900 mb-1">No cars in inventory</h3>
      <p class="text-gray-500 mb-6 max-w-sm">Upload your first car to start showcasing your inventory and automatically responding to offers.</p>
      <NuxtLink to="/manage-inventory/add"
        class="px-6 py-2.5 bg-secondary text-white rounded-xl font-medium hover:bg-secondary/90 transition-all shadow-lg shadow-secondary/20">
        Upload First Car
      </NuxtLink>
    </div>

    <!-- Inventory List -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="car in inventory" :key="car.id"
        class="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col">
        
        <!-- Car Image Carousel -->
        <div class="h-52 relative overflow-hidden bg-gray-100">
          <UiCarImageCarousel 
            :images="car.images || []" 
            :alt="`${getMake(car)} ${getModel(car)}`"
            class="h-full w-full object-cover"
          />
          
          <!-- Status Badge -->
          <div class="absolute top-3 left-3 z-10">
             <span v-if="car.sold" class="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full shadow-sm">SOLD</span>
             <span v-else class="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full shadow-sm">AVAILABLE</span>
          </div>

          <!-- Auto-reply Badge -->
          <div class="absolute top-3 right-3 z-10">
            <div v-if="car.autoReply" class="flex items-center gap-1.5 px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-full shadow-sm border border-white/20">
              <span class="relative flex h-2 w-2">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span class="text-[10px] font-bold text-gray-700 uppercase tracking-wide">Auto-Reply</span>
            </div>
          </div>
        </div>

        <!-- Car Details -->
        <div class="p-5 flex-1 flex flex-col">
          <div class="flex justify-between items-start mb-3">
            <div>
              <h3 class="font-bold text-lg text-gray-900 leading-tight group-hover:text-secondary transition-colors">
                {{ getMake(car) }} {{ getModel(car) }}
              </h3>
              <p class="text-sm text-gray-500 mt-1 font-medium">{{ getYearAndTrim(car) }}</p>
            </div>
            <div class="text-right">
              <div class="font-bold text-secondary text-xl">${{ Number(car.offerPrice).toLocaleString() }}</div>
              <div class="text-xs text-gray-400 line-through font-medium">MSRP: ${{ Number(car.msrp).toLocaleString() }}</div>
            </div>
          </div>

          <div class="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between gap-3">
            <div class="flex items-center gap-2">
               <span class="text-xs font-medium px-2 py-1 rounded bg-gray-50 text-gray-600 border border-gray-100">
                 {{ car.images?.length || 0 }} Photos
               </span>
            </div>

            <div class="flex items-center gap-2">
              <button v-if="!car.sold" @click="markAsSold(car)"
                class="p-2 rounded-lg text-green-600 hover:bg-green-50 hover:text-green-700 transition-colors"
                title="Mark as Sold">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </button>
              
              <NuxtLink :to="`/manage-inventory/${car._id}`"
                class="p-2 rounded-lg text-blue-600 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                title="Edit Car">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
              </NuxtLink>
              
              <button @click="deleteCar(car)"
                class="p-2 rounded-lg text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                title="Delete Car">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useApi } from '~/composables/useApi';
import Swal from 'sweetalert2';

const { apiGet, apiPost, apiDelete } = useApi();

const inventory = ref([]);
const isLoading = ref(true);

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
    inventory.value = Array.isArray(response) ? response : (response.data || []);
  } catch (error) {
    console.error('Error fetching inventory:', error);
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Failed to load inventory. Please try again later.',
      confirmButtonColor: '#3B82F6'
    });
  } finally {
    isLoading.value = false;
  }
};

const markAsSold = (car) => {
  Swal.fire({
    title: 'Mark as Sold?',
    text: "This will stop auto-replies for this car.",
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#10B981',
    cancelButtonColor: '#6B7280',
    confirmButtonText: 'Yes, mark as sold'
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await apiPost(`/api/v1/dealer/inventory/${car._id}/sold`);
        
        // Update local state
        const index = inventory.value.findIndex(c => c._id === car._id);
        if (index !== -1) {
          inventory.value[index].sold = true;
        }
        
        Swal.fire({
          title: 'Sold!',
          text: 'Car has been marked as sold.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
      } catch (error) {
        console.error('Error marking as sold:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to mark as sold.',
          confirmButtonColor: '#3B82F6'
        });
      }
    }
  });
}

const deleteCar = (car) => {
  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#EF4444',
    cancelButtonColor: '#6B7280',
    confirmButtonText: 'Yes, delete it!'
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await apiDelete(`/api/v1/dealer/inventory/${car._id}`);
        
        // Update local state
        inventory.value = inventory.value.filter(c => c._id !== car._id);
        
        Swal.fire({
          title: 'Deleted!',
          text: 'Your file has been deleted.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
      } catch (error) {
        console.error('Error deleting car:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to delete car.',
          confirmButtonColor: '#3B82F6'
        });
      }
    }
  });
}

onMounted(() => {
  fetchInventory();
});
</script>

<template>
  <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
    <div class="p-6 md:p-8 border-b border-gray-100 bg-gray-50/50">
      <h3 class="text-lg font-bold text-gray-900">Vehicle Details</h3>
      <p class="text-sm text-gray-500 mt-1">Provide comprehensive information about the vehicle.</p>
    </div>
    
    <div class="p-6 md:p-8">
      <form @submit.prevent="handleSubmit" class="space-y-8">
        
        <!-- Vehicle Information -->
        <div class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Make -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-gray-700">Make <span class="text-red-500">*</span></label>
              <div 
                @click="openMakeModal"
                class="relative w-full h-12 px-4 rounded-xl border border-gray-200 bg-white flex items-center cursor-pointer hover:border-gray-300 transition-all"
                :class="{'ring-2 ring-secondary/20 border-secondary': isMakeModalOpen}"
              >
                <span v-if="selectedMakeLabel" class="text-gray-900 font-medium">{{ selectedMakeLabel }}</span>
                <span v-else class="text-gray-400">Select Make</span>
                <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
            </div>

            <!-- Model -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-gray-700">Model <span class="text-red-500">*</span></label>
              <div 
                @click="!form.make || isLoadingModels ? null : openModelModal()"
                class="relative w-full h-12 px-4 rounded-xl border border-gray-200 bg-white flex items-center transition-all"
                :class="{
                  'cursor-pointer hover:border-gray-300': form.make && !isLoadingModels,
                  'cursor-not-allowed bg-gray-50 opacity-70': !form.make || isLoadingModels,
                  'ring-2 ring-secondary/20 border-secondary': isModelModalOpen
                }"
              >
                <span v-if="isLoadingModels" class="text-gray-400">Loading models...</span>
                <span v-else-if="selectedModelLabel" class="text-gray-900 font-medium">{{ selectedModelLabel }}</span>
                <span v-else class="text-gray-400">Select Model</span>
                
                <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <svg v-if="isLoadingModels" class="animate-spin w-5 h-5" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                  <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
            </div>

            <!-- Year -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-gray-700">Year <span class="text-red-500">*</span></label>
              <input v-model="form.year" type="number" required min="1900" :max="new Date().getFullYear() + 2"
                placeholder="e.g. 2024"
                class="w-full h-12 px-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all hover:border-gray-300" />
            </div>

            <!-- Trim -->
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-gray-700">Trim</label>
              <input v-model="form.trim" type="text" placeholder="e.g. xDrive40i"
                class="w-full h-12 px-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all hover:border-gray-300" />
            </div>
          </div>
        </div>

        <hr class="border-gray-100" />

        <!-- Pricing Section -->
        <div class="space-y-6">
          <h4 class="text-base font-bold text-gray-900">Pricing & Strategy</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-gray-700">MSRP ($) <span class="text-red-500">*</span></label>
              <div class="relative">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
                <input v-model="form.msrp" type="number" required min="0" placeholder="0.00"
                  class="w-full h-12 pl-8 pr-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all hover:border-gray-300" />
              </div>
            </div>
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-gray-700">Your Offer Price ($) <span class="text-red-500">*</span></label>
              <div class="relative">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
                <input v-model="form.offerPrice" type="number" required min="0" placeholder="0.00"
                  class="w-full h-12 pl-8 pr-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all hover:border-gray-300" />
              </div>
            </div>
          </div>

          <!-- Auto-Reply Toggle -->
          <div class="p-5 bg-blue-50/50 rounded-xl border border-blue-100 flex items-center justify-between cursor-pointer hover:bg-blue-50 transition-colors" @click="form.autoReply = !form.autoReply">
            <div class="flex gap-4">
              <div class="mt-1">
                <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                  </svg>
                </div>
              </div>
              <div>
                <h4 class="font-bold text-gray-900">Auto-respond to offers</h4>
                <p class="text-sm text-gray-500 mt-0.5">Automatically send this offer to users requesting this specific car model.</p>
              </div>
            </div>
            <div class="relative inline-flex items-center cursor-pointer pointer-events-none">
              <input type="checkbox" v-model="form.autoReply" class="sr-only peer">
              <div
                class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-secondary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary">
              </div>
            </div>
          </div>
        </div>

        <hr class="border-gray-100" />

        <!-- Image Upload Section -->
        <div class="space-y-6">
          <div class="flex justify-between items-center">
            <h4 class="text-base font-bold text-gray-900">Vehicle Images</h4>
            <span class="text-xs font-medium px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full">{{ imagePreviews.length }}/10 Uploaded</span>
          </div>
          
          <div
            class="group relative border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:bg-gray-50 hover:border-secondary/50 transition-all cursor-pointer"
            :class="{'border-secondary/50 bg-secondary/5': isDragging}"
            @click="triggerFileInput" 
            @dragover.prevent="isDragging = true" 
            @dragleave.prevent="isDragging = false"
            @drop.prevent="handleDrop">
            
            <input ref="fileInput" type="file" multiple accept="image/*" class="hidden" @change="handleFileSelect" />
            
            <div class="flex flex-col items-center justify-center space-y-4">
              <div class="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg class="w-8 h-8 text-gray-400 group-hover:text-secondary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z">
                  </path>
                </svg>
              </div>
              <div>
                <p class="text-base font-semibold text-gray-900">Click to upload or drag and drop</p>
                <p class="text-sm text-gray-500 mt-1">SVG, PNG, JPG or GIF (max. 10 images)</p>
              </div>
            </div>
          </div>

          <!-- Image Previews -->
          <div v-if="imagePreviews.length > 0" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <div v-for="(preview, index) in imagePreviews" :key="index" class="relative aspect-[4/3] group rounded-xl overflow-hidden shadow-sm border border-gray-200">
              <img :src="preview.url" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
              <button type="button" @click="removeImage(index)"
                class="absolute top-2 right-2 w-7 h-7 bg-white text-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-md hover:bg-red-50 transform hover:scale-110">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
              <div v-if="index === 0" class="absolute bottom-2 left-2 px-2 py-1 bg-black/60 text-white text-[10px] font-bold rounded uppercase tracking-wider backdrop-blur-sm">
                Main Photo
              </div>
            </div>
          </div>
        </div>

        <hr class="border-gray-100" />

        <!-- Description -->
        <div class="space-y-2">
          <label class="block text-sm font-semibold text-gray-700">Description <span class="text-gray-400 font-normal">(Optional)</span></label>
          <textarea v-model="form.description" rows="4" placeholder="Add any additional details about the car features, condition, or warranty..."
            class="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary resize-none transition-all hover:border-gray-300"></textarea>
        </div>

        <!-- Actions -->
        <div class="flex items-center justify-end gap-4 pt-4">
          <button type="button" @click="$emit('cancel')"
            class="px-6 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-300 transition-all">
            Cancel
          </button>
          <button type="submit" :disabled="isSubmitting"
            class="px-8 py-3 rounded-xl bg-secondary text-white font-medium hover:bg-secondary/90 transition-all shadow-lg shadow-secondary/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2 active:scale-95">
            <svg v-if="isSubmitting" class="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none">
              </circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
            </svg>
            {{ isSubmitting ? 'Saving Vehicle...' : (editMode ? 'Save Changes' : 'Upload Vehicle') }}
          </button>
        </div>
      </form>
    </div>

    <!-- Modals -->
    <UiSearchableSelectModal
      :is-open="isMakeModalOpen"
      title="Select Make"
      :options="uniqueMakes"
      :model-value="form.make"
      @update:model-value="handleMakeSelect"
      @close="isMakeModalOpen = false"
    />

    <UiSearchableSelectModal
      :is-open="isModelModalOpen"
      title="Select Model"
      :options="uniqueModels"
      :model-value="form.model"
      @update:model-value="form.model = $event"
      @close="isModelModalOpen = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useApi } from '~/composables/useApi';
import Swal from 'sweetalert2';

const props = defineProps({
  editMode: {
    type: Boolean,
    default: false
  },
  initialData: {
    type: Object,
    default: null
  },
  isSubmitting: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['submit', 'cancel']);
const { apiGet } = useApi();

const fileInput = ref(null);
const isDragging = ref(false);
const form = ref({
  make: '', // This will be the ID
  model: '', // This will be the ID
  year: '',
  trim: '',
  msrp: '',
  offerPrice: '',
  autoReply: true,
  description: '',
  images: [] // Array of File objects
});

// Robust state management for images
const imagesState = ref([]); // { id: number, type: 'url' | 'file', content: string | File, preview: string }
let nextId = 1;

// Dynamic Data
const makes = ref([]);
const models = ref([]);
const isLoadingMakes = ref(false);
const isLoadingModels = ref(false);

// Modal State
const isMakeModalOpen = ref(false);
const isModelModalOpen = ref(false);

// Computed properties for deduplicated options
const uniqueMakes = computed(() => {
  const unique = new Map();
  makes.value.forEach(make => {
    if (!unique.has(make.name)) {
      unique.set(make.name, { label: make.name, value: make._id });
    }
  });
  return Array.from(unique.values()).sort((a, b) => a.label.localeCompare(b.label));
});

const uniqueModels = computed(() => {
  const unique = new Map();
  models.value.forEach(model => {
    if (!unique.has(model.name)) {
      unique.set(model.name, { label: model.name, value: model._id });
    }
  });
  return Array.from(unique.values()).sort((a, b) => a.label.localeCompare(b.label));
});

// Labels for selected values
const selectedMakeLabel = computed(() => {
  const make = makes.value.find(m => m._id === form.value.make);
  return make ? make.name : '';
});

const selectedModelLabel = computed(() => {
  const model = models.value.find(m => m._id === form.value.model);
  return model ? model.name : '';
});

// Computed property for template
const imagePreviews = computed(() => imagesState.value.map(i => ({
  url: i.preview,
  isFile: i.type === 'file',
  id: i.id
})));

const fetchMakes = async () => {
  isLoadingMakes.value = true;
  try {
    const response = await apiGet('/api/v1/car-makers');
    makes.value = Array.isArray(response) ? response : (response.data || []);
  } catch (error) {
    console.error('Error fetching makes:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to load car makes.',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000
    });
  } finally {
    isLoadingMakes.value = false;
  }
};

const fetchModels = async (makeId) => {
  if (!makeId) {
    models.value = [];
    return;
  }
  isLoadingModels.value = true;
  try {
    const response = await apiGet(`/api/v1/car-makers/${makeId}/models`);
    models.value = Array.isArray(response) ? response : (response.data || []);
  } catch (error) {
    console.error('Error fetching models:', error);
    models.value = [];
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to load car models.',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000
    });
  } finally {
    isLoadingModels.value = false;
  }
};

// Track if we're initializing in edit mode
const isInitializing = ref(false);

const openMakeModal = () => {
  isMakeModalOpen.value = true;
};

const openModelModal = () => {
  isModelModalOpen.value = true;
};

const handleMakeSelect = (newMakeId) => {
  form.value.make = newMakeId;
  // Reset model when make changes (handled by watcher, but good to be explicit)
  // Watcher will handle fetching models
};

// Watch for make changes to fetch models
watch(() => form.value.make, (newMakeId, oldMakeId) => {
  // Don't reset model if we're initializing in edit mode
  if (!isInitializing.value) {
    form.value.model = ''; // Reset model
  }
  
  if (newMakeId) {
    fetchModels(newMakeId);
  } else {
    models.value = [];
  }
});

const triggerFileInput = () => {
  fileInput.value.click();
};

const addFiles = (files) => {
  const remainingSlots = 10 - imagesState.value.length;
  if (remainingSlots <= 0) {
    Swal.fire({
      icon: 'warning',
      title: 'Limit Reached',
      text: 'You can only upload up to 10 images.',
      confirmButtonColor: '#3B82F6'
    });
    return;
  }
  
  if (files.length > remainingSlots) {
    Swal.fire({
      icon: 'info',
      title: 'Too many files',
      text: `Only the first ${remainingSlots} images were added.`,
      confirmButtonColor: '#3B82F6'
    });
  }

  const filesToAdd = files.slice(0, remainingSlots);
  filesToAdd.forEach(file => {
    imagesState.value.push({
      id: nextId++,
      type: 'file',
      content: file,
      preview: URL.createObjectURL(file)
    });
  });
};

const handleFileSelect = (event) => {
  const files = Array.from(event.target.files);
  addFiles(files);
  event.target.value = '';
}

const handleDrop = (event) => {
  isDragging.value = false;
  const files = Array.from(event.dataTransfer.files).filter(file => file.type.startsWith('image/'));
  addFiles(files);
}

const removeImage = (index) => {
  const item = imagesState.value[index];
  if (item.type === 'file') {
    URL.revokeObjectURL(item.preview);
  }
  imagesState.value.splice(index, 1);
}

// Sync state to form on submit
const handleSubmit = () => {
  // Separate existing URLs and new Files
  const existingImages = imagesState.value.filter(i => i.type === 'url').map(i => i.content);
  const newFiles = imagesState.value.filter(i => i.type === 'file').map(i => i.content);

  emit('submit', {
    ...form.value,
    existingImages,
    newImages: newFiles
  });
};

onMounted(async () => {
  await fetchMakes();

  if (props.editMode && props.initialData) {
    // Set flag to prevent watcher from clearing model
    isInitializing.value = true;
    
    // Populate form
    form.value = {
      ...props.initialData,
      make: props.initialData.make?._id || props.initialData.make, // Handle populated object or ID
      model: props.initialData.model?._id || props.initialData.model
    };

    // Fetch models for the selected make
    if (form.value.make) {
      await fetchModels(form.value.make);
      // Clear initialization flag after models are loaded
      isInitializing.value = false;
    }

    // Populate imagesState with existing images
    if (props.initialData.images && Array.isArray(props.initialData.images)) {
      props.initialData.images.forEach(url => {
        imagesState.value.push({
          id: nextId++,
          type: 'url',
          content: url,
          preview: url
        });
      });
    }
  }
});
</script>

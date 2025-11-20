<template>
  <div class="bg-white rounded-xl shadow-sm border border-[#E8EEF9] p-6 md:p-8">
    <form @submit.prevent="handleSubmit">

      <!-- Car Details Section -->
      <div class="mb-8">
        <h3 class="text-lg font-semibold text-primary mb-4">Vehicle Information</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Make -->
          <div>
            <label class="block text-sm font-medium text-primary mb-1.5">Make *</label>
            <div class="relative">
              <select v-model="form.make" required
                class="w-full h-12 px-3 rounded-lg border border-[#DBE4F2] bg-white focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary appearance-none">
                <option value="" disabled>Select Make</option>
                <option v-for="make in makes" :key="make._id" :value="make._id">{{ make.name }}</option>
              </select>
              <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </div>

          <!-- Model -->
          <div>
            <label class="block text-sm font-medium text-primary mb-1.5">Model *</label>
            <div class="relative">
              <select v-model="form.model" :disabled="!form.make || isLoadingModels" required
                class="w-full h-12 px-3 rounded-lg border border-[#DBE4F2] bg-white focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary appearance-none disabled:bg-gray-50 disabled:text-gray-400">
                <option value="" disabled>{{ isLoadingModels ? 'Loading...' : 'Select Model' }}</option>
                <option v-for="model in models" :key="model._id" :value="model._id">{{ model.name }}</option>
              </select>
              <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </div>

          <!-- Year -->
          <div>
            <label class="block text-sm font-medium text-primary mb-1.5">Year *</label>
            <input v-model="form.year" type="number" required min="1900" :max="new Date().getFullYear() + 2"
              placeholder="e.g. 2024"
              class="w-full h-12 px-3 rounded-lg border border-[#DBE4F2] focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary" />
          </div>

          <!-- Trim -->
          <div>
            <label class="block text-sm font-medium text-primary mb-1.5">Trim</label>
            <input v-model="form.trim" type="text" placeholder="e.g. xDrive40i"
              class="w-full h-12 px-3 rounded-lg border border-[#DBE4F2] focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary" />
          </div>
        </div>
      </div>

      <!-- Pricing Section -->
      <div class="mb-8">
        <h3 class="text-lg font-semibold text-primary mb-4">Pricing & Offer</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-primary mb-1.5">MSRP ($) *</label>
            <div class="relative">
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input v-model="form.msrp" type="number" required min="0" placeholder="0.00"
                class="w-full h-12 pl-7 pr-3 rounded-lg border border-[#DBE4F2] focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary" />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-primary mb-1.5">Your Offer Price ($) *</label>
            <div class="relative">
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input v-model="form.offerPrice" type="number" required min="0" placeholder="0.00"
                class="w-full h-12 pl-7 pr-3 rounded-lg border border-[#DBE4F2] focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary" />
            </div>
          </div>
        </div>
      </div>

      <!-- Auto-Reply Section -->
      <div class="mb-8 p-4 bg-[#F7FAFF] rounded-xl border border-[#E8EEF9]">
        <div class="flex items-center justify-between">
          <div>
            <h4 class="font-medium text-primary">Auto-respond to offers</h4>
            <p class="text-sm text-primary/60 mt-1">Automatically send this offer to users requesting this specific car
              model.</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" v-model="form.autoReply" class="sr-only peer">
            <div
              class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-secondary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary">
            </div>
          </label>
        </div>
      </div>

      <!-- Image Upload Section -->
      <div class="mb-8">
        <h3 class="text-lg font-semibold text-primary mb-4">Vehicle Images</h3>
        <div
          class="border-2 border-dashed border-[#DBE4F2] rounded-xl p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer"
          @click="triggerFileInput" @dragover.prevent @drop.prevent="handleDrop">
          <input ref="fileInput" type="file" multiple accept="image/*" class="hidden" @change="handleFileSelect" />
          <div class="flex flex-col items-center justify-center">
            <div class="w-12 h-12 rounded-full bg-[#E8EFFA] flex items-center justify-center mb-3">
              <svg class="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z">
                </path>
              </svg>
            </div>
            <p class="text-sm font-medium text-primary">Click to upload or drag and drop</p>
            <p class="text-xs text-primary/50 mt-1">SVG, PNG, JPG or GIF (max. 10 images)</p>
          </div>
        </div>

        <!-- Image Previews -->
        <div v-if="imagePreviews.length > 0" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
          <div v-for="(preview, index) in imagePreviews" :key="index" class="relative aspect-[4/3] group">
            <img :src="preview.url" class="w-full h-full object-cover rounded-lg border border-[#E8EEF9]" />
            <button type="button" @click="removeImage(index)"
              class="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Description -->
      <div class="mb-8">
        <label class="block text-sm font-medium text-primary mb-1.5">Description (Optional)</label>
        <textarea v-model="form.description" rows="4" placeholder="Add any additional details about the car..."
          class="w-full p-3 rounded-lg border border-[#DBE4F2] focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary resize-none"></textarea>
      </div>

      <!-- Actions -->
      <div class="flex items-center justify-end gap-4 pt-6 border-t border-[#E8EEF9]">
        <button type="button" @click="$emit('cancel')"
          class="px-6 py-2.5 rounded-lg border border-[#DBE4F2] text-primary font-medium hover:bg-gray-50 transition-colors">
          Cancel
        </button>
        <button type="submit" :disabled="isSubmitting"
          class="px-8 py-2.5 rounded-lg bg-secondary text-white font-medium hover:bg-secondary/90 transition-colors shadow-lg shadow-secondary/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center">
          <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none">
            </circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
          </svg>
          {{ isSubmitting ? 'Saving...' : (editMode ? 'Save Changes' : 'Upload Car') }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useApi } from '~/composables/useApi';

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
    console.log('Fetched makes:', response);
    // Assuming response is array or response.data is array depending on backend format
    // carMakerController returns res.status(200).json(response) where response is the array from service
    makes.value = Array.isArray(response) ? response : (response.data || []);
    console.log('Makes value:', makes.value);
    if (makes.value.length > 0) {
      console.log('First make object:', makes.value[0]);
      console.log('First make keys:', Object.keys(makes.value[0]));
    }
  } catch (error) {
    console.error('Error fetching makes:', error);
  } finally {
    isLoadingMakes.value = false;
  }
};

const fetchModels = async (makeId) => {
  console.log('Fetching models for make:', makeId);
  if (!makeId) {
    models.value = [];
    return;
  }
  isLoadingModels.value = true;
  try {
    // Endpoint: /api/v1/car-makers/:id/models
    const response = await apiGet(`/api/v1/car-makers/${makeId}/models`);
    console.log('Fetched models:', response);
    // Controller returns array directly or inside json depending on implementation
    // carMakerController.getModelsByMaker returns the array from service
    // route returns res.status(200).json(response)
    models.value = Array.isArray(response) ? response : (response.data || []);
  } catch (error) {
    console.error('Error fetching models:', error);
    models.value = [];
  } finally {
    isLoadingModels.value = false;
  }
};

// Watch for make changes to fetch models
watch(() => form.value.make, (newMakeId) => {
  console.log('Make changed to:', newMakeId);
  form.value.model = ''; // Reset model
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
    alert('You can only upload up to 10 images.');
    return;
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
    // Populate form
    form.value = {
      ...props.initialData,
      make: props.initialData.make?._id || props.initialData.make, // Handle populated object or ID
      model: props.initialData.model?._id || props.initialData.model
    };

    // Fetch models for the selected make
    if (form.value.make) {
      await fetchModels(form.value.make);
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

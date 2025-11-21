<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true">
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity" @click="close"></div>

        <!-- Modal Panel -->
        <div class="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl flex flex-col max-h-[80vh] overflow-hidden transform transition-all">
          
          <!-- Header -->
          <div class="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <h3 class="text-lg font-bold text-gray-900">{{ title }}</h3>
            <button @click="close" class="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <!-- Search -->
          <div class="p-4 border-b border-gray-100">
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
              <input
                ref="searchInput"
                v-model="searchQuery"
                type="text"
                class="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all"
                :placeholder="`Search ${title.toLowerCase()}...`"
              />
            </div>
          </div>

          <!-- List -->
          <div class="overflow-y-auto p-2 space-y-1">
            <div v-if="filteredOptions.length === 0" class="py-8 text-center text-gray-500">
              <p>No results found for "{{ searchQuery }}"</p>
            </div>
            
            <button
              v-for="option in filteredOptions"
              :key="option.value"
              @click="select(option)"
              class="w-full text-left px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-between group"
              :class="{'bg-secondary/5 text-secondary': modelValue === option.value}"
            >
              <span class="font-medium" :class="{'text-secondary': modelValue === option.value, 'text-gray-700': modelValue !== option.value}">
                {{ option.label }}
              </span>
              <svg v-if="modelValue === option.value" class="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    default: 'Select Option'
  },
  options: {
    type: Array,
    default: () => [] // { label: string, value: any }
  },
  modelValue: {
    type: [String, Number, Object],
    default: null
  }
});

const emit = defineEmits(['update:modelValue', 'close']);

const searchQuery = ref('');
const searchInput = ref(null);

const filteredOptions = computed(() => {
  if (!searchQuery.value) return props.options;
  const query = searchQuery.value.toLowerCase();
  return props.options.filter(option => 
    option.label.toLowerCase().includes(query)
  );
});

const select = (option) => {
  emit('update:modelValue', option.value);
  close();
};

const close = () => {
  emit('close');
  // Reset search after transition
  setTimeout(() => {
    searchQuery.value = '';
  }, 200);
};

// Focus input when modal opens
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    nextTick(() => {
      if (searchInput.value) {
        searchInput.value.focus();
      }
    });
  }
});
</script>

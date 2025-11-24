<template>
  <div class="relative h-full group bg-gray-100">
    <!-- Image Display -->
    <img 
      :key="currentIndex"
      :src="currentImage" 
      :alt="alt" 
      class="w-full h-full object-cover transition-opacity duration-300"
    />
    
    <!-- Navigation Buttons (show on hover if multiple images) -->
    <template v-if="images.length > 1">
      <button 
        type="button"
        @click.stop="previousImage"
        class="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
        aria-label="Previous image"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
        </svg>
      </button>
      
      <button 
        type="button"
        @click.stop="nextImage"
        class="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
        aria-label="Next image"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
      </button>
      
      <!-- Dot Indicators -->
      <div class="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
        <button 
          v-for="(_, idx) in images" 
          :key="idx"
          type="button"
          @click.stop="currentIndex = idx"
          :class="[
            'h-1.5 rounded-full transition-all',
            idx === currentIndex ? 'bg-white w-4' : 'bg-white/60 w-1.5 hover:bg-white/80'
          ]"
          :aria-label="`Go to image ${idx + 1}`"
        ></button>
      </div>
    </template>
    
    <!-- Image Counter (top right) -->
    <div 
      v-if="images.length > 1" 
      class="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur-sm"
    >
      {{ currentIndex + 1 }}/{{ images.length }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  images: {
    type: Array,
    default: () => []
  },
  alt: {
    type: String,
    default: 'Car image'
  }
});

const currentIndex = ref(0);

const currentImage = computed(() => {
  if (props.images.length === 0) {
    return 'https://placehold.co/600x400?text=No+Image';
  }
  return props.images[currentIndex.value];
});

const previousImage = () => {
  console.log('Previous clicked, current index:', currentIndex.value);
  if (currentIndex.value > 0) {
    currentIndex.value--;
  } else {
    currentIndex.value = props.images.length - 1;
  }
  console.log('New index:', currentIndex.value);
};

const nextImage = () => {
  console.log('Next clicked, current index:', currentIndex.value);
  if (currentIndex.value < props.images.length - 1) {
    currentIndex.value++;
  } else {
    currentIndex.value = 0;
  }
  console.log('New index:', currentIndex.value);
};
</script>

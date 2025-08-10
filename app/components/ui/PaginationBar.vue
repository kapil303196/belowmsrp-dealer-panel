<template>
  <div v-if="totalPages > 1" class="flex items-center justify-center gap-3 mt-4">
    <div class="flex items-center gap-5">
      <button :disabled="currentPage === 1" @click="$emit('goToPage', currentPage - 1)">
        <img src="~/assets/images/icons/prev-icon.svg" alt="">
      </button>
      <button v-for="page in totalPages" :key="page"
        class="px-2 py-1 w-8 h-8 rounded-full border text-[15px] font-semibold"
        :class="{ 'bg-[#2C73DB] text-white': page === currentPage }"
        @click="$emit('goToPage', page)">
        {{ page }}
      </button>
      <button :disabled="currentPage === totalPages" @click="$emit('goToPage', currentPage + 1)">
        <img src="~/assets/images/icons/next-icon.svg" alt="">
      </button>
    </div>
    <button class="bg-[#E8EFFA] text-xs px-3 py-[9px] rounded-full flex items-center gap-2">
      {{ totalEntries }} entries
      <img src="~/assets/images/icons/angle-down-black.svg" alt="">
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  currentPage: { type: Number, required: true },
  totalPages: { type: Number, required: true },
  totalEntries: { type: Number, required: true }
})
const emit = defineEmits(['goToPage'])
</script>

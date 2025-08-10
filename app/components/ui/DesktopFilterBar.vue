<template>
  <div class="max-md:hidden flex items-center justify-between mb-10" ref="filterBarRef">
    <div class="flex items-center gap-[10px]">
      <h4 class="text-primary font-medium text-nowrap">{{ title }}</h4>
      <div class="relative">
        <input type="search" class="bg-transparent p-3 pl-10 outline-none w-[340px] max-lg:w-[220px]"
          placeholder="Search by name, model, or amount...">
        <img class="absolute left-2 top-1/2 -translate-y-1/2"
          src="../../assets/images/icons/search-icon.svg" alt="icon">
      </div>
    </div>
    <div class="bg-[#E8EFFA] rounded-full py-4 px-5 flex items-center justify-between">
      <span class="pr-4 border-r">Sort By</span>
      <div class="relative">
        <button @click="toggleDropdown('status')"
          class="flex items-center gap-[98px] px-4 border-r max-lg:gap-3">
          <span>Status</span>
          <img src="../../assets/images/icons/angle-down-black.svg" alt="icon">
        </button>
        <div v-if="dropdownOpen === 'status'"
          class="absolute right-0 mt-2 w-40 bg-[#F7FAFF] border rounded-lg shadow-lg z-10">
          <ul>
            <li class="px-4 py-2 hover:bg-gray-100 cursor-pointer"><a href="/accepted">Accepted</a></li>
            <li class="px-4 py-2 hover:bg-gray-100 cursor-pointer"><a href="/rejected">Rejected</a></li>
            <li class="px-4 py-2 hover:bg-gray-100 cursor-pointer"><a href="/countered">Countered</a></li>
          </ul>
        </div>
      </div>
      <div class="relative">
        <button @click="toggleDropdown('model')"
          class="flex items-center gap-[98px] px-4 border-r max-lg:gap-3">
          <span>Model</span>
          <img src="../../assets/images/icons/angle-down-black.svg" alt="icon">
        </button>
        <div v-if="dropdownOpen === 'model'"
          class="absolute right-0 mt-2 w-40 bg-[#F7FAFF] border rounded-lg shadow-lg z-10">
          <ul>
            <li class="px-4 py-2 hover:bg-gray-100 cursor-pointer">Porsche</li>
            <li class="px-4 py-2 hover:bg-gray-100 cursor-pointer">Mercedes</li>
            <li class="px-4 py-2 hover:bg-gray-100 cursor-pointer">BMW</li>
          </ul>
        </div>
      </div>
      <div class="relative">
        <button @click="toggleDropdown('week')"
          class="flex items-center gap-[98px] px-4 border-r max-lg:gap-3">
          <span>This week</span>
          <img src="../../assets/images/icons/angle-down-black.svg" alt="icon">
        </button>
        <div v-if="dropdownOpen === 'week'"
          class="absolute right-0 mt-2 w-40 bg-[#F7FAFF] border rounded-lg shadow-lg z-10">
          <ul>
            <li class="px-4 py-2 hover:bg-gray-100 cursor-pointer">This week</li>
            <li class="px-4 py-2 hover:bg-gray-100 cursor-pointer">Last week</li>
            <li class="px-4 py-2 hover:bg-gray-100 cursor-pointer">This month</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, ref, onMounted, onBeforeUnmount } from 'vue'
const props = defineProps({
  title: { type: String, required: true }
})

const dropdownOpen = ref(null)
const filterBarRef = ref(null)
function toggleDropdown(type) {
  dropdownOpen.value = dropdownOpen.value === type ? null : type
}

let clickHandler = null
onMounted(() => {
  clickHandler = (e) => {
    if (dropdownOpen.value && filterBarRef.value && !filterBarRef.value.contains(e.target)) {
      dropdownOpen.value = null;
    }
  }
  window.addEventListener('click', clickHandler)
})
onBeforeUnmount(() => {
  window.removeEventListener('click', clickHandler)
})
</script>

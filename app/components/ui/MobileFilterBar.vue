<template>
    <div class="md:hidden flex flex-col gap-3 mb-4" ref="filterBarRef">
        <div class="flex items-center justify-between gap-2">
            <h4 class="text-primary font-medium">{{ title }}</h4>
            <div class="relative">
                <button @click="toggleDropdown('sortby')"
                    class="bg-[#E8EFFA] rounded-full py-2 px-5 flex items-center gap-2">
                    <span>Sort By</span>
                    <img src="../../assets/images/icons/angle-down-black.svg" alt="icon">
                </button>
                <div v-if="dropdownOpen === 'sortby'"
                    class="absolute right-0 mt-2 w-48 bg-[#F7FAFF] border rounded-lg shadow-lg z-20">
                    <ul>
                        <li class="px-4 py-2 font-bold text-primary">Status</li>
                        <li class="px-4 py-2 hover:bg-gray-100 text-primary-medium cursor-pointer"><a href="/accepted">Accepted</a></li>
                        <li class="px-4 py-2 hover:bg-gray-100 text-primary-medium cursor-pointer"><a href="/rejected">Rejected</a></li>
                        <li class="px-4 py-2 hover:bg-gray-100 text-primary-medium cursor-pointer"><a href="/countered">Countered</a></li>
                        <li>
                            <hr class="my-1 border-t">
                        </li>
                        <li class="px-4 py-2 font-bold text-primary">Model</li>
                        <li class="px-4 py-2 hover:bg-gray-100 text-primary-medium cursor-pointer">Porsche</li>
                        <li class="px-4 py-2 hover:bg-gray-100 text-primary-medium cursor-pointer">Mercedes</li>
                        <li class="px-4 py-2 hover:bg-gray-100 text-primary-medium cursor-pointer">BMW</li>
                        <li>
                            <hr class="my-1 border-t">
                        </li>
                        <li class="px-4 py-2 font-bold text-primary">Date</li>
                        <li class="px-4 py-2 hover:bg-gray-100 text-primary-medium cursor-pointer">This week</li>
                        <li class="px-4 py-2 hover:bg-gray-100 text-primary-medium cursor-pointer">Last week</li>
                        <li class="px-4 py-2 hover:bg-gray-100 text-primary-medium cursor-pointer">This month</li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="relative mt-1">
            <input v-model="searchProxy" type="search" class="bg-[#E8EEF9] p-3 pl-10 outline-none w-full rounded-full border"
                placeholder="Search by name, model, or amount...">
            <img class="absolute left-4 top-1/2 -translate-y-1/2" src="../../assets/images/icons/search-icon.svg"
                alt="icon">
        </div>
    </div>

</template>


<script setup>
import { defineProps, defineEmits, ref, onMounted, onBeforeUnmount, computed } from 'vue'
const props = defineProps({
    title: { type: String, required: true },
    search: { type: String, default: '' },
    model: { type: String, default: '' }
})
const emit = defineEmits(['update:search', 'update:model'])
const searchProxy = computed({
    get: () => props.search,
    set: (val) => emit('update:search', val)
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

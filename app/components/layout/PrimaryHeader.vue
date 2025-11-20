<template>
    <nav
        class="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#EFF3FA] rounded-t-[20px] border-t-2 border-[#DBE4F2] shadow-[0_-8px_24px_0_rgba(0,0,0,0.06)]">
        <ul class="flex justify-around items-center px-5 py-[14px]">
            <li v-for="item in navLinksMobile" :key="item.label" class="relative">
                <template v-if="item.to === '#'">
                    <button
                        class="flex flex-col items-center justify-center px-2 pt-1 pb-0.5 transition-colors duration-150 focus:outline-none"
                        :class="activeMobileDropdown === item.label ? 'text-secondary' : 'text-[#6B7397]'"
                        @click="handleMobileIconClick(item.label)">
                        <img :src="item.icon" alt="icon" class="w-6 h-6 mb-0.5"
                            :class="activeMobileDropdown === item.label ? 'filter-primary' : 'filter-inactive'" />
                        <span class="mt-[10px] font-semibold text-[13px]">{{ item.label }}</span>
                    </button>
                    <!-- Dropdowns/Overlays -->
                    <div v-if="activeMobileDropdown === 'Search' && item.label === 'Search'"
                        class="absolute bottom-14 left-1/2 -translate-x-1/2 bg-white shadow-lg rounded-lg p-4 w-72 z-20">
                        <input type="text" placeholder="Search..."
                            class="w-full border rounded px-3 py-2 focus:outline-none" />
                    </div>
                    <div v-if="activeMobileDropdown === 'Types' && item.label === 'Types'"
                        class="absolute bottom-14 -right-10 bg-white shadow-lg rounded-lg p-4 w-60 z-20">
                        <div class="font-semibold mb-2">Types</div>
                        <div class="text-gray-500 text-sm">No types available.</div>
                    </div>
                    <div v-if="activeMobileDropdown === 'Chat' && item.label === 'Chat'"
                        class="absolute bottom-14 right-0 bg-white shadow-lg rounded-lg p-4 w-72 z-20">
                        <div class="font-semibold mb-2">Chat</div>
                        <div class="text-gray-500 text-sm">No new messages.</div>
                    </div>
                </template>
                <template v-else>
                    <NuxtLink :to="item.to"
                        class="flex flex-col items-center justify-center px-2 pt-1 pb-0.5 transition-colors duration-150 "
                        :class="$route.path === item.to ? 'text-secondary' : 'text-[#6B7397] '">
                        <img :src="item.icon" alt="icon" class="w-6 h-6 mb-0.5"
                            :class="$route.path === item.to ? 'filter-primary' : 'filter-inactive'" />
                        <span class=" mt-[10px] font-semibold text-[13px] ">{{ item.label }}</span>
                    </NuxtLink>
                </template>
            </li>
        </ul>
    </nav>
</template>

<script setup>
import { useRoute } from 'vue-router'
import dashboardIcon from '~/assets/images/icons/dashboard-icon-primary.svg';
import allOffersIcon from '~/assets/images/icons/all-offers-icon.svg';
import searchIcon from '~/assets/images/icons/search-icon-primary.svg';
import typeIcon from '~/assets/images/icons/type-icon-primary.svg';
import chatIcon from '~/assets/images/icons/chat-icon-primary.svg';
import vehicleIcon from '~/assets/images/icons/vehicle-logo.svg';

const $route = useRoute()

// Mobile bottom navigation links (separate icons and names)
const navLinksMobile = [
    {
        to: '/',
        label: 'Dashboard',
        icon: dashboardIcon
    },
    {
        to: '/offers',
        label: 'All Offers',
        icon: allOffersIcon
    },
    {
        to: '#',
        label: 'Search',
        icon: searchIcon
    },
    {
        to: '/manage-inventory',
        label: 'Inventory',
        icon: vehicleIcon
    },
    {
        to: '#',
        label: 'Chat',
        icon: chatIcon
    },
]
import { ref, onMounted, onBeforeUnmount } from 'vue';


const activeMobileDropdown = ref(null);

function handleMobileIconClick(label) {
    activeMobileDropdown.value = activeMobileDropdown.value === label ? null : label;
}

function handleMobileOutsideClick(e) {
    const nav = document.querySelector('.md\\:hidden nav');
    if (activeMobileDropdown.value && nav && !(nav.contains(e.target))) {
        activeMobileDropdown.value = null;
    }
}

onMounted(() => {
    window.addEventListener('click', handleMobileOutsideClick);
});
onBeforeUnmount(() => {
    window.removeEventListener('click', handleMobileOutsideClick);
});
</script>


<style scoped>
.filter-primary {
    filter: brightness(0) saturate(100%) invert(32%) sepia(99%) saturate(749%) hue-rotate(181deg) brightness(97%) contrast(101%);
}

.filter-inactive {
    filter: grayscale(1) brightness(0.7);
}
</style>
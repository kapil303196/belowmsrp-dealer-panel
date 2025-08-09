<template>
    <nav class="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#EFF3FA] rounded-t-[20px] border-t-2 border-[#DBE4F2] shadow-[0_-8px_24px_0_rgba(0,0,0,0.06)]">
        <ul class="flex justify-around items-center px-5 py-[14px]">
            <li v-for="item in navLinksMobile" :key="item.to">
                <NuxtLink :to="item.to"
                    class="flex flex-col items-center justify-center px-2 pt-1 pb-0.5 transition-colors duration-150 "
                    :class="$route.path === item.to ? 'text-secondary' : 'text-[#6B7397] '">
                    <template v-if="item.icon">
                        <img :src="item.icon" alt="icon" class="w-6 h-6 mb-0.5"
                            :class="$route.path === item.to ? 'filter-primary' : 'filter-inactive'" />
                    </template>
                    <span class=" mt-[10px] font-semibold text-[13px] ">{{ item.label }}</span>
                </NuxtLink>
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
        to: '#',
        label: 'Types',
        icon: typeIcon
    },
    {
        to: '#',
        label: 'Chat',
        icon: chatIcon
    },
]
</script>


<style scoped>
.filter-primary {
    filter: brightness(0) saturate(100%) invert(32%) sepia(99%) saturate(749%) hue-rotate(181deg) brightness(97%) contrast(101%);
}

.filter-inactive {
    filter: grayscale(1) brightness(0.7);
}
</style>
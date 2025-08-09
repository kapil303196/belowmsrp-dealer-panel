<template>
    <header class="w-full py-8 px-[30px] flex items-center justify-between max-sm:p-5">
        <!-- Left: Logo -->
        <div class="flex items-center flex-shrink-0">
            <a href="/">
                <img :src="mainLogo" alt="Logo" />
            </a>
        </div>
        <!-- Center: Navigation -->
        <nav class="flex-1 flex justify-center max-md:hidden">
            <ul class="flex items-center space-x-[10px] text-on-light font-medium text-[13px] max-lg:space-y-0">
                <li v-for="item in navLinks" :key="item.to">
                    <NuxtLink :to="item.to" class="py-2 px-[15px] flex items-center gap-2 max-lg:px-2 max-lg:gap-1"
                        :class="route.path === item.to ? 'bg-primary text-white rounded-[41px]' : ''">
                        <template v-if="item.icon">
                            <img :src="item.icon" alt="icon" class="w-4 h-4" />
                        </template>
                        {{ item.label }}
                    </NuxtLink>
                </li>
            </ul>
        </nav>
        <!-- Right: Icons -->
        <div class="flex items-center space-x-3">
            <button v-for="(item, i) in rightIcons" :key="i" :class="[
                'w-[46px] h-[46px] rounded-full flex items-center justify-center',
                item.bg,
                (item.alt === 'search' || item.alt === 'chat') ? 'max-md:hidden' : ''
            ]">
                <img :src="item.icon" :alt="item.alt" />
            </button>
        </div>
    </header>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import dashboardIcon from '~/assets/images/icons/dashboard-icon.svg';
import offerIcon from '~/assets/images/icons/offers-icon-header.svg';
import acceptedIcon from '~/assets/images/icons/accepted-icon-header.svg';
import rejectedIcon from '~/assets/images/icons/reject-icon-header.svg';
import counteredIcon from '~/assets/images/icons/countered-icon-header.svg';
import searchIcon from '~/assets/images/icons/search.svg';
import chatIcon from '~/assets/images/icons/chat-icon.svg';
import notificationIcon from '~/assets/images/icons/notification-icon.svg';
import profileIcon from '~/assets/images/icons/red-sport-car-logo.svg';
import mainLogo from '~/assets/images/icons/main-logo.svg';

const route = useRoute();

const navLinks = [
    { to: '/', label: 'Dashboard', icon: dashboardIcon },
    { to: '/offers', label: 'All Offers', icon: offerIcon },
    { to: '/accepted', label: 'Accepted', icon: acceptedIcon },
    { to: '/rejected', label: 'Rejected', icon: rejectedIcon },
    { to: '/countered', label: 'Countered', icon: counteredIcon },
];

const rightIcons = [
    { icon: searchIcon, alt: 'search', bg: 'bg-[#E8EFFA]' },
    { icon: chatIcon, alt: 'chat', bg: 'bg-[#E8EFFA]' },
    { icon: notificationIcon, alt: 'notification', bg: 'bg-[#E8EFFA]' },
    { icon: profileIcon, alt: 'profile', bg: 'bg-white' },
];
</script>

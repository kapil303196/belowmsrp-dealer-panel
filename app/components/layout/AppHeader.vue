<template>
    <header class="w-full py-8 px-[30px] flex items-center justify-between">
        <!-- Left: Logo -->
        <div class="flex items-center flex-shrink-0">
            <a href="/">
                <img :src="mainLogo" alt="Logo" />
            </a>
        </div>
        <!-- Center: Navigation -->
        <nav class="flex-1 flex justify-center">
            <ul class="flex items-center space-x-[14px] text-on-light font-medium text-[13px]">
                <li v-for="item in navLinks" :key="item.to">
                    <NuxtLink :to="item.to" class="py-2 px-[15px] flex items-center gap-2"
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
            <button v-for="(item, i) in rightIcons" :key="i"
                class="w-[46px] h-[46px] rounded-full flex items-center justify-center"
                :class="item.bg">
                <img :src="item.icon" :alt="item.alt" />
            </button>
        </div>
    </header>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import dashboardIcon from '~/assets/images/icons/dashboard-icon.svg';
import searchIcon from '~/assets/images/icons/search.svg';
import chatIcon from '~/assets/images/icons/chat-icon.svg';
import notificationIcon from '~/assets/images/icons/notification-icon.svg';
import profileIcon from '~/assets/images/icons/red-sport-car-logo.svg';
import mainLogo from '~/assets/images/icons/main-logo.svg';

const route = useRoute();

const navLinks = [
  { to: '/', label: 'Dashboard', icon: dashboardIcon },
  { to: '/offers', label: 'All Offers' },
  { to: '/accepted', label: 'Accepted' },
  { to: '/rejected', label: 'Rejected' },
  { to: '/countered', label: 'Countered' },
];

const rightIcons = [
  { icon: searchIcon, alt: 'search', bg: 'bg-[#E8EFFA]' },
  { icon: chatIcon, alt: 'chat', bg: 'bg-[#E8EFFA]' },
  { icon: notificationIcon, alt: 'notification', bg: 'bg-[#E8EFFA]' },
  { icon: profileIcon, alt: 'profile', bg: 'bg-white' },
];
</script>

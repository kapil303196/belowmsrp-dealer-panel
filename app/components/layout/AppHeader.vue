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
        <div class="flex items-center space-x-3 relative" ref="headerDropdownRef">
            <button v-for="(item, i) in rightIcons" :key="i" :class="[
                'w-[46px] h-[46px] rounded-full flex items-center justify-center',
                item.bg,
                (item.alt === 'search' || item.alt === 'chat') ? 'max-md:hidden' : ''
            ]" @click="handleRightIconClick(item.alt)">
                <template v-if="item.alt === 'profile'">
                    <div class="w-10 h-10 rounded-full bg-primary text-white text-sm font-semibold flex items-center justify-center select-none">
                        {{ userInitials }}
                    </div>
                </template>
                <template v-else>
                    <img :src="item.icon" :alt="item.alt" />
                </template>
            </button>

            <!-- Search Bar Dropdown -->
            <div v-if="showSearch" class="absolute right-0 top-14 bg-white shadow-lg rounded-lg p-4 w-72 z-20">
                <input type="text" placeholder="Search..." class="w-full border rounded px-3 py-2 focus:outline-none" />
            </div>
            <!-- Chat Dropdown -->
            <div v-if="showChat" class="absolute right-0 top-14 bg-white shadow-lg rounded-lg p-4 w-72 z-20">
                <div class="font-semibold mb-2">Chat</div>
                <div class="text-gray-500 text-sm">No new messages.</div>
            </div>
            <!-- Notification Dropdown -->
            <div v-if="showNotification" class="absolute right-0 top-14 bg-white shadow-lg rounded-lg p-4 w-72 z-20">
                <div class="font-semibold mb-2">Notifications</div>
                <div class="text-gray-500 text-sm">No new notifications.</div>
            </div>
            <!-- Profile Dropdown -->
            <div v-if="showProfile" class="absolute right-0 top-14 bg-white shadow-lg rounded-lg p-4 w-56 z-20">
                <div class="font-semibold mb-2">Profile</div>
                <div class="py-1">
                    <span class="text-gray-600 text-sm block mb-1">{{ user?.name || 'User' }}</span>
                    <span class="text-gray-400 text-xs block mb-3">{{ user?.email }}</span>
                    <button @click="handleLogout" 
                      class="w-full py-2 px-3 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm transition-colors">
                        Logout
                    </button>
                </div>
            </div>
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
    { icon: null, alt: 'profile', bg: 'bg-white' },
];
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import { useRouter } from 'vue-router';

const headerDropdownRef = ref<HTMLElement | null>(null);
const { authenticated, user, logout: authLogout } = useAuth();
const router = useRouter();

function closeAllDropdowns() {
    showSearch.value = false;
    showChat.value = false;
    showNotification.value = false;
    showProfile.value = false;
}

function handleHeaderClickOutside(e: MouseEvent) {
    if (
        (showSearch.value || showChat.value || showNotification.value || showProfile.value) &&
        headerDropdownRef.value &&
        !headerDropdownRef.value.contains(e.target as Node)
    ) {
        closeAllDropdowns();
    }
}

onMounted(() => {
    window.addEventListener('click', handleHeaderClickOutside);
});
onBeforeUnmount(() => {
    window.removeEventListener('click', handleHeaderClickOutside);
});

// Dropdown states
const showSearch = ref(false);
const showChat = ref(false);
const showNotification = ref(false);
const showProfile = ref(false);

function handleRightIconClick(type: string) {
    showSearch.value = false;
    showChat.value = false;
    showNotification.value = false;
    showProfile.value = false;
    if (type === 'search') showSearch.value = true;
    if (type === 'chat') showChat.value = true;
    if (type === 'notification') showNotification.value = true;
    if (type === 'profile') showProfile.value = true;
}

function handleLogout() {
    authLogout();
    closeAllDropdowns();
    router.push('/login');
}

const userInitials = computed(() => {
    const nameOrEmail = (user.value?.name || user.value?.employeeName || user.value?.email || '').trim();
    if (!nameOrEmail) return 'U';
    let source = nameOrEmail;
    if (source.includes('@')) {
        source = source.split('@')[0];
    }
    const parts = source.split(/\s+/).filter(Boolean);
    if (parts.length === 1) {
        const p = parts[0];
        const first = p.charAt(0);
        const last = p.charAt(p.length - 1);
        return (first + (last || '')).toUpperCase();
    }
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
});
</script>

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
                'w-[46px] h-[46px] rounded-full flex items-center justify-center relative',
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
                <!-- Add notification badge -->
                <span
                   v-if="notificationCount > 0 && item.alt === 'notification'"
                    class="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full"
                >
                    {{ notificationCount > 99 ? '99+' : notificationCount }}
                </span>
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
             <div
         v-if="showNotification"
         class="absolute right-0 top-14 bg-white shadow-lg rounded-lg p-4 w-96 z-20 border border-gray-200"
       >
         <!-- Notification Dropdown Header -->
         <div class="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
           <div class="font-semibold text-gray-800 text-lg">Notifications</div>
           <div class="flex items-center gap-3">
             <button 
               v-if="notifications.length > 0"
               @click="handleMarkAllAsRead"
               class="px-3 py-1.5 text-xs bg-blue-50 text-secondary hover:bg-blue-100 font-medium transition-colors rounded-full border border-blue-200 flex items-center gap-1.5"
             >
               <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
               </svg>
               Mark all as read
             </button>
             <div v-if="notificationCount > 0" 
               class="px-2.5 py-1 bg-red-50 text-red-600 text-xs font-semibold rounded-full border border-red-200"
             >
               {{ notificationCount > 99 ? '99+' : notificationCount }} new
             </div>
           </div>
         </div>

         <!-- Loading State -->
         <div v-if="loadingNotifications" class="py-8 flex justify-center">
            <svg
              class="animate-spin h-8 w-8 text-blue-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
          </div>


         <!-- Notifications List -->
         <div v-else-if="notifications.length > 0" class="space-y-3 max-h-[400px] overflow-y-auto">
           <div v-for="notification in notifications" 
                :key="notification.id"
                class="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                :class="{ 'bg-blue-50': !notification.isRead }"
                @click="handleNotificationClick(notification)"
           >
             <div class="flex items-start gap-3">
               <!-- Notification Icon based on type -->
               <div class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    :class="{
                      'bg-blue-100': notification.type === 'bid',
                      'bg-green-100': notification.type === 'success',
                      'bg-yellow-100': notification.type === 'warning',
                      'bg-red-100': notification.type === 'error'
                    }"
               >
                 <svg class="w-4 h-4" 
                      :class="{
                        'text-blue-600': notification.type === 'bid',
                        'text-green-600': notification.type === 'success',
                        'text-yellow-600': notification.type === 'warning',
                        'text-red-600': notification.type === 'error'
                      }"
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                 >
                   <path v-if="notification.type === 'bid'" 
                         stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                         d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                   <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                         d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                 </svg>
               </div>
               
               <!-- Notification Content -->
               <div class="flex-1">
                 <p class="text-sm font-medium text-gray-900">{{ notification.title }}</p>
                 <p class="text-xs text-gray-500 mt-1">{{ notification.message }}</p>
                 <span class="text-xs text-gray-400 mt-2 block">
                   {{ new Date(notification.createdAt).toLocaleString() }}
                 </span>
               </div>

               <!-- Unread Indicator -->
               <div v-if="!notification.isRead" 
                    class="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0">
               </div>
             </div>
           </div>
         </div>

         <!-- Empty State -->
         <div v-else class="py-8 text-center text-gray-500">
           No notifications to display
         </div>
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

<script setup >
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
import { useApi } from "~/composables/useApi";
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import { useRouter } from 'vue-router';


const route = useRoute();
const { apiPost , apiGet, apiPut,apiPatch} = useApi();

// Add new refs for notifications
const notifications = ref([])
const loadingNotifications = ref(false)
const notificationCount = ref(0);
// Dropdown states
const showSearch = ref(false);
const showChat = ref(false);
const showNotification = ref(false);
const showProfile = ref(false);
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
     { 
        icon: notificationIcon, 
        alt: "notification", 
        bg: "bg-[#E8EFFA]",
        count: notificationCount.value 
    },
    { icon: null, alt: 'profile', bg: 'bg-white' },
];


const headerDropdownRef = ref(null);
const { authenticated, user, logout: authLogout } = useAuth();
const router = useRouter();

function closeAllDropdowns() {
    showSearch.value = false;
    showChat.value = false;
    showNotification.value = false;
    showProfile.value = false;
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
function handleHeaderClickOutside(e) {
    if (
        (showSearch.value || showChat.value || showNotification.value || showProfile.value) &&
        headerDropdownRef.value &&
        !headerDropdownRef.value.contains(e.target )
    ) {
        closeAllDropdowns();
    }
}

onBeforeUnmount(() => {
    window.removeEventListener('click', handleHeaderClickOutside);
});



function handleRightIconClick(type) {
    showSearch.value = false;
    showChat.value = false;
    showNotification.value = false;
    showProfile.value = false;
    if (type === 'search') showSearch.value = true;
    if (type === 'chat') showChat.value = true;
    if (type === 'notification') {
        showNotification.value = true
        fetchNotificationList()
    };
    if (type === 'profile') showProfile.value = true;
}

function handleLogout() {
    authLogout();
    closeAllDropdowns();
    router.push('/login');
}



// Fetch notification count
const fetchNotificationCount = async () => {
  try {
    const response = await apiGet('/notification/unread-count')
    // notificationApi.getNotificationCount();
    if (response.success) {
      notificationCount.value = response.unreadCount;
      console.log('count',notificationCount.value)
    }
  } catch (error) {
    console.error('Failed to fetch notifications:', error);
  }
}

// Add notification list fetch function
const fetchNotificationList = async () => {
  try {
    loadingNotifications.value = true
    const response = await apiGet('/notification/list')
    // notificationApi.getNotificationList('')
    if (response.success) {
      notifications.value = response.data || []
    }
  } catch (error) {
    console.error('Failed to fetch notification list:', error)
  } finally {
    loadingNotifications.value = false
  }
}

// Lifecycle hooks
onMounted(() => {
  window.addEventListener("click", handleHeaderClickOutside);
  fetchNotificationCount();
});

const handleNotificationClick = async (notification) => {
  try {
    console.log('Notification',notification)
    if (!notification.isRead) {
      await apiPatch(`/notification/mark-read/${notification._id}`);
    //   await notificationApi.markAsRead(notification.id);
      // Refetch notifications to update the list
      fetchNotificationList();
      // Also update the count
      fetchNotificationCount();
    }
    // Handle notification navigation based on type if needed
    // if (notification.type === 'bid') {
    //   // Navigate to bid details or handle bid notification
    //   router.push(`/offers/${notification.data.bidId}`);
    // }
    // Add other notification type handling as needed
  } catch (error) {
    console.error('Failed to mark notification as read:', error);
  }
}

// Add function to handle mark all as read
const handleMarkAllAsRead = async () => {
  try {
    const response = await apiPatch('/notification/mark-all-read')
    // Refetch notifications to update the list
    fetchNotificationList();
    // Also update the count
    fetchNotificationCount();
  } catch (error) {
    console.error('Failed to mark all notifications as read:', error);
  }
}
</script>

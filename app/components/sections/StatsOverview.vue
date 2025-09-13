<template>
  <section class="py-16 px-8 max-sm:px-5 max-sm:py-6">
    <div class="flex items-center justify-between gap-10 max-sm:flex-col max-sm:items-start">
      <!-- Greeting Section -->
      <div class="max-sm:text-left">
        <p class="large font-semibold">Hello {{ displayName }},</p>
        <h1 class="text-[#1E1E1E] opacity-55 font-medium">Welcome back</h1>
      </div>
      <!-- Stats Section -->
      <div class="relative flex items-center justify-center max-lg:grid max-lg:grid-cols-2 max-lg:gap-16 max-sm:justify-between max-sm:w-full">
        <!-- Plus sign for small screens -->
        <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 lg:hidden">
          <div class="w-[2px] h-[340px] bg-gradient-to-b from-transparent via-primary/40 to-transparent absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"></div>
          <div class="h-[2px] w-[362px] bg-gradient-to-r from-transparent via-primary/40 to-transparent absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"></div>
        </div>
        <template v-for="(stat, i) in stats" :key="stat.title + i">
          <div class="w-full px-[37px] max-lg:px-5 max-sm:p-0">
            <div class="flex items-start justify-between gap-[35px] mb-7 max-lg:gap-5">
              <div>
                <p class="text-sm text-primary mb-2 font-medium">{{ stat.title }}</p>
                <div class="flex gap-[7px]">
                  <img :src="stat.trendIcon" alt="icon" />
                  <span class="font-bold text-[13px]" :class="stat.trendColor">{{ stat.trend }}</span>
                </div>
                <div class="flex gap-[7px]">
                  <span class="font-bold text-[#8F95B2] text-[13px]">Lifetime</span>
                  <!-- <img :src="stat.weekIcon" alt="icon" /> -->
                </div>
              </div>
              <button class="min-w-[54px] min-h-[54px] rounded-full flex items-center justify-center max-sm:hidden hover:opacity-80 transition-opacity" 
                      :class="stat.buttonBg"
                      @click="handleStatClick(stat)">
                <img :src="stat.buttonIcon" alt="icon" />
              </button>
            </div>
            <span class="text-[41px] font-medium text-primary leading-[43px]">{{ stat.value }}</span>
          </div>
          <span v-if="i < stats.length - 1" class="w-[1.5px] h-[182px] block bg-gradient-to-b from-transparent via-primary/20 to-transparent shrink-0 max-lg:hidden"></span>
        </template>
      </div>
    </div>
  </section>
</template>

<script setup>
import arrowUpGreen from "~/assets/images/icons/arrow-up-green.svg";
import arrowDownRed from "~/assets/images/icons/arrow-down-red.svg";
import dropdownAngle from "~/assets/images/icons/droppdown-angle-stats.svg";
import offersIcon from "~/assets/images/icons/offers-icon-stats.svg";
import vehicleLogo from "~/assets/images/icons/vehicle-logo.svg";
import homeIcon from "~/assets/images/icons/home-icon-stats.svg";
import statsHamburger from "~/assets/images/icons/stats-hamburger.svg";

const { apiGet } = useApi();
const { user } = useAuth();
const displayName = computed(() => user.value?.fullName || user.value?.name || user.value?.email || "Dealer");
const stats = ref([]);
const getStats = async () => {
  const response = await apiGet("/stats?filter=lifetime");
  stats.value = mapStatsData(response.data);
  return response;
};

const mapStatsData = (apiData) => {
  const iconMap = {
    arrowUpGreen,
    arrowDownRed,
    dropdownAngle,
    offersIcon,
    vehicleLogo,
    homeIcon,
    statsHamburger,
  };

  return apiData.map((item) => ({
    ...item,
    trendIcon: iconMap[item.trendIcon] || item.trendIcon,
    weekIcon: iconMap[item.weekIcon] || item.weekIcon,
    buttonIcon: iconMap[item.buttonIcon] || item.buttonIcon,
  }));
};
onMounted(() => {
  getStats();
});

// Handle stat button clicks
const handleStatClick = (stat) => {
  // Navigate based on the stat type
  if (stat.title.toLowerCase().includes('offers')) {
    navigateTo('/offers');
  } else if (stat.title.toLowerCase().includes('accepted')) {
    navigateTo('/accepted');
  } else if (stat.title.toLowerCase().includes('rejected')) {
    navigateTo('/rejected');
  } else if (stat.title.toLowerCase().includes('countered')) {
    navigateTo('/countered');
  }
};
</script>

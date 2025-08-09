F<template>
  <section class="py-16 px-8 max-sm:px-5 max-sm:py-6">
    <div class="flex items-center justify-between gap-10 max-sm:flex-col max-sm:items-start">
      <!-- Greeting Section -->
      <div class="max-sm:text-left">
        <p class="large font-semibold">Hello Redcar Speed,</p>
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
                  <span class="font-bold text-[#8F95B2] text-[13px]">{{ stat.weekLabel }}</span>
                  <img :src="stat.weekIcon" alt="icon" />
                </div>
              </div>
              <button class="min-w-[54px] min-h-[54px] rounded-full flex items-center justify-center max-sm:hidden" :class="stat.buttonBg">
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

<script setup lang="ts">
import arrowUpGreen from '~/assets/images/icons/arrow-up-green.svg';
import arrowDownRed from '~/assets/images/icons/arrow-down-red.svg';
import dropdownAngle from '~/assets/images/icons/droppdown-angle-stats.svg';
import offersIcon from '~/assets/images/icons/offers-icon-stats.svg';
import vehicleLogo from '~/assets/images/icons/vehicle-logo.svg';
import homeIcon from '~/assets/images/icons/home-icon-stats.svg';
import statsHamburger from '~/assets/images/icons/stats-hamburger.svg';


const stats = [
  {
    title: 'Total Offers',
    trendIcon: arrowUpGreen,
    trend: '23%',
    trendColor: 'text-[#71CA87]',
    weekLabel: 'This week',
    weekIcon: dropdownAngle,
    buttonBg: 'bg-[#E5ECFF]',
    buttonIcon: offersIcon,
    value: '4,423',
  },
  {
    title: 'Total Cars',
    trendIcon: arrowDownRed,
    trend: '23%',
    trendColor: 'text-[#F9746D]',
    weekLabel: 'This week',
    weekIcon: dropdownAngle,
    buttonBg: 'bg-[#DDF4DF]',
    buttonIcon: vehicleLogo,
    value: '1,050',
  },
  {
    title: 'Total Makes',
    trendIcon: arrowUpGreen,
    trend: '23%',
    trendColor: 'text-[#71CA87]',
    weekLabel: 'This week',
    weekIcon: dropdownAngle,
    buttonBg: 'bg-[#F2DFE5]',
    buttonIcon: homeIcon,
    value: '204',
  },
  {
    title: 'Total Cars',
    trendIcon: arrowDownRed,
    trend: '23%',
    trendColor: 'text-[#F9746D]',
    weekLabel: 'This week',
    weekIcon: dropdownAngle,
    buttonBg: 'bg-[#F6F0E2]',
    buttonIcon: statsHamburger,
    value: '86',
  },
];
</script>

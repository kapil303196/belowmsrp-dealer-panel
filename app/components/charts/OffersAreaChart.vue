<template>
    <div class="w-full">
        <div class="flex justify-between items-center mb-12 gap-[18px] max-sm:items-start">
            <div class="flex items-center justify-between w-full max-sm:flex-col max-sm:items-start gap-3">
                <h4 class="text-primary font-medium">Total Offers Received</h4>
                <div class="relative" ref="dropdownRef">
                    <button class="bg-[#E8EFFA] text-xs px-3 py-[9px] rounded-full flex items-center gap-2"
                        @click="toggleDropdown">
                        {{ selectedFilter }}
                        <img src="~/assets/images/icons/angle-down-black.svg" alt="">
                    </button>
                    <div v-if="dropdownOpen" class="absolute right-0 mt-2 w-40 bg-[#F7FAFF] border rounded-lg shadow-lg z-10 max-sm:left-5">
                        <ul>
                            <li v-for="option in filterOptions" :key="option" @click="selectFilter(option)"
                                class="px-4 py-2 hover:bg-gray-100 cursor-pointer">{{ option }}</li>
                        </ul>
                    </div>
                </div>
            </div>
            <button>
                <img src="~/assets/images/icons/arrow-up-right.svg" alt="">
            </button>
        </div>
        <client-only>
            <apexchart width="100%" height="300" type="area" :options="chartOptions" :series="series"
                class="rounded-2xl pt-2 pb-0" />
        </client-only>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

// Filter dropdown logic
const filterOptions = ['This Week', 'Last Week', 'This Month']
const selectedFilter = ref('This Week')
const dropdownOpen = ref(false)
const dropdownRef = ref(null)

function toggleDropdown() {
    dropdownOpen.value = !dropdownOpen.value
}
function selectFilter(option) {
    selectedFilter.value = option
    dropdownOpen.value = false
}

function handleClickOutside(e) {
    if (dropdownOpen.value && dropdownRef.value && !dropdownRef.value.contains(e.target)) {
        dropdownOpen.value = false
    }
}
onMounted(() => {
    window.addEventListener('click', handleClickOutside)
})
onBeforeUnmount(() => {
    window.removeEventListener('click', handleClickOutside)
})

// Mock data series
const series = [
    {
        name: "Offers",
        data: [1780, 1600, 2300, 1661, 3100, 3000, 3800],
    },
];

// Main chart options (styled to match D3 example)
const chartOptions = {
    chart: {
        toolbar: { show: false },
        zoom: { enabled: false },
        background: 'transparent',
        fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif',
    },
    dataLabels: { enabled: false },
    stroke: {
        curve: "smooth",
        width: 3,
        colors: ["#1d4ed8"],
    },
    colors: ["#1d4ed8"],
    fill: {
        type: "gradient",
        gradient: {
            shade: 'light',
            type: 'vertical',
            shadeIntensity: 0.4,
            gradientToColors: ["#1d4ed8"],
            opacityFrom: 0.25,
            opacityTo: 0.03,
            stops: [0, 80, 100],
            colorStops: [
                {
                    offset: 0,
                    color: "#1d4ed8",
                    opacity: 0.18
                },
                {
                    offset: 60,
                    color: "#1d4ed8",
                    opacity: 0.10
                },
                {
                    offset: 100,
                    color: "#1d4ed8",
                    opacity: 0.01
                }
            ]
        },
    },
    grid: {
        show: true,
        borderColor: '#e2e8f0',
        strokeDashArray: 4,
        xaxis: { lines: { show: false } },
        yaxis: { lines: { show: true } },
        row: {
            colors: ["rgba(29,78,216,0.04)", "transparent"],
            opacity: 0.5
        },
        padding: { left: 0, right: 0, top: 0, bottom: 0 },
    },
    xaxis: {
        categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        labels: {
            style: {
                colors: ["#94a3b8", "#94a3b8", "#94a3b8", "#94a3b8", "#94a3b8", "#94a3b8", "#94a3b8"],
                fontSize: "13px",
                fontWeight: 500,
            },
        },
        axisBorder: { show: false },
        axisTicks: { show: false },
        tooltip: { enabled: false },
    },
    yaxis: {
        min: 500,
        max: 4000,
        tickAmount: 7,
        labels: {
            style: {
                colors: ["#94a3b8"],
                fontSize: "12px",
            },
            formatter: val => Math.round(val),
        },
    },
    markers: {
        size: 5,
        colors: ["#fff"],
        strokeColors: "#1d4ed8",
        strokeWidth: 3,
        hover: { size: 8 },
    },
    tooltip: {
        enabled: true,
        custom: ({ series, seriesIndex, dataPointIndex }) => {
            const val = series[seriesIndex][dataPointIndex];
            const categories = chartOptions.xaxis.categories;
            const date = categories && categories[dataPointIndex] ? categories[dataPointIndex] : '';
            return `
        <div style="background:#2C73DB;color:#fff;padding:14px 16px;border-radius:14px;box-shadow:0 10px 30px rgba(0,0,0,.25);min-width:180px;text-align:center;">
          <div style="font-size:30px;font-weight:800;line-height:1;">${val.toLocaleString()}</div>
          <div style="font-size:13px;margin-top:4px;">${date} 2025</div>
          <div style="font-size:12px;opacity:.85;margin-top:6px;">Total Offers Received</div>
        </div>
      `;
        },
        style: {
            fontSize: '13px',
            fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif',
        },
        x: { show: false },
    },
    legend: { show: false },
};
</script>

<template>
    <section class="p-7">
        <div class="flex items-start justify-between gap-6 max-md:flex-col">
            <!-- Chart Container -->
            <div class="w-full">
                <div class="flex justify-between items-center mb-12">
                    <h4 class="text-primary font-medium">Total Offers Received</h4>
                    <div class="flex items-center gap-4">
                        <button class="bg-[#E8EFFA] text-xs px-3 py-[9px] rounded-full flex items-center gap-2">
                            This Week
                            <img src="~/assets/images/icons/angle-down-black.svg" alt="">
                        </button>
                        <button>
                            <img src="~/assets/images/icons/arrow-up-right.svg" alt="">
                        </button>
                    </div>
                </div>

                <client-only>
                    <apexchart width="100%" height="240" type="area" :options="chartOptions" :series="series" />
                </client-only>

                <!-- <div class="flex justify-between text-[10px] mt-2 px-1">
                    <span>Mon</span>
                    <span>Tue</span>
                    <span>Wed</span>
                    <span class="text-[#3A60FF] font-semibold">Thu</span>
                    <span>Fri</span>
                    <span>Sat</span>
                    <span>Sun</span>
                </div> -->
            </div>

            <!-- Donut Chart -->
            <div class="w-full max-w-[395px] bg-[#EFF3FA] rounded-2xl shadow-sm p-4 px-[20px]">
                <h4 class="text-primary font-medium mb-16">Accept / Reject Ration</h4>
                <div class="flex items-start gap-5">
                    <div class="space-y-5">
                        <div v-for="(label, i) in donutOptions.labels" :key="label">
                            <span class="w-2 h-2 block mb-1 rounded-full" :style="{ background: donutOptions.colors[i] }"></span>
                            <span class="text-[13px] font-medium">{{ label }}</span>
                            <h3 class="text-[26px] font-medium text-[#111827]">{{ donutSeries[i] }}%</h3>
                        </div>
                    </div>
                    <client-only>
                        <apexchart type="donut" width="100%" height="220" :series="donutSeries" :options="donutOptions" />
                    </client-only>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>

// Mock data series
const series = [
    {
        name: "Offers",
        data: [1500, 1800, 2300, 1661, 2400, 3000, 3500],
    },
];

// Main chart options
const chartOptions = {
    chart: { toolbar: { show: false }, zoom: { enabled: false } },
    dataLabels: { enabled: false },
    stroke: { curve: "smooth", width: 3 },
    colors: ["#D0D6E0"],
    fill: {
        type: "gradient",
        gradient: { shadeIntensity: 1, opacityFrom: 0.25, opacityTo: 0, stops: [0, 90, 100] },
    },
    grid: { show: true, strokeDashArray: 4 },
    xaxis: { categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], labels: { style: { colors: "#737A85", fontSize: "12px" } } },
    tooltip: {
        enabled: true,
        custom: ({ series, seriesIndex, dataPointIndex, w }) => {
            const val = series[seriesIndex][dataPointIndex];
            const date = w.globals.labels[dataPointIndex];
            return `
        <div class="bg-[#2C73DB] border border-gray-200 text-white text-[12px] p-2 rounded-2xl shadow-md w-[170px]">
          <div class="text-[28px] font-medium">${val}</div>
          <div class="text-[13px] font-medium">${date}</div>
          <div class="text-[10px]">Total Offers Received</div>
        </div>`;
        }
    },
};

// Donut chart options
const donutOptions = {
    chart: { type: "donut" },
    labels: ["Accepted", "Rejected"],
    colors: ["#22C55E", "#EF4444"],
    legend: { show: true },
    plotOptions: {
        pie: {
            donut: {
                size: "75%",
                labels: {
                    show: true,
                    name: { show: true },
                    value: { show: true, fontSize: "20px", fontWeight: 600, formatter: (val) => `${val}%` },
                    total: { show: false },
                },
            },
        },
    },
    dataLabels: { enabled: true },
};

const donutSeries = [68, 32];
donutOptions.legend.show = false;
</script>

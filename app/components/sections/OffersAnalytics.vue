<template>
    <section class="p-7 max-sm:px-5">
        <div class="flex items-start justify-between gap-6 max-md:flex-col">
            <!-- Chart Container -->
            <div class="w-full">
                <div class="flex justify-between items-center mb-12 gap-[18px] max-sm:items-start">
                    <div class="flex items-center justify-between w-full max-sm:flex-col max-sm:items-start gap-3">
                        <h4 class="text-primary font-medium">Total Offers Received</h4>
                        <button class="bg-[#E8EFFA] text-xs px-3 py-[9px] rounded-full flex items-center gap-2">
                            This Week
                            <img src="~/assets/images/icons/angle-down-black.svg" alt="">
                        </button>
                    </div>
                    <button>
                        <img src="~/assets/images/icons/arrow-up-right.svg" alt="">
                    </button>
                </div>

                <client-only>
                    <apexchart width="100%" height="300" type="area" :options="chartOptions" :series="series"
                        class="rounded-2xl px-2 pt-2 pb-0" />
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
            <div
                class="relative w-full max-w-[395px] bg-[#EFF3FA] overflow-hidden rounded-2xl shadow-sm p-4 px-[20px] pb-20 max-md:max-w-full">
                <h4 class="text-primary font-medium mb-16">Accept / Reject Ration</h4>
                <div class="flex items-start gap-5">
                    <div class="space-y-5">
                        <div v-for="(label, i) in donutOptions.labels" :key="label">
                            <span class="w-2 h-2 block mb-1 rounded-full"
                                :style="{ background: donutOptions.colors[i] }"></span>
                            <span class="text-[13px] font-medium">{{ label }}</span>
                            <h3 class="text-[26px] font-medium text-[#111827]">{{ donutSeries[i] }}%</h3>
                        </div>
                    </div>
                    <div class="absolute -right-14 -bottom-14">
                        <client-only>
                            <apexchart type="donut" width="100%" height="280" :series="donutSeries"
                                :options="donutOptions" />
                        </client-only>
                    </div>
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
        custom: ({ series, seriesIndex, dataPointIndex, w }) => {
            const val = series[seriesIndex][dataPointIndex];
            const date = w.globals.labels[dataPointIndex];
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

// Donut chart options (half-circle)
const donutOptions = {
    chart: { type: "donut" },
    labels: ["Accepted", "Rejected"],
    colors: ["#22C55E", "#EF4444"],
    legend: { show: true },
    plotOptions: {
        pie: {
            startAngle: -140,
            endAngle: 55,
            donut: {
                size: "92%",
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

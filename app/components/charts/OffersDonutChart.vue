<template>
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
                    <apexchart type="donut" width="100%" height="280" :series="donutSeries" :options="donutOptions" />
                </client-only>
            </div>
        </div>
    </div>
</template>

<script setup>
// Donut chart options (half-circle)
const donutOptions = {
    chart: { type: "donut" },
    labels: ["Accepted", "Rejected"],
    colors: ["#22C55E", "#EF4444"],
    legend: { show: false },
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
</script>

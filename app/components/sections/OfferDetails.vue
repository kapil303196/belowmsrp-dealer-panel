<template>
    <div class="p-8 max-sm:px-5 max-sm:pt-0">
        <h4 class="font-medium text-primary mb-10 max-sm:hidden">Offer Details</h4>
        <div class="grid grid-cols-2 gap-[68px] max-lg:gap-5 max-md:grid-cols-1">
            <!-- Desktop: Sidebar thumbnails + main image -->
            <div class="flex items-stretch gap-[10px] max-h-[553px] max-sm:hidden">
                <div class="flex flex-col gap-[10px]">
                    <div v-for="(img, index) in thumbnails" :key="index"
                        class="w-[105px] h-full bg-[#EBEDF1] rounded-lg flex items-center justify-center overflow-hidden cursor-pointer p-[6px]"
                        :class="{ 'opacity-50': selectedImage === img, 'opacity-100': selectedImage !== img }"
                        @click="selectedImage = img">
                        <img :src="img" alt="thumb" class="object-contain h-full" />
                    </div>
                </div>
                <!-- Main Image -->
                <div class="w-full h-full rounded-lg flex items-center justify-center bg-[#EBEDF1] p-12">
                    <img :src="selectedImage" alt="main" class="w-full object-contain" />
                </div>
            </div>
            <!-- Mobile: Horizontal scrollable carousel, all images same size -->
            <div class="sm:hidden w-full">
                <div class="flex gap-3 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent px-1 py-2"
                    style="scroll-snap-type: x mandatory;">
                    <div v-for="(img, index) in thumbnails" :key="index"
                        class="flex-shrink-0 w-[311px] h-[323px] bg-[#EBEDF1] rounded-lg flex items-center justify-center overflow-hidden cursor-pointer"
                        style="scroll-snap-align: start;">
                        <img :src="img" alt="thumb" class="object-contain w-full h-full" />
                    </div>
                </div>
            </div>

            <!-- Right Side - Details -->
            <div class="">
                <h1 class="font-medium text-primary mb-1">BMW GT 340i</h1>
                <div class="flex items-center gap-[10px]">
                    <img src="../../assets/images/user-avatar.png" alt="avatar" class="w-5 h-5 rounded-full" />
                    <span class="text-[#191919] text-[13px]">Emiel J.</span>
                </div>
                <div
                    class="flex items-center gap-1 mt-[10px] text-[15px] text-primary py-2 px-[10px] rounded-lg bg-[#E8EEF9] w-fit">

                    <img src="../../assets/images/icons/navigation-icon.svg" alt="avatar"
                        class="w-5 h-5 rounded-full" />

                    13th Street 47 W 13th St, New York, NY
                </div>

                <!-- Price -->
                <div class="my-9">
                    <span class="text-[#2C8436] font-bold text-xl">$135,000</span>
                    <span class="text-gray-400 text-xl font-medium line-through ml-2">$255,990</span>
                </div>

                <!-- Table -->
                <div class="space-y-[2px]">
                    <div
                        class="flex items-center justify-between gap-1 mt-[10px] text-[15px] text-primary py-2 px-[10px] rounded-lg bg-[#E8EEF9] w-full">
                        <span class="text-[15px] font-medium text-black">Offered Price</span>
                        <span class="text-[15px] font-bold text-black">$135,000</span>
                    </div>
                    <div
                        class="flex items-center justify-between gap-1 mt-[10px] text-[15px] text-primary py-2 px-[10px] rounded-lg bg-[#E8EEF9] w-full">
                        <span class="text-[15px] font-medium text-black">MSRP</span>
                        <span class="text-[15px] font-bold text-black">$136,500</span>
                    </div>
                    <div
                        class="flex items-center justify-between gap-1 mt-[10px] text-[15px] text-primary py-2 px-[10px] rounded-lg bg-[#E8EEF9] w-full">
                        <span class="text-[15px] font-medium text-black">Trade-In Value</span>
                        <span class="text-[15px] font-bold text-black">- $8,000</span>
                    </div>
                    <div
                        class="flex items-center justify-between gap-1 mt-[10px] text-[15px] text-primary py-2 px-[10px] rounded-lg bg-[#E8EEF9] w-full">
                        <span class="text-[15px] font-medium text-black">Total off MSRP</span>
                        <span class="text-[15px] font-bold text-black flex gap-[14px]"><span class="opacity-50">14%
                            </span> $1500</span>
                    </div>
                </div>

                <!-- Buttons: Desktop -->
                <div class="flex gap-3 mt-8 max-sm:hidden">
                    <ui-base-button variant="green-transparent">
                        Accept
                    </ui-base-button>
                    <ui-base-button variant="secondary-transparent">
                        Make Counter Offer
                    </ui-base-button>
                    <ui-base-button variant="red-transparent">
                        Decline
                    </ui-base-button>
                </div>
                <!-- Buttons: Mobile fixed bottom bar -->
                <div class="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#EFF3FA] border-t border-[#DBE4F2] shadow-[0_-8px_24px_0_rgba(0,0,0,0.06)] flex gap-1 px-5 py-[14px] justify-between"
                    style="border-top-left-radius:20px;border-top-right-radius:20px;">
                    <ui-base-button variant="green-transparent" class="!px-4">
                        Accept
                    </ui-base-button>
                    <ui-base-button variant="secondary-transparent" class="flex-1 !px-4">
                        Make Counter Offer
                    </ui-base-button>
                    <ui-base-button variant="red-transparent" class="!px-4">
                        Decline
                    </ui-base-button>
                </div>

                <!-- Comments -->
                <div class="mt-10">
                    <h4 class="text-black font-bold mb-[10px]">Comments</h4>

                    <div v-for="(comment, idx) in comments" :key="idx" class="flex gap-[18px] pb-[30px] pt-4 border-b">
                        <img :src="comment.avatar" :alt="comment.role" class="w-10 h-10 rounded-full" />
                        <div>
                            <div class="text-black font-bold text-[15px]">{{ comment.name }} </div>
                            <span class="text-black font-bold text-[15px] opacity-55">{{ comment.role }}</span>
                            <div class="text-[#6B7397] font-medium text-[13px]">{{ comment.date }}</div>
                            <p class="text-primary text-[15px] mt-[10px] leading-5">
                                {{ comment.text }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue"

import bmw1 from "@/assets/images/bmw1.png"
import bmw2 from "@/assets/images/bmw2.png"
import bmw3 from "@/assets/images/bmw3.png"
import bmw4 from "@/assets/images/bmw4.png"
import bmw5 from "@/assets/images/bmw5.png"
import userAvatar from "@/assets/images/user-avatar.png"
import userAvatar2 from "@/assets/images/user-2.png"

const thumbnails = [bmw1, bmw2, bmw3, bmw4, bmw5]
const selectedImage = ref(thumbnails[0])

const comments = [
    {
        avatar: userAvatar,
        name: 'Gordon Ramsay',
        role: 'User',
        date: '20/07/2021 17:31',
        text: `I read on some website that the 1600 and 2600 was better, but they are both worse than the 9600k.\nAnd, anyways I already have a B365 LGA 1151 Gen 2 motherboard, so, it’s the most logical upgrade.`
    },
    {
        avatar: userAvatar2,
        name: 'Redcar Speed',
        role: 'Dealer',
        date: '20/07/2021 17:31',
        text: `I read on some website that the 1600 and 2600 was better, but they are both worse than the 9600k.\nAnd, anyways I already have a B365 LGA 1151 Gen 2 motherboard, so, it’s the most logical upgrade.`
    },
    {
        avatar: userAvatar,
        name: 'Gordon Ramsay',
        role: 'User',
        date: '20/07/2021 17:31',
        text: `I read on some website that the 1600 and 2600 was better, but they are both worse than the 9600k.\nAnd, anyways I already have a B365 LGA 1151 Gen 2 motherboard, so, it’s the most logical upgrade.`
    },
    {
        avatar: userAvatar2,
        name: 'Redcar Speed',
        role: 'Dealer',
        date: '20/07/2021 17:31',
        text: `I read on some website that the 1600 and 2600 was better, but they are both worse than the 9600k.\nAnd, anyways I already have a B365 LGA 1151 Gen 2 motherboard, so, it’s the most logical upgrade.`
    },
]
</script>

<template>
    <div class="p-7 max-sm:px-5">
        <!-- Small screen filter bar -->
        <div class="md:hidden flex flex-col gap-3 mb-4">
            <div class="flex items-center justify-between gap-2">
                <h4 class="text-primary font-medium">Accepted Offers</h4>
                <div class="relative">
                    <button @click="toggleDropdown('sortby')"
                        class="bg-[#E8EFFA] rounded-full py-2 px-5 flex items-center gap-2">
                        <span>Sort By</span>
                        <img src="../../assets/images/icons/angle-down-black.svg" alt="icon">
                    </button>
                    <div v-if="dropdownOpen === 'sortby'"
                        class="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-20">
                        <ul>
                            <li class="px-4 py-2 font-semibold text-primary">Status</li>
                            <li class="px-4 py-2 hover:bg-gray-100 cursor-pointer">Accepted</li>
                            <li class="px-4 py-2 hover:bg-gray-100 cursor-pointer">Rejected</li>
                            <li class="px-4 py-2 hover:bg-gray-100 cursor-pointer">Countered</li>
                            <li>
                                <hr class="my-1 border-t">
                            </li>
                            <li class="px-4 py-2 font-semibold text-primary">Model</li>
                            <li class="px-4 py-2 hover:bg-gray-100 cursor-pointer">Porsche</li>
                            <li class="px-4 py-2 hover:bg-gray-100 cursor-pointer">Mercedes</li>
                            <li class="px-4 py-2 hover:bg-gray-100 cursor-pointer">BMW</li>
                            <li>
                                <hr class="my-1 border-t">
                            </li>
                            <li class="px-4 py-2 font-semibold text-primary">Date</li>
                            <li class="px-4 py-2 hover:bg-gray-100 cursor-pointer">This week</li>
                            <li class="px-4 py-2 hover:bg-gray-100 cursor-pointer">Last week</li>
                            <li class="px-4 py-2 hover:bg-gray-100 cursor-pointer">This month</li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="relative mt-1">
                <input type="search" class="bg-[#E8EEF9] p-3 pl-10 outline-none w-full rounded-full border"
                    placeholder="Search by name, model, or amount...">
                <img class="absolute left-4 top-1/2 -translate-y-1/2" src="../../assets/images/icons/search-icon.svg"
                    alt="icon">
            </div>
        </div>
        <!-- Cards: Small screens only -->
        <div class="md:hidden flex flex-col gap-4">
            <div v-for="(offer, index) in paginatedOffers" :key="index" class="bg-[#E8EEF9] rounded-xl p-4 shadow">
                <!-- Top: image, model, price -->
                <div class="flex justify-between items-center">
                    <div class="flex items-center gap-[10px] mb-[14px]">
                        <div class="flex items-center space-x-3 flex-1">
                            <img :src="offer.image" class="w-[71px] h-12 rounded object-cover" />
                            <div>
                                <div class="text-[13px] font-medium text-primary">{{ offer.model }}</div>
                                <div class="text-[13px] font-medium text-primary opacity-50">{{ offer.price }}</div>
                            </div>
                        </div>
                    </div>
                    <!-- Action button at bottom -->
                    <div class="flex items-center gap-2 justify-end mt-2">
                        <button
                            class="relative w-[38px] h-10 flex items-center justify-center flex-none ">
                            <img src="../../assets/images/icons/download-icon.svg" alt="icon" class="w-5 h-5">
                        </button>
                    </div>
                </div>
                <!-- Customer details -->
                <div class="text-sm text-primary mb-2 font-medium text-[15px]">
                    <p class="text-sm text-primary pb-2 font-medium">Customer</p>
                    <span
                        class="w-full h-[2px] bg-gradient-to-r from-transparent via-primary/20 to-transparent block"></span>
                    <div class="flex flex-col gap-0.5">
                        <div class="flex justify-between py-[6px]">
                            <span class="text-[#081735] opacity-55">Name:</span>
                            <span>{{ offer.customer.name }}</span>
                        </div>
                        <span
                            class="w-full h-[2px] bg-gradient-to-r from-transparent via-primary/20 to-transparent block"></span>
                        <div class="flex justify-between py-[6px]">
                            <span class="text-[#081735] opacity-55">Email:</span>
                            <span>{{ offer.customer.email }}</span>
                        </div>
                        <span
                            class="w-full h-[2px] bg-gradient-to-r from-transparent via-primary/20 to-transparent block"></span>
                        <div class="flex justify-between py-[6px]">
                            <span class="text-[#081735] opacity-55">Phone:</span>
                            <span>{{ offer.customer.phone }}</span>
                        </div>
                        <span
                            class="w-full h-[2px] bg-gradient-to-r from-transparent via-primary/20 to-transparent block"></span>
                        <div class="flex justify-between py-[6px]">
                            <span class="text-[#081735] opacity-55">Credit Score:</span>
                            <span>{{ offer.customer.creditScore }}</span>
                        </div>
                        <div class="flex justify-between rounded-lg border-none bg-white p-2">
                            <span class="text-[#081735] opacity-55">User Offer:</span>
                            <span class="font-semibold">${{ offer.userOffer }}</span>
                        </div>
                    </div>
                </div>
                <!-- Comment -->
                <div class="mt-[14px] mb-3"><span class="font-medium text-[15px] text-primary"></span> {{ offer.comments
                    }}
                </div>

            </div>
        </div>

        <!-- Desktop filter bar -->
        <div class="max-md:hidden flex items-center justify-between mb-10">
            <div class="flex items-center gap-[10px]">
                <h4 class="text-primary font-medium text-nowrap">All Offers</h4>
                <div class="relative">
                    <input type="search" class="bg-transparent p-3 pl-10 outline-none w-[340px] max-lg:w-[220px]"
                        placeholder="Search by name, model, or amount...">
                    <img class="absolute left-2 top-1/2 -translate-y-1/2"
                        src="../../assets/images/icons/search-icon.svg" alt="icon">
                </div>
            </div>
            <div class="bg-[#E8EFFA] rounded-full py-4 px-5 flex items-center justify-between">
                <span class="pr-4 border-r">Sort By</span>
                <div class="relative">
                    <button @click="toggleDropdown('status')"
                        class="flex items-center gap-[98px] px-4 border-r max-lg:gap-3">
                        <span>Status</span>
                        <img src="../../assets/images/icons/angle-down-black.svg" alt="icon">
                    </button>
                    <div v-if="dropdownOpen === 'status'"
                        class="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-10">
                        <ul>
                            <li class="px-4 py-2 hover:bg-gray-100 cursor-pointer">Accepted</li>
                            <li class="px-4 py-2 hover:bg-gray-100 cursor-pointer">Rejected</li>
                            <li class="px-4 py-2 hover:bg-gray-100 cursor-pointer">Countered</li>
                        </ul>
                    </div>
                </div>
                <div class="relative">
                    <button @click="toggleDropdown('model')"
                        class="flex items-center gap-[98px] px-4 border-r max-lg:gap-3">
                        <span>Model</span>
                        <img src="../../assets/images/icons/angle-down-black.svg" alt="icon">
                    </button>
                    <div v-if="dropdownOpen === 'model'"
                        class="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-10">
                        <ul>
                            <li class="px-4 py-2 hover:bg-gray-100 cursor-pointer">Porsche</li>
                            <li class="px-4 py-2 hover:bg-gray-100 cursor-pointer">Mercedes</li>
                            <li class="px-4 py-2 hover:bg-gray-100 cursor-pointer">BMW</li>
                        </ul>
                    </div>
                </div>
                <div class="relative">
                    <button @click="toggleDropdown('week')"
                        class="flex items-center gap-[98px] px-4 border-r max-lg:gap-3">
                        <span>This week</span>
                        <img src="../../assets/images/icons/angle-down-black.svg" alt="icon">
                    </button>
                    <div v-if="dropdownOpen === 'week'"
                        class="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-10">
                        <ul>
                            <li class="px-4 py-2 hover:bg-gray-100 cursor-pointer">This week</li>
                            <li class="px-4 py-2 hover:bg-gray-100 cursor-pointer">Last week</li>
                            <li class="px-4 py-2 hover:bg-gray-100 cursor-pointer">This month</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <!-- Desktop table  -->
        <div class="overflow-auto max-md:hidden">
            <table class="w-full text-left text-sm text-primary font-normal">
                <thead>
                    <tr>
                        <th class="px-[14px] py-2 flex items-center gap-[10px] font-normal">
                            <input type="checkbox" class="min-w-5 min-h-5 thick-black-checkbox" />
                            Model and name
                        </th>
                        <th class="px-[14px] py-2 font-normal">
                            <button>
                                Customer
                                <img class="inline ml-[10px] align-middle" src="~/assets/images/icons/filter-icon.svg"
                                    alt="">
                            </button>
                        </th>
                        <!-- Location column removed -->
                        <th class="px-[14px] py-2 font-normal">
                            <button>
                                User Offer
                                <img class="inline ml-[10px] align-middle" src="~/assets/images/icons/filter-icon.svg"
                                    alt="">
                            </button>
                        </th>
                        <!-- Car's MSRP column removed -->
                        <th class="px-[14px] py-2 font-normal">
                            <button>
                                User Comments
                                <img class="inline ml-[10px] align-middle" src="~/assets/images/icons/filter-icon.svg"
                                    alt="">
                            </button>
                        </th>
                        <!-- Selected Options column removed -->
                        <th class="px-[14px] py-2 font-normal">
                            <button>
                                Actions
                                <img class="inline ml-[10px] align-middle" src="~/assets/images/icons/filter-icon.svg"
                                    alt="">
                            </button>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(offer, index) in paginatedOffers" :key="index"
                        class="border-t-4 border-[#F7FAFF] bg-[#E8EEF9]">
                        <td class="px-[14px] py-2 rounded-l-[10px]">
                            <div class="flex items-center gap-[10px] ">
                                <input type="checkbox" class="min-w-5 min-h-5 thick-black-checkbox" />
                                <div class="flex items-center space-x-3">
                                    <img :src="offer.image" class="w-[71px] h-12 rounded object-cover" />
                                    <div>
                                        <div class="text-[13px] font-medium text-primary">{{ offer.model }}</div>
                                        <div class="text-[13px] font-medium text-primary opacity-50">{{ offer.price }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td class="px-[14px] py-2 whitespace-pre-line text-sm">
                            <div>Name: {{ offer.customer.name }}</div>
                            <div>Email: {{ offer.customer.email }}</div>
                            <div>Phone: {{ offer.customer.phone }}</div>
                            <div>Credit Score: {{ offer.customer.creditScore }}</div>
                        </td>
                        <!-- Location cell removed -->
                        <td class="px-[14px] py-2 text-sm font-medium">${{ offer.userOffer }}</td>
                        <!-- Car's MSRP cell removed -->
                        <td class="px-[14px] py-2 text-sm">{{ offer.comments }}</td>
                        <!-- Selected Options cell removed -->
                        <td class="px-[14px] py-2 rounded-r-[10px]">
                            <button>
                                <img src="../../assets/images/icons/download-icon.svg" alt="icon">
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <!-- Pagination Controls -->
        <div v-if="totalPages > 1" class="flex items-center justify-center gap-3 mt-4">

            <div class="flex items-center gap-5">
                <button :disabled="currentPage === 1" @click="goToPage(currentPage - 1)">
                    <img src="~/assets/images/icons/prev-icon.svg" alt="">
                </button>
                <button v-for="page in totalPages" :key="page"
                    class="px-2 py-1 w-8 h-8 rounded-full border text-[15px] font-semibold"
                    :class="{ 'bg-[#2C73DB] text-white': page === currentPage }" @click="goToPage(page)">
                    {{ page }}
                </button>
                <button :disabled="currentPage === totalPages" @click="goToPage(currentPage + 1)">
                    <img src="~/assets/images/icons/next-icon.svg" alt="">
                </button>
            </div>
            <button class="bg-[#E8EFFA] text-xs px-3 py-[9px] rounded-full flex items-center gap-2">
                {{ allOffers.length }} entries
                <img src="~/assets/images/icons/angle-down-black.svg" alt="">
            </button>
        </div>
    </div>
</template>

<script setup>

import vehicleImage from '~/assets/images/vehicle-1.png'
import vehicleImage2 from '~/assets/images/car2.png'
import vehicleImage3 from '~/assets/images/car3.png'
import { ref, computed } from 'vue'

const dropdownOpen = ref(null)
function toggleDropdown(type) {
    dropdownOpen.value = dropdownOpen.value === type ? null : type
}

// Optional: Close dropdown when clicking outside
if (typeof window !== 'undefined') {
    window.addEventListener('click', (e) => {
        const filterBar = document.querySelector('.bg-\[\#E8EFFA\]');
        if (dropdownOpen.value && filterBar && !filterBar.contains(e.target)) {
            dropdownOpen.value = null;
        }
    });
}

const pageSize = 6
const currentPage = ref(1)

const totalPages = computed(() => Math.ceil(allOffers.length / pageSize))

const paginatedOffers = computed(() => {
    const start = (currentPage.value - 1) * pageSize
    return allOffers.slice(start, start + pageSize)
})

function goToPage(page) {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page
    }
}
const allOffers = [
    {
        image: vehicleImage,
        model: 'Porsche Cayenne S Coupe',
        price: '$108,000.00',
        customer: {
            name: 'Cameron Groom',
            email: 'camerogroom@gmail.com',
            phone: '(+1) 555-0182',
            creditScore: 0,
        },
        location: '13th Street 47 ',
        userOffer: '109,000.00',
        msrp: '110,000.00',
        comments: 'Testing system (elias) communicate with clients. We need a clean ',
        selectedOptions: 'Motorsport Stripe Decal on Top in Black',
        status: 'Countered',
    },
     {
        image: vehicleImage2,
        model: 'Porsche Cayenne S Coupe',
        price: '$108,000.00',
        customer: {
            name: 'Cameron Groom',
            email: 'camerogroom@gmail.com',
            phone: '(+1) 555-0182',
            creditScore: 0,
        },
        location: '13th Street 47 ',
        userOffer: '109,000.00',
        msrp: '110,000.00',
        comments: 'Testing system (elias) communicate with clients. We need a clean ',
        selectedOptions: 'Motorsport Stripe Decal on Top in Black',
        status: 'Countered',
    },
     {
        image: vehicleImage3,
        model: 'Porsche Cayenne S Coupe',
        price: '$108,000.00',
        customer: {
            name: 'Cameron Groom',
            email: 'camerogroom@gmail.com',
            phone: '(+1) 555-0182',
            creditScore: 0,
        },
        location: '13th Street 47 ',
        userOffer: '109,000.00',
        msrp: '110,000.00',
        comments: 'Testing system (elias) communicate with clients. We need a clean ',
        selectedOptions: 'Motorsport Stripe Decal on Top in Black',
        status: 'Countered',
    },
       {
        image: vehicleImage,
        model: 'Porsche Cayenne S Coupe',
        price: '$108,000.00',
        customer: {
            name: 'Cameron Groom',
            email: 'camerogroom@gmail.com',
            phone: '(+1) 555-0182',
            creditScore: 0,
        },
        location: '13th Street 47 ',
        userOffer: '109,000.00',
        msrp: '110,000.00',
        comments: 'Testing system (elias) communicate with clients. We need a clean ',
        selectedOptions: 'Motorsport Stripe Decal on Top in Black',
        status: 'Countered',
    },
     {
        image: vehicleImage2,
        model: 'Porsche Cayenne S Coupe',
        price: '$108,000.00',
        customer: {
            name: 'Cameron Groom',
            email: 'camerogroom@gmail.com',
            phone: '(+1) 555-0182',
            creditScore: 0,
        },
        location: '13th Street 47 ',
        userOffer: '109,000.00',
        msrp: '110,000.00',
        comments: 'Testing system (elias) communicate with clients. We need a clean ',
        selectedOptions: 'Motorsport Stripe Decal on Top in Black',
        status: 'Countered',
    },
     {
        image: vehicleImage3,
        model: 'Porsche Cayenne S Coupe',
        price: '$108,000.00',
        customer: {
            name: 'Cameron Groom',
            email: 'camerogroom@gmail.com',
            phone: '(+1) 555-0182',
            creditScore: 0,
        },
        location: '13th Street 47 ',
        userOffer: '109,000.00',
        msrp: '110,000.00',
        comments: 'Testing system (elias) communicate with clients. We need a clean ',
        selectedOptions: 'Motorsport Stripe Decal on Top in Black',
        status: 'Countered',
    },
       {
        image: vehicleImage,
        model: 'Porsche Cayenne S Coupe',
        price: '$108,000.00',
        customer: {
            name: 'Cameron Groom',
            email: 'camerogroom@gmail.com',
            phone: '(+1) 555-0182',
            creditScore: 0,
        },
        location: '13th Street 47 ',
        userOffer: '109,000.00',
        msrp: '110,000.00',
        comments: 'Testing system (elias) communicate with clients. We need a clean ',
        selectedOptions: 'Motorsport Stripe Decal on Top in Black',
        status: 'Countered',
    },
     {
        image: vehicleImage2,
        model: 'Porsche Cayenne S Coupe',
        price: '$108,000.00',
        customer: {
            name: 'Cameron Groom',
            email: 'camerogroom@gmail.com',
            phone: '(+1) 555-0182',
            creditScore: 0,
        },
        location: '13th Street 47 ',
        userOffer: '109,000.00',
        msrp: '110,000.00',
        comments: 'Testing system (elias) communicate with clients. We need a clean ',
        selectedOptions: 'Motorsport Stripe Decal on Top in Black',
        status: 'Countered',
    },
     {
        image: vehicleImage3,
        model: 'Porsche Cayenne S Coupe',
        price: '$108,000.00',
        customer: {
            name: 'Cameron Groom',
            email: 'camerogroom@gmail.com',
            phone: '(+1) 555-0182',
            creditScore: 0,
        },
        location: '13th Street 47 ',
        userOffer: '109,000.00',
        msrp: '110,000.00',
        comments: 'Testing system (elias) communicate with clients. We need a clean ',
        selectedOptions: 'Motorsport Stripe Decal on Top in Black',
        status: 'Countered',
    },
       {
        image: vehicleImage,
        model: 'Porsche Cayenne S Coupe',
        price: '$108,000.00',
        customer: {
            name: 'Cameron Groom',
            email: 'camerogroom@gmail.com',
            phone: '(+1) 555-0182',
            creditScore: 0,
        },
        location: '13th Street 47 ',
        userOffer: '109,000.00',
        msrp: '110,000.00',
        comments: 'Testing system (elias) communicate with clients. We need a clean ',
        selectedOptions: 'Motorsport Stripe Decal on Top in Black',
        status: 'Countered',
    },
     {
        image: vehicleImage2,
        model: 'Porsche Cayenne S Coupe',
        price: '$108,000.00',
        customer: {
            name: 'Cameron Groom',
            email: 'camerogroom@gmail.com',
            phone: '(+1) 555-0182',
            creditScore: 0,
        },
        location: '13th Street 47 ',
        userOffer: '109,000.00',
        msrp: '110,000.00',
        comments: 'Testing system (elias) communicate with clients. We need a clean ',
        selectedOptions: 'Motorsport Stripe Decal on Top in Black',
        status: 'Countered',
    },
     {
        image: vehicleImage3,
        model: 'Porsche Cayenne S Coupe',
        price: '$108,000.00',
        customer: {
            name: 'Cameron Groom',
            email: 'camerogroom@gmail.com',
            phone: '(+1) 555-0182',
            creditScore: 0,
        },
        location: '13th Street 47 ',
        userOffer: '109,000.00',
        msrp: '110,000.00',
        comments: 'Testing system (elias) communicate with clients. We need a clean ',
        selectedOptions: 'Motorsport Stripe Decal on Top in Black',
        status: 'Countered',
    },
]

</script>

<style scoped>
.thick-black-checkbox {
    appearance: none;
    -webkit-appearance: none;
    width: 15px;
    height: 15px;
    border: 2px solid #081735;
    border-radius: 4px;
    background: #fff;
    cursor: pointer;
    position: relative;
    transition: border-color 0.2s;
    vertical-align: middle;
}

td, th {
    max-width: 220px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.thick-black-checkbox:checked {
    background-color: #fff;
    border: 2px solid #081735;
}

.thick-black-checkbox:checked::after {
    content: '';
    display: block;
    position: absolute;
    left: 3px;
    top: 0px;
    width: 5px;
    height: 10px;
    border: solid #081735;
    border-width: 0 3px 3px 0;
    transform: rotate(45deg);
}
</style>

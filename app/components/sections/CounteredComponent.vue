<template>

    <div class="p-7 max-sm:px-5">
        <!-- Small screen filter bar -->
        <ui-mobile-filter-bar title="Countered Offers" />

        <!-- Desktop filter bar -->
        <UiDesktopFilterBar title="Countered Offers" />

        <!-- Cards: Small screens only -->
        <div class="md:hidden flex flex-col gap-4">
            <div v-for="(offer, index) in paginatedOffers" :key="index" class="bg-[#E8EEF9] rounded-xl p-4 shadow">
                <!-- Top: image, model, price -->
                <div class="flex items-center gap-[10px] mb-[14px]">
                    <div class="flex items-center space-x-3 flex-1">
                        <img :src="offer.image" class="w-[71px] h-12 rounded object-cover" />
                        <div>
                            <div class="text-[13px] font-medium text-primary">{{ offer.model }}</div>
                            <div class="text-[13px] font-medium text-primary opacity-50">{{ offer.price }}</div>
                        </div>
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
                            <span class="text-[#081735] opacity-55">Credit Score:</span>
                            <span>{{ offer.customer.creditScore }}</span>
                        </div>
                        <div class="rounded-lg border-none bg-white p-2">
                            <div class="flex justify-between border-none p-2">
                                <span class="text-[#081735] opacity-55">User Offer:</span>
                                <span class="font-semibold">${{ offer.userOffer }}</span>
                            </div>
                            <span
                                class="w-full h-[2px] bg-gradient-to-r from-transparent via-primary/20 to-transparent block"></span>
                            <div class="flex justify-between border-none p-2">
                                <span class="text-[#081735] opacity-55">Counter Offer:</span>
                                <span class="font-semibold">${{ offer.counterOffer }}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Comments -->
                <div class="mt-[14px] mb-[14px]"><span class="font-medium text-[15px] text-primary"></span> {{
                    offer.comments
                    }}
                </div>
                <p class="font-medium text-primary opacity-55 mb-1 text-sm">Dealer Comments</p>
                <div class="mb-3"><span class="font-medium text-[15px] text-primary"></span> {{ offer.DealerComments }}
                </div>
            </div>
        </div>

        <!-- Desktop table -->
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
                        <th class="px-[14px] py-2 font-normal">
                            <button>
                                User Offer
                                <img class="inline ml-[10px] align-middle" src="~/assets/images/icons/filter-icon.svg"
                                    alt="">
                            </button>
                        </th>
                        <th class="px-[14px] py-2 font-normal">
                            <button>
                                Counter Offer
                                <img class="inline ml-[10px] align-middle" src="~/assets/images/icons/filter-icon.svg"
                                    alt="">
                            </button>
                        </th>
                        <th class="px-[14px] py-2 font-normal">
                            <button>
                                User Comments
                                <img class="inline ml-[10px] align-middle" src="~/assets/images/icons/filter-icon.svg"
                                    alt="">
                            </button>
                        </th>
                        <th class="px-[14px] py-2 font-normal">
                            <button>
                                Dealer Comments
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
                            <div>Credit Score: {{ offer.customer.creditScore }}</div>
                        </td>
                        <td class="px-[14px] py-2 text-sm font-medium">${{ offer.userOffer }}</td>
                        <td class="px-[14px] py-2 text-sm font-medium">${{ offer.counterOffer }}</td>
                        <td class="px-[14px] py-2 text-sm">{{ offer.comments }}</td>
                        <td class="px-[14px] py-2 text-sm">{{ offer.DealerComments }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Pagination Controls -->
        <UiPaginationBar :currentPage="currentPage" :totalPages="totalPages" :totalEntries="allOffers.length"
            @goToPage="goToPage" />
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

const pageSize = 10
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
            name: 'Cameron G.',
            creditScore: 0,
        },
        userOffer: '$109,000.00',
        counterOffer: '$114,000.00',
        comments: 'Testing system (elias) communicate with clients. We need a clean ',
        DealerComments: 'Reference site about car deal, giving information on its origins ',
        status: 'Countered',
    },
    {
        image: vehicleImage2,
        model: 'Porsche Cayenne S Coupe',
        price: '$108,000.00',
        customer: {
            name: 'Cameron G.',
            creditScore: 0,
        },
        userOffer: '$109,000.00',
        counterOffer: '$114,000.00',
        comments: 'Testing system (elias) communicate with clients. We need a clean ',
        DealerComments: 'Reference site about car deal, giving information on its origins ',
        status: 'Countered',
    },
    {
        image: vehicleImage3,
        model: 'Porsche Cayenne S Coupe',
        price: '$108,000.00',
        customer: {
            name: 'Cameron G.',
            creditScore: 0,
        },
        userOffer: '$109,000.00',
        counterOffer: '$114,000.00',
        comments: 'Testing system (elias) communicate with clients. We need a clean ',
        DealerComments: 'Reference site about car deal, giving information on its origins ',
        status: 'Countered',
    },
    {
        image: vehicleImage,
        model: 'Porsche Cayenne S Coupe',
        price: '$108,000.00',
        customer: {
            name: 'Cameron G.',
            creditScore: 0,
        },
        userOffer: '$109,000.00',
        counterOffer: '$114,000.00',
        comments: 'Testing system (elias) communicate with clients. We need a clean ',
        DealerComments: 'Reference site about car deal, giving information on its origins ',
        status: 'Countered',
    },
    {
        image: vehicleImage2,
        model: 'Porsche Cayenne S Coupe',
        price: '$108,000.00',
        customer: {
            name: 'Cameron G.',
            creditScore: 0,
        },
        userOffer: '$109,000.00',
        counterOffer: '$114,000.00',
        comments: 'Testing system (elias) communicate with clients. We need a clean ',
        DealerComments: 'Reference site about car deal, giving information on its origins ',
        status: 'Countered',
    },
    {
        image: vehicleImage3,
        model: 'Porsche Cayenne S Coupe',
        price: '$108,000.00',
        customer: {
            name: 'Cameron G.',
            creditScore: 0,
        },
        userOffer: '$109,000.00',
        counterOffer: '$114,000.00',
        comments: 'Testing system (elias) communicate with clients. We need a clean ',
        DealerComments: 'Reference site about car deal, giving information on its origins ',
        status: 'Countered',
    },
    {
        image: vehicleImage,
        model: 'Porsche Cayenne S Coupe',
        price: '$108,000.00',
        customer: {
            name: 'Cameron G.',
            creditScore: 0,
        },
        userOffer: '$109,000.00',
        counterOffer: '$114,000.00',
        comments: 'Testing system (elias) communicate with clients. We need a clean ',
        DealerComments: 'Reference site about car deal, giving information on its origins ',
        status: 'Countered',
    },
    {
        image: vehicleImage2,
        model: 'Porsche Cayenne S Coupe',
        price: '$108,000.00',
        customer: {
            name: 'Cameron G.',
            creditScore: 0,
        },
        userOffer: '$109,000.00',
        counterOffer: '$114,000.00',
        comments: 'Testing system (elias) communicate with clients. We need a clean ',
        DealerComments: 'Reference site about car deal, giving information on its origins ',
        status: 'Countered',
    },
    {
        image: vehicleImage3,
        model: 'Porsche Cayenne S Coupe',
        price: '$108,000.00',
        customer: {
            name: 'Cameron G.',
            creditScore: 0,
        },
        userOffer: '$109,000.00',
        counterOffer: '$114,000.00',
        comments: 'Testing system (elias) communicate with clients. We need a clean ',
        DealerComments: 'Reference site about car deal, giving information on its origins ',
        status: 'Countered',
    },
    {
        image: vehicleImage,
        model: 'Porsche Cayenne S Coupe',
        price: '$108,000.00',
        customer: {
            name: 'Cameron G.',
            creditScore: 0,
        },
        userOffer: '$109,000.00',
        counterOffer: '$114,000.00',
        comments: 'Testing system (elias) communicate with clients. We need a clean ',
        DealerComments: 'Reference site about car deal, giving information on its origins ',
        status: 'Countered',
    },
    {
        image: vehicleImage2,
        model: 'Porsche Cayenne S Coupe',
        price: '$108,000.00',
        customer: {
            name: 'Cameron G.',
            creditScore: 0,
        },
        userOffer: '$109,000.00',
        counterOffer: '$114,000.00',
        comments: 'Testing system (elias) communicate with clients. We need a clean ',
        DealerComments: 'Reference site about car deal, giving information on its origins ',
        status: 'Countered',
    },
    {
        image: vehicleImage3,
        model: 'Porsche Cayenne S Coupe',
        price: '$108,000.00',
        customer: {
            name: 'Cameron G.',
            creditScore: 0,
        },
        userOffer: '$109,000.00',
        counterOffer: '$114,000.00',
        comments: 'Testing system (elias) communicate with clients. We need a clean ',
        DealerComments: 'Reference site about car deal, giving information on its origins ',
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

.thick-black-checkbox:checked {
    background-color: #fff;
    border: 2px solid #081735;
}

.thick-black-checkbox:checked::after {
    content: '';
    display: block;
    position: absolute;
    left: 5px;
    top: 0px;
    width: 7px;
    height: 13px;
    border: solid #081735;
    border-width: 0 3px 3px 0;
    transform: rotate(45deg);
}

td,
th {
    max-width: 220px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

</style>

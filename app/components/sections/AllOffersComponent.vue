<template>
    <div class="p-7">
        <div class="flex items-center justify-between mb-10">
            <div class="flex items-center gap-[10px]">
                <h4 class="text-primary font-medium">All Offers</h4>
                <div class="relative">
                    <input type="search" class="bg-transparent p-3 pl-10 outline-none"  placeholder="Search by name, model, or amount...">
                    <img class="absolute left-2 top-1/2 -translate-y-1/2" src="../../assets/images/icons/search-icon.svg" alt="icon">
                </div>
            </div>
            <div class="bg-[#E8EFFA] rounded-full py-4 px-5 flex items-center justify-between">
                <span class="pr-4 border-r">Sort By</span>
                <button class="flex items-center gap-[98px] px-4 border-r">
                    <span>Status</span>
                    <img src="../../assets/images/icons/angle-down-black.svg" alt="icon">
                </button>
                <button class="flex items-center gap-[98px] px-4 border-r">
                    <span>Model</span>
                    <img src="../../assets/images/icons/angle-down-black.svg" alt="icon">
                </button>
                <button class="flex items-center gap-[98px] px-4 border-r">
                    <span>This week</span>
                    <img src="../../assets/images/icons/angle-down-black.svg" alt="icon">
                </button>
            </div>
        </div>
        <div class="overflow-auto ">
            <table class="w-full text-left text-sm text-primary font-normal">
                <thead>
                    <tr>
                        <th class="px-[14px] py-2 flex items-center gap-[10px] font-normal">
                            <input type="checkbox" class="w-5 h-5 thick-black-checkbox" />
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
                                Location
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
                                Car's MSRP
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
                                Selected Options
                                <img class="inline ml-[10px] align-middle" src="~/assets/images/icons/filter-icon.svg"
                                    alt="">
                            </button>
                        </th>
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
                                <input type="checkbox" class="w-5 h-5 thick-black-checkbox" />
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
                        <td class="px-[14px] py-2 text-sm">{{ offer.location }}</td>
                        <td class="px-[14px] py-2 text-sm font-medium">${{ offer.userOffer }}</td>
                        <td class="px-[14px] py-2 text-sm">${{ offer.msrp }}</td>
                        <td class="px-[14px] py-2 text-sm">{{ offer.comments }}</td>
                        <td class="px-[14px] py-2 text-sm">{{ offer.selectedOptions }}</td>
                        <td class="px-[14px] py-2 rounded-r-[10px]">
                            <div class="flex items-center gap-1">
                                <button
                                    class="relative w-[38px] h-10 border border-[#2C8436] rounded-lg flex items-center justify-center flex-none ">
                                    <img src="../../assets/images/icons/green-check.svg" alt="icon" class="w-5 h-5">
                                </button>
                                <button
                                    class="relative w-[38px] h-10 border border-[#D53660] rounded-lg flex items-center justify-center flex-none ">
                                    <img src="../../assets/images/icons/cross-icon.svg" alt="icon" class="w-5 h-5">
                                </button>
                                <button
                                    class="relative w-[38px] h-10 border border-[#2C73DB] rounded-lg flex items-center justify-center flex-none ">
                                    <img src="../../assets/images/icons/equal-icon.svg" alt="icon" class="w-5 h-5">
                                </button>
                            </div>
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
import { ref, computed } from 'vue'

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
        comments: 'testing system (elias) ',
        selectedOptions: 'Motorsport Stripe Decal on Top in Black',
        status: 'Accepted',
    },
    {
        image: vehicleImage,
        model: 'Mercedes-Benz z class',
        price: '$108,000.00',
        customer: {
            name: 'Cameron Groom',
            email: 'camerogroom@gmail.com',
            phone: '(+1) 555-0182',
            creditScore: 0,
        },
        location: 'Los Angeles, CA',
        userOffer: '109,000.00',
        msrp: '112,000.00',
        comments: 'testing system (elias)',
        selectedOptions: 'Motorsport Stripe Decal on Top in Black',
        status: 'Rejected',
    },
    {
        image: vehicleImage,
        model: 'Mercedes-Benz c class',
        price: '$108,000.00',
        customer: {
            name: 'Cameron Groom',
            email: 'camerogroom@gmail.com',
            phone: '(+1) 555-0182',
            creditScore: 0,
        },
        location: 'Chicago, IL',
        userOffer: '109,000.00',
        msrp: '111,000.00',
        comments: 'testing system (elias)',
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
        comments: 'testing system (elias) ',
        selectedOptions: 'Motorsport Stripe Decal on Top in Black',
        status: 'Accepted',
    },
    {
        image: vehicleImage,
        model: 'Mercedes-Benz z class',
        price: '$108,000.00',
        customer: {
            name: 'Cameron Groom',
            email: 'camerogroom@gmail.com',
            phone: '(+1) 555-0182',
            creditScore: 0,
        },
        location: 'Los Angeles, CA',
        userOffer: '109,000.00',
        msrp: '112,000.00',
        comments: 'testing system (elias)',
        selectedOptions: 'Motorsport Stripe Decal on Top in Black',
        status: 'Rejected',
    },
    {
        image: vehicleImage,
        model: 'Mercedes-Benz c class',
        price: '$108,000.00',
        customer: {
            name: 'Cameron Groom',
            email: 'camerogroom@gmail.com',
            phone: '(+1) 555-0182',
            creditScore: 0,
        },
        location: 'Chicago, IL',
        userOffer: '109,000.00',
        msrp: '111,000.00',
        comments: 'testing system (elias)',
        selectedOptions: 'Motorsport Stripe Decal on Top in Black',
        status: 'Countered',
    },
    {
        image: vehicleImage,
        model: 'Mercedes-Benz c class',
        price: '$108,000.00',
        customer: {
            name: 'Cameron Groom',
            email: 'camerogroom@gmail.com',
            phone: '(+1) 555-0182',
            creditScore: 0,
        },
        location: 'Chicago, IL',
        userOffer: '109,000.00',
        msrp: '111,000.00',
        comments: 'testing system (elias)',
        selectedOptions: 'Motorsport Stripe Decal on Top in Black',
        status: 'Countered',
    },
    {
        image: vehicleImage,
        model: 'Mercedes-Benz c class',
        price: '$108,000.00',
        customer: {
            name: 'Cameron Groom',
            email: 'camerogroom@gmail.com',
            phone: '(+1) 555-0182',
            creditScore: 0,
        },
        location: 'Chicago, IL',
        userOffer: '109,000.00',
        msrp: '111,000.00',
        comments: 'testing system (elias)',
        selectedOptions: 'Motorsport Stripe Decal on Top in Black',
        status: 'Countered',
    },
    {
        image: vehicleImage,
        model: 'Mercedes-Benz c class',
        price: '$108,000.00',
        customer: {
            name: 'Cameron Groom',
            email: 'camerogroom@gmail.com',
            phone: '(+1) 555-0182',
            creditScore: 0,
        },
        location: 'Chicago, IL',
        userOffer: '109,000.00',
        msrp: '111,000.00',
        comments: 'testing system (elias)',
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
        comments: 'testing system (elias) ',
        selectedOptions: 'Motorsport Stripe Decal on Top in Black',
        status: 'Accepted',
    },
    {
        image: vehicleImage,
        model: 'Mercedes-Benz z class',
        price: '$108,000.00',
        customer: {
            name: 'Cameron Groom',
            email: 'camerogroom@gmail.com',
            phone: '(+1) 555-0182',
            creditScore: 0,
        },
        location: 'Los Angeles, CA',
        userOffer: '109,000.00',
        msrp: '112,000.00',
        comments: 'testing system (elias)',
        selectedOptions: 'Motorsport Stripe Decal on Top in Black',
        status: 'Rejected',
    },
    {
        image: vehicleImage,
        model: 'Mercedes-Benz c class',
        price: '$108,000.00',
        customer: {
            name: 'Cameron Groom',
            email: 'camerogroom@gmail.com',
            phone: '(+1) 555-0182',
            creditScore: 0,
        },
        location: 'Chicago, IL',
        userOffer: '109,000.00',
        msrp: '111,000.00',
        comments: 'testing system (elias)',
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
        comments: 'testing system (elias) ',
        selectedOptions: 'Motorsport Stripe Decal on Top in Black',
        status: 'Accepted',
    },
    {
        image: vehicleImage,
        model: 'Mercedes-Benz z class',
        price: '$108,000.00',
        customer: {
            name: 'Cameron Groom',
            email: 'camerogroom@gmail.com',
            phone: '(+1) 555-0182',
            creditScore: 0,
        },
        location: 'Los Angeles, CA',
        userOffer: '109,000.00',
        msrp: '112,000.00',
        comments: 'testing system (elias)',
        selectedOptions: 'Motorsport Stripe Decal on Top in Black',
        status: 'Rejected',
    },
    {
        image: vehicleImage,
        model: 'Mercedes-Benz c class',
        price: '$108,000.00',
        customer: {
            name: 'Cameron Groom',
            email: 'camerogroom@gmail.com',
            phone: '(+1) 555-0182',
            creditScore: 0,
        },
        location: 'Chicago, IL',
        userOffer: '109,000.00',
        msrp: '111,000.00',
        comments: 'testing system (elias)',
        selectedOptions: 'Motorsport Stripe Decal on Top in Black',
        status: 'Countered',
    },
    {
        image: vehicleImage,
        model: 'Mercedes-Benz c class',
        price: '$108,000.00',
        customer: {
            name: 'Cameron Groom',
            email: 'camerogroom@gmail.com',
            phone: '(+1) 555-0182',
            creditScore: 0,
        },
        location: 'Chicago, IL',
        userOffer: '109,000.00',
        msrp: '111,000.00',
        comments: 'testing system (elias)',
        selectedOptions: 'Motorsport Stripe Decal on Top in Black',
        status: 'Countered',
    },
    {
        image: vehicleImage,
        model: 'Mercedes-Benz c class',
        price: '$108,000.00',
        customer: {
            name: 'Cameron Groom',
            email: 'camerogroom@gmail.com',
            phone: '(+1) 555-0182',
            creditScore: 0,
        },
        location: 'Chicago, IL',
        userOffer: '109,000.00',
        msrp: '111,000.00',
        comments: 'testing system (elias)',
        selectedOptions: 'Motorsport Stripe Decal on Top in Black',
        status: 'Countered',
    },
    {
        image: vehicleImage,
        model: 'Mercedes-Benz c class',
        price: '$108,000.00',
        customer: {
            name: 'Cameron Groom',
            email: 'camerogroom@gmail.com',
            phone: '(+1) 555-0182',
            creditScore: 0,
        },
        location: 'Chicago, IL',
        userOffer: '109,000.00',
        msrp: '111,000.00',
        comments: 'testing system (elias)',
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

td {
    max-width: 220px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    /* Remove any padding, margin, or background overrides here if present */
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

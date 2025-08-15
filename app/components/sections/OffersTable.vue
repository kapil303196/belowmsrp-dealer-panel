<template>
    <div class="p-7 max-sm:px-5">

        <!-- Filters: Large screens -->
        <div class="hidden md:flex justify-between items-center mb-8">
            <h4 class="text-primary font-medium">Offers</h4>
            <div class="flex space-x-[14px] bg-[#E8EEF9] rounded-full p-1">
                <button v-for="(tab, index) in tabs" :key="index"
                    :class="['px-[15px] py-[7px] rounded-full text-sm text-[#6B7397] flex items-center gap-1', activeTab === tab ? 'bg-white shadow text-primary font-medium' : 'text-gray-500']"
                    @click="activeTab = tab">
                    <img v-if="activeTab === tab" src="~/assets/images/icons/square-icon-check.svg" alt="">
                    {{ tab }}
                </button>
            </div>
            <div class="relative" ref="desktopDropdownRef">
                <button class="bg-[#E8EFFA] text-xs px-3 py-[9px] rounded-full flex items-center gap-2"
                    @click="toggleDropdown('desktop')">
                    {{ selectedFilter }}
                    <img src="~/assets/images/icons/angle-down-black.svg" alt="">
                </button>
                <div v-if="dropdownOpen === 'desktop'"
                    class="absolute right-0 mt-2 w-40 bg-[#F7FAFF] border rounded-lg shadow-lg z-10">
                    <ul>
                        <li v-for="option in filterOptions" :key="option" @click="selectFilter(option)"
                            class="px-4 py-2 hover:bg-gray-100 cursor-pointer">{{ option }}</li>
                    </ul>
                </div>
            </div>
        </div>

        <!-- Filters: Small screens -->
        <div class="mb-5 flex flex-col gap-5 md:hidden">
            <div class="flex justify-between items-center w-full">
                <h4 class="text-primary font-medium">Offers</h4>
                <div class="relative" ref="mobileDropdownRef">
                    <button class="bg-[#E8EFFA] text-xs px-3 py-[9px] rounded-full flex items-center gap-2"
                        @click="toggleDropdown('mobile')">
                        {{ selectedFilter }}
                        <img src="~/assets/images/icons/angle-down-black.svg" alt="">
                    </button>
                    <div v-if="dropdownOpen === 'mobile'"
                        class="absolute right-0 mt-2 w-40 bg-[#F7FAFF]  rounded-lg border  shadow-lg z-10">
                        <ul>
                            <li v-for="option in filterOptions" :key="option" @click="selectFilter(option)"
                                class="px-4 py-2 hover:bg-gray-100 cursor-pointer">{{ option }}</li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="flex items-center gap-0 bg-[#E8EEF9] rounded-full p-1 w-full overflow-x-auto whitespace-nowrap">
                <button v-for="(tab, index) in tabs" :key="index"
                    :class="['px-[15px] py-[7px] rounded-full text-sm text-[#6B7397] flex items-center justify-center gap-1 w-full min-w-28', activeTab === tab ? 'bg-white shadow text-primary font-medium' : 'text-gray-500']"
                    @click="activeTab = tab">
                    <img v-if="activeTab === tab" src="~/assets/images/icons/square-icon-check.svg" alt="">
                    {{ tab }}
                </button>
            </div>
        </div>

        <!-- Table: Large screens only -->
        <div class="overflow-auto hidden md:block">
            <table class="w-full text-left text-sm text-primary font-normal overflow-auto">
                <thead class="">
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
                                User Comments
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
                    <tr v-for="(offer, index) in offers" :key="index" class="border-t-4 border-[#F7FAFF] bg-[#E8EEF9]">
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
                        <td class="px-[14px] py-2 text-sm font-medium">${{ offer.userOffer }}</td>
                        <td class="px-[14px] py-2 text-sm">{{ offer.comments }}</td>
                        <td class="px-[14px] py-2 rounded-r-[10px]">
                            <button>
                                <img src="../../assets/images/icons/download-icon.svg" alt="icon">
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Cards: Small screens only -->
        <div class="md:hidden flex flex-col gap-4">
            <div v-for="(offer, index) in offers" :key="index" class="bg-[#E8EEF9] rounded-xl p-4 shadow">
                <!-- Top: image, model, price, action button -->
                <div class="flex items-center gap-[10px] mb-[14px]">
                    <div class="flex items-center space-x-3 flex-1">
                        <img :src="offer.image" class="w-[71px] h-12 rounded object-cover" />
                        <div>
                            <div class="text-[13px] font-medium text-primary">{{ offer.model }}</div>
                            <div class="text-[13px] font-medium text-primary opacity-50">{{ offer.price }}</div>
                        </div>
                    </div>
                    <button class="ml-auto flex-shrink-0">
                        <img src="../../assets/images/icons/download-icon.svg" alt="icon">
                    </button>
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
                <div class="mt-[14px]"><span class="font-medium text-[15px] text-primary"></span> {{
                    offer.comments }}</div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
const config = useRuntimeConfig()
const filterOptions = ['This Week', 'Last Week', 'This Month']
const selectedFilter = ref('This Week')
const dropdownOpen = ref(null)
const desktopDropdownRef = ref(null)
const mobileDropdownRef = ref(null)

function toggleDropdown(type) {
    dropdownOpen.value = dropdownOpen.value === type ? null : type
}
function selectFilter(option) {
    selectedFilter.value = option
    dropdownOpen.value = null
}

function handleClickOutside(e) {
    if (dropdownOpen.value === 'desktop' && desktopDropdownRef.value && !desktopDropdownRef.value.contains(e.target)) {
        dropdownOpen.value = null
    }
    if (dropdownOpen.value === 'mobile' && mobileDropdownRef.value && !mobileDropdownRef.value.contains(e.target)) {
        dropdownOpen.value = null
    }
}
onMounted(() => {
    window.addEventListener('click', handleClickOutside)
})
onBeforeUnmount(() => {
    window.removeEventListener('click', handleClickOutside)
})
import vehicleImage from '~/assets/images/vehicle-1.png'

const tabs = [
    'All Offers',
    'Accepted',
    'Rejected',
    'Countered',
];
const activeTab = ref('All Offers');

const allOffers = ref([])

onMounted(() => {
    getAllOffers('All Offers')
})

//on change of tab call api and convert data to our format
watch(activeTab, () => {
    getAllOffers(activeTab.value)
})

const { apiGet } = useApi()
const getAllOffers = async (tab) => {
    let response;
    let dealerId = JSON.parse(localStorage.getItem('auth')).user._id;
    switch (tab) {
        case 'All Offers':
            response = await apiGet('/bid/all-bid')
            console.log('response', response.data)
            allOffers.value = mapAllOffersApiData(response.data.slice(0, 10))
            break;
        case 'Accepted':
            response = await apiGet(`/bid/get-dealer-bid/accept/${dealerId}`)
            console.log('response', response.data)
            allOffers.value = mapApiData(response.data.slice(0, 10))
            break;
        case 'Rejected':
            response = await apiGet(`/bid/get-dealer-bid/reject/${dealerId}`)
            console.log('response', response.data)
            allOffers.value = mapApiData(response.data.slice(0, 10))
            break;
        case 'Countered':
            response = await apiGet(`/bid/get-dealer-bid/counter/${dealerId}`)
            console.log('response', response.data)
            allOffers.value = mapApiData(response.data.slice(0, 10))
            break;
    }
    console.log('allOffers converted', allOffers.value)
}

const mapApiData = (apiResponse) => {
    return apiResponse.map(item => ({
        image: item.bidId?.carImage || '',
        model: `${item.bidId?.carMaker || ''} ${item.bidId?.carName || ''}`.trim(),
        price: `$${Number(item.bidId?.carMsrp || 0).toLocaleString()}.00`,
        customer: {
            name: item.userId?.fullName || '',
            email: item.userId?.email || '',
            phone: '', // No phone in API, set blank or map if available
            creditScore: item.userId?.creditScore ?? 0
        },
        userOffer: Number(item.bidId?.carBid || 0).toLocaleString(),
        comments: item.bidId?.userComments || '',
        status: mapDealerActionToStatus(item.dealerAction)
    }));
}

const mapDealerActionToStatus = (dealerAction) => {
    switch (dealerAction) {
        case 'accept':
            return 'Accepted';
        case 'reject':
            return 'Rejected';
        case 'counter':
            return 'Countered';
        default:
            return 'All Offers';
    }
}

const mapAllOffersApiData = (apiResponse) => {
    console.log('apiResponse', apiResponse)
    return apiResponse.map(item => ({
        image: item.carImage || '',
        model: `${item.carMaker} ${item.carName}`,
        price: `$${Number(item.carMsrp).toLocaleString()}.00`,
        customer: {
            name: item.userName,
            email: item.userEmail,
            phone: '', // Backend doesn't provide phone in your example
            creditScore: item.userId?.creditScore ?? 0
        },
        userOffer: Number(item.carBid).toLocaleString(),
        comments: item.userComments || '',
        status: item.status || '' // Add if status exists in backend or set a default
    }));
}


const offers = computed(() => {
    if (activeTab.value === 'All Offers') return allOffers.value;
    return allOffers.value.filter(offer => offer.status === activeTab.value);
});
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

table,
td,
th {
    min-width: 120px;
}

@media screen and (max-width: 1023px) {

    table,
    td,
    th {
        min-width: 220px;
    }
}
</style>

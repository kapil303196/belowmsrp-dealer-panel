<template>
    <div class="p-7">

        <!-- Filters -->
        <div class="flex justify-between items-center mb-8">
            <h4 class="text-primary font-medium">Offers</h4>

            <div class="flex space-x-[14px] bg-[#E8EEF9] rounded-full p-1">
                <button v-for="(tab, index) in tabs" :key="index"
                    :class="['px-[15px] py-[7px] rounded-full text-sm text-[#6B7397] flex items-center gap-1', activeTab === tab ? 'bg-white shadow text-primary font-medium' : 'text-gray-500']"
                    @click="activeTab = tab">
                    <img v-if="activeTab === tab" src="~/assets/images/icons/square-icon-check.svg" alt="">
                    {{ tab }}
                </button>
            </div>

            <div class="relative">
                <button class="bg-[#E8EFFA] text-xs px-3 py-[9px] rounded-full flex items-center gap-2">
                    This Week
                    <img src="~/assets/images/icons/angle-down-black.svg" alt="">
                </button>
            </div>
        </div>

        <!-- Table -->
        <div class="overflow-auto ">
            <table class="w-full text-left text-sm text-primary font-normal">
                <thead class="">
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
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import vehicleImage from '~/assets/images/vehicle-1.png'

const tabs = [
  'All Offers',
  'Accepted',
  'Rejected',
  'Countered',
];
const activeTab = ref('All Offers');

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
    userOffer: '109,000.00',
    comments: 'Testing system (elias) communicate with clients. We need a clean',
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
    userOffer: '109,000.00',
    comments: 'Testing system (elias) communicate with clients. We need a clean',
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
    userOffer: '109,000.00',
    comments: 'Testing system (elias) communicate with clients. We need a clean',
    status: 'Countered',
  },
]

const offers = computed(() => {
  if (activeTab.value === 'All Offers') return allOffers;
  return allOffers.filter(offer => offer.status === activeTab.value);
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
    left: 3px;
    top: 0px;
    width: 5px;
    height: 10px;
    border: solid #081735;
    border-width: 0 3px 3px 0;
    transform: rotate(45deg);
}
</style>

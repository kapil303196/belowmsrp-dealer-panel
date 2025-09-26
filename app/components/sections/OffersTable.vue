<template>
  <div class="p-7 max-sm:px-5">
    <!-- Filters: Large screens -->
    <div class="hidden md:flex justify-between items-center mb-8">
      <h4 class="text-primary font-medium">Offers</h4>
      <div class="flex space-x-[14px] bg-[#E8EEF9] rounded-full p-1">
        <button
          v-for="(tab, index) in tabs"
          :key="index"
          :class="['px-[15px] py-[7px] rounded-full text-sm text-[#6B7397] flex items-center gap-1', activeTab === tab ? 'bg-white shadow text-primary font-medium' : 'text-gray-500']"
          @click="activeTab = tab"
        >
          <img v-if="activeTab === tab" src="~/assets/images/icons/square-icon-check.svg" alt="" />
          {{ tab }}
        </button>
      </div>
      <div class="relative" ref="desktopDropdownRef">
        <button class="bg-[#E8EFFA] text-xs px-3 py-[9px] rounded-full flex items-center gap-2" @click="toggleDropdown('desktop')">
          {{ selectedFilter }}
          <img src="~/assets/images/icons/angle-down-black.svg" alt="" />
        </button>
        <div v-if="dropdownOpen === 'desktop'" class="absolute right-0 mt-2 w-40 bg-[#F7FAFF] border rounded-lg shadow-lg z-10">
          <ul>
            <li v-for="option in filterOptions" :key="option" @click="selectFilter(option)" class="px-4 py-2 hover:bg-gray-100 cursor-pointer">{{ option }}</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Filters: Small screens -->
    <div class="mb-5 flex flex-col gap-5 md:hidden">
      <div class="flex justify-between items-center w-full">
        <h4 class="text-primary font-medium">Offers</h4>
        <div class="relative" ref="mobileDropdownRef">
          <button class="bg-[#E8EFFA] text-xs px-3 py-[9px] rounded-full flex items-center gap-2" @click="toggleDropdown('mobile')">
            {{ selectedFilter }}
            <img src="~/assets/images/icons/angle-down-black.svg" alt="" />
          </button>
          <div v-if="dropdownOpen === 'mobile'" class="absolute right-0 mt-2 w-40 bg-[#F7FAFF] rounded-lg border shadow-lg z-10">
            <ul>
              <li v-for="option in filterOptions" :key="option" @click="selectFilter(option)" class="px-4 py-2 hover:bg-gray-100 cursor-pointer">{{ option }}</li>
            </ul>
          </div>
        </div>
      </div>
      <div class="flex items-center gap-0 bg-[#E8EEF9] rounded-full p-1 w-full overflow-x-auto whitespace-nowrap">
        <button
          v-for="(tab, index) in tabs"
          :key="index"
          :class="[
            'px-[15px] py-[7px] rounded-full text-sm text-[#6B7397] flex items-center justify-center gap-1 w-full min-w-28',
            activeTab === tab ? 'bg-white shadow text-primary font-medium' : 'text-gray-500',
          ]"
          @click="activeTab = tab"
        >
          <img v-if="activeTab === tab" src="~/assets/images/icons/square-icon-check.svg" alt="" />
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
                <img class="inline ml-[10px] align-middle" src="~/assets/images/icons/filter-icon.svg" alt="" />
              </button>
            </th>
            <th class="px-[14px] py-2 font-normal">
              <button>
                User Offer
                <img class="inline ml-[10px] align-middle" src="~/assets/images/icons/filter-icon.svg" alt="" />
              </button>
            </th>
            <th class="px-[14px] py-2 font-normal">
              <button>
                User Comments
                <img class="inline ml-[10px] align-middle" src="~/assets/images/icons/filter-icon.svg" alt="" />
              </button>
            </th>
            <th class="px-[14px] py-2 font-normal">
              <button>
                Selected Options
                <img class="inline ml-[10px] align-middle" src="~/assets/images/icons/filter-icon.svg" alt="" />
              </button>
            </th>
            <th class="px-[14px] py-2 font-normal">
              <button>
                Actions
                <img class="inline ml-[10px] align-middle" src="~/assets/images/icons/filter-icon.svg" alt="" />
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(offer, index) in offers" :key="index" class="border-t-4 border-[#F7FAFF] bg-[#E8EEF9]">
            <td class="px-[14px] py-2 rounded-l-[10px]">
              <div class="flex items-center gap-[10px]">
                <input type="checkbox" class="min-w-5 min-h-5 thick-black-checkbox" />
                <div class="flex items-center space-x-3">
                  <img :src="offer.image" class="w-[71px] h-12 rounded object-cover" />
                  <div>
                    <div class="text-[13px] font-medium text-primary">{{ offer.model }}</div>
                    <div class="text-[13px] font-medium text-primary">{{ offer.price }}</div>
                  </div>
                </div>
              </div>
            </td>
            <td class="px-[14px] py-2 whitespace-pre-line text-sm">
              <div>Name: {{ offer.customer.name }}</div>
              <div>Credit Score: {{ offer.customer.creditScore }}</div>
            </td>
            <td class="px-[14px] py-2 text-sm font-medium">${{ offer.userOffer }}</td>
            <td class="px-[14px] py-2 text-sm">{{ offer.comments }}</td>
            <td class="px-[14px] py-2 text-sm">
              <div v-for="(option, index) in getSelectedOptionsArray(offer.selectedOptions)" :key="index" class="mb-1">
                {{ option }}
              </div>
            </td>
            <td class="px-[14px] py-2 rounded-r-[10px]">
              <div class="flex items-center gap-1">
                <button
                  @click="acceptBid(offer)"
                  :disabled="isAccepting(offer) || isRejecting(offer)"
                  class="relative w-[38px] h-10 border border-[#2C8436] rounded-lg flex items-center justify-center flex-none disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg v-if="isAccepting(offer)" class="animate-spin h-5 w-5 text-[#2C8436]" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                  <img v-else src="../../assets/images/icons/green-check.svg" alt="icon" class="w-5 h-5" />
                </button>
                <button @click="openCounterModal(offer)" class="relative w-[38px] h-10 border border-[#2C73DB] rounded-lg flex items-center justify-center flex-none">
                  <img src="../../assets/images/icons/equal-icon.svg" alt="icon" class="w-5 h-5" />
                </button>
                <button
                  @click="rejectBid(offer)"
                  :disabled="isAccepting(offer) || isRejecting(offer)"
                  class="relative w-[38px] h-10 border border-[#D53660] rounded-lg flex items-center justify-center flex-none disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg v-if="isRejecting(offer)" class="animate-spin h-5 w-5 text-[#D53660]" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                  <img v-else src="../../assets/images/icons/cross-icon.svg" alt="icon" class="w-5 h-5" />
                </button>
                <button @click="previewPdf(offer)" class="relative w-[38px] h-10 border border-[#2C73DB] rounded-lg flex items-center justify-center flex-none" title="Preview PDF">
                  <svg v-if="isDownloading(offer)" class="animate-spin h-5 w-5 text-primary" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                  <img v-else src="../../assets/images/icons/download-icon.svg" alt="icon" class="w-5 h-5" />
                </button>
              </div>
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
              <div class="text-[13px] font-medium text-primary">{{ offer.price }}</div>
            </div>
          </div>
          <button class="ml-auto flex-shrink-0 w-[38px] h-10 border border-[#2C73DB] rounded-lg flex items-center justify-center" @click="previewPdf(offer)">
            <svg v-if="isDownloading(offer)" class="animate-spin h-5 w-5 text-primary" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
            </svg>
            <img v-else src="../../assets/images/icons/download-icon.svg" alt="icon" class="w-5 h-5" />
          </button>
        </div>
        <!-- Customer details -->
        <div class="text-sm text-primary mb-2 font-medium text-[15px]">
          <p class="text-sm text-primary pb-2 font-medium">Customer</p>
          <span class="w-full h-[2px] bg-gradient-to-r from-transparent via-primary/20 to-transparent block"></span>
          <div class="flex flex-col gap-0.5">
            <div class="flex justify-between py-[6px]">
              <span class="text-[#081735] opacity-55">Name:</span>
              <span>{{ offer.customer.name }}</span>
            </div>
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
        <!-- Selected Options -->
        <div class="text-sm text-primary mb-2 font-medium text-[15px]">
          <p class="text-sm text-primary pb-2 font-medium">Selected Options</p>
          <span class="w-full h-[2px] bg-gradient-to-r from-transparent via-primary/20 to-transparent block"></span>
          <div class="flex flex-col gap-0.5">
            <div v-for="(option, index) in getSelectedOptionsArray(offer.selectedOptions)" :key="index" class="py-[6px]">
              <span class="text-[#081735] opacity-75">{{ option }}</span>
            </div>
          </div>
        </div>
        <!-- Comment -->
        <div class="mt-[14px]"><span class="font-medium text-[15px] text-primary"></span> {{ offer.comments }}</div>
        <!-- Action buttons at bottom -->
        <div class="flex items-center gap-2 center mt-[14px]">
          <button
            @click="acceptBid(offer)"
            :disabled="isAccepting(offer) || isRejecting(offer)"
            class="w-full h-10 border border-[#2C8436] rounded-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg v-if="isAccepting(offer)" class="animate-spin h-5 w-5 text-[#2C8436]" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
            </svg>
            <img v-else src="../../assets/images/icons/green-check.svg" alt="icon" class="w-5 h-5" />
          </button>
          <button @click="openCounterModal(offer)" class="w-full h-10 border border-[#2C73DB] rounded-lg flex items-center justify-center">
            <img src="../../assets/images/icons/equal-icon.svg" alt="icon" class="w-5 h-5" />
          </button>
          <button
            @click="rejectBid(offer)"
            :disabled="isAccepting(offer) || isRejecting(offer)"
            class="w-full h-10 border border-[#D53660] rounded-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg v-if="isRejecting(offer)" class="animate-spin h-5 w-5 text-[#D53660]" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
            </svg>
            <img v-else src="../../assets/images/icons/cross-icon.svg" alt="icon" class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
    <!-- Counter Modal -->
    <div v-if="showCounter" class="fixed inset-0 z-[100] flex items-center justify-center">
      <div class="absolute inset-0 bg-black/30" @click="closeCounter"></div>
      <div class="relative bg-white rounded-2xl shadow-xl w-full max-w-xl mx-4 p-6">
        <div class="flex items-start justify-between mb-4">
          <h3 class="text-xl font-semibold text-primary">Counter User Offer</h3>
          <button class="text-primary/60 hover:text-primary" @click="closeCounter">✕</button>
        </div>
        <form @submit.prevent="submitCounter">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-primary mb-1">Counter Bid *</label>
              <input
                v-model="form.counterBid"
                type="number"
                min="0"
                required
                placeholder="Enter Counter bid"
                class="w-full h-12 px-3 rounded-lg border border-[#DBE4F2] focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
             <div>
              <label class="block text-sm font-medium text-primary mb-1">Dealer's MSRP</label>
              <input
                v-model="form.dealerMsrp"
                type="number"
                min="0"
                placeholder="Enter Dealer's MSRP"
                class="w-full h-12 px-3 rounded-lg border border-[#DBE4F2] focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-primary mb-1">Attachment (optional)</label>
              <div class="w-full h-12 rounded-lg border border-[#DBE4F2] flex items-center px-2">
                <button type="button" @click="fileInput && fileInput.click()" class="px-4 py-2 rounded-md bg-secondary text-white text-sm h-9">Choose File</button>
                <span class="ml-3 text-primary/80 truncate">{{ fileName || "No file chosen" }}</span>
              </div>
              <input ref="fileInputRef" @change="onFileChange" type="file" accept="*/*" class="hidden" />
            </div>
            <div>
              <label class="block text-sm font-medium text-primary mb-1">Comments</label>
              <textarea
                v-model="form.dealerComments"
                rows="4"
                placeholder="Enter Your Comments here"
                class="w-full px-3 py-2 rounded-lg border border-[#DBE4F2] focus:outline-none focus:ring-2 focus:ring-primary/40"
              ></textarea>
            </div>
          </div>
          <div class="mt-6 flex justify-end">
            <ui-base-button :disabled="isSubmitting" variant="secondary">
              <span v-if="isSubmitting" class="inline-flex items-center">
                <svg class="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
                Submitting...
              </span>
              <span v-else>Submit</span>
            </ui-base-button>
          </div>
        </form>
      </div>
    </div>

    <!-- Attachment Preview Modal -->
    <div v-if="showPreviewModal" class="fixed inset-0 z-[100] flex items-center justify-center">
      <div class="absolute inset-0 bg-black/50" @click="closePreview"></div>
      <div class="relative bg-white rounded-2xl shadow-xl w-full max-w-4xl mx-4 p-4 h-[80vh] flex flex-col">
        <div class="flex items-center justify-between mb-2">
          <h3 class="text-lg font-semibold text-primary">Attachment Preview</h3>
          <button class="text-primary/60 hover:text-primary" @click="closePreview">✕</button>
        </div>
        <div class="flex-1 overflow-hidden rounded-md border border-[#E5EAF3] bg-[#F8FAFF]">
          <img v-if="previewType.startsWith('image/')" :src="previewUrl" alt="attachment" class="w-full h-full object-contain" />
          <iframe v-else :src="previewUrl" class="w-full h-full" />
        </div>
        <div class="mt-3 flex justify-end gap-2">
          <button class="px-3 py-2 rounded-md bg-primary text-white text-sm" @click="closePreview">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
import { normalizeId } from "~/composables/useNormalizeId";
const config = useRuntimeConfig();
const filterOptions = ["This Week", "Last Week", "This Month"];
const selectedFilter = ref("This Week");
const dropdownOpen = ref(null);
const desktopDropdownRef = ref(null);
const mobileDropdownRef = ref(null);

function toggleDropdown(type) {
  dropdownOpen.value = dropdownOpen.value === type ? null : type;
}
function selectFilter(option) {
  selectedFilter.value = option;
  dropdownOpen.value = null;
}

function handleClickOutside(e) {
  if (dropdownOpen.value === "desktop" && desktopDropdownRef.value && !desktopDropdownRef.value.contains(e.target)) {
    dropdownOpen.value = null;
  }
  if (dropdownOpen.value === "mobile" && mobileDropdownRef.value && !mobileDropdownRef.value.contains(e.target)) {
    dropdownOpen.value = null;
  }
}
onMounted(() => {
  window.addEventListener("click", handleClickOutside);
});
onBeforeUnmount(() => {
  window.removeEventListener("click", handleClickOutside);
});
import vehicleImage from "~/assets/images/vehicle-1.png";

const tabs = ["All Offers", "Accepted", "Rejected", "Countered"];
const activeTab = ref("All Offers");

const allOffers = ref([]);

onMounted(() => {
  getAllOffers("All Offers");
});

//on change of tab call api and convert data to our format
watch(activeTab, () => {
  getAllOffers(activeTab.value);
});

const { apiGet, apiGetBlob, apiPost, apiPostForm } = useApi();
const { getMultipleUserCreditScores } = useCreditScore();
const getAllOffers = async (tab) => {
  let response;
  let dealerId = JSON.parse(localStorage.getItem("auth")).user._id;
  switch (tab) {
    case "All Offers":
      response = await apiGet("/bid/all-bid");
      allOffers.value = await mapAllOffersApiData(response.data.slice(0, 100));
      break;
    case "Accepted":
      response = await apiGet(`/bid/get-dealer-bid/accept/${dealerId}`);
      allOffers.value = await mapApiData(response.data.slice(0, 100));
      break;
    case "Rejected":
      response = await apiGet(`/bid/get-dealer-bid/reject/${dealerId}`);
      allOffers.value = await mapApiData(response.data.slice(0, 100));
      break;
    case "Countered":
      response = await apiGet(`/bid/get-dealer-bid/counter/${dealerId}`);
      allOffers.value = await mapCounteredNewApiData(response.data.slice(0, 100));
      break;
  }
};

const mapApiData = async (apiResponse) => {
  // Extract user IDs for credit score lookup
  const userIds = apiResponse
    .map((item) => (item.customerDetails?.userId ? normalizeId(item.customerDetails.userId) : null))
    .filter((id) => id)
    .map((id) => String(id));

  // Fetch credit scores for all users
  let creditScores = {};
  if (userIds.length > 0) {
    try {
      creditScores = await getMultipleUserCreditScores(userIds);
    } catch (error) {
      console.error("Error fetching credit scores:", error);
    }
  }

  return apiResponse.map((item) => {
    // Get the first user offer from negotiation history to extract bid details
    const userOffer = item.negotiationHistory?.find((h) => h.type === "user_offer");
    const bidId = userOffer?.bidId ? normalizeId(userOffer.bidId) : null;

    // Extract userId properly - handle both string and object formats
    const userId = item.customerDetails?.userId ? normalizeId(item.customerDetails.userId) : null;

    const userCreditScore = creditScores[userId] || { hasCreditScore: false, creditScoreTier: null };

    return {
      bidId: bidId || item.id,
      image: item.image || "",
      model: item.carname || "",
      price: `$${Number(item.msrp || 0).toLocaleString()}.00`,
      customer: {
        name:
          item.customerDetails?.firstName && item.customerDetails?.lastName ? `${item.customerDetails.firstName} ${item.customerDetails.lastName}` : item.customerDetails?.email || "Unknown Customer",
        email: item.customerDetails?.email || "",
        phone: item.customerDetails?.phoneNumber || "",
        creditScore: userCreditScore.hasCreditScore ? userCreditScore.creditScoreTier : "Not Available",
      },
      userOffer: Number(item.latestUserOffer || 0).toLocaleString(),
      comments: item.latestUserComments || "",
      status: item.status || mapDealerActionToStatus(item.dealerAction),
      userId: userId || "",
      dealerId: JSON.parse(localStorage.getItem("auth") || "{}")?.user?._id || "",
      carId: item.id || "",
      selectedOptions: (() => {
        return getSelectedOptionsText(item.userVariants || []);
      })(),
    };
  });
};

function findLatestUserBidId(history = []) {
  const sorted = [...history].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  const lastUserOffer = [...sorted].reverse().find((e) => e.type === "user_offer" && e.bidId);
  return lastUserOffer?.bidId || "";
}

const mapCounteredNewApiData = async (apiResponse) => {
  const dealerId = JSON.parse(localStorage.getItem("auth") || "{}")?.user?._id || "";

  // Extract user IDs for credit score lookup
  const userIds = (apiResponse || [])
    .map((item) => (item.customerDetails?.userId ? normalizeId(item.customerDetails.userId) : null))
    .filter((id) => id)
    .map((id) => String(id));

  // Fetch credit scores for all users
  let creditScores = {};
  if (userIds.length > 0) {
    try {
      creditScores = await getMultipleUserCreditScores(userIds);
    } catch (error) {
      console.error("Error fetching credit scores:", error);
    }
  }

  return (apiResponse || []).map((item) => {
    const bidId = findLatestUserBidId(item.negotiationHistory);
    const customerFirst = item.customerDetails?.firstName || "";
    const customerLast = item.customerDetails?.lastName || "";
    const displayName = customerFirst || customerLast ? `${customerFirst} ${customerLast}`.trim() : item.customerDetails?.email || "";

    // Extract userId properly - handle both string and object formats
    const userId = item.customerDetails?.userId ? normalizeId(item.customerDetails.userId) : null;

    const userCreditScore = creditScores[userId] || { hasCreditScore: false, creditScoreTier: null };

    return {
      bidId,
      image: item.image || "",
      model: item.carname || "",
      price: `$${Number(item.msrp || 0).toLocaleString()}.00`,
      customer: {
        name: displayName,
        email: item.customerDetails?.email || "",
        phone: item.customerDetails?.phoneNumber || "",
        creditScore: userCreditScore.hasCreditScore ? userCreditScore.creditScoreTier : "Not Available",
      },
      userOffer: Number(item.latestUserOffer || 0).toLocaleString(),
      comments: item.latestUserComments || "",
      status: "Countered",
      userId: userId || "",
      dealerId,
      carId: item.id || "",
      selectedOptions: getSelectedOptionsText(item.userVariants || []),
    };
  });
};

const mapDealerActionToStatus = (dealerAction) => {
  switch (dealerAction) {
    case "accept":
      return "Accepted";
    case "reject":
      return "Rejected";
    case "counter":
      return "Countered";
    default:
      return "All Offers";
  }
};

const getSelectedOptionsText = (variants) => {
  if (!variants || !Array.isArray(variants) || variants.length === 0) {
    return "No options selected";
  }

  // If variants are just IDs (strings), return a generic message
  if (variants.length > 0 && typeof variants[0] === "string") {
    return `${variants.length} option(s) selected`;
  }

  // If variants are objects with details, format them properly
  const result = variants
    .map((variant) => {
      const price = variant.price && parseFloat(variant.price) > 0 ? ` (+$${parseFloat(variant.price).toLocaleString()})` : " (Included)";
      return `${variant.typeSubCategory || variant.mainCategory || variant.subCategory || "Unknown Option"}${price}`;
    })
    .join(", ");
  return result;
};

// Helper function to convert selected options string to array for better display
const getSelectedOptionsArray = (selectedOptionsText) => {
  if (!selectedOptionsText || selectedOptionsText === "No options selected") {
    return ["No options selected"];
  }

  // Split by comma and clean up each option
  return selectedOptionsText
    .split(",")
    .map((option) => option.trim())
    .filter((option) => option.length > 0);
};

const mapAllOffersApiData = async (apiResponse) => {
  // Extract user IDs for credit score lookup
  const userIds = apiResponse
    .map((item) => (item.userId ? normalizeId(item.userId) : null))
    .filter((id) => id)
    .map((id) => String(id));

  // Fetch credit scores for all users
  let creditScores = {};
  if (userIds.length > 0) {
    try {
      creditScores = await getMultipleUserCreditScores(userIds);
    } catch (error) {
      console.error("Error fetching credit scores:", error);
    }
  }

  return apiResponse.map((item) => {
    // This endpoint returns userbids with different field names
    // Use _id as bidId since this is the userbid ID
    const bidId = item._id ? String(item._id) : null;

    // Extract userId properly - handle both string and object formats
    const userId = normalizeId(item.userId) || null;

    const userCreditScore = creditScores[userId] || { hasCreditScore: false, creditScoreTier: null };

    return {
      bidId: bidId,
      image: item.carImage || "",
      model: item.carName || "",
      price: `$${Number(item.carMsrp || 0).toLocaleString()}.00`,
      customer: {
        name: item.userName || "Unknown Customer",
        email: item.userEmail || "",
        phone: "",
        creditScore: userCreditScore.hasCreditScore ? userCreditScore.creditScoreTier : "Not Available",
      },
      userOffer: Number(item.carBid || 0).toLocaleString(),
      comments: item.userComments || "",
      status: "All Offers",
      userId: userId || "",
      dealerId: JSON.parse(localStorage.getItem("auth") || "{}")?.user?._id || "",
      carId: (() => {
        if (!item.carId) return "";
        if (typeof item.carId === "string") return item.carId;
        if (typeof item.carId === "object" && item.carId._id) return String(item.carId._id);
        return String(item.carId);
      })(),
      selectedOptions: getSelectedOptionsText(item.variants || []),
    };
  });
};

const offers = computed(() => {
  if (activeTab.value === "All Offers") return allOffers.value;
  return allOffers.value.filter((offer) => offer.status === activeTab.value);
});

// PDF download
const downloadingIds = ref(new Set());
const isDownloading = (offer) => downloadingIds.value.has(offer.bidId);
const showPreviewModal = ref(false);
const previewUrl = ref("");
const previewType = ref("");
const previewPdf = async (offer) => {
  try {
    const bidId = offer.bidId || offer._id || offer.id;
    if (!bidId) {
      console.error("No bidId found for offer:", offer);
      alert("Cannot preview PDF: No valid bid ID found for this offer.");
      return;
    }
    downloadingIds.value.add(bidId);
    const blob = await apiGetBlob(`/bid/user-bid/${bidId}/pdf`);
    previewType.value = "application/pdf";
    previewUrl.value = window.URL.createObjectURL(blob);
    showPreviewModal.value = true;
  } catch (e) {
    console.error("Failed to preview PDF", e);
    alert("Failed to preview PDF. Please try again.");
  } finally {
    const bidId = offer.bidId || offer._id;
    downloadingIds.value.delete(bidId);
  }
};

function closePreview() {
  try {
    if (previewUrl.value) window.URL.revokeObjectURL(previewUrl.value);
  } catch (_) {}
  previewUrl.value = "";
  previewType.value = "";
  showPreviewModal.value = false;
}

// Accept / Reject
const acceptingIds = ref(new Set());
const rejectingIds = ref(new Set());
const isAccepting = (offer) => acceptingIds.value.has(offer.bidId);
const isRejecting = (offer) => rejectingIds.value.has(offer.bidId);

const acceptBid = async (offer) => {
  try {
    if (!offer?.userId || !offer?.carId || !offer?.bidId) {
      await Swal.fire("Missing data", "Cannot accept: required identifiers are missing.", "warning");
      return;
    }
    acceptingIds.value.add(offer.bidId);
    const carIdRaw = offer.carId;
    const bidIdRaw = offer.bidId;
    const payload = {
      userId: offer.userId,
      dealerId: offer.dealerId,
      carId: normalizeId(carIdRaw),
      bidId: normalizeId(bidIdRaw),
      dealerAction: "accept",
    };
    await apiPost("/bid/dealer-bid-action", payload);
    await getAllOffers(activeTab.value);
  } catch (error) {
    console.error("Error accepting bid:", error);
  } finally {
    acceptingIds.value.delete(offer.bidId);
  }
};

const rejectBid = async (offer) => {
  try {
    if (!offer?.userId || !offer?.carId || !offer?.bidId) {
      await Swal.fire("Missing data", "Cannot reject: required identifiers are missing.", "warning");
      return;
    }
    rejectingIds.value.add(offer.bidId);
    const carIdRaw = offer.carId;
    const bidIdRaw = offer.bidId;
    const payload = {
      userId: offer.userId,
      dealerId: offer.dealerId,
      carId: normalizeId(carIdRaw),
      bidId: normalizeId(bidIdRaw),
      dealerAction: "reject",
    };
    await apiPost("/bid/dealer-bid-action", payload);
    await getAllOffers(activeTab.value);
  } catch (error) {
    console.error("Error rejecting bid:", error);
  } finally {
    rejectingIds.value.delete(offer.bidId);
  }
};

// Counter modal state and submit
const showCounter = ref(false);
const isSubmitting = ref(false);
const currentOffer = ref(null);
const form = ref({ counterBid: "",dealerMsrp:"", dealerComments: "", file: null });
const fileName = ref("");
const fileInputRef = ref(null);
const fileInput = computed(() => fileInputRef.value);

function openCounterModal(offer) {
  currentOffer.value = offer;
  form.value = { counterBid: "",dealerMsrp:"", dealerComments: "", file: null };
  showCounter.value = true;
}
function closeCounter() {
  if (isSubmitting.value) return;
  showCounter.value = false;
}
function onFileChange(e) {
  const files = e.target.files;
  form.value.file = files && files.length ? files[0] : null;
  fileName.value = form.value.file ? form.value.file.name : "";
}

const submitCounter = async () => {
  if (!currentOffer.value) return;
  try {
    isSubmitting.value = true;
    const auth = JSON.parse(localStorage.getItem("auth") || "{}");
    const userId = currentOffer.value.userId;
    const dealerId = currentOffer.value.dealerId;
    const carIdRaw = currentOffer.value.carId;
    const carId = typeof carIdRaw === "object" && carIdRaw?._id ? carIdRaw._id : carIdRaw;
    const bidIdRaw = currentOffer.value.bidId;
    const bidId = typeof bidIdRaw === "object" && bidIdRaw?._id ? bidIdRaw._id : bidIdRaw;
    if (!userId || !carId || !bidId) {
      await Swal.fire("Missing data", "Cannot counter: required identifiers are missing.", "warning");
      isSubmitting.value = false;
      return;
    }
    const dealerEmail = auth?.user?.email || "";
    const dealerName = auth?.user?.name || auth?.user?.fullName || "Dealer";
    const userDetails = auth?.user ? JSON.stringify(auth.user) : "{}";

    const fd = new FormData();
    fd.append("userId", userId);
    fd.append("userEmail", currentOffer.value.customer?.email || "");
    fd.append("dealerId", dealerId);
    fd.append("dealerName", dealerName);
    fd.append("dealerEmail", dealerEmail);
    fd.append("carId", carId);
    fd.append("bidId", bidId);
    fd.append("dealerAction", "counter");
    fd.append("counterBid", String(form.value.counterBid || ""));
    fd.append("dealerMsrp", String(form.value.dealerMsrp || ""));
    fd.append("dealerComments", form.value.dealerComments || "");
    fd.append("userDetails", userDetails);
    fd.append("options", "[]");
    if (form.value.file) {
      fd.append("file0", form.value.file);
    }

    await apiPostForm("/bid/dealer-bid-counter", fd);
    await getAllOffers(activeTab.value);
    showCounter.value = false;
  } catch (error) {
    console.error("Error submitting counter bid:", error);
  } finally {
    isSubmitting.value = false;
  }
};
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
  content: "";
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

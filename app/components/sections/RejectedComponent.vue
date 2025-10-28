<template>
  <div class="p-7 max-sm:px-4">
    <!-- Small screen filter bar -->
    <ui-mobile-filter-bar title="Rejected Offers" v-model:search="searchText" v-model:model="selectedModel" />

    <!-- Desktop filter bar -->
    <UiDesktopFilterBar title="Rejected Offers" v-model:search="searchText" v-model:model="selectedModel" />

    <!-- Loading state -->
    <div v-if="isLoading" class="flex items-center justify-center py-10 text-primary/70">
      <svg class="animate-spin h-6 w-6" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
      </svg>
      <span class="ml-2">Loading...</span>
    </div>

    <!-- Empty state -->
    <div v-if="!isLoading && paginatedOffers.length === 0" class="flex items-center justify-center py-10 text-primary/60">No offers to display.</div>

    <!-- Cards: Small screens only -->
    <div class="md:hidden flex flex-col gap-4">
      <div v-for="(offer, index) in paginatedOffers" :key="index" class="bg-[#E8EEF9] rounded-xl p-4 shadow">
        <!-- Top: image, model, price -->
        <div class="flex items-center gap-[10px] mb-[14px]">
          <div class="flex items-center space-x-3 flex-1">
            <img :src="offer.image" class="w-[71px] h-12 rounded object-cover" />
            <div>
              <div class="text-[13px] font-medium text-primary">{{ offer.model }}</div>
              <div class="text-[13px] font-medium text-primary">{{ offer.price }}</div>
            </div>
          </div>
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
            <span class="w-full h-[2px] bg-gradient-to-r from-transparent via-primary/20 to-transparent block"></span>
            <div class="flex justify-between py-[6px]">
              <span class="text-[#081735] opacity-55">Credit Score:</span>
              <span>{{ offer.customer.creditScore }}</span>
            </div>
            <div class="flex justify-between rounded-lg border-none bg-white p-2 mt-1">
              <span class="text-[#081735] opacity-55">User Offer:</span>
              <span class="font-semibold">${{ offer.userOffer }}</span>
            </div>
          </div>
        </div>
        <!-- Comment -->
        <div class="mt-[14px] mb-3"><span class="font-medium text-[15px] text-primary"></span> {{ offer.comments }}</div>
      </div>
    </div>

    <!-- Desktop table  -->
    <div v-if="!isLoading && paginatedOffers.length" class="overflow-auto max-md:hidden">
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
                <img class="inline ml-[10px] align-middle" src="~/assets/images/icons/filter-icon.svg" alt="" />
              </button>
            </th>
            <!-- Location column removed -->
            <th class="px-[14px] py-2 font-normal">
              <button>
                User Offer
                <img class="inline ml-[10px] align-middle" src="~/assets/images/icons/filter-icon.svg" alt="" />
              </button>
            </th>
            <!-- Your Build MSRP column removed -->
            <th class="px-[14px] py-2 font-normal">
              <button>
                User Comments
                <img class="inline ml-[10px] align-middle" src="~/assets/images/icons/filter-icon.svg" alt="" />
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(offer, index) in paginatedOffers" :key="index" class="border-t-4 border-[#F7FAFF] bg-[#E8EEF9]">
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
            <!-- Location cell removed -->
            <td class="px-[14px] py-2 text-sm font-medium">${{ offer.userOffer }}</td>
            <!-- Your Build MSRP cell removed -->
            <td class="px-[14px] py-2 text-sm">{{ offer.comments }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- Pagination Controls -->
    <UiPaginationBar v-if="!isLoading && serverTotalPages > 0" :currentPage="currentPage" :totalPages="serverTotalPages" :totalEntries="totalEntries" @goToPage="goToPage" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, onBeforeUnmount } from "vue";
import { normalizeId } from "~/composables/useNormalizeId";

const dropdownOpen = ref(null);
function toggleDropdown(type) {
  dropdownOpen.value = dropdownOpen.value === type ? null : type;
}

// Optional: Close dropdown when clicking outside
if (typeof window !== "undefined") {
  window.addEventListener("click", (e) => {
    const filterBar = document.querySelector(".bg-\\[\\#E8EFFA\\]");
    if (dropdownOpen.value && filterBar && !filterBar.contains(e.target)) {
      dropdownOpen.value = null;
    }
  });
}

const serverPageSize = ref(20);
const currentPage = ref(1);
const allOffers = ref([]);
const searchText = ref("");
const selectedModel = ref("");
const isLoading = ref(false);
const serverTotalPages = ref(1);
const totalEntries = ref(0);

const filteredOffers = computed(() => {
  const s = searchText.value.trim().toLowerCase();
  const modelFilter = selectedModel.value.trim().toLowerCase();
  return allOffers.value.filter((o) => {
    const matchesModel = !modelFilter || (o.brand || "").toLowerCase() === modelFilter;
    if (!matchesModel) return false;
    if (!s) return true;
    const hay = `${o.model} ${o.customer?.name || ""} ${o.customer?.email || ""} ${o.userOffer || ""} ${o.comments || ""}`.toLowerCase();
    return hay.includes(s);
  });
});
const paginatedOffers = computed(() => filteredOffers.value);

function goToPage(page) {
  if (page >= 1 && page <= serverTotalPages.value) {
    getRejectedOffers(page);
  }
}

// API call to get rejected offers
const { apiGet } = useApi();
const { getMultipleUserCreditScores } = useCreditScore();
const getRejectedOffers = async (page = 1) => {
  try {
    currentPage.value = page;
    isLoading.value = true;
    // only send pagination params to backend; keep search/model filtering local
    const params = { page, limit: serverPageSize.value };
    const qs = new URLSearchParams(params).toString();
    const response = await apiGet(`/bid/v2/dealer/rejected-offers?${qs}`);
    // read negotiations array (safe fallback)
    const negotiationsArray = Array.isArray(response.data?.negotiations) ? response.data.negotiations : [];
    // map and await results (mapApiData is async)
    const mapped = await mapApiData(negotiationsArray);
    allOffers.value = mapped;
    // pagination metadata from server (safe fallbacks)
    const pagination = response.data?.pagination || {};
    currentPage.value = Number(pagination.page) || page;
    serverTotalPages.value = Number(pagination.totalPages) || Math.max(1, Math.ceil((Number(pagination.total) || negotiationsArray.length) / serverPageSize.value));
    totalEntries.value = Number(pagination.total) || negotiationsArray.length;
  } catch (error) {
    console.error("Error fetching rejected offers:", error);
  } finally {
    isLoading.value = false;
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
  return variants
    .map((variant) => {
      const price = variant.price && parseFloat(variant.price) > 0 ? ` (+$${parseFloat(variant.price).toLocaleString()})` : " (Included)";
      return `${variant.typeSubCategory || variant.mainCategory || variant.subCategory || "Unknown Option"}${price}`;
    })
    .join(", ");
};

// Support negotiation-style objects (userBidId/userId) and flat items
const mapApiData = async (apiResponse) => {
  const userIds = apiResponse
    .map((item) => {
      const uid =
        (item.userId && (item.userId._id || item.userId)) ||
        (item.userBidId && (item.userBidId.userId || item.userBidId.userId?._id)) ||
        (item.customerDetails && item.customerDetails.userId) ||
        null;
      return uid ? normalizeId(uid) : null;
    })
    .filter((id) => id)
    .map((id) => String(id));

  let creditScores = {};
  if (userIds.length > 0) {
    try {
      creditScores = await getMultipleUserCreditScores(userIds);
    } catch (error) {
      console.error("Error fetching credit scores:", error);
    }
  }

  return apiResponse.map((item) => {
    const source = item.userBidId || item;
    const userObj = item.userId || item.customerDetails || source.userId || null;
    const bidId = source._id ? normalizeId(source._id) : item._id ? normalizeId(item._id) : null;
    const carId = item.carId || source.carId || null;
    const customerName =
      (userObj && (userObj.fullName || userObj.name)) ||
      source.userName ||
      (item.customerDetails && item.customerDetails.fullName) ||
      "Unknown Customer";
    const userId = (userObj && (userObj._id || userObj)) ? normalizeId(userObj._id || userObj) : null;
    const userCreditScore = (userId && creditScores[userId]) ? creditScores[userId] : { hasCreditScore: false, creditScoreTier: null };
    return {
      image: source.carImage || source.image || "",
      model: source.carName || source.carname || source.model || "",
      brand: (source.carName || source.carname || "").split(" ")[0] || "",
      price: `$${Number(source.carMsrp || source.msrp || 0).toLocaleString()}.00`,
      customer: {
        name: (() => {
          if (!customerName) return "Unknown Customer";
          const nameParts = String(customerName).trim().split(/\s+/);
          if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1).toLowerCase();
          return `${nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1).toLowerCase()} ${nameParts[nameParts.length - 1].charAt(0).toUpperCase()}.`;
        })(),
        email: (userObj && (userObj.email || userObj.userEmail)) || source.userEmail || (item.customerDetails && item.customerDetails.email) || "",
        phone: (userObj && (userObj.phoneNumber || userObj.phone)) || (item.customerDetails && item.customerDetails.phoneNumber) || "",
        creditScore: userCreditScore.hasCreditScore ? userCreditScore.creditScoreTier : "Not Available",
      },
      location: "13th Street 47 ",
      userOffer: Number(source.carBid || source.latestUserOffer || 0).toLocaleString(),
      msrp: Number(source.carMsrp || source.msrp || 0).toLocaleString(),
      comments: source.userComments || item.latestUserComments || "",
      selectedOptions: getSelectedOptionsText(source.variants || source.userVariants || []),
      status: item.status || "Rejected",
      bidId: bidId,
      carId: carId,
      userId: userId || "",
      dealerId: JSON.parse(localStorage.getItem("auth") || "{}")?.user?._id || "",
    };
  });
};

onMounted(() => {
  getRejectedOffers(currentPage.value);
});

// debounce timer for filter changes
const filterTimer = ref(null);
watch([searchText, selectedModel], () => {
  if (filterTimer.value) clearTimeout(filterTimer.value);
  // debounced: only reset current page (do NOT call the API) so filtering stays local
  filterTimer.value = setTimeout(() => {
    currentPage.value = 1;
    filterTimer.value = null;
  }, 400);
});

onBeforeUnmount(() => {
  if (filterTimer.value) clearTimeout(filterTimer.value);
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
td,
th {
  max-width: 220px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>

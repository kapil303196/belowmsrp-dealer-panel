<template>
  <div class="p-7 max-sm:px-5">
    <!-- Small screen filter bar -->
    <ui-mobile-filter-bar title="Accepted Offers" v-model:search="searchText" v-model:model="selectedModel" />

    <!-- Desktop filter bar -->
    <UiDesktopFilterBar title="Accepted Offers" v-model:search="searchText" v-model:model="selectedModel" />

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
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-[10px] mb-[14px]">
            <div class="flex items-center space-x-3 flex-1">
              <img :src="offer.image" class="w-[71px] h-12 rounded object-cover" />
              <div>
                <div class="text-[13px] font-medium text-primary">{{ offer.model }}</div>
                <div class="text-[13px] font-medium text-primary">{{ offer.price }}</div>
              </div>
            </div>
          </div>
          <!-- Action button at bottom -->
          <div class="flex items-center gap-2 justify-end mt-2">
            <button class="relative w-[38px] h-10 flex items-center justify-center flex-none">
              <img src="../../assets/images/icons/download-icon.svg" alt="icon" class="w-5 h-5" />
            </button>
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
              <span class="text-[#081735] opacity-55">Email:</span>
              <span>{{ offer.customer.email }}</span>
            </div>
            <span class="w-full h-[2px] bg-gradient-to-r from-transparent via-primary/20 to-transparent block"></span>
            <div class="flex justify-between py-[6px]">
              <span class="text-[#081735] opacity-55">Phone:</span>
              <span>{{ offer.customer.phone }}</span>
            </div>
            <span class="w-full h-[2px] bg-gradient-to-r from-transparent via-primary/20 to-transparent block"></span>
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
            <!-- Car's MSRP column removed -->
            <th class="px-[14px] py-2 font-normal">
              <button>
                User Comments
                <img class="inline ml-[10px] align-middle" src="~/assets/images/icons/filter-icon.svg" alt="" />
              </button>
            </th>
            <!-- Selected Options column removed -->
            <th class="px-[14px] py-2 font-normal">
              <button>
                Actions
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
                <img src="../../assets/images/icons/download-icon.svg" alt="icon" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- Pagination Controls -->
    <UiPaginationBar v-if="!isLoading && totalPages > 0" :currentPage="currentPage" :totalPages="totalPages" :totalEntries="allOffers.length" @goToPage="goToPage" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
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

const pageSize = 6;
const currentPage = ref(1);
const allOffers = ref([]);
const searchText = ref("");
const selectedModel = ref("");
const isLoading = ref(false);

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

const totalPages = computed(() => Math.ceil(filteredOffers.value.length / pageSize));

const paginatedOffers = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return filteredOffers.value.slice(start, start + pageSize);
});

function goToPage(page) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
}

// API call to get accepted offers
const { apiGet } = useApi();
const { getMultipleUserCreditScores } = useCreditScore();

const getAcceptedOffers = async () => {
  try {
    isLoading.value = true;
    const dealerId = JSON.parse(localStorage.getItem("auth")).user._id;
    const response = await apiGet(`/bid/get-dealer-bid/accept/${dealerId}`);
    allOffers.value = await mapApiData(response.data);
  } catch (error) {
    console.error("Error fetching accepted offers:", error);
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
      image: item.image || "",
      model: item.carname || "",
      brand: item.carname?.split(" ")[0] || "",
      price: `$${Number(item.msrp || 0).toLocaleString()}.00`,
      customer: {
        name:
          item.customerDetails?.fullName ? 
            (() => {
              const nameParts = item.customerDetails.fullName.trim().split(/\s+/);
              if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1).toLowerCase();
              return `${nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1).toLowerCase()} ${nameParts[nameParts.length - 1].charAt(0).toUpperCase()}.`;
            })() : 
            "Unknown Customer",
        email: item.customerDetails?.email || "",
        phone: item.customerDetails?.phoneNumber || "",
        creditScore: userCreditScore.hasCreditScore ? userCreditScore.creditScoreTier : "Not Available",
      },
      location: "13th Street 47 ",
      userOffer: Number(item.latestUserOffer || 0).toLocaleString(),
      msrp: Number(item.msrp || 0).toLocaleString(),
      comments: item.latestUserComments || "",
      selectedOptions: getSelectedOptionsText(item.userVariants || []),
      status: item.status || "Accepted",
      bidId: bidId,
      carId: item.id,
      userId: userId || "",
      dealerId: JSON.parse(localStorage.getItem("auth") || "{}")?.user?._id || "",
    };
  });
};

onMounted(() => {
  getAcceptedOffers();
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

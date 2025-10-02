<template>
  <div class="p-7 max-sm:p-5 max-sm:pt-0">
    <!-- Small screen filter bar -->
    <ui-mobile-filter-bar title="All Offers" v-model:search="searchText" v-model:model="selectedModel" />

    <!-- Desktop filter bar -->
    <UiDesktopFilterBar title="All Offers" v-model:search="searchText" v-model:model="selectedModel" />

    <!-- Loading state -->
    <div v-if="isLoading" class="flex items-center justify-center py-10 text-primary/70">
      <svg class="animate-spin h-6 w-6" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
      </svg>
      <span class="ml-2">Loading...</span>
    </div>

    <!-- Empty state -->
    <div v-if="!isLoading && !hasData" class="flex items-center justify-center py-10 text-primary/60">No offers to display.</div>

    <!-- Table: Desktop screens only -->
    <div v-if="!isLoading && hasData" class="overflow-auto max-md:hidden">
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
            <th class="px-[14px] py-2 font-normal">
              <button>
                Trade in Vehicle
                <img class="inline ml-[10px] align-middle" src="~/assets/images/icons/filter-icon.svg" alt="" />
              </button>
            </th>
            <th class="px-[14px] py-2 font-normal">
              <button>
                Location
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
                Car's Build MSRP
                <img class="inline ml-[10px] align-middle" src="~/assets/images/icons/filter-icon.svg" alt="" />
              </button>
            </th>
            <th class="px-[14px] py-2 font-normal">
              <button>
                Submission Date
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
            <td class="px-[14px] py-2 whitespace-pre-line text-sm">
              <div>Vehicle: {{ getVehicleText(offer) }}</div>
              <div>VIN: {{ getVinText(offer) }}</div>
              <div>Mileage: {{ getMileageText(offer) }}</div>
              <div>Price Range: {{ getTradeInRange(offer) }}</div>
            </td>
            <td class="px-[14px] py-2 text-sm">{{ offer.location }}</td>
            <td class="px-[14px] py-2 text-sm font-medium">${{ offer.userOffer }}</td>
            <td class="px-[14px] py-2 text-sm">${{ offer.msrp }}</td>
            <td class="px-[14px] py-2 text-sm">{{ offer.submissionDate }}</td>
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
    <div v-if="!isLoading && hasData" class="md:hidden flex flex-col gap-4">
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
            <div class="rounded-lg border-none bg-white p-2 mt-3">
              <div class="flex justify-between border-none p-2">
                <span class="text-[#081735] opacity-55">User Offer:</span>
                <span class="font-semibold">${{ offer.userOffer }}</span>
              </div>
              <span class="w-full h-[2px] bg-gradient-to-r from-transparent via-primary/20 to-transparent block"></span>

              <div class="flex justify-between border-none p-2 mt-1">
                <span class="text-[#081735] opacity-55">Your Build MSRP:</span>
                <span class="font-semibold">${{ offer.msrp }}</span>
              </div>
            </div>
            <div class="rounded-lg border-none bg-white p-2 mt-3">
              <p class="text-sm text-primary font-medium mb-1">Trade in Vehicle</p>
              <div class="flex justify-between border-none p-1">
                <span class="text-[#081735] opacity-55">Vehicle:</span>
                <span class="font-normal">{{ getVehicleText(offer) }}</span>
              </div>
              <div class="flex justify-between border-none p-1">
                <span class="text-[#081735] opacity-55">VIN:</span>
                <span class="font-normal">{{ getVinText(offer) }}</span>
              </div>
              <div class="flex justify-between border-none p-1">
                <span class="text-[#081735] opacity-55">Mileage:</span>
                <span class="font-normal">{{ getMileageText(offer) }}</span>
              </div>
              <div class="flex justify-between border-none p-1">
                <span class="text-[#081735] opacity-55">Price Range:</span>
                <span class="font-normal">{{ getTradeInRange(offer) }}</span>
              </div>
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
          <button @click="previewPdf(offer)" class="w-full h-10 border border-[#2C73DB] rounded-lg flex items-center justify-center" title="Preview PDF">
            <svg v-if="isDownloading(offer)" class="animate-spin h-5 w-5 text-primary" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
            </svg>
            <img v-else src="../../assets/images/icons/download-icon.svg" alt="icon" class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>

    <!-- Pagination Controls -->
    <UiPaginationBar :currentPage="currentPage" :totalPages="totalPages" :totalEntries="allOffers.length" @goToPage="goToPage" />

    <!-- Counter Modal -->
    <div v-if="showCounter" class="fixed inset-0 z-[1000] flex items-center justify-center">
      <div class="absolute inset-0 bg-black/30" @click="closeCounter"></div>
      <div class="relative bg-white rounded-2xl shadow-xl w-full max-w-xl mx-4 p-6">
        <div class="flex items-start justify-between mb-4">
          <h3 class="text-xl font-semibold text-primary">Counter User Offer</h3>
          <button class="text-primary/60 hover:text-primary" @click="closeCounter">✕</button>
        </div>
        <form @submit.prevent="submitCounter">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-primary mb-1">Counter Offer *</label>
              <input
                v-model="form.counterBid"
                type="number"
                min="0"
                required
                placeholder="Enter Counter Offer"
                class="w-full h-12 px-3 rounded-lg border border-[#DBE4F2] focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-primary mb-1">Dealer's Car MSRP *</label>
              <input
                v-model="form.dealerMsrp"
                type="number"
                min="0"
                placeholder="Enter Dealer's Car MSRP"
                class="w-full h-12 px-3 rounded-lg border border-[#DBE4F2] focus:outline-none focus:ring-2 focus:ring-primary/40"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-primary mb-1">Trade In Counter Offer</label>
              <input
                v-model="form.tradeInOffer"
                type="number"
                min="0"
                placeholder="Enter Dealer's Car MSRP"
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
            <ui-base-button :disabled="isSubmitting" type="submit" variant="secondary">
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
import { ref, computed, onMounted } from "vue";
import moment from 'moment-timezone';

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
const acceptingIds = ref(new Set());
const rejectingIds = ref(new Set());

const filteredOffers = computed(() => {
  const s = searchText.value.trim().toLowerCase();
  const modelFilter = selectedModel.value.trim().toLowerCase();
  return allOffers.value.filter((o) => {
    const matchesModel = !modelFilter || (o.brand || "").toLowerCase() === modelFilter;
    if (!matchesModel) return false;
    if (!s) return true;
    const hay = `${o.model} ${o.customer?.name || ""} ${o.userOffer || ""} ${o.comments || ""}`.toLowerCase();
    return hay.includes(s);
  });
});
const totalPages = computed(() => Math.ceil(filteredOffers.value.length / pageSize));
const hasData = computed(() => filteredOffers.value.length > 0);

const paginatedOffers = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return filteredOffers.value.slice(start, start + pageSize);
});

// Trade-in helpers with 'N/A' fallback
function getVehicleText(offer) {
  try {
    const dv = offer && offer.kpiData && offer.kpiData.decodedVehicle ? offer.kpiData.decodedVehicle : null;
    const make = dv && dv.make ? dv.make : null;
    const model = dv && dv.model ? dv.model : null;
    const year = dv && dv.year ? dv.year : null;
    const parts = [make, model, year].filter((v) => v);
    return parts.length ? parts.join(' ') : 'N/A';
  } catch (_) {
    return 'N/A';
  }
}

function getVinText(offer) {
  try {
    const vin = offer && offer.kpiData && offer.kpiData.request ? offer.kpiData.request.vin : null;
    return vin && String(vin).trim() ? vin : 'N/A';
  } catch (_) {
    return 'N/A';
  }
}

function getMileageText(offer) {
  try {
    const mileage = offer && offer.kpiData && offer.kpiData.request ? offer.kpiData.request.mileage : null;
    return mileage && String(mileage).trim() ? mileage : 'N/A';
  } catch (_) {
    return 'N/A';
  }
}

function getTradeInRange(offer) {
  try {
    const t = offer && offer.kpiData && offer.kpiData.kbbValues && offer.kpiData.kbbValues.goodCondition && offer.kpiData.kbbValues.goodCondition.tradeIn
      ? offer.kpiData.kbbValues.goodCondition.tradeIn
      : null;
    const low = t && t.lowRange ? t.lowRange : null;
    const high = t && t.highRange ? t.highRange : null;
    if (low != null && high != null) return `${low} - ${high}`;
    return 'N/A';
  } catch (_) {
    return 'N/A';
  }
}

function goToPage(page) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
}

// API call to get all offers
const { apiGet, apiPost, apiPostForm, apiGetBlob } = useApi();
// removed new-tab blob preview import
import { normalizeId } from "~/composables/useNormalizeId";

const getAllOffers = async () => {
  try {
    isLoading.value = true;
    const response = await apiGet("/bid/all-bid");
    allOffers.value = mapAllOffersApiData(response.data);
  } catch (error) {
    console.error("Error fetching all offers:", error);
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

const mapAllOffersApiData = (apiResponse) => {
  return apiResponse.map((item) => {
    // This endpoint returns userbids with different field names
    // Use _id as bidId since this is the userbid ID
    const bidId = item._id ? String(item._id) : null;
    const formattedDate = moment.utc(item.createdAt).tz('America/Los_Angeles').format('MM/DD/YYYY');

    return {
      bidId: bidId,
      image: item.carImage || "",
      model: item.carName || "",
      brand: item.carMaker || "",
      price: `$${Number(item.carMsrp || 0).toLocaleString()}.00`,
      customer: {
        name: (() => {
          if (!item.userName) return "Unknown Customer";
          const nameParts = item.userName.trim().split(/\s+/);
          if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1).toLowerCase();
          return `${nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1).toLowerCase()} ${nameParts[nameParts.length - 1].charAt(0).toUpperCase()}.`;
        })(),
        email: item.userEmail || "",
        phone: "",
        creditScore: 0,
      },
      kpiData: item?.userId?.kbbValue,
      userId: item?.userId ? normalizeId(item.userId) : null,
      dealerId: JSON.parse(localStorage.getItem("auth") || "{}")?.user?._id || "",
      carId: item.carId ? normalizeId(item.carId) : null,
      location: "13th Street 47",
      userOffer: Number(item.carBid || 0).toLocaleString(),
      msrp: Number(item.carMsrp || 0).toLocaleString(),
      submissionDate: formattedDate,
      comments: item.userComments || "",
      selectedOptions: getSelectedOptionsText(item.variants || []),
      status: "All Offers",
    };
  });
};

const acceptBid = async (offer) => {
  try {
    acceptingIds.value.add(offer.bidId);
    const payload = {
      userId: offer.userId,
      dealerId: offer.dealerId,
      carId: offer.carId._id,
      bidId: offer.bidId,
      dealerAction: "accept",
    };
    await apiPost("/bid/dealer-bid-action", payload);
    await getAllOffers();
  } catch (error) {
    console.error("Error accepting bid:", error);
  } finally {
    acceptingIds.value.delete(offer.bidId);
  }
};

const rejectBid = async (offer) => {
  try {
    rejectingIds.value.add(offer.bidId);
    const payload = {
      userId: offer.userId,
      dealerId: offer.dealerId,
      carId: offer.carId._id,
      bidId: offer.bidId,
      dealerAction: "reject",
    };
    await apiPost("/bid/dealer-bid-action", payload);
    await getAllOffers();
  } catch (error) {
    console.error("Error rejecting bid:", error);
  } finally {
    rejectingIds.value.delete(offer.bidId);
  }
};

const isAccepting = (offer) => acceptingIds.value.has(offer.bidId);
const isRejecting = (offer) => rejectingIds.value.has(offer.bidId);

// PDF download
const downloadingIds = ref(new Set());
const isDownloading = (offer) => downloadingIds.value.has(offer.bidId);
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

// Counter modal state
const showCounter = ref(false);
const isSubmitting = ref(false);
const currentOffer = ref(null);
const form = ref({ counterBid: "", dealerMsrp: "", tradeInOffer: "", dealerComments: "", file: null });
const fileName = ref("");
const fileInputRef = ref(null);
const fileInput = computed(() => fileInputRef.value);

function openCounterModal(offer) {
  currentOffer.value = offer;
  form.value = { counterBid: "", dealerMsrp: "", tradeInOffer: '', dealerComments: "", file: null };
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
    fd.append("tradeInOffer", String(form.value.tradeInOffer || ""));
    fd.append("dealerComments", form.value.dealerComments || "");
    fd.append("userDetails", userDetails);
    fd.append("options", "[]");
    if (form.value.file) {
      fd.append("file0", form.value.file);
    }

    await apiPostForm("/bid/dealer-bid-counter", fd);
    await getAllOffers();
    showCounter.value = false;
  } catch (error) {
    console.error("Error submitting counter bid:", error);
  } finally {
    isSubmitting.value = false;
  }
};

const acting = ref(false);
const isPreviewing = ref(false);
const showPreviewModal = ref(false);
const previewUrl = ref("");
const previewType = ref("");

async function previewAttachments(offer) {
  if (isPreviewing.value) return;
  isPreviewing.value = true;
  const list = Array.isArray(offer?.originalBid?.dealerBids) ? offer.originalBid.dealerBids : [];
  // Find the latest dealer bid that has at least one attachment
  const sorted = [...list].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  const latestWithImages = [...sorted].reverse().find((b) => Array.isArray(b?.images) && b.images.length > 0);
  if (!latestWithImages) {
    isPreviewing.value = false;
    return;
  }
  const images = latestWithImages.images.filter((u) => typeof u === "string" && u);
  if (!images.length) {
    isPreviewing.value = false;
    return;
  }
  // Take the last image in that latest bid as the most recent attachment
  const url = images[images.length - 1];
  try {
    const token = localStorage.getItem("token");
    const resp = await fetch(`${API_BASE_URL}/bid/user-attachment-download?url=${encodeURIComponent(url)}`, { headers: token ? { authtoken: token } : {} });
    const contentType = resp.headers.get("content-type") || "";
    const blob = await resp.blob();
    const objectUrl = window.URL.createObjectURL(blob);
    previewType.value = contentType;
    previewUrl.value = objectUrl;
    showPreviewModal.value = true;
  } catch (e) {
    console.error("Failed to preview attachment", e);
  }
  isPreviewing.value = false;
}

function closePreview() {
  try {
    if (previewUrl.value) {
      window.URL.revokeObjectURL(previewUrl.value);
    }
  } catch (_) {}
  previewUrl.value = "";
  previewType.value = "";
  showPreviewModal.value = false;
}

onMounted(() => {
  getAllOffers();
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

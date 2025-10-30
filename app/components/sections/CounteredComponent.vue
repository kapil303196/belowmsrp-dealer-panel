<template>
  <div class="p-7 max-sm:px-5">
    <!-- Small screen filter bar -->
    <ui-mobile-filter-bar title="Countered Offers" v-model:search="searchText" v-model:model="selectedModel" />

    <!-- Desktop filter bar -->
    <UiDesktopFilterBar title="Countered Offers" v-model:search="searchText" v-model:model="selectedModel" />

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
            <div class="rounded-lg border-none bg-white p-2">
              <div class="flex justify-between border-none p-2">
                <span class="text-[#081735] opacity-55">User Offer:</span>
                <span class="font-semibold">${{ offer.userOffer }}</span>
              </div>
              <span class="w-full h-[2px] bg-gradient-to-r from-transparent via-primary/20 to-transparent block"></span>
              <div class="flex justify-between border-none p-2">
                <span class="text-[#081735] opacity-55">Counter Offer:</span>
                <span class="font-semibold">
                  <div class="flex flex-col items-end">
                    <span>${{ offer.counterOffer }}</span>
                  </div>
                </span>
              </div>
            </div>
          </div>

          <!-- Status Badge -->
          <div v-if="offer.status" class="mt-2 mb-3">
            <span v-if="isOfferAccepted(offer)" class="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full"> Deal Accepted </span>
            <span v-else-if="isOfferRejected(offer)" class="px-3 py-1 bg-red-100 text-red-800 text-xs rounded-full"> Deal Rejected </span>
            <span v-else-if="offer.dealerAction === 'user-counter'" class="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"> User Countered - Action Required </span>
            <span v-else-if="offer.dealerAction === 'counter'" class="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full"> Waiting for User Response </span>
          </div>
        </div>
        <!-- Comments -->
        <div class="mt-[14px] mb-[14px]"><span class="font-medium text-[15px] text-primary"></span> {{ offer.comments }}</div>
        <p class="font-medium text-primary opacity-55 mb-1 text-sm">Dealer Comments</p>
        <div class="mb-3"><span class="font-medium text-[15px] text-primary"></span> {{ offer.DealerComments }}</div>

        <!-- Mobile Actions -->
        <div v-if="offer.dealerAction === 'user-counter' && !isOfferAccepted(offer) && !isOfferRejected(offer)" class="flex gap-2 mt-3">
          <button @click="acceptUserCounter(offer)" class="flex-1 px-3 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 action-btn">Accept</button>
          <button @click="rejectUserCounter(offer)" class="flex-1 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 action-btn">Reject</button>
          <button @click="openCounterModal(offer)" class="flex-1 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 action-btn">Counter</button>
        </div>
        <div v-else-if="isOfferAccepted(offer)" class="text-green-600 text-xs mt-3 text-center"><i class="fas fa-check-circle me-1"></i> Deal Closed</div>
        <div v-else-if="isOfferRejected(offer)" class="text-red-600 text-xs mt-3 text-center"><i class="fas fa-times-circle me-1"></i> Deal Closed</div>
        <div v-else-if="offer.dealerAction === 'counter'" class="text-gray-500 text-xs mt-3 text-center">Waiting for user response</div>
      </div>
    </div>

    <!-- Desktop table -->
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
            <th class="px-[14px] py-2 font-normal">
              <button>
                User Offer
                <img class="inline ml-[10px] align-middle" src="~/assets/images/icons/filter-icon.svg" alt="" />
              </button>
            </th>
            <th class="px-[14px] py-2 font-normal">
              <button>
                Counter Offer
                <img class="inline ml-[10px] align-middle" src="~/assets/images/icons/filter-icon.svg" alt="" />
              </button>
            </th>
            <th class="px-[14px] py-2 font-normal">Status</th>
            <th class="px-[14px] py-2 font-normal">
              <button>
                User Comments
                <img class="inline ml-[10px] align-middle" src="~/assets/images/icons/filter-icon.svg" alt="" />
              </button>
            </th>
            <th class="px-[14px] py-2 font-normal">
              <button>
                Dealer Comments
                <img class="inline ml-[10px] align-middle" src="~/assets/images/icons/filter-icon.svg" alt="" />
              </button>
            </th>
            <th class="px-[14px] py-2 font-normal">Actions</th>
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
            <td class="px-[14px] py-2 text-sm font-medium">${{ offer.userOffer }}</td>
            <td class="px-[14px] py-2 text-sm font-medium">
              <div class="flex flex-col">
                <span>${{ offer.counterOffer }}</span>
              </div>
            </td>
            <td class="px-[14px] py-2 text-sm">
              <span v-if="offer.status && isOfferAccepted(offer)" class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"> Deal Accepted </span>
              <span v-else-if="offer.status && isOfferRejected(offer)" class="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full"> Deal Rejected </span>
              <span v-else-if="offer.status && offer.dealerAction === 'user-counter'" class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"> User Countered </span>
              <span v-else-if="offer.status && offer.dealerAction === 'counter'" class="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full"> Waiting for User </span>
            </td>
            <td class="px-[14px] py-2 text-sm">{{ offer.comments }}</td>
            <td class="px-[14px] py-2 text-sm">{{ offer.DealerComments }}</td>
            <td class="px-[14px] py-2 text-sm">
              <!-- Show different actions based on the current state -->
              <div v-if="offer.dealerAction === 'user-counter' && !isOfferAccepted(offer) && !isOfferRejected(offer)" class="flex items-center gap-1">
                <button @click="acceptUserCounter(offer)" class="relative w-[38px] h-10 border border-[#2C8436] rounded-lg flex items-center justify-center flex-none">
                  <img src="../../assets/images/icons/green-check.svg" alt="icon" class="w-5 h-5" />
                </button>
                <button @click="rejectUserCounter(offer)" class="relative w-[38px] h-10 border border-[#D53660] rounded-lg flex items-center justify-center flex-none">
                  <img src="../../assets/images/icons/cross-icon.svg" alt="icon" class="w-5 h-5" />
                </button>
                <button @click="openCounterModal(offer)" class="relative w-[38px] h-10 border border-[#2C73DB] rounded-lg flex items-center justify-center flex-none">
                  <img src="../../assets/images/icons/equal-icon.svg" alt="icon" class="w-5 h-5" />
                </button>
                <button @click="previewPdf(offer)" class="relative w-[38px] h-10 border border-[#2C73DB] rounded-lg flex items-center justify-center flex-none" title="Preview PDF">
                  <svg v-if="isDownloading(offer)" class="animate-spin h-5 w-5 text-primary" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                  <img v-else src="../../assets/images/icons/download-icon.svg" alt="icon" class="w-5 h-5" />
                </button>
              </div>
              <div v-else-if="isOfferAccepted(offer)" class="text-green-600 text-xs"><i class="fas fa-check-circle me-1"></i> Deal Closed</div>
              <div v-else-if="isOfferRejected(offer)" class="text-red-600 text-xs"><i class="fas fa-times-circle me-1"></i> Deal Closed</div>
              <div v-else-if="offer.dealerAction === 'counter'" class="text-gray-500 text-xs">Waiting for user response</div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

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
              <label class="block text-sm font-medium text-primary mb-1">Dealer’s Car MSRP</label>
              <input
                v-model="form.dealerMsrp"
                type="number"
                min="0"
                placeholder="Enter Dealer’s Car MSRP"
                class="w-full h-12 px-3 rounded-lg border border-[#DBE4F2] focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-primary mb-1">Attachment (optional)</label>
              <div class="w-full h-12 rounded-lg border border-[#DBE4F2] flex items-center px-2">
                <button type="button" @click="fileInput && fileInput.click()" class="px-4 py-2 rounded-md bg-secondary text-white text-sm h-9">Choose File</button>
                <span class="ml-3 text-primary/80 truncate">{{ fileName || "No file chosen" }}</span>
              </div>
              <input ref="fileInputRef" @change="onFileChange" multiple type="file" accept=".pdf,image/*" class="hidden" />
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
              <span v-if="isSubmitting" class="inline-flex items-center">Submitting...</span>
              <span v-else>Submit</span>
            </ui-base-button>
          </div>
        </form>
      </div>
    </div>

    <!-- Pagination Controls -->
    <UiPaginationBar v-if="!isLoading && serverTotalPages > 0" :currentPage="currentPage" :totalPages="serverTotalPages" :totalEntries="totalEntries" @goToPage="goToPage" />

    <!-- Attachment/PDF Preview Modal -->
    <div v-if="showPreviewModal" class="fixed inset-0 z-[1000] flex items-center justify-center">
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
import { ref, computed, onMounted, watch, onBeforeUnmount } from "vue";
import { useApi } from "~/composables/useApi";
import { normalizeId } from "~/composables/useNormalizeId";
import Swal from "sweetalert2";

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

// Use server-driven pagination
const serverPageSize = ref(10);
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
    const hay = `${o.model} ${o.customer?.name || ""} ${o.userOffer || ""} ${o.comments || ""} ${o.DealerComments || ""}`.toLowerCase();
    return hay.includes(s);
  });
});

const paginatedOffers = computed(() => filteredOffers.value);

function goToPage(page) {
  if (page >= 1 && page <= serverTotalPages.value) {
    getCounteredOffers(page);
  }
}

// API call to get countered offers
const { apiGet, apiGetBlob, apiPostForm } = useApi();
const { getMultipleUserCreditScores } = useCreditScore();

// Add action methods for dealers
const { apiPost } = useApi();

const acceptUserCounter = async (offer) => {
  try {
    const dealerId = JSON.parse(localStorage.getItem("auth")).user._id;
    if (!dealerId || !offer?.carId || !offer?.bidId) {
      await Swal.fire("Missing data", "Cannot accept: required identifiers are missing.", "warning");
      return;
    }
    const payload = {
      // dealerId,
      // carId: offer.carId,
      userBidId : offer.bidId,
      // dealerAction: "accept",
    };
    if (offer?.userId) payload.userId = offer.userId;
    await apiPost("/bid/v2/dealer/accept", payload);
    await getCounteredOffers();
  } catch (error) {
    console.error("Error accepting user counter:", error);
  }
};

const rejectUserCounter = async (offer) => {
  try {
    const dealerId = JSON.parse(localStorage.getItem("auth")).user._id;
    if (!dealerId || !offer?.carId || !offer?.bidId) {
      await Swal.fire("Missing data", "Cannot reject: required identifiers are missing.", "warning");
      return;
    }
    const payload = {
      // dealerId,
      // carId: offer.carId,
      userBidId: offer.bidId,
      // dealerAction: "reject",
    };
    // if (offer?.userId) payload.userId = offer.userId;
    await apiPost("/bid/v2/dealer/reject", payload);
    await getCounteredOffers();
  } catch (error) {
    console.error("Error rejecting user counter:", error);
  }
};

// Counter modal state
const showCounter = ref(false);
const isSubmitting = ref(false);
const currentOffer = ref(null);
const form = ref({ counterBid: "", dealerMsrp: "", dealerComments: "", file: null });
const fileName = ref("");
const fileInputRef = ref(null);
const fileInput = computed(() => fileInputRef.value);

function openCounterModal(offer) {
  currentOffer.value = offer;
  form.value = { counterBid: "", dealerMsrp: "", dealerComments: "", file: null };
  fileName.value = "";
  form.value.files = [];
  fileName.value = "";
  showCounter.value = true;
}
function closeCounter() {
  if (isSubmitting.value) return;
  showCounter.value = false;
}
function onFileChange(e) {
  const files = e.target.files;
   if (!files || !files.length) {
    form.value.files = [];
    fileName.value = "";
    return;
  }
   const validFiles = Array.from(files).filter(
    f => f.type === "application/pdf" || f.type.startsWith("image/")
  );

  form.value.files = validFiles;
  fileName.value = validFiles.map(f => f.name).join(", ");
}

const submitCounter = async () => {
  if (!currentOffer.value) return;
  try {
    isSubmitting.value = true;
    const dealerId = JSON.parse(localStorage.getItem("auth")).user._id;
    if (!dealerId || !currentOffer.value?.carId || !currentOffer.value?.bidId) {
      await Swal.fire("Missing data", "Cannot counter: required identifiers are missing.", "warning");
      isSubmitting.value = false;
      return;
    }
    const metadata = {
      dealerMsrp: form.value.dealerMsrp || "",
      tradeInOffer: form.value.tradeInOffer || "",
      // deliveryFee: form.value.deliveryFee || ""
    }
    const fd = new FormData();
    // fd.append("dealerId", dealerId);
    // if (currentOffer.value?.userId) fd.append("userId", currentOffer.value.userId);
    // fd.append("carId", currentOffer.value.carId);
    fd.append("userBidId", currentOffer.value.bidId);
    // fd.append("dealerAction", "counter");
    fd.append("offerAmount", String(form.value.counterBid || ""));
    fd.append("dealerMsrp", String(form.value.dealerMsrp || ""));
    fd.append("comments", form.value.dealerComments || "");
    // fd.append("options", "[]");
    fd.append("metadata", JSON.stringify(metadata));

     if (form.value.files && form.value.files.length) {
       form.value.files.forEach((file, index) => {
       fd.append(`file${index}`, file);
     })};

    await apiPostForm("/bid/v2/dealer/counter", fd);
    await getCounteredOffers();
    showCounter.value = false;
    Swal.fire("Success!", "Counter Offer Sent", "success");
  } catch (error) {
    console.error("Error submitting counter bid:", error);
    Swal.fire("Error!", "Failed to send counter offer", "error");
  } finally {
    isSubmitting.value = false;
  }
};

const getCounteredOffers = async (page = 1) => {
  try {
    isLoading.value = true;
    currentPage.value = page;
    const params = { page, limit: serverPageSize.value };
    const qs = new URLSearchParams(params).toString();
    const response = await apiGet(`/bid/v2/dealer/countered-offers?${qs}`);
    // Use negotiations array from API
    const negotiationsArray = Array.isArray(response.data?.negotiations) ? response.data.negotiations : [];
    allOffers.value = await mapApiData(negotiationsArray);
    // Pagination metadata from server
    const pagination = response.data?.pagination || {};
    currentPage.value = Number(pagination.page) || page;
    serverTotalPages.value = Number(pagination.totalPages) || Math.max(1, Math.ceil((Number(pagination.total) || negotiationsArray.length) / serverPageSize.value));
    totalEntries.value = Number(pagination.total) || negotiationsArray.length;
  } catch (error) {
    console.error("Error fetching countered offers:", error);
  } finally {
    isLoading.value = false;
  }
};

// Preview state and PDF preview logic (parity with AllOffers)
const downloadingIds = ref(new Set());
const isDownloading = (offer) => downloadingIds.value.has(offer.bidId || offer._id);
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
    if (previewUrl.value) {
      window.URL.revokeObjectURL(previewUrl.value);
    }
  } catch (_) {}
  previewUrl.value = "";
  previewType.value = "";
  showPreviewModal.value = false;
}

function parseLatestFlagsFromStatus(status) {
  const s = (status || "").toLowerCase();
  return {
    isDealerCountered: s.includes("countered") && s.includes("dealer"),
    isUserCountered: s.includes("countered") && s.includes("user"),
    isAccepted: s.includes("accepted"),
    isRejected: s.includes("rejected"),
  };
}

// Helpers to determine accepted/rejected state across mixed API shapes
function isOfferAccepted(offer) {
  const status = (offer?.status || "").toLowerCase();
  const userAction = (offer?.userAction || "").toLowerCase();
  return status.includes("accept") || userAction.includes("accept");
}

function isOfferRejected(offer) {
  const status = (offer?.status || "").toLowerCase();
  const userAction = (offer?.userAction || "").toLowerCase();
  return status.includes("reject") || userAction.includes("reject");
}

function deriveDealerActionFromHistory(history = []) {
  // Find the latest dealer action in the timeline
  const sorted = [...history].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  const lastDealer = [...sorted].reverse().find((e) => e.type === "dealer_action");
  return lastDealer?.action || "";
}

function deriveUserActionFromHistoryOrStatus(history = [], status = "") {
  const sorted = [...history].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  const lastUser = [...sorted].reverse().find((e) => e.type === "user_action");
  if (lastUser?.action) return lastUser.action;
  const s = (status || "").toLowerCase();
  if (s.includes("accepted")) return "Accepted";
  if (s.includes("rejected")) return "rejected";
  return "";
}

function findLatestUserBidId(history = []) {
  const sorted = [...history].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  const lastUserOffer = [...sorted].reverse().find((e) => e.type === "user_offer" && e.bidId);
  return lastUserOffer?.bidId || "";
}

const mapApiData = async (apiResponse) => {
  // Support negotiation-style objects (userBidId/userId) and flat items
  const userIds = (apiResponse || [])
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

  return (apiResponse || []).map((item) => {
    // Prefer userBidId for car data if present
    const source = item.userBidId || item;
    const userObj = item.userId || item.customerDetails || source.userId || null;
    const bidId = source._id ? normalizeId(source._id) : item._id ? normalizeId(item._id) : null;
    const carId = item.carId || source.carId || "";
    const customerName =
      (userObj && (userObj.fullName || userObj.name)) ||
      source.userName ||
      (item.customerDetails && item.customerDetails.fullName) ||
      "Unknown Customer";
    const userId = (userObj && (userObj._id || userObj)) ? normalizeId(userObj._id || userObj) : null;
    const userCreditScore = (userId && creditScores[userId]) ? creditScores[userId] : { hasCreditScore: false, creditScoreTier: null };

    // Counter/user/dealer comments and offers
    const latestUserOffer = source.carBid || item.latestUserOffer || "";
    const latestDealerOffer = item.metadata?.latestDealerOffer || item.latestDealerOffer || "";
    const latestUserComments = source.userComments || item.latestUserComments || "";
    const latestDealerComments = item?.latestOfferId?.comments || "";

    // Status/flags
    const status = item.status || "";
    const dealerAction = item.dealerAction || "";
    const userAction = item.userAction || "";

    // Model/brand
    const model = source.carName || source.carname || source.model || "";
    const brand = (source.carName || source.carname || "").split(" ")[0] || "";

    return {
      image: source.carImage || source.image || "",
      model,
      brand,
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
      userOffer: Number(latestUserOffer || 0).toLocaleString(),
      counterOffer: Number(latestDealerOffer || 0).toLocaleString(),
      dealerAction: status === "USER_COUNTERED" ? "user-counter" : status === "DEALER_COUNTERED" ? "counter" : dealerAction,
      comments: latestUserComments,
      DealerComments: latestDealerComments,
      status,
      userId: userId || "",
      carId: carId,
      bidId,
      userAction,
      // _flags: parseLatestFlagsFromStatus(status), // optional, not used in UI
    };
  });
};

onMounted(() => {
  getCounteredOffers(currentPage.value);
});

// debounce timer for filter changes
const filterTimer = ref(null);
watch([searchText, selectedModel], () => {
  if (filterTimer.value) clearTimeout(filterTimer.value);
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

/* Action button styles */
.action-btn {
  transition: all 0.2s ease;
}

.action-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.action-btn:active {
  transform: translateY(0);
}
</style>

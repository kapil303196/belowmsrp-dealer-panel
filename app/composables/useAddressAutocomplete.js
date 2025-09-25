import { ref, watch } from 'vue';
import addressApi from '../api/address';
  const config = useRuntimeConfig()
  const apiBaseUrl = config.public.NUXT_PUBLIC_API_BASE_URL

/**
 * Composable for managing address autocomplete functionality
 * @param {Object} options - Configuration options
 * @param {number} options.debounceMs - Debounce delay in milliseconds (default: 300)
 * @param {number} options.minChars - Minimum characters before triggering search (default: 3)
 * @returns {Object} - Reactive state and methods for address autocomplete
 */
export function useAddressAutocomplete(options = {}) {
  
  const {
    debounceMs = 300,
    minChars = 3
  } = options;

  // Reactive state
  const addressInput = ref('');
  const suggestions = ref([]);
  const isLoading = ref(false);
  const error = ref(null);
  const selectedAddress = ref(null);
  const addressDetails = ref(null);

  // Debounce timer
  let debounceTimer = null;

  /**
   * Fetch address suggestions based on input
   */
  const fetchSuggestions = async (input) => {
    if (!input || input.length < minChars) {
      suggestions.value = [];
      return;
    }

    try {
      isLoading.value = true;
      error.value = null;
      
      const data = await addressApi.getAddressSuggestions(apiBaseUrl, input);
      suggestions.value = data || [];
    } catch (err) {
      error.value = err.message;
      suggestions.value = [];
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Handle address selection from suggestions
   * @param {Object} suggestion - The selected suggestion object
   */
  const selectAddress = async (suggestion) => {
    try {
      isLoading.value = true;
      error.value = null;
      
      selectedAddress.value = suggestion;
      addressInput.value = suggestion.description;
      suggestions.value = [];

      // Fetch detailed address information
      const details = await addressApi.getAddressDetails(apiBaseUrl, suggestion.placeId);
      addressDetails.value = details;
      
      return details;
    } catch (err) {
      error.value = err.message;
      addressDetails.value = null;
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Clear all address data
   */
  const clearAddress = () => {
    addressInput.value = '';
    suggestions.value = [];
    selectedAddress.value = null;
    addressDetails.value = null;
    error.value = null;
  };

  /**
   * Fill form fields with address details
   * @param {Object} formData - The form data object to fill
   * @param {Object} fieldMapping - Mapping of address fields to form fields
   */
  const fillFormFields = (formData, fieldMapping = {}) => {
    if (!addressDetails.value) return;

    const defaultMapping = {
      streetAddress: 'streetAddress',
      streetNumber: 'streetNumber',
      streetName: 'streetName',
      city: 'city',
      state: 'state',
      stateCode: 'stateCode',
      zipCode: 'zipCode',
      country: 'country',
      countryCode: 'countryCode',
      latitude: 'latitude',
      longitude: 'longitude',
      formattedAddress: 'formattedAddress'
    };

    const mapping = { ...defaultMapping, ...fieldMapping };

    Object.keys(mapping).forEach(addressField => {
      const formField = mapping[addressField];
      if (addressDetails.value[addressField] && formData[formField] !== undefined) {
        formData[formField] = addressDetails.value[addressField];
      }
    });
  };

  // Watch for input changes and debounce the search
  watch(addressInput, (newValue) => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    debounceTimer = setTimeout(() => {
      fetchSuggestions(newValue);
    }, debounceMs);
  });

  return {
    // Reactive state
    addressInput,
    suggestions,
    isLoading,
    error,
    selectedAddress,
    addressDetails,

    // Methods
    fetchSuggestions,
    selectAddress,
    clearAddress,
    fillFormFields
  };
}

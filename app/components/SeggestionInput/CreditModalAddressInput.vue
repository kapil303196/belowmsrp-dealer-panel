<template>
  <div class="address-input-wrapper position-relative">
    <!-- Address Input Field -->
    <input
      :value="modelValue"
      @input="onInput"
      @focus="showSuggestions = true"
      @blur="handleBlur"
      :placeholder="placeholder"
      :disabled="disabled"
      
      class="mt-2 w-full h-[46px] border bg-white border-border rounded-lg px-4 py-2 text-sm outline-secondary"
      autocomplete="off"
    />
    
    <!-- Loading Spinner -->
    <div v-if="isLoading" class="position-absolute end-0 top-50 translate-middle-y me-3">
      <div class="spinner-border spinner-border-sm text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <!-- Suggestions Dropdown -->
    <div
      v-if="showSuggestions && suggestions.length > 0"
      class="suggestions-dropdown position-absolute w-100 bg-white border shadow-lg"
      style="z-index: 1051; max-height: 200px; overflow-y: auto; top: 100%; margin-top: 2px; border-radius: 0.375rem;"
    >
      <div
        v-for="(suggestion, index) in suggestions"
        :key="suggestion.placeId"
        class="suggestion-item p-3 border-bottom cursor-pointer"
        @mousedown="handleSelectAddress(suggestion)"
        style="cursor: pointer;"
        @mouseover="$event.target.style.backgroundColor = '#f8f9fa'"
        @mouseout="$event.target.style.backgroundColor = 'white'"
      >
        <div class="d-flex flex-column">
          <span class="fw-medium text-dark small">{{ suggestion.mainText }}</span>
          <span class="small text-muted">{{ suggestion.secondaryText }}</span>
        </div>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="small text-danger mt-1">
      {{ error }}
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue';
import { useAddressAutocomplete } from '../../composables/useAddressAutocomplete';

export default {
  name: 'CreditModalAddressInput',
  emits: ["update:modelValue", "addressSelected"],
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: "Start typing your address..."
    },
    disabled: {
      type: Boolean,
      default: false
    },
    debounceMs: {
      type: Number,
      default: 300
    },
    minChars: {
      type: Number,
      default: 3
    }
  },
  setup(props, { emit }) {
    const showSuggestions = ref(false);
    
    // Initialize address autocomplete
    const {
      addressInput,
      suggestions,
      isLoading,
      error,
      selectedAddress,
      addressDetails,
      selectAddress
    } = useAddressAutocomplete({
      debounceMs: props.debounceMs,
      minChars: props.minChars
    });

    // Sync with v-model
    watch(() => props.modelValue, (newValue) => {
      if (newValue !== addressInput.value) {
        addressInput.value = newValue;
      }
    }, { immediate: true });

    watch(addressInput, (newValue) => {
      emit('update:modelValue', newValue);
    });

    // Handle input changes
    const onInput = (event) => {
      addressInput.value = event.target.value;
    };

    // Handle address selection
    const handleSelectAddress = async (suggestion) => {
      try {
        const details = await selectAddress(suggestion);
        showSuggestions.value = false;
        
        // Emit the address details to parent component
        emit('addressSelected', { suggestion, details });
      } catch (err) {
        console.error('Error selecting address:', err);
      }
    };

    // Handle input blur
    const handleBlur = () => {
      // Delay hiding suggestions to allow for click events
      setTimeout(() => {
        showSuggestions.value = false;
      }, 200);
    };

    return {
      // Reactive state
      addressInput,
      suggestions,
      isLoading,
      error,
      showSuggestions,

      // Methods
      onInput,
      handleSelectAddress,
      handleBlur
    };
  }
};
</script>

<style scoped>
.input-bg {
  background-color: #F9FBFF;
}

.suggestions-dropdown {
  border: 1px solid #dee2e6;
  border-radius: 0.375rem;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}

.suggestion-item:last-child {
  border-bottom: none !important;
}

.suggestion-item:hover {
  background-color: #f8f9fa !important;
}

/* Custom scrollbar for suggestions */
.suggestions-dropdown::-webkit-scrollbar {
  width: 6px;
}

.suggestions-dropdown::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.suggestions-dropdown::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.suggestions-dropdown::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.custom-input-auto {
    width: 100%;
    background: #fff;
    border: 1px solid #d7dce4;
    border-radius: 6px;
}
</style>

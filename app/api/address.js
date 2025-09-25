import axios from "axios";

/**
 * Get address suggestions based on user input
 * @param {string} input - The address input string to search for
 * @returns {Promise} - Returns a promise with suggestions data
 */
const getAddressSuggestions = async (url, input) => {
  try {
    const response = await axios.get(`${url}/address/suggestions`, {
      params: {
        input: input.trim()
      }
    });
    
    if (response.data && response.data.success) {
      return response.data.data;
    } else {
      throw new Error('Failed to fetch address suggestions');
    }
  } catch (error) {
    console.error("Address suggestions error:", error.response || error);
    throw {
      code: error.response?.status || 417,
      message: error.response?.data?.message || 'Failed to fetch address suggestions. Please try again.',
    };
  }
};

/**
 * Get detailed address information by place ID
 * @param {string} placeId - The place ID from the suggestions
 * @returns {Promise} - Returns a promise with detailed address data
 */
const getAddressDetails = async (url, placeId) => {
  try {
    const response = await axios.get(`${url}/address/details/${placeId}`);
    
    if (response.data && response.data.success) {
      return response.data.data;
    } else {
      throw new Error('Failed to fetch address details');
    }
  } catch (error) {
    console.error("Address details error:", error.response || error);
    throw {
      code: error.response?.status || 417,
      message: error.response?.data?.message || 'Failed to fetch address details. Please try again.',
    };
  }
};

/**
 * Get city suggestions based on user input
 * @param {string} input - The city input string to search for
 * @returns {Promise} - Returns a promise with city suggestions data
 */
const getCitySuggestions = async (url, input) => {
  try {
    const response = await axios.get(`${url}/address/city-suggestions`, {
      params: {
        input: input.trim()
      }
    });
    
    if (response.data && response.data.success) {
      return response.data.data;
    } else {
      throw new Error('Failed to fetch city suggestions');
    }
  } catch (error) {
    console.error("City suggestions error:", error.response || error);
    throw {
      code: error.response?.status || 417,
      message: error.response?.data?.message || 'Failed to fetch city suggestions. Please try again.',
    };
  }
};

/**
 * Get detailed city information by place ID
 * @param {string} placeId - The place ID from the city suggestions
 * @returns {Promise} - Returns a promise with detailed city data
 */
const getCityDetails = async (url, placeId) => {
  try {
    const response = await axios.get(`${url}/address/city-details/${placeId}`);
    
    if (response.data && response.data.success) {
      return response.data.data;
    } else {
      throw new Error('Failed to fetch city details');
    }
  } catch (error) {
    console.error("City details error:", error.response || error);
    throw {
      code: error.response?.status || 417,
      message: error.response?.data?.message || 'Failed to fetch city details. Please try again.',
    };
  }
};

export default {
  getAddressSuggestions,
  getAddressDetails,
  getCitySuggestions,
  getCityDetails,
};

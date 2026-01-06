import api from './api';

const wishlistService = {
  // Get user's wishlist
  getWishlist: async () => {
    try {
      const response = await api.get('/Wishlist');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Add car to wishlist
  addToWishlist: async (carId) => {
    try {
      const response = await api.post(`/Wishlist/${carId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Remove car from wishlist
  removeFromWishlist: async (carId) => {
    try {
      const response = await api.delete(`/Wishlist/${carId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Check if car is in wishlist
  checkWishlist: async (carId) => {
    try {
      const response = await api.get(`/Wishlist/check/${carId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default wishlistService;

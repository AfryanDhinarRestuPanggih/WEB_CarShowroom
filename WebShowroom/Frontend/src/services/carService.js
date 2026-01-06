import api from './api';

const carService = {
  // Get all cars with filters
  getCars: async (filters = {}) => {
    try {
      const params = new URLSearchParams();

      if (filters.brand) params.append('brand', filters.brand);
      if (filters.bodyType) params.append('bodyType', filters.bodyType);
      if (filters.fuelType) params.append('fuelType', filters.fuelType);
      if (filters.transmission) params.append('transmission', filters.transmission);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      if (filters.minYear) params.append('minYear', filters.minYear);
      if (filters.maxYear) params.append('maxYear', filters.maxYear);
      if (filters.isFeatured !== undefined) params.append('isFeatured', filters.isFeatured);
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

      const response = await api.get(`/Cars?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get car by ID
  getCarById: async (id) => {
    try {
      const response = await api.get(`/Cars/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create new car (Admin only)
  createCar: async (carData) => {
    try {
      const response = await api.post('/Cars', carData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update car (Admin only)
  updateCar: async (id, carData) => {
    try {
      const response = await api.put(`/Cars/${id}`, carData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete car (Admin only)
  deleteCar: async (id) => {
    try {
      const response = await api.delete(`/Cars/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Alias for getCars (for backward compatibility)
  getAllCars: async (filters = {}) => {
    return carService.getCars(filters);
  },
};

export default carService;

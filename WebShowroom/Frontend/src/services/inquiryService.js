import api from './api';

const inquiryService = {
  // Get user's inquiries
  getUserInquiries: async () => {
    try {
      const response = await api.get('/Inquiries');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all inquiries (Admin only)
  getAllInquiries: async (status = '') => {
    try {
      const params = status ? `?status=${status}` : '';
      const response = await api.get(`/Inquiries/all${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create inquiry
  createInquiry: async (inquiryData) => {
    try {
      const response = await api.post('/Inquiries', inquiryData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Respond to inquiry (Admin only)
  respondToInquiry: async (id, responseData) => {
    try {
      const response = await api.put(`/Inquiries/${id}/response`, responseData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete inquiry (Admin only)
  deleteInquiry: async (id) => {
    try {
      const response = await api.delete(`/Inquiries/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default inquiryService;

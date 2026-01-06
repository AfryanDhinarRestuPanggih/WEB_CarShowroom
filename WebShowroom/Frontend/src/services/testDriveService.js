import api from './api';

const testDriveService = {
  // Get user's test drives
  getUserTestDrives: async () => {
    try {
      const response = await api.get('/TestDrives');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all test drives (Admin only)
  getAllTestDrives: async (status = '') => {
    try {
      const params = status ? `?status=${status}` : '';
      const response = await api.get(`/TestDrives/all${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create test drive booking
  createTestDrive: async (testDriveData) => {
    try {
      const response = await api.post('/TestDrives', testDriveData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update test drive status (Admin only)
  updateTestDriveStatus: async (id, statusData) => {
    try {
      const response = await api.put(`/TestDrives/${id}/status`, statusData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Cancel test drive
  cancelTestDrive: async (id) => {
    try {
      const response = await api.delete(`/TestDrives/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default testDriveService;

import api from './api';

const transactionService = {
  // Create a new transaction
  createTransaction: async (carId, paymentMethod) => {
    const response = await api.post('/Transactions', {
      carId,
      paymentMethod
    });
    return response.data;
  },

  // Get user's transactions
  getUserTransactions: async () => {
    const response = await api.get('/Transactions');
    return response.data;
  },

  // Get all transactions (Admin only)
  getAllTransactions: async (status = null) => {
    const params = status ? { status } : {};
    const response = await api.get('/Transactions/all', { params });
    return response.data;
  },

  // Get transaction detail
  getTransactionDetail: async (id) => {
    const response = await api.get(`/Transactions/${id}`);
    return response.data;
  },

  // Update transaction status (Admin only)
  updateTransactionStatus: async (id, status, adminNotes = null) => {
    const response = await api.put(`/Transactions/${id}/status`, {
      status,
      adminNotes
    });
    return response.data;
  },

  // Upload payment proof
  uploadPaymentProof: async (id, paymentProofUrl) => {
    const response = await api.post(`/Transactions/${id}/payment-proof`, {
      paymentProofUrl
    });
    return response.data;
  }
};

export default transactionService;

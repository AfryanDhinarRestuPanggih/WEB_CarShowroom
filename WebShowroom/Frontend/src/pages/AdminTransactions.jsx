import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import transactionService from '../services/transactionService';
import './AdminTransactions.css';

const AdminTransactions = () => {
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();

    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [adminNotes, setAdminNotes] = useState('');
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        if (!isAuthenticated || user?.role !== 'Admin') {
            navigate('/');
            return;
        }
        fetchTransactions();
    }, [isAuthenticated, user, navigate, statusFilter]);

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const data = await transactionService.getAllTransactions(statusFilter || null);
            setTransactions(data);
        } catch (err) {
            setError('Failed to load transactions');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusBadge = (status) => {
        const statusColors = {
            Pending: 'warning',
            Completed: 'success',
            Cancelled: 'secondary',
            Rejected: 'danger'
        };
        return statusColors[status] || 'secondary';
    };

    const handleViewTransaction = (transaction) => {
        setSelectedTransaction(transaction);
        setAdminNotes('');
        setShowModal(true);
    };

    const handleUpdateStatus = async (status) => {
        if (!selectedTransaction) return;

        if (status === 'Rejected' && !adminNotes.trim()) {
            alert('Please provide a reason for rejection');
            return;
        }

        setProcessing(true);
        setError('');

        try {
            await transactionService.updateTransactionStatus(
                selectedTransaction.id,
                status,
                adminNotes.trim() || null
            );

            alert(`Transaction ${status.toLowerCase()} successfully!`);
            setShowModal(false);
            setSelectedTransaction(null);
            setAdminNotes('');
            fetchTransactions();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update transaction');
            console.error(err);
        } finally {
            setProcessing(false);
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedTransaction(null);
        setAdminNotes('');
        setError('');
    };

    if (loading) {
        return (
            <div className="admin-transactions-loading">
                <div className="loading-spinner"></div>
                <p>Loading transactions...</p>
            </div>
        );
    }

    return (
        <div className="admin-transactions-container">
            <div className="admin-transactions-header">
                <h1>Manage Transactions</h1>
                <p>Review and manage customer transactions</p>
            </div>

            <div className="filters-section">
                <label>Filter by Status:</label>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="status-filter"
                >
                    <option value="">All Transactions</option>
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Cancelled">Cancelled</option>
                </select>
            </div>

            {transactions.length === 0 ? (
                <div className="empty-transactions">
                    <span className="empty-icon">📋</span>
                    <h3>No Transactions Found</h3>
                    <p>No transactions match the selected filter</p>
                </div>
            ) : (
                <div className="transactions-table-container">
                    <table className="transactions-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Customer</th>
                                <th>Car</th>
                                <th>Price</th>
                                <th>Payment</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((transaction) => (
                                <tr key={transaction.id}>
                                    <td>#{transaction.id}</td>
                                    <td>
                                        <div className="customer-info">
                                            <strong>{transaction.userName}</strong>
                                            <small>{transaction.userEmail}</small>
                                        </div>
                                    </td>
                                    <td>
                                        {transaction.carBrand} {transaction.carModel} ({transaction.carYear})
                                    </td>
                                    <td className="price-cell">{formatPrice(transaction.totalPrice)}</td>
                                    <td>{transaction.paymentMethod}</td>
                                    <td>
                                        <span className={`status-badge ${getStatusBadge(transaction.status)}`}>
                                            {transaction.status}
                                        </span>
                                    </td>
                                    <td>{formatDate(transaction.transactionDate)}</td>
                                    <td>
                                        <button
                                            className="btn-view"
                                            onClick={() => handleViewTransaction(transaction)}
                                        >
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Transaction Detail Modal */}
            {showModal && selectedTransaction && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Transaction Details</h2>
                            <button className="modal-close" onClick={closeModal}>&times;</button>
                        </div>

                        <div className="modal-body">
                            {error && <div className="error-message">{error}</div>}

                            <div className="detail-section">
                                <h3>Customer Information</h3>
                                <div className="detail-grid">
                                    <div className="detail-item">
                                        <span className="label">Name:</span>
                                        <span className="value">{selectedTransaction.userName}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="label">Email:</span>
                                        <span className="value">{selectedTransaction.userEmail}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="detail-section">
                                <h3>Car Information</h3>
                                <div className="detail-grid">
                                    <div className="detail-item">
                                        <span className="label">Car:</span>
                                        <span className="value">
                                            {selectedTransaction.carBrand} {selectedTransaction.carModel} ({selectedTransaction.carYear})
                                        </span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="label">Price:</span>
                                        <span className="value price">{formatPrice(selectedTransaction.totalPrice)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="detail-section">
                                <h3>Payment Information</h3>
                                <div className="detail-grid">
                                    <div className="detail-item">
                                        <span className="label">Method:</span>
                                        <span className="value">{selectedTransaction.paymentMethod}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="label">Status:</span>
                                        <span className={`status-badge ${getStatusBadge(selectedTransaction.status)}`}>
                                            {selectedTransaction.status}
                                        </span>
                                    </div>
                                    {selectedTransaction.payment?.paymentProofUrl && (
                                        <div className="detail-item full-width">
                                            <span className="label">Payment Proof:</span>
                                            <a
                                                href={selectedTransaction.payment.paymentProofUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="proof-link"
                                            >
                                                View Payment Proof →
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {selectedTransaction.status === 'Pending' && (
                                <div className="admin-actions-section">
                                    <h3>Admin Actions</h3>
                                    <textarea
                                        placeholder="Add notes (required for rejection)..."
                                        value={adminNotes}
                                        onChange={(e) => setAdminNotes(e.target.value)}
                                        className="admin-notes-input"
                                        rows="3"
                                    />
                                    <div className="action-buttons">
                                        <button
                                            className="btn-approve"
                                            onClick={() => handleUpdateStatus('Completed')}
                                            disabled={processing}
                                        >
                                            {processing ? 'Processing...' : 'Approve'}
                                        </button>
                                        <button
                                            className="btn-reject"
                                            onClick={() => handleUpdateStatus('Rejected')}
                                            disabled={processing}
                                        >
                                            {processing ? 'Processing...' : 'Reject'}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {selectedTransaction.adminNotes && (
                                <div className="detail-section">
                                    <h3>Admin Notes</h3>
                                    <p className="admin-notes-display">{selectedTransaction.adminNotes}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminTransactions;

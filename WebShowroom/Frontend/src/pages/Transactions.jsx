import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import transactionService from '../services/transactionService';
import './Transactions.css';

const Transactions = () => {
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();

    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [uploadingId, setUploadingId] = useState(null);
    const [paymentProofUrl, setPaymentProofUrl] = useState('');

    useEffect(() => {
        if (!isAuthenticated || user?.role === 'Admin') {
            navigate('/');
            return;
        }
        fetchTransactions();
    }, [isAuthenticated, user, navigate]);

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const data = await transactionService.getUserTransactions();
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
            month: 'long',
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

    const handleUploadProof = async (transactionId) => {
        if (!paymentProofUrl.trim()) {
            alert('Please enter payment proof URL');
            return;
        }

        try {
            await transactionService.uploadPaymentProof(transactionId, paymentProofUrl);
            alert('Payment proof uploaded successfully!');
            setUploadingId(null);
            setPaymentProofUrl('');
            fetchTransactions();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to upload payment proof');
            console.error(err);
        }
    };

    if (loading) {
        return (
            <div className="transactions-loading">
                <div className="loading-spinner"></div>
                <p>Loading transactions...</p>
            </div>
        );
    }

    return (
        <div className="transactions-container">
            <div className="transactions-header">
                <h1>My Transactions</h1>
                <p>View and manage your car purchases</p>
            </div>

            {error && <div className="error-message">{error}</div>}

            {transactions.length === 0 ? (
                <div className="empty-transactions">
                    <span className="empty-icon">📋</span>
                    <h3>No Transactions Yet</h3>
                    <p>Start shopping for your dream car!</p>
                    <Link to="/catalog" className="btn-browse">Browse Cars</Link>
                </div>
            ) : (
                <div className="transactions-list">
                    {transactions.map((transaction) => (
                        <div key={transaction.id} className="transaction-card">
                            <div className="transaction-header">
                                <div className="transaction-info">
                                    <h3>{transaction.carBrand} {transaction.carModel} ({transaction.carYear})</h3>
                                    <p className="transaction-id">Transaction #{transaction.id}</p>
                                </div>
                                <span className={`status-badge ${getStatusBadge(transaction.status)}`}>
                                    {transaction.status}
                                </span>
                            </div>

                            <div className="transaction-details">
                                <div className="detail-row">
                                    <span className="detail-label">Total Price:</span>
                                    <span className="detail-value price">{formatPrice(transaction.totalPrice)}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Payment Method:</span>
                                    <span className="detail-value">{transaction.paymentMethod}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Transaction Date:</span>
                                    <span className="detail-value">{formatDate(transaction.transactionDate)}</span>
                                </div>
                                {transaction.payment?.paymentProofUrl && (
                                    <div className="detail-row">
                                        <span className="detail-label">Payment Proof:</span>
                                        <a
                                            href={transaction.payment.paymentProofUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="proof-link"
                                        >
                                            View Proof
                                        </a>
                                    </div>
                                )}
                                {transaction.adminNotes && (
                                    <div className="detail-row admin-notes">
                                        <span className="detail-label">Admin Notes:</span>
                                        <span className="detail-value">{transaction.adminNotes}</span>
                                    </div>
                                )}
                            </div>

                            {transaction.status === 'Pending' && transaction.paymentMethod === 'BankTransfer' && (
                                <div className="upload-section">
                                    {uploadingId === transaction.id ? (
                                        <div className="upload-form">
                                            <input
                                                type="text"
                                                placeholder="Enter payment proof URL (e.g., image URL)"
                                                value={paymentProofUrl}
                                                onChange={(e) => setPaymentProofUrl(e.target.value)}
                                                className="upload-input"
                                            />
                                            <div className="upload-buttons">
                                                <button
                                                    className="btn-upload-submit"
                                                    onClick={() => handleUploadProof(transaction.id)}
                                                >
                                                    Submit
                                                </button>
                                                <button
                                                    className="btn-upload-cancel"
                                                    onClick={() => {
                                                        setUploadingId(null);
                                                        setPaymentProofUrl('');
                                                    }}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <button
                                            className="btn-upload-proof"
                                            onClick={() => setUploadingId(transaction.id)}
                                        >
                                            {transaction.payment?.paymentProofUrl ? 'Update Payment Proof' : 'Upload Payment Proof'}
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Transactions;

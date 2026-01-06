import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import carService from '../services/carService';
import transactionService from '../services/transactionService';
import './Catalog.css';

const Catalog = () => {
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();

    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedCar, setSelectedCar] = useState(null);
    const [showCheckoutModal, setShowCheckoutModal] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('Cash');
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        fetchCars();
    }, []);

    const fetchCars = async () => {
        setLoading(true);
        try {
            const data = await carService.getAllCars();
            // Filter only available cars with stock > 0
            const availableCars = data.filter(car => car.stock > 0 && car.status === 'Available');
            setCars(availableCars);
        } catch (err) {
            setError('Failed to load cars');
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

    const handleBuyNow = (car) => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        if (user?.role === 'Admin') {
            alert('Admin cannot purchase cars');
            return;
        }

        setSelectedCar(car);
        setPaymentMethod('Cash');
        setShowCheckoutModal(true);
    };

    const handleConfirmPurchase = async () => {
        if (!selectedCar) return;

        setProcessing(true);
        setError('');

        try {
            await transactionService.createTransaction(selectedCar.id, paymentMethod);

            setShowCheckoutModal(false);
            setSelectedCar(null);

            // Show success message
            alert(
                paymentMethod === 'Cash'
                    ? 'Purchase successful! Your transaction has been completed.'
                    : 'Transaction created! Please upload your payment proof in the Transactions page.'
            );

            // Navigate to transactions page
            navigate('/transactions');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create transaction');
            console.error(err);
        } finally {
            setProcessing(false);
        }
    };

    const closeModal = () => {
        setShowCheckoutModal(false);
        setSelectedCar(null);
        setError('');
    };

    if (loading) {
        return (
            <div className="catalog-loading">
                <div className="loading-spinner"></div>
                <p>Loading cars...</p>
            </div>
        );
    }

    return (
        <div className="catalog-container">
            <div className="catalog-header">
                <h1>Buy Your Dream Car</h1>
                <p>Browse our collection of premium vehicles available for purchase</p>
            </div>

            {cars.length === 0 ? (
                <div className="empty-catalog">
                    <span className="empty-icon">🚗</span>
                    <h3>No Cars Available</h3>
                    <p>Check back later for new arrivals</p>
                </div>
            ) : (
                <div className="cars-grid">
                    {cars.map((car) => (
                        <div key={car.id} className="car-card">
                            <div className="car-image">
                                {car.images && car.images.length > 0 ? (
                                    <img src={car.images[0].imageUrl} alt={`${car.brand} ${car.model}`} />
                                ) : (
                                    <div className="no-image">No Image</div>
                                )}
                                {car.isFeatured && <span className="featured-badge">Featured</span>}
                            </div>

                            <div className="car-info">
                                <h3 className="car-title">{car.brand} {car.model}</h3>
                                <p className="car-year">{car.year}</p>
                                <p className="car-price">{formatPrice(car.price)}</p>

                                <div className="car-specs">
                                    <span className="spec-item">
                                        <span className="spec-icon">⚙️</span>
                                        {car.transmission}
                                    </span>
                                    <span className="spec-item">
                                        <span className="spec-icon">⛽</span>
                                        {car.fuelType}
                                    </span>
                                    <span className="spec-item">
                                        <span className="spec-icon">👥</span>
                                        {car.seats} Seats
                                    </span>
                                </div>

                                <div className="car-stock">
                                    <span className="stock-badge">Stock: {car.stock}</span>
                                </div>

                                <button
                                    className="btn-buy-now"
                                    onClick={() => handleBuyNow(car)}
                                >
                                    Buy Now
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Checkout Modal */}
            {showCheckoutModal && selectedCar && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Checkout</h2>
                            <button className="modal-close" onClick={closeModal}>&times;</button>
                        </div>

                        <div className="modal-body">
                            {error && <div className="error-message">{error}</div>}

                            <div className="checkout-summary">
                                <h3>Order Summary</h3>
                                <div className="summary-item">
                                    <span className="summary-label">Car:</span>
                                    <span className="summary-value">{selectedCar.brand} {selectedCar.model} ({selectedCar.year})</span>
                                </div>
                                <div className="summary-item">
                                    <span className="summary-label">Price:</span>
                                    <span className="summary-value">{formatPrice(selectedCar.price)}</span>
                                </div>
                            </div>

                            <div className="payment-method-section">
                                <h3>Payment Method</h3>
                                <div className="payment-options">
                                    <label className={`payment-option ${paymentMethod === 'Cash' ? 'selected' : ''}`}>
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="Cash"
                                            checked={paymentMethod === 'Cash'}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                        />
                                        <div className="option-content">
                                            <span className="option-icon">💵</span>
                                            <div className="option-text">
                                                <strong>Cash</strong>
                                                <small>Pay directly at our showroom</small>
                                            </div>
                                        </div>
                                    </label>

                                    <label className={`payment-option ${paymentMethod === 'BankTransfer' ? 'selected' : ''}`}>
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="BankTransfer"
                                            checked={paymentMethod === 'BankTransfer'}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                        />
                                        <div className="option-content">
                                            <span className="option-icon">🏦</span>
                                            <div className="option-text">
                                                <strong>Bank Transfer</strong>
                                                <small>Transfer to our bank account</small>
                                            </div>
                                        </div>
                                    </label>
                                </div>

                                {paymentMethod === 'BankTransfer' && (
                                    <div className="bank-info">
                                        <h4>Bank Account Information</h4>
                                        <div className="bank-details">
                                            <p><strong>Bank:</strong> Bank Central Asia (BCA)</p>
                                            <p><strong>Account Number:</strong> 1234567890</p>
                                            <p><strong>Account Name:</strong> Car Showroom Indonesia</p>
                                        </div>
                                        <p className="bank-note">
                                            After completing the transfer, please upload your payment proof in the Transactions page.
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="modal-footer">
                                <button className="btn-cancel" onClick={closeModal} disabled={processing}>
                                    Cancel
                                </button>
                                <button
                                    className="btn-confirm"
                                    onClick={handleConfirmPurchase}
                                    disabled={processing}
                                >
                                    {processing ? 'Processing...' : 'Confirm Purchase'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Catalog;

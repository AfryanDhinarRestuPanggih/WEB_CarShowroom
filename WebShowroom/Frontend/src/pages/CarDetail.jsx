import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import carService from '../services/carService';
import testDriveService from '../services/testDriveService';
import inquiryService from '../services/inquiryService';
import wishlistService from '../services/wishlistService';
import { useAuth } from '../context/AuthContext';
import './CarDetail.css';

const CarDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('details');
  const [inWishlist, setInWishlist] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [testDriveData, setTestDriveData] = useState({
    requestedDate: '',
    requestedTime: '',
    notes: ''
  });

  const [inquiryData, setInquiryData] = useState({
    subject: '',
    message: ''
  });

  const [testDriveSubmitting, setTestDriveSubmitting] = useState(false);
  const [inquirySubmitting, setInquirySubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchCarDetails();
  }, [id]);

  useEffect(() => {
    if (car && user) {
      checkWishlistStatus();
    }
  }, [car, user]);

  const fetchCarDetails = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await carService.getCarById(id);
      setCar(data);
    } catch (err) {
      setError('Failed to load car details. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const checkWishlistStatus = async () => {
    try {
      const response = await wishlistService.checkWishlist(id);
      setInWishlist(response.inWishlist);
    } catch (err) {
      console.error('Error checking wishlist status:', err);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleTestDriveChange = (e) => {
    setTestDriveData({
      ...testDriveData,
      [e.target.name]: e.target.value
    });
  };

  const handleInquiryChange = (e) => {
    setInquiryData({
      ...inquiryData,
      [e.target.name]: e.target.value
    });
  };

  const handleTestDriveSubmit = async (e) => {
    e.preventDefault();
    setTestDriveSubmitting(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      await testDriveService.createTestDrive({
        carId: parseInt(id),
        ...testDriveData
      });
      setSuccessMessage('Test drive request submitted successfully! We will contact you soon.');
      setTestDriveData({ requestedDate: '', requestedTime: '', notes: '' });
    } catch (err) {
      setErrorMessage(err.message || 'Failed to submit test drive request.');
    } finally {
      setTestDriveSubmitting(false);
    }
  };

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    setInquirySubmitting(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      await inquiryService.createInquiry({
        carId: parseInt(id),
        ...inquiryData
      });
      setSuccessMessage('Inquiry submitted successfully! We will respond as soon as possible.');
      setInquiryData({ subject: '', message: '' });
    } catch (err) {
      setErrorMessage(err.message || 'Failed to submit inquiry.');
    } finally {
      setInquirySubmitting(false);
    }
  };

  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      if (inWishlist) {
        await wishlistService.removeFromWishlist(id);
        setInWishlist(false);
      } else {
        await wishlistService.addToWishlist(id);
        setInWishlist(true);
      }
    } catch (err) {
      setErrorMessage('Failed to update wishlist.');
    }
  };

  const nextImage = () => {
    if (car?.images?.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % car.images.length);
    }
  };

  const prevImage = () => {
    if (car?.images?.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + car.images.length) % car.images.length);
    }
  };

  if (loading) {
    return (
      <div className="car-detail-loading">
        <div className="loading-spinner"></div>
        <p>Loading car details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="car-detail-error">
        <h2>Error Loading Car Details</h2>
        <p>{error}</p>
        <Link to="/" className="btn-back">Back to Collection</Link>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="car-detail-not-found">
        <h2>Car Not Found</h2>
        <p>The car you're looking for doesn't exist.</p>
        <Link to="/" className="btn-back">Back to Collection</Link>
      </div>
    );
  }

  return (
    <div className="car-detail-container">
      <div className="car-detail-breadcrumb">
        <Link to="/">Home</Link> / <Link to="/#collection">Collection</Link> / <span>{car.brand} {car.model}</span>
      </div>

      <div className="car-detail-main">
        <div className="car-detail-gallery">
          <div className="main-image-container">
            {car.images && car.images.length > 0 ? (
              <img
                src={car.images[currentImageIndex]?.imageUrl}
                alt={`${car.brand} ${car.model}`}
                className="main-image"
              />
            ) : (
              <div className="no-image-placeholder">
                <span>🚗</span>
                <p>No Image Available</p>
              </div>
            )}
            {car.images && car.images.length > 1 && (
              <>
                <button className="gallery-nav prev" onClick={prevImage}>❮</button>
                <button className="gallery-nav next" onClick={nextImage}>❯</button>
              </>
            )}
            {car.isFeatured && <span className="featured-badge">⭐ Featured</span>}
          </div>
          {car.images && car.images.length > 1 && (
            <div className="thumbnail-container">
              {car.images.map((img, index) => (
                <img
                  key={index}
                  src={img.imageUrl}
                  alt={`${car.brand} ${car.model} ${index + 1}`}
                  className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="car-detail-info">
          <div className="car-header">
            <h1 className="car-title">{car.brand} {car.model}</h1>
            <span className="car-year-badge">{car.year}</span>
          </div>

          <p className="car-price">{formatPrice(car.price)}</p>

          <div className="car-specs-grid">
            <div className="spec-item">
              <span className="spec-icon">⚙️</span>
              <span className="spec-label">Transmission</span>
              <span className="spec-value">{car.transmission}</span>
            </div>
            <div className="spec-item">
              <span className="spec-icon">⛽</span>
              <span className="spec-label">Fuel Type</span>
              <span className="spec-value">{car.fuelType}</span>
            </div>
            <div className="spec-item">
              <span className="spec-icon">👥</span>
              <span className="spec-label">Seats</span>
              <span className="spec-value">{car.seats || 'N/A'}</span>
            </div>
            <div className="spec-item">
              <span className="spec-icon">🚗</span>
              <span className="spec-label">Body Type</span>
              <span className="spec-value">{car.bodyType || 'N/A'}</span>
            </div>
            <div className="spec-item">
              <span className="spec-icon">🎨</span>
              <span className="spec-label">Color</span>
              <span className="spec-value">{car.color || 'N/A'}</span>
            </div>
            <div className="spec-item">
              <span className="spec-icon">📊</span>
              <span className="spec-label">Mileage</span>
              <span className="spec-value">{car.mileage ? `${car.mileage.toLocaleString()} km` : '0 km'}</span>
            </div>
          </div>

          <div className="car-actions">
            <button
              className={`btn-wishlist ${inWishlist ? 'active' : ''}`}
              onClick={handleWishlistToggle}
            >
              {inWishlist ? '❤️ Saved' : '🤍 Add to Wishlist'}
            </button>
          </div>
        </div>
      </div>

      <div className="car-detail-tabs">
        <div className="tabs-header">
          <button
            className={`tab-btn ${activeTab === 'details' ? 'active' : ''}`}
            onClick={() => setActiveTab('details')}
          >
            Details
          </button>
          <button
            className={`tab-btn ${activeTab === 'testdrive' ? 'active' : ''}`}
            onClick={() => setActiveTab('testdrive')}
          >
            Test Drive
          </button>
          <button
            className={`tab-btn ${activeTab === 'inquiry' ? 'active' : ''}`}
            onClick={() => setActiveTab('inquiry')}
          >
            Inquiry
          </button>
        </div>

        <div className="tabs-content">
          {activeTab === 'details' && (
            <div className="tab-panel">
              <div className="detail-section">
                <h3>Description</h3>
                <p>{car.description || 'No description available.'}</p>
              </div>
              <div className="detail-section">
                <h3>Features</h3>
                <p>{car.features || 'No features listed.'}</p>
              </div>
              <div className="detail-section">
                <h3>Engine & Performance</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">Engine Capacity</span>
                    <span className="detail-value">{car.engineCapacity || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Stock Status</span>
                    <span className="detail-value">{car.stock > 0 ? `In Stock (${car.stock})` : 'Out of Stock'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'testdrive' && (
            <div className="tab-panel">
              <h3>Schedule a Test Drive</h3>
              <p className="tab-description">Experience this amazing vehicle firsthand. Fill out the form below to schedule your test drive.</p>

              {successMessage && (
                <div className="success-message">{successMessage}</div>
              )}
              {errorMessage && (
                <div className="error-message">{errorMessage}</div>
              )}

              {!isAuthenticated ? (
                <div className="auth-required">
                  <p>Please log in to schedule a test drive.</p>
                  <Link to="/login" className="btn-login">Login</Link>
                  <Link to="/register" className="btn-register">Register</Link>
                </div>
              ) : (
                <form className="test-drive-form" onSubmit={handleTestDriveSubmit}>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="requestedDate">Preferred Date *</label>
                      <input
                        type="date"
                        id="requestedDate"
                        name="requestedDate"
                        value={testDriveData.requestedDate}
                        onChange={handleTestDriveChange}
                        min={new Date().toISOString().split('T')[0]}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="requestedTime">Preferred Time *</label>
                      <select
                        id="requestedTime"
                        name="requestedTime"
                        value={testDriveData.requestedTime}
                        onChange={handleTestDriveChange}
                        required
                      >
                        <option value="">Select Time</option>
                        <option value="09:00">09:00 AM</option>
                        <option value="10:00">10:00 AM</option>
                        <option value="11:00">11:00 AM</option>
                        <option value="12:00">12:00 PM</option>
                        <option value="13:00">01:00 PM</option>
                        <option value="14:00">02:00 PM</option>
                        <option value="15:00">03:00 PM</option>
                        <option value="16:00">04:00 PM</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="notes">Additional Notes</label>
                    <textarea
                      id="notes"
                      name="notes"
                      value={testDriveData.notes}
                      onChange={handleTestDriveChange}
                      placeholder="Any special requests or questions?"
                      rows={4}
                    />
                  </div>
                  <button type="submit" className="btn-submit" disabled={testDriveSubmitting}>
                    {testDriveSubmitting ? 'Submitting...' : 'Schedule Test Drive'}
                  </button>
                </form>
              )}
            </div>
          )}

          {activeTab === 'inquiry' && (
            <div className="tab-panel">
              <h3>Send an Inquiry</h3>
              <p className="tab-description">Have questions about this vehicle? Send us a message and we'll get back to you.</p>

              {successMessage && (
                <div className="success-message">{successMessage}</div>
              )}
              {errorMessage && (
                <div className="error-message">{errorMessage}</div>
              )}

              {!isAuthenticated ? (
                <div className="auth-required">
                  <p>Please log in to send an inquiry.</p>
                  <Link to="/login" className="btn-login">Login</Link>
                  <Link to="/register" className="btn-register">Register</Link>
                </div>
              ) : (
                <form className="inquiry-form" onSubmit={handleInquirySubmit}>
                  <div className="form-group">
                    <label htmlFor="subject">Subject *</label>
                    <select
                      id="subject"
                      name="subject"
                      value={inquiryData.subject}
                      onChange={handleInquiryChange}
                      required
                    >
                      <option value="">Select Subject</option>
                      <option value="Price Inquiry">Price Inquiry</option>
                      <option value="Availability">Availability</option>
                      <option value="Financing Options">Financing Options</option>
                      <option value="Trade-in">Trade-in</option>
                      <option value="Features">Features & Specifications</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="message">Message *</label>
                    <textarea
                      id="message"
                      name="message"
                      value={inquiryData.message}
                      onChange={handleInquiryChange}
                      placeholder="Your message..."
                      rows={5}
                      required
                    />
                  </div>
                  <button type="submit" className="btn-submit" disabled={inquirySubmitting}>
                    {inquirySubmitting ? 'Submitting...' : 'Send Inquiry'}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarDetail;

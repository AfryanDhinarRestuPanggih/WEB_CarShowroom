import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import wishlistService from '../services/wishlistService';
import { useAuth } from '../context/AuthContext';
import './Wishlist.css';

const Wishlist = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [removingId, setRemovingId] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchWishlist();
  }, [isAuthenticated, navigate]);

  const fetchWishlist = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await wishlistService.getWishlist();
      setWishlist(data);
    } catch (err) {
      setError('Failed to load wishlist. Please try again.');
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

  const handleRemoveFromWishlist = async (carId, e) => {
    e.preventDefault();
    e.stopPropagation();
    setRemovingId(carId);

    try {
      await wishlistService.removeFromWishlist(carId);
      setWishlist(wishlist.filter(car => car.id !== carId));
    } catch (err) {
      setError('Failed to remove car from wishlist.');
      console.error(err);
    } finally {
      setRemovingId(null);
    }
  };

  if (loading) {
    return (
      <div className="wishlist-loading">
        <div className="loading-spinner"></div>
        <p>Loading wishlist...</p>
      </div>
    );
  }

  return (
    <div className="wishlist-container">
      <div className="wishlist-header">
        <h1>My Wishlist</h1>
        <p>{wishlist.length} {wishlist.length === 1 ? 'car' : 'cars'} saved</p>
      </div>

      {error && (
        <div className="wishlist-error">
          <p>{error}</p>
        </div>
      )}

      {wishlist.length === 0 ? (
        <div className="wishlist-empty">
          <div className="empty-icon">💔</div>
          <h2>Your wishlist is empty</h2>
          <p>Start exploring our collection and save your favorite cars!</p>
          <Link to="/" className="btn-browse">Browse Cars</Link>
        </div>
      ) : (
        <div className="wishlist-grid">
          {wishlist.map((car, index) => (
            <Link
              to={`/cars/${car.id}`}
              key={car.id}
              className="wishlist-card"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="wishlist-image-wrapper">
                {car.images && car.images.length > 0 ? (
                  <img
                    src={car.images[0].imageUrl}
                    alt={`${car.brand} ${car.model}`}
                    className="wishlist-image"
                  />
                ) : (
                  <div className="wishlist-no-image">
                    <span>🚗</span>
                    <p>Image Coming Soon</p>
                  </div>
                )}
                <button
                  className="btn-remove"
                  onClick={(e) => handleRemoveFromWishlist(car.id, e)}
                  disabled={removingId === car.id}
                  title="Remove from wishlist"
                >
                  {removingId === car.id ? (
                    <div className="removing-spinner"></div>
                  ) : (
                    '✕'
                  )}
                </button>
              </div>

              <div className="wishlist-info">
                <div className="wishlist-header-info">
                  <h3 className="wishlist-title">{car.brand} {car.model}</h3>
                  <span className="wishlist-year">{car.year}</span>
                </div>

                <p className="wishlist-price">{formatPrice(car.price)}</p>

                <div className="wishlist-actions">
                  <span className="btn-view">View Details →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {wishlist.length > 0 && (
        <div className="wishlist-cta">
          <Link to="/" className="btn-browse-more">
            Continue Browsing
          </Link>
        </div>
      )}
    </div>
  );
};

export default Wishlist;

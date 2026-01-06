import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import carService from '../services/carService';
import './Home.css';

const Home = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    brand: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  useEffect(() => {
    fetchCars();
  }, [filters]);

  const fetchCars = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await carService.getCars(filters);
      setCars(data);
    } catch (err) {
      setError('Failed to load cars. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="home-container">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="hero-text">
            <span className="hero-subtitle">Premium Automotive Excellence</span>
            <h1 className="hero-title">
              Discover Your
              <span className="hero-highlight"> Dream Car</span>
            </h1>
            <p className="hero-description">
              Experience luxury and performance with our curated collection of premium vehicles.
              Your journey to automotive excellence starts here.
            </p>
            <div className="hero-buttons">
              <Link to="#collection" className="btn-primary-hero">
                Explore Collection
              </Link>
              <Link to="/register" className="btn-secondary-hero">
                Get Started
              </Link>
            </div>
          </div>
        </div>
        <div className="hero-scroll-indicator">
          <span>Scroll to explore</span>
          <div className="scroll-arrow"></div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="stats-section">
        <div className="stats-container">
          <div className="stat-item">
            <h3 className="stat-number">{cars.length}+</h3>
            <p className="stat-label">Premium Vehicles</p>
          </div>
          <div className="stat-item">
            <h3 className="stat-number">100%</h3>
            <p className="stat-label">Quality Assured</p>
          </div>
          <div className="stat-item">
            <h3 className="stat-number">24/7</h3>
            <p className="stat-label">Customer Support</p>
          </div>
          <div className="stat-item">
            <h3 className="stat-number">5★</h3>
            <p className="stat-label">Customer Rating</p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="features-section">
        <div className="features-container">
          <div className="feature-card">
            <div className="feature-icon">🚗</div>
            <h3>Premium Selection</h3>
            <p>Handpicked collection of luxury and performance vehicles</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">✓</div>
            <h3>Quality Guarantee</h3>
            <p>Every vehicle undergoes rigorous inspection and certification</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔧</div>
            <h3>Expert Service</h3>
            <p>Professional maintenance and after-sales support</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💎</div>
            <h3>Best Value</h3>
            <p>Competitive pricing with flexible financing options</p>
          </div>
        </div>
      </div>

      {/* Collection Section */}
      <div id="collection" className="collection-section">
        <div className="section-header">
          <span className="section-subtitle">Our Collection</span>
          <h2 className="section-title">Premium Vehicles</h2>
          <p className="section-description">
            Explore our carefully curated selection of luxury and performance vehicles
          </p>
        </div>

        {/* Advanced Filters */}
        <div className="filters-section">
          <div className="filters-container">
            <div className="filter-group">
              <label>Search Brand</label>
              <input
                type="text"
                name="brand"
                placeholder="e.g., Toyota, Honda..."
                value={filters.brand}
                onChange={handleFilterChange}
                className="filter-input"
              />
            </div>

            <div className="filter-group">
              <label>Min Price</label>
              <input
                type="number"
                name="minPrice"
                placeholder="Rp 0"
                value={filters.minPrice}
                onChange={handleFilterChange}
                className="filter-input"
              />
            </div>

            <div className="filter-group">
              <label>Max Price</label>
              <input
                type="number"
                name="maxPrice"
                placeholder="Rp 999,999,999"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                className="filter-input"
              />
            </div>

            <div className="filter-group">
              <label>Sort By</label>
              <select
                name="sortBy"
                value={filters.sortBy}
                onChange={handleFilterChange}
                className="filter-select"
              >
                <option value="createdAt">Newest First</option>
                <option value="price">Price</option>
                <option value="year">Year</option>
                <option value="brand">Brand</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Order</label>
              <select
                name="sortOrder"
                value={filters.sortOrder}
                onChange={handleFilterChange}
                className="filter-select"
              >
                <option value="asc">Low to High</option>
                <option value="desc">High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading premium vehicles...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="error-container">
            <p>{error}</p>
          </div>
        )}

        {/* No Cars State */}
        {!loading && !error && cars.length === 0 && (
          <div className="no-cars">
            <div className="no-cars-icon">🔍</div>
            <h3>No vehicles found</h3>
            <p>Try adjusting your filters to see more results</p>
          </div>
        )}

        {/* Cars Grid */}
        {!loading && !error && cars.length > 0 && (
          <div className="cars-grid">
            {cars.map((car, index) => (
              <div 
                key={car.id} 
                className="car-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="car-image-wrapper">
                  {car.images && car.images.length > 0 ? (
                    <img 
                      src={car.images[0].imageUrl} 
                      alt={`${car.brand} ${car.model}`}
                      className="car-image"
                    />
                  ) : (
                    <div className="no-image">
                      <span>🚗</span>
                      <p>Image Coming Soon</p>
                    </div>
                  )}
                  {car.isFeatured && (
                    <span className="featured-badge">
                      <span className="badge-icon">⭐</span>
                      Featured
                    </span>
                  )}
                  <div className="car-overlay">
                    <Link to={`/cars/${car.id}`} className="btn-quick-view">
                      Quick View
                    </Link>
                  </div>
                </div>

                <div className="car-info">
                  <div className="car-header">
                    <h3 className="car-name">{car.brand} {car.model}</h3>
                    <span className="car-year">{car.year}</span>
                  </div>
                  
                  <p className="car-price">{formatPrice(car.price)}</p>

                  <div className="car-specs">
                    <div className="spec-item">
                      <span className="spec-icon">⚙️</span>
                      <span>{car.transmission}</span>
                    </div>
                    <div className="spec-item">
                      <span className="spec-icon">⛽</span>
                      <span>{car.fuelType}</span>
                    </div>
                    {car.seats && (
                      <div className="spec-item">
                        <span className="spec-icon">👥</span>
                        <span>{car.seats} Seats</span>
                      </div>
                    )}
                  </div>

                  <Link to={`/cars/${car.id}`} className="btn-view-details">
                    View Full Details
                    <span className="btn-arrow">→</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="cta-section">
        <div className="cta-content">
          <h2>Ready to Find Your Perfect Car?</h2>
          <p>Join thousands of satisfied customers who found their dream vehicles with us</p>
          <div className="cta-buttons">
            <Link to="/register" className="btn-cta-primary">
              Get Started Today
            </Link>
            <Link to="/login" className="btn-cta-secondary">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

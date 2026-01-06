import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import carService from '../services/carService';
import './AdminCars.css';

const AdminCars = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [deletingCar, setDeletingCar] = useState(null);
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    price: '',
    color: '',
    fuelType: 'Bensin',
    transmission: 'Automatic',
    mileage: 0,
    engineCapacity: '',
    seats: 5,
    bodyType: 'Sedan',
    description: '',
    features: '',
    stock: 1,
    isFeatured: false
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'Admin') {
      navigate('/admin/login');
      return;
    }
    fetchCars();
  }, [isAuthenticated, user, navigate]);

  const fetchCars = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await carService.getCars();
      setCars(data);
    } catch (err) {
      setError('Failed to load cars.');
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
      day: 'numeric'
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const openAddModal = () => {
    setEditingCar(null);
    setFormData({
      brand: '',
      model: '',
      year: new Date().getFullYear(),
      price: '',
      color: '',
      fuelType: 'Bensin',
      transmission: 'Automatic',
      mileage: 0,
      engineCapacity: '',
      seats: 5,
      bodyType: 'Sedan',
      description: '',
      features: '',
      stock: 1,
      isFeatured: false
    });
    setShowModal(true);
    setFormError('');
    setFormSuccess('');
  };

  const openEditModal = (car) => {
    setEditingCar(car);
    setFormData({
      brand: car.brand,
      model: car.model,
      year: car.year,
      price: car.price.toString(),
      color: car.color || '',
      fuelType: car.fuelType,
      transmission: car.transmission,
      mileage: car.mileage || 0,
      engineCapacity: car.engineCapacity || '',
      seats: car.seats || 5,
      bodyType: car.bodyType || 'Sedan',
      description: car.description || '',
      features: car.features || '',
      stock: car.stock,
      isFeatured: car.isFeatured
    });
    setShowModal(true);
    setFormError('');
    setFormSuccess('');
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCar(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError('');
    setFormSuccess('');

    try {
      const carData = {
        ...formData,
        price: parseFloat(formData.price),
        mileage: parseInt(formData.mileage),
        seats: parseInt(formData.seats),
        stock: parseInt(formData.stock)
      };

      if (editingCar) {
        await carService.updateCar(editingCar.id, carData);
        setFormSuccess('Car updated successfully!');
      } else {
        await carService.createCar(carData);
        setFormSuccess('Car created successfully!');
      }

      setTimeout(() => {
        closeModal();
        fetchCars();
      }, 1500);
    } catch (err) {
      setFormError(err.message || 'Failed to save car.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (carId) => {
    if (!window.confirm('Are you sure you want to delete this car?')) return;

    setDeletingCar(carId);
    try {
      await carService.deleteCar(carId);
      fetchCars();
    } catch (err) {
      setError('Failed to delete car.');
      console.error(err);
    } finally {
      setDeletingCar(null);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>Loading cars...</p>
      </div>
    );
  }

  return (
    <div className="admin-cars-container">
      <div className="admin-sidebar">
        <div className="admin-logo">
          <h2>Admin Panel</h2>
        </div>

        <nav className="admin-nav">
          <Link to="/admin" className="nav-item">
            <span className="nav-icon">📊</span>
            Dashboard
          </Link>
          <Link to="/admin/cars" className="nav-item active">
            <span className="nav-icon">🚗</span>
            Manage Cars
          </Link>
          <Link to="/admin/test-drives" className="nav-item">
            <span className="nav-icon">📅</span>
            Test Drives
          </Link>
          <Link to="/admin/inquiries" className="nav-item">
            <span className="nav-icon">💬</span>
            Inquiries
          </Link>
        </nav>

        <div className="admin-user">
          <div className="admin-user-info">
            <span className="admin-user-name">{user?.fullName || 'Admin'}</span>
            <span className="admin-user-role">Administrator</span>
          </div>
          <button className="btn-admin-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="admin-main">
        <div className="admin-header">
          <div>
            <h1>Manage Cars</h1>
            <p>Add, edit, and manage your car inventory</p>
          </div>
          <button className="btn-add-car" onClick={openAddModal}>
            + Add New Car
          </button>
        </div>

        {error && (
          <div className="admin-error">
            <p>{error}</p>
          </div>
        )}

        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Car Details</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Featured</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cars.map((car) => (
                <tr key={car.id}>
                  <td>
                    <div className="car-thumbnail">
                      {car.images && car.images.length > 0 ? (
                        <img src={car.images[0].imageUrl} alt={`${car.brand} ${car.model}`} />
                      ) : (
                        <div className="no-image">🚗</div>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="car-details">
                      <span className="car-name">{car.brand} {car.model}</span>
                      <span className="car-meta">{car.year} • {car.transmission} • {car.fuelType}</span>
                    </div>
                  </td>
                  <td className="car-price">{formatPrice(car.price)}</td>
                  <td>
                    <span className={`stock-badge ${car.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                      {car.stock > 0 ? `${car.stock} in stock` : 'Out of stock'}
                    </span>
                  </td>
                  <td>
                    {car.isFeatured ? (
                      <span className="featured-badge">⭐ Yes</span>
                    ) : (
                      <span className="not-featured">No</span>
                    )}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-edit" onClick={() => openEditModal(car)}>
                        Edit
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(car.id)}
                        disabled={deletingCar === car.id}
                      >
                        {deletingCar === car.id ? '...' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {cars.length === 0 && (
            <div className="empty-state">
              <span className="empty-icon">🚗</span>
              <h3>No Cars Yet</h3>
              <p>Add your first car to the inventory.</p>
              <button className="btn-add-car" onClick={openAddModal}>
                + Add New Car
              </button>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingCar ? 'Edit Car' : 'Add New Car'}</h2>
              <button className="btn-close" onClick={closeModal}>✕</button>
            </div>

            <form className="car-form" onSubmit={handleSubmit}>
              {formError && <div className="form-error">{formError}</div>}
              {formSuccess && <div className="form-success">{formSuccess}</div>}

              <div className="form-row">
                <div className="form-group">
                  <label>Brand *</label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    placeholder="e.g., Toyota"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Model *</label>
                  <input
                    type="text"
                    name="model"
                    value={formData.model}
                    onChange={handleInputChange}
                    placeholder="e.g., Camry"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Year *</label>
                  <input
                    type="number"
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    min="1990"
                    max="2030"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Price (IDR) *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="e.g., 250000000"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Fuel Type</label>
                  <select name="fuelType" value={formData.fuelType} onChange={handleInputChange}>
                    <option value="Bensin">Bensin</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Electric">Electric</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Transmission</label>
                  <select name="transmission" value={formData.transmission} onChange={handleInputChange}>
                    <option value="Manual">Manual</option>
                    <option value="Automatic">Automatic</option>
                    <option value="CVT">CVT</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Color</label>
                  <input
                    type="text"
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                    placeholder="e.g., Silver"
                  />
                </div>
                <div className="form-group">
                  <label>Body Type</label>
                  <select name="bodyType" value={formData.bodyType} onChange={handleInputChange}>
                    <option value="Sedan">Sedan</option>
                    <option value="SUV">SUV</option>
                    <option value="MPV">MPV</option>
                    <option value="Hatchback">Hatchback</option>
                    <option value="Coupe">Coupe</option>
                    <option value="Pickup">Pickup</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Seats</label>
                  <input
                    type="number"
                    name="seats"
                    value={formData.seats}
                    onChange={handleInputChange}
                    min="2"
                    max="12"
                  />
                </div>
                <div className="form-group">
                  <label>Stock</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    min="0"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Car description..."
                  rows={3}
                />
              </div>

              <div className="form-group">
                <label>Features</label>
                <textarea
                  name="features"
                  value={formData.features}
                  onChange={handleInputChange}
                  placeholder="AC, Power Steering, Power Window, etc."
                  rows={2}
                />
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleInputChange}
                  />
                  <span>Featured Car</span>
                </label>
              </div>

              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit" disabled={formLoading}>
                  {formLoading ? 'Saving...' : (editingCar ? 'Update Car' : 'Add Car')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCars;

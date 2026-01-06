import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import testDriveService from '../services/testDriveService';
import inquiryService from '../services/inquiryService';
import wishlistService from '../services/wishlistService';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const [activeTab, setActiveTab] = useState('overview');
  const [testDrives, setTestDrives] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated || user?.role === 'Admin') {
      navigate('/');
      return;
    }
    fetchUserData();
  }, [isAuthenticated, user, navigate]);

  const fetchUserData = async () => {
    setLoading(true);
    setError('');
    try {
      const [testDrivesData, inquiriesData, wishlistData] = await Promise.all([
        testDriveService.getUserTestDrives(),
        inquiryService.getUserInquiries(),
        wishlistService.getWishlist()
      ]);
      setTestDrives(testDrivesData);
      setInquiries(inquiriesData);
      setWishlistCount(wishlistData.length);
    } catch (err) {
      setError('Failed to load dashboard data.');
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
      day: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      Pending: 'warning',
      Approved: 'success',
      Rejected: 'danger',
      Completed: 'info',
      Cancelled: 'secondary',
      Responded: 'success',
      Resolved: 'info',
      Closed: 'secondary'
    };
    return statusColors[status] || 'secondary';
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  const stats = [
    { label: 'Test Drives', value: testDrives.length, icon: '🚗', color: '#2563eb' },
    { label: 'Inquiries', value: inquiries.length, icon: '💬', color: '#7c3aed' },
    { label: 'Wishlist', value: wishlistCount, icon: '❤️', color: '#dc2626' },
    { label: 'Member Since', value: '2024', icon: '📅', color: '#059669' }
  ];

  return (
    <div className="dashboard-container">
      <div className="dashboard-sidebar">
        <div className="user-profile">
          <div className="user-avatar">
            {user?.fullName?.charAt(0).toUpperCase() || 'U'}
          </div>
          <h3 className="user-name">{user?.fullName || 'User'}</h3>
          <p className="user-email">{user?.email}</p>
        </div>

        <nav className="dashboard-nav">
          <button
            className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <span className="nav-icon">📊</span>
            Overview
          </button>
          <button
            className={`nav-item ${activeTab === 'testdrives' ? 'active' : ''}`}
            onClick={() => setActiveTab('testdrives')}
          >
            <span className="nav-icon">🚗</span>
            My Test Drives
          </button>
          <button
            className={`nav-item ${activeTab === 'inquiries' ? 'active' : ''}`}
            onClick={() => setActiveTab('inquiries')}
          >
            <span className="nav-icon">💬</span>
            My Inquiries
          </button>
          <button
            className={`nav-item ${activeTab === 'wishlist' ? 'active' : ''}`}
            onClick={() => setActiveTab('wishlist')}
          >
            <span className="nav-icon">❤️</span>
            Wishlist
          </button>
          <button
            className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <span className="nav-icon">⚙️</span>
            Settings
          </button>
        </nav>

        <button className="btn-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="dashboard-main">
        {error && (
          <div className="dashboard-error">
            <p>{error}</p>
          </div>
        )}

        {activeTab === 'overview' && (
          <div className="dashboard-overview">
            <h1>Welcome back, {user?.fullName?.split(' ')[0]}!</h1>
            <p className="overview-subtitle">Here's what's happening with your account</p>

            <div className="stats-grid">
              {stats.map((stat, index) => (
                <div className="stat-card" key={index} style={{ '--accent-color': stat.color }}>
                  <div className="stat-icon">{stat.icon}</div>
                  <div className="stat-info">
                    <span className="stat-value">{stat.value}</span>
                    <span className="stat-label">{stat.label}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="overview-sections">
              <div className="overview-section">
                <h3>Recent Test Drives</h3>
                {testDrives.length > 0 ? (
                  <div className="recent-list">
                    {testDrives.slice(0, 3).map((td) => (
                      <div key={td.id} className="recent-item">
                        <div className="recent-info">
                          <span className="recent-title">{td.carBrand} {td.carModel}</span>
                          <span className="recent-date">{formatDate(td.requestedDate)}</span>
                        </div>
                        <span className={`status-badge ${getStatusBadge(td.status)}`}>
                          {td.status}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="empty-message">No test drives scheduled yet.</p>
                )}
                {testDrives.length > 3 && (
                  <button className="btn-view-all" onClick={() => setActiveTab('testdrives')}>
                    View All Test Drives
                  </button>
                )}
              </div>

              <div className="overview-section">
                <h3>Recent Inquiries</h3>
                {inquiries.length > 0 ? (
                  <div className="recent-list">
                    {inquiries.slice(0, 3).map((inq) => (
                      <div key={inq.id} className="recent-item">
                        <div className="recent-info">
                          <span className="recent-title">{inq.subject}</span>
                          <span className="recent-date">{formatDate(inq.createdAt)}</span>
                        </div>
                        <span className={`status-badge ${getStatusBadge(inq.status)}`}>
                          {inq.status}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="empty-message">No inquiries sent yet.</p>
                )}
                {inquiries.length > 3 && (
                  <button className="btn-view-all" onClick={() => setActiveTab('inquiries')}>
                    View All Inquiries
                  </button>
                )}
              </div>
            </div>

            <div className="quick-actions">
              <h3>Quick Actions</h3>
              <div className="actions-grid">
                <Link to="/" className="action-card">
                  <span className="action-icon">🔍</span>
                  <span className="action-label">Browse Cars</span>
                </Link>
                <Link to="/wishlist" className="action-card">
                  <span className="action-icon">❤️</span>
                  <span className="action-label">View Wishlist</span>
                </Link>
                <button className="action-card" onClick={() => setActiveTab('settings')}>
                  <span className="action-icon">⚙️</span>
                  <span className="action-label">Settings</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'testdrives' && (
          <div className="dashboard-section">
            <h2>My Test Drives</h2>
            {testDrives.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">🚗</span>
                <h3>No Test Drives Yet</h3>
                <p>Browse our collection and schedule your first test drive!</p>
                <Link to="/" className="btn-browse">Browse Cars</Link>
              </div>
            ) : (
              <div className="items-list">
                {testDrives.map((td) => (
                  <div key={td.id} className="item-card">
                    <div className="item-header">
                      <h4>{td.carBrand} {td.carModel}</h4>
                      <span className={`status-badge ${getStatusBadge(td.status)}`}>
                        {td.status}
                      </span>
                    </div>
                    <div className="item-details">
                      <div className="detail-row">
                        <span className="detail-label">Date:</span>
                        <span className="detail-value">{formatDate(td.requestedDate)}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Time:</span>
                        <span className="detail-value">{td.requestedTime}</span>
                      </div>
                      {td.notes && (
                        <div className="detail-row">
                          <span className="detail-label">Notes:</span>
                          <span className="detail-value">{td.notes}</span>
                        </div>
                      )}
                      {td.adminNotes && (
                        <div className="detail-row admin-note">
                          <span className="detail-label">Admin Response:</span>
                          <span className="detail-value">{td.adminNotes}</span>
                        </div>
                      )}
                    </div>
                    <div className="item-footer">
                      <span className="item-date">Requested on {formatDate(td.createdAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'inquiries' && (
          <div className="dashboard-section">
            <h2>My Inquiries</h2>
            {inquiries.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">💬</span>
                <h3>No Inquiries Yet</h3>
                <p>Have questions about a car? Send us an inquiry!</p>
                <Link to="/" className="btn-browse">Browse Cars</Link>
              </div>
            ) : (
              <div className="items-list">
                {inquiries.map((inq) => (
                  <div key={inq.id} className="item-card">
                    <div className="item-header">
                      <h4>{inq.subject}</h4>
                      <span className={`status-badge ${getStatusBadge(inq.status)}`}>
                        {inq.status}
                      </span>
                    </div>
                    <div className="item-details">
                      <div className="detail-row">
                        <span className="detail-label">Car:</span>
                        <span className="detail-value">{inq.carBrand} {inq.carModel}</span>
                      </div>
                      <div className="detail-row message-row">
                        <span className="detail-label">Message:</span>
                        <span className="detail-value">{inq.message}</span>
                      </div>
                      {inq.adminResponse && (
                        <div className="detail-row admin-note response-row">
                          <span className="detail-label">Response:</span>
                          <span className="detail-value">{inq.adminResponse}</span>
                        </div>
                      )}
                    </div>
                    <div className="item-footer">
                      <span className="item-date">Sent on {formatDate(inq.createdAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'wishlist' && (
          <div className="dashboard-section">
            <h2>My Wishlist</h2>
            <Link to="/wishlist" className="btn-full-wishlist">
              View Full Wishlist →
            </Link>
            <div className="mini-wishlist">
              {wishlistCount === 0 ? (
                <div className="empty-state">
                  <span className="empty-icon">💔</span>
                  <h3>Wishlist is Empty</h3>
                  <p>Save your favorite cars to see them here!</p>
                  <Link to="/" className="btn-browse">Browse Cars</Link>
                </div>
              ) : (
                <p className="wishlist-count">{wishlistCount} cars in your wishlist</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="dashboard-section">
            <h2>Account Settings</h2>
            <div className="settings-form">
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" value={user?.fullName || ''} readOnly />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" value={user?.email || ''} readOnly />
              </div>
              <div className="form-group">
                <label>Account Type</label>
                <input type="text" value={user?.role || 'User'} readOnly />
              </div>
              <p className="settings-note">
                To update your account information, please contact support.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

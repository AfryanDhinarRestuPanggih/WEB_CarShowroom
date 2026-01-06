import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import carService from '../services/carService';
import testDriveService from '../services/testDriveService';
import inquiryService from '../services/inquiryService';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalCars: 0,
    pendingTestDrives: 0,
    pendingInquiries: 0,
    totalUsers: 0
  });
  const [recentTestDrives, setRecentTestDrives] = useState([]);
  const [recentInquiries, setRecentInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'Admin') {
      navigate('/admin/login');
      return;
    }
    fetchDashboardData();
  }, [isAuthenticated, user, navigate]);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      const [cars, allTestDrives, allInquiries] = await Promise.all([
        carService.getCars(),
        testDriveService.getAllTestDrives(),
        inquiryService.getAllInquiries()
      ]);

      setStats({
        totalCars: cars.length,
        pendingTestDrives: allTestDrives.filter(td => td.status === 'Pending').length,
        pendingInquiries: allInquiries.filter(inq => inq.status === 'Pending').length,
        totalUsers: 0
      });

      setRecentTestDrives(allTestDrives.slice(0, 5));
      setRecentInquiries(allInquiries.slice(0, 5));
    } catch (err) {
      setError('Failed to load dashboard data.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      Pending: 'warning',
      Approved: 'success',
      Rejected: 'danger',
      Completed: 'info',
      Cancelled: 'secondary',
      Responded: 'success',
      Resolved: 'info'
    };
    return statusColors[status] || 'secondary';
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  const dashboardStats = [
    { label: 'Total Cars', value: stats.totalCars, icon: '🚗', color: '#2563eb', link: '/admin/cars' },
    { label: 'Pending Test Drives', value: stats.pendingTestDrives, icon: '📅', color: '#f59e0b', link: '/admin/test-drives' },
    { label: 'Pending Inquiries', value: stats.pendingInquiries, icon: '💬', color: '#7c3aed', link: '/admin/inquiries' },
    { label: 'Active Users', value: '0', icon: '👥', color: '#059669', link: '#' }
  ];

  return (
    <div className="admin-dashboard-container">
      <div className="admin-sidebar">
        <div className="admin-logo">
          <h2>Admin Panel</h2>
        </div>

        <nav className="admin-nav">
          <button
            className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <span className="nav-icon">📊</span>
            Dashboard
          </button>
          <Link to="/admin/cars" className="nav-item">
            <span className="nav-icon">🚗</span>
            Manage Cars
          </Link>
          <Link to="/admin/transactions" className="nav-item">
            <span className="nav-icon">💳</span>
            Transactions
          </Link>
          <Link to="/admin/test-drives" className="nav-item">
            <span className="nav-icon">📅</span>
            Test Drives
          </Link>
          <Link to="/admin/inquiries" className="nav-item">
            <span className="nav-icon">💬</span>
            Inquiries
          </Link>
          <button
            className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <span className="nav-icon">⚙️</span>
            Settings
          </button>
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
          <h1>Dashboard Overview</h1>
          <p>Welcome back, {user?.fullName?.split(' ')[0]}!</p>
        </div>

        {error && (
          <div className="admin-error">
            <p>{error}</p>
          </div>
        )}

        {activeTab === 'overview' && (
          <div className="admin-overview">
            <div className="admin-stats-grid">
              {dashboardStats.map((stat, index) => (
                <Link to={stat.link} key={index} className="admin-stat-card" style={{ '--accent-color': stat.color }}>
                  <div className="stat-icon">{stat.icon}</div>
                  <div className="stat-info">
                    <span className="stat-value">{stat.value}</span>
                    <span className="stat-label">{stat.label}</span>
                  </div>
                </Link>
              ))}
            </div>

            <div className="admin-sections">
              <div className="admin-section">
                <div className="section-header">
                  <h3>Recent Test Drive Requests</h3>
                  <Link to="/admin/test-drives" className="view-all-link">View All →</Link>
                </div>
                {recentTestDrives.length > 0 ? (
                  <div className="admin-table-container">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Customer</th>
                          <th>Car</th>
                          <th>Date</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentTestDrives.map((td) => (
                          <tr key={td.id}>
                            <td>
                              <div className="customer-info">
                                <span className="customer-name">{td.userName}</span>
                                <span className="customer-email">{td.userEmail}</span>
                              </div>
                            </td>
                            <td>{td.carBrand} {td.carModel}</td>
                            <td>{formatDate(td.requestedDate)}</td>
                            <td>
                              <span className={`status-badge ${getStatusBadge(td.status)}`}>
                                {td.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="empty-state-small">
                    <p>No test drive requests yet.</p>
                  </div>
                )}
              </div>

              <div className="admin-section">
                <div className="section-header">
                  <h3>Recent Inquiries</h3>
                  <Link to="/admin/inquiries" className="view-all-link">View All →</Link>
                </div>
                {recentInquiries.length > 0 ? (
                  <div className="admin-table-container">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Customer</th>
                          <th>Subject</th>
                          <th>Car</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentInquiries.map((inq) => (
                          <tr key={inq.id}>
                            <td>
                              <div className="customer-info">
                                <span className="customer-name">{inq.userName}</span>
                                <span className="customer-email">{inq.userEmail}</span>
                              </div>
                            </td>
                            <td>{inq.subject}</td>
                            <td>{inq.carBrand} {inq.carModel}</td>
                            <td>
                              <span className={`status-badge ${getStatusBadge(inq.status)}`}>
                                {inq.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="empty-state-small">
                    <p>No inquiries yet.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="admin-settings">
            <h2>Admin Settings</h2>
            <div className="settings-card">
              <div className="form-group">
                <label>Admin Name</label>
                <input type="text" value={user?.fullName || ''} readOnly />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" value={user?.email || ''} readOnly />
              </div>
              <div className="form-group">
                <label>Role</label>
                <input type="text" value={user?.role || 'Admin'} readOnly />
              </div>
              <p className="settings-note">
                To update admin settings, please contact system administrator.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

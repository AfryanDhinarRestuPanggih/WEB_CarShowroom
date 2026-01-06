import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import testDriveService from '../services/testDriveService';
import './AdminTestDrives.css';

const AdminTestDrives = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const [testDrives, setTestDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedTestDrive, setSelectedTestDrive] = useState(null);
  const [statusUpdate, setStatusUpdate] = useState({
    status: 'Approved',
    adminNotes: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'Admin') {
      navigate('/admin/login');
      return;
    }
    fetchTestDrives();
  }, [isAuthenticated, user, navigate, filterStatus]);

  const fetchTestDrives = async () => {
    setLoading(true);
    setError('');
    try {
      const status = filterStatus === 'all' ? '' : filterStatus;
      const data = await testDriveService.getAllTestDrives(status);
      setTestDrives(data);
    } catch (err) {
      setError('Failed to load test drives.');
      console.error(err);
    } finally {
      setLoading(false);
    }
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
      Approved: 'success',
      Rejected: 'danger',
      Completed: 'info',
      Cancelled: 'secondary'
    };
    return statusColors[status] || 'secondary';
  };

  const handleStatusUpdate = async () => {
    setSubmitting(true);
    try {
      await testDriveService.updateTestDriveStatus(selectedTestDrive.id, statusUpdate);
      setSelectedTestDrive(null);
      setStatusUpdate({ status: 'Approved', adminNotes: '' });
      fetchTestDrives();
    } catch (err) {
      setError('Failed to update status.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const pendingCount = testDrives.filter(td => td.status === 'Pending').length;
  const approvedCount = testDrives.filter(td => td.status === 'Approved').length;
  const completedCount = testDrives.filter(td => td.status === 'Completed').length;

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>Loading test drives...</p>
      </div>
    );
  }

  return (
    <div className="admin-testdrives-container">
      <div className="admin-sidebar">
        <div className="admin-logo">
          <h2>Admin Panel</h2>
        </div>

        <nav className="admin-nav">
          <Link to="/admin" className="nav-item">
            <span className="nav-icon">📊</span>
            Dashboard
          </Link>
          <Link to="/admin/cars" className="nav-item">
            <span className="nav-icon">🚗</span>
            Manage Cars
          </Link>
          <Link to="/admin/test-drives" className="nav-item active">
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
            <h1>Test Drive Management</h1>
            <p>Manage and respond to test drive requests</p>
          </div>
        </div>

        {error && (
          <div className="admin-error">
            <p>{error}</p>
          </div>
        )}

        <div className="filter-tabs">
          <button
            className={`filter-tab ${filterStatus === 'all' ? 'active' : ''}`}
            onClick={() => setFilterStatus('all')}
          >
            All ({testDrives.length})
          </button>
          <button
            className={`filter-tab ${filterStatus === 'Pending' ? 'active' : ''}`}
            onClick={() => setFilterStatus('Pending')}
          >
            Pending ({pendingCount})
          </button>
          <button
            className={`filter-tab ${filterStatus === 'Approved' ? 'active' : ''}`}
            onClick={() => setFilterStatus('Approved')}
          >
            Approved ({approvedCount})
          </button>
          <button
            className={`filter-tab ${filterStatus === 'Completed' ? 'active' : ''}`}
            onClick={() => setFilterStatus('Completed')}
          >
            Completed ({completedCount})
          </button>
        </div>

        <div className="testdrives-grid">
          {testDrives.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">📅</span>
              <h3>No Test Drives</h3>
              <p>No test drive requests found for the selected filter.</p>
            </div>
          ) : (
            testDrives.map((testDrive) => (
              <div key={testDrive.id} className="testdrive-card">
                <div className="testdrive-header">
                  <div className="customer-info">
                    <div className="customer-avatar">
                      {testDrive.userName?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="customer-details">
                      <span className="customer-name">{testDrive.userName}</span>
                      <span className="customer-email">{testDrive.userEmail}</span>
                    </div>
                  </div>
                  <span className={`status-badge ${getStatusBadge(testDrive.status)}`}>
                    {testDrive.status}
                  </span>
                </div>

                <div className="testdrive-content">
                  <div className="testdrive-car">
                    <span className="label">Car:</span>
                    <span className="value">{testDrive.carBrand} {testDrive.carModel}</span>
                  </div>
                  <div className="testdrive-date">
                    <span className="label">Requested Date:</span>
                    <span className="value">{formatDate(testDrive.requestedDate)}</span>
                  </div>
                  <div className="testdrive-time">
                    <span className="label">Time:</span>
                    <span className="value">{testDrive.requestedTime}</span>
                  </div>
                  {testDrive.notes && (
                    <div className="testdrive-notes">
                      <span className="label">Notes:</span>
                      <p>{testDrive.notes}</p>
                    </div>
                  )}
                  {testDrive.adminNotes && (
                    <div className="testdrive-admin-notes">
                      <span className="label">Admin Notes:</span>
                      <p>{testDrive.adminNotes}</p>
                    </div>
                  )}
                </div>

                <div className="testdrive-footer">
                  <span className="testdrive-date-created">
                    Requested on {formatDate(testDrive.createdAt)}
                  </span>
                  {testDrive.status === 'Pending' && (
                    <button
                      className="btn-update"
                      onClick={() => {
                        setSelectedTestDrive(testDrive);
                        setStatusUpdate({ status: 'Approved', adminNotes: '' });
                      }}
                    >
                      Update Status
                    </button>
                  )}
                  {testDrive.status === 'Approved' && (
                    <button
                      className="btn-complete"
                      onClick={() => {
                        setSelectedTestDrive(testDrive);
                        setStatusUpdate({ status: 'Completed', adminNotes: '' });
                      }}
                    >
                      Mark Complete
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {selectedTestDrive && (
        <div className="modal-overlay" onClick={() => setSelectedTestDrive(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Update Test Drive Status</h2>
              <button className="btn-close" onClick={() => setSelectedTestDrive(null)}>✕</button>
            </div>

            <div className="modal-body">
              <div className="testdrive-summary">
                <p><strong>Customer:</strong> {selectedTestDrive.userName}</p>
                <p><strong>Email:</strong> {selectedTestDrive.userEmail}</p>
                <p><strong>Car:</strong> {selectedTestDrive.carBrand} {selectedTestDrive.carModel}</p>
                <p><strong>Requested:</strong> {formatDate(selectedTestDrive.requestedDate)} at {selectedTestDrive.requestedTime}</p>
                {selectedTestDrive.notes && (
                  <p><strong>Notes:</strong> {selectedTestDrive.notes}</p>
                )}
              </div>

              <div className="status-form">
                <div className="form-group">
                  <label>New Status</label>
                  <select
                    value={statusUpdate.status}
                    onChange={(e) => setStatusUpdate({ ...statusUpdate, status: e.target.value })}
                  >
                    <option value="Approved">Approve</option>
                    <option value="Rejected">Reject</option>
                    <option value="Completed">Mark as Completed</option>
                    <option value="Cancelled">Cancel</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Admin Notes (Optional)</label>
                  <textarea
                    value={statusUpdate.adminNotes}
                    onChange={(e) => setStatusUpdate({ ...statusUpdate, adminNotes: e.target.value })}
                    placeholder="Add notes for the customer..."
                    rows={4}
                  />
                </div>

                <div className="form-actions">
                  <button className="btn-cancel" onClick={() => setSelectedTestDrive(null)}>
                    Cancel
                  </button>
                  <button
                    className="btn-submit"
                    onClick={handleStatusUpdate}
                    disabled={submitting}
                  >
                    {submitting ? 'Updating...' : 'Update Status'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTestDrives;

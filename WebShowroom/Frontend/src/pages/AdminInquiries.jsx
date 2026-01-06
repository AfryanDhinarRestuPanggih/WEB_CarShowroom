import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import inquiryService from '../services/inquiryService';
import './AdminInquiries.css';

const AdminInquiries = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [responseText, setResponseText] = useState('');
  const [responseStatus, setResponseStatus] = useState('Responded');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'Admin') {
      navigate('/admin/login');
      return;
    }
    fetchInquiries();
  }, [isAuthenticated, user, navigate, filterStatus]);

  const fetchInquiries = async () => {
    setLoading(true);
    setError('');
    try {
      const status = filterStatus === 'all' ? '' : filterStatus;
      const data = await inquiryService.getAllInquiries(status);
      setInquiries(data);
    } catch (err) {
      setError('Failed to load inquiries.');
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
      Responded: 'success',
      Resolved: 'info',
      Closed: 'secondary'
    };
    return statusColors[status] || 'secondary';
  };

  const handleRespond = async () => {
    if (!responseText.trim()) return;

    setSubmitting(true);
    try {
      await inquiryService.respondToInquiry(selectedInquiry.id, {
        adminResponse: responseText,
        status: responseStatus
      });
      setSelectedInquiry(null);
      setResponseText('');
      fetchInquiries();
    } catch (err) {
      setError('Failed to send response.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const pendingCount = inquiries.filter(i => i.status === 'Pending').length;
  const respondedCount = inquiries.filter(i => i.status === 'Responded').length;

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>Loading inquiries...</p>
      </div>
    );
  }

  return (
    <div className="admin-inquiries-container">
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
          <Link to="/admin/test-drives" className="nav-item">
            <span className="nav-icon">📅</span>
            Test Drives
          </Link>
          <Link to="/admin/inquiries" className="nav-item active">
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
            <h1>Inquiries Management</h1>
            <p>Respond to customer inquiries</p>
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
            All ({inquiries.length})
          </button>
          <button
            className={`filter-tab ${filterStatus === 'Pending' ? 'active' : ''}`}
            onClick={() => setFilterStatus('Pending')}
          >
            Pending ({pendingCount})
          </button>
          <button
            className={`filter-tab ${filterStatus === 'Responded' ? 'active' : ''}`}
            onClick={() => setFilterStatus('Responded')}
          >
            Responded ({respondedCount})
          </button>
        </div>

        <div className="inquiries-grid">
          {inquiries.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">💬</span>
              <h3>No Inquiries</h3>
              <p>No inquiries found for the selected filter.</p>
            </div>
          ) : (
            inquiries.map((inquiry) => (
              <div key={inquiry.id} className="inquiry-card">
                <div className="inquiry-header">
                  <div className="customer-info">
                    <div className="customer-avatar">
                      {inquiry.userName?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="customer-details">
                      <span className="customer-name">{inquiry.userName}</span>
                      <span className="customer-email">{inquiry.userEmail}</span>
                    </div>
                  </div>
                  <span className={`status-badge ${getStatusBadge(inquiry.status)}`}>
                    {inquiry.status}
                  </span>
                </div>

                <div className="inquiry-content">
                  <div className="inquiry-subject">
                    <span className="label">Subject:</span>
                    <span className="value">{inquiry.subject}</span>
                  </div>
                  <div className="inquiry-car">
                    <span className="label">Car:</span>
                    <span className="value">{inquiry.carBrand} {inquiry.carModel}</span>
                  </div>
                  <div className="inquiry-message">
                    <span className="label">Message:</span>
                    <p>{inquiry.message}</p>
                  </div>
                  {inquiry.adminResponse && (
                    <div className="inquiry-response">
                      <span className="label">Your Response:</span>
                      <p>{inquiry.adminResponse}</p>
                    </div>
                  )}
                </div>

                <div className="inquiry-footer">
                  <span className="inquiry-date">{formatDate(inquiry.createdAt)}</span>
                  {inquiry.status === 'Pending' && (
                    <button
                      className="btn-respond"
                      onClick={() => {
                        setSelectedInquiry(inquiry);
                        setResponseText('');
                        setResponseStatus('Responded');
                      }}
                    >
                      Respond
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {selectedInquiry && (
        <div className="modal-overlay" onClick={() => setSelectedInquiry(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Respond to Inquiry</h2>
              <button className="btn-close" onClick={() => setSelectedInquiry(null)}>✕</button>
            </div>

            <div className="modal-body">
              <div className="inquiry-summary">
                <p><strong>From:</strong> {selectedInquiry.userName} ({selectedInquiry.userEmail})</p>
                <p><strong>Subject:</strong> {selectedInquiry.subject}</p>
                <p><strong>Car:</strong> {selectedInquiry.carBrand} {selectedInquiry.carModel}</p>
                <div className="original-message">
                  <strong>Original Message:</strong>
                  <p>{selectedInquiry.message}</p>
                </div>
              </div>

              <div className="response-form">
                <div className="form-group">
                  <label>Your Response</label>
                  <textarea
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    placeholder="Type your response here..."
                    rows={5}
                  />
                </div>

                <div className="form-group">
                  <label>Status After Response</label>
                  <select
                    value={responseStatus}
                    onChange={(e) => setResponseStatus(e.target.value)}
                  >
                    <option value="Responded">Responded</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>

                <div className="form-actions">
                  <button className="btn-cancel" onClick={() => setSelectedInquiry(null)}>
                    Cancel
                  </button>
                  <button
                    className="btn-submit"
                    onClick={handleRespond}
                    disabled={submitting || !responseText.trim()}
                  >
                    {submitting ? 'Sending...' : 'Send Response'}
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

export default AdminInquiries;

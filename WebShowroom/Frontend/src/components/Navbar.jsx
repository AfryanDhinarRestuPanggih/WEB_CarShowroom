import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  const closeMenus = () => {
    setMenuOpen(false);
    setUserMenuOpen(false);
  };

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMenus}>
          🚗 CarShowroom
        </Link>

        <div className={`navbar-menu ${menuOpen ? 'active' : ''}`}>
          <Link
            to="/"
            className={`nav-link ${isActive('/') && location.pathname === '/' ? 'active' : ''}`}
            onClick={closeMenus}
          >
            Home
          </Link>

          <Link
            to="/#collection"
            className={`nav-link ${isActive('/#collection') ? 'active' : ''}`}
            onClick={closeMenus}
          >
            Collection
          </Link>

          {!isAdmin() && (
            <Link
              to="/catalog"
              className={`nav-link ${isActive('/catalog') ? 'active' : ''}`}
              onClick={closeMenus}
            >
              Buy Cars
            </Link>
          )}

          {isAuthenticated && !isAdmin() && (
            <Link
              to="/wishlist"
              className={`nav-link ${isActive('/wishlist') ? 'active' : ''}`}
              onClick={closeMenus}
            >
              Wishlist
            </Link>
          )}

          {isAuthenticated && !isAdmin() && (
            <Link
              to="/dashboard"
              className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
              onClick={closeMenus}
            >
              Dashboard
            </Link>
          )}

          {isAdmin() && (
            <Link
              to="/admin"
              className={`nav-link ${isActive('/admin') && location.pathname === '/admin' ? 'active' : ''}`}
              onClick={closeMenus}
            >
              Dashboard
            </Link>
          )}
        </div>

        <div className="navbar-actions">
          {isAuthenticated ? (
            <div className="user-menu-container">
              <button
                className="user-menu-button"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                <span className="user-avatar">
                  {user?.fullName?.charAt(0).toUpperCase() || 'U'}
                </span>
                <span className="user-name">{user?.fullName?.split(' ')[0]}</span>
                <span className="dropdown-arrow">▼</span>
              </button>

              {userMenuOpen && (
                <div className="user-dropdown">
                  <div className="dropdown-header">
                    <span className="dropdown-name">{user?.fullName}</span>
                    <span className="dropdown-email">{user?.email}</span>
                    <span className="dropdown-role">{user?.role}</span>
                  </div>
                  <div className="dropdown-divider"></div>

                  {!isAdmin() && (
                    <>
                      <Link to="/dashboard" className="dropdown-item" onClick={closeMenus}>
                        📊 My Dashboard
                      </Link>
                      <Link to="/transactions" className="dropdown-item" onClick={closeMenus}>
                        💳 My Transactions
                      </Link>
                      <Link to="/wishlist" className="dropdown-item" onClick={closeMenus}>
                        ❤️ My Wishlist
                      </Link>
                    </>
                  )}

                  {isAdmin() && (
                    <>
                      <Link to="/admin" className="dropdown-item" onClick={closeMenus}>
                        📊 Dashboard
                      </Link>
                      <Link to="/admin/cars" className="dropdown-item" onClick={closeMenus}>
                        🚗 Manage Cars
                      </Link>
                      <Link to="/admin/transactions" className="dropdown-item" onClick={closeMenus}>
                        💳 Transactions
                      </Link>
                      <Link to="/admin/test-drives" className="dropdown-item" onClick={closeMenus}>
                        📅 Test Drives
                      </Link>
                      <Link to="/admin/inquiries" className="dropdown-item" onClick={closeMenus}>
                        💬 Inquiries
                      </Link>
                    </>
                  )}

                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item logout" onClick={handleLogout}>
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn-login" onClick={closeMenus}>
                Login
              </Link>
              <Link to="/register" className="btn-register" onClick={closeMenus}>
                Register
              </Link>
            </div>
          )}

          <button
            className={`hamburger ${menuOpen ? 'active' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="mobile-menu" onClick={closeMenus}>
          <Link to="/" className="mobile-link">Home</Link>
          <Link to="/#collection" className="mobile-link">Collection</Link>
          {!isAdmin() && <Link to="/catalog" className="mobile-link">Buy Cars</Link>}
          {isAuthenticated && !isAdmin() && (
            <>
              <Link to="/wishlist" className="mobile-link">Wishlist</Link>
              <Link to="/transactions" className="mobile-link">Transactions</Link>
              <Link to="/dashboard" className="mobile-link">Dashboard</Link>
            </>
          )}
          {isAdmin() && (
            <Link to="/admin" className="mobile-link">Dashboard</Link>
          )}
          {!isAuthenticated && (
            <>
              <Link to="/login" className="mobile-link">Login</Link>
              <Link to="/register" className="mobile-link">Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;

import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Custom Navbar component specifically for the Accommodation page
 * with guaranteed visibility through solid background colors
 */
const AccommodationNavbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Check if the link is active
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Accommodation', path: '/accommodation' },
    { name: 'About Us', path: '/about' }
  ];

  return (
    <nav style={{
      backgroundColor: 'white',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 9999,
      borderBottom: '1px solid rgba(229, 231, 235, 0.5)'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 1rem'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '5rem'
        }}>
          {/* Logo */}
          <Link to="/" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <div style={{
              width: '2.5rem',
              height: '2.5rem',
              borderRadius: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#3b82f6',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '1.25rem'
            }}>
              HS
            </div>
            <span style={{
              fontWeight: 'bold',
              fontSize: '1.25rem',
              color: '#111827'
            }}>
              Hey Students
            </span>
          </Link>

          {/* Navigation Links */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2rem'
          }}>
            <div style={{
              display: 'flex',
              gap: '1.5rem'
            }}>
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  style={{
                    fontWeight: isActive(item.path) ? '600' : '500',
                    color: isActive(item.path) ? '#3b82f6' : '#4b5563',
                    textDecoration: 'none',
                    padding: '0.5rem 0',
                    borderBottom: isActive(item.path) ? '2px solid #3b82f6' : '2px solid transparent'
                  }}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Auth Buttons */}
            <div style={{
              display: 'flex',
              gap: '1rem',
              alignItems: 'center'
            }}>
              {user ? (
                <button
                  onClick={handleLogout}
                  style={{
                    backgroundColor: 'transparent',
                    color: '#4b5563',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    fontWeight: '500',
                    border: '1px solid #d1d5db',
                    cursor: 'pointer'
                  }}
                >
                  Sign Out
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    style={{
                      color: '#4b5563',
                      fontWeight: '500',
                      textDecoration: 'none'
                    }}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    style={{
                      backgroundColor: '#f97316',
                      color: 'white',
                      padding: '0.5rem 1rem',
                      borderRadius: '0.5rem',
                      fontWeight: '500',
                      textDecoration: 'none'
                    }}
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AccommodationNavbar;

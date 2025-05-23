import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Check if the link is active
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-card py-2' : 'bg-transparent py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="h-10 w-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white text-xl font-bold">HS</span>
              </div>
              <span className={`text-2xl font-display font-bold ${isScrolled ? 'text-primary' : 'text-white'}`}>
                Hey Students
              </span>
            </Link>
            <div className="hidden md:flex md:ml-10 md:space-x-8">
              {[
                { name: 'Home', path: '/' },
                { name: 'Resources', path: '/resources' },
                { name: 'Events', path: '/events' },
                { name: 'Accommodation', path: '/accommodation' },
                { name: 'Alumni', path: '/alumni' }
              ].map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`${isActive(item.path) 
                    ? `text-accent font-medium` 
                    : `${isScrolled ? 'text-neutral-dark' : 'text-white'} hover:text-accent`}
                  relative py-2 transition-colors duration-200 text-sm font-medium`}
                >
                  {item.name}
                  {isActive(item.path) && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-accent"></span>
                  )}
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden md:flex md:items-center md:space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="relative group">
                  <button className={`flex items-center space-x-2 ${isScrolled ? 'text-neutral-dark' : 'text-white'} hover:text-accent`}>
                    <span className="text-sm font-medium">
                      Hi, {user.name}
                    </span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-card overflow-hidden transform scale-0 group-hover:scale-100 opacity-0 group-hover:opacity-100 transition-all duration-200 origin-top-right z-50">
                    <div className="py-1">
                      {user.role === 'admin' && (
                        <Link
                          to="/admin"
                          className="block px-4 py-2 text-sm text-neutral-dark hover:bg-primary hover:text-white"
                        >
                          Admin Dashboard
                        </Link>
                      )}
                      {user.role === 'institute' && (
                        <Link
                          to="/institute/dashboard"
                          className="block px-4 py-2 text-sm text-neutral-dark hover:bg-primary hover:text-white"
                        >
                          Institute Dashboard
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-neutral-dark hover:bg-primary hover:text-white"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className={`btn-outline ${isScrolled ? 'text-primary' : 'text-white'}`}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="btn-accent"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`inline-flex items-center justify-center p-2 rounded-md ${isScrolled ? 'text-neutral-dark' : 'text-white'} hover:text-accent focus:outline-none`}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg rounded-b-xl animate-fade-in">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {[
              { name: 'Home', path: '/' },
              { name: 'Resources', path: '/resources' },
              { name: 'Events', path: '/events' },
              { name: 'Accommodation', path: '/accommodation' },
              { name: 'Alumni', path: '/alumni' }
            ].map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`${isActive(item.path) 
                  ? 'bg-primary text-white' 
                  : 'text-neutral-dark hover:bg-primary-light/10 hover:text-primary'}
                block px-3 py-2 rounded-lg text-base font-medium transition-colors duration-200`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            {user ? (
              <div className="px-2 space-y-1">
                <div className="block px-3 py-2 rounded-lg text-base font-medium text-neutral-dark bg-gray-50">
                  Hi, {user.name}
                  {user.role !== 'user' && (
                    <span className="ml-1 text-primary font-bold">({user.role})</span>
                  )}
                </div>
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="block px-3 py-2 rounded-lg text-base font-medium text-neutral-dark hover:bg-primary-light/10 hover:text-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Admin Dashboard
                  </Link>
                )}
                {user.role === 'institute' && (
                  <Link
                    to="/institute/dashboard"
                    className="block px-3 py-2 rounded-lg text-base font-medium text-neutral-dark hover:bg-primary-light/10 hover:text-primary"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Institute Dashboard
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-lg text-base font-medium text-neutral-dark hover:bg-primary-light/10 hover:text-primary"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="px-2 space-y-1 sm:px-3">
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-lg text-base font-medium text-neutral-dark hover:bg-primary-light/10 hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="block px-3 py-2 rounded-lg text-base font-medium bg-accent text-white hover:bg-accent-dark"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
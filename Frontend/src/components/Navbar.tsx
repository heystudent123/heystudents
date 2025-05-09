import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-2xl font-bold text-primary">
                Hey Students!
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/"
                className="border-transparent text-gray-500 hover:border-primary hover:text-primary inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Home
              </Link>
              <Link
                to="/resources"
                className="border-transparent text-gray-500 hover:border-primary hover:text-primary inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Resources
              </Link>
              <Link
                to="/events"
                className="border-transparent text-gray-500 hover:border-primary hover:text-primary inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Events
              </Link>
              <Link
                to="/accommodation"
                className="border-transparent text-gray-500 hover:border-primary hover:text-primary inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Accommodation
              </Link>
              <Link
                to="/alumni"
                className="border-transparent text-gray-500 hover:border-primary hover:text-primary inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Alumni Network
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700 text-sm font-medium">
                  Hi, {user.name}
                  {user.role === 'admin' && <span className="ml-1 text-primary font-bold">(Admin)</span>}
                  {user.role === 'institute' && <span className="ml-1 text-primary font-bold">(Institute)</span>}
                </span>
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="text-primary hover:text-primary/90 px-3 py-2 rounded-md text-sm font-medium border border-primary"
                  >
                    Admin Dashboard
                  </Link>
                )}
                {user.role === 'institute' && (
                  <Link
                    to="/institute/dashboard"
                    className="text-primary hover:text-primary/90 px-3 py-2 rounded-md text-sm font-medium border border-primary"
                  >
                    Institute Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex space-x-4">
                <Link
                  to="/login"
                  className="text-gray-500 hover:text-primary px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className="bg-primary/10 border-primary text-primary block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            >
              Home
            </Link>
            <Link
              to="/resources"
              className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-primary hover:text-primary block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            >
              Resources
            </Link>
            <Link
              to="/events"
              className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-primary hover:text-primary block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            >
              Events
            </Link>
            <Link
              to="/accommodation"
              className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-primary hover:text-primary block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            >
              Accommodation
            </Link>
            <Link
              to="/alumni"
              className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-primary hover:text-primary block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
            >
              Alumni Network
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="mt-3 space-y-1">
              {user ? (
                <>
                  <div className="block px-4 py-2 text-base font-medium text-gray-700">
                    Hi, {user.name}
                    {user.role === 'admin' && <span className="ml-1 text-primary font-bold">(Admin)</span>}
                    {user.role === 'institute' && <span className="ml-1 text-primary font-bold">(Institute)</span>}
                  </div>
                  {user.role === 'admin' && (
                    <Link
                      to="/admin"
                      className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  {user.role === 'institute' && (
                    <Link
                      to="/institute/dashboard"
                      className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                    >
                      Institute Dashboard
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const SharedNavbar: React.FC = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Handle window resize for responsive behavior
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkScreenSize();
    
    // Add event listener
    window.addEventListener('resize', checkScreenSize);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
  
  // Close mobile menu when clicking a link
  const handleLinkClick = () => {
    if (isMobile) {
      setIsMenuOpen(false);
    }
  };

  return (
    <nav className="navbar-fixed w-full overflow-hidden">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2" onClick={handleLinkClick}>
            <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center text-white font-bold text-lg">
              HS
            </div>
            <span className="font-bold text-xl text-gray-900">Hey Students</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-between gap-8">
            <div className="flex space-x-6">
              <Link 
                to="/" 
                className={`font-medium ${location.pathname === '/' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-600 hover:text-gray-900'}`}
              >
                Home
              </Link>
              <Link 
                to="/accommodation" 
                className={`font-medium ${location.pathname === '/accommodation' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-600 hover:text-gray-900'}`}
              >
                Accommodation
              </Link>
              <Link 
                to="/about" 
                className={`font-medium ${location.pathname === '/about' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-600 hover:text-gray-900'}`}
              >
                About Us
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link to="/login" className="font-medium text-gray-600 hover:text-gray-900">
                Sign In
              </Link>
              <Link to="/signup" className="bg-orange-500 text-white px-4 py-2 rounded-md font-medium hover:bg-orange-600 transition-colors">
                Get Started
              </Link>
            </div>
          </div>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className="sr-only">Open main menu</span>
            {/* Hamburger icon */}
            {!isMenuOpen ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile menu, show/hide based on menu state */}
      {isMobile && isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg border-t">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
              to="/" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname === '/' ? 'text-blue-500 bg-blue-50' : 'text-gray-600 hover:bg-gray-50'}`}
              onClick={handleLinkClick}
            >
              Home
            </Link>
            <Link 
              to="/accommodation" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname === '/accommodation' ? 'text-blue-500 bg-blue-50' : 'text-gray-600 hover:bg-gray-50'}`}
              onClick={handleLinkClick}
            >
              Accommodation
            </Link>
            <Link 
              to="/about" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname === '/about' ? 'text-blue-500 bg-blue-50' : 'text-gray-600 hover:bg-gray-50'}`}
              onClick={handleLinkClick}
            >
              About Us
            </Link>
            <div className="border-t border-gray-200 my-2"></div>
            <Link 
              to="/login" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-50"
              onClick={handleLinkClick}
            >
              Sign In
            </Link>
            <Link 
              to="/signup" 
              className="block px-3 py-2 rounded-md text-base font-medium bg-orange-500 text-white hover:bg-orange-600"
              onClick={handleLinkClick}
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default SharedNavbar;

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth as useClerkAuth, UserButton } from '@clerk/clerk-react';
import { useAuth } from '../context/AuthContext';

const SharedNavbar: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();
  const { isSignedIn, isLoaded } = useClerkAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

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

  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== 'undefined') {
        if (window.scrollY > lastScrollY) {
          // Scrolling down
          setShowNavbar(false);
        } else {
          // Scrolling up
          setShowNavbar(true);
        }
        setLastScrollY(window.scrollY);
      }
    };

    window.addEventListener('scroll', controlNavbar);
    return () => {
      window.removeEventListener('scroll', controlNavbar);
    };
  }, [lastScrollY]);

  // Close mobile menu when clicking a link
  const handleLinkClick = () => {
    if (isMobile) {
      setIsMenuOpen(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#fff9ed' }}>
      <nav
        style={{
          position: 'fixed',
          top: showNavbar ? 0 : '-100px',
          left: 0,
          right: 0,
          width: '100%',
          maxWidth: '100vw',
          zIndex: 9999,
          backgroundColor: '#fff9ed',
          color: 'black',
          overflow: 'hidden', // Changed from overflowX to control both axes
          transition: 'top 0.3s',
        }}
      >
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center relative">
            {/* Logo */}
            <Link to="/" className="flex items-center" onClick={handleLinkClick}>
              <div className="text-black text-xl font-bold">Hey Students</div>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center justify-between gap-8">
              <div className="flex space-x-6">
                <Link 
                  to="/" 
                  className={`font-medium ${location.pathname === '/' ? 'text-black font-bold' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  Home
                </Link>
                <Link 
                  to="/about" 
                  className={`font-medium ${location.pathname === '/about' ? 'text-black font-bold' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  About Us
                </Link>
              </div>
              
              <div className="flex items-center space-x-4">
                {isLoaded && isSignedIn ? (
                  <>
                    {user?.role === 'admin' && (
                      <Link to="/admin" className="font-medium text-blue-600 hover:text-blue-800">
                        Admin Panel
                      </Link>
                    )}
                    {user?.role === 'institute' && (
                      <Link to="/institute/dashboard" className="font-medium text-blue-600 hover:text-blue-800">
                        Institute Dashboard
                      </Link>
                    )}
                    <Link 
                      to="/wishlist" 
                      className="relative group flex items-center justify-center w-8 h-8 rounded-full hover:bg-black/5"
                      onClick={handleLinkClick}
                    >
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        strokeWidth={1.5} 
                        stroke="currentColor" 
                        className="w-6 h-6 text-gray-700 group-hover:text-black transition-colors"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" 
                        />
                      </svg>
                    </Link>
                    <UserButton afterSignOutUrl="/" />
                  </>
                ) : isLoaded ? (
                  <Link 
                    to="/login"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-[#fff0d0]"
                  >
                    Sign In
                  </Link>
                ) : null}
              </div>
            </div>
            
            {/* Mobile menu button */}
            <button 
              className="md:hidden flex items-center justify-center p-2 rounded-md focus:outline-none hamburger-menu-btn ml-auto"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {/* Hamburger icon */}
              {!isMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="#000000">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="#000000">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile menu, show/hide based on menu state */}
        {isMobile && isMenuOpen && (
          <div className="md:hidden bg-[#fff9ed] shadow-lg border-t">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {/* Main navigation links */}
              <Link 
                to="/" 
                className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname === '/' ? 'text-black font-bold underline bg-[#ffe8b5]' : 'text-gray-800 hover:bg-[#ffe8b5]'}`}
                onClick={handleLinkClick}
              >
                Home
              </Link>
              <Link 
                to="/about" 
                className={`block px-3 py-2 rounded-md text-base font-medium ${location.pathname === '/about' ? 'text-black font-bold underline bg-[#ffe8b5]' : 'text-gray-800 hover:bg-[#ffe8b5]'}`}
                onClick={handleLinkClick}
              >
                About Us
              </Link>
              
              {/* Divider */}
              <div className="border-t border-gray-200 my-2"></div>
              
              {/* User-specific links */}
              {isLoaded && isSignedIn ? (
                <>
                  {/* Role-specific links */}
                  {user?.role === 'admin' && (
                    <Link 
                      to="/admin" 
                      className="block px-3 py-2 rounded-md text-base font-medium text-blue-600 hover:bg-[#ffe8b5]"
                      onClick={handleLinkClick}
                    >
                      Admin Panel
                    </Link>
                  )}
                  {user?.role === 'institute' && (
                    <Link 
                      to="/institute/dashboard" 
                      className="block px-3 py-2 rounded-md text-base font-medium text-blue-600 hover:bg-[#ffe8b5]"
                      onClick={handleLinkClick}
                    >
                      Institute Dashboard
                    </Link>
                  )}
                  
                  {/* User account links */}
                  <div className="mt-3 space-y-1">
                    <Link 
                      to="/wishlist" 
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-[#ffe8b5]"
                      onClick={handleLinkClick}
                    >
                      <div className="flex items-center gap-2">
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          strokeWidth={1.5} 
                          stroke="currentColor" 
                          className="w-5 h-5"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" 
                          />
                        </svg>
                        My Wishlist
                      </div>
                    </Link>
                    <div className="px-3 py-2">
                      <UserButton afterSignOutUrl="/" />
                    </div>
                  </div>
                </>
              ) : isLoaded ? (
                <Link 
                  to="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-[#ffe8b5]"
                  onClick={handleLinkClick}
                >
                  Sign In
                </Link>
              ) : null}
            </div>
          </div>
        )}
      </nav>
    </div>
  );
};

export default SharedNavbar;

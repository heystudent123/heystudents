import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import WhatsAppButton from './components/WhatsAppButton';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProfilePage from './pages/CompleteProfile';
import UserProfile from './pages/UserProfile';
import Wishlist from './pages/Wishlist';
import AdminPage from './pages/AdminPage';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminInstitutesPage from './pages/AdminInstitutesPage';
import AdminAccommodationsPage from './pages/AdminAccommodationsPage';


import AdminAccommodationEditPage from './pages/AdminAccommodationEditPage';
import AccommodationListingPage from './pages/AccommodationPage';
import AccommodationDetailPage from './pages/HostelDetailPage';
import Footer from './components/Footer';
import pingService from './services/pingService';
import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

// Separate component to use hooks inside Router context
function AppContent() {
  const [showWelcome, setShowWelcome] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the welcome screen has been shown before
    const hasShownWelcome = localStorage.getItem('hasShownWelcome');
    if (!hasShownWelcome) {
      setShowWelcome(true);
      localStorage.setItem('hasShownWelcome', 'true');
    }

    // Start the ping service
    pingService.start();

    return () => {
      pingService.stop();
    };
  }, []);
  
  // Redirect to login after 60 seconds if not logged in
  useEffect(() => {
    // Don't set timer if user is already logged in
    if (user) {
      // Clear the redirect flag when user logs in
      sessionStorage.removeItem('loginRedirected');
      return;
    }
    
    // Check if we've already redirected to avoid multiple redirects
    const hasRedirected = sessionStorage.getItem('loginRedirected');
    if (hasRedirected) return;
    
    const timer = setTimeout(() => {
      // Only redirect if user is still not logged in after 60 seconds
      if (!user) {
        console.log('60 seconds elapsed, redirecting to login');
        sessionStorage.setItem('loginRedirected', 'true');
        navigate('/login');
      }
    }, 60000); // 60 seconds
    
    return () => clearTimeout(timer);
  }, [user, navigate]);

  return (
    <div className="App">
          <ToastContainer position="bottom-center" />
          <WhatsAppButton />
          <div className="flex flex-col min-h-screen">
            {/* Modal will be rendered above everything else */}
            {showWelcome && (
              <div className="fixed inset-0 z-50 overflow-y-auto">
                {/* <WelcomeForm onSubmit={handleWelcomeFormSubmit} /> */}
              </div>
            )}
            {/* Navbar removed from here and added to individual page components */}
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/user-profile" element={<UserProfile />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/admin/users" element={<AdminUsersPage />} />
                <Route path="/admin/institutes" element={<AdminInstitutesPage />} />

                <Route path="/admin/accommodations" element={<AdminAccommodationsPage />} />
                <Route path="/admin/accommodations/new" element={<AdminAccommodationEditPage />} />
                <Route path="/admin/accommodations/edit/:id" element={<AdminAccommodationEditPage />} />

                <Route path="/accommodation" element={
                  <ProtectedRoute>
                    <AccommodationListingPage />
                  </ProtectedRoute>
                } />
                <Route path="/accommodation/:id" element={
                  <ProtectedRoute>
                    <AccommodationDetailPage />
                  </ProtectedRoute>
                } />
              </Routes>
            </main>
            <Footer />
          </div>
        </div>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import { AuthProvider } from './context/AuthContext';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import CompleteProfile from './pages/CompleteProfile';
import UserProfile from './pages/UserProfile';
import Wishlist from './pages/Wishlist';
import AdminPage from './pages/AdminPage';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminAccommodationsPage from './pages/AdminAccommodationsPage';
import AdminInstitutesPage from './pages/AdminInstitutesPage';
import InstituteDashboardPage from './pages/InstituteDashboardPage';
import AdminAccommodationEditPage from './pages/AdminAccommodationEditPage';
import AccommodationListingPage from './pages/AccommodationPage';
import AccommodationDetailPage from './pages/HostelDetailPage';
import Footer from './components/Footer';
import pingService from './services/pingService';
import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [showWelcome, setShowWelcome] = useState(false);

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

  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <div className="App">
          <ToastContainer position="bottom-center" />
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
                <Route path="/complete-profile" element={<CompleteProfile />} />
                <Route path="/profile" element={<UserProfile />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/admin/users" element={<AdminUsersPage />} />
                <Route path="/admin/institutes" element={<AdminInstitutesPage />} />
                <Route path="/admin/accommodations" element={<AdminAccommodationsPage />} />
                <Route path="/admin/accommodations/new" element={<AdminAccommodationEditPage />} />
                <Route path="/admin/accommodations/edit/:id" element={<AdminAccommodationEditPage />} />
                <Route path="/institute/dashboard" element={<InstituteDashboardPage />} />
                <Route path="/accommodation" element={<AccommodationListingPage />} />
                <Route path="/accommodation/:id" element={<AccommodationDetailPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

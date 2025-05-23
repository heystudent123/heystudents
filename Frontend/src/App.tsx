import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AccommodationListingPage from './pages/FixedHostelListingPage';
import AccommodationDetailPage from './pages/HostelDetailPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import AlumniPage from './pages/AlumniPage';
import ResourcesPage from './pages/ResourcesPage';
import EventsPage from './pages/EventsPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminPage from './pages/AdminPage';
import WelcomeForm from './components/WelcomeForm';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminAccommodationsPage from './pages/AdminAccommodationsPage';
import AdminEventsPage from './pages/AdminEventsPage';
import AdminInstitutesPage from './pages/AdminInstitutesPage';
import InstituteDashboardPage from './pages/InstituteDashboardPage';
import AdminAccommodationEditPage from './pages/AdminAccommodationEditPage';
import { AuthProvider } from './context/AuthContext';
import LoopBreaker from './pages/LoopBreaker';
import './App.css';

function App() {
  // Set initial state to true to show the form immediately
  const [showWelcomeForm, setShowWelcomeForm] = useState(true);
  const [userInfo, setUserInfo] = useState<{
    name: string;
    mobile: string;
    referralCode?: string;
  } | null>(null);

  useEffect(() => {
    // Check if user has already submitted the form
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      setUserInfo(JSON.parse(storedUserInfo));
      setShowWelcomeForm(false); // Hide form if user info exists
    }
  }, []);

  const handleWelcomeFormSubmit = (formData: {
    name: string;
    mobile: string;
    referralCode?: string;
  }) => {
    // Save user info to localStorage
    localStorage.setItem('userInfo', JSON.stringify(formData));
    setUserInfo(formData);
    setShowWelcomeForm(false);
  };

  // For testing - remove stored data to see form again
  const clearUserData = () => {
    localStorage.removeItem('userInfo');
    setShowWelcomeForm(true);
    setUserInfo(null);
  };

  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          {/* Modal will be rendered above everything else */}
          {showWelcomeForm && (
            <div className="fixed inset-0 z-50 overflow-y-auto">
              <WelcomeForm onSubmit={handleWelcomeFormSubmit} />
            </div>
          )}
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/resources" element={<ResourcesPage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/accommodation" element={<AccommodationListingPage />} />
              {/* Demo page to show how to fix React infinite loops */}
              <Route path="/loop-breaker" element={<LoopBreaker />} />
              <Route path="/accommodation/:id" element={<AccommodationDetailPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/alumni" element={<AlumniPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/admin/users" element={<AdminUsersPage />} />
              <Route path="/admin/institutes" element={<AdminInstitutesPage />} />
              <Route path="/admin/accommodations" element={<AdminAccommodationsPage />} />
              <Route path="/admin/accommodations/new" element={<AdminAccommodationEditPage />} />
              <Route path="/admin/accommodations/edit/:id" element={<AdminAccommodationEditPage />} />
              <Route path="/admin/events" element={<AdminEventsPage />} />
              <Route path="/institute/dashboard" element={<InstituteDashboardPage />} />
            </Routes>
            
            {/* Temporary button for testing - remove in production */}
            {!showWelcomeForm && (
              <button 
                onClick={clearUserData}
                className="fixed bottom-4 right-4 bg-gray-800 text-white p-2 rounded text-sm"
              >
                Reset Form (Dev Only)
              </button>
            )}
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

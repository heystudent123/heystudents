import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import CompleteProfile from './pages/CompleteProfile';
import UserProfile from './pages/UserProfile';
import AdminPage from './pages/AdminPage';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminAccommodationsPage from './pages/AdminAccommodationsPage';
import AdminInstitutesPage from './pages/AdminInstitutesPage';
import InstituteDashboardPage from './pages/InstituteDashboardPage';
import AdminAccommodationEditPage from './pages/AdminAccommodationEditPage';
import AccommodationListingPage from './pages/AccommodationPage';
import AccommodationDetailPage from './pages/HostelDetailPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import Footer from './components/Footer';
import './App.css';

const App: React.FC = () => {
  // Set initial state to true to show the form immediately
  const [showWelcomeForm, setShowWelcomeForm] = React.useState(true);

  React.useEffect(() => {
    // Check if user has already submitted the form
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      setShowWelcomeForm(false); // Hide form if user info exists
    }
    
    // Start the ping service
    // pingService.start();
    
    // Clean up on unmount
    return () => {
      // pingService.stop();
    };
  }, []);

  const handleWelcomeFormSubmit = (formData: {
    name: string;
    mobile: string;
    referralCode?: string;
  }) => {
    // Save user info to localStorage
    localStorage.setItem('userInfo', JSON.stringify(formData));
    setShowWelcomeForm(false);
  };

  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          {/* Modal will be rendered above everything else */}
          {showWelcomeForm && (
            <div className="fixed inset-0 z-50 overflow-y-auto">
              {/* <WelcomeForm onSubmit={handleWelcomeFormSubmit} /> */}
            </div>
          )}
          {/* Navbar removed from here and added to individual page components */}
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/complete-profile" element={<CompleteProfile />} />
              <Route path="/profile" element={<UserProfile />} />
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
      </Router>
    </AuthProvider>
  );
}

export default App;

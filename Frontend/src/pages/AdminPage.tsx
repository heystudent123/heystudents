import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import SharedNavbar from '../components/SharedNavbar';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

const AdminPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  // Authentication check
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.role !== 'admin') {
        navigate('/');
        return;
      }
      setUser(parsedUser);
    } catch (error) {
      console.error('Error parsing user data:', error);
      navigate('/login');
    }
  }, [navigate]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <SharedNavbar />
      <div className="navbar-spacer"></div>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>
        
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg leading-6 font-medium text-gray-900">Admin Information</h2>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Personal details and management options.</p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200">
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Full name</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.name}</dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Email address</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.email}</dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Role</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    {user.role}
                  </span>
                </dd>
              </div>
            </dl>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Link to="/admin/users" className="bg-white overflow-hidden shadow rounded-lg hover:ring-2 hover:ring-primary transition">
            <div className="px-4 py-5 sm:p-6 h-full">
              <h3 className="text-lg font-medium text-gray-900">User Management</h3>
              <p className="mt-4 text-sm text-gray-500">View and manage all registered users.</p>
              <span className="mt-5 inline-block px-4 py-2 text-sm font-medium text-white bg-primary rounded-md">Go</span>
            </div>
          </Link>

          <Link to="/admin/institutes" className="bg-white overflow-hidden shadow rounded-lg hover:ring-2 hover:ring-primary transition">
            <div className="px-4 py-5 sm:p-6 h-full">
              <h3 className="text-lg font-medium text-gray-900">Institute Management</h3>
              <p className="mt-4 text-sm text-gray-500">View institutes and their referral statistics.</p>
              <span className="mt-5 inline-block px-4 py-2 text-sm font-medium text-white bg-primary rounded-md">Go</span>
            </div>
          </Link>

          <Link to="/admin/accommodations" className="bg-white overflow-hidden shadow rounded-lg hover:ring-2 hover:ring-primary transition">
            <div className="px-4 py-5 sm:p-6 h-full">
              <h3 className="text-lg font-medium text-gray-900">Accommodation Management</h3>
              <p className="mt-4 text-sm text-gray-500">Add, edit, or remove accommodation listings.</p>
              <span className="mt-5 inline-block px-4 py-2 text-sm font-medium text-white bg-primary rounded-md">Go</span>
            </div>
          </Link>
          
          <Link to="/ping" className="bg-white overflow-hidden shadow rounded-lg hover:ring-2 hover:ring-primary transition">
            <div className="px-4 py-5 sm:p-6 h-full">
              <h3 className="text-lg font-medium text-gray-900">Server Monitoring</h3>
              <p className="mt-4 text-sm text-gray-500">Monitor server status and view ping history.</p>
              <span className="mt-5 inline-block px-4 py-2 text-sm font-medium text-white bg-primary rounded-md">Go</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  </>
  );
};

export default AdminPage;
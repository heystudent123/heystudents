import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../services/api';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  phone: string;
  college?: string;
  course?: string;
  year?: string;
  referralCode?: string;
  referrals?: string[];
  referralsCount?: number;
  createdAt: string;
}

const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [showInstituteModal, setShowInstituteModal] = useState(false);
  const [customReferralCode, setCustomReferralCode] = useState('');
  const [instituteModalError, setInstituteModalError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if admin is logged in
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
    } catch (error) {
      console.error('Error parsing user data:', error);
      navigate('/login');
      return;
    }

    // Function to fetch users with referral data
    const fetchUsersWithReferrals = async () => {
      try {
        // Pass empty string to get all users regardless of role
        const response = await authApi.getUsers('');
        let usersData = response.data;
        
        // Fetch referral data
        try {
          const referralsResponse = await authApi.getReferrals();
          const referralsData = referralsResponse.data;
          
          // No special handling for referrals since institute functionality is removed
          usersData = usersData.map((user: User) => {
            return user;
          });
        } catch (referralErr) {
          console.error('Error fetching referrals:', referralErr);
          // Continue with users data even if referrals fetch fails
        }
        
        setUsers(usersData);
        setLoading(false);
      } catch (err: any) {
        console.error('Error fetching users:', err);
        setError(err.response?.data?.message || 'Failed to fetch users');
        setLoading(false);
      }
    };

    fetchUsersWithReferrals();
  }, [navigate]);

  // Extract fetchUsersWithReferrals to be used in multiple places
  const fetchUsersWithReferrals = async () => {
    try {
      // Pass empty string to get all users regardless of role
      const response = await authApi.getUsers('');
      let usersData = response.data;
      
      // Fetch referral data
      try {
        const referralsResponse = await authApi.getReferrals();
        const referralsData = referralsResponse.data;
        
        // Map referrals to users
        usersData = usersData.map((user: User) => {
          // No special handling needed since institute functionality is removed
          return user;
        });
      } catch (referralErr) {
        console.error('Error fetching referrals:', referralErr);
        // Continue with users data even if referrals fetch fails
      }
      
      setUsers(usersData);
      setLoading(false);
    } catch (err: any) {
      console.error('Error fetching users:', err);
      setError(err.response?.data?.message || 'Failed to fetch users');
      setLoading(false);
    }
  };

  const promoteToAdmin = async (userId: string) => {
    try {
      // Use authApi instead of direct axios call
      await authApi.promoteToAdmin(userId);
      
      // Refresh user list with referral data
      await fetchUsersWithReferrals();
    } catch (err: any) {
      console.error('Error promoting user:', err);
      alert(err.response?.data?.message || 'Failed to promote user');
    }
  };
  
  const openInstituteModal = (userId: string) => {
    setSelectedUserId(userId);
    setCustomReferralCode('');
    setInstituteModalError('');
    setShowInstituteModal(true);
  };
  
  const closeInstituteModal = () => {
    setShowInstituteModal(false);
    setSelectedUserId('');
    setCustomReferralCode('');
    setInstituteModalError('');
  };
  
  const promoteToInstitute = async () => {
    try {
      // Custom referral code is optional, pass it only if provided
      const payload = customReferralCode ? { customReferralCode } : undefined;
      await authApi.promoteToInstitute(selectedUserId, customReferralCode || undefined);
      
      // Close modal and refresh user list
      closeInstituteModal();
      await fetchUsersWithReferrals();
    } catch (err: any) {
      console.error('Error promoting to institute:', err);
      setInstituteModalError(err.response?.data?.message || 'Failed to promote user to institute');
    }
  };
  
  const deleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await authApi.deleteUser(userId);
        
        // Refresh user list with referral data
        await fetchUsersWithReferrals();
      } catch (err: any) {
        console.error('Error deleting user:', err);
        alert(err.response?.data?.message || 'Failed to delete user');
      }
    }
  };



  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <Link
            to="/admin"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Back to Dashboard
          </Link>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg leading-6 font-medium text-gray-900">Users</h2>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              View and manage user accounts.
            </p>
          </div>
          
          <div className="border-t border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mobile
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    College
                  </th>

                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.role === 'admin' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.phone}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.college || '-'}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex flex-col space-y-2">
                          {/* Only show promotion buttons for regular users */}
                          {user.role !== 'admin' && user.role !== 'institute' && (
                            <>
                              <button
                                onClick={() => promoteToAdmin(user._id)}
                                className="text-primary hover:text-primary/80"
                              >
                                Promote to Admin
                              </button>
                              <button
                                onClick={() => openInstituteModal(user._id)}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                Promote to Institute
                              </button>
                            </>
                          )}
                          {/* Show delete button for all users */}
                          <button
                            onClick={() => deleteUser(user._id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Delete User
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Institute Promotion Modal */}
      {showInstituteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-medium text-gray-900">Promote to Institute</h3>
              <button
                onClick={closeInstituteModal}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="px-6 py-4">
              <p className="mb-4 text-sm text-gray-600">
                This will promote the user to an institute role and generate a unique referral code. 
                Students can use this referral code when signing up.
              </p>
              
              {instituteModalError && (
                <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
                  <p className="text-red-700">{instituteModalError}</p>
                </div>
              )}
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Custom Referral Code (Optional)
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  placeholder="Enter custom code (min 4 chars)"
                  value={customReferralCode}
                  onChange={(e) => setCustomReferralCode(e.target.value)}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Leave empty to auto-generate a 6-character code. Custom codes must be at least 4 characters.
                </p>
              </div>
            </div>
            
            <div className="px-6 py-4 border-t bg-gray-50 flex justify-end space-x-3">
              <button
                onClick={closeInstituteModal}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={promoteToInstitute}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/80"
              >
                Promote
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;
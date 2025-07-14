import React, { useState, useEffect, useRef } from 'react';
import { authApi } from '../services/api';

interface Institute {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  referralCode: string;
  referrals: Array<{
    user: string;
    name: string;
    email: string;
    mobile: string;
    college?: string;
    course?: string;
    year?: string;
    date: string;
  }>;
}

const AdminInstitutesPage: React.FC = () => {
  const [institutes, setInstitutes] = useState<Institute[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [registeredUsers, setRegisteredUsers] = useState<{_id: string, name: string, phone: string}[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<{_id: string, name: string, phone: string}[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    password: '',
    address: '',
    customReferralCode: '',
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [selectedInstitute, setSelectedInstitute] = useState<string | null>(null);

  useEffect(() => {
    fetchInstitutes();
    fetchRegisteredUsers();
  }, []);
  
  // Fetch registered users for the mobile number dropdown
  const fetchRegisteredUsers = async () => {
    try {
      const response = await authApi.getRegisteredUsers();
      setRegisteredUsers(response.data);
      setFilteredUsers(response.data);
    } catch (err) {
      console.error('Failed to fetch registered users:', err);
    }
  };
  
  // Handle mobile number search
  const handleMobileSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setFormData({ ...formData, mobile: value });
    
    if (value) {
      setFilteredUsers(
        registeredUsers.filter(user => 
          user.phone.includes(value) || user.name.toLowerCase().includes(value.toLowerCase())
        )
      );
      setShowDropdown(true);
    } else {
      setFilteredUsers(registeredUsers);
      setShowDropdown(false);
    }
  };
  
  // Select user from dropdown
  const selectUser = (user: {_id: string, name: string, phone: string}) => {
    setFormData({ ...formData, mobile: user.phone });
    setSearchTerm(user.phone);
    setShowDropdown(false);
  };
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchInstitutes = async () => {
    try {
      setLoading(true);
      const response = await authApi.getUsers('institute');
      setInstitutes(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch institutes:', err);
      setError('Failed to load institutes. Please try again later.');
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation - only name and mobile are required now
    if (!formData.name || !formData.mobile) {
      setFormError('Please fill in all required fields (Name and Mobile Number)');
      return;
    }
    
    if (formData.mobile.length !== 10 || !/^\d+$/.test(formData.mobile)) {
      setFormError('Please enter a valid 10-digit mobile number');
      return;
    }
    
    setFormLoading(true);
    setFormError(null);
    
    try {
      // Create institute with required fields
      const instituteData: {
        name: string;
        mobile: string;
        email?: string;
        password?: string;
        address?: string;
        customReferralCode?: string;
      } = {
        name: formData.name,
        mobile: formData.mobile,
      };
      
      // Add optional fields if provided
      if (formData.email) instituteData.email = formData.email;
      if (formData.password) instituteData.password = formData.password;
      if (formData.address) instituteData.address = formData.address;
      if (formData.customReferralCode) instituteData.customReferralCode = formData.customReferralCode;
      
      await authApi.createInstitute(instituteData);
      
      // Reset form and hide it
      setFormData({
        name: '',
        mobile: '',
        email: '',
        password: '',
        address: '',
        customReferralCode: '',
      });
      setSearchTerm('');
      setShowAddForm(false);
      
      // Refresh institutes list
      fetchInstitutes();
    } catch (err: any) {
      console.error('Create institute error:', err);
      setFormError(err.response?.data?.message || 'Failed to create institute. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  const toggleReferralsList = (instituteId: string) => {
    if (selectedInstitute === instituteId) {
      setSelectedInstitute(null);
    } else {
      setSelectedInstitute(instituteId);
    }
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Institute Management</h1>
          <p className="mt-2 text-sm text-gray-700">
            Create and manage institute accounts and their referrals
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            {showAddForm ? 'Cancel' : 'Add Institute'}
          </button>
        </div>
      </div>

      {/* Add Institute Form */}
      {showAddForm && (
        <div className="mt-6 bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Add New Institute</h3>
              <p className="mt-1 text-sm text-gray-500">
                Create a new institute account. Only name and mobile number are required.
              </p>
            </div>
            <div className="mt-5 md:mt-0 md:col-span-2">
              {formError && (
                <div className="mb-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                  <p>{formError}</p>
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-6 gap-6">
                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Institute Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      required
                      className="mt-1 focus:ring-primary focus:border-primary block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">
                      Mobile Number *
                    </label>
                    <div className="relative" ref={dropdownRef}>
                      <div className="flex rounded-md shadow-sm">
                        <div className="relative flex-grow focus-within:z-10">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="h-5 w-5 text-gray-400">🔍</span>
                          </div>
                          <input
                            type="text"
                            name="mobile"
                            id="mobile"
                            required
                            placeholder="Search by mobile number"
                            className="focus:ring-primary focus:border-primary block w-full rounded-md pl-10 sm:text-sm border-gray-300"
                            value={searchTerm}
                            onChange={handleMobileSearch}
                            onClick={() => setShowDropdown(true)}
                          />
                          {searchTerm && (
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                              <button
                                type="button"
                                className="text-gray-400 hover:text-gray-500"
                                onClick={() => {
                                  setSearchTerm('');
                                  setFormData({ ...formData, mobile: '' });
                                }}
                              >
                                <span className="h-5 w-5">✕</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {showDropdown && (
                        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                          {filteredUsers.length > 0 ? (
                            filteredUsers.map((user) => (
                              <div
                                key={user._id}
                                className="cursor-pointer hover:bg-gray-100 px-4 py-2"
                                onClick={() => selectUser(user)}
                              >
                                <p className="font-medium">{user.phone}</p>
                                <p className="text-sm text-gray-500">{user.name}</p>
                              </div>
                            ))
                          ) : (
                            <div className="px-4 py-2 text-sm text-gray-500">
                              No users found
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Select from registered user mobile numbers
                    </p>
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email address
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      className="mt-1 focus:ring-primary focus:border-primary block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Optional field
                    </p>
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      id="password"
                      className="mt-1 focus:ring-primary focus:border-primary block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Optional field
                    </p>
                  </div>
                  
                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      id="address"
                      className="mt-1 focus:ring-primary focus:border-primary block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Optional field
                    </p>
                  </div>

                  <div className="col-span-6">
                    <label htmlFor="customReferralCode" className="block text-sm font-medium text-gray-700">
                      Custom Referral Code
                    </label>
                    <input
                      type="text"
                      name="customReferralCode"
                      id="customReferralCode"
                      className="mt-1 focus:ring-primary focus:border-primary block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      value={formData.customReferralCode}
                      onChange={(e) => setFormData({ ...formData, customReferralCode: e.target.value })}
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      Leave blank to auto-generate a referral code based on institute name
                    </p>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    type="submit"
                    disabled={formLoading}
                    className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${
                      formLoading ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {formLoading ? 'Creating...' : 'Create Institute'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Institutes List */}
      <div className="mt-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
            <p>{error}</p>
          </div>
        ) : institutes.length === 0 ? (
          <div className="text-center py-12 bg-white shadow rounded-lg">
            <p className="text-gray-500">No institutes found. Create your first institute account.</p>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {institutes.map((institute) => (
                <li key={institute._id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="ml-3">
                          <p className="text-lg font-medium text-gray-900">{institute.name}</p>
                          <p className="text-sm text-gray-500">{institute.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {institute.referrals?.length || 0} Referrals
                        </span>
                        <button
                          onClick={() => toggleReferralsList(institute._id)}
                          className="ml-4 px-3 py-1 text-sm text-primary hover:text-primary/90 border border-primary rounded-md"
                        >
                          {selectedInstitute === institute._id ? 'Hide' : 'Show'} Referrals
                        </button>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          <span className="truncate">Mobile: {institute.mobile}</span>
                        </p>
                        <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                          <span className="truncate">Referral Code: <span className="font-medium">{institute.referralCode}</span></span>
                        </p>
                      </div>
                    </div>

                    {/* Referrals List */}
                    {selectedInstitute === institute._id && institute.referrals && institute.referrals.length > 0 && (
                      <div className="mt-4 border-t border-gray-200 pt-4">
                        <h4 className="text-sm font-medium text-gray-900">Referred Users</h4>
                        <div className="mt-2 overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mobile</th>
                                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">College</th>
                                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {institute.referrals.map((referral, idx) => (
                                <tr key={idx}>
                                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{referral.name}</td>
                                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{referral.email}</td>
                                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{referral.mobile}</td>
                                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{referral.college || '-'}</td>
                                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{referral.course || '-'}</td>
                                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{referral.year || '-'}</td>
                                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(referral.date).toLocaleDateString()}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                    
                    {selectedInstitute === institute._id && (!institute.referrals || institute.referrals.length === 0) && (
                      <div className="mt-4 border-t border-gray-200 pt-4">
                        <p className="text-sm text-gray-500">No users have signed up using this institute's referral code yet.</p>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminInstitutesPage; 
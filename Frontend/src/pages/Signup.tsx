import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    college: '',
    course: '',
    year: '',
    referralCode: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [referralStatus, setReferralStatus] = useState<{
    verified: boolean;
    instituteName?: string;
  } | null>(null);

  const handleReferralCodeChange = async (value: string) => {
    setFormData({ ...formData, referralCode: value });
    
    // Clear previous verification status
    setReferralStatus(null);
    
    // If code is empty, don't verify
    if (!value.trim()) return;
    
    try {
      const response = await authApi.verifyReferralCode(value);
      if (response.success) {
        setReferralStatus({
          verified: true,
          instituteName: response.data.institute.name
        });
      }
    } catch (err) {
      setReferralStatus({
        verified: false
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    
    if (formData.mobile.length !== 10 || !/^\d+$/.test(formData.mobile)) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }
    
    // If referral code is provided but not verified, show error
    if (formData.referralCode.trim() && (!referralStatus || !referralStatus.verified)) {
      setError("Please enter a valid referral code");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Prepare data for API (excluding confirmPassword)
      const userData = {
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        password: formData.password,
        college: formData.college || undefined,
        course: formData.course || undefined,
        year: formData.year || undefined,
        referralCode: formData.referralCode || undefined,
      };
      
      // Call the signup function from AuthContext
      await signup(userData);
      
      // Redirect to home page
      navigate('/');
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'Failed to register. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
              <p>{error}</p>
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name *
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address *
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">
                Mobile Number *
              </label>
              <div className="mt-1">
                <input
                  id="mobile"
                  name="mobile"
                  type="tel"
                  autoComplete="tel"
                  required
                  placeholder="10-digit number"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password *
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password *
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-6 pt-4 border-t border-gray-200">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Optional Information</h3>
              
              <div>
                <label htmlFor="college" className="block text-sm font-medium text-gray-700">
                  College/University
                </label>
                <div className="mt-1">
                  <input
                    id="college"
                    name="college"
                    type="text"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    value={formData.college}
                    onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="course" className="block text-sm font-medium text-gray-700">
                  Course/Program
                </label>
                <div className="mt-1">
                  <input
                    id="course"
                    name="course"
                    type="text"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    value={formData.course}
                    onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="year" className="block text-sm font-medium text-gray-700">
                  Year of Study
                </label>
                <div className="mt-1">
                  <select
                    id="year"
                    name="year"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  >
                    <option value="">Select year</option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                    <option value="alumni">Alumni</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label htmlFor="referralCode" className="block text-sm font-medium text-gray-700">
                  Institute Referral Code
                </label>
                <div className="mt-1">
                  <input
                    id="referralCode"
                    name="referralCode"
                    type="text"
                    className={`appearance-none block w-full px-3 py-2 border ${
                      referralStatus 
                        ? (referralStatus.verified ? 'border-green-500' : 'border-red-500') 
                        : 'border-gray-300'
                    } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm`}
                    value={formData.referralCode}
                    onChange={(e) => handleReferralCodeChange(e.target.value)}
                    placeholder="Enter institute referral code"
                  />
                  {referralStatus && (
                    <p className={`mt-1 text-sm ${referralStatus.verified ? 'text-green-600' : 'text-red-600'}`}>
                      {referralStatus.verified 
                        ? `Verified: ${referralStatus.instituteName}` 
                        : 'Invalid referral code'}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${
                  loading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Signing up...' : 'Sign up'}
              </button>
            </div>

            <div className="text-sm text-center">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-primary hover:text-primary/90">
                Login here
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup; 
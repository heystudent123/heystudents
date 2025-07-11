import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import SharedNavbar from '../components/SharedNavbar';

interface SignupFormData {
  name: string;
  email: string;
  mobile: string;
  password: string;
  confirmPassword: string;
  college: string;
  course: string;
  year: string;
  referralCode: string;
  acceptTerms: boolean;
  role?: string;
}

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [formData, setFormData] = useState<SignupFormData>({
    name: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    college: '',
    course: '',
    year: '',
    referralCode: '',
    acceptTerms: false,
    role: '',
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
    <div className="min-h-screen bg-white font-sans">
      {/* Add SharedNavbar */}
      <SharedNavbar />
      
      {/* Hero Section with Gradient Background - using blue-to-orange gradient */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-orange-500 h-72 shadow-lg relative overflow-hidden mt-16">
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
      </div>

      <div className="relative -mt-40 flex flex-col items-center justify-center px-6 pb-24 mx-auto">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-xl border border-neutral-100/50 backdrop-blur-sm">
          {/* Logo and Title */}
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-blue-600 via-blue-500 to-orange-500 mb-6 shadow-lg transform transition-transform hover:scale-105">
              <span className="text-white text-3xl font-bold">HS</span>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-blue-500 to-orange-500 bg-clip-text text-transparent mb-2">Create Account</h1>
            <p className="mt-2 text-neutral-500">Join Hey Students today</p>
          </div>

          {error && (
            <div className="mb-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
              <p>{error}</p>
            </div>
          )}

          {error && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-sm" role="alert">
              <p>{error}</p>
            </div>
          )}
          
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-neutral-dark mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-neutral-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-neutral-200 rounded-xl focus:ring-blue-500 focus:border-blue-500 shadow-sm bg-neutral-50/50 hover:bg-white focus:bg-white transition-all text-neutral-700 placeholder-neutral-400"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-neutral-dark mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-neutral-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-neutral-200 rounded-xl focus:ring-blue-500 focus:border-blue-500 shadow-sm bg-neutral-50/50 hover:bg-white focus:bg-white transition-all text-neutral-700 placeholder-neutral-400"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="mobile" className="block text-sm font-medium text-neutral-dark mb-1">
                  Mobile Number *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-neutral-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <input
                    id="mobile"
                    name="mobile"
                    type="tel"
                    autoComplete="tel"
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-neutral-200 rounded-xl focus:ring-blue-500 focus:border-blue-500 shadow-sm bg-neutral-50/50 hover:bg-white focus:bg-white transition-all text-neutral-700 placeholder-neutral-400"
                    placeholder="10-digit number"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-neutral-dark mb-1">
                  Password *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-neutral-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-neutral-200 rounded-xl focus:ring-blue-500 focus:border-blue-500 shadow-sm bg-neutral-50/50 hover:bg-white focus:bg-white transition-all text-neutral-700 placeholder-neutral-400"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-dark mb-1">
                  Confirm Password *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-neutral-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-neutral-200 rounded-xl focus:ring-blue-500 focus:border-blue-500 shadow-sm bg-neutral-50/50 hover:bg-white focus:bg-white transition-all text-neutral-700 placeholder-neutral-400"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6 pt-6 mt-6 border-t border-neutral-200">
              <div className="flex items-center">
                <svg className="h-5 w-5 text-primary mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 9a1 1 0 01-1-1v-4a1 1 0 112 0v4a1 1 0 01-1 1z" clipRule="evenodd" />
                </svg>
                <h3 className="text-lg font-medium leading-6 text-neutral-darkest">Optional Information</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="college" className="block text-sm font-medium text-neutral-dark mb-1">
                    College/University
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-neutral-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                      </svg>
                    </div>
                    <input
                      id="college"
                      name="college"
                      type="text"
                      placeholder="Your college or university"
                      className="block w-full pl-10 pr-3 py-3 border border-neutral-200 rounded-xl focus:ring-blue-500 focus:border-blue-500 shadow-sm bg-neutral-50/50 hover:bg-white focus:bg-white transition-all text-neutral-700 placeholder-neutral-400"
                      value={formData.college}
                      onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="course" className="block text-sm font-medium text-neutral-dark mb-1">
                    Course/Program
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-neutral-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                      </svg>
                    </div>
                    <input
                      id="course"
                      name="course"
                      type="text"
                      placeholder="Your course or program"
                      className="block w-full pl-10 pr-3 py-3 border border-neutral-200 rounded-xl focus:ring-blue-500 focus:border-blue-500 shadow-sm bg-neutral-50/50 hover:bg-white focus:bg-white transition-all text-neutral-700 placeholder-neutral-400"
                      value={formData.course}
                      onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="year" className="block text-sm font-medium text-neutral-dark mb-1">
                    Year of Study
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-neutral-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <select
                      id="year"
                      name="year"
                      className="block w-full pl-10 pr-3 py-3 border border-neutral-200 rounded-xl focus:ring-blue-500 focus:border-blue-500 shadow-sm bg-neutral-50/50 hover:bg-white focus:bg-white transition-all text-neutral-700 placeholder-neutral-400"
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
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-neutral-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-neutral-dark mb-1">
                    Role
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-neutral-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <select
                      id="role"
                      name="role"
                      required
                      className="block w-full pl-10 pr-3 py-3 border border-neutral-200 rounded-xl focus:ring-blue-500 focus:border-blue-500 shadow-sm bg-neutral-50/50 hover:bg-white focus:bg-white transition-all text-neutral-700 placeholder-neutral-400"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    >
                      <option value="">Select role</option>
                      <option value="student">Student</option>
                      <option value="teacher">Teacher</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-neutral-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="referralCode" className="block text-sm font-medium text-neutral-dark mb-1">
                  Referral Code
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-neutral-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    id="referralCode"
                    name="referralCode"
                    type="text"
                    className={`block w-full pl-10 pr-3 py-3 border ${
                      referralStatus 
                        ? (referralStatus.verified ? 'border-green-500 focus:ring-green-500 focus:border-green-500' : 'border-red-500 focus:ring-red-500 focus:border-red-500') 
                        : 'border-neutral-200 focus:ring-blue-500 focus:border-blue-500'
                    } rounded-xl transition-all duration-200 shadow-sm bg-neutral-50/50 hover:bg-white focus:bg-white text-neutral-700`}
                    value={formData.referralCode}
                    onChange={(e) => handleReferralCodeChange(e.target.value)}
                    placeholder="Enter institute referral code"
                  />
                  {referralStatus && (
                    <div className={`mt-2 flex items-center text-sm ${
                      referralStatus.verified ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {referralStatus.verified ? (
                        <>
                          <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>Verified: {referralStatus.instituteName}</span>
                        </>
                      ) : (
                        <>
                          <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                          <span>Invalid referral code</span>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <div className="flex items-center mt-4">
                  <input
                    id="acceptTerms"
                    name="acceptTerms"
                    type="checkbox"
                    required
                    className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-neutral-300 rounded"
                    checked={formData.acceptTerms}
                    onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
                  />
                  <label htmlFor="acceptTerms" className="ml-2 block text-sm text-neutral-600">
                    I accept the <a href="#" className="text-primary-600 hover:text-primary-500">Terms and Conditions</a>
                  </label>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg text-base font-medium text-white bg-gradient-to-r from-blue-600 via-blue-500 to-orange-500 hover:from-blue-700 hover:via-blue-600 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed transform hover:-translate-y-0.5 active:translate-y-0 ${
                  loading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing up...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            </div>

            <div className="text-center text-sm text-neutral-500 mt-8">
              Already have an account?{' '}
              <Link to="/login" className="font-medium bg-gradient-to-r from-blue-600 via-blue-500 to-orange-500 bg-clip-text text-transparent hover:from-blue-700 hover:via-blue-600 hover:to-orange-600 transition-all">
                Login here
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Footer with gradient */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-orange-600 py-6 text-white/80 text-center mt-auto w-full">
        <div className="container mx-auto px-4">
          <p className="text-sm">&copy; {new Date().getFullYear()} Hey Students. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SharedNavbar from '../components/SharedNavbar';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { auth } from '../firebase/config';

declare global {
  interface Window {
    confirmationResult: any;
    recaptchaVerifier: any;
  }
}

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    countryCode: '+91',
    phone: '',
    otp: ''
  });
  const [loading, setLoading] = useState(false);
  const [signingIn, setSigningIn] = useState(false);
  const [error, setError] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [recaptchaLoading, setRecaptchaLoading] = useState(true);
  const [recaptchaError, setRecaptchaError] = useState('');
  const [resendCountdown, setResendCountdown] = useState(60);
  const [resendDisabled, setResendDisabled] = useState(true);

  const navigate = useNavigate();
  const { loginWithPhone } = useAuth();

  useEffect(() => {
    // Ensure reCAPTCHA container exists and is properly styled
    const container = document.getElementById('recaptcha-container');
    if (!container) {
      console.error('reCAPTCHA container not found');
      setRecaptchaError('reCAPTCHA initialization failed');
      return;
    }

    // Clear any previous instances
    if (window.recaptchaVerifier) {
      try {
        window.recaptchaVerifier.clear();
      } catch (e) {
        console.error('Error clearing reCAPTCHA:', e);
      }
      window.recaptchaVerifier = null;
    }
    
    // Initialize reCAPTCHA after ensuring container exists
    const initRecaptcha = setTimeout(() => {
      try {
        console.log('Initializing reCAPTCHA...');
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          'size': 'invisible',
          'callback': (response: string) => {
            console.log('reCAPTCHA verified successfully', response);
          },
          'expired-callback': () => {
            console.log('reCAPTCHA expired');
            setRecaptchaError('reCAPTCHA expired. Please refresh the page.');
          },
          'error-callback': (error: Error) => {
            console.error('reCAPTCHA error:', error);
            setRecaptchaError('reCAPTCHA error occurred. Please refresh the page.');
          }
        });
        console.log('reCAPTCHA initialized successfully');
        setRecaptchaLoading(false);
      } catch (error) {
        setRecaptchaError('Failed to initialize reCAPTCHA');
        console.error('RecaptchaVerifier error:', error);
      }
    }, 1000);
    
    // Cleanup on unmount
    return () => {
      clearTimeout(initRecaptcha);
      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
        } catch (e) {
          console.error('Error clearing reCAPTCHA on unmount:', e);
        }
        window.recaptchaVerifier = null;
      }
    };
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCountdown > 0) {
      timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
    } else {
      setResendDisabled(false);
    }
    return () => clearTimeout(timer);
  }, [resendCountdown]);

  const handleSendOTP = async () => {
    if (recaptchaLoading) {
      setError('reCAPTCHA is still initializing');
      return;
    }
    
    if (recaptchaError) {
      setError(recaptchaError);
      return;
    }
    
    if (!formData.phone) {
      setError('Please enter your phone number');
      return;
    }

    const phoneNumber = getFullPhoneNumber();

    setLoading(true);
    setError('');

    try {
      console.log('Sending OTP to:', phoneNumber);
      
      // Verify reCAPTCHA container exists
      const container = document.getElementById('recaptcha-container');
      if (!container) {
        setError('reCAPTCHA initialization failed');
        return;
      }

    // Use existing verifier or wait for initialization
    if (!window.recaptchaVerifier) {
      setError('Please wait for reCAPTCHA to initialize...');
      return;
    }

      console.log('Using existing reCAPTCHA verifier');
      
      const appVerifier = window.recaptchaVerifier;
      
      // Ensure the reCAPTCHA is rendered before proceeding
      try {
        await appVerifier.render();
        console.log('reCAPTCHA rendered successfully');
      } catch (renderErr) {
        console.log('reCAPTCHA may already be rendered:', renderErr);
      }
      
      // Add a small delay to ensure reCAPTCHA is fully initialized
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Proceeding with phone authentication...');
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      console.log('OTP sent successfully');
      window.confirmationResult = confirmationResult;
      setOtpSent(true);
      setResendDisabled(true);
      setResendCountdown(60);
    } catch (err: any) {
      console.error('Error sending OTP:', err);
      
      // Reset reCAPTCHA on error
      if (window.recaptchaVerifier) {
        console.log('Keeping existing reCAPTCHA verifier instance after error');
      }
      
      // Provide more specific error messages
      if (err.code === 'auth/invalid-app-credential') {
        setError('Invalid reCAPTCHA verification. Please refresh the page and try again.');
      } else if (err.code === 'auth/captcha-check-failed') {
        setError('reCAPTCHA verification failed. Please refresh the page and try again.');
      } else if (err.code === 'auth/quota-exceeded') {
        setError('SMS quota exceeded. Please try again later.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many requests. Please try again after some time or use a different phone number.');
      } else if (err.code === 'auth/invalid-phone-number') {
        setError('Invalid phone number format. Please enter a valid phone number.');
      } else {
        setError(err.message || 'Failed to send OTP. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!formData.otp) {
      setError('Please enter the OTP');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const confirmationResult = window.confirmationResult;
      const result = await confirmationResult.confirm(formData.otp);
      if (result) {
        setOtpVerified(true);
        // Store the user's phone number in Firebase auth
        const user = result.user;
        console.log('OTP verified successfully', user);
        
        const phoneNumber = formData.phone.trim();

      // Persist verified phone for next page
      localStorage.setItem('verifiedPhone', phoneNumber);

        try {
          // Try to login with phone number and get user data
          // Pass basic user data as second parameter to handle new user registration
          // Show signing in message
          setSigningIn(true);
          setError('');
          
          const userData = {
            phone: phoneNumber,
            // Leave name empty so user can fill it in profile page
            name: '',
            email: ''  // Optional, will be filled in profile page
          };
          
          const loggedUser = await loginWithPhone(phoneNumber, userData);

          // Check if this is a new user (no fullName) and redirect to profile page
          if (!loggedUser.fullName) {
            // New user - redirect to profile page to complete registration
            navigate('/profile', { state: { newUser: true } });
          } else {
            // Existing user with profile - redirect to home page
            navigate('/');
          }
        } catch (loginErr) {
          console.error('Error logging in with phone:', loginErr);
          // Show error message instead of redirecting
          setError('Failed to log in. Please try again.');
          setLoading(false);
          setSigningIn(false);
        }
      } else {
        setError('Incorrect OTP. Please try again.');
      }
    } catch (err: any) {
      console.error('Error verifying OTP:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResendDisabled(true);
    setResendCountdown(60);
    setError('');
    
    try {
      await handleSendOTP();
    } catch (err) {
      console.error('Error resending OTP:', err);
      setError('Failed to resend OTP. Please try again.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user starts typing new OTP
    setError('');
  };
  
  // Get full phone number with country code
  const getFullPhoneNumber = () => {
    return `${formData.countryCode}${formData.phone}`;
  };

  return (
    <div className="min-h-screen bg-[#fff9ed] font-sans">
      <SharedNavbar />
      <div className="flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-100 rounded-xl">
              <p className="text-center text-sm text-yellow-800">
                <span className="font-semibold">Please sign in</span> to get the full experience of Hey Student and access our verified PG listings.
              </p>
            </div>
          </div>

          {signingIn && (
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 shadow-sm">
              <div className="flex items-center">
                <div className="flex-shrink-0 mr-3">
                  <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
                <p className="text-sm font-medium text-blue-800">Please wait a moment while we sign you in...</p>
              </div>
            </div>
          )}
          
          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-100 shadow-sm">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-red-100 rounded-full p-2 mr-3">
                  <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            </div>
          )}
          
          <div className="space-y-6">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-neutral-dark mb-1">
                Phone Number
              </label>
              <div className="flex">
                <select
                  name="countryCode"
                  value={formData.countryCode}
                  onChange={handleInputChange}
                  className="px-3 py-3.5 border border-gray-300 rounded-l-xl focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200 bg-gray-50"
                  disabled={otpSent}
                >
                  <option value="+91">+91 (India)</option>
                  <option value="+1">+1 (US)</option>
                </select>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                  className="w-full px-4 py-3.5 border border-gray-300 border-l-0 rounded-r-xl focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200"
                  disabled={otpSent}
                />
              </div>
            </div>

            {!otpSent ? (
              <button
                type="button"
                className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg text-base font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
                onClick={handleSendOTP}
                disabled={loading}
              >
                {loading ? (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  'Send OTP'
                )}
              </button>
            ) : !otpVerified ? (
              <>
                <div>
                  <label htmlFor="otp" className="block text-sm font-medium text-neutral-dark mb-1">
                    Enter OTP
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <input
                      id="otp"
                      name="otp"
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      required
                      placeholder="Enter 6-digit OTP"
                      value={formData.otp}
                      onChange={handleInputChange}
                      className="appearance-none block w-full pl-10 pr-3 py-3.5 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg text-base font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
                  onClick={handleVerifyOTP}
                  disabled={loading}
                >
                  {loading ? (
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    'Verify OTP'
                  )}
                </button>
                <button
                  type="button"
                  className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg text-base font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
                  onClick={handleResendOTP}
                  disabled={resendDisabled}
                >
                  {resendDisabled ? (
                    <span>Resend OTP in {resendCountdown} seconds</span>
                  ) : (
                    'Resend OTP'
                  )}
                </button>
              </>
            ) : null}
          </div>


        </div>
      </div>

      <div
  id="recaptcha-container"
  style={{
    height: '1px',
    width: '1px',
    overflow: 'hidden',
    position: 'absolute',
    left: '-9999px'
  }}
></div>
    </div>
  );
};

export default Login;
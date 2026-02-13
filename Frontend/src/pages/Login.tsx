import React from 'react';
import { SignIn, useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import SharedNavbar from '../components/SharedNavbar';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { isLoaded, isSignedIn } = useAuth();

  return (
    <div className="min-h-screen bg-[#fff9ed] font-sans">
      <SharedNavbar />
      <div className="flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
        {isLoaded && !isSignedIn && (
          <SignIn
            routing="hash"
            afterSignInUrl="/"
            signUpUrl="/signup"
          />
        )}
        {isLoaded && isSignedIn && (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">You are already signed in!</h2>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2 bg-black text-white rounded-xl font-medium hover:bg-neutral-800"
            >
              Go to Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
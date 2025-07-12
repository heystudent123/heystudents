import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getApps } from 'firebase/app';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Validate configuration
if (!firebaseConfig.apiKey) {
  throw new Error('Missing Firebase API Key');
}
if (!firebaseConfig.authDomain) {
  throw new Error('Missing Firebase Auth Domain');
}

// Prevent duplicate initialization
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);

// Enable more detailed error logging
auth.useDeviceLanguage();

// Configure phone provider settings
const phoneSettings = new URLSearchParams(window.location.search).get('phoneSettings');
if (phoneSettings === 'test') {
  // For testing purposes only
  console.log('Using test phone settings');
  // @ts-ignore - This is an internal property for testing
  auth.settings.appVerificationDisabledForTesting = true;
}

// Connect to auth emulator if in development
if (process.env.NODE_ENV === 'development' && process.env.REACT_APP_USE_EMULATOR === 'true') {
  connectAuthEmulator(auth, 'http://localhost:9099');
  console.log('Using Firebase Auth Emulator');
}

console.log('Firebase initialized successfully');

export { auth };
export default app;

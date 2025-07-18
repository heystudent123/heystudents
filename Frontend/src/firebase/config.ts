import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getApps } from 'firebase/app';
import { getAnalytics, logEvent, setCurrentScreen } from 'firebase/analytics';

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

// Initialize Firebase Analytics
let analytics: any = null;
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
  try {
    analytics = getAnalytics(app);
    console.log('Firebase Analytics initialized successfully');
  } catch (error) {
    console.error('Error initializing Firebase Analytics:', error);
  }
}

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
if (process.env.NODE_ENV === 'development' && process.env.REACT_APP_USE_EMULATOR === 'true' && process.env.REACT_APP_FIREBASE_EMULATOR_URL) {
  connectAuthEmulator(auth, process.env.REACT_APP_FIREBASE_EMULATOR_URL);
  console.log('Using Firebase Auth Emulator');
}

console.log('Firebase initialized successfully');

// Analytics utility functions
export const trackPageView = (pageName: string) => {
  if (analytics && process.env.NODE_ENV === 'production') {
    logEvent(analytics, 'page_view', {
      page_title: pageName,
      page_location: window.location.href,
      page_path: window.location.pathname
    });
    setCurrentScreen(analytics, pageName);
    console.log(`[Analytics] Page view: ${pageName}`);
  }
};

export const trackEvent = (eventName: string, eventParams: Record<string, any> = {}) => {
  if (analytics && process.env.NODE_ENV === 'production') {
    logEvent(analytics, eventName, eventParams);
    console.log(`[Analytics] Event: ${eventName}`, eventParams);
  }
};

export const trackTiming = (category: string, variable: string, value: number) => {
  if (analytics && process.env.NODE_ENV === 'production') {
    logEvent(analytics, 'timing_complete', {
      name: variable,
      category: category,
      value: value
    });
    console.log(`[Analytics] Timing: ${category} - ${variable}: ${value}ms`);
  }
};

export { app, auth, analytics };

export default app;
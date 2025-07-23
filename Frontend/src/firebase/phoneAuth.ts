import { 
  // PhoneAuthProvider and signInWithCredential are imported but not used
  // Keeping them commented in case they're needed in the future
  // PhoneAuthProvider, 
  RecaptchaVerifier, 
  // signInWithCredential, 
  signInWithPhoneNumber 
} from 'firebase/auth';
import { auth } from './config';

let recaptchaVerifier: RecaptchaVerifier | null = null;
let confirmationResult: any = null;

/**
 * Initialize the reCAPTCHA verifier
 * @param containerId - The ID of the container element for reCAPTCHA
 */
export const initRecaptchaVerifier = (containerId: string) => {
  if (!recaptchaVerifier) {
    recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
      size: 'invisible',
      callback: () => {
        // reCAPTCHA solved, allow signInWithPhoneNumber
      },
      'expired-callback': () => {
        // Response expired. Ask user to solve reCAPTCHA again.
        console.log('reCAPTCHA expired');
      }
    });
  }
  
  return recaptchaVerifier;
};

/**
 * Send OTP to the provided phone number
 * @param phoneNumber - The phone number with country code (e.g., +91XXXXXXXXXX)
 * @param recaptchaContainerId - The ID of the container element for reCAPTCHA
 */
export const sendOTP = async (phoneNumber: string, recaptchaContainerId: string) => {
  try {
    const verifier = initRecaptchaVerifier(recaptchaContainerId);
    confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, verifier);
    return true;
  } catch (error) {
    console.error('Error sending OTP:', error);
    throw error;
  }
};

/**
 * Verify the OTP entered by the user
 * @param otp - The OTP entered by the user
 */
export const verifyOTP = async (otp: string) => {
  try {
    if (!confirmationResult) {
      throw new Error('Please send OTP first');
    }
    
    const result = await confirmationResult.confirm(otp);
    // User signed in successfully
    const user = result.user;
    const token = await user.getIdToken();
    
    return {
      user,
      token,
      phoneNumber: user.phoneNumber
    };
  } catch (error) {
    console.error('Error verifying OTP:', error);
    throw error;
  }
};

/**
 * Reset the recaptcha verifier
 */
export const resetRecaptcha = () => {
  if (recaptchaVerifier) {
    recaptchaVerifier.clear();
    recaptchaVerifier = null;
  }
  confirmationResult = null;
};
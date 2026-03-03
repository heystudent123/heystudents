import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { paymentsApi } from '../services/api';

const STORAGE_KEY = 'lead_popup_dismissed';
const DELAY_MS = 30_000; // 30 seconds

const LeadCaptureModal: React.FC = () => {
  const { isSignedIn, isLoaded } = useAuth();
  const [visible, setVisible] = useState(false);
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Don't do anything until Clerk has loaded its auth state
    if (!isLoaded) return;
    // Don't show if user is already signed in
    if (isSignedIn) return;
    // Don't show if already submitted or dismissed this session
    if (sessionStorage.getItem(STORAGE_KEY)) return;

    timerRef.current = setTimeout(() => {
      // Re-check sign-in state when timer fires
      if (!isSignedIn && !sessionStorage.getItem(STORAGE_KEY)) {
        setVisible(true);
      }
    }, DELAY_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isLoaded, isSignedIn]);

  const dismiss = () => {
    sessionStorage.setItem(STORAGE_KEY, '1');
    setVisible(false);
  };

  const validate = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (!digits) return 'Please enter your mobile number.';
    if (!/^\d{10}$/.test(digits)) return 'Please enter a valid 10-digit mobile number.';
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate(phone);
    if (err) { setError(err); return; }
    setLoading(true);
    try {
      await paymentsApi.savePrePaymentLead({
        name: 'Website Visitor',
        phone: phone.replace(/\D/g, ''),
        courseTitle: 'Website popup lead',
        source: 'popup',
      });
    } catch {
      // Non-blocking — don't block the thank-you state on API failure
    } finally {
      setLoading(false);
      setSubmitted(true);
      sessionStorage.setItem(STORAGE_KEY, '1');
      setTimeout(() => setVisible(false), 2500);
    }
  };

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.45)' }}
      onClick={(e) => { if (e.target === e.currentTarget) dismiss(); }}
    >
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm px-6 py-7 animate-[slideUp_0.3s_ease-out]">
        {/* Close */}
        <button
          onClick={dismiss}
          aria-label="Close"
          className="absolute top-3 right-3 text-gray-400 hover:text-black transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {submitted ? (
          <div className="text-center py-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-black mb-1">You're in!</h3>
            <p className="text-sm text-gray-500">We'll send you free resources and tips. Stay tuned!</p>
          </div>
        ) : (
          <>
            {/* Icon */}
            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-4 mx-auto">
              <span className="text-2xl">📚</span>
            </div>

            <h2 className="text-xl font-bold text-black leading-snug mb-1">
              Get free CUET resources!
            </h2>
            <p className="text-sm text-gray-500 mb-5">
              Drop your number and we'll share free notes, PYQs and tips directly with you. No spam, ever.
            </p>

            <form onSubmit={handleSubmit} noValidate>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Mobile Number
              </label>
              <input
                type="tel"
                inputMode="numeric"
                placeholder="10-digit mobile number"
                value={phone}
                onChange={(e) => {
                  const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
                  setPhone(digits);
                  if (error) setError('');
                }}
                onPaste={(e) => {
                  e.preventDefault();
                  const paste = (e.clipboardData || (window as any).clipboardData).getData('text') || '';
                  const digits = paste.replace(/\D/g, '').slice(0, 10);
                  setPhone(digits);
                  if (error) setError('');
                }}
                maxLength={10}
                className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 transition ${
                  error ? 'border-red-400' : 'border-gray-300'
                }`}
              />
              {error && <p className="text-red-500 text-xs mt-1">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="mt-4 w-full bg-amber-400 hover:bg-amber-300 disabled:bg-amber-200 text-black font-bold py-2.5 rounded-xl text-sm transition-colors"
              >
                {loading ? 'Sending…' : 'Send me free resources →'}
              </button>
            </form>

            <p className="text-center text-xs text-gray-400 mt-3">
              We'll never share your number with anyone.
            </p>
          </>
        )}
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default LeadCaptureModal;

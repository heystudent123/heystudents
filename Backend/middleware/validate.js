/**
 * Lightweight input validation helpers.
 * Used by controllers to validate/sanitize request body fields.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Trim a string field if it exists
const trim = (val) => (typeof val === 'string' ? val.trim() : val);

// Sanitize a plain string: trim + strip HTML-like characters
const sanitizeStr = (val) => {
  if (typeof val !== 'string') return val;
  return val.trim().replace(/[<>]/g, '');
};

// Validate email format
const isValidEmail = (email) => EMAIL_RE.test(String(email).toLowerCase());

// Validate that a value is a finite positive number
const isPositiveNumber = (val) => {
  const n = Number(val);
  return Number.isFinite(n) && n > 0;
};

// Validate MongoDB ObjectId format
const isObjectId = (val) => /^[a-f\d]{24}$/i.test(String(val));

// Validate that a string has non-zero length after trimming
const isNonEmpty = (val) => typeof val === 'string' && val.trim().length > 0;

// Validate phone number: 7–15 digits (international-safe)
const isValidPhone = (val) => /^\+?[\d\s\-]{7,15}$/.test(String(val).trim());

module.exports = {
  trim,
  sanitizeStr,
  isValidEmail,
  isPositiveNumber,
  isObjectId,
  isNonEmpty,
  isValidPhone,
};

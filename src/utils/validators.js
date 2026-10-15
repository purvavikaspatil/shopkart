/**
 * Field-level validators.
 * Each returns an error string, or an empty string when the value is valid,
 * which lets forms do `setErrors({ email: validateEmail(v) })`.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
const PHONE_RE = /^[6-9]\d{9}$/; // Indian mobile numbers.
const PINCODE_RE = /^[1-9]\d{5}$/;
const NAME_RE = /^[a-zA-Z][a-zA-Z\s.'-]{1,49}$/;

export function validateRequired(value, label = 'This field') {
  return String(value ?? '').trim() ? '' : `${label} is required`;
}

export function validateEmail(value) {
  const v = String(value ?? '').trim();
  if (!v) return 'Enter your email address';
  if (!EMAIL_RE.test(v)) return 'Enter a valid email address, like name@example.com';
  return '';
}

export function validatePhone(value) {
  const v = String(value ?? '').replace(/\s|-/g, '');
  if (!v) return 'Enter your mobile number';
  if (!PHONE_RE.test(v)) return 'Enter a valid 10-digit Indian mobile number';
  return '';
}

export function validatePincode(value) {
  const v = String(value ?? '').trim();
  if (!v) return 'Enter a pincode';
  if (!PINCODE_RE.test(v)) return 'Pincode must be 6 digits';
  return '';
}

export function validateName(value, label = 'Name') {
  const v = String(value ?? '').trim();
  if (!v) return `${label} is required`;
  if (!NAME_RE.test(v)) return `${label} can only contain letters, spaces and . ' -`;
  return '';
}

export function validatePassword(value) {
  const v = String(value ?? '');
  if (!v) return 'Enter a password';
  if (v.length < 8) return 'Use at least 8 characters';
  if (!/[a-z]/.test(v)) return 'Add at least one lowercase letter';
  if (!/[0-9]/.test(v)) return 'Add at least one number';
  return '';
}

export function validateConfirmPassword(password, confirm) {
  if (!confirm) return 'Re-enter your password';
  if (password !== confirm) return 'Passwords do not match';
  return '';
}

/**
 * Scores password strength 0-4 and returns a label plus a palette colour key.
 * @param {string} value
 */
export function passwordStrength(value) {
  const v = String(value ?? '');
  let score = 0;
  if (v.length >= 8) score += 1;
  if (v.length >= 12) score += 1;
  if (/[A-Z]/.test(v) && /[a-z]/.test(v)) score += 1;
  if (/\d/.test(v)) score += 1;
  if (/[^A-Za-z0-9]/.test(v)) score += 1;
  score = Math.min(score, 4);
  const meta = [
    { label: 'Too short', color: 'error' },
    { label: 'Weak', color: 'error' },
    { label: 'Fair', color: 'warning' },
    { label: 'Good', color: 'info' },
    { label: 'Strong', color: 'success' },
  ][score];
  return { score, percent: (score / 4) * 100, ...meta };
}

export function validateCardNumber(value) {
  const digits = String(value ?? '').replace(/\s/g, '');
  if (!digits) return 'Enter your card number';
  if (!/^\d{15,16}$/.test(digits)) return 'Card number must be 15 or 16 digits';
  // Luhn checksum - catches typos without contacting any payment provider.
  let sum = 0;
  let double = false;
  for (let i = digits.length - 1; i >= 0; i -= 1) {
    let d = Number(digits[i]);
    if (double) { d *= 2; if (d > 9) d -= 9; }
    sum += d;
    double = !double;
  }
  return sum % 10 === 0 ? '' : 'That card number does not look right';
}

export function validateExpiry(value) {
  const v = String(value ?? '').trim();
  if (!v) return 'Enter the expiry date';
  const match = /^(\d{2})\s*\/\s*(\d{2})$/.exec(v);
  if (!match) return 'Use MM/YY format';
  const month = Number(match[1]);
  const year = 2000 + Number(match[2]);
  if (month < 1 || month > 12) return 'Month must be between 01 and 12';
  const expiry = new Date(year, month, 0, 23, 59, 59);
  if (expiry < new Date()) return 'This card has expired';
  return '';
}

export function validateCvv(value) {
  const v = String(value ?? '').trim();
  if (!v) return 'Enter the CVV';
  return /^\d{3,4}$/.test(v) ? '' : 'CVV must be 3 or 4 digits';
}

export function validateUpi(value) {
  const v = String(value ?? '').trim();
  if (!v) return 'Enter your UPI ID';
  return /^[\w.\-]{2,}@[a-zA-Z]{2,}$/.test(v) ? '' : 'UPI ID looks like name@bank';
}

/**
 * Runs a map of `{ field: validatorFn }` against a values object.
 * @returns {{ errors: Record<string,string>, isValid: boolean }}
 */
export function runValidators(values, validators) {
  const errors = {};
  Object.entries(validators).forEach(([field, fn]) => {
    const message = fn(values[field], values);
    if (message) errors[field] = message;
  });
  return { errors, isValid: Object.keys(errors).length === 0 };
}

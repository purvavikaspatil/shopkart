import { apiRequest, fail } from './apiClient';
import { DEMO_CREDENTIALS, STORAGE_KEYS } from '@/utils/constants';
import { readStorage, writeStorage } from '@/utils/storage';

const ACCOUNTS_KEY = 'shopnest.accounts';

/** Pre-seeded accounts (Admin + Customers) */
const PRE_SEEDED_USERS = [
  {
    id: '660f1f77bcf86cd799430001',
    firstName: 'Parth',
    lastName: 'Abhale',
    email: 'abhale.parth07@gmail.com',
    password: 'Parth@1234',
    phone: '9876543210',
    role: 'admin',
    avatar: 'https://picsum.photos/seed/shopnest-parth/200/200',
    emailVerified: true,
  },
  {
    id: '660f1f77bcf86cd799430002',
    firstName: 'Aarav',
    lastName: 'Sharma',
    email: DEMO_CREDENTIALS.email,
    password: DEMO_CREDENTIALS.password,
    phone: '9845012345',
    role: 'customer',
    avatar: 'https://picsum.photos/seed/shopnest-aarav/200/200',
    emailVerified: true,
  },
  {
    id: '660f1f77bcf86cd799430003',
    firstName: 'Priya',
    lastName: 'Sharma',
    email: 'priya.sharma@example.com',
    password: 'password123',
    phone: '9845012346',
    role: 'customer',
    avatar: 'https://picsum.photos/seed/shopnest-priya/200/200',
    emailVerified: true,
  },
  {
    id: '660f1f77bcf86cd799430004',
    firstName: 'Rohan',
    lastName: 'Mehta',
    email: 'rohan.mehta@example.com',
    password: 'password123',
    phone: '9845012347',
    role: 'customer',
    avatar: 'https://picsum.photos/seed/shopnest-rohan/200/200',
    emailVerified: true,
  },
];

function loadAccounts() {
  const stored = readStorage(ACCOUNTS_KEY, null);
  if (!stored || !Array.isArray(stored) || stored.length === 0) {
    writeStorage(ACCOUNTS_KEY, PRE_SEEDED_USERS);
    return PRE_SEEDED_USERS;
  }
  return stored;
}

function saveAccounts(accounts) {
  writeStorage(ACCOUNTS_KEY, accounts);
}

function toPublicUser(account) {
  const { password, passwordPlain, ...safe } = account;
  return { ...safe, id: safe._id || safe.id };
}

function issueToken(user) {
  return `mock.${btoa(JSON.stringify({ sub: user.id || user._id, iat: Date.now() }))}.token`;
}

export const authService = {
  async login({ email, password }) {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: { email, password },
      fallback: () => {
        const accounts = loadAccounts();
        const account = accounts.find((a) => a.email.toLowerCase() === String(email).trim().toLowerCase());
        if (!account) fail('No account found with that email address.', 404, 'USER_NOT_FOUND');
        if (account.password !== password && account.passwordPlain !== password) {
          fail('That password is incorrect. Try again or reset it.', 401, 'INVALID_PASSWORD');
        }
        return { user: toPublicUser(account), token: issueToken(account) };
      },
    });
  },

  async signup({ firstName, lastName, email, phone, phoneNumber, password }) {
    const userPhone = phoneNumber || phone || '9845012399';
    return apiRequest('/auth/signup', {
      method: 'POST',
      body: { firstName, lastName, email, phoneNumber: userPhone, phone: userPhone, password },
      fallback: () => {
        const accounts = loadAccounts();
        const exists = accounts.some((a) => a.email.toLowerCase() === String(email).trim().toLowerCase());
        if (exists) fail('An account already uses this email. Sign in instead.', 409, 'EMAIL_TAKEN');

        const user = {
          id: `usr-${Date.now().toString(36)}`,
          firstName,
          lastName,
          email: String(email).trim().toLowerCase(),
          phone: userPhone,
          phoneNumber: userPhone,
          password,
          role: 'customer',
          avatar: `https://picsum.photos/seed/shopnest-avatar-${Date.now()}/200/200`,
          emailVerified: true,
          createdAt: new Date().toISOString(),
        };
        saveAccounts([...accounts, user]);
        return { user: toPublicUser(user), token: issueToken(user) };
      },
    });
  },

  async requestPasswordReset(email) {
    return apiRequest('/auth/forgot-password', {
      method: 'POST',
      body: { email },
      fallback: () => ({
        sent: true,
        email,
        message: `If an account exists for ${email}, a reset link is on its way.`,
      }),
    });
  },

  async resetPassword({ email, code = '123456', password }) {
    return apiRequest('/auth/reset-password', {
      method: 'POST',
      body: { email, code, newPassword: password },
      fallback: () => {
        const accounts = loadAccounts();
        const index = accounts.findIndex((a) => a.email.toLowerCase() === String(email).toLowerCase());
        if (index === -1) fail('That reset link is no longer valid. Request a new one.', 400, 'INVALID_TOKEN');
        accounts[index] = { ...accounts[index], password };
        saveAccounts(accounts);
        return { success: true, message: 'Password updated. Please log in.' };
      },
    });
  },

  async verifyEmail({ email, code }) {
    return apiRequest('/auth/verify-email', {
      method: 'POST',
      body: { email, code },
      fallback: () => {
        if (!/^\d{6}$/.test(String(code))) fail('Enter the 6-digit code from your email.', 400, 'INVALID_CODE');
        if (code === '000000') fail('That code has expired. Send a new one.', 400, 'EXPIRED_CODE');
        return { verified: true };
      },
    });
  },

  async resendCode(email) {
    return apiRequest('/auth/resend-code', {
      method: 'POST',
      body: { email },
      fallback: () => ({ sent: true, email }),
    });
  },

  async updateProfile(userId, updates) {
    return apiRequest('/auth/me', {
      method: 'PATCH',
      body: updates,
      fallback: () => {
        const accounts = loadAccounts();
        const index = accounts.findIndex((a) => a.id === userId || a._id === userId);
        if (index === -1) fail('We could not find your account.', 404, 'USER_NOT_FOUND');
        accounts[index] = { ...accounts[index], ...updates };
        saveAccounts(accounts);
        return toPublicUser(accounts[index]);
      },
    });
  },

  async changePassword(userId, { current, next }) {
    return apiRequest('/auth/me/password', {
      method: 'PATCH',
      body: { currentPassword: current, newPassword: next },
      fallback: () => {
        const accounts = loadAccounts();
        const index = accounts.findIndex((a) => a.id === userId || a._id === userId);
        if (index === -1) fail('We could not find your account.', 404, 'USER_NOT_FOUND');
        if (accounts[index].password !== current && accounts[index].passwordPlain !== current) {
          fail('Your current password is incorrect.', 401, 'INVALID_PASSWORD');
        }
        accounts[index] = { ...accounts[index], password: next };
        saveAccounts(accounts);
        return { success: true };
      },
    });
  },

  getStoredSession() {
    return readStorage(STORAGE_KEYS.auth, null);
  },

  async logout() {
    return apiRequest('/auth/logout', {
      method: 'POST',
      fallback: () => ({ success: true }),
    });
  },
};

export default authService;

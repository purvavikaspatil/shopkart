import { apiRequest, fail } from './apiClient';
import { STORAGE_KEYS } from '@/utils/constants';
import { readStorage, writeStorage } from '@/utils/storage';
import { seedAddresses, seedCards, coupons as defaultCoupons } from '@/data/mockContent';
import { generateId } from '@/utils/helpers';

function loadAddresses() {
  const stored = readStorage(STORAGE_KEYS.addresses, null);
  if (!stored) { writeStorage(STORAGE_KEYS.addresses, seedAddresses); return seedAddresses; }
  return stored;
}

function loadCards() {
  const stored = readStorage(STORAGE_KEYS.cards, null);
  if (!stored) { writeStorage(STORAGE_KEYS.cards, seedCards); return seedCards; }
  return stored;
}

function withSingleDefault(list, defaultId) {
  return list.map((item) => ({ ...item, isDefault: item.id === defaultId || item._id === defaultId }));
}

export const userService = {
  async getAddresses() {
    return apiRequest('/users/me/addresses', {
      fallback: () => loadAddresses(),
    }).then((list) => (list || []).map((a) => ({ ...a, id: a._id || a.id })));
  },

  async addAddress(address) {
    return apiRequest('/users/me/addresses', {
      method: 'POST',
      body: address,
      fallback: () => {
        const list = loadAddresses();
        const record = { ...address, id: generateId('addr').toLowerCase() };
        const next = list.length === 0 || address.isDefault
          ? withSingleDefault([...list, { ...record, isDefault: true }], record.id)
          : [...list, { ...record, isDefault: false }];
        writeStorage(STORAGE_KEYS.addresses, next);
        return next;
      },
    }).then((list) => (list || []).map((a) => ({ ...a, id: a._id || a.id })));
  },

  async updateAddress(id, updates) {
    return apiRequest(`/users/me/addresses/${id}`, {
      method: 'PATCH',
      body: updates,
      fallback: () => {
        const list = loadAddresses();
        const index = list.findIndex((a) => a.id === id || a._id === id);
        if (index === -1) fail('That address no longer exists.', 404, 'ADDRESS_NOT_FOUND');
        let next = [...list];
        next[index] = { ...next[index], ...updates };
        if (updates.isDefault) next = withSingleDefault(next, id);
        writeStorage(STORAGE_KEYS.addresses, next);
        return next;
      },
    }).then((list) => (list || []).map((a) => ({ ...a, id: a._id || a.id })));
  },

  async deleteAddress(id) {
    return apiRequest(`/users/me/addresses/${id}`, {
      method: 'DELETE',
      fallback: () => {
        const list = loadAddresses().filter((a) => a.id !== id && a._id !== id);
        if (list.length && !list.some((a) => a.isDefault)) {
          list[0].isDefault = true;
        }
        writeStorage(STORAGE_KEYS.addresses, list);
        return list;
      },
    }).then((list) => (list || []).map((a) => ({ ...a, id: a._id || a.id })));
  },

  async setDefaultAddress(id) {
    return apiRequest(`/users/me/addresses/${id}/default`, {
      method: 'PATCH',
      fallback: () => {
        const list = withSingleDefault(loadAddresses(), id);
        writeStorage(STORAGE_KEYS.addresses, list);
        return list;
      },
    }).then((list) => (list || []).map((a) => ({ ...a, id: a._id || a.id })));
  },

  async getCards() {
    return apiRequest('/users/me/cards', {
      fallback: () => loadCards(),
    }).then((list) => (list || []).map((c) => ({ ...c, id: c._id || c.id })));
  },

  async addCard(card) {
    return apiRequest('/users/me/cards', {
      method: 'POST',
      body: card,
      fallback: () => {
        const list = loadCards();
        const last4 = String(card.number).replace(/\s/g, '').slice(-4);
        const record = {
          id: generateId('card').toLowerCase(),
          last4,
          brand: card.brand || 'Visa',
          holder: card.holder,
          expiry: card.expiry,
          isDefault: list.length === 0,
        };
        const next = [...list, record];
        writeStorage(STORAGE_KEYS.cards, next);
        return next;
      },
    }).then((list) => (list || []).map((c) => ({ ...c, id: c._id || c.id })));
  },

  async removeCard(id) {
    return apiRequest(`/users/me/cards/${id}`, {
      method: 'DELETE',
      fallback: () => {
        const list = loadCards().filter((c) => c.id !== id && c._id !== id);
        if (list.length && !list.some((c) => c.isDefault)) list[0].isDefault = true;
        writeStorage(STORAGE_KEYS.cards, list);
        return list;
      },
    }).then((list) => (list || []).map((c) => ({ ...c, id: c._id || c.id })));
  },

  async setDefaultCard(id) {
    return apiRequest(`/users/me/cards/${id}/default`, {
      method: 'PATCH',
      fallback: () => {
        const list = withSingleDefault(loadCards(), id);
        writeStorage(STORAGE_KEYS.cards, list);
        return list;
      },
    }).then((list) => (list || []).map((c) => ({ ...c, id: c._id || c.id })));
  },

  async getCoupons() {
    return apiRequest('/users/me/coupons', {
      fallback: () => defaultCoupons,
    }).then((list) => (list || defaultCoupons).map((c) => ({
      ...c,
      id: c._id || c.id || c.code,
      isExpired: c.expiresAt ? new Date(c.expiresAt) < new Date() : false,
    })));
  },

  async validateCoupon(code, subtotal = 0) {
    return apiRequest('/users/me/coupons/validate', {
      method: 'POST',
      body: { code, subtotal },
      fallback: () => {
        const match = defaultCoupons.find((c) => c.code.toUpperCase() === String(code).trim().toUpperCase());
        if (!match) fail('That coupon code does not exist. Check the spelling and try again.', 404, 'COUPON_NOT_FOUND');
        if (match.isExpired) fail('That coupon has expired.', 400, 'COUPON_EXPIRED');
        if (subtotal < match.minOrder) fail(`This coupon requires a minimum cart value of INR ${match.minOrder.toLocaleString('en-IN')}.`, 400, 'MIN_ORDER_NOT_MET');
        return match;
      },
    });
  },

  async getMyReviews() {
    return apiRequest('/users/me/reviews', {
      fallback: () => readStorage(STORAGE_KEYS.reviews, []),
    });
  },

  async deleteReview(id) {
    return apiRequest(`/users/me/reviews/${id}`, {
      method: 'DELETE',
      fallback: () => {
        const list = readStorage(STORAGE_KEYS.reviews, []).filter((r) => r.id !== id);
        writeStorage(STORAGE_KEYS.reviews, list);
        return { success: true };
      },
    });
  },
};

export default userService;

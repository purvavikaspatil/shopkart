/**
 * Connected HTTP API Client for ShopNest.
 * Connects frontend to the Express MERN backend on `/api` (or VITE_API_URL).
 * Handles automatic JWT bearer tokens, serialization, and typed ApiError.
 */

import { STORAGE_KEYS } from '@/utils/constants';
import { readStorage } from '@/utils/storage';

export class ApiError extends Error {
  constructor(message, status = 500, code = 'REQUEST_FAILED') {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

export function fail(message, status = 400, code = 'BAD_REQUEST') {
  throw new ApiError(message, status, code);
}

const API_BASE = import.meta.env.VITE_API_URL || '/api';

/**
 * Executes a real HTTP request to the Express backend.
 * @param {string} endpoint e.g. '/products', '/auth/login'
 * @param {RequestInit & { fallback?: () => any }} [options]
 */
export async function apiRequest(endpoint, options = {}) {
  const { fallback, body, headers = {}, ...customConfig } = options;

  // Retrieve current JWT token if shopper is authenticated
  const authState = readStorage(STORAGE_KEYS.auth, null);
  const token = authState?.token;

  const config = {
    method: options.method || (body ? 'POST' : 'GET'),
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    ...customConfig,
  };

  if (body && typeof body === 'object' && !(body instanceof FormData)) {
    config.body = JSON.stringify(body);
  } else if (body) {
    config.body = body;
  }

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  try {
    const res = await fetch(url, config);
    let data;
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await res.json();
    } else {
      const text = await res.text();
      try { data = JSON.parse(text); } catch { data = { message: text }; }
    }

    if (!res.ok) {
      const msg = data?.message || res.statusText || 'Request failed';
      throw new ApiError(msg, res.status, data?.code || 'HTTP_ERROR');
    }

    return data;
  } catch (err) {
    if (fallback) {
      console.warn(`[ShopNest API] ${endpoint} fetch failed, utilizing fallback:`, err.message);
      return fallback();
    }
    if (err instanceof ApiError) throw err;
    throw new ApiError(err.message || 'Network connection failed.', 503, 'NETWORK_ERROR');
  }
}

/**
 * Legacy wrapper: calls resolver or real request.
 */
export async function request(resolver, options = {}) {
  if (typeof resolver === 'function') {
    return resolver();
  }
  return apiRequest(resolver, options);
}

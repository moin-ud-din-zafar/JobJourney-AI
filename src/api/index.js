// src/api/index.js
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
console.log('API_BASE:', API_BASE);

const client = axios.create({
  baseURL: API_BASE,
  withCredentials: false,
});

// Attach JWT from localStorage to every request
client.interceptors.request.use(
  (cfg) => {
    const token = localStorage.getItem('auth_token');
    if (token) cfg.headers.Authorization = `Bearer ${token}`;
    return cfg;
  },
  (err) => Promise.reject(err)
);

// --- Auth API ---
export async function signup(payload) {
  const res = await client.post('/auth/signup', payload);
  return res.data;
}

export async function login(payload) {
  const res = await client.post('/auth/login', payload);
  // backend should return { user?, token } or { token }
  if (res.data?.token) {
    localStorage.setItem('auth_token', res.data.token);
  }
  return res.data;
}

export async function googleAuth(idToken) {
  const res = await client.post('/auth/google', { idToken });
  if (res.data?.token) localStorage.setItem('auth_token', res.data.token);
  return res.data;
}

export async function verify(token) {
  const res = await client.get('/auth/verify', { params: { token } });
  return res.data;
}

export async function me() {
  const res = await client.get('/auth/me');
  return res.data;
}

/**
 * logout() - try to call backend logout if exists, then clear client storage.
 * Always resolves (never throws) so callers can continue.
 */
export async function logout() {
  try {
    await client.post('/auth/logout').catch(() => {}); // optional endpoint
  } catch (err) {
    console.warn('logout request failed', err);
  } finally {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  }
}

export default client;

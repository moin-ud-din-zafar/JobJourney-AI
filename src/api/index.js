// src/api/index.js
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
console.log('API_BASE:', API_BASE);

const client = axios.create({
  baseURL: API_BASE,
  withCredentials: false,
  timeout: 30_000,
});

// Attach JWT from localStorage to every request
client.interceptors.request.use(
  (cfg) => {
    cfg.headers = cfg.headers || {};
    const token = localStorage.getItem('auth_token');
    if (token) {
      cfg.headers.Authorization = `Bearer ${token}`;
      console.debug('[API] ->', (cfg.method || '').toUpperCase(), cfg.baseURL + cfg.url, 'Authorization: Bearer ' + (token ? token.slice(0,8) + '...' : '<none>'));
    } else {
      console.debug('[API] ->', (cfg.method || '').toUpperCase(), cfg.baseURL + cfg.url, 'Authorization: <none>');
    }
    return cfg;
  },
  (err) => Promise.reject(err)
);

// Response debugging and normalized error payload
client.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response) {
      console.warn('[API] response error', err.response.status, err.config?.url, err.response.data);
    } else {
      console.warn('[API] request error', err.message);
    }
    return Promise.reject(err);
  }
);

// helper to parse filename from content-disposition header
function filenameFromContentDisposition(header) {
  if (!header) return null;
  const match = /filename\*?=(?:UTF-8'')?["']?([^;"']+)["']?/i.exec(header);
  if (match && match[1]) {
    try {
      return decodeURIComponent(match[1]);
    } catch (e) {
      return match[1];
    }
  }
  return null;
}

// --- Auth API ---
export async function signup(payload) {
  const res = await client.post('/auth/signup', payload);
  return res.data;
}

export async function login(payload) {
  const res = await client.post('/auth/login', payload);
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

export async function logout() {
  try {
    await client.post('/auth/logout').catch(() => {});
  } catch (err) {
    console.warn('logout request failed', err);
  } finally {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  }
}

// -------- Profile API --------
export async function getProfile() {
  const res = await client.get('/profile');
  return res.data; // expects { profile }
}

export async function updateProfile(payload) {
  const res = await client.put('/profile', payload);
  return res.data; // expects { profile }
}

/**
 * uploadDocument(file, docType?, onProgress?)
 */
export async function uploadDocument(file, docType, onProgress) {
  let actualDocType = typeof docType === 'string' ? docType : '';
  let actualOnProgress = typeof docType === 'function' ? docType : onProgress;
  if (typeof docType === 'function') { actualDocType = ''; actualOnProgress = docType; }

  const form = new FormData();
  form.append('file', file);
  if (actualDocType) form.append('docType', actualDocType);

  const res = await client.post('/profile/document', form, {
    onUploadProgress: (evt) => {
      if (typeof actualOnProgress === 'function' && evt && evt.total) {
        const pct = Math.round((evt.loaded / evt.total) * 100);
        actualOnProgress(pct);
      }
    },
    timeout: 60_000,
  });
  return res.data; // expects { doc, profile }
}

/**
 * Download a document protected by auth. Returns { blob, filename, headers }
 */
export async function downloadDocument(docId) {
  const url = `/profile/document/${encodeURIComponent(docId)}/download`;
  const res = await client.get(url, { responseType: 'blob' });
  const disposition = res.headers && (res.headers['content-disposition'] || res.headers['Content-Disposition']);
  const filename = filenameFromContentDisposition(disposition) || null;
  return { blob: res.data, filename, headers: res.headers };
}

export async function deleteDocument(docId) {
  const res = await client.delete(`/profile/document/${encodeURIComponent(docId)}`);
  return res.data; // expects { profile }
}

// -------- Jobs / Applications API --------
export async function createJob(payload) {
  const res = await client.post('/jobs', payload);
  return res.data; // { message, job }
}

export async function getJobs() {
  const res = await client.get('/jobs');
  return res.data; // { jobs }
}

export async function getJob(jobId) {
  const res = await client.get(`/jobs/${encodeURIComponent(jobId)}`);
  return res.data; // { job }
}

export async function updateJob(jobId, payload) {
  const res = await client.put(`/jobs/${encodeURIComponent(jobId)}`, payload);
  return res.data; // { message, job }
}

export async function deleteJob(jobId) {
  const res = await client.delete(`/jobs/${encodeURIComponent(jobId)}`);
  return res.data; // { message, job }
}

export default client;

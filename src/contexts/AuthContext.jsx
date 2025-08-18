// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // while we check token/me

  useEffect(() => {
    let mounted = true;
    async function init() {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) {
          if (mounted) setUser(null);
          return;
        }
        // fetch current user
        const resp = await api.me();
        // backend /me returns { user } or user object — handle both
        const u = resp?.user ?? resp;
        if (mounted) setUser(u);
      } catch (err) {
        console.warn('Auth init failed', err);
        localStorage.removeItem('auth_token');
        if (mounted) setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    init();
    return () => { mounted = false; };
  }, []);

  // login: call API, store token (api.login already stores token), set user
  async function login(credentials) {
    const res = await api.login(credentials);
    // res might contain user or only token. If user not present, call me()
    let u = res?.user ?? null;
    if (!u) {
      try {
        const meRes = await api.me();
        u = meRes?.user ?? meRes;
      } catch (err) {
        console.warn('me() failed after login', err);
      }
    }
    setUser(u);
    return res;
  }

  // logout: call API logout, clear client state and navigate to /login
  async function logout({ redirect = true } = {}) {
    try {
      await api.logout();
    } catch (err) {
      console.warn('api.logout failed', err);
    } finally {
      setUser(null);
      if (redirect) {
        // immediate navigation to /login — replaces history
        navigate('/login', { replace: true });
      }
    }
  }

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

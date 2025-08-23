// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null); // will hold the user object (may include .profile)
  const [loading, setLoading] = useState(true); // while we check token/me
  const [initializing, setInitializing] = useState(true); // internal init flag

  // Initialize session: if token exists, call /auth/me to populate user
  useEffect(() => {
    let mounted = true;

    async function init() {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) {
          if (mounted) setUser(null);
          return;
        }

        // fetch current user (server returns { user } or user)
        const resp = await api.me();
        const u = resp?.user ?? resp;
        if (mounted) setUser(u);
      } catch (err) {
        console.warn('Auth init failed', err);
        localStorage.removeItem('auth_token');
        if (mounted) setUser(null);
      } finally {
        if (mounted) {
          setLoading(false);
          setInitializing(false);
        }
      }
    }

    init();
    return () => { mounted = false; };
  }, []);

  // login: call API, store token (api.login already stores token), then try to populate full user from /me
  const login = useCallback(async (credentials) => {
    // api.login already stores token in localStorage (per your api implementation)
    const res = await api.login(credentials);

    // If server returned a user in login response, use it; otherwise call /me to get full user (with profile)
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
    return { res, user: u };
  }, []);

  // refresh: re-fetch /auth/me and update context (use after profile updates or when you want latest)
  const refresh = useCallback(async () => {
    try {
      const meRes = await api.me();
      const u = meRes?.user ?? meRes;
      setUser(u);
      return u;
    } catch (err) {
      console.warn('refresh failed', err);
      // if token invalid, clear local state
      localStorage.removeItem('auth_token');
      setUser(null);
      return null;
    }
  }, []);

  // logout: clear token, state, and navigate to /login
  const logout = useCallback(async ({ redirect = true } = {}) => {
    try {
      await api.logout();
    } catch (err) {
      console.warn('api.logout failed', err);
    } finally {
      localStorage.removeItem('auth_token');
      setUser(null);
      if (redirect) navigate('/login', { replace: true });
    }
  }, [navigate]);

  // updateUser: merge arbitrary fields into the user object in context (does not call server)
  const updateUser = useCallback((patch = {}) => {
    setUser(prev => prev ? { ...prev, ...patch } : prev);
  }, []);

  // setProfile: replace or update the user.profile inside context (use after profile PUT/upload)
  const setProfile = useCallback((profile) => {
    setUser(prev => (prev ? { ...prev, profile } : prev));
  }, []);

  const isAuthenticated = Boolean(user);

  return (
    <AuthContext.Provider value={{
      user,
      setUser,
      loading,
      initializing,
      isAuthenticated,
      login,
      logout,
      refresh,
      updateUser,
      setProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ children }) {
  const { token, loading, user } = useAuth();

  // If there is NO token, we can redirect immediately (no waiting)
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If token exists but we're checking server-side session, show loading
  if (loading) return <div className="p-8 text-center">Loading...</div>;

  // token exists and loading is false -> if user present allow, else redirect
  if (user) return children;

  return <Navigate to="/login" replace />;
}

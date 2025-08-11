// src/components/Auth/Login.js
import React, { useState } from 'react';
import { FaEye, FaEyeSlash, FaGoogle, FaFacebook } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

export default function Login({ onLogin }) {
  const [form, setForm] = useState({ email: '', password: '', remember: false });
  const [showPwd, setShowPwd] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    // simulate auth
    setTimeout(() => {
      setSubmitting(false);
      onLogin?.();
      navigate('/');
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-md p-8">
        <div className="flex justify-center mb-6">
          <div className="bg-gray-900 text-white p-3 rounded-lg">
            {/* replace with your logo */}
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2"
                 viewBox="0 0 24 24">
              <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-center mb-1">Welcome Back</h2>
        <p className="text-gray-500 text-center mb-6">Sign in to your account to continue</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              name="email"
              type="email"
              placeholder="john@example.com"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Password + Forgot */}
          <div className="relative">
            <label className="block text-gray-700 mb-1">Password</label>
            <input
              name="password"
              type={showPwd ? 'text' : 'password'}
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="button"
              onClick={() => setShowPwd(v => !v)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500"
            >
              {showPwd ? <FaEyeSlash /> : <FaEye />}
            </button>
            <Link
              to="#"
              className="absolute right-0 top-0 mt-1 text-sm text-indigo-600 hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          {/* Remember Me */}
          <label className="inline-flex items-center">
            <input
              name="remember"
              type="checkbox"
              checked={form.remember}
              onChange={handleChange}
              className="form-checkbox h-4 w-4 text-indigo-600"
            />
            <span className="ml-2 text-teal-700">Remember me</span>
          </label>

          {/* Sign In */}
          <button
            type="submit"
            disabled={submitting}
            className={`w-full py-2 rounded text-white font-semibold 
              ${submitting ? 'bg-indigo-300' : 'bg-teal-600 hover:bg-teal-700'}`}
          >
            {submitting ? 'Signing In…' : 'Sign In'}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <hr className="flex-1 border-gray-300" />
          <span className="px-2 text-teal-700 text-sm">OR CONTINUE WITH</span>
          <hr className="flex-1 border-gray-300" />
        </div>

        {/* Social Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button className="flex items-center justify-center border border-gray-300 py-2 rounded hover:bg-gray-100">
            <FaGoogle className="mr-2 text-red-500" /> Google
          </button>
          <button className="flex items-center justify-center border border-gray-300 py-2 rounded hover:bg-gray-100">
            <FaFacebook className="mr-2 text-blue-600" /> Facebook
          </button>
        </div>

        {/* Bottom Link */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Don’t have an account?{' '}
          <Link to="/signup" className="text-teal-700 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

// src/components/Auth/Signup.js
import React, { useState } from 'react';
import { FaEye, FaEyeSlash, FaGoogle, FaFacebook } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

export default function Signup({ onSignup }) {
  const [form, setForm] = useState({
    first: '',
    last: '',
    email: '',
    password: '',
    confirm: '',
    terms: false,
    marketing: false
  });
  const [showPwd, setShowPwd] = useState({ pw: false, confirm: false });
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      alert("Passwords don't match");
      return;
    }
    if (!form.terms) {
      alert('You must accept the Terms of Service');
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      onSignup?.();
      navigate('/');
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-md p-8">
        <h2 className="text-2xl font-bold text-center mb-1">Create Account</h2>
        <p className="text-gray-500 text-center mb-6">Get started with your free account today</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Names */}
          <div className="grid grid-cols-2 gap-4">
            <input
              name="first"
              placeholder="First name"
              value={form.first}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              name="last"
              placeholder="Last name"
              value={form.last}
              onChange={handleChange}
              required
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Email */}
          <input
            name="email"
            type="email"
            placeholder="john@example.com"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          {/* Password */}
          <div className="relative">
            <input
              name="password"
              type={showPwd.pw ? 'text' : 'password'}
              placeholder="Create a password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="button"
              onClick={() => setShowPwd(s => ({ ...s, pw: !s.pw }))}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500"
            >
              {showPwd.pw ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <input
              name="confirm"
              type={showPwd.confirm ? 'text' : 'password'}
              placeholder="Confirm your password"
              value={form.confirm}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="button"
              onClick={() => setShowPwd(s => ({ ...s, confirm: !s.confirm }))}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500"
            >
              {showPwd.confirm ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {/* Terms & Marketing */}
          <div className="space-y-2">
            <label className="inline-flex items-center">
              <input
                name="terms"
                type="checkbox"
                checked={form.terms}
                onChange={handleChange}
                className="form-checkbox h-4 w-4 text-indigo-600"
              />
              <span className="ml-2 text-gray-700">
                I agree to the <a href="#" className="text-indigo-600 hover:underline">Terms of Service</a> and <a href="#" className="text-indigo-600 hover:underline">Privacy Policy</a>
              </span>
            </label>
            <label className="inline-flex items-center">
              <input
                name="marketing"
                type="checkbox"
                checked={form.marketing}
                onChange={handleChange}
                className="form-checkbox h-4 w-4 text-indigo-600"
              />
              <span className="ml-2 text-gray-700">
                I’d like to receive marketing emails about new features and updates
              </span>
            </label>
          </div>

          {/* Create Account */}
          <button
            type="submit"
            disabled={submitting}
            className={`w-full py-2 rounded text-white font-semibold 
              ${submitting ? 'bg-gray-400' : 'bg-teal-600 hover:bg-teal-700'}`}
          >
            {submitting ? 'Creating…' : 'Create Account'}
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
          Already have an account?{' '}
          <Link to="/login" className="text-teal-700 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

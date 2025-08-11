// src/Components/ImportJobDescriptionForm/LinkInput.jsx
import React from 'react'
import { Linkedin } from 'lucide-react'

export default function LinkInput({ url, setUrl }) {
  return (
    <div className="px-6 py-4">
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        Enter Job URL
      </h3>
      <p className="text-gray-600 mb-4">
        Paste the job posting URL or connect to LinkedIn
      </p>

      <label className="block text-sm font-medium text-gray-700 mb-1">
        Job URL
      </label>
      <input
        type="text"
        value={url}
        onChange={e => setUrl(e.target.value)}
        placeholder="https://linkedin.com/jobs/123456789"
        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 mb-1"
      />
      <p className="text-xs text-gray-500 mb-6">
        Supports LinkedIn, Indeed, and other job boards
      </p>

      <div className="flex items-center my-4">
        <div className="flex-1 border-t border-gray-200" />
        <span className="mx-4 text-sm text-gray-500">OR</span>
        <div className="flex-1 border-t border-gray-200" />
      </div>

      <button className="w-full flex items-center justify-center space-x-2 border border-gray-300 rounded-lg py-2 text-gray-700 hover:bg-gray-50">
        <Linkedin className="w-5 h-5" />
        <span>Connect LinkedIn Account</span>
      </button>
    </div>
  )
}

// src/components/PasteImport.jsx
import React from 'react'
import { Linkedin } from 'lucide-react'

export default function PasteImport({ jd, setJd, charCount, next }) {
  const atLeast100 = charCount >= 100

  return (
    <div className="px-6 py-4">
      {/* Step 1 Header */}
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900">
          Import Job Description
        </h3>
        <p className="text-gray-600">
          Paste the job description or import from LinkedIn
        </p>
      </div>

      {/* JD textarea */}
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Job Description
      </label>
      <textarea
        rows={6}
        className="w-full border-2 border-teal-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-teal-500 mb-1"
        placeholder="Paste the job description here..."
        value={jd}
        onChange={e => setJd(e.target.value)}
      />
      <div className="text-xs text-gray-500 mb-4">
        Minimum 100 characters required ({charCount}/100)
      </div>

      {/* OR divider */}
      <div className="flex items-center my-6">
        <div className="flex-1 border-t border-gray-200" />
        <span className="mx-4 text-sm text-gray-500">OR</span>
        <div className="flex-1 border-t border-gray-200" />
      </div>

      {/* LinkedIn import */}
      <button className="w-full flex items-center justify-center space-x-2 border border-gray-300 rounded-lg py-2 text-gray-700 hover:bg-gray-50 mb-6">
        <Linkedin className="w-5 h-5" />
        <span>Import from LinkedIn</span>
      </button>
    </div>
  )
}

// src/Components/ImportJobDescriptionForm/ConfirmDetails.jsx
import React from 'react'

export default function ConfirmDetails({
  company, setCompany,
  title, setTitle,
  desc, setDesc,
}) {
  return (
    <div className="px-6 py-4">
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        Confirm Job Details
      </h3>
      <p className="text-gray-600 mb-4 text-sm">
        Review and edit the job information
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <input
          type="text"
          value={company}
          onChange={e => setCompany(e.target.value)}
          placeholder="Company Name"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Job Title"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>

      <textarea
        rows={4}
        value={desc}
        onChange={e => setDesc(e.target.value)}
        placeholder="Job Description"
        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
      />
    </div>
  )
}

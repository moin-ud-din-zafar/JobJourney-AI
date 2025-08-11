// src/Components/ImportJobDescriptionForm/ParsedPreview.jsx
import React from 'react'
import { Eye, Link2 } from 'lucide-react'

export default function ParsedPreview({ summary, keywords, fullDesc }) {
  return (
    <div className="px-6 py-4">
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        Parsed Preview
      </h3>
      <p className="text-gray-600 mb-4 text-sm">
        Review the extracted job information
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="flex items-center space-x-2 font-medium text-gray-900 mb-2">
              <Eye size={16} /> <span>AI Summary</span>
            </h4>
            <p className="text-gray-700 text-sm">{summary}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="flex items-center space-x-2 font-medium text-gray-900 mb-2">
              <Link2 size={16} /> <span>Extracted Keywords</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {keywords.map(tag => (
                <span
                  key={tag}
                  className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">Full Description</h4>
          <div className="text-gray-700 text-sm whitespace-pre-wrap">
            {fullDesc}
          </div>
        </div>
      </div>
    </div>
  )
}

import React, { useEffect, useState } from 'react'
import { FileText } from 'lucide-react'

function parseJD(jd) {
  return jd
    .split(/\.?\s+/)
    .filter(s => s.trim().length > 0)
    .slice(0, 5)
}

export default function PreviewParse({ jd, back, next }) {
  const [bullets, setBullets] = useState([])

  useEffect(() => {
    setBullets(parseJD(jd))
  }, [jd])

  return (
    <div className="px-6 py-4">
      {/* Step 2 Header */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Preview &amp; Parse
        </h3>
        <p className="text-gray-600">
          We’ve extracted these key points. Edit as needed:
        </p>
      </div>

      {/* Parsed bullets */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6 overflow-auto">
        <ul className="list-disc list-inside space-y-2 text-gray-800">
          {bullets.map((b, i) => (
            <li key={i}>
              <input
                type="text"
                value={b}
                onChange={e => {
                  const arr = [...bullets]
                  arr[i] = e.target.value
                  setBullets(arr)
                }}
                className="w-full bg-transparent focus:outline-none"
              />
            </li>
          ))}
        </ul>
      </div>

      {/* Back / Next */}
      <div className="flex justify-between items-center">
        <button
          onClick={back}
          className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100"
        >
          ← Back
        </button>
        <button
          onClick={next}
          className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg"
        >
          Next →
        </button>
      </div>
    </div>
  )
}

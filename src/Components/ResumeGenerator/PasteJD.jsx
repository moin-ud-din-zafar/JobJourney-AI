// src/Components/ResumeGenerator/PasteJD.jsx
import React from 'react'
import { FileText, ArrowRight } from 'lucide-react'
import { useDarkTheme } from '../DarkThemeContext' // adjust path if your context file lives elsewhere

export default function PasteJD({ jd, setJd, charCount, onNext }) {
  const { isDark } = useDarkTheme()
  const atLeast100 = charCount >= 100

  // theme-specific class mapping (keeps layout identical, only swaps colors)
  const light = {
    panel: 'border border-gray-200 rounded-lg p-6 space-y-4 bg-white',
    title: 'text-xl font-semibold flex items-center space-x-2 text-gray-900',
    icon: 'w-5 h-5 text-gray-700',
    textarea:
      'w-full border border-gray-200 rounded-md p-4 focus:outline-none focus:ring h-40 md:h-48 resize-vertical text-sm bg-white text-gray-900 placeholder-gray-400',
    charText: 'text-gray-600 text-sm min-w-0',
    charHint: 'text-gray-400',
    footer: 'flex items-center justify-between gap-3 overflow-x-auto',
    btnActive:
      'inline-flex items-center justify-center px-5 py-2 rounded-lg font-medium transition-shadow focus:outline-none focus:ring-2 focus:ring-teal-100 bg-teal-600 hover:bg-teal-700 text-white shadow-sm',
    btnDisabled:
      'inline-flex items-center justify-center px-5 py-2 rounded-lg font-medium transition-shadow focus:outline-none focus:ring-2 focus:ring-teal-100 bg-teal-200 text-gray-700 cursor-not-allowed opacity-90',
    arrowIcon: 'w-4 h-4 ml-1',
  }

  const dark = {
    panel: 'border border-slate-700 rounded-lg p-6 space-y-4 bg-slate-900',
    title: 'text-xl font-semibold flex items-center space-x-2 text-gray-100',
    icon: 'w-5 h-5 text-gray-200',
    textarea:
      'w-full border border-slate-700 rounded-md p-4 focus:outline-none focus:ring h-40 md:h-48 resize-vertical text-sm bg-slate-800 text-gray-100 placeholder-gray-400',
    charText: 'text-gray-300 text-sm min-w-0',
    charHint: 'text-gray-400',
    footer: 'flex items-center justify-between gap-3 overflow-x-auto',
    btnActive:
      'inline-flex items-center justify-center px-5 py-2 rounded-lg font-medium transition-shadow focus:outline-none focus:ring-2 focus:ring-teal-100 bg-teal-600 hover:bg-teal-700 text-white shadow-sm',
    btnDisabled:
      'inline-flex items-center justify-center px-5 py-2 rounded-lg font-medium transition-shadow focus:outline-none focus:ring-2 focus:ring-teal-100 bg-teal-900/30 text-gray-400 cursor-not-allowed opacity-90',
    arrowIcon: 'w-4 h-4 ml-1',
  }

  const s = isDark ? dark : light

  return (
    <div className={s.panel}>
      <h2 className={s.title}>
        <FileText className={s.icon} />
        <span>Step 1: Paste Job Description</span>
      </h2>

      <textarea
        rows={8}
        value={jd}
        onChange={e => setJd(e.target.value)}
        placeholder="Paste the job description here..."
        className={s.textarea}
        aria-label="Job description input"
      />

      {/* Footer: button + char count */}
      <div className={s.footer}>
        <div className={s.charText}>
          <span className="block truncate">
            Characters: {charCount}{' '}
            <span className={s.charHint}>(minimum 100 required)</span>
          </span>
        </div>

        <div className="flex-shrink-0">
          <button
            onClick={onNext}
            disabled={!atLeast100}
            aria-disabled={!atLeast100}
            aria-label="Analyze Job"
            className={atLeast100 ? s.btnActive : s.btnDisabled}
          >
            <span>Analyze Job</span>
            <ArrowRight className={s.arrowIcon} />
          </button>
        </div>
      </div>
    </div>
  )
}

// src/Components/ResumeGenerator/AnalyzeCompare.jsx
import React from 'react'
import { ArrowRight, ChevronLeft } from 'lucide-react'
import { useDarkTheme } from '../DarkThemeContext' // same context used elsewhere

import {
  jobSummary,
  analysisCards,
  matchedKeywords,
  missingKeywords,
  extraKeywords,
  steps,
} from './utils'

export default function AnalyzeCompare({ onBack, onNext }) {
  const { isDark } = useDarkTheme()

  // theme-level class mapping (keeps layout exactly the same, only swaps colors)
  const light = {
    panel: 'border rounded-lg p-6 bg-white',
    heading: 'text-lg font-semibold mb-4 text-gray-900',
    subText: 'text-gray-600',
    muted: 'text-gray-600',
    subtle: 'text-gray-500',
    cardCenterText: 'text-gray-700',
    svgTrack: 'text-gray-200',
    svgFill: 'text-teal-600',
    badgeText: 'text-gray-700',
    footerBtnBack: 'flex items-center px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-100',
    footerBtnNext: 'flex items-center px-5 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700',
    resumeBox: 'bg-gray-50 p-8 rounded-lg inline-block',
    listText: 'text-gray-600',
  }

  const darkTheme = {
    panel: 'border rounded-lg p-6 bg-slate-800 border-slate-700',
    heading: 'text-lg font-semibold mb-4 text-gray-100',
    subText: 'text-gray-300',
    muted: 'text-gray-300',
    subtle: 'text-gray-400',
    cardCenterText: 'text-gray-200',
    svgTrack: 'text-slate-700',
    svgFill: 'text-teal-500',
    badgeText: 'text-gray-200',
    footerBtnBack: 'flex items-center px-4 py-2 border rounded-lg text-gray-300 hover:bg-slate-700',
    footerBtnNext: 'flex items-center px-5 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700',
    resumeBox: 'bg-slate-700 p-8 rounded-lg inline-block',
    listText: 'text-gray-300',
  }

  const s = isDark ? darkTheme : light

  // Safe color-class mapping for small sets (avoids dynamic tailwind class strings)
  const colorMap = {
    green: {
      dot: isDark ? 'bg-green-500' : 'bg-green-600',
      pillBg: isDark ? 'bg-green-900/20' : 'bg-green-100',
      pillText: isDark ? 'text-green-300' : 'text-green-700',
    },
    red: {
      dot: isDark ? 'bg-red-500' : 'bg-red-600',
      pillBg: isDark ? 'bg-red-900/20' : 'bg-red-100',
      pillText: isDark ? 'text-red-300' : 'text-red-700',
    },
    gray: {
      dot: isDark ? 'bg-slate-500' : 'bg-gray-400',
      pillBg: isDark ? 'bg-slate-700' : 'bg-gray-100',
      pillText: isDark ? 'text-gray-200' : 'text-gray-700',
    },
  }

  // Step 2 is always active here
  const matches = 5
  const missing = 3

  return (
    <div className="space-y-6">
      {/* Top three cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Job Summary */}
        <div className={s.panel}>
          <h3 className={s.heading}>Job Summary</h3>
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold">
              {jobSummary.company.split(' ').map(w => w[0]).join('')}
            </div>
            <div>
              <div className="font-medium text-base">{jobSummary.title}</div>
              <div className={`text-sm ${s.subtle}`}>{jobSummary.company}</div>
            </div>
          </div>

          <p className={`text-sm font-medium mb-2 ${s.muted}`}>Key Responsibilities:</p>
          <ul className={`list-disc list-inside space-y-1 ${s.listText}`}>
            {jobSummary.bullets.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
        </div>

        {/* Match Score */}
        {analysisCards.find(c => c.key === 'overall') && (
          <div className={`${s.panel} flex flex-col items-center`}>
            <h3 className={s.heading}>Match Score</h3>

            <div className="relative w-28 h-28 mb-4">
              <svg viewBox="0 0 36 36" className="w-full h-full">
                <path
                  className={s.svgTrack}
                  strokeWidth="3"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845
                     a 15.9155 15.9155 0 0 1 0 31.831
                     a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={s.svgFill}
                  strokeWidth="3"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  strokeDasharray={`${analysisCards[0].pct},100`}
                  d="M18 2.0845
                     a 15.9155 15.9155 0 0 1 0 31.831
                     a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-xl font-bold ${s.cardCenterText}`}>{analysisCards[0].value}</span>
                <span className={`text-xs ${s.subtle}`}>Match</span>
              </div>
            </div>

            <div className="flex space-x-4 text-sm">
              <span className={`flex items-center space-x-1 ${s.badgeText}`}>
                <span className={`${colorMap.green.dot} w-2 h-2 rounded-full`} />
                <span>{matches} matches</span>
              </span>
              <span className={`flex items-center space-x-1 ${s.badgeText}`}>
                <span className={`${colorMap.red.dot} w-2 h-2 rounded-full`} />
                <span>{missing} missing</span>
              </span>
            </div>
          </div>
        )}

        {/* Current Resume */}
        <div className={s.panel + ' text-center'}>
          <h3 className={s.heading}>Current Resume</h3>
          <div className={s.resumeBox}>
            <svg className="w-10 h-10 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M14 2v6h6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M16 13H8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M16 17H8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>

            <p className={s.listText}>Your base resume will be analyzed and tailored</p>
          </div>
        </div>
      </div>

      {/* Keyword Analysis */}
      <div className={s.panel}>
        <h4 className={s.heading}>Keyword Analysis</h4>

        <div className="flex flex-wrap gap-8 text-sm">
          {[
            { title: 'Matched Keywords', key: 'green', list: matchedKeywords },
            { title: 'Missing Keywords', key: 'red', list: missingKeywords },
            { title: 'Extra Keywords', key: 'gray', list: extraKeywords },
          ].map(section => {
            const col = colorMap[section.key]
            return (
              <div key={section.title} className="flex-1">
                <div className="flex items-center mb-2">
                  <span className={`${col.dot} w-2 h-2 rounded-full mr-2`} />
                  <span className="font-medium">{section.title}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {section.list.map(k => (
                    <span key={k} className={`${col.pillBg} ${col.pillText} px-2 py-1 rounded-full text-xs`}>
                      {k}
                    </span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center max-w-full">
        <button onClick={onBack} className={s.footerBtnBack}>
          <ChevronLeft className="w-4 h-4 mr-1" /> Back
        </button>

        <button onClick={onNext} className={s.footerBtnNext}>
          Next <ArrowRight className="w-4 h-4 ml-1" />
        </button>
      </div>
    </div>
  )
}

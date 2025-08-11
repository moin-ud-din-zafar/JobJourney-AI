// src/Components/ResumeGenerator/ReviewGenerate.jsx
import React from 'react'
import {
  ArrowRight,
  ChevronLeft,
  CheckCircle,
  FileText,
  Download,
} from 'lucide-react'
import { useDarkTheme } from '../DarkThemeContext' // one level up

export default function ReviewGenerate({ onBack, onReset, onRestart }) {
  const { isDark } = useDarkTheme()
  const handleReset = onReset || onRestart || (() => {})

  // theme mapping
  const light = {
    panel: 'border border-gray-200 rounded-lg p-4 bg-white',
    headingText: 'text-gray-900',
    muted: 'text-gray-600',
    accentGreenBg: 'bg-green-50',
    accentGreenText: 'text-green-600',
    accentTealBg: 'bg-teal-50',
    accentTealText: 'text-teal-600',
    cardBg: 'bg-white',
    cardText: 'text-gray-700',
    resumeBoxBg: 'bg-gray-50',
    btnPrimary: 'bg-teal-600 text-white hover:bg-teal-700',
    btnPrimaryBlock: 'bg-teal-600 hover:bg-teal-700 text-white',
    btnOutline: 'border text-gray-700 hover:bg-gray-50',
    pillGreen: 'bg-green-100 text-green-700',
    pillGray: 'bg-gray-100 text-gray-700',
    smallText: 'text-gray-700',
  }

  const dark = {
    panel: 'border border-slate-700 rounded-lg p-4 bg-slate-900',
    headingText: 'text-gray-100',
    muted: 'text-gray-300',
    accentGreenBg: 'bg-green-900/10',
    accentGreenText: 'text-green-300',
    accentTealBg: 'bg-teal-900/10',
    accentTealText: 'text-teal-300',
    cardBg: 'bg-slate-800',
    cardText: 'text-gray-200',
    resumeBoxBg: 'bg-slate-700',
    btnPrimary: 'bg-teal-600 text-white hover:bg-teal-700',
    btnPrimaryBlock: 'bg-teal-600 hover:bg-teal-700 text-white',
    btnOutline: 'border text-gray-300 hover:bg-slate-800',
    pillGreen: 'bg-green-900/20 text-green-300',
    pillGray: 'bg-slate-700 text-gray-200',
    smallText: 'text-gray-200',
  }

  const s = isDark ? dark : light

  // optimization pills data (label, value, pill-class)
  const optData = [
    ['ATS Compatibility', '98%', s.pillGreen],
    ['Keyword Density', 'Optimal', s.pillGreen],
    ['Length', '1 Page', s.pillGray],
    ['Readability', 'Excellent', s.pillGreen],
  ]

  return (
    <div className="space-y-6">
      {/* Top success banner */}
      <div className={s.panel}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 gap-2">
          <div className={`flex items-center space-x-2 ${s.accentGreenText}`}>
            <div className={`w-6 h-6 flex items-center justify-center ${s.accentGreenBg} rounded-full`}>
              <CheckCircle className="w-4 h-4" />
            </div>
            <div className="font-semibold" style={{ color: s.headingText ? undefined : undefined }}>
              Resume Generated Successfully!
            </div>
          </div>

          <div className={`${s.muted} sm:flex-1`}>
            Your tailored resume has been optimized for this position
          </div>
        </div>

        {/* Stats cards */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className={`rounded-lg p-4 text-center ${s.accentGreenBg} ${isDark ? 'border border-green-900/30' : ''}`}>
            <div className={`text-2xl font-bold ${s.accentGreenText}`}>12</div>
            <div className={`${s.smallText}`}>Skills Added</div>
          </div>

          <div className={`rounded-lg p-4 text-center ${s.accentTealBg} ${isDark ? 'border border-teal-900/30' : ''}`}>
            <div className={`text-2xl font-bold ${s.accentTealText}`}>8</div>
            <div className={`${s.smallText}`}>Keywords Optimized</div>
          </div>

          <div className={`rounded-lg p-4 text-center ${s.cardBg}`}>
            <div className={`text-2xl font-bold ${s.cardText}`}>—</div>
            <div className={`${s.smallText}`}>Match Score</div>
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Resume Preview */}
        <div className={`${s.cardBg} rounded-lg p-6 space-y-4`}>
          <h4 className={`font-semibold flex items-center space-x-2 ${s.headingText}`}>
            <FileText className={`w-5 h-5 ${s.cardText}`} />
            <span>Resume Preview</span>
          </h4>

          <div className={`${s.resumeBoxBg} rounded-lg p-4 space-y-3`}>
            <h2 className={`text-lg font-bold ${s.cardText}`}>John Developer</h2>
            <p className={`${s.smallText} mb-2`}>
              Senior Frontend Developer • john@example.com • +1 (555) 123-4567 • San Francisco, CA
            </p>
            <hr className={isDark ? 'border-slate-700' : 'border-gray-100'} />
            <div className={`space-y-2 ${s.cardText}`}>
              <p>
                <strong>Professional Summary</strong>
                <br />
                Experienced Frontend Developer with 4+ years specializing in React, TypeScript, and modern web technologies.{' '}
                <span className={`${isDark ? 'bg-green-900/20' : 'bg-green-100'} px-1 rounded ${isDark ? 'text-green-300' : 'text-green-700'}`}>Strong experience with AWS cloud services</span> and{' '}
                <span className={`${isDark ? 'bg-green-900/20' : 'bg-green-100'} px-1 rounded ${isDark ? 'text-green-300' : 'text-green-700'}`}>Docker containerization</span> for DevOps workflows.
              </p>

              <p>
                <strong>Technical Skills</strong>
                <br />
                Frontend: React, TypeScript, JavaScript, HTML5, CSS3
                <br />
                Backend: Node.js, Express, REST APIs
                <br />
                Cloud & DevOps: <span className={`${isDark ? 'bg-green-900/20' : 'bg-green-100'} px-1 rounded ${isDark ? 'text-green-300' : 'text-green-700'}`}>AWS</span>,{' '}
                <span className={`${isDark ? 'bg-green-900/20' : 'bg-green-100'} px-1 rounded ${isDark ? 'text-green-300' : 'text-green-700'}`}>Docker</span>, CI/CD
                <br />
                Testing: <span className={`${isDark ? 'bg-green-900/20' : 'bg-green-100'} px-1 rounded ${isDark ? 'text-green-300' : 'text-green-700'}`}>Jest</span>, Testing Library
              </p>

              <p>
                <strong>Work Experience</strong>
                <br />
                <em>Senior Frontend Developer — TechCorp • 2022–Present</em>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Led development of React applications serving 100K+ users</li>
                  <li><span className={`${isDark ? 'bg-green-900/20' : 'bg-green-100'} px-1 rounded ${isDark ? 'text-green-300' : 'text-green-700'}`}>Implemented Docker containerization</span> reducing deployment time by 60%</li>
                  <li>Collaborated with <span className={`${isDark ? 'bg-green-900/20' : 'bg-green-100'} px-1 rounded ${isDark ? 'text-green-300' : 'text-green-700'}`}>cross-functional agile teams</span> to deliver features</li>
                </ul>
              </p>
            </div>
          </div>
        </div>

        {/* Right: Download & Customize & Stats */}
        <div className="space-y-6">
          {/* Download Resume */}
          <div className={`${s.cardBg} border rounded-lg p-6 space-y-4`}>
            <h4 className={`font-semibold flex items-center space-x-2 ${s.headingText}`}>
              <Download className={`w-5 h-5 ${s.cardText}`} />
              <span>Download Resume</span>
            </h4>

            <div className="space-y-2">
              <button className={`w-full ${s.btnPrimaryBlock} py-2 rounded-lg flex items-center justify-center space-x-2`}>
                <Download className="w-4 h-4" /><span>Download PDF</span>
              </button>
              <button className={`w-full ${s.btnOutline} py-2 rounded-lg flex items-center justify-center space-x-2`}>
                <Download className="w-4 h-4" /><span>Download DOCX</span>
              </button>
              <button className={`w-full ${s.btnOutline} py-2 rounded-lg flex items-center justify-center space-x-2`}>
                <Download className="w-4 h-4" /><span>Copy to Clipboard</span>
              </button>
            </div>
          </div>

          {/* Customize */}
          <div className={`${s.cardBg} border rounded-lg p-6 space-y-4`}>
            <h4 className={`font-semibold flex items-center space-x-2 ${s.headingText}`}>
              <FileText className={`w-5 h-5 ${s.cardText}`} />
              <span>Customize</span>
            </h4>

            <div className="space-y-3">
              <button className={`w-full ${s.btnOutline} py-2 rounded-lg text-left pl-4 flex items-center space-x-2`}>
                <FileText className="w-4 h-4" /><span>Edit Content</span>
              </button>
              <button className={`w-full ${s.btnOutline} py-2 rounded-lg text-left pl-4 flex items-center space-x-2`}>
                <Download className="w-4 h-4" /><span>Change Template</span>
              </button>
              <button className={`w-full ${s.btnOutline} py-2 rounded-lg text-left pl-4 flex items-center space-x-2`}>
                <Download className="w-4 h-4" /><span>Adjust Targeting</span>
              </button>
            </div>
          </div>

          {/* Optimization Stats */}
          <div className={`${s.cardBg} border rounded-lg p-6 space-y-3`}>
            <h4 className={`font-semibold ${s.headingText}`}>Optimization Stats</h4>

            <div className="space-y-2">
              {optData.map(([label, value, pill], idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <span className={s.cardText}>{label}</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${pill}`}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer buttons */}
      <div className="sm:hidden">
        <div className="flex flex-col items-center gap-3">
          <button
            onClick={onBack}
            className={`inline-flex items-center justify-center px-5 py-2 border rounded-lg hover:bg-gray-100 ${isDark ? 'text-gray-300 hover:bg-slate-800' : 'text-gray-600'}`}
            style={{ width: 210 }}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Analysis
          </button>

          <button
            onClick={handleReset}
            className={`inline-flex items-center justify-center px-5 py-2 ${s.btnPrimary} rounded-lg hover:bg-teal-700 space-x-2`}
            style={{ width: 210 }}
          >
            <span>Create New Resume</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="hidden sm:flex sm:items-center sm:justify-between gap-3">
        <div>
          <button
            onClick={onBack}
            className={`flex items-center px-4 py-2 border rounded-lg hover:bg-gray-100 ${isDark ? 'text-gray-300 hover:bg-slate-800' : 'text-gray-600'}`}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Analysis
          </button>
        </div>

        <div>
          <button
            onClick={handleReset}
            className={`flex items-center px-5 py-2 ${s.btnPrimary} rounded-lg hover:bg-teal-700 space-x-2`}
          >
            <span>Create Another Resume</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>
    </div>
  )
}

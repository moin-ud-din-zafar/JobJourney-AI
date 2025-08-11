// src/Pages/ResumeTailor.jsx
import React, { useState } from 'react'
import { UploadCloud, WandSparkles, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react'
import Header from '../Components/Header'
import Footer from '../Components/Footer'
import { useDarkTheme } from '../Components/DarkThemeContext' // ensure correct path

export default function ResumeTailor({ onMenuClick }) {
  const { isDark } = useDarkTheme()

  // theme maps (keeps layout/design same, only color classes change)
  const light = {
    pageBg: 'bg-gray-50',
    title: 'text-gray-900',
    subtitle: 'text-gray-500',
    cardBg: 'bg-white',
    border: 'border-gray-200',
    input:
      'w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white text-gray-900',
    textarea:
      'w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none h-48 text-gray-900 bg-white',
    uploadBox: 'border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center text-center mb-4 h-48',
    uploadIcon: 'w-8 h-8 text-gray-400 mb-2',
    uploadText: 'text-gray-700 mb-1',
    uploadHint: 'text-xs text-gray-500 mb-4',
    fileLabel:
      'cursor-pointer bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100',
    savedCurrent: 'bg-gray-50 border-teal-500',
    savedHover: 'hover:bg-gray-50',
    savedTextCurrent: 'text-teal-600 bg-teal-100 px-2 py-0.5 rounded-full text-xs font-medium',
    suggestionBox: 'bg-gray-50 border border-gray-200 rounded-lg p-4',
    suggestionTitle: 'font-medium text-gray-900',
    suggestionDetail: 'mt-2 text-gray-700 text-sm',
    tag: 'inline-block bg-white border border-gray-300 rounded-full px-3 py-1 text-xs text-gray-700',
    btnPrimary: 'mt-auto bg-teal-600 hover:bg-teal-700 text-white font-medium px-6 py-3 rounded-lg flex items-center justify-center space-x-2 w-full',
    btnApply: 'w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white font-medium px-6 py-3 rounded-lg',
  }

  const darkTheme = {
    pageBg: 'bg-slate-900',
    title: 'text-gray-100',
    subtitle: 'text-gray-300',
    cardBg: 'bg-slate-800',
    border: 'border-slate-700',
    input:
      'w-full border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-800 text-gray-100',
    textarea:
      'w-full border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none h-48 text-gray-100 bg-slate-800',
    uploadBox: 'border-2 border-dashed border-slate-700 rounded-lg p-6 flex flex-col items-center text-center mb-4 h-48',
    uploadIcon: 'w-8 h-8 text-gray-400 mb-2',
    uploadText: 'text-gray-200 mb-1',
    uploadHint: 'text-xs text-gray-400 mb-4',
    fileLabel:
      'cursor-pointer bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm font-medium text-gray-200 hover:bg-slate-700',
    savedCurrent: 'bg-slate-800 border-teal-500',
    savedHover: 'hover:bg-slate-800',
    savedTextCurrent: 'text-teal-400 bg-teal-900/10 px-2 py-0.5 rounded-full text-xs font-medium',
    suggestionBox: 'bg-slate-800 border border-slate-700 rounded-lg p-4',
    suggestionTitle: 'font-medium text-gray-100',
    suggestionDetail: 'mt-2 text-gray-300 text-sm',
    tag: 'inline-block bg-slate-700 border border-slate-600 rounded-full px-3 py-1 text-xs text-gray-100',
    btnPrimary: 'mt-auto bg-teal-600 hover:bg-teal-700 text-white font-medium px-6 py-3 rounded-lg flex items-center justify-center space-x-2 w-full',
    btnApply: 'w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white font-medium px-6 py-3 rounded-lg',
  }

  const s = isDark ? darkTheme : light

  // small color map for icons/pills (keeps explicit tailwind classes)
  const colorMap = {
    green: {
      icon: isDark ? 'text-green-300' : 'text-green-500',
      tagBg: isDark ? 'bg-green-900/10 text-green-300' : 'bg-green-50 text-green-700',
    },
    gray: {
      icon: isDark ? 'text-gray-400' : 'text-gray-300',
      tagBg: isDark ? 'bg-slate-700 text-gray-100' : 'bg-white text-gray-700',
    },
    blue: {
      icon: isDark ? 'text-sky-400' : 'text-blue-500',
      tagBg: isDark ? 'bg-sky-900/10 text-sky-300' : 'bg-white text-blue-700',
    },
  }

  // local state
  const [companyName, setCompanyName] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [resumeFile, setResumeFile] = useState(null)
  const [expanded, setExpanded] = useState({ keywords: true, experience: false, skills: true })

  const savedResumes = [
    { id: 1, name: 'Senior Developer Resume', isCurrent: true },
    { id: 2, name: 'Frontend Specialist Resume', isCurrent: false },
  ]

  // suggestions now only include metadata; we render icon classes using colorMap
  const suggestions = [
    {
      key: 'keywords',
      title: 'Keyword Optimization',
      color: 'green',
      active: true,
      detail: 'Add these keywords to improve your match score:',
      tags: ['React', 'TypeScript', 'AWS', 'Microservices'],
    },
    {
      key: 'experience',
      title: 'Experience Highlighting',
      color: 'gray',
      active: false,
      detail: 'Emphasize your experience with large-scale applications and team leadership.',
    },
    {
      key: 'skills',
      title: 'Skills Alignment',
      color: 'blue',
      active: true,
      detail: 'Reorganize your skills section to match the job requirements priority.',
    },
  ]

  return (
    <div className={`flex flex-col min-h-screen ${s.pageBg} transition-colors duration-150`}>
      <Header onMenuClick={onMenuClick} />

      <main className={`flex-1 py-10 px-6 lg:px-16`}>
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Page Title */}
          <div className="space-y-1">
            <h1 className={`text-3xl font-bold ${s.title}`}>Resume Tailor</h1>
            <p className={s.subtitle}>Optimize your resume for specific job applications</p>
          </div>

          {/* Two-column form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Job Description */}
            <div className={`${s.cardBg} ${s.border} rounded-2xl p-6 shadow-sm flex flex-col`}>
              <h2 className={`text-xl font-semibold mb-4 ${s.title}`}>Job Description</h2>

              <div className="mb-4">
                <label className={`block text-sm font-medium mb-1 ${s.subtitle}`}>Company Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Enter company name"
                  className={s.input}
                />
              </div>

              <div className="mb-4">
                <label className={`block text-sm font-medium mb-1 ${s.subtitle}`}>Job Title</label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="Enter job title"
                  className={s.input}
                />
              </div>

              <div className="mb-6 flex-1">
                <label className={`block text-sm font-medium mb-1 ${s.subtitle}`}>Job Description</label>
                <textarea
                  rows={6}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job description here..."
                  className={s.textarea}
                />
              </div>

              <button className={s.btnPrimary}>
                <WandSparkles className={`w-5 h-5 ${isDark ? 'text-white' : 'text-white'}`} />
                <span>Analyze Job Description</span>
              </button>
            </div>

            {/* Right: Current Resume */}
            <div className={`${s.cardBg} ${s.border} rounded-2xl p-6 shadow-sm flex flex-col`}>
              <h2 className={`text-xl font-semibold mb-4 ${s.title}`}>Current Resume</h2>

              <div className={s.uploadBox}>
                <UploadCloud className={s.uploadIcon} />
                <p className={s.uploadText}>Upload your resume</p>
                <p className={s.uploadHint}>PDF, DOC, or DOCX files only</p>
                <input
                  type="file"
                  id="resume-upload"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={(e) => setResumeFile(e.target.files && e.target.files[0])}
                />
                <label htmlFor="resume-upload" className={s.fileLabel}>
                  Choose File
                </label>
              </div>

              <p className={`text-sm mb-2 ${s.subtitle}`}>Or select from your saved resumes:</p>
              <div className="space-y-2">
                {savedResumes.map((resume) => (
                  <div
                    key={resume.id}
                    className={`flex justify-between items-center px-4 py-2 border rounded-lg ${resume.isCurrent ? s.savedCurrent : ''} ${resume.isCurrent ? '' : s.savedHover}`}
                  >
                    <span className={isDark ? 'text-gray-100' : 'text-gray-900'}>{resume.name}</span>
                    {resume.isCurrent && (
                      <span className={s.savedTextCurrent}>Current</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tailoring Suggestions */}
          <div className={`${s.cardBg} ${s.border} rounded-2xl p-6 shadow-sm mt-8`}>
            <h2 className={`text-xl font-semibold mb-4 ${s.title}`}>Tailoring Suggestions</h2>
            <div className="space-y-4">
              {suggestions.map(({ key, title, color, active, detail, tags }) => {
                const col = colorMap[color] || colorMap.gray
                return (
                  <div key={key} className={s.suggestionBox}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className={`${col.icon} w-5 h-5`} />
                        <span className={`${s.suggestionTitle} ${active ? '' : 'opacity-60'}`}>{title}</span>
                      </div>
                      <button onClick={() => setExpanded(prev => ({ ...prev, [key]: !prev[key] }))}>
                        {expanded[key] ? <ChevronUp className={isDark ? 'text-gray-300' : 'text-gray-600'} /> : <ChevronDown className={isDark ? 'text-gray-300' : 'text-gray-600'} />}
                      </button>
                    </div>
                    {expanded[key] && (
                      <div className={s.suggestionDetail}>
                        <p>{detail}</p>
                        {tags && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {tags.map(tag => (
                              <span key={tag} className={`${s.tag} ${isDark ? '' : ''}`}>{tag}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            <button className={s.btnApply}>
              Apply Suggestions & Generate Tailored Resume
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

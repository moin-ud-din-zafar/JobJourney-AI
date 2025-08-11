// src/Pages/JobLibrary.jsx
import React, { useState, useMemo } from 'react'
import { Search, Plus, Building2, Calendar, X } from 'lucide-react'
import Header from '../Components/Header'
import Footer from '../Components/Footer'
import ImportJobDescriptionModal from '../Components/ImportJobDescriptionForm/ImportJobDescriptionModal'
import { useDarkTheme } from '../Components/DarkThemeContext' // <- ensures the page reacts to theme changes

const jobsData = [
  {
    id: 1,
    title: 'Senior Frontend Developer',
    company: 'TechCorp',
    date: '1/15/2024',
    tags: ['React', 'TypeScript', 'Node.js', 'GraphQL'],
    description: "We're looking for a Senior Frontend Developer to join our team...",
    initials: 'TE',
  },
  {
    id: 2,
    title: 'Full Stack Engineer',
    company: 'StartupXYZ',
    date: '1/12/2024',
    tags: ['Python', 'Django', 'React', 'AWS'],
    description: 'Join our fast-growing startup as a Full Stack Engineer...',
    initials: 'ST',
  },
  {
    id: 3,
    title: 'React Developer',
    company: 'BigTech Inc',
    date: '1/10/2024',
    tags: ['React', 'Redux', 'Testing', 'CI/CD'],
    description: 'We need a React Developer to work on our main product...',
    initials: 'BI',
  },
]

export default function JobLibrary({ onMenuClick }) {
  // read theme so component re-renders when toggled
  const { isDark } = useDarkTheme()

  // theme mapping (keeps design same but selects classes explicitly)
  const light = {
    pageBg: 'bg-gray-50',
    containerText: 'text-gray-900',
    muted: 'text-gray-600',
    subtle: 'text-gray-400',
    cardBg: 'bg-white',
    cardText: 'text-gray-900',
    tagBg: 'bg-gray-100',
    tagText: 'text-gray-700',
    input: 'w-full border border-gray-200 px-4 py-2 rounded-lg pr-10 focus:outline-none focus:ring focus:ring-teal-100 bg-white text-sm text-gray-900',
    inputClearBtn: 'absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md text-gray-500 hover:bg-gray-100',
    iconMuted: 'text-gray-400',
    btnPrimary: 'inline-flex items-center gap-3 bg-teal-600 hover:bg-teal-700 text-white px-3.5 py-2 rounded-lg shadow-md transition',
    articleShadow: 'shadow',
  }

  const dark = {
    pageBg: 'bg-black',
    containerText: 'text-gray-100',
    muted: 'text-gray-300',
    subtle: 'text-gray-400',
    cardBg: 'bg-slate-900',
    cardText: 'text-gray-100',
    tagBg: 'bg-slate-700',
    tagText: 'text-gray-100',
    input: 'w-full border border-slate-700 px-4 py-2 rounded-lg pr-10 focus:outline-none focus:ring focus:ring-teal-100 bg-slate-800 text-sm text-gray-100',
    inputClearBtn: 'absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md text-gray-300 hover:bg-slate-700',
    iconMuted: 'text-gray-400',
    btnPrimary: 'inline-flex items-center gap-3 bg-teal-600 hover:bg-teal-700 text-white px-3.5 py-2 rounded-lg shadow-md transition',
    articleShadow: 'shadow',
  }

  const s = isDark ? dark : light

  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)

  const filteredJobs = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return jobsData
    return jobsData.filter(
      job =>
        job.title.toLowerCase().includes(q) ||
        job.company.toLowerCase().includes(q) ||
        job.tags.some(tag => tag.toLowerCase().includes(q))
    )
  }, [search])

  return (
    <div className="flex-1 flex flex-col h-screen overflow-auto">
      <Header onMenuClick={onMenuClick} />

      <main className={`${s.pageBg} flex-1 py-6 px-4 sm:px-6 lg:px-16 transition-colors duration-150`}>
        <div className="max-w-5xl mx-auto space-y-8 relative">

          {/* Header area: title + Import button */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight truncate ${s.containerText}`}>Jobs Library</h1>
              <p className={`text-sm sm:text-base ${s.muted}`}>Your saved job descriptions and requirements</p>
            </div>

            {/* small/tablet button */}
            <div className="lg:hidden flex-shrink-0">
              <button
                onClick={() => setShowModal(true)}
                aria-label="Import Job Description"
                className={s.btnPrimary}
              >
                <Plus className="w-4 h-4" />
                <span className="text-sm">Import Job Description</span>
              </button>
            </div>

            {/* large screens: same look */}
            <div className="hidden lg:flex flex-shrink-0">
              <button
                onClick={() => setShowModal(true)}
                className={s.btnPrimary}
                aria-label="Import Job Description"
              >
                <Plus size={16} />
                <span>Import Job Description</span>
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="w-full max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder="Search jobs, companies, or keywords..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className={s.input}
                aria-label="Search jobs"
              />
              {search ? (
                <button
                  onClick={() => setSearch('')}
                  aria-label="Clear search"
                  className={s.inputClearBtn}
                >
                  <X className="w-4 h-4" />
                </button>
              ) : (
                <span className={`absolute right-3 top-1/2 -translate-y-1/2 ${s.iconMuted}`}>
                  <Search className="w-4 h-4" />
                </span>
              )}
            </div>
          </div>

          {/* Jobs grid */}
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredJobs.map(job => (
              <article
                key={job.id}
                className={`${s.cardBg} rounded-lg p-6 ${s.articleShadow} transition-colors`}
              >
                {/* Avatar & Title */}
                <div className="flex items-center space-x-3 mb-4">
                  <div className="h-10 w-10 flex items-center justify-center rounded-full bg-teal-600 text-white font-semibold">
                    {job.initials}
                  </div>

                  <div className="min-w-0">
                    <h2 className={`text-lg font-medium truncate ${s.cardText}`}>{job.title}</h2>
                    <div className={`flex items-center text-sm ${s.muted} space-x-1 mt-1`}>
                      <Building2 className="w-4 h-4" />
                      <span className="truncate">{job.company}</span>
                    </div>
                  </div>
                </div>

                {/* Date */}
                <div className={`flex items-center text-sm ${s.subtle} mb-3 space-x-1`}>
                  <Calendar className="w-4 h-4" />
                  <span>{job.date}</span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {job.tags.map(tag => (
                    <span
                      key={tag}
                      className={`${s.tagBg} ${s.tagText} px-3 py-1 rounded-full text-xs`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Description */}
                <p className={`${s.cardText} text-sm mb-4`}>{job.description}</p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <button className={`text-sm ${s.muted} hover:underline`}>Analyze Match</button>
                  </div>

                  <div>
                    <button className="bg-teal-600 hover:bg-teal-700 text-white text-sm px-4 py-1 rounded-lg">
                      Generate Resume
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* No results state */}
          {filteredJobs.length === 0 && (
            <div className={`${s.cardBg} rounded-lg p-6 shadow text-center ${s.muted}`}>
              No jobs matched your search.
            </div>
          )}
        </div>
      </main>

      <Footer />

      {showModal && <ImportJobDescriptionModal onClose={() => setShowModal(false)} />}
    </div>
  )
}

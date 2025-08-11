import React, { useState, useMemo } from 'react'
import { Plus, LayoutGrid, Calendar, Search, Funnel, X } from 'lucide-react'

import Header from '../Components/Header'
import Footer from '../Components/Footer'
import NewApplicationForm from '../Components/NewApplicationForm/NewApplicationForm'
import { useDarkTheme } from '../Components/DarkThemeContext' // <-- use the same context as Header/Sidebar
import CompactCard from '../Components/Dashboard/Cards' // moved card component

// --- mock data & helpers ---
const mockApplications = [
  { id: 1, title: 'Full Stack Developer', company: 'StartupXYZ', date: '1/11/2024', status: 'applied', fit: 88, progress: 25 },
  { id: 2, title: 'Senior Frontend Developer', company: 'TechCorp', date: '1/15/2024', status: 'interviewing', fit: 92, progress: 65, next: 'Technical Interview – Jan 25' },
  { id: 3, title: 'React Developer', company: 'BigTech Inc', date: '1/10/2024', status: 'offers', fit: 95, progress: 90, next: 'Decision by Jan 30' },
  { id: 4, title: 'UI Developer', company: 'LocalCorp', date: '1/08/2024', status: 'rejected', fit: 75, progress: 100 },
  { id: 5, title: 'Backend Developer', company: 'Alpha', date: '1/20/2024', status: 'applied', fit: 82, progress: 10 },
  { id: 6, title: 'Site Reliability', company: 'Ops Ltd', date: '1/22/2024', status: 'interviewing', fit: 79, progress: 40 },
  { id: 7, title: 'Mobile Engineer', company: 'PhoneCo', date: '1/25/2024', status: 'offers', fit: 91, progress: 85 },
  { id: 8, title: 'Data Analyst', company: 'DataWorks', date: '1/18/2024', status: 'applied', fit: 77, progress: 15 },
  { id: 9, title: 'DevOps Engineer', company: 'Cloud9', date: '1/21/2024', status: 'rejected', fit: 70, progress: 100 },
]

// Ensure counts includes all keys we care about so UI never shows undefined
const counts = mockApplications.reduce(
  (acc, a) => {
    acc.total = (acc.total || 0) + 1
    acc[a.status] = (acc[a.status] || 0) + 1
    return acc
  },
  { total: 0, applied: 0, interviewing: 0, offers: 0, rejected: 0 }
)

export default function Dashboard({ onMenuClick }) {
  // read theme so component re-renders on toggle (we'll pick class strings using s below)
  const { isDark } = useDarkTheme()

  // theme-specific class mapping (keeps visual design identical, only class strings change)
  const light = {
    mainBg: 'bg-white',
    pageText: 'text-gray-900',
    mutedText: 'text-gray-600',
    mutedTextSoft: 'text-gray-500',
    cardBg: 'bg-white',
    cardBorder: 'border-gray-100',
    input:
      'w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl bg-white placeholder-gray-400 text-sm text-gray-900',
    inputClearBtn: 'absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-gray-500 hover:bg-gray-100',
    inputIcon: 'absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400',
    btnPrimary: 'inline-flex items-center gap-3 bg-teal-600 hover:bg-teal-700 text-white px-3.5 sm:px-4 py-2 rounded-lg shadow-md transition',
    smallBtn: 'flex items-center gap-2 px-3 py-2 border rounded-xl bg-white text-sm',
    pillActive: 'bg-blue-50 text-blue-700',
    pillDefault: 'bg-white hover:bg-gray-50',
    badgeBg: 'bg-gray-100 text-gray-600',
    sectionHeaderText: 'text-gray-900',
    subTextMuted: 'text-gray-400',
    panelBg: 'bg-white',
  }

  const dark = {
    mainBg: 'bg-black',
    pageText: 'text-gray-200',
    mutedText: 'text-gray-300',
    mutedTextSoft: 'text-gray-400',
    cardBg: 'bg-slate-900',
    cardBorder: 'border-slate-800',
    input:
      'w-full pl-12 pr-4 py-3 border border-slate-700 rounded-xl bg-slate-900 placeholder-gray-500 text-sm text-gray-200',
    inputClearBtn: 'absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-gray-300 hover:bg-slate-800',
    inputIcon: 'absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400',
    btnPrimary: 'inline-flex items-center gap-3 bg-teal-600 hover:bg-teal-700 text-white px-3.5 sm:px-4 py-2 rounded-lg shadow-md transition',
    smallBtn: 'flex items-center gap-2 px-3 py-2 border rounded-xl bg-slate-900 text-sm',
    pillActive: 'bg-blue-50 text-blue-700', // keep bright pills for clarity on dark
    pillDefault: 'bg-slate-900 hover:bg-slate-800',
    badgeBg: 'bg-slate-800 text-gray-300',
    sectionHeaderText: 'text-white',
    subTextMuted: 'text-gray-400',
    panelBg: 'bg-slate-900',
  }

  const s = isDark ? dark : light

  const [view, setView] = useState('kanban')
  const [isFormOpen, setFormOpen] = useState(false)

  // interactions & filters
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [activeStatusFilter, setActiveStatusFilter] = useState('all') // 'all' | 'applied' | 'interviewing' | 'offers' | 'rejected'

  const statuses = [
    { key: 'applied', label: 'Applied', dot: 'bg-blue-500' },
    { key: 'interviewing', label: 'Interviewing', dot: 'bg-sky-500' },
    { key: 'offers', label: 'Offers', dot: 'bg-green-500' },
    { key: 'rejected', label: 'Rejected', dot: 'bg-red-500' },
  ]

  // derived filtered apps
  const filteredApps = useMemo(() => {
    const q = search.trim().toLowerCase()
    return mockApplications.filter(a => {
      if (activeStatusFilter !== 'all' && a.status !== activeStatusFilter) return false
      if (!q) return true
      return (
        a.title.toLowerCase().includes(q) ||
        a.company.toLowerCase().includes(q)
      )
    })
  }, [search, activeStatusFilter])

  // helper to get per-status items from filteredApps
  const getByStatus = sKey => filteredApps.filter(a => a.status === sKey)

  // toggle status filter (click on badge)
  const toggleStatusFilter = key => {
    setActiveStatusFilter(prev => (prev === key ? 'all' : key))
  }

  return (
    <div className="flex-1 flex flex-col h-screen overflow-auto">
      {/* Header */}
      <Header onMenuClick={onMenuClick} />

      <main className={`${s.mainBg} flex-1 py-6 px-3 sm:px-6 lg:px-16 transition-colors duration-150`}>
        <div className="max-w-6xl mx-auto">

          {/* Top: Title + New Application */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold ${s.sectionHeaderText} leading-tight truncate`}>My Applications</h2>
              <p className={`text-sm sm:text-base ${s.mutedText} mt-1`}>Total: <span className={`font-medium ${s.pageText}`}>{counts.total}</span></p>
            </div>

            <div className="mt-0 sm:mt-1">
              <button
                onClick={() => setFormOpen(true)}
                className={s.btnPrimary}
                aria-label="New Application"
              >
                <Plus className="w-4 h-4" />
                <span className="font-medium text-sm">New Application</span>
              </button>
            </div>
          </div>

          {/* Search + Filters Row */}
          <div className="mt-5">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div className="flex-1">
                <div className="relative">
                  <span className={s.inputIcon}>
                    <Search className="w-4 h-4" />
                  </span>
                  <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className={`${s.input} focus:outline-none focus:ring-2 focus:ring-teal-100`}
                    placeholder="Search by title or company..."
                    aria-label="Search applications"
                  />
                  {search && (
                    <button
                      onClick={() => setSearch('')}
                      className={s.inputClearBtn}
                      aria-label="Clear search"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Filter controls: show inline on md+, compact dropdown on small */}
              <div className="flex items-center gap-3">
                {/* small-screen filter toggle */}
                <div className="md:hidden">
                  <button
                    onClick={() => setMobileFiltersOpen(v => !v)}
                    className={`${s.smallBtn}`}
                    aria-expanded={mobileFiltersOpen}
                  >
                    <Funnel className="w-4 h-4 text-gray-600" /> Filters
                  </button>
                </div>

                {/* full filters for md+ */}
                <div className="hidden md:flex items-center gap-3 flex-wrap">
                  <div className="flex items-center gap-2">
                    <button className={`${s.smallBtn}`}>
                      <Funnel className="w-4 h-4 text-gray-600" /> Company
                    </button>
                    <button className={`${s.smallBtn}`}>
                      <Funnel className="w-4 h-4 text-gray-600" /> Role
                    </button>
                    <button className={`${s.smallBtn}`}>
                      <Funnel className="w-4 h-4 text-gray-600" /> Status
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button className="px-3 py-2 border rounded-xl bg-white dark:bg-slate-900 text-sm">High Priority</button>
                    <button
                      onClick={() => setActiveStatusFilter('all')}
                      className="px-3 py-2 border rounded-xl bg-white text-sm text-gray-500 hover:bg-gray-50"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* mobile filters panel (stacked) */}
            {mobileFiltersOpen && (
              <div className={`mt-3 md:hidden rounded-lg p-3 shadow-sm animate-fade-in ${s.panelBg} border ${isDark ? 'border-slate-700' : 'border-gray-100'}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className={`text-sm font-medium ${s.sectionHeaderText}`}>Filters</div>
                  <button onClick={() => setMobileFiltersOpen(false)} className={`p-1 rounded-md ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button className={`${s.smallBtn}`}>
                    <Funnel className="w-4 h-4 text-gray-600" /> Company
                  </button>
                  <button className={`${s.smallBtn}`}>
                    <Funnel className="w-4 h-4 text-gray-600" /> Role
                  </button>
                  <button
                    onClick={() => toggleStatusFilter('applied')}
                    className={`px-3 py-2 rounded-xl text-sm ${activeStatusFilter === 'applied' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border'}`}
                  >
                    Applied
                  </button>
                  <button
                    onClick={() => toggleStatusFilter('interviewing')}
                    className={`px-3 py-2 rounded-xl text-sm ${activeStatusFilter === 'interviewing' ? 'bg-sky-50 border-sky-200 text-sky-700' : 'bg-white border'}`}
                  >
                    Interviewing
                  </button>
                  <button
                    onClick={() => toggleStatusFilter('offers')}
                    className={`px-3 py-2 rounded-xl text-sm ${activeStatusFilter === 'offers' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-white border'}`}
                  >
                    Offers
                  </button>
                  <button
                    onClick={() => toggleStatusFilter('rejected')}
                    className={`px-3 py-2 rounded-xl text-sm ${activeStatusFilter === 'rejected' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-white border'}`}
                  >
                    Rejected
                  </button>
                </div>

                <div className="mt-3 flex gap-2">
                  <button onClick={() => setActiveStatusFilter('all')} className="flex-1 px-3 py-2 rounded-lg border bg-white text-sm">Reset</button>
                  <button onClick={() => setMobileFiltersOpen(false)} className="px-4 py-2 rounded-lg bg-teal-600 text-white text-sm">Apply</button>
                </div>
              </div>
            )}
          </div>

          {/* View toggle + status badges */}
          <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setView('kanban')}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg ${view === 'kanban' ? 'bg-teal-600 text-white' : `${s.pillDefault} border text-gray-700`}`}
              >
                <LayoutGrid className="w-4 h-4" /> <span className="font-medium text-sm">Kanban View</span>
              </button>

              <button
                onClick={() => setView('timeline')}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg ${view === 'timeline' ? 'bg-teal-600 text-white' : `${s.pillDefault} border text-gray-700`}`}
              >
                <Calendar className="w-4 h-4" /> <span className="font-medium text-sm">Timeline View</span>
              </button>
            </div>

            {/* ====== LARGE-SCREEN: keep old inline badges (no change) ====== */}
            <div className="hidden md:flex items-center gap-4 text-sm">
              <button
                onClick={() => toggleStatusFilter('all')}
                className={`px-2 py-1 rounded-full text-xs ${activeStatusFilter === 'all' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                title="Show all"
              >
                All
              </button>

              {statuses.map(sStatus => (
                <button
                  key={sStatus.key}
                  onClick={() => toggleStatusFilter(sStatus.key)}
                  className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs transition ${activeStatusFilter === sStatus.key ? 'bg-opacity-100 shadow-sm' : 'bg-white hover:bg-gray-50'} ${sStatus.key === 'applied' ? 'bg-blue-50 text-blue-700' : sStatus.key === 'interviewing' ? 'bg-sky-50 text-sky-700' : sStatus.key === 'offers' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}
                >
                  <span className={`w-2.5 h-2.5 rounded-full ${sStatus.dot}`} />
                  <span className="whitespace-nowrap">{sStatus.label} <span className="text-gray-400">({counts[sStatus.key] || 0})</span></span>
                </button>
              ))}

              {activeStatusFilter !== 'all' && (
                <button onClick={() => setActiveStatusFilter('all')} className="ml-2 px-2 py-1 border rounded text-xs text-gray-600">Clear</button>
              )}
            </div>

            {/* ====== SMALL-SCREEN: alternate layout so Rejected sits on next row under All. ====== */}
            <div className="flex flex-col md:hidden w-full">
              {/* first row: All + other three (except Rejected) */}
              <div className="flex items-center gap-3 overflow-x-auto">
                <button
                  onClick={() => toggleStatusFilter('all')}
                  className={`px-2 py-1 rounded-full text-xs ${activeStatusFilter === 'all' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                  title="Show all"
                >
                  All
                </button>

                {/* Keep same button sizes: Applied, Interviewing, Offers */}
                <button
                  onClick={() => toggleStatusFilter('applied')}
                  className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs ${activeStatusFilter === 'applied' ? 'bg-blue-50 text-blue-700 shadow-sm' : 'bg-white hover:bg-gray-50 text-gray-700 border'}`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  <span className="whitespace-nowrap">Applied <span className="text-gray-400">({counts.applied || 0})</span></span>
                </button>

                <button
                  onClick={() => toggleStatusFilter('interviewing')}
                  className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs ${activeStatusFilter === 'interviewing' ? 'bg-sky-50 text-sky-700 shadow-sm' : 'bg-white hover:bg-gray-50 text-gray-700 border'}`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                  <span className="whitespace-nowrap">Interviewing <span className="text-gray-400">({counts.interviewing || 0})</span></span>
                </button>

                <button
                  onClick={() => toggleStatusFilter('offers')}
                  className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs ${activeStatusFilter === 'offers' ? 'bg-green-50 text-green-700 shadow-sm' : 'bg-white hover:bg-gray-50 text-gray-700 border'}`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                  <span className="whitespace-nowrap">Offers <span className="text-gray-400">({counts.offers || 0})</span></span>
                </button>
              </div>

              {/* second row: Rejected (keeps identical button sizing/padding) */}
              <div className="mt-2 flex items-center gap-3">
                <button
                  onClick={() => toggleStatusFilter('rejected')}
                  className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs ${activeStatusFilter === 'rejected' ? 'bg-red-50 text-red-700 shadow-sm' : 'bg-white hover:bg-gray-50 text-gray-700 border'}`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <span className="whitespace-nowrap">Rejected <span className="text-gray-400">({counts.rejected || 0})</span></span>
                </button>

                {/* show Clear on mobile when a filter is active */}
                {activeStatusFilter !== 'all' && (
                  <button onClick={() => setActiveStatusFilter('all')} className="ml-2 px-2 py-1 border rounded text-xs text-gray-600">Clear</button>
                )}
              </div>
            </div>
          </div>

          {/* Kanban board */}
          <div className="mt-6">
            {view === 'kanban' ? (
              // Responsive columns: 1 / 2 / 3 / 4
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {statuses.map(sStatus => (
                  <section key={sStatus.key} className="flex flex-col">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className={`w-3 h-3 rounded-full ${sStatus.dot}`} />
                        <h3 className={`text-base font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{sStatus.label}</h3>
                      </div>
                      <span className={`${isDark ? 'bg-slate-800 text-gray-300' : 'bg-gray-100 text-gray-600'} text-xs px-2 py-1 rounded-full`}>{getByStatus(sStatus.key).length}</span>
                    </div>

                    <div className="space-y-3">
                      {getByStatus(sStatus.key).length === 0 && (
                        <div className={`${isDark ? 'text-gray-400' : 'text-gray-400'} text-xs italic`}>No items</div>
                      )}

                      {getByStatus(sStatus.key).map(app => (
                        <CompactCard key={app.id} app={app} />
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Calendar className={`w-12 h-12 ${isDark ? 'text-gray-300' : 'text-gray-700'} mx-auto mb-4`} />
                <h3 className={`text-lg font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Timeline View</h3>
                <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Timeline coming soon…</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />

      {/* New Application Modal */}
      {isFormOpen && <NewApplicationForm onClose={() => setFormOpen(false)} />}
    </div>
  )
}

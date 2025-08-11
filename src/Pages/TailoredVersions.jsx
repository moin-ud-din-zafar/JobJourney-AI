// src/Pages/TailoredVersions.jsx
import React from 'react'
import {
  FileText,
  Eye,
  Edit2,
  Download,
  Copy,
  Trash2,
} from 'lucide-react'
import Header from '../Components/Header'
import Footer from '../Components/Footer'
import { useDarkTheme } from '../Components/DarkThemeContext'

const versionsData = [
  {
    id: 1,
    title: 'Senior React Developer',
    company: 'TechCorp',
    created: 'Jan 15, 2024',
    score: 92,
    status: 'Applied',
  },
  {
    id: 2,
    title: 'Full Stack Engineer',
    company: 'StartupXYZ',
    created: 'Jan 12, 2024',
    score: 88,
    status: 'Draft',
  },
  {
    id: 3,
    title: 'Frontend Lead',
    company: 'BigTech Inc',
    created: 'Jan 10, 2024',
    score: 95,
    status: 'Applied',
  },
  {
    id: 4,
    title: 'React Developer',
    company: 'InnovateCo',
    created: 'Jan 8, 2024',
    score: 85,
    status: 'Applied',
  },
]

export default function TailoredVersions({ onMenuClick }) {
  const { isDark } = useDarkTheme()

  const light = {
    pageBg: 'bg-gray-50',
    heading: 'text-gray-900',
    subText: 'text-gray-600',
    cardBg: 'bg-white',
    border: 'border-gray-200',
    fileIconBg: 'bg-teal-100',
    fileIcon: 'text-teal-600',
    metaText: 'text-sm text-gray-500',
    createdText: 'text-sm text-gray-400',
    actionIcon: 'text-gray-600 hover:text-gray-800',
    trashIcon: 'text-gray-600 hover:text-red-600',
    btnPrimary: 'bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg w-full sm:w-auto',
    statBorder: 'border-gray-200',
    statTitle: 'text-sm text-gray-500',
    statValue: 'text-2xl font-bold',
    appliedBadge: 'bg-blue-100 text-blue-700',
    draftBadge: 'bg-gray-100 text-gray-600',
  }

  const dark = {
    pageBg: 'bg-slate-900',
    heading: 'text-gray-100',
    subText: 'text-gray-300',
    cardBg: 'bg-slate-800',
    border: 'border-slate-700',
    fileIconBg: 'bg-teal-900/10',
    fileIcon: 'text-teal-300',
    metaText: 'text-sm text-gray-300',
    createdText: 'text-sm text-gray-400',
    actionIcon: 'text-gray-300 hover:text-gray-100',
    trashIcon: 'text-gray-300 hover:text-red-400',
    btnPrimary: 'bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg w-full sm:w-auto',
    statBorder: 'border-slate-700',
    statTitle: 'text-sm text-gray-300',
    statValue: 'text-2xl font-bold',
    appliedBadge: 'bg-blue-900/20 text-blue-300',
    draftBadge: 'bg-slate-700 text-gray-300',
  }

  const s = isDark ? dark : light

  const total = versionsData.length
  const appliedCount = versionsData.filter(v => v.status === 'Applied').length
  const draftsCount = versionsData.filter(v => v.status === 'Draft').length
  const avgScore = Math.round(
    versionsData.reduce((sum, v) => sum + v.score, 0) / total
  )

  const getStatusBadge = status => {
    if (status === 'Applied') return s.appliedBadge
    if (status === 'Draft') return s.draftBadge
    return s.draftBadge
  }

  return (
    <div className={`flex flex-col min-h-screen transition-colors duration-150 ${s.pageBg}`}>
      <Header onMenuClick={onMenuClick} />

      <main className="flex-1 py-10 px-6 lg:px-16">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Title & Create */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className={`text-3xl font-bold ${s.heading}`}>Tailored Versions</h1>
              <p className={s.subText}>Manage your job-specific resume versions</p>
            </div>
            <button className={s.btnPrimary}>
              Create New Version
            </button>
          </div>

          {/* Versions List */}
          <div className="space-y-4">
            {versionsData.map(v => (
              <div
                key={v.id}
                className={`${s.cardBg} rounded-lg border ${s.border} p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0`}
              >
                {/* Left info */}
                <div className="flex items-start sm:items-center space-x-4 w-full">
                  <div className={`${s.fileIconBg} p-2 rounded-lg flex-shrink-0`}>
                    <FileText className={`w-6 h-6 ${s.fileIcon}`} />
                  </div>
                  <div className="min-w-0">
                    <h2 className={`text-lg font-semibold truncate ${s.heading}`}>{v.title}</h2>
                    <p className={`text-sm ${s.metaText} truncate`}>{v.company}</p>
                    <p className={`${s.createdText}`}>
                      Created: {v.created} &nbsp; Match Score: {v.score}%
                    </p>
                  </div>
                </div>

                {/* Right actions */}
                <div className="flex items-center space-x-3 w-full sm:w-auto justify-start sm:justify-end">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full flex-shrink-0 ${getStatusBadge(v.status)}`}
                  >
                    {v.status}
                  </span>
                  <div className="flex items-center space-x-3">
                    <Eye className={`w-5 h-5 ${s.actionIcon} cursor-pointer`} />
                    <Edit2 className={`w-5 h-5 ${s.actionIcon} cursor-pointer`} />
                    <Download className={`w-5 h-5 ${s.actionIcon} cursor-pointer`} />
                    <Copy className={`w-5 h-5 ${s.actionIcon} cursor-pointer`} />
                    <Trash2 className={`w-5 h-5 ${s.trashIcon} cursor-pointer`} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Statistics */}
          <div className={`${s.cardBg} rounded-lg border ${s.border} p-6`}>
            <h3 className={`text-xl font-semibold mb-4 ${s.heading}`}>Version Statistics</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className={`border rounded-lg p-4 text-center ${s.border}`}>
                <p className={`${s.statValue} text-teal-600`}>{total}</p>
                <p className={`${s.statTitle} mt-2`}>Total Versions</p>
              </div>
              <div className={`border rounded-lg p-4 text-center ${s.border}`}>
                <p className={`${s.statValue} text-blue-600`}>{appliedCount}</p>
                <p className={`${s.statTitle} mt-2`}>Applied</p>
              </div>
              <div className={`border rounded-lg p-4 text-center ${s.border}`}>
                <p className={`${s.statValue} text-gray-600`}>{draftsCount}</p>
                <p className={`${s.statTitle} mt-2`}>Drafts</p>
              </div>
              <div className={`border rounded-lg p-4 text-center ${s.border}`}>
                <p className={`${s.statValue} text-green-600`}>{avgScore}%</p>
                <p className={`${s.statTitle} mt-2`}>Avg Match Score</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

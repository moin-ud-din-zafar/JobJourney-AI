import React from 'react'
import { MoreHorizontal } from 'lucide-react'
import { useDarkTheme } from '../DarkThemeContext' // same context used by Header/Sidebar

// avatar styling helper based on status (we'll pick final strings depending on theme)
const avatarClassesByStatusLight = {
  applied: 'bg-blue-500 text-white ring-2 ring-white',
  interviewing: 'bg-white text-gray-700 border border-gray-200',
  offers: 'bg-green-500 text-white',
  rejected: 'bg-red-500 text-white',
}
const avatarClassesByStatusDark = {
  applied: 'bg-blue-500 text-white ring-2 ring-black',
  interviewing: 'bg-slate-800 text-gray-200 border border-slate-700',
  offers: 'bg-green-500 text-white',
  rejected: 'bg-red-500 text-white',
}

export default function CompactCard({ app }) {
  const { isDark } = useDarkTheme()
  const initials = app.company.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  const avatarMap = isDark ? avatarClassesByStatusDark : avatarClassesByStatusLight
  const avatarClass = avatarMap[app.status] || (isDark ? 'bg-slate-700 text-gray-200' : 'bg-gray-200 text-gray-700')

  // card background + text adapt to theme via the same s object in parent; we keep this minimal here
  const cardBg = isDark ? 'bg-slate-900 text-gray-200' : 'bg-white text-gray-900'
  const metaBg = isDark ? 'bg-slate-800' : 'bg-gray-100'

  return (
    <div className={`${cardBg} rounded-lg p-4 shadow-sm flex flex-col min-h-[140px] border border-transparent hover:shadow-md transition-shadow`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3 min-w-0">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm flex-shrink-0 ${avatarClass}`}
            aria-hidden
          >
            {initials}
          </div>

          <div className="min-w-0">
            <h4 className={`${isDark ? 'text-white' : 'text-gray-900'} font-medium text-sm leading-tight truncate`}>{app.title}</h4>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-xs truncate`}>{app.company}</p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <MoreHorizontal className={`${isDark ? 'text-gray-400' : 'text-gray-500'} w-4 h-4`} />
        </div>
      </div>

      <div className="mb-3">
        <div className={`flex items-center justify-between text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'} mb-2`}>
          <span className="truncate">{app.date}</span>
          <span className={`inline-flex items-center text-xs font-semibold ${metaBg} px-2 py-1 rounded-full ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
            {app.fit}% match
          </span>
        </div>

        <div className={`flex items-center justify-between text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-1`}>
          <span>Progress</span>
          <span className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-xs`}>{app.progress}%</span>
        </div>

        <div className={`w-full h-2 rounded-full ${isDark ? 'bg-slate-800' : 'bg-gray-100'} overflow-hidden`}>
          <div
            className={`h-full ${
              app.status === 'offers'
                ? 'bg-green-500'
                : app.status === 'rejected'
                ? 'bg-red-500'
                : app.status === 'applied'
                ? 'bg-blue-500'
                : 'bg-sky-400'
            }`}
            style={{ width: `${Math.max(6, app.progress)}%` }}
          />
        </div>
      </div>
    </div>
  )
}

// src/Pages/Analytics.jsx
import React from 'react'
import {
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'
import Header from '../Components/Header'
import Footer from '../Components/Footer'
import { useDarkTheme } from '../Components/DarkThemeContext' // ensure same context as other pages

export default function Analytics({ onMenuClick }) {
  // Summary metrics
  const metrics = [
    { label: 'Applications Sent', value: 24, period: 'This month', change: 12, arrow: 'up', color: 'text-green-600' },
    { label: 'Interview Rate', value: '33%', period: 'Last 30 days', change: 5, arrow: 'up', color: 'text-green-600' },
    { label: 'Response Rate', value: '58%', period: 'Last 30 days', change: -3, arrow: 'down', color: 'text-red-600' },
    { label: 'Avg. Response Time', value: '5.2 days', period: 'Last 30 days', change: -1.1, arrow: 'up', color: 'text-green-600' },
  ]

  // Funnel stages
  const funnel = [
    { label: 'Applications Sent', count: 24, color: 'bg-blue-500' },
    { label: 'Phone Screenings', count: 14, color: 'bg-blue-300' },
    { label: 'Technical Interviews', count: 8, color: 'bg-blue-200' },
    { label: 'Final Interviews', count: 5, color: 'bg-green-500' },
    { label: 'Offers', count: 3, color: 'bg-green-300' },
  ]

  // Company performance
  const companies = [
    { name: 'TechCorp', apps: 3, interviews: 2, offers: 1, rate: '67%' },
    { name: 'StartupXYZ', apps: 2, interviews: 1, offers: 0, rate: '50%' },
    { name: 'BigTech Inc', apps: 2, interviews: 2, offers: 1, rate: '100%' },
    { name: 'InnovateCo', apps: 1, interviews: 1, offers: 0, rate: '100%' },
    { name: 'CloudFirst', apps: 1, interviews: 0, offers: 0, rate: '0%' },
  ]

  // Skills in demand data
  const skills = [
    { name: 'React', count: 12, pct: 85, color: 'bg-teal-600' },
    { name: 'TypeScript', count: 10, pct: 78, color: 'bg-teal-600' },
    { name: 'Node.js', count: 8, pct: 65, color: 'bg-teal-600' },
    { name: 'AWS', count: 7, pct: 60, color: 'bg-teal-600' },
    { name: 'Python', count: 5, pct: 45, color: 'bg-teal-600' },
  ]

  // read theme so component re-renders when toggled (Dashboard pattern)
  const { isDark } = useDarkTheme()

  const light = {
    pageBg: 'bg-gray-50',
    panelBg: 'bg-white',
    cardBorder: 'border-gray-200',
    heading: 'text-gray-900',
    subText: 'text-gray-600',
    muted: 'text-gray-400',
    rowBg: 'bg-gray-50',
    progressBg: 'bg-gray-200',
    icon: 'text-gray-900',
    smallText: 'text-gray-500',
  }

  const dark = {
    pageBg: 'bg-slate-900',
    panelBg: 'bg-slate-800',
    cardBorder: 'border-slate-700',
    heading: 'text-gray-100',
    subText: 'text-gray-300',
    muted: 'text-gray-400',
    rowBg: 'bg-slate-800',
    progressBg: 'bg-slate-700',
    icon: 'text-gray-100',
    smallText: 'text-gray-400',
  }

  const s = isDark ? dark : light

  return (
    <div className="flex flex-col min-h-screen">
      <Header onMenuClick={onMenuClick} />

      <main className={`${s.pageBg} flex-1 py-10 px-6 lg:px-16 transition-colors duration-150`}>
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Title */}
          <div>
            <h1 className={`text-3xl font-bold ${s.heading}`}>Analytics</h1>
            <p className={`${s.subText}`}>Track your job search performance and insights</p>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map((m, i) => {
              const Arrow = m.arrow === 'up' ? ArrowUpRight : ArrowDownRight
              return (
                <div key={i} className={`${s.panelBg} rounded-lg border ${s.cardBorder} p-6`}>
                  <div className={`text-sm ${s.muted}`}>{m.label}</div>
                  <div className="mt-2 flex items-baseline justify-between">
                    <span className={`mt-1 text-2xl font-bold ${s.heading}`}>{m.value}</span>
                    <div className="flex items-center space-x-1">
                      <Arrow className={`${m.color} w-4 h-4`} />
                      <span className={`${m.color} text-sm font-medium`}>{m.change > 0 ? `+${m.change}` : `${m.change}%`}</span>
                    </div>
                  </div>
                  <div className={`text-xs ${s.muted} mt-1`}>{m.period}</div>
                </div>
              )
            })}
          </div>

          {/* Funnel & Company Performance */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Application Funnel */}
            <div className={`${s.panelBg} rounded-lg border ${s.cardBorder} p-6`}>
              <h2 className={`text-xl font-semibold ${s.heading} mb-4`}>Application Funnel</h2>
              <div className="space-y-4">
                {funnel.map((step, idx) => {
                  const totalMax = funnel[0].count || 1
                  const pct = ((step.count / totalMax) * 100).toFixed(0)
                  return (
                    <div key={idx}>
                      <div className={`flex justify-between text-sm ${s.subText} mb-1`}>
                        <span>{step.label}</span>
                        <span>{step.count}</span>
                      </div>
                      <div className={`${s.progressBg} w-full h-2 rounded-full overflow-hidden`}>
                        <div className={`${step.color} h-full`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Company Performance */}
            <div className={`${s.panelBg} rounded-lg border ${s.cardBorder} p-6`}>
              <h2 className={`text-xl font-semibold ${s.heading} mb-4`}>Company Performance</h2>
              <div className="space-y-3">
                {companies.map((c, i) => (
                  <div key={i} className={`${s.rowBg} p-4 rounded-lg flex items-center justify-between`}>
                    <div>
                      <div className={`font-medium ${s.heading}`}>{c.name}</div>
                      <div className={`text-sm ${s.smallText}`}>{c.apps} apps • {c.interviews} interviews • {c.offers} offers</div>
                    </div>
                    <div className={`text-lg font-bold ${s.heading}`}>{c.rate}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Skills in Demand */}
          <div className={`${s.panelBg} rounded-lg border ${s.cardBorder} p-6`}>
            <h2 className={`text-xl font-semibold ${s.heading} mb-4`}>Skills in Demand</h2>
            <div className="space-y-4">
              {skills.map((sk, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className={`${s.subText}`}>{sk.name}</span>
                  <div className="flex-1 mx-4 h-2 rounded-full overflow-hidden">
                    <div className={`${sk.color} h-full`} style={{ width: `${sk.pct}%` }} />
                  </div>
                  <span className={`text-sm ${s.smallText} mr-4`}>{sk.count} jobs</span>
                  <span className={`text-sm ${s.smallText}`}>{sk.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

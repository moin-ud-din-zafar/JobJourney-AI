// src/Pages/Notifications.jsx
import React, { useEffect, useState } from 'react'
import {
  AlertTriangle,
  Bell as BellIcon,
  CheckCircle,
  Calendar,
  Mail,
  Trash2,
  MoreHorizontal,
} from 'lucide-react'
import Header from '../Components/Header'
import Footer from '../Components/Footer'
import { useDarkTheme } from '../Components/DarkThemeContext' // use the same context as the rest of the app

const notificationsData = [
  {
    id: 1,
    type: 'reminder',
    icon: Calendar,
    title: 'Interview Reminder',
    message: 'Technical interview with TechCorp tomorrow at 2:00 PM',
    time: '2 hours ago',
    priority: 'high',
    unread: true,
  },
  {
    id: 2,
    type: 'status',
    icon: CheckCircle,
    title: 'Application Status Update',
    message: "Your application for React Developer at BigTech Inc has been moved to 'Offer' stage",
    time: '1 day ago',
    priority: 'high',
    unread: true,
  },
  {
    id: 3,
    type: 'deadline',
    icon: AlertTriangle,
    title: 'Response Deadline',
    message: 'Decision deadline for BigTech Inc offer is approaching (3 days left)',
    time: '1 day ago',
    priority: 'medium',
    unread: false,
  },
  {
    id: 4,
    type: 'match',
    icon: BellIcon,
    title: 'New Job Match',
    message: 'Found 3 new job matches based on your profile',
    time: '2 days ago',
    priority: 'low',
    unread: false,
  },
  {
    id: 5,
    type: 'update',
    icon: Mail,
    title: 'Resume Update',
    message: 'Your resume has been successfully tailored for StartupXYZ application',
    time: '3 days ago',
    priority: 'low',
    unread: false,
  },
]

export default function Notifications({ onMenuClick }) {
  // read theme so component re-renders on toggle
  const { isDark } = useDarkTheme()

  const [notifications, setNotifications] = useState(notificationsData)
  const [menuOpen, setMenuOpen] = useState(false)

  const unreadCount = notifications.filter(n => n.unread).length
  const highCount = notifications.filter(n => n.priority === 'high').length
  const totalCount = notifications.length

  useEffect(() => {
    // close small-screen menu when clicking elsewhere
    const onDocClick = e => {
      const el = e.target
      if (!el.closest || !el.closest('[data-notifications-menu]')) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('click', onDocClick)
    return () => document.removeEventListener('click', onDocClick)
  }, [])

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })))
  }

  const markRead = id => {
    setNotifications(notifications.map(n => (n.id === id ? { ...n, unread: false } : n)))
  }

  const deleteNotification = id => {
    setNotifications(notifications.filter(n => n.id !== id))
  }

  // theme-specific class mapping (keeps visual design identical, only classes change)
  const light = {
    pageBg: 'bg-gray-50',
    panelBg: 'bg-white',
    cardBg: 'bg-white',
    cardBorder: 'border-gray-200',
    heading: 'text-gray-900',
    subText: 'text-gray-600',
    subSubText: 'text-gray-500',
    icon: 'text-gray-600',
    smallIcon: 'text-gray-700',
    btnText: 'text-gray-700',
    btnHover: 'hover:bg-gray-100',
    dropdownBg: 'bg-white',
    dropdownBorder: 'border-gray-200',
    unreadBorder: 'border-teal-200',
    unreadBg: 'bg-teal-50',
    actionIcon: 'text-gray-600 hover:text-red-600',
  }

  const dark = {
    pageBg: 'bg-slate-900',
    panelBg: 'bg-slate-800',
    cardBg: 'bg-slate-800',
    cardBorder: 'border-slate-700',
    heading: 'text-gray-100',
    subText: 'text-gray-300',
    subSubText: 'text-gray-400',
    icon: 'text-gray-300',
    smallIcon: 'text-gray-200',
    btnText: 'text-gray-200',
    btnHover: 'dark:hover:bg-slate-700',
    dropdownBg: 'bg-slate-800',
    dropdownBorder: 'border-slate-700',
    unreadBorder: 'border-teal-700',
    unreadBg: 'dark:bg-teal-900/10',
    actionIcon: 'text-gray-300 hover:text-red-400',
  }

  const s = isDark ? dark : light

  const priorityBadgeClass = priority => {
    if (priority === 'high') {
      return `px-2 py-1 text-xs font-medium rounded-full uppercase ${isDark ? 'bg-red-900/30 text-red-300' : 'bg-red-100 text-red-600'}`
    }
    if (priority === 'medium') {
      return `px-2 py-1 text-xs font-medium rounded-full uppercase ${isDark ? 'bg-yellow-900/20 text-yellow-300' : 'bg-yellow-100 text-yellow-600'}`
    }
    return `px-2 py-1 text-xs font-medium rounded-full uppercase ${isDark ? 'bg-slate-700 text-gray-200' : 'bg-gray-100 text-gray-600'}`
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <Header onMenuClick={onMenuClick} />

      <main className={`${s.pageBg} flex-1 py-10 px-4 sm:px-6 lg:px-16 transition-colors duration-150`}>
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Title + actions */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className={`text-3xl font-bold ${s.heading}`}>Notifications</h1>
              <p className={`${s.subText}`}>{unreadCount} unread notifications</p>
            </div>

            {/* Large screens: inline buttons */}
            <div className="hidden sm:flex items-center space-x-2">
              <button
                onClick={markAllRead}
                className={`px-4 py-2 rounded-lg border ${s.btnHover} text-sm ${s.btnText}`}
                aria-label="Mark all read"
              >
                Mark All Read
              </button>
              <button
                className={`px-4 py-2 rounded-lg border ${s.btnHover} text-sm ${s.btnText}`}
                aria-label="Notification settings"
              >
                Settings
              </button>
            </div>

            {/* Small screens: compact menu */}
            <div className="sm:hidden flex items-center justify-end">
              <div className="relative" data-notifications-menu>
                <button
                  onClick={() => setMenuOpen(v => !v)}
                  className={`p-2 rounded-md ${s.panelBg} shadow border ${isDark ? 'dark:border-slate-700' : ''}`}
                  aria-expanded={menuOpen}
                  aria-label="Open actions"
                >
                  <MoreHorizontal className={`w-5 h-5 ${s.smallIcon}`} />
                </button>

                {menuOpen && (
                  <div className={`absolute right-0 mt-2 w-44 ${s.dropdownBg} border ${s.dropdownBorder} rounded-md shadow-lg z-50`}>
                    <button
                      onClick={() => {
                        markAllRead()
                        setMenuOpen(false)
                      }}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-slate-700 ${s.btnText}`}
                    >
                      Mark All Read
                    </button>
                    <button
                      onClick={() => {
                        /* in real app you'd navigate to settings */
                        setMenuOpen(false)
                      }}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-slate-700 ${s.btnText}`}
                    >
                      Settings
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className={`${s.cardBg} rounded-lg border ${s.cardBorder} p-4 flex items-center space-x-4`}>
              <AlertTriangle className="w-6 h-6 text-red-500" />
              <div>
                <p className={`text-2xl font-bold ${s.heading}`}>{highCount}</p>
                <p className={`text-sm ${s.subSubText}`}>High Priority</p>
              </div>
            </div>

            <div className={`${s.cardBg} rounded-lg border ${s.cardBorder} p-4 flex items-center space-x-4`}>
              <BellIcon className="w-6 h-6 text-teal-500" />
              <div>
                <p className={`text-2xl font-bold ${s.heading}`}>{unreadCount}</p>
                <p className={`text-sm ${s.subSubText}`}>Unread</p>
              </div>
            </div>

            <div className={`${s.cardBg} rounded-lg border ${s.cardBorder} p-4 flex items-center space-x-4`}>
              <CheckCircle className="w-6 h-6 text-green-500" />
              <div>
                <p className={`text-2xl font-bold ${s.heading}`}>{totalCount}</p>
                <p className={`text-sm ${s.subSubText}`}>Total</p>
              </div>
            </div>
          </div>

          {/* Notification List */}
          <div className="space-y-4">
            {notifications.map(n => {
              const Icon = n.icon
              return (
                <div
                  key={n.id}
                  className={`rounded-lg p-4 border-2 transition-colors ${
                    n.unread
                      ? `${s.unreadBorder} ${s.unreadBg}`
                      : `${s.cardBorder} ${s.cardBg}`
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    {/* Left: icon + text */}
                    <div className="flex items-start space-x-4 flex-1 min-w-0">
                      <Icon className={`w-6 h-6 ${s.icon} mt-1 flex-shrink-0`} />
                      <div className="min-w-0">
                        <h2 className={`font-semibold truncate ${s.heading}`}>{n.title}</h2>
                        <p className={`text-sm truncate ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>{n.message}</p>
                        <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{n.time}</p>
                      </div>
                    </div>

                    {/* Right actions */}
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className={priorityBadgeClass(n.priority)}>
                        {n.priority}
                      </span>

                      {n.unread && <span className="w-2 h-2 bg-teal-600 rounded-full" />}

                      <div className="flex items-center gap-2">
                        {n.unread && (
                          <button
                            onClick={() => markRead(n.id)}
                            className="text-sm text-teal-600 hover:underline"
                            aria-label={`Mark ${n.id} read`}
                          >
                            Mark Read
                          </button>
                        )}

                        <button
                          onClick={() => deleteNotification(n.id)}
                          className={`p-1 rounded ${isDark ? 'dark:hover:bg-slate-700' : 'hover:bg-gray-100'}`}
                          aria-label={`Delete notification ${n.id}`}
                        >
                          <Trash2 className={`w-5 h-5 ${s.actionIcon}`} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

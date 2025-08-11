// src/Components/Sidebar.jsx
import React from 'react'
import { NavLink } from 'react-router-dom'
import { Home, BookOpen, FileText, Bell, BarChart2, Settings, X, ChevronsLeft } from 'lucide-react'
import { useDarkTheme } from './DarkThemeContext' // adjust path if your context lives elsewhere

const navItems = [
  { label: 'Dashboard', icon: Home, to: '/' },
  { label: 'Jobs Library', icon: BookOpen, to: '/jobs' },
  { label: 'Resume Generator', icon: FileText, to: '/resume-generator' },
  { label: 'Resume Tailor', icon: FileText, to: '/resume-tailor' },
  { label: 'Tailored Versions', icon: FileText, to: '/tailored-versions' },
  { label: 'Notifications', icon: Bell, to: '/notifications' },
  { label: 'Analytics', icon: BarChart2, to: '/analytics' },
  { label: 'Settings', icon: Settings, to: '/settings' },
]

export default function Sidebar({
  isCollapsed = false,
  isMobileOpen = false,
  onClose = () => {},
  onToggleCollapse = () => {},
  onLogout = () => {},
}) {
  const { isDark } = useDarkTheme()

  const light = {
    overlayBackdrop: 'absolute inset-0 bg-black/40',
    panel: 'absolute inset-y-0 left-0 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-40',
    header: 'p-4 flex items-center justify-between border-b text-gray-900 font-bold',
    navItemDefault:
      'flex items-center w-full py-2 px-3 rounded-lg transition-colors duration-200 ease-in-out hover:bg-gray-100 text-gray-800',
    navItemActive: 'flex items-center w-full py-2 px-3 rounded-lg transition-colors duration-200 ease-in-out bg-teal-100 text-teal-700',
    desktopAside: 'hidden xl:block xl:fixed xl:inset-y-0 xl:left-0 z-20 bg-white shadow-lg transition-all duration-300 ease-in-out',
    desktopHeader: 'p-4 font-bold text-lg border-b flex items-center justify-between',
    mobileCloseBtn: 'p-2 rounded-md text-gray-700 hover:bg-gray-100',
    logoutBtn: 'w-full text-left mt-4 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700',
  }

  const dark = {
    overlayBackdrop: 'absolute inset-0 bg-black/60',
    panel: 'absolute inset-y-0 left-0 w-64 bg-black shadow-lg transform transition-transform duration-300 ease-in-out z-40',
    header: 'p-4 flex items-center justify-between border-b border-slate-800 text-white font-bold',
    navItemDefault:
      'flex items-center w-full py-2 px-3 rounded-lg transition-colors duration-200 ease-in-out hover:bg-slate-800 text-gray-200',
    navItemActive: 'flex items-center w-full py-2 px-3 rounded-lg transition-colors duration-200 ease-in-out bg-teal-900/20 text-teal-300',
    desktopAside: 'hidden xl:block xl:fixed xl:inset-y-0 xl:left-0 z-20 bg-black shadow-lg transition-all duration-300 ease-in-out',
    desktopHeader: 'p-4 font-bold text-lg border-b flex items-center justify-between text-white border-slate-800',
    mobileCloseBtn: 'p-2 rounded-md text-gray-200 hover:bg-slate-800',
    logoutBtn: 'w-full text-left mt-4 px-3 py-2 rounded-lg hover:bg-slate-800 text-gray-200',
  }

  const s = isDark ? dark : light

  return (
    <>
      {/* Mobile/tablet overlay (screens smaller than xl - i.e. <1280px) */}
      <div
        className={`fixed inset-0 z-30 xl:hidden transition-opacity ${isMobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        aria-hidden={!isMobileOpen}
      >
        {/* backdrop */}
        <div onClick={onClose} className={s.overlayBackdrop} />
        {/* panel */}
        <aside
          className={`${s.panel} ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          <div className={s.header}>
            <div className="font-bold">JobTracker AI</div>
            <button onClick={onClose} className={s.mobileCloseBtn} aria-label="Close menu">
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="p-4 space-y-1">
            {navItems.map(({ label, icon: Icon, to }) => (
              <NavLink
                key={label}
                to={to}
                onClick={onClose}
                className={({ isActive }) => (isActive ? s.navItemActive : s.navItemDefault)}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="ml-3 font-medium">{label}</span>
              </NavLink>
            ))}

            {/* Optional logout for mobile */}
            <button onClick={() => { onLogout(); onClose(); }} className={s.logoutBtn}>
              Logout
            </button>
          </nav>
        </aside>
      </div>

      {/* Desktop / Tablet: permanent sidebar (xl and up, i.e. >=1280px) */}
      <aside
        className={`${s.desktopAside} ${isCollapsed ? 'xl:w-16' : 'xl:w-64'}`}
      >
        <div className={`${isCollapsed ? 'p-4 font-bold text-lg border-b flex items-center justify-center' : s.desktopHeader}`}>
          {!isCollapsed ? 'JobTracker AI' : 'JT'}
          <div className="flex items-center gap-2">
            {/* Uncomment to enable collapse toggle */}
            {/* <button onClick={onToggleCollapse} className="p-1 rounded-md hidden md:inline-flex" aria-label="Collapse menu">
              <ChevronsLeft className="w-4 h-4" />
            </button> */}
            {/* <button onClick={onLogout} className="p-1 rounded-md text-sm hidden md:inline-flex">
              Logout
            </button> */}
          </div>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map(({ label, icon: Icon, to }) => (
            <NavLink
              key={label}
              to={to}
              className={({ isActive }) =>
                (isActive ? s.navItemActive : s.navItemDefault) + ' flex items-center w-full'
              }
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span className="ml-3 font-medium">{label}</span>}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  )
}

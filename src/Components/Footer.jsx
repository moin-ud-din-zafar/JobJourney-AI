// src/Components/Footer.jsx
import React from 'react'
import { useDarkTheme } from './DarkThemeContext' // adjust path if your context is elsewhere

export default function Footer() {
  const { isDark } = useDarkTheme()

  const light = {
    footer: 'bg-white border-t border-gray-200',
    container: 'max-w-6xl mx-auto px-6 py-4 text-sm',
    text: 'text-gray-600',
  }

  const dark = {
    footer: 'bg-black border-t border-slate-800',
    container: 'max-w-6xl mx-auto px-6 py-4 text-sm',
    text: 'text-gray-300',
  }

  const s = isDark ? dark : light

  return (
    <footer role="contentinfo" className={`${s.footer} mt-auto transition-colors duration-150`}>
      <div className={`${s.container} ${s.text}`}>
        © {new Date().getFullYear()} JobTracker AI — All rights reserved.
      </div>
    </footer>
  )
}

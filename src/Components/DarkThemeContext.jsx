// src/Components/DarkThemeContext.jsx
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const DarkThemeContext = createContext({
  theme: 'system', // 'light' | 'dark' | 'system'
  setTheme: (_t) => {},
  toggleTheme: () => {},
  isDark: false,
})

export function DarkThemeProvider({ children }) {
  // load stored preference or default to 'system'
  const [theme, setThemeState] = useState(() => {
    try {
      const v = localStorage.getItem('theme-preference')
      if (v === 'light' || v === 'dark' || v === 'system') return v
    } catch (e) {}
    return 'system'
  })

  // helper to detect OS preference
  const prefersDark = useCallback(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  }, [])

  // derived boolean
  const isDark = useMemo(() => {
    if (theme === 'dark') return true
    if (theme === 'light') return false
    return prefersDark()
  }, [theme, prefersDark])

  // apply `dark` class to <html> (document.documentElement) whenever effective theme changes
  useEffect(() => {
    const html = document.documentElement
    if (isDark) html.classList.add('dark')
    else html.classList.remove('dark')

    // persist chosen preference
    try {
      localStorage.setItem('theme-preference', theme)
    } catch (e) {}
  }, [isDark, theme])

  // when in 'system' mode, listen to OS changes and update the html class
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const mql = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e) => {
      // only act when user preference is 'system'
      if (theme !== 'system') return
      const html = document.documentElement
      if (e.matches) html.classList.add('dark')
      else html.classList.remove('dark')
    }
    // add listener
    if (mql.addEventListener) mql.addEventListener('change', handler)
    else mql.addListener(handler)

    return () => {
      if (mql.removeEventListener) mql.removeEventListener('change', handler)
      else mql.removeListener(handler)
    }
  }, [theme])

  // toggles: system -> choose opposite of current system; otherwise swap light/dark
  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      if (prev === 'system') {
        // if system is dark, toggling should go to light, and vice-versa
        return prefersDark() ? 'light' : 'dark'
      }
      return prev === 'dark' ? 'light' : 'dark'
    })
  }, [prefersDark])

  // explicit setter
  const setTheme = useCallback((value) => {
    if (value !== 'light' && value !== 'dark' && value !== 'system') return
    setThemeState(value)
    try {
      localStorage.setItem('theme-preference', value)
    } catch (e) {}
  }, [])

  return (
    <DarkThemeContext.Provider value={{ theme, setTheme, toggleTheme, isDark }}>
      {children}
    </DarkThemeContext.Provider>
  )
}

export function useDarkTheme() {
  const ctx = useContext(DarkThemeContext)
  if (!ctx) throw new Error('useDarkTheme must be used inside DarkThemeProvider')
  return ctx
}

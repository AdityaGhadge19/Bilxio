import React, { createContext, useContext, useState, useEffect } from 'react'

interface SettingsContextType {
  theme: 'light' | 'dark'
  setTheme: (theme: 'light' | 'dark') => void
  compactMode: boolean
  setCompactMode: (compact: boolean) => void
  showAnimations: boolean
  setShowAnimations: (show: boolean) => void
  autoRefresh: boolean
  setAutoRefresh: (auto: boolean) => void
  notificationsEnabled: boolean
  setNotificationsEnabled: (enabled: boolean) => void
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('subly-theme')
    return (saved as 'light' | 'dark') || 'light'
  })
  
  const [compactMode, setCompactMode] = useState(() => {
    const saved = localStorage.getItem('subly-compact-mode')
    return saved === 'true'
  })
  
  const [showAnimations, setShowAnimations] = useState(() => {
    const saved = localStorage.getItem('subly-animations')
    return saved !== 'false'
  })
  
  const [autoRefresh, setAutoRefresh] = useState(() => {
    const saved = localStorage.getItem('subly-auto-refresh')
    return saved !== 'false'
  })
  
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    const saved = localStorage.getItem('subly-notifications')
    return saved !== 'false'
  })

  useEffect(() => {
    localStorage.setItem('subly-theme', theme)
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  useEffect(() => {
    localStorage.setItem('subly-compact-mode', compactMode.toString())
  }, [compactMode])

  useEffect(() => {
    localStorage.setItem('subly-animations', showAnimations.toString())
  }, [showAnimations])

  useEffect(() => {
    localStorage.setItem('subly-auto-refresh', autoRefresh.toString())
  }, [autoRefresh])

  useEffect(() => {
    localStorage.setItem('subly-notifications', notificationsEnabled.toString())
  }, [notificationsEnabled])

  return (
    <SettingsContext.Provider value={{
      theme,
      setTheme,
      compactMode,
      setCompactMode,
      showAnimations,
      setShowAnimations,
      autoRefresh,
      setAutoRefresh,
      notificationsEnabled,
      setNotificationsEnabled
    }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}
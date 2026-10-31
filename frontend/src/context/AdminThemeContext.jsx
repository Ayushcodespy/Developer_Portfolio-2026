import { createContext, useContext, useEffect, useState, useMemo } from 'react'

const ADMIN_THEME_STORAGE_KEY = 'ayush-admin-theme'

const AdminThemeContext = createContext({
  adminTheme: 'dark',
  toggleAdminTheme: () => {},
  setAdminTheme: () => {},
})

export function AdminThemeProvider({ children }) {
  const [adminTheme, setAdminThemeState] = useState(() => {
    try {
      const stored = localStorage.getItem(ADMIN_THEME_STORAGE_KEY)
      if (stored === 'light' || stored === 'dark') return stored
    } catch {
      // fallback
    }
    return 'dark'
  })

  useEffect(() => {
    try {
      localStorage.setItem(ADMIN_THEME_STORAGE_KEY, adminTheme)
    } catch {
      // ignore
    }
  }, [adminTheme])

  const toggleAdminTheme = () => {
    setAdminThemeState((prev) => (prev === 'light' ? 'dark' : 'light'))
  }

  const setAdminTheme = (newTheme) => {
    if (newTheme === 'light' || newTheme === 'dark') {
      setAdminThemeState(newTheme)
    }
  }

  const value = useMemo(
    () => ({ adminTheme, toggleAdminTheme, setAdminTheme }),
    [adminTheme]
  )

  return (
    <AdminThemeContext.Provider value={value}>
      {children}
    </AdminThemeContext.Provider>
  )
}

export function useAdminTheme() {
  const context = useContext(AdminThemeContext)
  if (!context) {
    throw new Error('useAdminTheme must be used within an AdminThemeProvider')
  }
  return context
}

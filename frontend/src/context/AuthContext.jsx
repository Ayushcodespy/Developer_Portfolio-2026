import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { adminApi } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const checkAuth = useCallback(async () => {
    try {
      setLoading(true)
      const data = await adminApi.auth.me()
      setAdmin(data)
      setError(null)
      return data
    } catch {
      localStorage.removeItem('admin_token')
      setAdmin(null)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  const login = async (username, password) => {
    setError(null)
    try {
      const data = await adminApi.auth.login({ username, password })
      if (data?.token) {
        localStorage.setItem('admin_token', data.token)
      }
      setAdmin(data)
      return data
    } catch (err) {
      localStorage.removeItem('admin_token')
      setError(err.message || 'Login failed. Please check your credentials.')
      throw err
    }
  }

  const logout = async () => {
    try {
      await adminApi.auth.logout()
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      localStorage.removeItem('admin_token')
      setAdmin(null)
    }
  }

  return (
    <AuthContext.Provider value={{ admin, loading, error, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { ShieldCheck, Lock, User, Eye, EyeOff, Loader2, ArrowLeft, Sun, Moon } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useAdminTheme } from '../../context/AdminThemeContext'
import { Alert } from '../../components/admin/Alert'

export function AdminLogin() {
  const { admin, login } = useAuth()
  const { adminTheme, toggleAdminTheme } = useAdminTheme()
  const navigate = useNavigate()
  const location = useLocation()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  // Redirect if already logged in
  useEffect(() => {
    if (admin) {
      const destination = location.state?.from?.pathname || '/admin/dashboard'
      navigate(destination, { replace: true })
    }
  }, [admin, navigate, location])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')

    if (!username.trim() || !password.trim()) {
      setErrorMessage('Please enter both username and password.')
      return
    }

    try {
      setLoading(true)
      await login(username.trim(), password)
      const destination = location.state?.from?.pathname || '/admin/dashboard'
      navigate(destination, { replace: true })
    } catch (err) {
      setErrorMessage(err.message || 'Invalid username or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className={`admin-portal min-h-screen ${
        adminTheme === 'light' ? 'admin-light' : 'admin-dark'
      } bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans relative`}
      data-admin-theme={adminTheme}
    >
      <div className="absolute top-4 right-4">
        <button
          type="button"
          onClick={toggleAdminTheme}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title={adminTheme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          aria-label="Toggle theme"
        >
          {adminTheme === 'light' ? (
            <Moon className="w-5 h-5 text-indigo-500" />
          ) : (
            <Sun className="w-5 h-5 text-amber-400" />
          )}
        </button>
      </div>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Brand Header */}
        <div className="flex justify-center">
          <div className="w-14 h-14 rounded-2xl bg-[#007BA7]/20 border border-[#007BA7]/30 flex items-center justify-center text-[#007BA7] shadow-lg shadow-[#007BA7]/15">
            <ShieldCheck className="w-8 h-8" />
          </div>
        </div>
        <h1 className="mt-6 text-center text-2xl font-bold tracking-tight text-slate-100">
          Admin CMS Portal
        </h1>
        <p className="mt-2 text-center text-sm text-slate-400">
          Sign in to manage portfolio content and database records
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-900 py-8 px-6 sm:px-10 border border-slate-800 rounded-2xl shadow-xl">
          {errorMessage && (
            <Alert
              type="error"
              message={errorMessage}
              onClose={() => setErrorMessage('')}
              className="mb-6"
            />
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <label htmlFor="username" className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Username
              </label>
              <div className="mt-2 relative rounded-lg">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="block w-full pl-10 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#007BA7] focus:border-[#007BA7] transition-colors"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Password
              </label>
              <div className="mt-2 relative rounded-lg">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="block w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#007BA7] focus:border-[#007BA7] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold text-white bg-[#007BA7] hover:bg-[#0093C7] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#007BA7] focus:ring-offset-slate-900 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {loading ? 'Authenticating...' : 'Sign in to CMS'}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-800 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Return to Public Portfolio
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

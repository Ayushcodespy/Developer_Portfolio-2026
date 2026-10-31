import { useState, useEffect } from 'react'
import {
  ShieldCheck,
  Key,
  Database,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
  AlertCircle,
  User,
  Server,
  FileText,
  ExternalLink,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { adminApi } from '../../services/api'
import { Alert } from '../../components/admin/Alert'

export function AdminSettings() {
  const { admin } = useAuth()

  // Resume Management state
  const DEFAULT_RESUME = 'https://drive.google.com/file/d/138oZq3lHvm-3PsaHVz7hmR0SrOmvs_1G/view?usp=sharing'
  const [resumeUrl, setResumeUrl] = useState('')
  const [loadingResume, setLoadingResume] = useState(true)
  const [savingResume, setSavingResume] = useState(false)
  const [resumeError, setResumeError] = useState(null)
  const [resumeSuccess, setResumeSuccess] = useState(null)

  useEffect(() => {
    let mounted = true
    const fetchResume = async () => {
      try {
        setLoadingResume(true)
        const data = await adminApi.settings.getResume()
        if (mounted && data?.resume_url) {
          setResumeUrl(data.resume_url)
        } else if (mounted) {
          setResumeUrl(DEFAULT_RESUME)
        }
      } catch (err) {
        if (mounted) {
          console.error('Failed to load resume setting:', err)
          setResumeUrl(DEFAULT_RESUME)
        }
      } finally {
        if (mounted) setLoadingResume(false)
      }
    }
    fetchResume()
    return () => {
      mounted = false
    }
  }, [])

  const handleSaveResume = async (e) => {
    e.preventDefault()
    setResumeError(null)
    setResumeSuccess(null)

    const trimmed = resumeUrl.trim()
    if (!trimmed) {
      setResumeError('Resume URL is required.')
      return
    }

    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
      setResumeError('Resume URL must start with http:// or https://')
      return
    }

    try {
      setSavingResume(true)
      const res = await adminApi.settings.updateResume({ resume_url: trimmed })
      setResumeSuccess(res.message || 'Resume link saved successfully!')
      setResumeUrl(res.resume_url || trimmed)
    } catch (err) {
      setResumeError(err.message || 'Failed to save resume link. Please try again.')
    } finally {
      setSavingResume(false)
    }
  }

  // Change Password state
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const handleChangePassword = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('All password fields are required.')
      return
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long.')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('New password and confirmation password do not match.')
      return
    }

    try {
      setLoading(true)
      await adminApi.auth.changePassword({
        current_password: currentPassword,
        new_password: newPassword,
      })
      setSuccess('Administrator password updated successfully.')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      setError(err.message || 'Failed to update password. Please check your current password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8 max-w-4xl animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-100">Admin CMS Settings</h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Manage administrator account credentials, database connections, and session security.
        </p>
      </div>

      {success && <Alert type="success" message={success} onClose={() => setSuccess(null)} />}
      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

      <div className="grid grid-cols-1 gap-6">
        {/* Administrator Profile Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2.5 text-base font-semibold text-slate-200 border-b border-slate-800 pb-3">
            <User className="w-5 h-5 text-blue-400" />
            Current Administrator Session
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
              <span className="text-slate-400 block mb-1">Username</span>
              <span className="text-sm font-bold text-slate-100">{admin?.username || 'admin'}</span>
            </div>

            <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
              <span className="text-slate-400 block mb-1">Session Security</span>
              <span className="text-sm font-semibold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> HttpOnly Cookie JWT
              </span>
            </div>

            <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
              <span className="text-slate-400 block mb-1">Token Storage</span>
              <span className="text-xs font-medium text-slate-300">
                Browser Cookie (Zero localStorage exposure)
              </span>
            </div>

            <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
              <span className="text-slate-400 block mb-1">Password Hashing</span>
              <span className="text-xs font-mono text-cyan-300">scrypt (salt + key derivation)</span>
            </div>
          </div>
        </div>

        {/* Resume Management Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2.5 text-base font-semibold text-slate-200">
              <FileText className="w-5 h-5 text-blue-400" />
              Resume Management
            </div>
            {resumeUrl && (
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors"
              >
                <span>Preview Current Resume</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

          <p className="text-xs text-slate-400">
            Set your public resume URL (e.g. Google Drive view link, Dropbox link, or hosted PDF).
            The &quot;Download Resume&quot; button on your portfolio will dynamically link to this URL.
          </p>

          {resumeSuccess && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{resumeSuccess}</span>
            </div>
          )}

          {resumeError && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{resumeError}</span>
            </div>
          )}

          <form onSubmit={handleSaveResume} className="space-y-4 max-w-xl">
            <div>
              <label htmlFor="resume_url" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Resume URL *
              </label>
              <div className="relative">
                <input
                  id="resume_url"
                  type="url"
                  required
                  value={resumeUrl}
                  onChange={(e) => {
                    setResumeUrl(e.target.value)
                    setResumeError(null)
                    setResumeSuccess(null)
                  }}
                  disabled={loadingResume || savingResume}
                  placeholder="https://drive.google.com/file/d/.../view?usp=sharing"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Enter a publicly accessible URL starting with http:// or https://.
              </p>
            </div>

            <div className="pt-1">
              <button
                type="submit"
                disabled={savingResume || loadingResume}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#007BA7] hover:bg-[#00688f] rounded-lg transition-colors shadow-sm shadow-[#007BA7]/20 disabled:opacity-50 cursor-pointer"
              >
                {savingResume ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                {savingResume ? 'Saving Resume Link...' : 'Save Resume Link'}
              </button>
            </div>
          </form>
        </div>

        {/* Change Password Form */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-5">
          <div className="flex items-center gap-2.5 text-base font-semibold text-slate-200 border-b border-slate-800 pb-3">
            <Key className="w-5 h-5 text-blue-400" />
            Change Admin Password
          </div>

          <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Current Password *
              </label>
              <div className="relative">
                <input
                  type={showCurrent ? 'text' : 'password'}
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pr-10 pl-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300"
                  aria-label={showCurrent ? 'Hide password' : 'Show password'}
                >
                  {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                New Password *
              </label>
              <div className="relative">
                <input
                  type={showNew ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pr-10 pl-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300"
                  aria-label={showNew ? 'Hide password' : 'Show password'}
                >
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Must be at least 6 characters.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Confirm New Password *
              </label>
              <input
                type={showNew ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#007BA7] hover:bg-[#00688f] rounded-lg transition-colors shadow-sm shadow-[#007BA7]/20 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                {loading ? 'Updating Password...' : 'Update Password'}
              </button>
            </div>
          </form>
        </div>

        {/* Database & Infrastructure Info Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2.5 text-base font-semibold text-slate-200 border-b border-slate-800 pb-3">
            <Server className="w-5 h-5 text-blue-400" />
            Backend & Persistence Architecture
          </div>

          <div className="space-y-3 text-xs text-slate-300">
            <div className="flex items-center justify-between py-2 border-b border-slate-800/60">
              <span className="text-slate-400">Database Engine</span>
              <span className="font-semibold text-slate-100 font-mono">SQLite (portfolio.db)</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-800/60">
              <span className="text-slate-400">ORM Framework</span>
              <span className="font-semibold text-slate-100">SQLAlchemy 2.0</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-800/60">
              <span className="text-slate-400">REST Framework</span>
              <span className="font-semibold text-slate-100">FastAPI 0.116+</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-slate-400">Data Synchronization</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Shared SQLite File for Public & Admin
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

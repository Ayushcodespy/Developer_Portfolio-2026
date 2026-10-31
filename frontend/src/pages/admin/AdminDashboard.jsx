import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  FolderKanban,
  Wrench,
  Briefcase,
  GraduationCap,
  Award,
  Mail,
  ArrowRight,
  Plus,
  RefreshCw,
  Database,
  CheckCircle,
  ExternalLink,
  Loader2,
} from 'lucide-react'
import { adminApi } from '../../services/api'
import { Alert } from '../../components/admin/Alert'

export function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [recentMessages, setRecentMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)
      const [statsData, messagesData] = await Promise.all([
        adminApi.dashboard.getStats(),
        adminApi.messages.getAll().catch(() => []),
      ])
      setStats(statsData)
      setRecentMessages(messagesData.slice(0, 5))
    } catch (err) {
      console.error('Failed to load dashboard:', err)
      setError(err.message || 'Failed to load dashboard metrics from SQLite database.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const statCards = [
    {
      title: 'Projects',
      count: stats?.projects ?? 0,
      icon: FolderKanban,
      color: 'blue',
      link: '/admin/projects',
      desc: 'Active portfolio projects',
    },
    {
      title: 'Skills',
      count: stats?.skills ?? 0,
      icon: Wrench,
      color: 'cyan',
      link: '/admin/skills',
      desc: 'Technologies & tools',
    },
    {
      title: 'Experience',
      count: stats?.experience ?? 0,
      icon: Briefcase,
      color: 'indigo',
      link: '/admin/experience',
      desc: 'Career & internship milestones',
    },
    {
      title: 'Education',
      count: stats?.education ?? 0,
      icon: GraduationCap,
      color: 'violet',
      link: '/admin/education',
      desc: 'Degrees & academics',
    },
    {
      title: 'Certifications',
      count: stats?.certifications ?? 0,
      icon: Award,
      color: 'emerald',
      link: '/admin/certifications',
      desc: 'Credentials & certificates',
    },
    {
      title: 'New Messages',
      count: stats?.new_messages ?? 0,
      icon: Mail,
      color: stats?.new_messages > 0 ? 'rose' : 'slate',
      link: '/admin/messages',
      desc: `${stats?.total_messages ?? 0} total inquiries`,
      highlight: stats?.new_messages > 0,
    },
  ]

  const colorClasses = {
    blue: 'bg-[#007BA7]/12 text-[#007BA7] dark:text-[#38BDF8] border-[#007BA7]/25',
    cyan: 'bg-[#007BA7]/12 text-[#007BA7] dark:text-[#38BDF8] border-[#007BA7]/25',
    indigo: 'bg-[#007BA7]/12 text-[#007BA7] dark:text-[#38BDF8] border-[#007BA7]/25',
    violet: 'bg-[#FF2D95]/12 text-[#D81B78] dark:text-[#FF66B2] border-[#FF2D95]/25',
    emerald: 'bg-emerald-500/12 text-emerald-700 dark:text-emerald-400 border-emerald-500/25',
    rose: 'bg-[#FF2D95]/15 text-[#D81B78] dark:text-[#FF66B2] border-[#FF2D95]/30 ring-1 ring-[#FF2D95]/40',
    slate: 'bg-slate-100 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700/50',
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-100">Overview Dashboard</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time content metrics directly synchronized with Voroa Cloud database.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchDashboardData}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh Data
          </button>
          <Link
            to="/admin/projects"
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-[#007BA7] hover:bg-[#0093C7] rounded-lg transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            Manage Content
          </Link>
        </div>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

      {/* Metrics Cards Grid */}
      {loading && !stats ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-32 bg-slate-900/60 border border-slate-800/80 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {statCards.map((card) => {
            const Icon = card.icon
            return (
              <Link
                key={card.title}
                to={card.link}
                className="group relative p-5 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl transition-all duration-200 hover:shadow-lg flex flex-col justify-between"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                      {card.title}
                    </span>
                    <div className="mt-2 text-3xl font-extrabold text-slate-100 group-hover:text-blue-400 transition-colors">
                      {card.count}
                    </div>
                  </div>
                  <div className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 ${colorClasses[card.color]}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
                  <span className="truncate">{card.desc}</span>
                  <span className="inline-flex items-center gap-1 text-slate-500 group-hover:text-blue-400 font-medium transition-colors">
                    Manage <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      )}

      {/* Database Status & System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-200 border-b border-slate-800 pb-3">
            <Database className="w-4 h-4 text-blue-400" />
            Database & System Info
          </div>
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between py-1.5 border-b border-slate-800/60">
              <span className="text-slate-400">Database Engine</span>
              <span className="font-semibold text-slate-200">SQLite (portfolio.db)</span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-slate-800/60">
              <span className="text-slate-400">API Connection</span>
              <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                Connected
              </span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-slate-800/60">
              <span className="text-slate-400">Authentication</span>
              <span className="font-semibold text-slate-200">JWT (HttpOnly Cookie)</span>
            </div>
            <div className="flex items-center justify-between py-1.5">
              <span className="text-slate-400">Architecture</span>
              <span className="font-semibold text-slate-200">FastAPI + React 19</span>
            </div>
          </div>
          <div className="pt-2">
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700/80 rounded-lg transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Test Public Portfolio View
            </Link>
          </div>
        </div>

        {/* Recent Messages Preview */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
              <Mail className="w-4 h-4 text-rose-400" />
              Latest Inquiries
            </div>
            <Link
              to="/admin/messages"
              className="text-xs text-blue-400 hover:text-blue-300 font-medium inline-flex items-center gap-1"
            >
              View all messages <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="mt-4">
            {recentMessages.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-500">
                No contact messages in the database yet.
              </div>
            ) : (
              <div className="divide-y divide-slate-800/80 overflow-hidden">
                {recentMessages.map((msg) => (
                  <div key={msg.id} className="py-3 flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-200 truncate">{msg.name}</span>
                        <span className="text-[11px] text-slate-500 truncate">&lt;{msg.email}&gt;</span>
                      </div>
                      <p className="text-xs text-slate-400 truncate mt-0.5">{msg.subject || '(No subject)'}</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          msg.status === 'new'
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : msg.status === 'replied'
                            ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                            : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        }`}
                      >
                        {msg.status}
                      </span>
                      <Link
                        to="/admin/messages"
                        className="text-xs text-slate-400 hover:text-slate-200 font-medium"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

import { useState, useEffect } from 'react'
import {
  Mail,
  Trash2,
  CheckCircle,
  Clock,
  Send,
  Eye,
  RefreshCw,
  Search,
  Loader2,
  Calendar,
  User,
  Inbox,
  AlertCircle,
  ExternalLink,
} from 'lucide-react'
import { adminApi } from '../../services/api'
import { Modal } from '../../components/admin/Modal'
import { ConfirmModal } from '../../components/admin/ConfirmModal'
import { Alert } from '../../components/admin/Alert'
import { useAdminTheme } from '../../context/AdminThemeContext'

export function AdminMessages() {
  const { adminTheme } = useAdminTheme()
  const isLight = adminTheme === 'light'

  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [activeFilter, setActiveFilter] = useState('all')
  const [search, setSearch] = useState('')

  // View Details Modal
  const [selectedMessage, setSelectedMessage] = useState(null)

  // Reply Modal State
  const [replyModalOpen, setReplyModalOpen] = useState(false)
  const [replyingMessage, setReplyingMessage] = useState(null)
  const [replySubject, setReplySubject] = useState('')
  const [replyBody, setReplyBody] = useState('')
  const [replySending, setReplySending] = useState(false)
  const [replyError, setReplyError] = useState(null)

  // Delete Confirmation Modal
  const [deleteId, setDeleteId] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [deleteItemName, setDeleteItemName] = useState('')

  const fetchMessages = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await adminApi.messages.getAll()
      setMessages(data || [])
    } catch (err) {
      setError(err.message || 'Failed to fetch contact messages from SQLite database.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMessages()
  }, [])

  const handleUpdateStatus = async (messageId, newStatus) => {
    try {
      await adminApi.messages.updateStatus(messageId, newStatus)
      setMessages((prev) =>
        prev.map((msg) => (msg.id === messageId ? { ...msg, status: newStatus } : msg))
      )
      if (selectedMessage?.id === messageId) {
        setSelectedMessage((prev) => ({ ...prev, status: newStatus }))
      }
      setSuccess(`Message status updated to "${newStatus}".`)
    } catch (err) {
      setError(err.message || 'Failed to update message status.')
    }
  }

  const handleOpenDetails = async (msg) => {
    setSelectedMessage(msg)
    // Automatically mark as read if it is currently 'new'
    if (msg.status === 'new') {
      try {
        await adminApi.messages.updateStatus(msg.id, 'read')
        setMessages((prev) =>
          prev.map((m) => (m.id === msg.id ? { ...m, status: 'read' } : m))
        )
        setSelectedMessage({ ...msg, status: 'read' })
      } catch {
        // non-blocking
      }
    }
  }

  const handleOpenReplyModal = (msg) => {
    setReplyingMessage(msg)
    setReplySubject(
      msg.subject?.toLowerCase().startsWith('re:')
        ? msg.subject
        : `Re: ${msg.subject || 'Portfolio Inquiry'}`
    )
    setReplyBody(
      `Hi ${msg.name},\n\nThank you for reaching out through my portfolio.\n\n\n\nBest regards,\nAyush Patel`
    )
    setReplyError(null)
    setReplyModalOpen(true)
  }

  const handleSendReply = async (e) => {
    e.preventDefault()
    if (!replyingMessage) return

    if (!replySubject.trim()) {
      setReplyError('Subject is required.')
      return
    }
    if (!replyBody.trim()) {
      setReplyError('Reply message cannot be empty.')
      return
    }

    try {
      setReplySending(true)
      setReplyError(null)

      const result = await adminApi.messages.reply(replyingMessage.id, {
        subject: replySubject.trim(),
        message: replyBody.trim(),
      })

      // Update local state to reflect replied status
      setMessages((prev) =>
        prev.map((m) =>
          m.id === replyingMessage.id ? { ...m, status: 'replied' } : m
        )
      )

      if (selectedMessage?.id === replyingMessage.id) {
        setSelectedMessage((prev) => ({ ...prev, status: 'replied' }))
      }

      setReplyModalOpen(false)
      setSuccess(result.message || `Reply successfully sent to ${replyingMessage.email}!`)
    } catch (err) {
      setReplyError(err.message || 'Failed to send reply. Please verify server SMTP configuration.')
    } finally {
      setReplySending(false)
    }
  }

  const handlePromptDelete = (msg) => {
    setDeleteId(msg.id)
    setDeleteItemName(`Inquiry from ${msg.name} (${msg.email})`)
  }

  const handleConfirmDelete = async () => {
    if (!deleteId) return
    try {
      setDeleting(true)
      await adminApi.messages.delete(deleteId)
      setSuccess('Message permanently deleted from SQLite database.')
      setDeleteId(null)
      if (selectedMessage?.id === deleteId) {
        setSelectedMessage(null)
      }
      fetchMessages()
    } catch (err) {
      setError(err.message || 'Failed to delete message.')
    } finally {
      setDeleting(false)
    }
  }

  // Filter and search logic
  const filteredMessages = messages.filter((msg) => {
    if (activeFilter !== 'all' && msg.status !== activeFilter) return false
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return (
      msg.name?.toLowerCase().includes(q) ||
      msg.email?.toLowerCase().includes(q) ||
      msg.subject?.toLowerCase().includes(q) ||
      msg.message?.toLowerCase().includes(q)
    )
  })

  const newCount = messages.filter((m) => m.status === 'new').length
  const readCount = messages.filter((m) => m.status === 'read').length
  const repliedCount = messages.filter((m) => m.status === 'replied').length

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A'
    try {
      return new Date(dateStr).toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return dateStr
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className={`text-xl sm:text-2xl font-bold flex items-center gap-2.5 ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
            <Mail className="w-6 h-6 text-blue-500" />
            Contact Messages
          </h2>
          <p className={`text-xs sm:text-sm mt-1 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            Incoming inquiries submitted through the public contact form
          </p>
        </div>

        <button
          type="button"
          onClick={fetchMessages}
          disabled={loading}
          className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors self-start sm:self-auto cursor-pointer border ${
            isLight
              ? 'text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border-slate-200 shadow-2xs'
              : 'text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border-slate-800'
          }`}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess(null)} />}

      {/* Metrics Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className={`p-4 rounded-xl border ${isLight ? 'bg-white border-slate-200/90 shadow-2xs' : 'bg-slate-900 border-slate-800'}`}>
          <span className={`text-xs font-medium ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Total Received</span>
          <div className={`text-2xl font-bold mt-1 ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>{messages.length}</div>
        </div>
        <div className={`p-4 rounded-xl border ${isLight ? 'bg-white border-slate-200/90 shadow-2xs' : 'bg-slate-900 border-slate-800'}`}>
          <span className={`text-xs font-medium ${isLight ? 'text-rose-600' : 'text-rose-400'}`}>New / Unread</span>
          <div className={`text-2xl font-bold mt-1 ${isLight ? 'text-rose-600' : 'text-rose-400'}`}>{newCount}</div>
        </div>
        <div className={`p-4 rounded-xl border ${isLight ? 'bg-white border-slate-200/90 shadow-2xs' : 'bg-slate-900 border-slate-800'}`}>
          <span className={`text-xs font-medium ${isLight ? 'text-blue-600' : 'text-blue-400'}`}>Read</span>
          <div className={`text-2xl font-bold mt-1 ${isLight ? 'text-blue-600' : 'text-blue-400'}`}>{readCount}</div>
        </div>
        <div className={`p-4 rounded-xl border ${isLight ? 'bg-white border-slate-200/90 shadow-2xs' : 'bg-slate-900 border-slate-800'}`}>
          <span className={`text-xs font-medium ${isLight ? 'text-purple-600' : 'text-purple-400'}`}>Replied</span>
          <div className={`text-2xl font-bold mt-1 ${isLight ? 'text-purple-600' : 'text-purple-400'}`}>{repliedCount}</div>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeFilter === 'all'}
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors shrink-0 cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-[#007BA7] text-white shadow-2xs'
                : isLight
                ? 'text-[#475569] hover:text-[#17212B] bg-white hover:bg-[#F1F5F9] border border-[#D9E2EA] shadow-2xs'
                : 'text-[#8B98A5] hover:text-[#F5F7FA] bg-[#14191D] hover:bg-[#181818] border border-[#26333A]'
            }`}
          >
            All ({messages.length})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeFilter === 'new'}
            onClick={() => setActiveFilter('new')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors shrink-0 cursor-pointer ${
              activeFilter === 'new'
                ? isLight ? 'bg-[#D81B78] text-white shadow-2xs' : 'bg-[#FF2D95] text-white shadow-2xs'
                : isLight
                ? 'text-[#475569] hover:text-[#17212B] bg-white hover:bg-[#F1F5F9] border border-[#D9E2EA] shadow-2xs'
                : 'text-[#8B98A5] hover:text-[#F5F7FA] bg-[#14191D] hover:bg-[#181818] border border-[#26333A]'
            }`}
          >
            New ({newCount})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeFilter === 'read'}
            onClick={() => setActiveFilter('read')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors shrink-0 cursor-pointer ${
              activeFilter === 'read'
                ? 'bg-[#007BA7] text-white shadow-2xs'
                : isLight
                ? 'text-[#475569] hover:text-[#17212B] bg-white hover:bg-[#F1F5F9] border border-[#D9E2EA] shadow-2xs'
                : 'text-[#8B98A5] hover:text-[#F5F7FA] bg-[#14191D] hover:bg-[#181818] border border-[#26333A]'
            }`}
          >
            Read ({readCount})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeFilter === 'replied'}
            onClick={() => setActiveFilter('replied')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors shrink-0 cursor-pointer ${
              activeFilter === 'replied'
                ? 'bg-purple-600 text-white shadow-2xs'
                : isLight
                ? 'text-[#475569] hover:text-[#17212B] bg-white hover:bg-[#F1F5F9] border border-[#D9E2EA] shadow-2xs'
                : 'text-[#8B98A5] hover:text-[#F5F7FA] bg-[#14191D] hover:bg-[#181818] border border-[#26333A]'
            }`}
          >
            Replied ({repliedCount})
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${isLight ? 'text-[#64748B]' : 'text-[#8B98A5]'}`} />
          <input
            type="text"
            placeholder="Search messages..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full pl-9 pr-3 py-1.5 rounded-lg text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-[#007BA7] border ${
              isLight
                ? 'bg-white border-[#D9E2EA] text-[#17212B] placeholder-[#94A3B8] shadow-2xs'
                : 'bg-[#12181C] border-[#26333A] text-[#F5F7FA] placeholder-[#8B98A5]'
            }`}
          />
        </div>
      </div>

      {/* Messages List / Table */}
      <div className={`rounded-xl overflow-hidden border ${isLight ? 'bg-white border-[#D9E2EA] shadow-xs' : 'bg-[#14191D] border-[#26333A]'}`}>
        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#007BA7]" />
            <p className="text-xs">Loading contact messages from SQLite database...</p>
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="p-12 text-center">
            <Inbox className={`w-10 h-10 mx-auto mb-3 ${isLight ? 'text-[#94A3B8]' : 'text-[#8B98A5]'}`} />
            <h3 className={`text-sm font-semibold ${isLight ? 'text-[#17212B]' : 'text-[#F5F7FA]'}`}>No messages found</h3>
            <p className={`text-xs mt-1 max-w-sm mx-auto ${isLight ? 'text-[#64748B]' : 'text-[#8B98A5]'}`}>
              {search
                ? 'No inquiries match your search filter.'
                : 'Inquiries submitted on your public portfolio will appear here.'}
            </p>
          </div>
        ) : (
          <div className={`divide-y ${isLight ? 'divide-[#D9E2EA]' : 'divide-[#26333A]'}`}>
            {filteredMessages.map((msg) => (
              <div
                key={msg.id}
                className={`p-4 sm:p-5 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer ${
                  msg.status === 'new'
                    ? isLight
                      ? 'bg-[#FFF5F8] hover:bg-[#FFEBF1] border-l-4 border-l-[#D81B78]'
                      : 'bg-[#181818] hover:bg-[#202020] border-l-4 border-l-[#FF2D95]'
                    : isLight
                    ? 'hover:bg-[#F8FAFC] border-l-4 border-l-transparent'
                    : 'hover:bg-[#181818]/60 border-l-4 border-l-transparent'
                }`}
                onClick={() => handleOpenDetails(msg)}
              >
                <div className="space-y-1.5 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`font-bold text-sm ${isLight ? 'text-[#17212B]' : 'text-[#F5F7FA]'}`}>{msg.name}</span>
                    <span className={`text-xs ${isLight ? 'text-[#475569]' : 'text-[#8B98A5]'}`}>&lt;{msg.email}&gt;</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        msg.status === 'new'
                          ? isLight
                            ? 'bg-[#FCE7F3] text-[#AD1457] border border-[#FBCFE8]'
                            : 'bg-[#FF2D95]/20 text-[#FF66B2] border border-[#FF2D95]/40'
                          : msg.status === 'replied'
                          ? isLight
                            ? 'bg-purple-100 text-purple-700 border border-purple-200'
                            : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          : isLight
                          ? 'bg-sky-100 text-[#007BA7] border border-sky-200'
                          : 'bg-[#007BA7]/20 text-[#38BDF8] border border-[#007BA7]/40'
                      }`}
                    >
                      {msg.status}
                    </span>
                  </div>

                  <div className={`text-xs font-semibold truncate ${isLight ? 'text-[#17212B]' : 'text-[#F5F7FA]'}`}>
                    {msg.subject || '(No Subject)'}
                  </div>

                  <p className={`text-xs line-clamp-1 max-w-3xl ${isLight ? 'text-[#475569]' : 'text-[#B8C2CC]'}`}>
                    {msg.message}
                  </p>

                  <div className={`flex items-center gap-2 text-[11px] pt-0.5 ${isLight ? 'text-[#64748B]' : 'text-[#8B98A5]'}`}>
                    <Clock className="w-3 h-3" />
                    <span>{formatDate(msg.created_at)}</span>
                  </div>
                </div>

                {/* Actions (stop propagation to avoid reopening details) */}
                <div
                  className="flex items-center gap-2 shrink-0 self-start sm:self-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={() => handleOpenReplyModal(msg)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer border ${
                      isLight
                        ? 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border-emerald-300 shadow-2xs'
                        : 'text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/30'
                    }`}
                    title="Send Real Email Reply"
                    aria-label={`Reply to ${msg.name}`}
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Reply</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenDetails(msg)}
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                      isLight
                        ? 'text-slate-500 hover:text-blue-600 hover:bg-slate-100'
                        : 'text-slate-400 hover:text-blue-400 hover:bg-slate-800'
                    }`}
                    title="View Message Details"
                    aria-label={`View message from ${msg.name}`}
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handlePromptDelete(msg)}
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                      isLight
                        ? 'text-slate-500 hover:text-rose-600 hover:bg-rose-50'
                        : 'text-slate-400 hover:text-rose-400 hover:bg-slate-800'
                    }`}
                    title="Delete Message"
                    aria-label={`Delete message from ${msg.name}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Message Details Modal */}
      <Modal
        isOpen={Boolean(selectedMessage)}
        onClose={() => setSelectedMessage(null)}
        title="Inquiry Details"
        maxWidth="max-w-xl"
      >
        {selectedMessage && (
          <div className="space-y-5">
            {/* Sender Meta */}
            <div className={`p-4 rounded-xl border space-y-2 ${
              isLight
                ? 'bg-slate-50/80 border-slate-200'
                : 'bg-slate-950/80 border-slate-800'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-500" />
                  <span className={`font-bold text-sm ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>{selectedMessage.name}</span>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    selectedMessage.status === 'new'
                      ? isLight
                        ? 'bg-rose-100 text-rose-700 border border-rose-200'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : selectedMessage.status === 'replied'
                      ? isLight
                        ? 'bg-purple-100 text-purple-700 border border-purple-200'
                        : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                      : isLight
                      ? 'bg-sky-100 text-sky-700 border border-sky-200'
                      : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                  }`}
                >
                  {selectedMessage.status}
                </span>
              </div>

              <div className={`text-xs flex items-center gap-1.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                <Mail className={`w-3.5 h-3.5 ${isLight ? 'text-slate-400' : 'text-slate-500'}`} />
                <a
                  href={`mailto:${selectedMessage.email}`}
                  className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                  {selectedMessage.email}
                </a>
              </div>

              {selectedMessage.subject && (
                <div className={`text-xs pt-1 font-semibold ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
                  Subject: {selectedMessage.subject}
                </div>
              )}

              <div className={`flex items-center gap-1.5 text-[11px] pt-1 border-t ${
                isLight ? 'border-slate-200 text-slate-400' : 'border-slate-800/80 text-slate-500'
              }`}>
                <Calendar className="w-3.5 h-3.5" />
                <span>{formatDate(selectedMessage.created_at)}</span>
              </div>
            </div>

            {/* Message Body */}
            <div>
              <label className={`block text-xs font-semibold uppercase tracking-wider mb-2 ${
                isLight ? 'text-slate-600' : 'text-slate-400'
              }`}>
                Message Content
              </label>
              <div className={`p-4 rounded-xl border text-sm leading-relaxed whitespace-pre-wrap ${
                isLight
                  ? 'bg-white border-slate-200 text-slate-800'
                  : 'bg-slate-950 border-slate-800 text-slate-200'
              }`}>
                {selectedMessage.message}
              </div>
            </div>

            {/* Status Change & Reply Actions */}
            <div className={`pt-4 border-t flex flex-wrap items-center justify-between gap-3 ${
              isLight ? 'border-slate-200' : 'border-slate-800'
            }`}>
              <div className="flex items-center gap-2">
                <span className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Mark Status:</span>
                <button
                  type="button"
                  onClick={() => handleUpdateStatus(selectedMessage.id, 'read')}
                  disabled={selectedMessage.status === 'read'}
                  className={`px-2.5 py-1 text-xs rounded-lg border transition-colors cursor-pointer ${
                    selectedMessage.status === 'read'
                      ? 'bg-[#007BA7] text-white border-[#007BA7]'
                      : isLight
                      ? 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                      : 'bg-[#181818] text-slate-300 border-[#26333A] hover:bg-[#14191D]'
                  }`}
                >
                  Read
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdateStatus(selectedMessage.id, 'replied')}
                  disabled={selectedMessage.status === 'replied'}
                  className={`px-2.5 py-1 text-xs rounded-lg border transition-colors cursor-pointer ${
                    selectedMessage.status === 'replied'
                      ? 'bg-purple-600 text-white border-purple-500'
                      : isLight
                      ? 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  Replied
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    handleOpenReplyModal(selectedMessage)
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors shadow-sm cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  Reply via Email
                </button>
                <button
                  type="button"
                  onClick={() => handlePromptDelete(selectedMessage)}
                  className={`p-2 rounded-lg transition-colors cursor-pointer border ${
                    isLight
                      ? 'text-rose-600 hover:bg-rose-50 border-rose-200'
                      : 'text-rose-400 hover:bg-rose-500/20 border-rose-500/30'
                  }`}
                  title="Delete message"
                  aria-label="Delete message"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Reply Modal */}
      <Modal
        isOpen={replyModalOpen}
        onClose={() => !replySending && setReplyModalOpen(false)}
        title="Send Email Reply"
        maxWidth="max-w-xl"
      >
        {replyingMessage && (
          <form onSubmit={handleSendReply} className="space-y-4">
            {replyError && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-500 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold">Failed to send reply</p>
                  <p className="mt-0.5">{replyError}</p>
                </div>
              </div>
            )}

            <div>
              <label className={`block text-xs font-semibold uppercase tracking-wider mb-1 ${
                isLight ? 'text-slate-600' : 'text-slate-400'
              }`}>
                Recipient Email
              </label>
              <div className={`px-3 py-2 rounded-lg text-sm border flex items-center justify-between ${
                isLight
                  ? 'bg-slate-50 border-slate-200 text-slate-800'
                  : 'bg-slate-950/80 border-slate-800 text-slate-200'
              }`}>
                <span className="font-medium">{replyingMessage.name} &lt;{replyingMessage.email}&gt;</span>
                <span className={`text-[10px] font-mono ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>SMTP Destination</span>
              </div>
            </div>

            <div>
              <label className={`block text-xs font-semibold uppercase tracking-wider mb-1 ${
                isLight ? 'text-slate-600' : 'text-slate-400'
              }`}>
                Subject *
              </label>
              <input
                type="text"
                required
                value={replySubject}
                onChange={(e) => setReplySubject(e.target.value)}
                placeholder="Email Subject"
                className={`w-full px-3 py-2 rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 border ${
                  isLight
                    ? 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
                    : 'bg-slate-950 border-slate-700 text-slate-100 placeholder-slate-500'
                }`}
              />
            </div>

            <div>
              <label className={`block text-xs font-semibold uppercase tracking-wider mb-1 ${
                isLight ? 'text-slate-600' : 'text-slate-400'
              }`}>
                Your Reply Message *
              </label>
              <textarea
                required
                rows={7}
                value={replyBody}
                onChange={(e) => setReplyBody(e.target.value)}
                placeholder="Compose your reply message here..."
                className={`w-full px-3 py-2 rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-sans border ${
                  isLight
                    ? 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
                    : 'bg-slate-950 border-slate-700 text-slate-100 placeholder-slate-500'
                }`}
              />
            </div>

            <div className={`pt-3 border-t flex items-center justify-between gap-3 ${
              isLight ? 'border-slate-200' : 'border-slate-800'
            }`}>
              <a
                href={`mailto:${encodeURIComponent(replyingMessage.email)}?subject=${encodeURIComponent(replySubject)}&body=${encodeURIComponent(replyBody)}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-1.5 text-xs transition-colors ${
                  isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Open system default mail client"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open in Mail App</span>
              </a>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={replySending}
                  onClick={() => setReplyModalOpen(false)}
                  className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    isLight
                      ? 'text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200'
                      : 'text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={replySending}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  {replySending ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Sending Email...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Dispatch Reply</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Message"
        message="Are you sure you want to delete this message? It will be permanently removed from SQLite database."
        itemName={deleteItemName}
        loading={deleting}
      />
    </div>
  )
}

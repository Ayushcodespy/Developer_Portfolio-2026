import { useState, useEffect } from 'react'
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  RefreshCw,
  Loader2,
  Briefcase,
  Calendar,
} from 'lucide-react'
import { adminApi } from '../../services/api'
import { Modal } from '../../components/admin/Modal'
import { ConfirmModal } from '../../components/admin/ConfirmModal'
import { Alert } from '../../components/admin/Alert'

const emptyForm = {
  company: '',
  role: '',
  start_date: '',
  end_date: '',
  duration: '',
  description: '',
  responsibilities: '',
  technologies: '',
  display_order: 0,
}

export function AdminExperience() {
  const [experienceList, setExperienceList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [search, setSearch] = useState('')

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState(null)

  // Delete modal states
  const [deleteId, setDeleteId] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [deleteItemTitle, setDeleteItemTitle] = useState('')

  const fetchExperience = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await adminApi.experience.getAll()
      setExperienceList(data || [])
    } catch (err) {
      setError(err.message || 'Failed to fetch experience from SQLite database.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchExperience()
  }, [])

  const handleOpenAdd = () => {
    setEditingId(null)
    setFormData({
      ...emptyForm,
      display_order: experienceList.length,
    })
    setFormError(null)
    setIsFormOpen(true)
  }

  const handleOpenEdit = (item) => {
    setEditingId(item.id)

    let techStr = ''
    try {
      if (item.technologies) {
        const parsed = JSON.parse(item.technologies)
        techStr = Array.isArray(parsed) ? parsed.join(', ') : item.technologies
      }
    } catch {
      techStr = item.technologies || ''
    }

    let respStr = ''
    try {
      if (item.responsibilities) {
        const parsed = JSON.parse(item.responsibilities)
        respStr = Array.isArray(parsed) ? parsed.join('\n') : item.responsibilities
      }
    } catch {
      respStr = item.responsibilities || ''
    }

    setFormData({
      company: item.company || '',
      role: item.role || '',
      start_date: item.start_date || '',
      end_date: item.end_date || '',
      duration: item.duration || '',
      description: item.description || '',
      responsibilities: respStr,
      technologies: techStr,
      display_order: item.display_order ?? 0,
    })
    setFormError(null)
    setIsFormOpen(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setFormError(null)

    if (!formData.company.trim() || !formData.role.trim()) {
      setFormError('Company and Role are required.')
      return
    }

    try {
      setSaving(true)
      const payload = {
        company: formData.company.trim(),
        role: formData.role.trim(),
        start_date: formData.start_date.trim() || null,
        end_date: formData.end_date.trim() || null,
        duration: formData.duration.trim() || null,
        description: formData.description.trim() || null,
        responsibilities: formData.responsibilities.trim() || null,
        technologies: formData.technologies.trim() || null,
        display_order: parseInt(formData.display_order, 10) || 0,
      }

      if (editingId) {
        await adminApi.experience.update(editingId, payload)
        setSuccess(`Experience at "${formData.company}" updated successfully in SQLite.`)
      } else {
        await adminApi.experience.create(payload)
        setSuccess(`Experience at "${formData.company}" created successfully in SQLite.`)
      }

      setIsFormOpen(false)
      fetchExperience()
    } catch (err) {
      setFormError(err.message || 'Failed to save experience.')
    } finally {
      setSaving(false)
    }
  }

  const handlePromptDelete = (item) => {
    setDeleteId(item.id)
    setDeleteItemTitle(`${item.role} at ${item.company}`)
  }

  const handleConfirmDelete = async () => {
    if (!deleteId) return
    try {
      setDeleting(true)
      await adminApi.experience.delete(deleteId)
      setSuccess(`Experience "${deleteItemTitle}" deleted from SQLite database.`)
      setDeleteId(null)
      fetchExperience()
    } catch (err) {
      setError(err.message || 'Failed to delete experience.')
    } finally {
      setDeleting(false)
    }
  }

  const filtered = experienceList.filter((exp) => {
    const q = search.toLowerCase()
    return (
      exp.company?.toLowerCase().includes(q) ||
      exp.role?.toLowerCase().includes(q) ||
      exp.description?.toLowerCase().includes(q)
    )
  })

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-100">Experience Management</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Maintain your professional history, roles, key contributions, and tech stacks.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchExperience}
            disabled={loading}
            className="p-2 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 transition-colors"
            title="Refresh"
            aria-label="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#007BA7] hover:bg-[#00688f] rounded-lg transition-colors shadow-sm shadow-[#007BA7]/20"
          >
            <Plus className="w-4 h-4" />
            Add Experience
          </button>
        </div>
      </div>

      {success && <Alert type="success" message={success} onClose={() => setSuccess(null)} />}
      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          placeholder="Search by company or role..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Experience List / Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-500" />
            <p className="text-xs">Loading experience records from SQLite database...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <Briefcase className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-slate-300">No experience records found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {search ? 'No records match your search.' : 'Click "Add Experience" to add a work milestone.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/80">
            {filtered.map((item) => (
              <div key={item.id} className="p-5 hover:bg-slate-800/30 transition-colors flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-2 max-w-3xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs text-slate-500">#{item.display_order}</span>
                    <h3 className="text-base font-bold text-slate-100">{item.role}</h3>
                    <span className="text-sm font-semibold text-blue-400">@ {item.company}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      {item.start_date || 'N/A'} – {item.end_date || 'Present'}
                    </span>
                    {item.duration && (
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px]">
                        {item.duration}
                      </span>
                    )}
                  </div>

                  {item.description && (
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-1">
                      {item.description}
                    </p>
                  )}

                  {item.technologies && (
                    <div className="pt-1 flex flex-wrap gap-1.5">
                      {(() => {
                        try {
                          const parsed = JSON.parse(item.technologies)
                          return Array.isArray(parsed)
                            ? parsed.map((t, idx) => (
                                <span key={idx} className="text-[11px] px-2 py-0.5 rounded bg-slate-800/80 text-cyan-300 border border-slate-700/50">
                                  {t}
                                </span>
                              ))
                            : null
                        } catch {
                          return null
                        }
                      })()}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 sm:self-start shrink-0">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(item)}
                    className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded-lg transition-colors"
                    title="Edit Experience"
                    aria-label={`Edit ${item.role}`}
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePromptDelete(item)}
                    className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                    title="Delete Experience"
                    aria-label={`Delete ${item.role}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Experience Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingId ? 'Edit Experience' : 'Add Experience'}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSave} className="space-y-4">
          {formError && <Alert type="error" message={formError} onClose={() => setFormError(null)} />}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Company *
              </label>
              <input
                type="text"
                required
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="e.g. MPOnline Limited"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Role / Title *
              </label>
              <input
                type="text"
                required
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                placeholder="e.g. Python Developer Intern"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Start Date
              </label>
              <input
                type="text"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                placeholder="e.g. Jan 2024"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                End Date
              </label>
              <input
                type="text"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                placeholder="e.g. Jun 2024 or Present"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Duration
              </label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="e.g. 6 mos"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Display Order
              </label>
              <input
                type="number"
                min="0"
                value={formData.display_order}
                onChange={(e) => setFormData({ ...formData, display_order: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Summary Description / Highlight
              </label>
              <textarea
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Key achievement or overview of work..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Technologies (comma-separated)
              </label>
              <input
                type="text"
                value={formData.technologies}
                onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                placeholder="Python, FastAPI, ReactJS, PostgreSQL, RAG"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Responsibilities (one per line)
              </label>
              <textarea
                rows={4}
                value={formData.responsibilities}
                onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
                placeholder="Developed AI-powered FAQ chatbot using FastAPI and PostgreSQL&#10;Built scalable REST APIs and backend modules"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800 mt-6">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              disabled={saving}
              className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-[#007BA7] hover:bg-[#00688f] rounded-lg transition-colors shadow-sm shadow-[#007BA7]/20 disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
              {saving ? 'Saving...' : editingId ? 'Update Experience' : 'Create Experience'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Experience"
        message="Are you sure you want to delete this experience record? It will be removed from SQLite database."
        itemName={deleteItemTitle}
        loading={deleting}
      />
    </div>
  )
}

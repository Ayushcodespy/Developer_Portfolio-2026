import { useState, useEffect } from 'react'
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  RefreshCw,
  Loader2,
  GraduationCap,
  Calendar,
  MapPin,
} from 'lucide-react'
import { adminApi } from '../../services/api'
import { Modal } from '../../components/admin/Modal'
import { ConfirmModal } from '../../components/admin/ConfirmModal'
import { Alert } from '../../components/admin/Alert'

const emptyForm = {
  institution: '',
  degree: '',
  field: '',
  location: '',
  start_year: '',
  end_year: '',
  cgpa: '',
  percentage: '',
  description: '',
  display_order: 0,
}

export function AdminEducation() {
  const [educationList, setEducationList] = useState([])
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

  const fetchEducation = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await adminApi.education.getAll()
      setEducationList(data || [])
    } catch (err) {
      setError(err.message || 'Failed to fetch education from SQLite database.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEducation()
  }, [])

  const handleOpenAdd = () => {
    setEditingId(null)
    setFormData({
      ...emptyForm,
      display_order: educationList.length,
    })
    setFormError(null)
    setIsFormOpen(true)
  }

  const handleOpenEdit = (item) => {
    setEditingId(item.id)
    setFormData({
      institution: item.institution || '',
      degree: item.degree || '',
      field: item.field || '',
      location: item.location || '',
      start_year: item.start_year || '',
      end_year: item.end_year || '',
      cgpa: item.cgpa || '',
      percentage: item.percentage || '',
      description: item.description || '',
      display_order: item.display_order ?? 0,
    })
    setFormError(null)
    setIsFormOpen(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setFormError(null)

    if (!formData.institution.trim() || !formData.degree.trim()) {
      setFormError('Institution and Degree are required.')
      return
    }

    try {
      setSaving(true)
      const payload = {
        institution: formData.institution.trim(),
        degree: formData.degree.trim(),
        field: formData.field.trim() || null,
        location: formData.location.trim() || null,
        start_year: formData.start_year.trim() || null,
        end_year: formData.end_year.trim() || null,
        cgpa: formData.cgpa.trim() || null,
        percentage: formData.percentage.trim() || null,
        description: formData.description.trim() || null,
        display_order: parseInt(formData.display_order, 10) || 0,
      }

      if (editingId) {
        await adminApi.education.update(editingId, payload)
        setSuccess(`Education at "${formData.institution}" updated successfully in SQLite.`)
      } else {
        await adminApi.education.create(payload)
        setSuccess(`Education at "${formData.institution}" created successfully in SQLite.`)
      }

      setIsFormOpen(false)
      fetchEducation()
    } catch (err) {
      setFormError(err.message || 'Failed to save education record.')
    } finally {
      setSaving(false)
    }
  }

  const handlePromptDelete = (item) => {
    setDeleteId(item.id)
    setDeleteItemTitle(`${item.degree} - ${item.institution}`)
  }

  const handleConfirmDelete = async () => {
    if (!deleteId) return
    try {
      setDeleting(true)
      await adminApi.education.delete(deleteId)
      setSuccess(`Education "${deleteItemTitle}" deleted from SQLite database.`)
      setDeleteId(null)
      fetchEducation()
    } catch (err) {
      setError(err.message || 'Failed to delete education record.')
    } finally {
      setDeleting(false)
    }
  }

  const filtered = educationList.filter((edu) => {
    const q = search.toLowerCase()
    return (
      edu.institution?.toLowerCase().includes(q) ||
      edu.degree?.toLowerCase().includes(q) ||
      edu.field?.toLowerCase().includes(q)
    )
  })

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-100">Education Management</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Maintain your academic credentials, universities, degrees, and scores.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchEducation}
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
            Add Education
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
          placeholder="Search by degree or institution..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Education List Cards */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-500" />
            <p className="text-xs">Loading education records from SQLite database...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <GraduationCap className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-slate-300">No education records found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {search ? 'No records match your search.' : 'Click "Add Education" to add your degree.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/80">
            {filtered.map((item) => (
              <div key={item.id} className="p-5 hover:bg-slate-800/30 transition-colors flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-2 max-w-3xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs text-slate-500">#{item.display_order}</span>
                    <h3 className="text-base font-bold text-slate-100">{item.degree}</h3>
                    {item.field && <span className="text-sm font-medium text-blue-400">in {item.field}</span>}
                  </div>

                  <div className="text-sm font-medium text-slate-200">
                    {item.institution}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      {item.start_year || 'N/A'} – {item.end_year || 'N/A'}
                    </span>
                    {item.location && (
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                        {item.location}
                      </span>
                    )}
                    {item.cgpa && (
                      <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20 text-[11px] font-semibold">
                        CGPA: {item.cgpa}
                      </span>
                    )}
                    {item.percentage && (
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[11px] font-semibold">
                        {item.percentage}
                      </span>
                    )}
                  </div>

                  {item.description && (
                    <p className="text-xs text-slate-400 leading-relaxed pt-1">
                      <span className="font-semibold text-slate-300">Focus Areas: </span>
                      {item.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 sm:self-start shrink-0">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(item)}
                    className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded-lg transition-colors"
                    title="Edit Education"
                    aria-label={`Edit ${item.degree}`}
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePromptDelete(item)}
                    className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                    title="Delete Education"
                    aria-label={`Delete ${item.degree}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Education Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingId ? 'Edit Education' : 'Add Education'}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSave} className="space-y-4">
          {formError && <Alert type="error" message={formError} onClose={() => setFormError(null)} />}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Institution / University *
              </label>
              <input
                type="text"
                required
                value={formData.institution}
                onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                placeholder="e.g. AKS University"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Degree *
              </label>
              <input
                type="text"
                required
                value={formData.degree}
                onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                placeholder="e.g. B.Tech"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Field of Study
              </label>
              <input
                type="text"
                value={formData.field}
                onChange={(e) => setFormData({ ...formData, field: e.target.value })}
                placeholder="e.g. Computer Science & Engineering"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Satna, MP"
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

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Start Year
              </label>
              <input
                type="text"
                value={formData.start_year}
                onChange={(e) => setFormData({ ...formData, start_year: e.target.value })}
                placeholder="e.g. 2020"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                End Year
              </label>
              <input
                type="text"
                value={formData.end_year}
                onChange={(e) => setFormData({ ...formData, end_year: e.target.value })}
                placeholder="e.g. 2024"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                CGPA
              </label>
              <input
                type="text"
                value={formData.cgpa}
                onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })}
                placeholder="e.g. 8.3"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Percentage
              </label>
              <input
                type="text"
                value={formData.percentage}
                onChange={(e) => setFormData({ ...formData, percentage: e.target.value })}
                placeholder="e.g. 80%"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Focus Areas / Subjects (comma-separated)
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Computer Science, Software Development, Algorithms, Database Systems"
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
              {saving ? 'Saving...' : editingId ? 'Update Education' : 'Create Education'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Education Record"
        message="Are you sure you want to delete this education entry? It will be removed from SQLite database."
        itemName={deleteItemTitle}
        loading={deleting}
      />
    </div>
  )
}

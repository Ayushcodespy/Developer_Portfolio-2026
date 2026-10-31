import { useState, useEffect } from 'react'
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  RefreshCw,
  Loader2,
  Award,
  ExternalLink,
} from 'lucide-react'
import { adminApi } from '../../services/api'
import { Modal } from '../../components/admin/Modal'
import { ConfirmModal } from '../../components/admin/ConfirmModal'
import { Alert } from '../../components/admin/Alert'

const emptyForm = {
  name: '',
  provider: '',
  type: 'Course',
  score: '',
  credential_url: '',
  image_url: '',
  display_order: 0,
}

export function AdminCertifications() {
  const [certifications, setCertifications] = useState([])
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

  const fetchCertifications = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await adminApi.certifications.getAll()
      setCertifications(data || [])
    } catch (err) {
      setError(err.message || 'Failed to fetch certifications from SQLite database.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCertifications()
  }, [])

  const handleOpenAdd = () => {
    setEditingId(null)
    setFormData({
      ...emptyForm,
      display_order: certifications.length,
    })
    setFormError(null)
    setIsFormOpen(true)
  }

  const handleOpenEdit = (item) => {
    setEditingId(item.id)
    setFormData({
      name: item.name || '',
      provider: item.provider || '',
      type: item.type || 'Course',
      score: item.score || '',
      credential_url: item.credential_url || '',
      image_url: item.image_url || '',
      display_order: item.display_order ?? 0,
    })
    setFormError(null)
    setIsFormOpen(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setFormError(null)

    if (!formData.name.trim() || !formData.provider.trim()) {
      setFormError('Certification title/name and issuer/provider are required.')
      return
    }

    try {
      setSaving(true)
      const payload = {
        name: formData.name.trim(),
        provider: formData.provider.trim(),
        type: formData.type.trim() || null,
        score: formData.score.trim() || null,
        credential_url: formData.credential_url.trim() || null,
        image_url: formData.image_url.trim() || null,
        display_order: parseInt(formData.display_order, 10) || 0,
      }

      if (editingId) {
        await adminApi.certifications.update(editingId, payload)
        setSuccess(`Certification "${formData.name}" updated successfully in SQLite.`)
      } else {
        await adminApi.certifications.create(payload)
        setSuccess(`Certification "${formData.name}" created successfully in SQLite.`)
      }

      setIsFormOpen(false)
      fetchCertifications()
    } catch (err) {
      setFormError(err.message || 'Failed to save certification.')
    } finally {
      setSaving(false)
    }
  }

  const handlePromptDelete = (item) => {
    setDeleteId(item.id)
    setDeleteItemTitle(`${item.name} (${item.provider})`)
  }

  const handleConfirmDelete = async () => {
    if (!deleteId) return
    try {
      setDeleting(true)
      await adminApi.certifications.delete(deleteId)
      setSuccess(`Certification "${deleteItemTitle}" deleted from SQLite database.`)
      setDeleteId(null)
      fetchCertifications()
    } catch (err) {
      setError(err.message || 'Failed to delete certification.')
    } finally {
      setDeleting(false)
    }
  }

  const filtered = certifications.filter((cert) => {
    const q = search.toLowerCase()
    return (
      cert.name?.toLowerCase().includes(q) ||
      cert.provider?.toLowerCase().includes(q) ||
      cert.type?.toLowerCase().includes(q)
    )
  })

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-100">Certifications Management</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage your verified licenses, technical courses, and credential links.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchCertifications}
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
            Add Certification
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
          placeholder="Search certifications..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Certifications Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-500" />
            <p className="text-xs">Loading certifications from SQLite database...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <Award className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-slate-300">No certifications found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {search ? 'No certifications match your search.' : 'Click "Add Certification" to record an achievement.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-950/80 text-slate-400 uppercase text-[11px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4 font-semibold w-16">Order</th>
                  <th className="py-3 px-4 font-semibold">Title / Name</th>
                  <th className="py-3 px-4 font-semibold">Issuer / Provider</th>
                  <th className="py-3 px-4 font-semibold">Type</th>
                  <th className="py-3 px-4 font-semibold">Score</th>
                  <th className="py-3 px-4 font-semibold">Credential</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-300">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-slate-500 text-xs">
                      #{item.display_order}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-100">
                      {item.name}
                    </td>
                    <td className="py-3.5 px-4 text-blue-400 font-medium">
                      {item.provider}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                        {item.type || 'Certificate'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {item.score || '—'}
                    </td>
                    <td className="py-3.5 px-4">
                      {item.credential_url ? (
                        <a
                          href={item.credential_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300"
                        >
                          Verify <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-slate-600">—</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(item)}
                          className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded-lg transition-colors"
                          title="Edit Certification"
                          aria-label={`Edit ${item.name}`}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handlePromptDelete(item)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                          title="Delete Certification"
                          aria-label={`Delete ${item.name}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Certification Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingId ? 'Edit Certification' : 'Add Certification'}
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSave} className="space-y-4">
          {formError && <Alert type="error" message={formError} onClose={() => setFormError(null)} />}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Certificate Title / Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Data Science Course"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Issuer / Provider *
              </label>
              <input
                type="text"
                required
                value={formData.provider}
                onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                placeholder="e.g. CodeWithHarry, Coursera"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Type / Category
              </label>
              <input
                type="text"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                placeholder="e.g. Course, Specialization"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Score / Grade
              </label>
              <input
                type="text"
                value={formData.score}
                onChange={(e) => setFormData({ ...formData, score: e.target.value })}
                placeholder="e.g. Grade A or 95%"
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
                Credential URL
              </label>
              <input
                type="url"
                value={formData.credential_url}
                onChange={(e) => setFormData({ ...formData, credential_url: e.target.value })}
                placeholder="https://..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Badge / Image URL (Text Link)
              </label>
              <input
                type="text"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="https://example.com/badge.webp"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Direct image link. No binary files stored in SQLite.
              </p>
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
              {saving ? 'Saving...' : editingId ? 'Update Certification' : 'Create Certification'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Certification"
        message="Are you sure you want to delete this certification? It will be permanently removed from SQLite database."
        itemName={deleteItemTitle}
        loading={deleting}
      />
    </div>
  )
}

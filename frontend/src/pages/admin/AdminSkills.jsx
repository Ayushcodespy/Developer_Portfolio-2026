import { useState, useEffect } from 'react'
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  RefreshCw,
  Loader2,
  Wrench,
} from 'lucide-react'
import { adminApi } from '../../services/api'
import { Modal } from '../../components/admin/Modal'
import { ConfirmModal } from '../../components/admin/ConfirmModal'
import { Alert } from '../../components/admin/Alert'

const CATEGORIES = [
  { id: 'Development', label: 'Development' },
  { id: 'Data Analysis', label: 'Data Analysis' },
  { id: 'Both', label: 'Both' },
]

const emptyForm = {
  name: '',
  category: 'Development',
  display_order: 0,
}

export function AdminSkills() {
  const [skills, setSkills] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [activeTab, setActiveTab] = useState('all')
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

  const fetchSkills = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await adminApi.skills.getAll()
      setSkills(data || [])
    } catch (err) {
      setError(err.message || 'Failed to fetch skills from SQLite database.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSkills()
  }, [])

  const handleOpenAdd = () => {
    setEditingId(null)
    setFormData({
      ...emptyForm,
      category: activeTab === 'all' ? 'Development' : activeTab,
      display_order: skills.length,
    })
    setFormError(null)
    setIsFormOpen(true)
  }

  const handleOpenEdit = (skill) => {
    setEditingId(skill.id)
    setFormData({
      name: skill.name || '',
      category: ['Development', 'Data Analysis', 'Both'].includes(skill.category)
        ? skill.category
        : 'Development',
      display_order: skill.display_order ?? 0,
    })
    setFormError(null)
    setIsFormOpen(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setFormError(null)

    if (!formData.name.trim()) {
      setFormError('Skill name is required.')
      return
    }

    if (!formData.category || !['Development', 'Data Analysis', 'Both'].includes(formData.category)) {
      setFormError('Skill Category is required. Choose Development, Data Analysis, or Both.')
      return
    }

    try {
      setSaving(true)
      const payload = {
        name: formData.name.trim(),
        category: formData.category,
        display_order: parseInt(formData.display_order, 10) || 0,
      }

      if (editingId) {
        await adminApi.skills.update(editingId, payload)
        setSuccess(`Skill "${formData.name}" updated successfully in database.`)
      } else {
        await adminApi.skills.create(payload)
        setSuccess(`Skill "${formData.name}" created successfully in database.`)
      }

      setIsFormOpen(false)
      fetchSkills()
    } catch (err) {
      setFormError(err.message || 'Failed to save skill.')
    } finally {
      setSaving(false)
    }
  }

  const handlePromptDelete = (skill) => {
    setDeleteId(skill.id)
    setDeleteItemTitle(skill.name)
  }

  const handleConfirmDelete = async () => {
    if (!deleteId) return
    try {
      setDeleting(true)
      await adminApi.skills.delete(deleteId)
      setSuccess(`Skill "${deleteItemTitle}" deleted from database.`)
      setDeleteId(null)
      fetchSkills()
    } catch (err) {
      setError(err.message || 'Failed to delete skill.')
    } finally {
      setDeleting(false)
    }
  }

  const filteredSkills = skills.filter((s) => {
    let matchesTab = activeTab === 'all'
    if (activeTab === 'Development') {
      matchesTab = s.category === 'Development' || s.category === 'Both'
    } else if (activeTab === 'Data Analysis') {
      matchesTab = s.category === 'Data Analysis' || s.category === 'Both'
    } else if (activeTab === 'Both') {
      matchesTab = s.category === 'Both'
    }
    const q = search.toLowerCase()
    const matchesSearch = s.name?.toLowerCase().includes(q) || s.category?.toLowerCase().includes(q)
    return matchesTab && matchesSearch
  })

  const getCategoryBadgeClass = (category) => {
    if (category === 'Data Analysis') {
      return 'bg-pink-500/20 text-pink-300 border-pink-500/30'
    }
    if (category === 'Both') {
      return 'bg-purple-500/20 text-purple-300 border-purple-500/30'
    }
    return 'bg-sky-500/20 text-sky-300 border-sky-500/30'
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-100">Skills Management</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage technical proficiencies categorized under Development or Data Analysis.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchSkills}
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
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#007BA7] hover:bg-[#0093C7] rounded-lg transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add New Skill
          </button>
        </div>
      </div>

      {success && <Alert type="success" message={success} onClose={() => setSuccess(null)} />}
      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

      {/* Category Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'all'}
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0 cursor-pointer ${
              activeTab === 'all'
                ? 'bg-[#007BA7] text-white shadow-2xs'
                : 'text-slate-400 hover:text-slate-200 bg-slate-900 hover:bg-slate-800'
            }`}
          >
            All Skills ({skills.length})
          </button>
          {CATEGORIES.map((cat) => {
            const count = skills.filter((s) => s.category === cat.id).length
            const isDA = cat.id === 'Data Analysis'
            const isBoth = cat.id === 'Both'
            return (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={activeTab === cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0 cursor-pointer ${
                  activeTab === cat.id
                    ? isDA
                      ? 'bg-[#FF2D95] text-white shadow-2xs font-semibold'
                      : isBoth
                      ? 'bg-purple-600 text-white shadow-2xs font-semibold'
                      : 'bg-[#007BA7] text-white shadow-2xs font-semibold'
                    : 'text-slate-400 hover:text-slate-200 bg-slate-900 hover:bg-slate-800'
                }`}
              >
                {cat.label} ({count})
              </button>
            )
          })}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search skills..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Skills Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-500" />
            <p className="text-xs">Loading skills from SQLite database...</p>
          </div>
        ) : filteredSkills.length === 0 ? (
          <div className="p-12 text-center">
            <Wrench className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-slate-300">No skills found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {search ? 'No skills match your search.' : 'Click "Add New Skill" to add a technical skill.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-950/80 text-slate-400 uppercase text-[11px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4 font-semibold w-16">Order</th>
                  <th className="py-3 px-4 font-semibold">Skill Name</th>
                  <th className="py-3 px-4 font-semibold">Category</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-300">
                {filteredSkills.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-500 text-xs">
                      #{s.display_order}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-100">
                      {s.name}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getCategoryBadgeClass(s.category)}`}>
                        {s.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(s)}
                          className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded-lg transition-colors"
                          title="Edit Skill"
                          aria-label={`Edit ${s.name}`}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handlePromptDelete(s)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                          title="Delete Skill"
                          aria-label={`Delete ${s.name}`}
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

      {/* Add / Edit Skill Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingId ? 'Edit Skill' : 'Add New Skill'}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSave} className="space-y-4">
          {formError && <Alert type="error" message={formError} onClose={() => setFormError(null)} />}

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Skill Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Python, Docker, FastAPI"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Skill Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#007BA7]"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>
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
              {saving ? 'Saving...' : editingId ? 'Update Skill' : 'Create Skill'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Skill"
        message="Are you sure you want to delete this skill? It will be removed from the SQLite database and public skill universe."
        itemName={deleteItemTitle}
        loading={deleting}
      />
    </div>
  )
}

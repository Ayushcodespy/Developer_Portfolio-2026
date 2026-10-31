import { useState, useEffect } from 'react'
import {
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Search,
  Star,
  RefreshCw,
  Loader2,
  FolderKanban,
  Check,
  Eye,
} from 'lucide-react'
import { adminApi } from '../../services/api'
import { Modal } from '../../components/admin/Modal'
import { ConfirmModal } from '../../components/admin/ConfirmModal'
import { Alert } from '../../components/admin/Alert'

const emptyForm = {
  title: '',
  subtitle: '',
  description: '',
  category: 'Development',
  technologies: '',
  features: '',
  image_url: '',
  github_url: '',
  live_url: '',
  visual_type: 'standard',
  featured: false,
  display_order: 0,
}

export function AdminProjects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')

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

  const fetchProjects = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await adminApi.projects.getAll()
      setProjects(data || [])
    } catch (err) {
      setError(err.message || 'Failed to fetch projects from database.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  const handleOpenAdd = () => {
    setEditingId(null)
    setFormData({
      ...emptyForm,
      category: categoryFilter !== 'all' ? categoryFilter : 'Development',
      display_order: projects.length,
    })
    setFormError(null)
    setIsFormOpen(true)
  }

  const handleOpenEdit = (project) => {
    setEditingId(project.id)
    let techStr = ''
    try {
      if (project.technologies) {
        const parsed = JSON.parse(project.technologies)
        techStr = Array.isArray(parsed) ? parsed.join(', ') : project.technologies
      }
    } catch {
      techStr = project.technologies || ''
    }

    let featStr = ''
    try {
      if (project.features) {
        const parsed = JSON.parse(project.features)
        featStr = Array.isArray(parsed) ? parsed.join('\n') : project.features
      }
    } catch {
      featStr = project.features || ''
    }

    setFormData({
      title: project.title || '',
      subtitle: project.subtitle || '',
      description: project.description || '',
      category: project.category === 'Data Analysis' ? 'Data Analysis' : 'Development',
      technologies: techStr,
      features: featStr,
      image_url: project.image_url || '',
      github_url: project.github_url || '',
      live_url: project.live_url || '',
      visual_type: project.visual_type || 'standard',
      featured: Boolean(project.featured),
      display_order: project.display_order ?? 0,
    })
    setFormError(null)
    setIsFormOpen(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setFormError(null)

    if (!formData.title.trim()) {
      setFormError('Project title is required.')
      return
    }
    if (!formData.description.trim()) {
      setFormError('Project description is required.')
      return
    }
    if (!formData.category || !['Development', 'Data Analysis'].includes(formData.category)) {
      setFormError('Project Category is required. Choose Development or Data Analysis.')
      return
    }

    try {
      setSaving(true)
      const payload = {
        title: formData.title.trim(),
        subtitle: formData.subtitle.trim() || null,
        description: formData.description.trim(),
        category: formData.category,
        technologies: formData.technologies.trim() || null,
        features: formData.features.trim() || null,
        image_url: formData.image_url.trim() || null,
        github_url: formData.github_url.trim() || null,
        live_url: formData.live_url.trim() || null,
        visual_type: formData.visual_type || null,
        featured: formData.featured,
        display_order: parseInt(formData.display_order, 10) || 0,
      }

      if (editingId) {
        await adminApi.projects.update(editingId, payload)
        setSuccess(`Project "${formData.title}" updated successfully in database.`)
      } else {
        await adminApi.projects.create(payload)
        setSuccess(`Project "${formData.title}" created successfully in database.`)
      }

      setIsFormOpen(false)
      fetchProjects()
    } catch (err) {
      setFormError(err.message || 'Failed to save project.')
    } finally {
      setSaving(false)
    }
  }

  const handlePromptDelete = (project) => {
    setDeleteId(project.id)
    setDeleteItemTitle(project.title)
  }

  const handleConfirmDelete = async () => {
    if (!deleteId) return
    try {
      setDeleting(true)
      await adminApi.projects.delete(deleteId)
      setSuccess(`Project "${deleteItemTitle}" deleted from database.`)
      setDeleteId(null)
      fetchProjects()
    } catch (err) {
      setError(err.message || 'Failed to delete project.')
    } finally {
      setDeleting(false)
    }
  }

  const devCount = projects.filter((p) => p.category === 'Development').length
  const daCount = projects.filter((p) => p.category === 'Data Analysis').length

  const filteredProjects = projects.filter((p) => {
    const matchesCat = categoryFilter === 'all' || p.category === categoryFilter
    const q = search.toLowerCase().trim()
    const matchesSearch =
      !q ||
      p.title?.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q)
    return matchesCat && matchesSearch
  })

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Title & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-100">Projects Management</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Create, edit, and organize portfolio projects displayed on the public site.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchProjects}
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
            Add New Project
          </button>
        </div>
      </div>

      {success && <Alert type="success" message={success} onClose={() => setSuccess(null)} />}
      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

      {/* Category Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={categoryFilter === 'all'}
            onClick={() => setCategoryFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0 cursor-pointer ${
              categoryFilter === 'all'
                ? 'bg-[#007BA7] text-white shadow-xs font-semibold'
                : 'text-slate-400 hover:text-slate-200 bg-slate-900 hover:bg-slate-800'
            }`}
          >
            All Projects ({projects.length})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={categoryFilter === 'Development'}
            onClick={() => setCategoryFilter('Development')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0 cursor-pointer ${
              categoryFilter === 'Development'
                ? 'bg-[#007BA7] text-white shadow-xs font-semibold'
                : 'text-slate-400 hover:text-slate-200 bg-slate-900 hover:bg-slate-800'
            }`}
          >
            Development ({devCount})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={categoryFilter === 'Data Analysis'}
            onClick={() => setCategoryFilter('Data Analysis')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0 cursor-pointer ${
              categoryFilter === 'Data Analysis'
                ? 'bg-[#FF2D95] text-white shadow-xs font-semibold'
                : 'text-slate-400 hover:text-slate-200 bg-slate-900 hover:bg-slate-800'
            }`}
          >
            Data Analysis ({daCount})
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search projects by title or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#007BA7]"
          />
        </div>
      </div>

      {/* Projects Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-500" />
            <p className="text-xs">Loading projects from database...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="p-12 text-center">
            <FolderKanban className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-slate-300">No projects found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {search ? 'No projects match your search query.' : 'Click "Add New Project" to create your first portfolio project.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-950/80 text-slate-400 uppercase text-[11px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4 font-semibold">Order</th>
                  <th className="py-3 px-4 font-semibold">Project</th>
                  <th className="py-3 px-4 font-semibold">Category</th>
                  <th className="py-3 px-4 font-semibold">Featured</th>
                  <th className="py-3 px-4 font-semibold">Links</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-300">
                {filteredProjects.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-slate-500 text-xs w-16">
                      #{p.display_order}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-100 flex items-center gap-2">
                        {p.title}
                        {p.featured && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            <Star className="w-2.5 h-2.5 fill-amber-300" /> Featured
                          </span>
                        )}
                      </div>
                      {p.subtitle && <div className="text-xs text-slate-400 mt-0.5">{p.subtitle}</div>}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-md text-xs font-medium border ${
                          p.category === 'Data Analysis'
                            ? 'bg-pink-500/15 text-pink-300 border-pink-500/30'
                            : 'bg-sky-500/15 text-sky-300 border-sky-500/30'
                        }`}
                      >
                        {p.category || 'Development'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {p.featured ? (
                        <span className="text-emerald-400 flex items-center gap-1 text-xs">
                          <Check className="w-3.5 h-3.5" /> Yes
                        </span>
                      ) : (
                        <span className="text-slate-500 text-xs">No</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        {p.github_url && (
                          <a
                            href={p.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 text-slate-400 hover:text-slate-100 rounded hover:bg-slate-800 transition-colors"
                            title="GitHub Repo"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {p.live_url && (
                          <a
                            href={p.live_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 text-blue-400 hover:text-blue-300 rounded hover:bg-slate-800 transition-colors"
                            title="Live Demo"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(p)}
                          className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded-lg transition-colors"
                          title="Edit Project"
                          aria-label={`Edit ${p.title}`}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handlePromptDelete(p)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                          title="Delete Project"
                          aria-label={`Delete ${p.title}`}
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

      {/* Add / Edit Project Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingId ? 'Edit Project' : 'Add New Project'}
        maxWidth="max-w-3xl"
      >
        <form onSubmit={handleSave} className="space-y-4">
          {formError && <Alert type="error" message={formError} onClose={() => setFormError(null)} />}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. AI FAQ Chatbot"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Subtitle
              </label>
              <input
                type="text"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                placeholder="e.g. Intelligent document assistance"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Project Category *
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#007BA7]"
              >
                <option value="Development">Development</option>
                <option value="Data Analysis">Data Analysis</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Description *
              </label>
              <textarea
                required
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Detailed project summary..."
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
                placeholder="e.g. Python, FastAPI, ReactJS, PostgreSQL"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Stored in SQLite as JSON array for direct public portfolio rendering.
              </p>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Key Features / Bullet Points (one per line)
              </label>
              <textarea
                rows={3}
                value={formData.features}
                onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                placeholder="Retrieval-Augmented Generation (RAG)&#10;Semantic document retrieval&#10;REST APIs"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Image URL (Text Link)
              </label>
              <input
                type="text"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="https://example.com/project-preview.webp"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Direct image link. No binary files stored in SQLite.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                GitHub URL
              </label>
              <input
                type="url"
                value={formData.github_url}
                onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                placeholder="https://github.com/..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Live Demo URL
              </label>
              <input
                type="url"
                value={formData.live_url}
                onChange={(e) => setFormData({ ...formData, live_url: e.target.value })}
                placeholder="https://..."
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
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-3 pt-6">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#007BA7]"></div>
                <span className="ml-3 text-xs font-medium text-slate-300">Featured Project</span>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800 mt-6">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              disabled={saving}
              className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-[#007BA7] hover:bg-[#0093C7] rounded-lg transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
              {saving ? 'Saving...' : editingId ? 'Update Project' : 'Create Project'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Project"
        message="Are you sure you want to delete this project? This will permanently remove it from the SQLite database and public portfolio."
        itemName={deleteItemTitle}
        loading={deleting}
      />
    </div>
  )
}

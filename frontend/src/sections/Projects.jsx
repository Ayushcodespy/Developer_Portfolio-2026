import { useState, useEffect, useMemo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Container } from '../components/ui/Container'
import { ProjectFilter } from '../components/projects/ProjectFilter'
import { FeaturedProject } from '../components/projects/FeaturedProject'
import { ProjectCard } from '../components/projects/ProjectCard'
import { ProjectModal } from '../components/projects/ProjectModal'
import { projectsApi } from '../services/api'
import { projectCategories as defaultCategories } from '../data/projects'

export function Projects() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProject, setSelectedProject] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const reduced = useReducedMotion()

  const loadProjects = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await projectsApi.get()
      const transformedProjects = data.map((project) => {
        let techArr = []
        try {
          if (Array.isArray(project.technologies)) {
            techArr = project.technologies
          } else if (typeof project.technologies === 'string') {
            techArr = project.technologies.startsWith('[')
              ? JSON.parse(project.technologies)
              : project.technologies.split(',').map((s) => s.trim()).filter(Boolean)
          }
        } catch {
          techArr = []
        }

        let keyPointsArr = []
        try {
          if (Array.isArray(project.features)) {
            keyPointsArr = project.features
          } else if (typeof project.features === 'string') {
            keyPointsArr = project.features.startsWith('[')
              ? JSON.parse(project.features)
              : project.features.split('\n').map((s) => s.trim()).filter(Boolean)
          }
        } catch {
          keyPointsArr = []
        }

        return {
          id: project.id.toString(),
          title: project.title,
          subtitle: project.subtitle,
          description: project.description,
          technologies: techArr,
          keyPoints: keyPointsArr,
          category: project.category,
          positioning: project.category || 'Full Stack',
          github: project.github_url,
          liveDemo: project.live_url,
          featured: Boolean(project.featured),
          visualType: project.visual_type || 'standard',
          image: project.image_url,
        }
      })
      setProjects(transformedProjects)
    } catch (err) {
      console.error('Failed to fetch projects:', err)
      setError('Failed to load projects. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProjects()
  }, [])

  // Build unified categories list based on existing projects
  const categories = useMemo(() => {
    const map = new Map()
    map.set('all', { id: 'all', label: 'All' })

    defaultCategories.forEach((c) => {
      if (c.id !== 'all') {
        map.set(c.id.toLowerCase(), c)
      }
    })

    projects.forEach((p) => {
      if (p.category) {
        const id = p.category.toLowerCase().replace(/[^a-z0-9]/g, '-')
        if (!map.has(id)) {
          map.set(id, { id, label: p.category })
        }
      }
    })

    return Array.from(map.values())
  }, [projects])

  // Filter projects by category and search term
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      // Category filter
      if (activeCategory !== 'all') {
        const pCatNormalized = (project.category || '').toLowerCase().replace(/[^a-z0-9]/g, '-')
        const activeNormalized = activeCategory.toLowerCase().replace(/[^a-z0-9]/g, '-')
        if (pCatNormalized !== activeNormalized && (project.category || '').toLowerCase() !== activeCategory.toLowerCase()) {
          return false
        }
      }

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim()
        const matchesTitle = project.title?.toLowerCase().includes(query)
        const matchesSubtitle = project.subtitle?.toLowerCase().includes(query)
        const matchesDesc = project.description?.toLowerCase().includes(query)
        const matchesCategory = project.category?.toLowerCase().includes(query)
        const matchesTech = project.technologies?.some((t) =>
          t.toLowerCase().includes(query)
        )

        if (!matchesTitle && !matchesSubtitle && !matchesDesc && !matchesCategory && !matchesTech) {
          return false
        }
      }

      return true
    })
  }, [projects, activeCategory, searchQuery])

  // Retain AI FAQ Chatbot or explicitly featured project as top showcase
  const featuredProject = useMemo(() => {
    return projects.find((p) => p.featured) || projects.find((p) => p.title?.includes('FAQ Chatbot'))
  }, [projects])

  const showFeaturedInView = featuredProject && filteredProjects.some((p) => p.id === featuredProject.id)
  const secondaryProjects = filteredProjects.filter((p) => !showFeaturedInView || p.id !== featuredProject.id)

  const handleProjectClick = (project) => {
    setSelectedProject(project)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setTimeout(() => setSelectedProject(null), 200)
  }

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isModalOpen) {
        handleCloseModal()
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isModalOpen])

  return (
    <section id="projects" className="projects-section section-shell" aria-labelledby="projects-title">
      <Container>
        {/* Upper Showcase Header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: reduced ? 0 : 0.65 }}
          className="projects-intro space-y-6"
        >
          <div className="flex flex-col gap-2">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#007BA7] dark:text-[#38BDF8]">
              PROJECTS
            </p>
            <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-extrabold tracking-tight text-[#17212B] dark:text-white">
              Featured{' '}
              <span className="bg-gradient-to-r from-[#007BA7] via-[#00A6DB] to-[#FF2D95] dark:from-[#007BA7] dark:via-[#38BDF8] dark:to-[#FF2D95] bg-clip-text text-transparent">
                Projects
              </span>
            </h2>
            <p className="text-sm sm:text-base text-[#475569] dark:text-[#B8C2CC] leading-relaxed max-w-2xl">
              A collection of my work, showcasing real-world applications, robust APIs, and technical problem-solving.
            </p>
          </div>

          <ProjectFilter
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="mt-14 flex items-center justify-center py-16">
            <div className="flex items-center gap-3 text-[#64748B] dark:text-[#8B98A5]">
              <div className="w-8 h-8 border-2 border-[#007BA7]/30 border-t-[#007BA7] rounded-full animate-spin" />
              <span className="text-sm">Loading projects from database...</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="mt-12 flex flex-col items-center justify-center py-12 text-center">
            <p className="text-[#475569] dark:text-[#B8C2CC] mb-4">{error}</p>
            <button
              onClick={loadProjects}
              className="px-4 py-2 bg-[#007BA7] hover:bg-[#0093C7] text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        {/* Projects Content Grid */}
        {!loading && !error && (
          <div className="mt-8 sm:mt-10 space-y-8 sm:space-y-10">
            {/* Primary Featured Project Card (AI FAQ Chatbot preserved) */}
            {showFeaturedInView && (
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: reduced ? 0 : 0.55, delay: reduced ? 0 : 0.05 }}
              >
                <FeaturedProject
                  project={featuredProject}
                  onClick={() => handleProjectClick(featuredProject)}
                />
              </motion.div>
            )}

            {/* 3-Column Desktop Grid (2-column tablet, 1-column mobile) */}
            {secondaryProjects.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: reduced ? 0 : 0.5, delay: reduced ? 0 : 0.1 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch"
              >
                {secondaryProjects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{
                      duration: reduced ? 0 : 0.45,
                      delay: reduced ? 0 : 0.06 * (index % 6),
                    }}
                    className="h-full flex flex-col"
                  >
                    <ProjectCard
                      project={project}
                      onClick={() => handleProjectClick(project)}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Empty State */}
            {filteredProjects.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16 bg-white dark:bg-[#14191D] rounded-2xl border border-[#D9E2EA] dark:border-[#26333A] p-8 shadow-xs"
              >
                <p className="text-[#17212B] dark:text-[#F5F7FA] font-medium">No projects match the selected criteria.</p>
                <p className="text-[#64748B] dark:text-[#8B98A5] text-xs sm:text-sm mt-1">
                  Try clearing your search term or selecting a different category.
                </p>
                {(activeCategory !== 'all' || searchQuery) && (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveCategory('all')
                      setSearchQuery('')
                    }}
                    className="mt-4 px-4 py-2 text-xs font-semibold text-[#007BA7] dark:text-[#38BDF8] bg-[#007BA7]/10 hover:bg-[#007BA7]/20 border border-[#007BA7]/30 rounded-lg transition-colors cursor-pointer"
                  >
                    Reset Filters
                  </button>
                )}
              </motion.div>
            )}
          </div>
        )}
      </Container>

      <ProjectModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </section>
  )
}
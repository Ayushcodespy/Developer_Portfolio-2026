import { useState, useEffect } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Container } from '../components/ui/Container'
import { ExperienceTimeline } from '../components/experience/ExperienceTimeline'
import { experienceApi } from '../services/api'
import { Briefcase } from 'lucide-react'

export function Experience() {
  const reduced = useReducedMotion()
  const [experience, setExperience] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await experienceApi.get()
        // Transform API data to match frontend structure, sort newest first
        const transformedExperience = data
          .map(exp => ({
            id: exp.id.toString(),
            company: exp.company,
            role: exp.role,
            duration: exp.duration,
            startDate: exp.start_date,
            endDate: exp.end_date,
            technologies: exp.technologies ? JSON.parse(exp.technologies) : [],
            highlight: exp.description,
            responsibilities: exp.responsibilities ? JSON.parse(exp.responsibilities) : [],
            displayOrder: exp.display_order || 0,
          }))
          .sort((a, b) => {
            // Sort by display_order first (higher = more recent), then by start date
            if (a.displayOrder !== b.displayOrder) return b.displayOrder - a.displayOrder
            // Fallback: try to sort by start_date descending
            return 0
          })
        setExperience(transformedExperience)
      } catch (err) {
        console.error('Failed to fetch experience:', err)
        setError('Failed to load experience data.')
        setExperience([])
      } finally {
        setLoading(false)
      }
    }

    fetchExperience()
  }, [])

  return (
    <section id="experience" className="experience-section section-shell" aria-labelledby="experience-title">
      <Container>
        {/* ── Section heading with gradient accent ── */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: reduced ? 0 : 0.65 }}
          className="experience-intro mb-16"
        >
          <header>
            <p className="mb-2.5 text-xs font-bold uppercase tracking-[0.22em] text-[#007BA7] dark:text-[#38BDF8]">
              MY JOURNEY
            </p>
            <h2
              id="experience-title"
              className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#17212B] dark:text-[#F5F7FA]"
            >
              Work{' '}
              <span className="exp-heading-accent">Experience</span>
            </h2>
            <p className="mt-3 max-w-2xl text-sm sm:text-base text-[#475569] dark:text-[#B8C2CC] leading-relaxed">
              Hands-on experience building real-world software and working with modern development technologies.
            </p>
          </header>
        </motion.div>

        {/* ── Content states ── */}
        {loading && (
          <div className="mt-12 flex items-center justify-center py-12">
            <div className="flex items-center gap-3 text-[#8B98A5]">
              <div className="w-8 h-8 border-2 border-[#007BA7]/30 border-t-[#007BA7] rounded-full animate-spin" />
              <span>Loading experience...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-12 flex items-center justify-center py-12">
            <p className="text-[#8B98A5]">{error}</p>
          </div>
        )}

        {!loading && !error && experience.length === 0 && (
          <div className="mt-12 flex flex-col items-center justify-center py-16 text-center">
            <Briefcase size={40} className="text-[#26333A] mb-4" />
            <p className="text-[#8B98A5] text-sm">No experience entries yet.</p>
          </div>
        )}

        {!loading && !error && experience.length > 0 && (
          <ExperienceTimeline experiences={experience} />
        )}
      </Container>
    </section>
  )
}
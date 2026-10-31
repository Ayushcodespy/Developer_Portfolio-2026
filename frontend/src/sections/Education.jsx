import { useState, useEffect } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Container } from '../components/ui/Container'
import { EducationCard } from '../components/education/EducationCard'
import { educationApi } from '../services/api'

export function Education() {
  const reduced = useReducedMotion()
  const [education, setEducation] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchEducation = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await educationApi.get()
        // Transform API data to match frontend structure
        const transformedEducation = (data || []).map((edu) => ({
          id: edu.id.toString(),
          degree: edu.degree,
          discipline: edu.field,
          institution: edu.institution,
          location: edu.location,
          period:
            edu.start_year && edu.end_year
              ? `${edu.start_year} – ${edu.end_year}`
              : edu.start_year || edu.end_year || '',
          cgpa: edu.cgpa,
          percentage: edu.percentage,
          description: edu.description,
        }))
        setEducation(transformedEducation)
      } catch (err) {
        console.error('Failed to fetch education:', err)
        setError('Failed to load education data.')
        setEducation([])
      } finally {
        setLoading(false)
      }
    }

    fetchEducation()
  }, [])

  if (loading) {
    return (
      <section id="education" className="education-section section-shell" aria-labelledby="education-title">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-violet-400">
              EDUCATION
            </p>
            <h2
              id="education-title"
              className="font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-white sm:text-5xl"
            >
              Education
            </h2>
            <p className="mt-3 text-slate-400 text-sm sm:text-base">
              Academic milestones that shaped my journey.
            </p>
          </div>
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3 text-slate-400">
              <div className="w-8 h-8 border-2 border-violet-500/30 border-t-violet-400 rounded-full animate-spin" />
              <span>Loading education...</span>
            </div>
          </div>
        </Container>
      </section>
    )
  }

  if (error) {
    return (
      <section id="education" className="education-section section-shell" aria-labelledby="education-title">
        <Container>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-violet-400">
              EDUCATION
            </p>
            <h2
              id="education-title"
              className="font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-white sm:text-5xl"
            >
              Education
            </h2>
            <p className="mt-3 text-slate-400 text-sm sm:text-base">
              Academic milestones that shaped my journey.
            </p>
          </div>
          <div className="flex items-center justify-center py-12">
            <p className="text-slate-400">{error}</p>
          </div>
        </Container>
      </section>
    )
  }

  return (
    <section id="education" className="education-section section-shell" aria-labelledby="education-title">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: reduced ? 0 : 0.65 }}
          className="text-center max-w-2xl mx-auto mb-12 sm:mb-16"
        >
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-violet-400">
            EDUCATION
          </p>
          <h2
            id="education-title"
            className="font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-white sm:text-5xl"
          >
            Education
          </h2>
          <p className="mt-3 text-slate-400 text-sm sm:text-base">
            Academic milestones that shaped my journey.
          </p>
        </motion.div>

        {/* Wide Horizontal Glassmorphism Cards */}
        <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 w-full">
          {education.map((edu, index) => (
            <EducationCard key={edu.id} education={edu} index={index} />
          ))}
          {education.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-slate-400">No education records found.</p>
            </div>
          )}
        </div>
      </Container>
    </section>
  )
}
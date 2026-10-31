import { motion, useReducedMotion } from 'framer-motion'
import { ProjectBadge } from '../projects/ProjectBadge'
import { Briefcase, Calendar, MapPin, Clock, ChevronRight } from 'lucide-react'
import { calculateDuration } from './ExperienceTimeline'

/**
 * Premium experience card displayed inside the timeline.
 *
 * Props:
 *   experience — { role, company, startDate, endDate, duration, highlight, technologies, responsibilities }
 *   index      — position in list (for staggered animation delays)
 *   accent     — { color } the accent colour from the timeline
 */
export function ExperienceCard({ experience, index, accent }) {
  const reduced = useReducedMotion()
  const accentColor = accent?.color || '#007BA7'

  // Derive employment type heuristic from description or fallback
  const employmentType = deriveEmploymentType(experience.role, experience.highlight)

  return (
    <article className="exp-card group">
      {/* Hover glow border */}
      <div
        className="exp-card-glow"
        style={{
          background: `linear-gradient(135deg, ${accentColor}20, transparent 60%, #FF2D9510)`,
        }}
        aria-hidden="true"
      />

      <div className="exp-card-inner">
        {/* ── Header ── */}
        <div className="exp-card-header">
          <div className="exp-card-header-content">
            {/* Role title */}
            <motion.h3
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: reduced ? 0 : 0.4, delay: index * 0.12 + 0.1 }}
              className="exp-card-role"
            >
              {experience.role}
            </motion.h3>

            {/* Company row */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: reduced ? 0 : 0.4, delay: index * 0.12 + 0.15 }}
              className="exp-card-company-row"
            >
              <Briefcase size={16} className="exp-card-icon" style={{ color: accentColor }} />
              <span className="exp-card-company" style={{ color: accentColor }}>{experience.company}</span>
            </motion.div>

            {/* Meta row: employment type, location, mode */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: reduced ? 0 : 0.4, delay: index * 0.12 + 0.2 }}
              className="exp-card-meta"
            >
              {employmentType && (
                <span className="exp-card-meta-tag" style={{ borderColor: `${accentColor}30`, color: accentColor }}>
                  <Clock size={12} />
                  {employmentType}
                </span>
              )}
            </motion.div>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="exp-card-body">
          {/* Description / highlight */}
          {experience.highlight && (
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: reduced ? 0 : 0.4, delay: index * 0.12 + 0.25 }}
              className="exp-card-description"
            >
              {experience.highlight}
            </motion.p>
          )}

          {/* Key Responsibilities */}
          {experience.responsibilities && experience.responsibilities.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: reduced ? 0 : 0.4, delay: index * 0.12 + 0.3 }}
              className="exp-card-responsibilities"
            >
              <h4 className="exp-card-sub-heading">Key Responsibilities & Achievements</h4>
              <ul className="exp-card-resp-list">
                {experience.responsibilities.map((resp, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: reduced ? 0 : 0.3, delay: index * 0.12 + 0.35 + i * 0.06 }}
                    className="exp-card-resp-item"
                  >
                    <ChevronRight size={14} className="exp-card-resp-chevron" style={{ color: accentColor }} />
                    <span>{resp}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* Technologies */}
          {experience.technologies && experience.technologies.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: reduced ? 0 : 0.4, delay: index * 0.12 + 0.4 }}
              className="exp-card-tech"
            >
              <h4 className="exp-card-sub-heading">Technologies & Skills</h4>
              <div className="exp-card-tech-list">
                {experience.technologies.map((tech, i) => (
                  <ProjectBadge key={tech} technology={tech} tone={i % 2 === 0 ? 'cerulean' : 'rose'} />
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </article>
  )
}

/**
 * Attempt to derive employment type from role or description text.
 */
function deriveEmploymentType(role, description) {
  const text = `${role || ''} ${description || ''}`.toLowerCase()
  if (text.includes('intern')) return 'Internship'
  if (text.includes('freelance') || text.includes('contract')) return 'Contract'
  if (text.includes('part-time') || text.includes('part time')) return 'Part-time'
  return 'Full-time'
}
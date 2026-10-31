import { motion, useReducedMotion } from 'framer-motion'
import { ExperienceCard } from './ExperienceCard'

/**
 * Calculate a human-readable duration string from two date strings.
 * Handles formats: "2025-12", "Dec 2025", "December 2025", "Jan 2025", "Present"
 */
function parseDateString(dateStr) {
  if (!dateStr) return null
  const lower = dateStr.trim().toLowerCase()
  if (lower === 'present' || lower === 'current' || lower === 'now') return new Date()

  // "2025-12" format
  const isoMatch = dateStr.match(/^(\d{4})-(\d{1,2})$/)
  if (isoMatch) {
    return new Date(parseInt(isoMatch[1]), parseInt(isoMatch[2]) - 1, 1)
  }

  // "Dec 2025" or "December 2025" format
  const monthNames = {
    jan: 0, january: 0, feb: 1, february: 1, mar: 2, march: 2,
    apr: 3, april: 3, may: 4, jun: 5, june: 5, jul: 6, july: 6,
    aug: 7, august: 7, sep: 8, september: 8, oct: 9, october: 9,
    nov: 10, november: 10, dec: 11, december: 11,
  }
  const textMatch = dateStr.match(/^([a-zA-Z]+)\s+(\d{4})$/)
  if (textMatch) {
    const month = monthNames[textMatch[1].toLowerCase()]
    if (month !== undefined) {
      return new Date(parseInt(textMatch[2]), month, 1)
    }
  }

  return null
}

function formatMonthYear(dateStr) {
  const parsed = parseDateString(dateStr)
  if (!parsed) return dateStr || ''
  const lower = (dateStr || '').trim().toLowerCase()
  if (lower === 'present' || lower === 'current' || lower === 'now') return 'Present'
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${months[parsed.getMonth()]} ${parsed.getFullYear()}`
}

export function calculateDuration(startDateStr, endDateStr) {
  const start = parseDateString(startDateStr)
  const end = parseDateString(endDateStr)
  if (!start || !end) return null

  let totalMonths = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth())
  // Include the end month in the count (e.g., Dec 2025 to May 2026 = 6 months)
  totalMonths = Math.max(totalMonths, 0)

  if (totalMonths === 0) return '< 1 month'

  const years = Math.floor(totalMonths / 12)
  const months = totalMonths % 12

  if (years === 0) {
    return `${months} month${months !== 1 ? 's' : ''}`
  }
  if (months === 0) {
    return `${years} yr${years !== 1 ? 's' : ''}`
  }
  return `${years} yr${years !== 1 ? 's' : ''} ${months} mo${months !== 1 ? 's' : ''}`
}

// Accent colors that alternate per entry
const accents = [
  { color: '#007BA7', glow: 'rgba(0, 123, 167, 0.6)', glowFade: 'rgba(0, 123, 167, 0)' },
  { color: '#FF2D95', glow: 'rgba(255, 45, 149, 0.6)', glowFade: 'rgba(255, 45, 149, 0)' },
]

export function ExperienceTimeline({ experiences }) {
  const reduced = useReducedMotion()

  if (!experiences || experiences.length === 0) return null

  return (
    <div className="exp-timeline">
      {/* Vertical line */}
      <div className="exp-timeline-rail" aria-hidden="true">
        <motion.div
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true, amount: 0.05 }}
          transition={{ duration: reduced ? 0 : 1.2, ease: 'easeOut' }}
          className="exp-timeline-rail-fill"
        />
      </div>

      {experiences.map((exp, index) => {
        const accent = accents[index % accents.length]
        const startFormatted = formatMonthYear(exp.startDate)
        const endFormatted = formatMonthYear(exp.endDate)
        const computedDuration = calculateDuration(exp.startDate, exp.endDate)

        return (
          <div key={exp.id} className="exp-timeline-entry">
            {/* ── Left column: dates & marker ── */}
            <div className="exp-timeline-left">
              {/* Date labels (desktop) */}
              <motion.div
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: reduced ? 0 : 0.5, delay: index * 0.15 }}
                className="exp-timeline-dates"
              >
                <span className="exp-timeline-date-range">
                  {startFormatted} — {endFormatted}
                </span>
                {computedDuration && (
                  <span className="exp-timeline-duration" style={{ color: accent.color }}>
                    {computedDuration}
                  </span>
                )}
              </motion.div>

              {/* Glowing marker */}
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: reduced ? 0 : 0.4, delay: index * 0.15 + 0.1, type: 'spring', stiffness: 260, damping: 20 }}
                className="exp-timeline-marker"
                style={{
                  backgroundColor: accent.color,
                  boxShadow: `0 0 16px ${accent.glow}`,
                }}
                aria-hidden="true"
              >
                {!reduced && (
                  <motion.div
                    animate={{
                      boxShadow: [
                        `0 0 0 0px ${accent.glow}`,
                        `0 0 0 10px ${accent.glowFade}`,
                        `0 0 0 0px ${accent.glow}`,
                      ],
                    }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                    className="exp-timeline-marker-pulse"
                    style={{ backgroundColor: accent.color }}
                  />
                )}
              </motion.div>
            </div>

            {/* ── Right column: card ── */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: reduced ? 0 : 0.6, delay: index * 0.15 + 0.15 }}
              className="exp-timeline-card-wrapper"
            >
              {/* Mobile-only date row */}
              <div className="exp-timeline-dates-mobile">
                <span className="exp-timeline-date-range">
                  {startFormatted} — {endFormatted}
                </span>
                {computedDuration && (
                  <span className="exp-timeline-duration-badge" style={{ color: accent.color, borderColor: `${accent.color}33` }}>
                    {computedDuration}
                  </span>
                )}
              </div>
              <ExperienceCard experience={exp} index={index} accent={accent} />
            </motion.div>
          </div>
        )
      })}
    </div>
  )
}
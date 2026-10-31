import { motion, useReducedMotion } from 'framer-motion'
import { GraduationCap, Calendar, MapPin, Award, BarChart2, School } from 'lucide-react'

export function EducationCard({ education, index }) {
  const reduced = useReducedMotion()
  const isRose = index % 2 === 1

  // Format percentage with % if not present
  const formattedPercentage = education.percentage
    ? education.percentage.toString().trim().endsWith('%')
      ? education.percentage.toString().trim()
      : `${education.percentage.toString().trim()}%`
    : null

  // CGPA validity check (ensure not null, empty, or 'N/A')
  const hasCgpa = Boolean(
    education.cgpa &&
    education.cgpa.toString().trim() !== '' &&
    education.cgpa.toString().trim().toLowerCase() !== 'null' &&
    education.cgpa.toString().trim().toLowerCase() !== 'n/a'
  )

  const theme = isRose
    ? {
        border: 'border-[#FF2D95]/30 hover:border-[#FF2D95]/60',
        glow: 'from-[#FF2D95]/10 via-[#FF2D95]/5 to-transparent',
        hoverGlow: 'from-[#FF2D95]/20 to-[#FF2D95]/10',
        iconBg: 'bg-[#FF2D95]/15 border-[#FF2D95]/30 text-[#D81B78] dark:text-[#FF66B2]',
        badgeBg: 'bg-[#FF2D95]/12 border-[#FF2D95]/30 text-[#D81B78] dark:text-[#FF66B2]',
        streamColor: 'text-[#D81B78] dark:text-[#FF66B2]',
        metricIconColor: 'text-[#D81B78] dark:text-[#FF66B2]',
        cardShadow: 'shadow-[0_10px_30px_rgba(255,45,149,0.06)]',
      }
    : {
        border: 'border-[#007BA7]/30 hover:border-[#007BA7]/60',
        glow: 'from-[#007BA7]/10 via-[#007BA7]/5 to-transparent',
        hoverGlow: 'from-[#007BA7]/20 to-[#007BA7]/10',
        iconBg: 'bg-[#007BA7]/15 border-[#007BA7]/30 text-[#007BA7] dark:text-[#38BDF8]',
        badgeBg: 'bg-[#007BA7]/12 border-[#007BA7]/30 text-[#007BA7] dark:text-[#38BDF8]',
        streamColor: 'text-[#007BA7] dark:text-[#38BDF8]',
        metricIconColor: 'text-[#007BA7] dark:text-[#38BDF8]',
        cardShadow: 'shadow-[0_10px_30px_rgba(0,123,167,0.06)]',
      }

  return (
    <motion.article
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: reduced ? 0 : 0.5, delay: reduced ? 0 : index * 0.12 }}
      className="group relative w-full"
    >
      {/* Subtle outer glow on hover */}
      <div
        className={`absolute -inset-0.5 bg-gradient-to-r ${theme.hoverGlow} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-md pointer-events-none`}
      />

      {/* Main Card */}
      <div
        className={`relative w-full rounded-2xl bg-white dark:bg-[#14191D] backdrop-blur-xl border border-[#D9E2EA] dark:border-[#26333A] ${theme.border} p-6 sm:p-7 transition-all duration-300 group-hover:translate-y-[-2px] shadow-md dark:shadow-xl ${theme.cardShadow} overflow-hidden`}
      >
        {/* Subtle interior gradient background */}
        <div
          className={`absolute top-0 right-0 w-96 h-96 bg-gradient-to-br ${theme.glow} rounded-full blur-3xl opacity-40 pointer-events-none`}
        />

        {/* Card Content Layout */}
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left Area: Icon + Details */}
          <div className="flex items-start gap-4 sm:gap-5 flex-1 min-w-0">
            {/* Prominent Rounded Square Icon */}
            <div
              className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border ${theme.iconBg} flex items-center justify-center flex-shrink-0 shadow-sm`}
            >
              <GraduationCap className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>

            {/* Information */}
            <div className="flex-1 min-w-0 space-y-2">
              <div>
                <h3 className="font-[family-name:var(--font-display)] text-xl sm:text-2xl font-bold text-[#17212B] dark:text-[#F5F7FA] tracking-tight">
                  {education.degree}
                </h3>
                {education.discipline && (
                  <p className={`text-sm sm:text-base font-semibold ${theme.streamColor} mt-0.5`}>
                    {education.discipline}
                  </p>
                )}
              </div>

              {/* Institution and Location */}
              <div className="space-y-1 pt-0.5">
                {education.institution && (
                  <div className="flex items-center gap-2 text-[#475569] dark:text-[#CBD5E1] text-sm font-medium">
                    <School className="w-4 h-4 text-[#64748B] dark:text-[#8B98A5] flex-shrink-0" />
                    <span>{education.institution}</span>
                  </div>
                )}
                {education.location && (
                  <div className="flex items-center gap-2 text-[#64748B] dark:text-[#8B98A5] text-xs sm:text-sm">
                    <MapPin className="w-3.5 h-3.5 text-[#64748B] dark:text-[#8B98A5] flex-shrink-0" />
                    <span>{education.location}</span>
                  </div>
                )}
              </div>

              {/* Description (if present) */}
              {education.description && (
                <p className="text-xs sm:text-sm text-[#475569] dark:text-[#B8C2CC] pt-1 leading-relaxed max-w-xl">
                  {education.description}
                </p>
              )}
            </div>
          </div>

          {/* Vertical Divider (Desktop) / Horizontal Divider (Mobile) */}
          <div className="hidden lg:block w-px self-stretch bg-[#D9E2EA] dark:bg-[#26333A] my-1 flex-shrink-0" />
          <div className="block lg:hidden w-full h-px bg-[#D9E2EA] dark:bg-[#26333A] my-0" />

          {/* Right Area: Date Range & Metrics */}
          <div className="flex flex-col sm:flex-row lg:flex-col justify-between items-start sm:items-center lg:items-end gap-4 lg:w-64 flex-shrink-0">
            {/* Date Badge */}
            {education.period && (
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold ${theme.badgeBg}`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>{education.period}</span>
              </div>
            )}

            {/* Metrics */}
            <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto lg:w-full lg:justify-end">
              {/* CGPA block (only if valid CGPA exists) */}
              {hasCgpa && (
                <div className="flex-1 sm:flex-initial lg:flex-1 p-3 rounded-xl bg-slate-50 dark:bg-[#181818] border border-[#D9E2EA] dark:border-[#26333A] flex items-center gap-3 min-w-[110px]">
                  <div className="p-2 rounded-lg bg-slate-100 dark:bg-[#121212]">
                    <Award className={`w-4 h-4 ${theme.metricIconColor}`} />
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-[#64748B] dark:text-[#8B98A5] uppercase tracking-wider block">
                      CGPA
                    </span>
                    <span className="text-sm sm:text-base font-bold text-[#17212B] dark:text-[#F5F7FA] tracking-tight">
                      {education.cgpa}
                    </span>
                  </div>
                </div>
              )}

              {/* Percentage block (only if valid percentage exists) */}
              {formattedPercentage && (
                <div className="flex-1 sm:flex-initial lg:flex-1 p-3 rounded-xl bg-slate-50 dark:bg-[#181818] border border-[#D9E2EA] dark:border-[#26333A] flex items-center gap-3 min-w-[110px]">
                  <div className="p-2 rounded-lg bg-slate-100 dark:bg-[#121212]">
                    <BarChart2 className={`w-4 h-4 ${theme.metricIconColor}`} />
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-[#64748B] dark:text-[#8B98A5] uppercase tracking-wider block">
                      Percentage
                    </span>
                    <span className="text-sm sm:text-base font-bold text-[#17212B] dark:text-[#F5F7FA] tracking-tight">
                      {formattedPercentage}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  )
}
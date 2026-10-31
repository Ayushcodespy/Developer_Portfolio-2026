import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, Github, ExternalLink } from 'lucide-react'
import { ProjectBadge } from './ProjectBadge'
import { ProjectVisual } from './ProjectVisual'

export function ProjectCard({ project, onClick }) {
  const reduced = useReducedMotion()

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: reduced ? 0 : 0.45, ease: 'easeOut' }}
      className="group relative flex flex-col h-full rounded-2xl bg-white dark:bg-[#14191D] border border-[#D9E2EA] dark:border-[#26333A] hover:border-[#007BA7]/50 dark:hover:border-[#007BA7]/60 shadow-xs hover:shadow-xl dark:hover:shadow-[0_16px_36px_-12px_rgba(0,123,167,0.2)] transition-all duration-300 transform-gpu hover:-translate-y-1.5 motion-reduce:hover:translate-y-0 motion-reduce:transition-none cursor-pointer overflow-hidden"
      onClick={onClick}
    >
      {/* Subtle background glow effect on hover */}
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-[#007BA7]/15 via-transparent to-[#FF2D95]/10 blur-xs"
        aria-hidden="true"
      />

      {/* Media / Screenshot Container */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-[#12181C] border-b border-[#D9E2EA] dark:border-[#26333A]">
        <div className="w-full h-full overflow-hidden transition-transform duration-500 ease-out group-hover:scale-[1.04] motion-reduce:group-hover:scale-100">
          <ProjectVisual
            visualType={project.visualType}
            image={project.image}
            alt={`${project.title} screenshot`}
            className="w-full h-full"
          />
        </div>

        {/* Category / Featured Badge - Top Left Floating Pill */}
        {project.category && (
          <div className="absolute top-3 left-3 z-10">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide backdrop-blur-md shadow-xs ${
                project.featured || project.category?.toLowerCase().includes('featured')
                  ? 'bg-[#181818]/90 text-[#FF66B2] border border-[#FF2D95]/50'
                  : 'bg-[#14191D]/90 text-[#38BDF8] border border-[#007BA7]/50'
              }`}
            >
              <span className="text-[10px]">★</span>
              <span>{project.category}</span>
            </span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="flex-1 p-5 flex flex-col justify-between space-y-3.5">
        <div className="space-y-1.5">
          {project.subtitle && (
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#007BA7] dark:text-[#38BDF8]">
              {project.subtitle}
            </p>
          )}

          <h3 className="text-base sm:text-lg font-bold text-[#17212B] dark:text-[#F5F7FA] tracking-tight group-hover:text-[#007BA7] dark:group-hover:text-[#38BDF8] transition-colors duration-200">
            {project.title}
          </h3>

          <p className="text-xs sm:text-sm text-[#475569] dark:text-[#B8C2CC] line-clamp-2 leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Technologies Pills */}
        <div className="space-y-3.5 pt-1">
          <div className="flex flex-wrap gap-1.5">
            {project.technologies && project.technologies.slice(0, 4).map((tech, i) => (
              <ProjectBadge
                key={tech}
                technology={tech}
                tone={i % 2 === 0 ? 'cerulean' : 'rose'}
              />
            ))}
            {project.technologies && project.technologies.length > 4 && (
              <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium text-[#64748B] dark:text-[#8B98A5] bg-slate-100 dark:bg-[#181818] rounded-full border border-[#D9E2EA] dark:border-[#26333A]">
                +{project.technologies.length - 4}
              </span>
            )}
          </div>

          {/* Action Footer Bar */}
          <div className="pt-3 border-t border-[#D9E2EA] dark:border-[#26333A] flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onClick()
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-[#007BA7] to-[#0093C7] hover:from-[#006F96] hover:to-[#007BA7] rounded-lg shadow-xs transition-all cursor-pointer group/btn"
            >
              <span>View Details</span>
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
            </button>

            {/* Direct Project External / GitHub Links */}
            <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg text-[#64748B] dark:text-[#B8C2CC] hover:text-[#17212B] dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-[#181818] dark:hover:bg-[#26333A] border border-[#D9E2EA] dark:border-[#26333A] transition-all focus:outline-none focus:ring-2 focus:ring-[#007BA7]/50"
                  title="View GitHub Repository"
                  aria-label={`${project.title} GitHub repository`}
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
              {project.liveDemo && (
                <a
                  href={project.liveDemo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg text-[#64748B] dark:text-[#B8C2CC] hover:text-[#007BA7] dark:hover:text-[#38BDF8] bg-slate-100 hover:bg-slate-200 dark:bg-[#181818] dark:hover:bg-[#26333A] border border-[#D9E2EA] dark:border-[#26333A] transition-all focus:outline-none focus:ring-2 focus:ring-[#007BA7]/50"
                  title="Visit Live Application"
                  aria-label={`${project.title} live demo`}
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  )
}
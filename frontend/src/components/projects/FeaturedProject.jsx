import { motion } from 'framer-motion'
import { ArrowUpRight, Github, ExternalLink } from 'lucide-react'
import { ProjectBadge } from './ProjectBadge'
import { ProjectVisual } from './ProjectVisual'

export function FeaturedProject({ project, onClick }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6 }}
      className="group relative cursor-pointer"
      onClick={onClick}
    >
      {/* Subtle outer glow on hover */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#007BA7]/20 to-[#FF2D95]/15 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm pointer-events-none" />

      <div className="relative bg-white dark:bg-[#14191D] backdrop-blur-xl rounded-2xl border border-[#D9E2EA] dark:border-[#26333A] shadow-xs hover:shadow-xl hover:border-[#007BA7]/50 dark:hover:border-[#007BA7]/60 transition-all duration-300 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 items-center">
          <div className="p-5 sm:p-6 lg:p-6">
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="aspect-video w-full rounded-xl overflow-hidden border border-[#D9E2EA] dark:border-[#26333A] bg-slate-100 dark:bg-[#12181C]"
            >
              <ProjectVisual
                visualType={project.visualType}
                image={project.image}
                alt={`${project.title} featured project visual`}
                className="w-full h-full"
              />
            </motion.div>
          </div>

          <div className="p-5 sm:p-6 lg:p-7 flex flex-col justify-center">
            <div className="space-y-3.5">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#FF2D95]/15 text-[#D81B78] dark:text-[#FF66B2] border border-[#FF2D95]/30">
                    ★ Featured Project
                  </span>
                  {project.category && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#007BA7]/15 text-[#007BA7] dark:text-[#38BDF8] border border-[#007BA7]/30">
                      {project.category}
                    </span>
                  )}
                  {project.subtitle && (
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#475569] dark:text-[#8B98A5]">
                      {project.subtitle}
                    </span>
                  )}
                </div>
                <h3 className="font-[family-name:var(--font-display)] text-xl sm:text-2xl lg:text-3xl font-bold text-[#17212B] dark:text-[#F5F7FA] group-hover:text-[#007BA7] dark:group-hover:text-[#38BDF8] transition-colors">
                  {project.title}
                </h3>
                {project.positioning && (
                  <p className="mt-1 text-xs sm:text-sm text-[#475569] dark:text-[#8B98A5] font-medium">
                    {project.positioning}
                  </p>
                )}
              </div>

              <p className="text-xs sm:text-sm text-[#475569] dark:text-[#B8C2CC] leading-relaxed line-clamp-3">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {project.technologies.slice(0, 5).map((tech, i) => (
                  <ProjectBadge key={tech} technology={tech} tone={i % 2 === 0 ? 'cerulean' : 'rose'} />
                ))}
                {project.technologies.length > 5 && (
                  <span className="text-xs text-[#64748B] dark:text-[#8B98A5] self-center">
                    +{project.technologies.length - 5} more
                  </span>
                )}
              </div>

              <div className="pt-3 flex items-center justify-between border-t border-[#D9E2EA] dark:border-[#26333A]">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onClick()
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-[#007BA7] to-[#0093C7] hover:from-[#006F96] hover:to-[#007BA7] rounded-lg shadow-xs transition-all cursor-pointer group/btn"
                >
                  <span>View Details</span>
                  <ArrowUpRight size={16} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                </button>

                <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg text-[#64748B] dark:text-[#B8C2CC] hover:text-[#17212B] dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-[#181818] dark:hover:bg-[#26333A] border border-[#D9E2EA] dark:border-[#26333A] transition-all focus:outline-none focus:ring-2 focus:ring-[#007BA7]/50"
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
                      className="p-2 rounded-lg text-[#64748B] dark:text-[#B8C2CC] hover:text-[#007BA7] dark:hover:text-[#38BDF8] bg-slate-100 hover:bg-slate-200 dark:bg-[#181818] dark:hover:bg-[#26333A] border border-[#D9E2EA] dark:border-[#26333A] transition-all focus:outline-none focus:ring-2 focus:ring-[#007BA7]/50"
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
        </div>
      </div>
    </motion.article>
  )
}
import { motion, AnimatePresence } from 'framer-motion'
import { X, Github, ExternalLink } from 'lucide-react'
import { useEffect } from 'react'
import { ProjectBadge } from './ProjectBadge'
import { ProjectVisual } from './ProjectVisual'

export function ProjectModal({ project, isOpen, onClose }) {
  if (!project) return null

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-xs"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby={`project-title-${project.id}`}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-[#14191D] backdrop-blur-xl rounded-2xl border border-[#D9E2EA] dark:border-[#26333A] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-[#475569] hover:text-[#17212B] dark:bg-[#181818] dark:hover:bg-[#26333A] dark:text-[#B8C2CC] dark:hover:text-white transition-colors cursor-pointer focus-ring"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>

            <div className="grid lg:grid-cols-2 gap-6 p-6 sm:p-8">
              <div className="space-y-5">
                <div className="aspect-video rounded-xl overflow-hidden border border-[#D9E2EA] dark:border-[#26333A] bg-slate-100 dark:bg-[#12181C]">
                  <ProjectVisual
                    visualType={project.visualType}
                    image={project.image}
                    className="w-full h-full"
                    alt={`${project.title} project visual`}
                  />
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {project.technologies.map((tech, i) => (
                    <ProjectBadge
                      key={tech}
                      technology={tech}
                      tone={i % 2 === 0 ? 'cerulean' : 'rose'}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    {project.category && (
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        project.category === 'Data Analysis'
                          ? 'bg-[#FF2D95]/15 text-[#FF2D95] dark:text-[#FF66B2] border border-[#FF2D95]/30'
                          : 'bg-[#007BA7]/15 text-[#007BA7] dark:text-[#38BDF8] border border-[#007BA7]/30'
                      }`}>
                        {project.category}
                      </span>
                    )}
                    {project.subtitle && (
                      <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#64748B] dark:text-[#8B98A5]">
                        {project.subtitle}
                      </span>
                    )}
                  </div>
                  <h2
                    id={`project-title-${project.id}`}
                    className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl font-bold text-[#17212B] dark:text-[#F5F7FA]"
                  >
                    {project.title}
                  </h2>
                  {project.positioning && (
                    <p className="mt-1 text-xs sm:text-sm text-[#475569] dark:text-[#8B98A5] font-medium">
                      {project.positioning}
                    </p>
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-bold text-[#17212B] dark:text-[#F5F7FA] mb-2">
                    Overview
                  </h3>
                  <p className="text-[#475569] dark:text-[#B8C2CC] text-sm leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {project.keyPoints && project.keyPoints.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold text-[#17212B] dark:text-[#F5F7FA] mb-3">
                      Key Features
                    </h3>
                    <ul className="space-y-2">
                      {project.keyPoints.map((point, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-2.5 text-xs sm:text-sm text-[#475569] dark:text-[#B8C2CC]"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#007BA7] dark:bg-[#38BDF8] mt-1.5 shrink-0" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex flex-wrap gap-3 pt-4 border-t border-[#D9E2EA] dark:border-[#26333A]">
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-[#17212B] dark:bg-[#181818] dark:hover:bg-[#26333A] dark:text-[#F5F7FA] border border-[#D9E2EA] dark:border-[#26333A] rounded-lg transition-colors text-xs sm:text-sm font-semibold"
                      aria-label={`View ${project.title} on GitHub`}
                    >
                      <Github size={16} />
                      <span>GitHub</span>
                    </a>
                  )}
                  {project.liveDemo && (
                    <a
                      href={project.liveDemo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#007BA7] to-[#0093C7] hover:from-[#006F96] hover:to-[#007BA7] text-white rounded-lg transition-colors shadow-sm text-xs sm:text-sm font-semibold"
                      aria-label={`View live demo of ${project.title}`}
                    >
                      <ExternalLink size={16} />
                      <span>Live Demo</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

import { useState, useEffect } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Container } from '../components/ui/Container'
import { SectionHeading } from '../components/ui/SectionHeading'
import { SkillUniverse } from '../components/skills/SkillUniverse'
import { skillCategories } from '../data/skills'

const STORAGE_KEY = 'portfolio_skill_category'

export function Skills() {
  const [category, setCategory] = useState(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      const fromUrl = urlParams.get('skill_category') || urlParams.get('skillCategory')
      if (fromUrl && ['all', 'development', 'data analysis'].includes(fromUrl.toLowerCase())) {
        if (fromUrl.toLowerCase() === 'development') return 'Development'
        if (fromUrl.toLowerCase() === 'data analysis') return 'Data Analysis'
        return 'all'
      }
      const saved = sessionStorage.getItem(STORAGE_KEY)
      if (saved && ['all', 'Development', 'Data Analysis'].includes(saved)) {
        return saved
      }
    }
    return 'all'
  })

  const reduced = useReducedMotion()

  const handleCategoryChange = (catId) => {
    setCategory(catId)
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(STORAGE_KEY, catId)
      const url = new URL(window.location.href)
      if (catId === 'all') {
        url.searchParams.delete('skill_category')
      } else {
        url.searchParams.set('skill_category', catId)
      }
      window.history.replaceState({}, '', url.toString())
    }
  }

  return (
    <section id="skills" className="skills-section section-shell" aria-labelledby="skills-title">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: reduced ? 0 : 0.65 }}
          className="skills-intro"
        >
          <SectionHeading
            eyebrow="TECHNICAL EXPERTISE"
            title="Tools behind my work."
            description="Explore technical proficiencies spanning full-stack Python development and data analysis."
          />

          {/* Category Filter Tabs */}
          <div
            className="skill-filters inline-flex items-center p-1 bg-slate-100 dark:bg-[#14191D] rounded-xl border border-[#D9E2EA] dark:border-[#26333A] shadow-xs"
            role="tablist"
            aria-label="Filter skills by professional category"
          >
            {skillCategories.map((item) => {
              const isActive = category === item.id
              const isDataAnalysis = item.id === 'Data Analysis'

              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#007BA7] cursor-pointer ${
                    isActive
                      ? isDataAnalysis
                        ? 'bg-[#FF2D95] text-white shadow-md shadow-[#FF2D95]/25 font-bold'
                        : 'bg-[#007BA7] text-white shadow-md shadow-[#007BA7]/25 font-bold'
                      : 'text-[#475569] dark:text-[#B8C2CC] hover:text-[#17212B] dark:hover:text-[#F5F7FA] hover:bg-slate-200/60 dark:hover:bg-[#181818]'
                  }`}
                  onClick={() => handleCategoryChange(item.id)}
                >
                  {item.label}
                </button>
              )
            })}
          </div>
        </motion.div>

        <SkillUniverse category={category} />

        <p className="skills-hint">
          {category === 'all'
            ? 'Displaying all skills. Select Development or Data Analysis to focus on a discipline.'
            : `Displaying ${category} skills stored in database. Click any node to highlight.`}
        </p>
      </Container>
    </section>
  )
}

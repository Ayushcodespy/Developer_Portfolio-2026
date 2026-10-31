import { motion, useReducedMotion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Cpu, BarChart3, Code } from 'lucide-react'
import { skillsApi } from '../../services/api'
import { SkillNode } from './SkillNode'

export function SkillUniverse({ category }) {
  const reduced = useReducedMotion()
  const [selected, setSelected] = useState(null)
  const [skills, setSkills] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true

    const fetchSkills = async () => {
      try {
        setLoading(true)
        setError(null)
        const filterCat = category === 'all' ? undefined : category
        const data = await skillsApi.get(filterCat)

        if (!isMounted) return

        // Transform API data to match frontend structure
        const transformedSkills = (data || []).map((skill, index) => {
          const isDataAnalysisView = category === 'Data Analysis'
          const tone = getCategoryTone(skill.category, skill.name)
          const position = getPositionFromName(skill.name, isDataAnalysisView, index, data.length)

          return {
            id: skill.id,
            name: skill.name,
            category: skill.category,
            tone: tone,
            position: position.className || '',
            style: position.style || undefined,
          }
        })

        setSkills(transformedSkills)
      } catch (err) {
        if (!isMounted) return
        console.error('Failed to fetch skills:', err)
        setError('Failed to load skills from database.')
        setSkills([])
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchSkills()
    return () => {
      isMounted = false
    }
  }, [category])

  const getCategoryTone = (skillCategory, name) => {
    const n = (name || '').toLowerCase()
    if (skillCategory === 'Data Analysis' || n.includes('pandas') || n.includes('numpy') || n.includes('excel') || n.includes('power bi')) {
      return 'rose'
    }
    if (skillCategory === 'Development') {
      return 'blue'
    }
    const legacyToneMap = {
      languages: 'blue',
      frameworks: 'cyan',
      databases: 'violet',
      tools: 'blue',
      ai: 'cyan',
    }
    return legacyToneMap[skillCategory] || 'blue'
  }

  // Pre-mapped standard node coordinates in universe
  const standardPositions = {
    'Python': 'node-python',
    'SQL': 'node-sql',
    'JavaScript': 'node-javascript',
    'HTML/CSS': 'node-html',
    'Django': 'node-django',
    'FastAPI': 'node-fastapi',
    'Flask': 'node-flask',
    'ReactJS': 'node-react',
    'Pandas': 'node-pandas',
    'NumPy': 'node-numpy',
    'PostgreSQL': 'node-postgres',
    'MySQL': 'node-mysql',
    'SQLite': 'node-sqlite',
    'Git': 'node-git',
    'GitHub': 'node-github',
    'VS Code': 'node-vscode',
    'PyCharm': 'node-pycharm',
    'MS Excel': 'node-excel',
    'Microsoft Excel': 'node-excel',
    'Excel': 'node-excel',
    'Vercel': 'node-vercel',
    'ChatGPT': 'node-chatgpt',
    'OpenAI Codex': 'node-codex',
    'AI-assisted coding': 'node-assisted',
    'Debugging': 'node-debugging',
    'Refactoring': 'node-refactoring',
    'Documentation': 'node-docs',
    'Power BI': 'node-powerbi',
    'Matplotlib': 'node-matplotlib',
    'Seaborn': 'node-seaborn',
    'REST APIs': 'node-restapis',
  }

  // Distinct balanced layout when Data Analysis category is filtered
  const dataAnalysisSoloPositions = {
    'SQL': { top: '15%', left: '26%' },
    'Pandas': { top: '18%', right: '22%' },
    'NumPy': { top: '65%', right: '20%' },
    'MS Excel': { top: '68%', left: '22%' },
    'Microsoft Excel': { top: '68%', left: '22%' },
    'Excel': { top: '68%', left: '22%' },
    'Power BI': { top: '38%', right: '12%' },
    'Matplotlib': { top: '40%', left: '12%' },
    'Seaborn': { top: '82%', left: '46%' },
    'Python for Data Analysis': { top: '10%', left: '46%' },
  }

  const getPositionFromName = (name, isDataAnalysisView, index, totalCount) => {
    // If in Data Analysis view, use dedicated balanced spacing
    if (isDataAnalysisView && dataAnalysisSoloPositions[name]) {
      return { className: '', style: dataAnalysisSoloPositions[name] }
    }

    if (standardPositions[name]) {
      return { className: standardPositions[name] }
    }

    // Dynamic orbital placement for newly added custom skills
    const angle = (index / Math.max(totalCount, 1)) * 2 * Math.PI
    const radiusX = 36 // %
    const radiusY = 36 // %
    const top = Math.round(48 + radiusY * Math.sin(angle))
    const left = Math.round(48 + radiusX * Math.cos(angle))

    return {
      className: '',
      style: {
        top: `${Math.max(5, Math.min(85, top))}%`,
        left: `${Math.max(5, Math.min(85, left))}%`,
      },
    }
  }

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: reduced ? 0 : 0.4 }}
        className="skill-universe"
      >
        <div className="flex items-center justify-center h-full">
          <div className="flex items-center gap-3 text-slate-400">
            <div className="w-8 h-8 border-2 border-[#007BA7]/30 border-t-[#007BA7] rounded-full animate-spin" />
            <span className="text-xs sm:text-sm">Loading skills from database...</span>
          </div>
        </div>
      </motion.div>
    )
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: reduced ? 0 : 0.4 }}
        className="skill-universe"
      >
        <div className="flex flex-col items-center justify-center h-full text-center p-6">
          <p className="text-slate-400 text-sm mb-3">{error}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-[#007BA7] hover:bg-[#0093C7] rounded-lg transition-colors cursor-pointer"
          >
            Retry
          </button>
        </div>
      </motion.div>
    )
  }

  if (skills.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="skill-universe"
      >
        <div className="flex flex-col items-center justify-center h-full text-center p-6">
          <p className="text-slate-300 font-medium text-sm">
            No {category === 'all' ? '' : category} skills found in database.
          </p>
          <p className="text-slate-500 text-xs mt-1">
            You can add skills through the admin panel.
          </p>
        </div>
      </motion.div>
    )
  }

  const isDataAnalysisActive = category === 'Data Analysis'

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: reduced ? 0 : 0.65 }}
      className="skill-universe"
    >
      <svg className="skill-lines" viewBox="0 0 100 100" aria-hidden="true">
        <path d="M50 50 L16 19 M50 50 L83 20 M50 50 L89 48 M50 50 L75 81 M50 50 L24 80 M50 50 L10 51 M50 50 L50 8" />
      </svg>

      <div className={`developer-core ${isDataAnalysisActive ? 'border-[#FF2D95] shadow-[0_0_35px_rgba(255,45,149,0.3)]' : ''}`}>
        {isDataAnalysisActive ? (
          <BarChart3 size={23} className="text-[#FF2D95]" />
        ) : (
          <Cpu size={23} className="text-[#007BA7]" />
        )}
        <span>{isDataAnalysisActive ? 'DATA' : 'DEVELOPER'}</span>
        <strong>{isDataAnalysisActive ? 'ANALYTICS' : 'CORE'}</strong>
      </div>

      {skills.map((skill) => (
        <SkillNode
          key={skill.name}
          skill={skill}
          active={true}
          selected={selected === skill.name}
          onSelect={(name) => setSelected((current) => (current === name ? null : name))}
        />
      ))}
    </motion.div>
  )
}

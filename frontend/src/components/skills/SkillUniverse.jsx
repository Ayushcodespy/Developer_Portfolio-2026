import { motion, useReducedMotion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Cpu } from 'lucide-react'
import { skillsApi } from '../../services/api'
import { SkillNode } from './SkillNode'

export function SkillUniverse({ category }) {
  const reduced = useReducedMotion()
  const [selected, setSelected] = useState(null)
  const [skills, setSkills] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await skillsApi.get(category === 'all' ? undefined : category)
        // Transform API data to match frontend structure
        const transformedSkills = data.map(skill => ({
          name: skill.name,
          category: skill.category,
          tone: getCategoryTone(skill.category),
          position: getPositionFromName(skill.name)
        }))
        setSkills(transformedSkills)
      } catch (err) {
        console.error('Failed to fetch skills:', err)
        setError('Failed to load skills.')
        // Fallback to empty array if API fails
        setSkills([])
      } finally {
        setLoading(false)
      }
    }

    fetchSkills()
  }, [category])

  const getCategoryTone = (category) => {
    const toneMap = {
      'languages': 'blue',
      'frameworks': 'cyan',
      'databases': 'violet',
      'tools': 'blue',
      'ai': 'cyan'
    }
    return toneMap[category] || 'violet'
  }

  const getPositionFromName = (name) => {
    const positionMap = {
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
      'Vercel': 'node-vercel',
      'ChatGPT': 'node-chatgpt',
      'OpenAI Codex': 'node-codex',
      'AI-assisted coding': 'node-assisted',
      'Debugging': 'node-debugging',
      'Refactoring': 'node-refactoring',
      'Documentation': 'node-docs'
    }
    return positionMap[name] || 'node-default'
  }

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: .96 }} 
        whileInView={{ opacity: 1, scale: 1 }} 
        viewport={{ once: true, amount: .2 }} 
        transition={{ duration: reduced ? 0 : .65 }} 
        className="skill-universe"
      >
        <div className="flex items-center justify-center h-full">
          <div className="flex items-center gap-3 text-slate-400">
            <div className="w-8 h-8 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
            <span>Loading skills...</span>
          </div>
        </div>
      </motion.div>
    )
  }

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: .96 }} 
        whileInView={{ opacity: 1, scale: 1 }} 
        viewport={{ once: true, amount: .2 }} 
        transition={{ duration: reduced ? 0 : .65 }} 
        className="skill-universe"
      >
        <div className="flex items-center justify-center h-full">
          <p className="text-slate-400">{error}</p>
        </div>
      </motion.div>
    )
  }

  return <motion.div initial={{ opacity: 0, scale: .96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, amount: .2 }} transition={{ duration: reduced ? 0 : .65 }} className="skill-universe">
    <svg className="skill-lines" viewBox="0 0 100 100" aria-hidden="true"><path d="M50 50 L16 19 M50 50 L83 20 M50 50 L89 48 M50 50 L75 81 M50 50 L24 80 M50 50 L10 51 M50 50 L50 8" /></svg>
    <div className="developer-core"><Cpu size={23} /><span>DEVELOPER</span><strong>CORE</strong></div>
    {skills.map((skill) => <SkillNode key={skill.name} skill={skill} active={true} selected={selected === skill.name} onSelect={(name) => setSelected((current) => current === name ? null : name)} />)}
  </motion.div>
}

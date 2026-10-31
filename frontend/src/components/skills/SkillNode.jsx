import { motion, useReducedMotion } from 'framer-motion'
import { Braces, Code2, Database, GitBranch, WandSparkles, BarChart2, Cpu, LineChart } from 'lucide-react'

function getSkillIcon(skill) {
  const name = (skill.name || '').toLowerCase()
  if (name.includes('sql') || name.includes('postgres') || name.includes('mysql') || name.includes('sqlite') || name.includes('database')) {
    return Database
  }
  if (name.includes('git')) {
    return GitBranch
  }
  if (name.includes('pandas') || name.includes('numpy') || name.includes('excel') || name.includes('power bi') || name.includes('chart') || name.includes('matplotlib') || name.includes('seaborn')) {
    return BarChart2
  }
  if (name.includes('data')) {
    return LineChart
  }
  if (skill.category === 'Data Analysis') {
    return BarChart2
  }
  if (skill.category === 'Development') {
    return Code2
  }
  const legacyIcons = {
    languages: Braces,
    frameworks: Code2,
    databases: Database,
    tools: GitBranch,
    ai: WandSparkles,
  }
  return legacyIcons[skill.category] || Code2 || Cpu
}

export function SkillNode({ skill, active = true, selected, onSelect }) {
  const Icon = getSkillIcon(skill)
  const reduced = useReducedMotion()

  return (
    <motion.button
      type="button"
      title={skill.name}
      aria-label={`${skill.name}, ${skill.category}`}
      aria-pressed={selected}
      onClick={() => onSelect(skill.name)}
      style={skill.style || undefined}
      className={`skill-node ${skill.position || 'node-default'} skill-${skill.tone || 'blue'} ${
        active ? 'is-active' : 'is-muted'
      } ${selected ? 'is-selected' : ''}`}
      animate={reduced ? undefined : { y: [0, -5, 0] }}
      transition={{
        duration: 3.4,
        delay: (skill.name?.length || 1) * 0.04,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      whileHover={reduced ? undefined : { scale: 1.08, rotate: -2 }}
      whileFocus={{ scale: 1.06 }}
    >
      <Icon size={15} />
      <span>{skill.name}</span>
    </motion.button>
  )
}

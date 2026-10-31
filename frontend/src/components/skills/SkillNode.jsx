import { motion, useReducedMotion } from 'framer-motion'
import { Braces, Code2, Database, GitBranch, WandSparkles } from 'lucide-react'

const icons = { languages: Braces, frameworks: Code2, databases: Database, tools: GitBranch, ai: WandSparkles }
export function SkillNode({ skill, active, selected, onSelect }) {
  const Icon = icons[skill.category]; const reduced = useReducedMotion()
  return <motion.button type="button" title={skill.name} aria-label={`${skill.name}, ${skill.category}`} aria-pressed={selected} onClick={() => onSelect(skill.name)} className={`skill-node ${skill.position} skill-${skill.tone} ${active ? 'is-active' : 'is-muted'} ${selected ? 'is-selected' : ''}`} animate={reduced ? undefined : { y: [0, -5, 0] }} transition={{ duration: 3.4, delay: skill.name.length * .04, repeat: Infinity, ease: 'easeInOut' }} whileHover={reduced ? undefined : { scale: 1.08, rotate: -2 }} whileFocus={{ scale: 1.06 }}><Icon size={15} /><span>{skill.name}</span></motion.button>
}

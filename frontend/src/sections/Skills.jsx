import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Container } from '../components/ui/Container'
import { SectionHeading } from '../components/ui/SectionHeading'
import { SkillUniverse } from '../components/skills/SkillUniverse'
import { skillCategories } from '../data/skills'

export function Skills() {
  const [category, setCategory] = useState('all'); const reduced = useReducedMotion()
  return <section id="skills" className="skills-section section-shell" aria-labelledby="skills-title"><Container><motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .2 }} transition={{ duration: reduced ? 0 : .65 }} className="skills-intro"><SectionHeading eyebrow="WHAT I WORK WITH" title="Tools behind my work." description="A focused toolkit for building, debugging, and improving reliable software." /><div className="skill-filters" role="tablist" aria-label="Skill categories">{skillCategories.map((item) => <button key={item.id} type="button" role="tab" aria-selected={category === item.id} className={`focus-ring ${category === item.id ? 'is-selected' : ''}`} onClick={() => setCategory(item.id)}>{item.label}</button>)}</div></motion.div><SkillUniverse category={category} /><p className="skills-hint">Select a category to bring its nodes into focus.</p></Container></section>
}

import { motion, useReducedMotion } from 'framer-motion'
import { GraduationCap, MapPin } from 'lucide-react'
import { about } from '../../data/about'

export function AboutInfo() {
  const reduced = useReducedMotion(); const info = about.education
  return <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: .25 }} variants={{ visible: { transition: { staggerChildren: reduced ? 0 : .08 } } }} className="about-info-grid">
    <motion.article variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0 } }} className="about-education"><GraduationCap size={21} /><div><p className="about-kicker">{info.degree}</p><h3>{info.discipline}</h3><p>{info.institution}</p><p className="about-muted"><MapPin size={13} /> {info.location}</p></div><div className="about-education-meta"><span>{info.period}</span><strong>CGPA <em>{info.cgpa}</em></strong></div></motion.article>
    <div className="about-focus-list">{about.focusAreas.map((area, index) => <motion.span key={area} variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}><i>{String(index + 1).padStart(2, '0')}</i>{area}</motion.span>)}</div>
  </motion.div>
}

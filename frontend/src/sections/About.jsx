import { motion, useReducedMotion } from 'framer-motion'
import { AboutInfo } from '../components/about/AboutInfo'
import { AboutVisual } from '../components/about/AboutVisual'
import { Container } from '../components/ui/Container'
import { SectionHeading } from '../components/ui/SectionHeading'
import { about } from '../data/about'

export function About() {
  const reduced = useReducedMotion()
  return <section id="about" className="about-section section-shell" aria-labelledby="about-title"><Container><div className="grid items-center gap-12 lg:grid-cols-[1fr_.92fr] lg:gap-20"><div><motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .25 }} transition={{ duration: reduced ? 0 : .65 }}><SectionHeading eyebrow="WHO AM I?" title="Building software with purpose." /></motion.div><motion.p initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .25 }} transition={{ duration: reduced ? 0 : .65, delay: reduced ? 0 : .12 }} className="about-summary">{about.summary}</motion.p><AboutInfo /></div><AboutVisual /></div></Container></section>
}

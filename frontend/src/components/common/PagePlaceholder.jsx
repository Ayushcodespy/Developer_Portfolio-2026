import { Container } from '../ui/Container'
import { GlassCard } from '../ui/GlassCard'
import { SectionHeading } from '../ui/SectionHeading'

export function PagePlaceholder({ title, eyebrow = 'Phase 1 foundation' }) {
  return <main className="py-24 sm:py-32"><Container><GlassCard><SectionHeading eyebrow={eyebrow} title={title} /><p className="mt-5 max-w-xl text-slate-300">This route is ready for its dedicated portfolio section in a later phase.</p></GlassCard></Container></main>
}

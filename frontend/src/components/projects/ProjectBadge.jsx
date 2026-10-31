export function ProjectBadge({ technology, tone = 'cerulean' }) {
  const toneClasses = {
    cerulean: 'bg-[#007BA7]/12 text-[#007BA7] dark:text-[#38BDF8] border-[#007BA7]/30',
    rose: 'bg-[#FF2D95]/12 text-[#D81B78] dark:text-[#FF66B2] border-[#FF2D95]/30',
    blue: 'bg-[#007BA7]/12 text-[#007BA7] dark:text-[#38BDF8] border-[#007BA7]/30',
    cyan: 'bg-[#007BA7]/12 text-[#007BA7] dark:text-[#38BDF8] border-[#007BA7]/30',
    violet: 'bg-[#FF2D95]/12 text-[#D81B78] dark:text-[#FF66B2] border-[#FF2D95]/30',
    green: 'bg-emerald-500/12 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full border backdrop-blur-xs ${toneClasses[tone] || toneClasses.cerulean}`}>
      {technology}
    </span>
  )
}

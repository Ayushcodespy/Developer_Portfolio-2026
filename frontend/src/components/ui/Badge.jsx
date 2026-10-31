export function Badge({ children, className = '', tone = 'cerulean' }) {
  const toneClasses = {
    cerulean: 'border-[#007BA7]/30 bg-[#007BA7]/12 text-[#007BA7] dark:text-[#38BDF8]',
    rose: 'border-[#FF2D95]/30 bg-[#FF2D95]/12 text-[#D81B78] dark:text-[#FF66B2]',
  }
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium backdrop-blur-xs ${
        toneClasses[tone] || toneClasses.cerulean
      } ${className}`}
    >
      {children}
    </span>
  )
}

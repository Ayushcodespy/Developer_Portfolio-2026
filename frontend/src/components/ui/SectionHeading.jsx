export function SectionHeading({ eyebrow, title, description, align = 'left' }) {
  const alignClass = align === 'center' ? 'text-center mx-auto' : 'text-left'
  return (
    <header className={alignClass}>
      {eyebrow && (
        <p className="mb-2.5 text-xs font-bold uppercase tracking-[0.22em] text-[#007BA7] dark:text-[#38BDF8]">
          {eyebrow}
        </p>
      )}
      <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#17212B] dark:text-[#F5F7FA]">
        {title}
      </h2>
      {description && (
        <p className={`mt-3 max-w-2xl text-sm sm:text-base text-[#475569] dark:text-[#B8C2CC] leading-relaxed ${align === 'center' ? 'mx-auto' : ''}`}>
          {description}
        </p>
      )}
    </header>
  )
}

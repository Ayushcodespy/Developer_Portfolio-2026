export function IconButton({ label, children, className = '', ...props }) {
  return (
    <button
      aria-label={label}
      className={`focus-ring inline-flex size-10 items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--color-bg-card)] text-[var(--color-text-primary)] transition hover:text-[var(--color-cerulean)] hover:border-[var(--color-cerulean)]/40 hover:bg-[var(--color-bg-secondary)] shadow-2xs cursor-pointer ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

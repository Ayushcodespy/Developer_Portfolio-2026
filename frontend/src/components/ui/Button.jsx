export function Button({ children, className = '', variant = 'primary', ...props }) {
  const variants = { primary: 'bg-[var(--gradient-accent)] text-white hover:brightness-110', secondary: 'border border-[var(--border-subtle)] bg-white/5 text-white hover:bg-white/10' }
  return <button className={`focus-ring inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold transition ${variants[variant]} ${className}`} {...props}>{children}</button>
}

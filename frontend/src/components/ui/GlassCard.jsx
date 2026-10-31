export function GlassCard({ children, className = '' }) {
  return <section className={`glass-panel rounded-2xl p-6 sm:p-8 ${className}`}>{children}</section>
}

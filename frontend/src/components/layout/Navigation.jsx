import { AnimatePresence, motion } from 'framer-motion'
import { Menu, MoonStar, SunMedium, X } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react'
import { IconButton } from '../ui/IconButton'
import { useTheme } from '../../hooks/useTheme'

const links = [
  ['Home', '/'],
  ['About', '/about'],
  ['Skills', '/skills'],
  ['Projects', '/projects'],
  ['Experience', '/experience'],
  ['Education', '/education'],
  ['Certificates', '/certificates'],
  ['Contact', '/contact'],
]

export function Navigation() {
  const { pathname } = useLocation()
  const { theme, toggleTheme } = useTheme()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 12)
    handler()
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => setOpen(false), [pathname])

  // Handle keyboard navigation for mobile menu
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && open) {
        setOpen(false)
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [open])

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false)
      }
    }

    if (open) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  const isLight = theme === 'light'

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6">
      <nav
        className={`mx-auto flex max-w-7xl items-center justify-between rounded-2xl border px-3 py-2.5 transition duration-500 ${
          scrolled
            ? 'nav-scrolled border-[var(--border-subtle)] bg-[var(--nav-surface)] shadow-[0_12px_40px_rgba(0,0,0,.2)] backdrop-blur-xl'
            : 'border-transparent bg-transparent'
        }`}
        aria-label="Primary navigation"
      >
        {/* AP Logo linking to Admin Login */}
        <Link
          to="/admin/login"
          className="focus-ring ap-logo-link grid size-10 place-items-center rounded-xl border border-[var(--border-subtle)] bg-[var(--color-bg-card)] font-[family-name:var(--font-display)] text-sm font-bold tracking-tight text-[var(--color-text-primary)] transition hover:border-[var(--color-cerulean)] hover:text-[var(--color-cerulean)] shadow-2xs"
          aria-label="Open admin login"
          title="Admin Login"
        >
          AP
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden items-center gap-0.5 lg:flex">
          {links.map(([label, to]) => (
            <Link
              key={to}
              className={`focus-ring relative rounded-lg px-2.5 py-2 text-xs font-medium transition ${
                pathname === to
                  ? 'text-[var(--color-text-primary)] font-semibold'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
              }`}
              to={to}
            >
              {label}
              {pathname === to && (
                <motion.span
                  layoutId="active-nav"
                  className="absolute inset-x-2.5 -bottom-0.5 h-0.5 bg-[var(--color-cerulean)] shadow-[0_0_8px_rgba(0,123,167,0.5)]"
                />
              )}
            </Link>
          ))}
        </div>

        {/* Actions (Theme toggle + Mobile menu button) */}
        <div className="flex items-center gap-2">
          <IconButton
            label={isLight ? 'Switch to dark theme' : 'Switch to light theme'}
            onClick={toggleTheme}
            title={isLight ? 'Switch to dark theme' : 'Switch to light theme'}
          >
            {isLight ? (
              <MoonStar size={17} className="text-[#007BA7]" />
            ) : (
              <SunMedium size={17} className="text-amber-400" />
            )}
          </IconButton>

          <IconButton
            label={open ? 'Close navigation' : 'Open navigation'}
            className="lg:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            {open ? <X size={19} /> : <Menu size={19} />}
          </IconButton>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass-panel mx-auto mt-2 max-w-7xl rounded-2xl p-3 lg:hidden"
            id="mobile-menu"
            role="menu"
          >
            <div className="grid grid-cols-2 gap-1.5">
              {links.map(([label, to]) => (
                <Link
                  key={to}
                  className={`focus-ring rounded-lg px-3 py-3 text-sm transition ${
                    pathname === to
                      ? 'bg-[#007BA7]/15 text-[#007BA7] dark:text-[#38BDF8] font-semibold border border-[#007BA7]/30'
                      : 'text-[var(--color-text-muted)] hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-text-primary)]'
                  }`}
                  to={to}
                  role="menuitem"
                  onClick={() => setOpen(false)}
                >
                  {label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

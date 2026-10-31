import { motion, useReducedMotion } from 'framer-motion'
import { Github, Linkedin, Mail, ArrowUp } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { personal } from '../../data/personal'

const reveal = { hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } }

const quickLinks = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Skills', to: '/skills' },
  { label: 'Projects', to: '/projects' },
  { label: 'Experience', to: '/experience' },
  { label: 'Education', to: '/education' },
  { label: 'Contact', to: '/contact' },
]

const socialLinks = [
  { label: 'GitHub', href: personal.github, icon: Github },
  { label: 'LinkedIn', href: personal.linkedin, icon: Linkedin },
  { label: 'Email', href: `mailto:${personal.email}`, icon: Mail },
]

export function Footer() {
  const reduced = useReducedMotion()
  const transition = (delay) => ({ duration: reduced ? 0 : 0.62, delay: reduced ? 0 : delay, ease: [0.22, 1, 0.36, 1] })
  const [isVisible, setIsVisible] = useState(false)

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  return (
    <footer className="footer-section relative overflow-hidden border-t border-[#D9E2EA] dark:border-[#26333A] bg-[#EDF2F7] dark:bg-[#0A0A0A]">
      {/* Footer visual elements */}
      <div className="footer-grid absolute inset-0 opacity-20 pointer-events-none" />
      <div className="footer-glow absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[200px] bg-gradient-to-t from-[#007BA7]/10 via-[#FF2D95]/5 to-transparent pointer-events-none" />

      <div className="relative px-4 sm:px-6 lg:px-8 py-12">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={{ visible: { transition: { staggerChildren: reduced ? 0 : 0.1 } } }}
            className="grid gap-8 lg:grid-cols-2 lg:gap-12"
          >
            {/* Left: Brand */}
            <motion.div variants={reveal} transition={transition(0.05)} className="space-y-3">
              <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight text-[#17212B] dark:text-[#F5F7FA]">
                AYUSH PATEL
              </h2>
              <p className="text-sm text-[#475569] dark:text-[#B8C2CC]">
                Python Developer | Data Analytics
              </p>
              <p className="text-xs text-[#64748B] dark:text-[#8B98A5] max-w-md">
                Building scalable backend systems, data pipelines, and responsive web applications with precision and modern engineering best practices.
              </p>
            </motion.div>

            {/* Right: Quick Links & Social */}
            <motion.div variants={reveal} transition={transition(0.15)} className="space-y-6">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#17212B] dark:text-[#F5F7FA] mb-3">
                  Quick Links
                </h3>
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  {quickLinks.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      className="text-sm font-medium text-[#475569] dark:text-[#B8C2CC] hover:text-[#007BA7] dark:hover:text-[#38BDF8] transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#17212B] dark:text-[#F5F7FA] mb-3">
                  Connect
                </h3>
                <div className="flex gap-3">
                  {socialLinks.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target={social.label === 'Email' ? undefined : '_blank'}
                      rel="noreferrer"
                      aria-label={social.label}
                      className="w-10 h-10 rounded-xl border border-[#D9E2EA] dark:border-[#26333A] bg-white dark:bg-[#14191D] flex items-center justify-center text-[#475569] dark:text-[#B8C2CC] hover:text-[#007BA7] dark:hover:text-[#38BDF8] hover:border-[#007BA7]/50 shadow-2xs transition-all"
                    >
                      <social.icon size={18} />
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Bottom: Copyright */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: reduced ? 0 : 0.62, delay: reduced ? 0 : 0.3 }}
            className="mt-12 pt-8 border-t border-[#D9E2EA] dark:border-[#26333A] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left"
          >
            <p className="text-xs text-[#64748B] dark:text-[#8B98A5]">
              &copy; {new Date().getFullYear()} Ayush Patel. All rights reserved.
            </p>
            <p className="text-xs text-[#64748B] dark:text-[#8B98A5]">
              Designed with Jet Black, Cerulean Blue &amp; Neon Rose.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        aria-label="Back to top"
        className={`fixed bottom-6 right-6 w-11 h-11 rounded-full bg-gradient-to-br from-[#007BA7] to-[#FF2D95] text-white shadow-[0_6px_20px_rgba(0,123,167,0.35)] flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-[0_8px_25px_rgba(0,123,167,0.5)] focus:outline-none focus:ring-2 focus:ring-[#007BA7] focus:ring-offset-2 z-40 cursor-pointer ${
          isVisible ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-4'
        }`}
      >
        <ArrowUp size={18} />
      </button>
    </footer>
  )
}

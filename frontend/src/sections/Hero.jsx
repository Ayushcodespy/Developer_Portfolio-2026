import { useState, useEffect } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import {
  ArrowDown,
  ArrowUpRight,
  Download,
  Github,
  Linkedin,
  Mail,
  Code2,
  Briefcase,
  Layers,
  Award,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { Container } from '../components/ui/Container'
import { HeroVisual } from '../components/common/HeroVisual'
import { settingsApi } from '../services/api'

const DEFAULT_RESUME_URL = 'https://drive.google.com/file/d/138oZq3lHvm-3PsaHVz7hmR0SrOmvs_1G/view?usp=sharing'

const reveal = { hidden: { opacity: 0, y: 18, filter: 'blur(8px)' }, visible: { opacity: 1, y: 0, filter: 'blur(0px)' } }

const stats = [
  { value: '3+', label: 'Major Projects', icon: Code2, tone: 'cerulean' },
  { value: '1', label: 'Internship', icon: Briefcase, tone: 'rose' },
  { value: '10+', label: 'Technologies', icon: Layers, tone: 'cerulean' },
  { value: '6+', label: 'Certifications / Achievements', icon: Award, tone: 'rose' },
]

const toneClasses = {
  cerulean: 'bg-[#007BA7]/15 text-[#007BA7] dark:text-[#38BDF8] border border-[#007BA7]/30',
  rose: 'bg-[#FF2D95]/15 text-[#D81B78] dark:text-[#FF66B2] border border-[#FF2D95]/30',
}

const social = [
  { label: 'GitHub', href: 'https://github.com/Ayushcodespy', icon: Github },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/ayushcodespy', icon: Linkedin },
  { label: 'Email', href: 'mailto:ayush.jnv54@gmail.com', icon: Mail },
]

export function Hero() {
  const reduced = useReducedMotion()
  const transition = (delay) => ({ duration: reduced ? 0 : 0.62, delay: reduced ? 0 : delay, ease: [0.22, 1, 0.36, 1] })

  const [resumeUrl, setResumeUrl] = useState(DEFAULT_RESUME_URL)

  useEffect(() => {
    let mounted = true
    settingsApi
      .getResume()
      .then((data) => {
        if (mounted && data?.resume_url) {
          setResumeUrl(data.resume_url)
        }
      })
      .catch((err) => {
        console.warn('Could not load dynamic resume link, using default:', err)
      })
    return () => {
      mounted = false
    }
  }, [])

  const scrollToAbout = () => {
    const aboutSection = document.getElementById('about')
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <main className="hero-shell relative isolate min-h-[100svh] overflow-hidden pt-20">
      <div className="hero-grid" />
      <div className="hero-orb hero-orb-one" />
      <div className="hero-orb hero-orb-two" />

      <Container className="relative flex min-h-[calc(100svh-5rem)] flex-col justify-between pt-12 lg:pt-16 pb-6">
        <div className="grid flex-1 items-center gap-6 lg:grid-cols-[.92fr_1.08fr] lg:gap-0">
          <motion.div
            initial="hidden"
            animate="visible"
            className="relative z-10 max-w-2xl pb-4 lg:pb-12"
            variants={{ visible: { transition: { staggerChildren: reduced ? 0 : 0.1 } } }}
          >
            {/* Desktop Fixed Left Social Bar */}
            <div className="absolute -left-14 top-1/2 hidden -translate-y-1/2 flex-col gap-3 xl:flex">
              {social.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target={label === 'Email' ? undefined : '_blank'}
                  rel="noreferrer"
                  aria-label={label}
                  className="social-link focus-ring group"
                  data-tooltip={label}
                >
                  <Icon size={17} />
                </a>
              ))}
            </div>

            <motion.p
              variants={reveal}
              transition={transition(0.05)}
              className="mb-4 text-xs font-bold tracking-[0.28em] text-[#007BA7] dark:text-[#38BDF8]"
            >
              HELLO, I'M
            </motion.p>

            <motion.h1
              variants={reveal}
              transition={transition(0.12)}
              className="font-[family-name:var(--font-display)] text-[clamp(3.25rem,7.2vw,7.25rem)] font-extrabold leading-[.88] tracking-[-.075em] text-[#17212B] dark:text-white"
            >
              AYUSH{' '}
              <span className="bg-gradient-to-r from-[#007BA7] via-[#00A6DB] to-[#FF2D95] dark:from-[#007BA7] dark:via-[#38BDF8] dark:to-[#FF2D95] bg-clip-text text-transparent">
                PATEL
              </span>
            </motion.h1>

            <motion.div variants={reveal} transition={transition(0.22)} className="mt-7">
              <p className="font-[family-name:var(--font-display)] text-xl font-semibold text-[#17212B] dark:text-[#F5F7FA] sm:text-2xl">
                Python Developer &amp; Data Analyst
              </p>
              <p className="mt-2 text-sm font-semibold tracking-wide text-[#007BA7] dark:text-[#38BDF8] sm:text-base">
                Data-Driven Applications{' '}
                <span className="px-1.5 text-[#D81B78] dark:text-[#FF2D95]">|</span>
                Backend Development{' '}
                <span className="px-1.5 text-[#D81B78] dark:text-[#FF2D95]">|</span>
                SQL
              </p>
            </motion.div>

            <motion.p
              variants={reveal}
              transition={transition(0.32)}
              className="mt-6 max-w-lg text-base leading-7 text-[#475569] dark:text-[#B8C2CC]"
            >
              I build scalable, efficient and user-focused applications with modern technologies.
            </motion.p>

            <motion.div variants={reveal} transition={transition(0.42)} className="mt-8 flex flex-wrap gap-3">
              <Link to="/projects" className="hero-button hero-button-primary focus-ring">
                Explore My Work <ArrowUpRight size={17} />
              </Link>
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hero-button hero-button-secondary focus-ring"
              >
                Download Resume <Download size={16} />
              </a>
            </motion.div>

            <motion.div variants={reveal} transition={transition(0.5)} className="mt-8 flex gap-3 xl:hidden">
              {social.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target={label === 'Email' ? undefined : '_blank'}
                  rel="noreferrer"
                  aria-label={label}
                  className="social-link focus-ring"
                >
                  <Icon size={17} />
                </a>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94, x: reduced ? 0 : 25 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={transition(0.36)}
            className="relative z-0 lg:-ml-20"
          >
            <HeroVisual />
          </motion.div>
        </div>

        {/* Stats Cards Row (Theme-aware, no pure white in dark mode) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={transition(0.7)}
          className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 my-6"
        >
          {stats.map(({ value, label, icon: Icon, tone }) => (
            <div
              key={label}
              className="flex items-center gap-3.5 px-4 py-3.5 rounded-2xl bg-white dark:bg-[#14191D] border border-[#D9E2EA] dark:border-[#26333A] shadow-xs backdrop-blur-md transition-all hover:border-[#007BA7]/40 dark:hover:border-[#007BA7]/50"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${toneClasses[tone]}`}>
                <Icon size={18} />
              </div>
              <div className="min-w-0">
                <strong className="block font-[family-name:var(--font-display)] text-xl font-bold text-[#17212B] dark:text-[#F5F7FA] leading-tight">
                  {value}
                </strong>
                <span className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#64748B] dark:text-[#8B98A5] truncate">
                  {label}
                </span>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Scroll to Explore (Placed cleanly in flow below stats to never overlap) */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduced ? 0 : 0.8, delay: reduced ? 0 : 0.8 }}
          className="relative z-10 flex justify-center pt-1 pb-2"
        >
          <button
            type="button"
            onClick={scrollToAbout}
            className="inline-flex flex-col items-center gap-1.5 text-[#64748B] dark:text-[#8B98A5] hover:text-[#007BA7] dark:hover:text-[#38BDF8] transition-colors group focus:outline-none focus:ring-2 focus:ring-[#007BA7] focus:ring-offset-2 rounded-lg cursor-pointer"
            aria-label="Scroll to explore more"
          >
            <span className="text-[10px] font-semibold tracking-[0.2em] uppercase">Scroll to Explore</span>
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: reduced ? 0 : 2, repeat: Infinity, ease: 'easeInOut' }}
              className="p-1.5 rounded-full border border-[#D9E2EA] dark:border-[#26333A] bg-white/90 dark:bg-[#14191D] group-hover:border-[#007BA7]/50 transition-all shadow-2xs"
            >
              <ArrowDown size={13} />
            </motion.div>
          </button>
        </motion.div>
      </Container>
    </main>
  )
}

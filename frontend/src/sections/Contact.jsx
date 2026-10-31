import { motion, useReducedMotion } from 'framer-motion'
import {
  Mail,
  Linkedin,
  Github,
  Send,
  ArrowUpRight,
  User,
  Tag,
  MessageSquare,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'
import { useState } from 'react'
import { Container } from '../components/ui/Container'
import { SectionHeading } from '../components/ui/SectionHeading'
import { FuturisticNetworkVisual } from '../components/contact/FuturisticNetworkVisual'
import { personal } from '../data/personal'
import { contactApi } from '../services/api'

const reveal = { hidden: { opacity: 0, y: 18, filter: 'blur(8px)' }, visible: { opacity: 1, y: 0, filter: 'blur(0px)' } }

const contactMethods = [
  { label: 'Email', value: personal.email, href: `mailto:${personal.email}`, icon: Mail },
  { label: 'LinkedIn', value: 'linkedin.com/in/ayushcodespy', href: personal.linkedin, icon: Linkedin },
  { label: 'GitHub', value: 'github.com/Ayushcodespy', href: personal.github, icon: Github },
]

export function Contact() {
  const reduced = useReducedMotion()
  const transition = (delay) => ({ duration: reduced ? 0 : 0.62, delay: reduced ? 0 : delay, ease: [0.22, 1, 0.36, 1] })

  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState('idle') // idle, success, error

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      await contactApi.post({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
      })

      setIsSubmitting(false)
      setSubmitStatus('success')
      setFormData({ name: '', email: '', subject: '', message: '' })

      setTimeout(() => setSubmitStatus('idle'), 6000)
    } catch (error) {
      setIsSubmitting(false)
      setSubmitStatus('error')
      console.error('Contact form submission failed:', error)
      setTimeout(() => setSubmitStatus('idle'), 6000)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  return (
    <section
      id="contact"
      className="contact-section section-shell relative overflow-hidden scroll-mt-24 sm:scroll-mt-28"
    >
      <div className="contact-grid" />
      <div className="contact-orb contact-orb-one" />
      <div className="contact-orb contact-orb-two" />

      <Container className="relative">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={{ visible: { transition: { staggerChildren: reduced ? 0 : 0.1 } } }}
        >
          {/* Section Heading matching Option 2 */}
          <motion.div variants={reveal} transition={transition(0.05)}>
            <SectionHeading
              eyebrow="LET'S CONNECT"
              title={
                <>
                  Let's Build Something{' '}
                  <span className="bg-gradient-to-r from-[#00A6DB] via-[#38BDF8] to-[#FF2D95] bg-clip-text text-transparent">
                    Meaningful.
                  </span>
                </>
              }
              description="I'm open to software development opportunities, collaborations, and interesting projects."
            />
          </motion.div>

          {/* Option 2: Split Layout (Left: Info & Illustration, Right: Contact Form) */}
          <div className="mt-10 sm:mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Left Column: Contact Cards + Futuristic Illustration */}
            <motion.div
              variants={reveal}
              transition={transition(0.15)}
              className="lg:col-span-7"
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                {/* Contact Information Cards & Availability */}
                <div className="md:col-span-6 space-y-3.5">
                  {contactMethods.map((method) => {
                    const IconComponent = method.icon
                    return (
                      <a
                        key={method.label}
                        href={method.href}
                        target={method.label === 'Email' ? undefined : '_blank'}
                        rel="noreferrer"
                        className="contact-card group flex items-center gap-3.5 p-3.5 sm:p-4 rounded-xl border border-[#D9E2EA] dark:border-[#26333A] bg-white/80 dark:bg-[#12161A]/90 hover:border-[#007BA7]/60 dark:hover:border-[#00A6DB]/60 shadow-sm hover:shadow-[0_8px_24px_rgba(0,123,167,0.15)] transition-all duration-300"
                      >
                        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#007BA7]/10 dark:bg-[#007BA7]/20 border border-[#007BA7]/30 dark:border-[#00A6DB]/40 flex items-center justify-center text-[#007BA7] dark:text-[#38BDF8] group-hover:scale-105 group-hover:border-[#00A6DB] transition-all">
                          <IconComponent size={18} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-[#17212B] dark:text-[#F5F7FA]">
                            {method.label}
                          </p>
                          <p className="text-xs text-[#64748B] dark:text-[#8B98A5] truncate">
                            {method.value}
                          </p>
                        </div>
                        <ArrowUpRight
                          size={16}
                          className="text-[#64748B] dark:text-[#8B98A5] group-hover:text-[#007BA7] dark:group-hover:text-[#38BDF8] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                        />
                      </a>
                    )
                  })}

                  {/* Open to Opportunities Pill */}
                  <div className="p-3.5 sm:p-4 rounded-xl border border-emerald-500/25 bg-emerald-500/5 dark:bg-emerald-500/10 backdrop-blur-sm">
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-2.5 w-2.5">
                        {!reduced && (
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        )}
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                      </span>
                      <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                        Open to Opportunities
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] sm:text-xs text-[#64748B] dark:text-[#8B98A5] leading-relaxed">
                      Currently looking for opportunities in Software Development &amp; Data Analysis.
                    </p>
                  </div>
                </div>

                {/* Futuristic Interactive Illustration */}
                <div className="md:col-span-6 flex justify-center items-center">
                  <FuturisticNetworkVisual />
                </div>
              </div>
            </motion.div>

            {/* Right Column: Contact Form */}
            <motion.div
              variants={reveal}
              transition={transition(0.25)}
              className="lg:col-span-5"
            >
              <div className="relative rounded-2xl bg-white/95 dark:bg-[#12161A]/95 backdrop-blur-xl border border-[#D9E2EA] dark:border-[#26333A] p-6 sm:p-7 shadow-xl shadow-black/10 dark:shadow-black/40 overflow-hidden">
                {/* Decorative corner glows */}
                <div
                  className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-gradient-to-br from-[#FF2D95]/15 to-[#007BA7]/10 blur-2xl pointer-events-none"
                  aria-hidden="true"
                />
                <div
                  className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full bg-gradient-to-tr from-[#007BA7]/15 to-transparent blur-2xl pointer-events-none"
                  aria-hidden="true"
                />

                <div className="relative z-10">
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[#17212B] dark:text-[#F5F7FA]">
                    Get In Touch
                  </h3>
                  <p className="mt-1.5 text-xs sm:text-sm text-[#64748B] dark:text-[#8B98A5] leading-relaxed">
                    Have a project in mind or want to work together? Drop me a message.
                  </p>

                  <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
                    {/* Name */}
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-xs font-semibold text-[#17212B] dark:text-[#CBD5E1] mb-1.5"
                      >
                        Name <span className="text-[#FF2D95]">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748B] dark:text-[#8B98A5]">
                          <User size={16} />
                        </div>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-3.5 py-2.5 sm:py-3 rounded-xl bg-slate-50 dark:bg-[#0E1317] border ${
                            errors.name ? 'border-rose-500 ring-1 ring-rose-500/20' : 'border-[#D9E2EA] dark:border-[#26333A]'
                          } text-sm text-[#17212B] dark:text-[#F5F7FA] placeholder-[#94A3B8] dark:placeholder-[#64748B] focus:outline-none focus:border-[#007BA7] dark:focus:border-[#00A6DB] focus:ring-2 focus:ring-[#007BA7]/20 transition-all`}
                          placeholder="Your name"
                          aria-invalid={errors.name ? 'true' : 'false'}
                          aria-describedby={errors.name ? 'name-error' : undefined}
                        />
                      </div>
                      {errors.name && (
                        <p id="name-error" className="mt-1 text-xs text-rose-500 font-medium flex items-center gap-1">
                          <AlertCircle size={12} /> {errors.name}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-xs font-semibold text-[#17212B] dark:text-[#CBD5E1] mb-1.5"
                      >
                        Email <span className="text-[#FF2D95]">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748B] dark:text-[#8B98A5]">
                          <Mail size={16} />
                        </div>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-3.5 py-2.5 sm:py-3 rounded-xl bg-slate-50 dark:bg-[#0E1317] border ${
                            errors.email ? 'border-rose-500 ring-1 ring-rose-500/20' : 'border-[#D9E2EA] dark:border-[#26333A]'
                          } text-sm text-[#17212B] dark:text-[#F5F7FA] placeholder-[#94A3B8] dark:placeholder-[#64748B] focus:outline-none focus:border-[#007BA7] dark:focus:border-[#00A6DB] focus:ring-2 focus:ring-[#007BA7]/20 transition-all`}
                          placeholder="your@email.com"
                          aria-invalid={errors.email ? 'true' : 'false'}
                          aria-describedby={errors.email ? 'email-error' : undefined}
                        />
                      </div>
                      {errors.email && (
                        <p id="email-error" className="mt-1 text-xs text-rose-500 font-medium flex items-center gap-1">
                          <AlertCircle size={12} /> {errors.email}
                        </p>
                      )}
                    </div>

                    {/* Subject */}
                    <div>
                      <label
                        htmlFor="subject"
                        className="block text-xs font-semibold text-[#17212B] dark:text-[#CBD5E1] mb-1.5"
                      >
                        Subject
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#64748B] dark:text-[#8B98A5]">
                          <Tag size={16} />
                        </div>
                        <input
                          type="text"
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          className="w-full pl-10 pr-3.5 py-2.5 sm:py-3 rounded-xl bg-slate-50 dark:bg-[#0E1317] border border-[#D9E2EA] dark:border-[#26333A] text-sm text-[#17212B] dark:text-[#F5F7FA] placeholder-[#94A3B8] dark:placeholder-[#64748B] focus:outline-none focus:border-[#007BA7] dark:focus:border-[#00A6DB] focus:ring-2 focus:ring-[#007BA7]/20 transition-all"
                          placeholder="What's this about?"
                        />
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <label
                        htmlFor="message"
                        className="block text-xs font-semibold text-[#17212B] dark:text-[#CBD5E1] mb-1.5"
                      >
                        Message <span className="text-[#FF2D95]">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute top-3 left-0 pl-3.5 flex items-start pointer-events-none text-[#64748B] dark:text-[#8B98A5]">
                          <MessageSquare size={16} />
                        </div>
                        <textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          rows={4}
                          className={`w-full pl-10 pr-3.5 py-2.5 sm:py-3 rounded-xl bg-slate-50 dark:bg-[#0E1317] border ${
                            errors.message ? 'border-rose-500 ring-1 ring-rose-500/20' : 'border-[#D9E2EA] dark:border-[#26333A]'
                          } text-sm text-[#17212B] dark:text-[#F5F7FA] placeholder-[#94A3B8] dark:placeholder-[#64748B] focus:outline-none focus:border-[#007BA7] dark:focus:border-[#00A6DB] focus:ring-2 focus:ring-[#007BA7]/20 transition-all resize-none`}
                          placeholder="Your message..."
                          aria-invalid={errors.message ? 'true' : 'false'}
                          aria-describedby={errors.message ? 'message-error' : undefined}
                        />
                      </div>
                      {errors.message && (
                        <p id="message-error" className="mt-1 text-xs text-rose-500 font-medium flex items-center gap-1">
                          <AlertCircle size={12} /> {errors.message}
                        </p>
                      )}
                    </div>

                    {/* Submit Button with Cyan-to-Neon-Rose Gradient */}
                    <button
                      type="submit"
                      disabled={isSubmitting || submitStatus === 'success'}
                      className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#007BA7] via-[#00A6DB] to-[#FF2D95] hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-[#007BA7] focus:ring-offset-2 transition-all shadow-md shadow-[#007BA7]/25 hover:shadow-[0_0_20px_rgba(0,166,219,0.35)] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full" />
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <span>Send Message</span>
                          <Send size={15} />
                        </>
                      )}
                    </button>

                    {/* Status Messages */}
                    {submitStatus === 'success' && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs sm:text-sm font-medium flex items-center gap-2"
                      >
                        <CheckCircle2 size={16} className="flex-shrink-0" />
                        <span>Message sent successfully! I'll get back to you soon.</span>
                      </motion.div>
                    )}

                    {submitStatus === 'error' && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-400 text-xs sm:text-sm font-medium flex items-center gap-2"
                      >
                        <AlertCircle size={16} className="flex-shrink-0" />
                        <span>Something went wrong. Please try again.</span>
                      </motion.div>
                    )}
                  </form>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </Container>
    </section>
  )
}

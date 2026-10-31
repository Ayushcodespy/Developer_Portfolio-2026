import { motion, useReducedMotion } from 'framer-motion'
import { Mail, Linkedin, Github, Send, ArrowUpRight } from 'lucide-react'
import { useState } from 'react'
import { Container } from '../components/ui/Container'
import { SectionHeading } from '../components/ui/SectionHeading'
import { GlassCard } from '../components/ui/GlassCard'
import { Button } from '../components/ui/Button'
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
      
      setTimeout(() => setSubmitStatus('idle'), 5000)
    } catch (error) {
      setIsSubmitting(false)
      setSubmitStatus('error')
      console.error('Contact form submission failed:', error)
      setTimeout(() => setSubmitStatus('idle'), 5000)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  return (
    <section id="contact" className="contact-section section-shell relative overflow-hidden">
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
          <motion.div variants={reveal} transition={transition(0.05)}>
            <SectionHeading
              eyebrow="LET'S CONNECT"
              title="Let's Build Something Meaningful."
              description="I'm open to software development opportunities, collaborations, and interesting projects."
            />
          </motion.div>

          <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_1.2fr] md:grid-cols-1">
            {/* Left: Contact Visual & Information */}
            <motion.div variants={reveal} transition={transition(0.15)} className="space-y-8">
              {/* Contact Visual */}
              <div className="contact-visual relative min-h-[280px] rounded-2xl bg-gradient-to-br from-[#007BA7]/15 via-[#14191D] to-[#FF2D95]/10 border border-[#D9E2EA] dark:border-[#26333A] overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    {/* Central glowing orb */}
                    <motion.div 
                      animate={!reduced ? {
                        scale: [1, 1.08, 1],
                        opacity: [0.6, 0.8, 0.6],
                      } : {}}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                      className="w-24 h-24 rounded-full bg-gradient-to-br from-[#007BA7] to-[#FF2D95] blur-xl opacity-60"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div
                        animate={!reduced ? {
                          boxShadow: [
                            '0 0 30px rgba(0,123,167,0.5)',
                            '0 0 45px rgba(255,45,149,0.5)',
                            '0 0 30px rgba(0,123,167,0.5)',
                          ],
                        } : {}}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }}
                        className="w-16 h-16 rounded-full bg-gradient-to-br from-[#007BA7] to-[#FF2D95] border-2 border-white/40 flex items-center justify-center shadow-[0_0_30px_rgba(0,123,167,0.4)]"
                      >
                        <span className="text-white font-bold text-xs tracking-wider">CONNECT</span>
                      </motion.div>
                    </div>
                    
                    {/* Orbital lines */}
                    {!reduced && (
                      <>
                        <motion.div 
                          animate={{ rotate: 360 }}
                          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                          className="absolute inset-0"
                        >
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-[#007BA7]/30 rounded-full" />
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-44 h-44 border border-[#FF2D95]/20 rounded-full" />
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 border border-[#007BA7]/15 rounded-full" />
                        </motion.div>
                        
                        {/* Orbital dots */}
                        <motion.div 
                          animate={{ rotate: 360 }}
                          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32"
                        >
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#007BA7] rounded-full shadow-[0_0_8px_rgba(0,123,167,0.9)]" />
                        </motion.div>
                        <motion.div 
                          animate={{ rotate: -360 }}
                          transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
                          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-44 h-44"
                        >
                          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#FF2D95] rounded-full shadow-[0_0_8px_rgba(255,45,149,0.9)]" />
                        </motion.div>
                      </>
                    )}
                  </div>
                </div>
                
                {/* Grid overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,123,167,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(0,123,167,0.04)_1px,transparent_1px)] bg-[size:40px_40px]" />
              </div>

              {/* Contact Information Cards */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-[#17212B] dark:text-[#F5F7FA]">Get in Touch</h3>
                <div className="space-y-3">
                  {contactMethods.map((method) => (
                    <a
                      key={method.label}
                      href={method.href}
                      target={method.label === 'Email' ? undefined : '_blank'}
                      rel="noreferrer"
                      className="contact-card group flex items-center gap-4 p-4 rounded-xl border border-[#D9E2EA] dark:border-[#26333A] bg-white dark:bg-[#14191D] hover:border-[#007BA7]/50 shadow-2xs transition-all duration-300"
                    >
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#007BA7]/12 border border-[#007BA7]/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <method.icon size={18} className="text-[#007BA7] dark:text-[#38BDF8]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#17212B] dark:text-[#F5F7FA]">{method.label}</p>
                        <p className="text-xs text-[#64748B] dark:text-[#8B98A5] truncate">{method.value}</p>
                      </div>
                      <ArrowUpRight size={16} className="text-[#64748B] dark:text-[#8B98A5] group-hover:text-[#007BA7] dark:group-hover:text-[#38BDF8] transition-colors" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Availability Indicator */}
              <div className="flex items-center gap-2.5 text-sm font-medium">
                <span className="relative flex h-2.5 w-2.5">
                  {!reduced && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />}
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                </span>
                <span className="text-[#17212B] dark:text-[#CBD5E1]">Open to Opportunities</span>
              </div>
            </motion.div>

            {/* Right: Contact Form */}
            <motion.div variants={reveal} transition={transition(0.25)}>
              <GlassCard className="h-full bg-white dark:bg-[#14191D] border border-[#D9E2EA] dark:border-[#26333A] shadow-lg">
                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-[#17212B] dark:text-[#CBD5E1] mb-2">
                      Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg bg-white dark:bg-[#12181C] border ${
                        errors.name ? 'border-rose-500' : 'border-[#D9E2EA] dark:border-[#26333A]'
                      } text-[#17212B] dark:text-[#F5F7FA] placeholder-[#64748B] dark:placeholder-[#8B98A5] focus:outline-none focus:border-[#007BA7] focus:ring-2 focus:ring-[#007BA7]/20 transition-all text-sm`}
                      placeholder="Your name"
                      aria-invalid={errors.name ? 'true' : 'false'}
                      aria-describedby={errors.name ? 'name-error' : undefined}
                    />
                    {errors.name && (
                      <p id="name-error" className="mt-1.5 text-xs text-rose-500 font-medium">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-[#17212B] dark:text-[#CBD5E1] mb-2">
                      Email <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg bg-white dark:bg-[#12181C] border ${
                        errors.email ? 'border-rose-500' : 'border-[#D9E2EA] dark:border-[#26333A]'
                      } text-[#17212B] dark:text-[#F5F7FA] placeholder-[#64748B] dark:placeholder-[#8B98A5] focus:outline-none focus:border-[#007BA7] focus:ring-2 focus:ring-[#007BA7]/20 transition-all text-sm`}
                      placeholder="your@email.com"
                      aria-invalid={errors.email ? 'true' : 'false'}
                      aria-describedby={errors.email ? 'email-error' : undefined}
                    />
                    {errors.email && (
                      <p id="email-error" className="mt-1.5 text-xs text-rose-500 font-medium">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-semibold text-[#17212B] dark:text-[#CBD5E1] mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-white dark:bg-[#12181C] border border-[#D9E2EA] dark:border-[#26333A] text-[#17212B] dark:text-[#F5F7FA] placeholder-[#64748B] dark:placeholder-[#8B98A5] focus:outline-none focus:border-[#007BA7] focus:ring-2 focus:ring-[#007BA7]/20 transition-all text-sm"
                      placeholder="What's this about?"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-[#17212B] dark:text-[#CBD5E1] mb-2">
                      Message <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      className={`w-full px-4 py-3 rounded-lg bg-white dark:bg-[#12181C] border ${
                        errors.message ? 'border-rose-500' : 'border-[#D9E2EA] dark:border-[#26333A]'
                      } text-[#17212B] dark:text-[#F5F7FA] placeholder-[#64748B] dark:placeholder-[#8B98A5] focus:outline-none focus:border-[#007BA7] focus:ring-2 focus:ring-[#007BA7]/20 transition-all resize-none text-sm`}
                      placeholder="Your message..."
                      aria-invalid={errors.message ? 'true' : 'false'}
                      aria-describedby={errors.message ? 'message-error' : undefined}
                    />
                    {errors.message && (
                      <p id="message-error" className="mt-1.5 text-xs text-rose-500 font-medium">{errors.message}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || submitStatus === 'success'}
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-[#007BA7] to-[#0093C7] hover:from-[#006F96] hover:to-[#007BA7] focus:outline-none focus:ring-2 focus:ring-[#007BA7] focus:ring-offset-2 transition-all shadow-md shadow-[#007BA7]/25 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <Send size={16} />
                      </>
                    )}
                  </button>

                  {/* Status Messages */}
                  {submitStatus === 'success' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-sm font-medium"
                    >
                      Message sent successfully! I'll get back to you soon.
                    </motion.div>
                  )}
                  
                  {submitStatus === 'error' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-sm font-medium"
                    >
                      Something went wrong. Please try again.
                    </motion.div>
                  )}
                </form>
              </GlassCard>
            </motion.div>
          </div>
        </motion.div>
      </Container>
    </section>
  )
}

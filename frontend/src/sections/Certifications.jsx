import { useState, useEffect } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Container } from '../components/ui/Container'
import { SectionHeading } from '../components/ui/SectionHeading'
import { CredentialVault } from '../components/certifications/CredentialVault'
import { achievements } from '../data/achievements'
import { certificationsApi } from '../services/api'

export function Certifications() {
  const reduced = useReducedMotion()
  const [certificates, setCertificates] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCertifications = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await certificationsApi.get()
        // Transform API data to match frontend structure
        const transformedCertificates = data.map(cert => ({
          id: cert.id.toString(),
          name: cert.name,
          provider: cert.provider,
          category: cert.type || 'Certification'
        }))
        setCertificates(transformedCertificates)
      } catch (err) {
        console.error('Failed to fetch certifications:', err)
        setError('Failed to load certifications.')
        setCertificates([])
      } finally {
        setLoading(false)
      }
    }

    fetchCertifications()
  }, [])

  if (loading) {
    return (
      <section id="certifications" className="certifications-section section-shell" aria-labelledby="certifications-title">
        <Container>
          <SectionHeading
            eyebrow="PROOF OF PROGRESS"
            title="Certifications & Achievements"
            description="Milestones that reflect my learning, technical development, and professional preparation."
          />
          <div className="mt-12 flex items-center justify-center py-12">
            <div className="flex items-center gap-3 text-slate-400">
              <div className="w-8 h-8 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
              <span>Loading certifications...</span>
            </div>
          </div>
        </Container>
      </section>
    )
  }

  if (error) {
    return (
      <section id="certifications" className="certifications-section section-shell" aria-labelledby="certifications-title">
        <Container>
          <SectionHeading
            eyebrow="PROOF OF PROGRESS"
            title="Certifications & Achievements"
            description="Milestones that reflect my learning, technical development, and professional preparation."
          />
          <div className="mt-12 flex items-center justify-center py-12">
            <p className="text-slate-400">{error}</p>
          </div>
        </Container>
      </section>
    )
  }

  return (
    <section id="certifications" className="certifications-section section-shell" aria-labelledby="certifications-title">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: reduced ? 0 : 0.65 }}
          className="certifications-intro mb-16"
        >
          <SectionHeading
            eyebrow="PROOF OF PROGRESS"
            title="Certifications & Achievements"
            description="Milestones that reflect my learning, technical development, and professional preparation."
          />
        </motion.div>

        <CredentialVault achievements={achievements} certificates={certificates} />
      </Container>
    </section>
  )
}
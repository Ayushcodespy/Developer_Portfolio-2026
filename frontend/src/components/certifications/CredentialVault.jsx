import { useState } from 'react'
import { motion } from 'framer-motion'
import { AchievementCard } from './AchievementCard'
import { CertificationCard } from './CertificationCard'

export function CredentialVault({ achievements, certificates }) {
  const [filter, setFilter] = useState('all')

  const filteredCertificates = certificates.filter(cert => {
    if (filter === 'all') return true
    return cert.category.toLowerCase() === filter.toLowerCase()
  })

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'course', label: 'Courses' },
    { id: 'certification', label: 'Certifications' },
  ]

  return (
    <div className="space-y-12">
      {/* Achievements Section */}
      <div>
        <motion.h3
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="font-[family-name:var(--font-display)] text-2xl font-bold text-[#17212B] dark:text-[#F5F7FA] mb-6"
        >
          Key Achievements
        </motion.h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((achievement, index) => (
            <AchievementCard key={achievement.id} achievement={achievement} index={index} />
          ))}
        </div>
      </div>

      {/* Certifications Section */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
            className="font-[family-name:var(--font-display)] text-2xl font-bold text-[#17212B] dark:text-[#F5F7FA]"
          >
            Certifications &amp; Courses
          </motion.h3>

          {/* Filter */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-wrap gap-2"
          >
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-full transition-all duration-200 cursor-pointer ${
                  filter === category.id
                    ? 'bg-[#007BA7] text-white border border-[#007BA7] shadow-sm shadow-[#007BA7]/25'
                    : 'bg-white dark:bg-[#14191D] text-[#475569] dark:text-[#B8C2CC] border border-[#D9E2EA] dark:border-[#26333A] hover:bg-slate-100 dark:hover:bg-[#181818] hover:text-[#17212B] dark:hover:text-[#F5F7FA] shadow-2xs'
                }`}
                onClick={() => setFilter(category.id)}
              >
                {category.label}
              </button>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.5 }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {filteredCertificates.map((certification, index) => (
            <CertificationCard key={certification.id} certification={certification} index={index} />
          ))}
        </motion.div>

        {filteredCertificates.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 bg-white dark:bg-[#14191D] rounded-2xl border border-[#D9E2EA] dark:border-[#26333A]"
          >
            <p className="text-[#64748B] dark:text-[#8B98A5] text-sm">No certifications found in this category.</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
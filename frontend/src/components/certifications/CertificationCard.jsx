import { motion } from 'framer-motion'
import { Award } from 'lucide-react'

export function CertificationCard({ certification, index }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative group"
    >
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#007BA7]/15 to-[#FF2D95]/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm pointer-events-none" />
      <div className="relative bg-white dark:bg-[#14191D] backdrop-blur-xl rounded-xl border border-[#D9E2EA] dark:border-[#26333A] overflow-hidden hover:border-[#007BA7]/50 transition-all duration-300 p-6 shadow-xs hover:shadow-lg">
        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.4, delay: index * 0.1 + 0.1 }}
          className="w-12 h-12 rounded-xl bg-[#007BA7]/12 border border-[#007BA7]/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300"
        >
          <Award size={24} className="text-[#007BA7] dark:text-[#38BDF8]" />
        </motion.div>

        {/* Content */}
        <motion.h3
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.4, delay: index * 0.1 + 0.15 }}
          className="font-[family-name:var(--font-display)] text-lg font-semibold text-[#17212B] dark:text-[#F5F7FA] mb-2"
        >
          {certification.name}
        </motion.h3>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.4, delay: index * 0.1 + 0.2 }}
          className="text-[#007BA7] dark:text-[#38BDF8] font-medium text-sm mb-3"
        >
          {certification.provider}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.4, delay: index * 0.1 + 0.25 }}
        >
          <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full bg-slate-100 dark:bg-[#181818] text-[#64748B] dark:text-[#8B98A5] border border-[#D9E2EA] dark:border-[#26333A]">
            {certification.category}
          </span>
        </motion.div>
      </div>
    </motion.article>
  )
}
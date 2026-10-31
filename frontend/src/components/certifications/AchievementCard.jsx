import { motion } from 'framer-motion'
import { Award, TrendingUp } from 'lucide-react'
import { ScoreBadge } from './ScoreBadge'

export function AchievementCard({ achievement, index }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className="relative group"
    >
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#FF2D95]/15 to-[#007BA7]/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm pointer-events-none" />
      <div className="relative bg-white dark:bg-[#14191D] backdrop-blur-xl rounded-2xl border border-[#D9E2EA] dark:border-[#26333A] overflow-hidden hover:border-[#FF2D95]/40 transition-all duration-300 shadow-xs hover:shadow-lg">
        {/* Header */}
        <div className="p-6 sm:p-8 border-b border-[#D9E2EA] dark:border-[#26333A]">
          <div className="flex items-start gap-4">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, delay: index * 0.15 + 0.1 }}
              className="p-3 bg-[#FF2D95]/12 rounded-xl border border-[#FF2D95]/30 text-[#D81B78] dark:text-[#FF66B2]"
            >
              <Award size={24} />
            </motion.div>
            <div className="flex-1">
              <motion.h3
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, delay: index * 0.15 + 0.15 }}
                className="font-[family-name:var(--font-display)] text-xl font-semibold text-[#17212B] dark:text-[#F5F7FA] mb-1"
              >
                {achievement.name}
              </motion.h3>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, delay: index * 0.15 + 0.2 }}
                className="text-[#D81B78] dark:text-[#FF66B2] font-semibold text-sm"
              >
                {achievement.subtitle}
              </motion.p>
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, delay: index * 0.15 + 0.25 }}
                className="flex items-center gap-2 text-[#64748B] dark:text-[#8B98A5] text-sm mt-2 font-medium"
              >
                <TrendingUp size={16} className="text-[#007BA7] dark:text-[#38BDF8]" />
                {achievement.organization}
              </motion.div>
            </div>
          </div>
        </div>

        {/* Score or Content */}
        <div className="p-6 sm:p-8">
          {achievement.score !== undefined ? (
            <div className="flex justify-center">
              <ScoreBadge 
                score={achievement.score} 
                label={achievement.scoreLabel} 
                delay={index * 0.15 + 0.3}
              />
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, delay: index * 0.15 + 0.3 }}
              className="text-center"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#FF2D95]/10 to-[#007BA7]/10 rounded-full border border-[#FF2D95]/20">
                <span className="text-sm font-semibold text-[#D81B78] dark:text-[#FF66B2]">{achievement.category}</span>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.article>
  )
}
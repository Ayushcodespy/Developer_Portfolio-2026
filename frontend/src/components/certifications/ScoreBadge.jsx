import { motion } from 'framer-motion'

export function ScoreBadge({ score, label, delay = 0 }) {
  const circumference = 2 * Math.PI * 45
  const strokeDashoffset = circumference - (score / 100) * circumference

  return (
    <div className="relative flex flex-col items-center">
      <motion.div
        initial={{ scale: 0, rotate: -90 }}
        whileInView={{ scale: 1, rotate: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.6, delay, type: 'spring' }}
        className="relative"
      >
        <svg width="120" height="120" className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="60"
            cy="60"
            r="45"
            fill="none"
            stroke="rgba(0, 123, 167, 0.18)"
            strokeWidth="8"
          />
          {/* Progress circle */}
          <motion.circle
            cx="60"
            cy="60"
            r="45"
            fill="none"
            stroke="url(#scoreGradient)"
            strokeWidth="8"
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            whileInView={{ strokeDashoffset }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 1.5, delay: delay + 0.3, ease: 'easeOut' }}
            style={{ strokeDasharray: circumference }}
          />
          <defs>
            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#007BA7" />
              <stop offset="100%" stopColor="#FF2D95" />
            </linearGradient>
          </defs>
        </svg>

        {/* Score text */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.4, delay: delay + 0.8 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="text-center">
            <span className="block text-3xl font-bold text-[#17212B] dark:text-white font-[family-name:var(--font-display)]">
              {score}%
            </span>
          </div>
        </motion.div>
      </motion.div>

      {/* Label */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.4, delay: delay + 1 }}
        className="mt-3 text-xs font-semibold text-[#007BA7] dark:text-[#38BDF8] uppercase tracking-wider"
      >
        {label}
      </motion.p>
    </div>
  )
}
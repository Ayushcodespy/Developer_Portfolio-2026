import { motion, useReducedMotion } from 'framer-motion'

export function EducationVisual() {
  const reduced = useReducedMotion()
  
  return (
    <div className="relative w-full h-full min-h-[400px] flex items-center justify-center">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-cyan-500/5 rounded-2xl"></div>

      {/* Central education node */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        whileInView={{ scale: 1, rotate: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: reduced ? 0 : 0.8, ease: "easeOut" }}
        className="relative z-10"
      >
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-violet-500/20 to-cyan-500/20 border border-violet-500/30 flex items-center justify-center backdrop-blur-sm">
          <motion.div
            animate={!reduced ? {
              boxShadow: [
                '0 0 0 0 rgba(139, 92, 246, 0.4)',
                '0 0 0 20px rgba(139, 92, 246, 0)',
                '0 0 0 0 rgba(139, 92, 246, 0.4)'
              ]
            } : {}}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-20 h-20 rounded-full bg-violet-500/30 flex items-center justify-center"
          >
            <span className="text-3xl font-bold text-white">B.Tech</span>
          </motion.div>
        </div>
      </motion.div>

      {/* Orbiting nodes */}
      {[
        { label: 'Code', angle: 0, color: 'cyan' },
        { label: 'Database', angle: 72, color: 'violet' },
        { label: 'Algorithms', angle: 144, color: 'cyan' },
        { label: 'Software', angle: 216, color: 'violet' },
        { label: 'Development', angle: 288, color: 'cyan' }
      ].map((node, index) => (
        <motion.div
          key={node.label}
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: reduced ? 0 : 0.5, delay: reduced ? 0 : 0.3 + index * 0.1 }}
          className="absolute"
          style={{
            top: '50%',
            left: '50%',
            width: '0',
            height: '0'
          }}
        >
          <div
            className={!reduced ? 'animate-spin' : ''}
            style={{
              animationDuration: `${20 + index * 2}s`,
              animationTimingFunction: 'linear',
              animationIterationCount: 'infinite'
            }}
          >
            <div
              style={{
                transform: `translateX(140px) rotate(-${node.angle}deg)`
              }}
            >
              <div className={`px-4 py-2 rounded-full border ${
                node.color === 'cyan' 
                  ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300' 
                  : 'bg-violet-500/10 border-violet-500/30 text-violet-300'
              } backdrop-blur-sm text-sm font-medium whitespace-nowrap`}>
                {node.label}
              </div>
            </div>
          </div>
        </motion.div>
      ))}

      {/* Connection lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(139, 92, 246, 0.3)" />
            <stop offset="100%" stopColor="rgba(34, 211, 238, 0.3)" />
          </linearGradient>
        </defs>
        {[
          { angle: 0 },
          { angle: 72 },
          { angle: 144 },
          { angle: 216 },
          { angle: 288 }
        ].map((node, index) => (
          <motion.line
            key={index}
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: reduced ? 0 : 1, delay: reduced ? 0 : 0.5 + index * 0.1 }}
            x1="50%"
            y1="50%"
            x2="50%"
            y2="10%"
            stroke="url(#lineGradient)"
            strokeWidth="1"
            strokeDasharray="5,5"
            style={{
              transformOrigin: 'center',
              transformBox: 'fill-box',
              transform: `rotate(${node.angle}deg)`
            }}
          />
        ))}
      </svg>

      {/* Floating particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 0.6, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          animate={!reduced ? {
            y: [0, -20, 0]
          } : {}}
          transition={{
            duration: 3 + i * 0.2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.7 + i * 0.05
          }}
          className="absolute w-2 h-2 rounded-full bg-violet-400/50"
          style={{
            top: `${20 + i * 10}%`,
            left: `${10 + i * 12}%`
          }}
        />
      ))}
    </div>
  )
}
import { motion, useReducedMotion } from 'framer-motion'
import { Code2, BarChart3, Database, Users } from 'lucide-react'

export function FuturisticNetworkVisual() {
  const reduced = useReducedMotion()

  return (
    <div className="relative w-full max-w-[340px] sm:max-w-[380px] aspect-square mx-auto flex items-center justify-center select-none py-2">
      {/* Background radial glow */}
      <div 
        className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#007BA7]/20 via-[#00A6DB]/10 to-[#FF2D95]/15 blur-2xl pointer-events-none"
        aria-hidden="true" 
      />

      {/* Outer subtle orbital rings */}
      <motion.div
        animate={!reduced ? { rotate: 360 } : {}}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
        className="absolute w-[280px] h-[280px] sm:w-[310px] sm:h-[310px] rounded-full border border-dashed border-[#007BA7]/20 pointer-events-none"
      />
      <motion.div
        animate={!reduced ? { rotate: -360 } : {}}
        transition={{ duration: 55, repeat: Infinity, ease: 'linear' }}
        className="absolute w-[240px] h-[240px] sm:w-[260px] sm:h-[260px] rounded-full border border-dotted border-[#FF2D95]/20 pointer-events-none"
      />

      {/* Orbiting particles */}
      {!reduced && (
        <>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
            className="absolute w-[280px] h-[280px] sm:w-[310px] sm:h-[310px] pointer-events-none"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#00A6DB] shadow-[0_0_10px_#00A6DB]" />
          </motion.div>
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
            className="absolute w-[240px] h-[240px] sm:w-[260px] sm:h-[260px] pointer-events-none"
          >
            <div className="absolute bottom-2 right-12 w-2 h-2 rounded-full bg-[#FF2D95] shadow-[0_0_10px_#FF2D95]" />
          </motion.div>
        </>
      )}

      {/* Center 3D wireframe digital globe */}
      <div className="relative w-40 h-40 sm:w-48 sm:h-48 flex items-center justify-center">
        {/* Core pulsing glow */}
        <motion.div
          animate={!reduced ? { scale: [1, 1.08, 1], opacity: [0.65, 0.85, 0.65] } : {}}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-4 rounded-full bg-gradient-to-tr from-[#007BA7] via-[#00A6DB]/80 to-[#FF2D95] blur-xl opacity-70"
        />

        {/* Digital Wireframe Sphere (SVG) */}
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full relative z-10 drop-shadow-[0_0_20px_rgba(0,123,167,0.4)]"
          aria-hidden="true"
        >
          <defs>
            <radialGradient id="globeGrad" cx="45%" cy="40%" r="55%">
              <stop offset="0%" stopColor="#1E293B" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#0F172A" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#0A0A0A" stopOpacity="1" />
            </radialGradient>
            <linearGradient id="cyanRose" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00A6DB" />
              <stop offset="100%" stopColor="#FF2D95" />
            </linearGradient>
            <linearGradient id="cyanLine" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00A6DB" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#007BA7" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          {/* Globe base sphere */}
          <circle cx="100" cy="100" r="76" fill="url(#globeGrad)" stroke="url(#cyanRose)" strokeWidth="1.5" />

          {/* Latitude wireframe arcs */}
          <ellipse cx="100" cy="100" rx="76" ry="24" fill="none" stroke="#00A6DB" strokeWidth="0.75" strokeOpacity="0.4" strokeDasharray="3 3" />
          <ellipse cx="100" cy="100" rx="76" ry="50" fill="none" stroke="#00A6DB" strokeWidth="0.75" strokeOpacity="0.35" />
          <ellipse cx="100" cy="70" rx="66" ry="16" fill="none" stroke="#FF2D95" strokeWidth="0.75" strokeOpacity="0.3" strokeDasharray="2 3" />
          <ellipse cx="100" cy="130" rx="66" ry="16" fill="none" stroke="#00A6DB" strokeWidth="0.75" strokeOpacity="0.3" strokeDasharray="2 3" />

          {/* Longitude wireframe arcs */}
          <ellipse cx="100" cy="100" rx="26" ry="76" fill="none" stroke="#00A6DB" strokeWidth="0.75" strokeOpacity="0.4" />
          <ellipse cx="100" cy="100" rx="52" ry="76" fill="none" stroke="#007BA7" strokeWidth="0.75" strokeOpacity="0.3" strokeDasharray="3 3" />
          <line x1="100" y1="24" x2="100" y2="176" stroke="url(#cyanRose)" strokeWidth="0.9" strokeOpacity="0.45" />

          {/* Network constellation lines */}
          <path
            d="M 60 75 L 85 90 L 120 70 L 140 100 L 115 130 L 75 125 Z"
            fill="none"
            stroke="url(#cyanRose)"
            strokeWidth="1.2"
            strokeOpacity="0.75"
          />
          <path
            d="M 85 90 L 115 130 M 60 75 L 120 70 M 75 125 L 140 100"
            fill="none"
            stroke="#00A6DB"
            strokeWidth="0.8"
            strokeOpacity="0.5"
            strokeDasharray="2 2"
          />

          {/* Glowing Constellation Nodes */}
          <circle cx="60" cy="75" r="3.5" fill="#00A6DB" className="filter drop-shadow-[0_0_6px_#00A6DB]" />
          <circle cx="85" cy="90" r="3" fill="#38BDF8" className="filter drop-shadow-[0_0_5px_#38BDF8]" />
          <circle cx="120" cy="70" r="4" fill="#FF2D95" className="filter drop-shadow-[0_0_8px_#FF2D95]" />
          <circle cx="140" cy="100" r="3" fill="#FF2D95" className="filter drop-shadow-[0_0_6px_#FF2D95]" />
          <circle cx="115" cy="130" r="3.5" fill="#00A6DB" className="filter drop-shadow-[0_0_6px_#00A6DB]" />
          <circle cx="75" cy="125" r="3" fill="#38BDF8" className="filter drop-shadow-[0_0_5px_#38BDF8]" />

          {/* Radiating connection lines to outer badges */}
          <line x1="60" y1="75" x2="30" y2="35" stroke="#00A6DB" strokeWidth="1" strokeDasharray="3 3" strokeOpacity="0.6" />
          <line x1="120" y1="70" x2="165" y2="35" stroke="#FF2D95" strokeWidth="1" strokeDasharray="3 3" strokeOpacity="0.6" />
          <line x1="75" y1="125" x2="35" y2="165" stroke="#00A6DB" strokeWidth="1" strokeDasharray="3 3" strokeOpacity="0.6" />
          <line x1="115" y1="130" x2="165" y2="165" stroke="#007BA7" strokeWidth="1" strokeDasharray="3 3" strokeOpacity="0.6" />
        </svg>
      </div>

      {/* Floating Badge 1: Develop (Top-Left) */}
      <motion.div
        animate={!reduced ? { y: [0, -4, 0] } : {}}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-2 left-0 sm:left-1 flex flex-col items-center group cursor-default z-20"
      >
        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#12181C]/90 dark:bg-[#12181C]/95 backdrop-blur-md border border-[#00A6DB]/50 flex items-center justify-center text-[#00A6DB] shadow-[0_0_16px_rgba(0,166,219,0.35)] group-hover:scale-105 transition-transform">
          <Code2 size={18} className="text-[#38BDF8]" />
        </div>
        <span className="mt-1 text-[11px] font-semibold tracking-wide text-slate-800 dark:text-[#E2E8F0] drop-shadow-xs">
          Develop
        </span>
      </motion.div>

      {/* Floating Badge 2: Analyze (Top-Right) */}
      <motion.div
        animate={!reduced ? { y: [0, -5, 0] } : {}}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        className="absolute top-2 right-0 sm:right-1 flex flex-col items-center group cursor-default z-20"
      >
        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#12181C]/90 dark:bg-[#12181C]/95 backdrop-blur-md border border-[#FF2D95]/50 flex items-center justify-center text-[#FF2D95] shadow-[0_0_16px_rgba(255,45,149,0.35)] group-hover:scale-105 transition-transform">
          <BarChart3 size={18} className="text-[#FF2D95]" />
        </div>
        <span className="mt-1 text-[11px] font-semibold tracking-wide text-slate-800 dark:text-[#E2E8F0] drop-shadow-xs">
          Analyze
        </span>
      </motion.div>

      {/* Floating Badge 3: Collaborate (Bottom-Left) */}
      <motion.div
        animate={!reduced ? { y: [0, 4, 0] } : {}}
        transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute bottom-2 left-0 sm:left-1 flex flex-col items-center group cursor-default z-20"
      >
        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#12181C]/90 dark:bg-[#12181C]/95 backdrop-blur-md border border-[#007BA7]/50 flex items-center justify-center text-[#38BDF8] shadow-[0_0_16px_rgba(0,123,167,0.35)] group-hover:scale-105 transition-transform">
          <Users size={18} className="text-[#38BDF8]" />
        </div>
        <span className="mt-1 text-[11px] font-semibold tracking-wide text-slate-800 dark:text-[#E2E8F0] drop-shadow-xs">
          Collaborate
        </span>
      </motion.div>

      {/* Floating Badge 4: Create Impact (Bottom-Right) */}
      <motion.div
        animate={!reduced ? { y: [0, 4, 0] } : {}}
        transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
        className="absolute bottom-2 right-0 sm:right-1 flex flex-col items-center group cursor-default z-20"
      >
        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#12181C]/90 dark:bg-[#12181C]/95 backdrop-blur-md border border-[#00A6DB]/50 flex items-center justify-center text-[#00A6DB] shadow-[0_0_16px_rgba(0,166,219,0.35)] group-hover:scale-105 transition-transform">
          <Database size={18} className="text-[#38BDF8]" />
        </div>
        <span className="mt-1 text-[11px] font-semibold tracking-wide text-slate-800 dark:text-[#E2E8F0] drop-shadow-xs whitespace-nowrap">
          Create Impact
        </span>
      </motion.div>
    </div>
  )
}


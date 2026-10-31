import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion'
import { useRef } from 'react'
// import heroImage from '../../assets/hero-image-cutout.png'
import heroImage from '../../assets/hero_image (1).png'
import { useReducedMotion } from '../../hooks/useReducedMotion'

export function HeroVisual() {
  const root = useRef(null)
  const reduced = useReducedMotion()
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const rotateX = useSpring(useTransform(pointerY, [-.5, .5], [2.5, -2.5]), { stiffness: 90, damping: 20 })
  const rotateY = useSpring(useTransform(pointerX, [-.5, .5], [-3.5, 3.5]), { stiffness: 90, damping: 20 })
  const { scrollYProgress } = useScroll({ target: root, offset: ['start end', 'end start'] })
  const scrollY = useTransform(scrollYProgress, [0, 1], [22, -22])
  const reset = () => { pointerX.set(0); pointerY.set(0) }
  const move = (event) => {
    if (reduced) return
    const rect = event.currentTarget.getBoundingClientRect()
    pointerX.set((event.clientX - rect.left) / rect.width - .5)
    pointerY.set((event.clientY - rect.top) / rect.height - .5)
  }

  return <motion.div ref={root} className="hero-visual" style={reduced ? undefined : { y: scrollY }} onPointerMove={move} onPointerLeave={reset} whileHover={reduced ? undefined : { scale: 1.018 }} transition={{ type: 'spring', stiffness: 180, damping: 24 }}>
    <motion.div className="hero-visual" style={reduced ? undefined : { rotateX, rotateY }}>
      <img src={heroImage} alt="Ayush Patel - Python Developer & Data Analyst professional portrait" fetchPriority="high" decoding="async" draggable="false" />
    </motion.div>
  </motion.div>
}

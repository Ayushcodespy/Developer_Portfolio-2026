import { Outlet } from 'react-router-dom'
import { Navigation } from './Navigation'
import { Footer } from './Footer'
import { useEffect } from 'react'
import { useTheme } from '../../hooks/useTheme'
import SplashCursor from '../animations/SplashCursor'

export function SiteLayout() {
  const { theme } = useTheme()

  useEffect(() => {
    const handleScroll = () => {
      const backToTop = document.querySelector('.back-to-top')
      if (backToTop) {
        if (window.scrollY > 400) {
          backToTop.classList.add('is-visible')
        } else {
          backToTop.classList.remove('is-visible')
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen overflow-x-clip bg-[var(--color-bg-base)]">
      <SplashCursor
        rainbow={false}
        size={1}
        force={1}
        swirl={3}
        trail={1}
        clickSplash
        colorSpeed={1}
        intensity={1}
        momentum={1}
        shading={1}
        glow={0}
        quality="high"
        intro
        contained={false}
        theme={theme}
        zIndex={1}
        colors={['#007BA7', '#00A6DB', '#FF2D95', '#D81B78']}
      />
      <Navigation />
      <Outlet />
      <Footer />
    </div>
  )
}

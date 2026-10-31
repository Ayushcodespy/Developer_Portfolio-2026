import { Outlet } from 'react-router-dom'
import { Navigation } from './Navigation'
import { Footer } from './Footer'
import { useEffect } from 'react'

export function SiteLayout() {
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
      <Navigation />
      <Outlet />
      <Footer />
    </div>
  )
}

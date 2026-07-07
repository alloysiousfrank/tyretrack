import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { lenis } from '../../utils/lenis'

export default function ScrollToTop() {
  const { pathname } = useLocation()

  useLayoutEffect(() => {
    lenis.scrollTo(0, { immediate: true })
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

import Lenis from 'lenis'

export const lenis = new Lenis({
  duration: 1.2,
  easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
})

function raf(time: number) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}

requestAnimationFrame(raf)

if (typeof document !== 'undefined') {
  document.documentElement.classList.add('lenis', 'lenis-smooth')
}

export default lenis

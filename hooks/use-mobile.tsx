import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    // Check if window is available (prevents SSR errors)
    if (typeof window === 'undefined') return

    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }

    // Set initial value immediately
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    
    // Add event listener for changes
    mql.addEventListener("change", onChange)
    
    // Cleanup function to prevent memory leaks
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}

// Export breakpoint constant for use in other components
export { MOBILE_BREAKPOINT }

// BONUS: Advanced breakpoint hook for tablet/desktop detection
export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = React.useState<'mobile' | 'tablet' | 'desktop'>('desktop')

  React.useEffect(() => {
    // Check if window is available (prevents SSR errors)
    if (typeof window === 'undefined') return

    const updateBreakpoint = () => {
      const width = window.innerWidth
      if (width < 768) {
        setBreakpoint('mobile')
      } else if (width < 1024) {
        setBreakpoint('tablet')
      } else {
        setBreakpoint('desktop')
      }
    }

    // Set initial breakpoint
    updateBreakpoint()
    
    // Listen for window resize
    window.addEventListener('resize', updateBreakpoint)
    
    // Cleanup listener
    return () => window.removeEventListener('resize', updateBreakpoint)
  }, [])

  return breakpoint
}

// BONUS: Custom breakpoint hook for any size
export function useCustomBreakpoint(breakpoint: number) {
  const [isBelow, setIsBelow] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    if (typeof window === 'undefined') return

    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`)
    
    const onChange = () => {
      setIsBelow(window.innerWidth < breakpoint)
    }

    setIsBelow(window.innerWidth < breakpoint)
    mql.addEventListener("change", onChange)
    
    return () => mql.removeEventListener("change", onChange)
  }, [breakpoint])

  return !!isBelow
}
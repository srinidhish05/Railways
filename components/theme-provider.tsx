'use client'

import * as React from 'react'
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from 'next-themes'

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

// Enhanced theme configuration for Karnataka Railway
export const themeConfig = {
  themes: ['light', 'dark', 'railway'],
  defaultTheme: 'light',
  enableSystem: true,
  disableTransitionOnChange: false,
  storageKey: 'karnataka-railway-theme',
  attribute: 'class'
}

// Railway-specific theme colors
export const railwayTheme = {
  light: {
    primary: 'hsl(210, 100%, 50%)', // Railway blue
    secondary: 'hsl(45, 100%, 50%)', // Indian Railway yellow
    background: 'hsl(0, 0%, 100%)',
    foreground: 'hsl(222.2, 84%, 4.9%)',
    accent: 'hsl(210, 40%, 95%)',
    muted: 'hsl(210, 40%, 98%)',
    border: 'hsl(214.3, 31.8%, 91.4%)',
    success: 'hsl(142.1, 76.2%, 36.3%)',
    warning: 'hsl(38, 92%, 50%)',
    destructive: 'hsl(0, 84.2%, 60.2%)'
  },
  dark: {
    primary: 'hsl(210, 100%, 60%)',
    secondary: 'hsl(45, 100%, 60%)',
    background: 'hsl(222.2, 84%, 4.9%)',
    foreground: 'hsl(210, 40%, 98%)',
    accent: 'hsl(217.2, 32.6%, 17.5%)',
    muted: 'hsl(217.2, 32.6%, 17.5%)',
    border: 'hsl(217.2, 32.6%, 17.5%)',
    success: 'hsl(142.1, 70.6%, 45.3%)',
    warning: 'hsl(38, 92%, 50%)',
    destructive: 'hsl(0, 62.8%, 30.6%)'
  },
  railway: {
    primary: 'hsl(210, 100%, 45%)', // Deep railway blue
    secondary: 'hsl(30, 100%, 50%)', // Saffron orange
    background: 'hsl(210, 25%, 98%)', // Light blue-grey
    foreground: 'hsl(210, 50%, 15%)', // Dark blue-grey
    accent: 'hsl(210, 30%, 95%)',
    muted: 'hsl(210, 30%, 96%)',
    border: 'hsl(210, 25%, 88%)',
    success: 'hsl(138, 76%, 32%)', // Indian green
    warning: 'hsl(45, 100%, 47%)', // Golden yellow
    destructive: 'hsl(0, 84%, 55%)'
  }
}

// Theme utility functions
export const useRailwayTheme = () => {
  const [mounted, setMounted] = React.useState(false)
  
  React.useEffect(() => {
    setMounted(true)
  }, [])

  const getCurrentTheme = () => {
    if (!mounted) return 'light'
    return document.documentElement.className.includes('dark') ? 'dark' : 'light'
  }

  const toggleTheme = () => {
    const current = getCurrentTheme()
    const root = document.documentElement
    
    if (current === 'light') {
      root.classList.remove('light')
      root.classList.add('dark')
      localStorage.setItem('karnataka-railway-theme', 'dark')
    } else {
      root.classList.remove('dark')
      root.classList.add('light')
      localStorage.setItem('karnataka-railway-theme', 'light')
    }
  }

  const setRailwayTheme = () => {
    const root = document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add('railway')
    localStorage.setItem('karnataka-railway-theme', 'railway')
  }

  return {
    mounted,
    currentTheme: getCurrentTheme(),
    toggleTheme,
    setRailwayTheme
  }
}

// CSS variables for railway theme
export const railwayThemeCSS = `
  .railway {
    --background: 210 25% 98%;
    --foreground: 210 50% 15%;
    --card: 0 0% 100%;
    --card-foreground: 210 50% 15%;
    --popover: 0 0% 100%;
    --popover-foreground: 210 50% 15%;
    --primary: 210 100% 45%;
    --primary-foreground: 210 40% 98%;
    --secondary: 30 100% 50%;
    --secondary-foreground: 210 40% 2%;
    --muted: 210 30% 96%;
    --muted-foreground: 210 25% 35%;
    --accent: 210 30% 95%;
    --accent-foreground: 210 25% 25%;
    --destructive: 0 84% 55%;
    --destructive-foreground: 210 40% 98%;
    --border: 210 25% 88%;
    --input: 210 25% 88%;
    --ring: 210 100% 45%;
    --radius: 0.5rem;
  }
`
import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
        "./lib/**/*.{js,ts,jsx,tsx,mdx}",
        "*.{js,ts,jsx,tsx,mdx}"
    ],
    theme: {
        extend: {
            colors: {
                background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))',
                card: {
                    DEFAULT: 'hsl(var(--card))',
                    foreground: 'hsl(var(--card-foreground))'
                },
                popover: {
                    DEFAULT: 'hsl(var(--popover))',
                    foreground: 'hsl(var(--popover-foreground))'
                },
                primary: {
                    DEFAULT: 'hsl(var(--primary))',
                    foreground: 'hsl(var(--primary-foreground))'
                },
                secondary: {
                    DEFAULT: 'hsl(var(--secondary))',
                    foreground: 'hsl(var(--secondary-foreground))'
                },
                muted: {
                    DEFAULT: 'hsl(var(--muted))',
                    foreground: 'hsl(var(--muted-foreground))'
                },
                accent: {
                    DEFAULT: 'hsl(var(--accent))',
                    foreground: 'hsl(var(--accent-foreground))'
                },
                destructive: {
                    DEFAULT: 'hsl(var(--destructive))',
                    foreground: 'hsl(var(--destructive-foreground))'
                },
                border: 'hsl(var(--border))',
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))',
                chart: {
                    '1': 'hsl(var(--chart-1))',
                    '2': 'hsl(var(--chart-2))',
                    '3': 'hsl(var(--chart-3))',
                    '4': 'hsl(var(--chart-4))',
                    '5': 'hsl(var(--chart-5))'
                },
                sidebar: {
                    DEFAULT: 'hsl(var(--sidebar-background))',
                    foreground: 'hsl(var(--sidebar-foreground))',
                    primary: 'hsl(var(--sidebar-primary))',
                    'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
                    accent: 'hsl(var(--sidebar-accent))',
                    'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
                    border: 'hsl(var(--sidebar-border))',
                    ring: 'hsl(var(--sidebar-ring))'
                },
                // Railway-specific colors
                railway: {
                    'track': 'hsl(var(--railway-track))',
                    'signal-red': 'hsl(var(--railway-signal-red))',
                    'signal-green': 'hsl(var(--railway-signal-green))',
                    'signal-yellow': 'hsl(var(--railway-signal-yellow))',
                    'station': 'hsl(var(--railway-station))',
                    'platform': 'hsl(var(--railway-platform))',
                    'train': 'hsl(var(--railway-train))',
                    'route': 'hsl(var(--railway-route))',
                    'delayed': 'hsl(var(--railway-delayed))',
                    'ontime': 'hsl(var(--railway-ontime))',
                    'cancelled': 'hsl(var(--railway-cancelled))'
                }
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)'
            },
            spacing: {
                'track': '2px',
                'platform': '1.5rem',
                'coach': '3rem',
                'station': '4rem'
            },
            fontFamily: {
                'mono': ['JetBrains Mono', 'Consolas', 'monospace'],
                'display': ['Inter', 'system-ui', 'sans-serif']
            },
            fontSize: {
                'schedule': ['0.75rem', { lineHeight: '1rem' }],
                'platform': ['1.125rem', { lineHeight: '1.75rem', fontWeight: '600' }],
                'station': ['1.5rem', { lineHeight: '2rem', fontWeight: '700' }]
            },
            boxShadow: {
                'train': '0 4px 20px -2px rgba(0, 0, 0, 0.1), 0 2px 8px -2px rgba(0, 0, 0, 0.04)',
                'station': '0 8px 30px -4px rgba(0, 0, 0, 0.1), 0 4px 16px -4px rgba(0, 0, 0, 0.04)',
                'platform': '0 2px 10px -1px rgba(0, 0, 0, 0.1), 0 1px 4px -1px rgba(0, 0, 0, 0.04)'
            },
            keyframes: {
                'accordion-down': {
                    from: {
                        height: '0'
                    },
                    to: {
                        height: 'var(--radix-accordion-content-height)'
                    }
                },
                'accordion-up': {
                    from: {
                        height: 'var(--radix-accordion-content-height)'
                    },
                    to: {
                        height: '0'
                    }
                },
                'train-move': {
                    '0%': { transform: 'translateX(-100%)' },
                    '100%': { transform: 'translateX(100vw)' }
                },
                'signal-blink': {
                    '0%, 50%': { opacity: '1' },
                    '51%, 100%': { opacity: '0.3' }
                },
                'loading-train': {
                    '0%': { transform: 'translateX(-100%)' },
                    '100%': { transform: 'translateX(100%)' }
                },
                'pulse-slow': {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.5' }
                }
            },
            animation: {
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out',
                'train-move': 'train-move 10s linear infinite',
                'signal-blink': 'signal-blink 2s ease-in-out infinite',
                'loading-train': 'loading-train 2s ease-in-out infinite',
                'pulse-slow': 'pulse-slow 3s ease-in-out infinite'
            },
            gridTemplateColumns: {
                'seat-layout': 'repeat(4, 1fr) 2fr repeat(4, 1fr)',
                'timetable': 'auto 1fr auto auto auto',
                'route': 'auto 1fr auto'
            },
            backgroundImage: {
                'track-pattern': 'repeating-linear-gradient(90deg, transparent, transparent 10px, hsl(var(--railway-track)) 10px, hsl(var(--railway-track)) 12px)',
                'platform-pattern': 'linear-gradient(45deg, hsl(var(--railway-platform)) 25%, transparent 25%, transparent 75%, hsl(var(--railway-platform)) 75%)',
            },
            backdropBlur: {
                'xs': '2px'
            }
        }
    },
    plugins: [
        require("tailwindcss-animate"),
        // Custom plugin for railway-specific utilities
        function({ addUtilities }: any) {
            const newUtilities = {
                '.track-line': {
                    position: 'relative',
                    '&::after': {
                        content: '""',
                        position: 'absolute',
                        top: '50%',
                        left: '0',
                        right: '0',
                        height: '2px',
                        backgroundColor: 'hsl(var(--railway-track))',
                        transform: 'translateY(-50%)'
                    }
                },
                '.platform-edge': {
                    borderLeft: '4px solid hsl(var(--railway-platform))',
                    paddingLeft: '1rem'
                },
                '.signal-light': {
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    display: 'inline-block'
                }
            }
            addUtilities(newUtilities)
        }
    ],
};

export default config;
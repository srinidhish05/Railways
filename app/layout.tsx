import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter'
})

export const metadata: Metadata = {
  title: "Karnataka Railway Network | Live Train Tracking & Booking",
  description: "Complete Karnataka railway management system with live train tracking, PNR status, seat booking, and real-time updates for all Karnataka trains.",
  keywords: [
    "Karnataka railway",
    "train booking",
    "PNR status",
    "live train tracking",
    "Indian railways",
    "IRCTC",
    "train status",
    "railway reservation"
  ],
  authors: [{ name: "Karnataka Railway Network" }],
  creator: "Karnataka Railway Network",
  publisher: "Karnataka Railway Network",
  applicationName: "Karnataka Railway Network",
  generator: "Next.js",
  referrer: "origin-when-cross-origin",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'mask-icon', url: '/safari-pinned-tab.svg', color: '#1d4ed8' },
    ],
  },
  manifest: '/site.webmanifest',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://karnataka-railway.vercel.app',
    title: 'Karnataka Railway Network | Live Train Tracking & Booking',
    description: 'Complete Karnataka railway management system with live train tracking, PNR status, seat booking, and real-time updates.',
    siteName: 'Karnataka Railway Network',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Karnataka Railway Network - Live Train Tracking',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Karnataka Railway Network | Live Train Tracking & Booking',
    description: 'Complete Karnataka railway management system with live train tracking, PNR status, seat booking, and real-time updates.',
    images: ['/og-image.png'],
    creator: '@KarnatakaRailway',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  verification: {
    google: 'your-google-verification-code',
  },
  category: 'transportation',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html 
      lang="en" 
      suppressHydrationWarning 
      className={inter.variable}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="theme-color" content="#1d4ed8" />
        <meta name="color-scheme" content="light dark" />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider 
          attribute="class" 
          defaultTheme="light" 
          enableSystem 
          disableTransitionOnChange
        >
          <div className="relative min-h-screen bg-background">
            {/* Railway Network Status Bar */}
            <div className="h-1 bg-gradient-to-r from-blue-600 via-green-500 to-blue-600 animate-pulse" />
            
            {/* Main Content */}
            <main className="relative">
              {children}
            </main>
            
            {/* Global Toast Notifications */}
            <Toaster />
            
            {/* Service Worker Registration */}
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  if ('serviceWorker' in navigator) {
                    window.addEventListener('load', function() {
                      navigator.serviceWorker.register('/sw.js')
                        .then(function(registration) {
                          console.log('SW registered: ', registration);
                        })
                        .catch(function(registrationError) {
                          console.log('SW registration failed: ', registrationError);
                        });
                    });
                  }
                `
              }}
            />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
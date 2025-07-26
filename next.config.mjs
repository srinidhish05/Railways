/** @type {import('next').NextConfig} */
const nextConfig = {
  // ===========================================
  // TYPESCRIPT & ESLINT (Enhanced for Production)
  // ===========================================
  eslint: {
    ignoreDuringBuilds: false, // Enable ESLint in production
    dirs: ['app', 'components', 'lib', 'types', 'services'], // Lint specific directories
  },
  typescript: {
    ignoreBuildErrors: false, // Enable TypeScript checking in production
  },

  // ===========================================
  // IMAGES & ASSETS OPTIMIZATION
  // ===========================================
  images: {
    unoptimized: false, // Enable image optimization for better performance
    domains: [
      'railway.karnataka.gov.in',
      'indianrailways.gov.in',
      'irctc.co.in',
      'maps.googleapis.com',
      'cdn.railway.karnataka.gov.in'
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 86400, // 24 hours cache
  },

  // ===========================================
  // RAILWAY SYSTEM SPECIFIC CONFIGS
  // ===========================================
  env: {
    RAILWAY_SYSTEM_NAME: 'Karnataka Railway Safety System',
    RAILWAY_VERSION: '1.0.0',
    RAILWAY_BUILD_DATE: new Date().toISOString(),
  },

  // ===========================================
  // HEADERS & SECURITY
  // ===========================================
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Railway System Security Headers
          {
            key: 'X-Railway-System',
            value: 'Karnataka-Gov-Railway-Safety-v1.0',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'geolocation=(), microphone=(), camera=()',
          },
        ],
      },
      // API Routes Security
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'X-Railway-API',
            value: 'Karnataka-Railway-API-v1.0',
          },
          {
            key: 'Cache-Control',
            value: 'no-store, max-age=0',
          },
        ],
      },
      // Static Assets Caching
      {
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, immutable',
          },
        ],
      },
    ]
  },

  // ===========================================
  // REDIRECTS FOR RAILWAY SYSTEM
  // ===========================================
  async redirects() {
    return [
      // Legacy URLs
      {
        source: '/pnr-status',
        destination: '/pnr',
        permanent: true,
      },
      {
        source: '/train-status',
        destination: '/trains',
        permanent: true,
      },
      {
        source: '/emergency-contact',
        destination: '/emergency',
        permanent: true,
      },
      // Admin redirects
      {
        source: '/admin',
        destination: '/admin/dashboard',
        permanent: false,
      },
    ]
  },

  // ===========================================
  // REWRITES FOR API ROUTES
  // ===========================================
  async rewrites() {
    return [
      // Railway API rewrites
      {
        source: '/api/pnr/:pnr',
        destination: '/api/railway/pnr-status?pnr=:pnr',
      },
      {
        source: '/api/train/:trainNumber',
        destination: '/api/railway/train-status?train=:trainNumber',
      },
      {
        source: '/api/stations/:zone',
        destination: '/api/railway/stations?zone=:zone',
      },
    ]
  },

  // ===========================================
  // WEBPACK CONFIGURATION
  // ===========================================
  webpack: (config, { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }) => {
    // Railway System specific webpack configs
    config.resolve.alias = {
      ...config.resolve.alias,
      '@/railway': './components/railway',
      '@/types': './types',
      '@/services': './services',
    }

    // Optimize for Railway System
    if (!dev && !isServer) {
      config.optimization.splitChunks.chunks = 'all'
      config.optimization.splitChunks.cacheGroups = {
        ...config.optimization.splitChunks.cacheGroups,
        railway: {
          name: 'railway-components',
          test: /[\\/]components[\\/]railway[\\/]/,
          chunks: 'all',
          enforce: true,
        },
      }
    }

    return config
  },

  // ===========================================
  // PERFORMANCE OPTIMIZATIONS
  // ===========================================
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'], // Keep error and warning logs
    } : false,
  },

  // ===========================================
  // EXPERIMENTAL FEATURES
  // ===========================================
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },

  // ===========================================
  // OUTPUT CONFIGURATION
  // ===========================================
  output: 'standalone', // For Docker deployment
  
  // ===========================================
  // DEVELOPMENT CONFIGURATION
  // ===========================================
  ...(process.env.NODE_ENV === 'development' && {
    reactStrictMode: true,
    swcMinify: true,
  }),

  // ===========================================
  // RAILWAY PWA CONFIGURATION
  // ===========================================
  ...(process.env.ENABLE_PWA === 'true' && {
    // PWA configuration would go here
    // You can add next-pwa configuration
  }),
}

export default nextConfig
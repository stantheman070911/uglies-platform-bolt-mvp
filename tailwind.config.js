const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@material-tailwind/react/theme/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          25: '#f8faff',
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#007AFF',
          600: '#0056CC',
          700: '#0047AB',
          800: '#003d99',
          900: '#003380',
          950: '#001a4d'
        },
        secondary: {
          25: '#f7fef9',
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#34C759',
          600: '#248A3D',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#0a2e0a'
        },
        tertiary: {
          25: '#fffcf5',
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#FF9500',
          600: '#CC7700',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
          950: '#3c1a05'
        },
        surface: {
          25: '#fdfdfd',
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
          950: '#030712'
        },
        agricultural: {
          earth: {
            50: '#fef7f0',
            100: '#fdf2e0',
            200: '#fae3c1',
            300: '#f6d098',
            400: '#f0b86e',
            500: '#ea9d4b',
            600: '#d97f2f',
            700: '#b66318',
            800: '#92400E',
            900: '#78341b',
            950: '#401a0c'
          },
          fresh: {
            50: '#f0fdf5',
            100: '#dcfce8',
            200: '#bbf7d1',
            300: '#86efad',
            400: '#4ade80',
            500: '#22C55E',
            600: '#16a34a',
            700: '#15803d',
            800: '#166534',
            900: '#14532d',
            950: '#052e16'
          },
          harvest: {
            50: '#fffbeb',
            100: '#fef3c7',
            200: '#fde68a',
            300: '#fcd34d',
            400: '#fbbf24',
            500: '#F59E0B',
            600: '#d97706',
            700: '#b45309',
            800: '#92400e',
            900: '#78350f',
            950: '#451a03'
          },
          organic: {
            50: '#f0fdfa',
            100: '#ccfbf1',
            200: '#99f6e4',
            300: '#5eead4',
            400: '#2dd4bf',
            500: '#059669',
            600: '#0d9488',
            700: '#0f766e',
            800: '#115e59',
            900: '#134e4a',
            950: '#042f2e'
          },
          heritage: {
            50: '#faf5ff',
            100: '#f3e8ff',
            200: '#e9d5ff',
            300: '#d8b4fe',
            400: '#c084fc',
            500: '#a855f7',
            600: '#9333ea',
            700: '#7C3AED',
            800: '#6b21a8',
            900: '#581c87',
            950: '#3b0764'
          },
          seasonal: {
            50: '#fdf2f8',
            100: '#fce7f3',
            200: '#fbcfe8',
            300: '#f9a8d4',
            400: '#f472b6',
            500: '#EC4899',
            600: '#db2777',
            700: '#be185d',
            800: '#9d174d',
            900: '#831843',
            950: '#500724'
          }
        },
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22'
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#F59E0B',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03'
        },
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#EF4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          950: '#450a0a'
        },
        info: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3B82F6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554'
        }
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #007AFF 0%, #0056CC 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #34C759 0%, #248A3D 100%)',
        'gradient-tertiary': 'linear-gradient(135deg, #FF9500 0%, #CC7700 100%)',
        'gradient-global-tech': 'linear-gradient(135deg, #007AFF 0%, #34C759 50%, #FF9500 100%)',
        'gradient-agricultural': 'linear-gradient(135deg, #22C55E 0%, #059669 50%, #92400E 100%)'
      },
      boxShadow: {
        'elevation-0': 'none',
        'elevation-1': '0px 1px 2px rgba(0, 0, 0, 0.3), 0px 1px 3px 1px rgba(0, 0, 0, 0.15)',
        'elevation-2': '0px 1px 2px rgba(0, 0, 0, 0.3), 0px 2px 6px 2px rgba(0, 0, 0, 0.15)',
        'elevation-3': '0px 4px 8px 3px rgba(0, 0, 0, 0.15), 0px 1px 3px rgba(0, 0, 0, 0.3)',
        'elevation-4': '0px 6px 10px 4px rgba(0, 0, 0, 0.15), 0px 2px 3px rgba(0, 0, 0, 0.3)',
        'elevation-5': '0px 8px 12px 6px rgba(0, 0, 0, 0.15), 0px 4px 4px rgba(0, 0, 0, 0.3)',
        'focus-primary': '0 0 0 3px rgba(0, 122, 255, 0.25)',
        'focus-secondary': '0 0 0 3px rgba(52, 199, 89, 0.25)',
        'focus-error': '0 0 0 3px rgba(239, 68, 68, 0.25)'
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
    function({ addUtilities }) {
      addUtilities({
        '.text-global-primary': {
          color: '#007AFF'
        },
        '.text-global-secondary': {
          color: '#34C759'
        },
        '.text-global-tertiary': {
          color: '#FF9500'
        },
        '.bg-global-primary': {
          backgroundColor: '#007AFF',
          color: '#FFFFFF'
        },
        '.bg-global-secondary': {
          backgroundColor: '#34C759',
          color: '#FFFFFF'
        },
        '.bg-global-tertiary': {
          backgroundColor: '#FF9500',
          color: '#FFFFFF'
        }
      })
    }
  ]
});
import { type Config } from 'tailwindcss';

export const colorTokens = {
  // Global Tech Brand Colors
  brand: {
    primary: '#007AFF',      // iOS trust blue
    secondary: '#34C759',    // Universal growth green
    tertiary: '#FF9500',     // Energy orange
  },
  
  // Material Design 3 Surface System
  surface: {
    background: '#F9FAFB',
    card: '#FFFFFF',
    divider: '#E5E7EB',
    border: '#D1D5DB',
    textPrimary: '#111827',
    textSecondary: '#4B5563',
    textTertiary: '#9CA3AF',
  },
  
  // Agricultural Context
  agricultural: {
    earth: '#92400E',
    fresh: '#22C55E',
    harvest: '#F59E0B',
    organic: '#059669',
    heritage: '#7C3AED',
    seasonal: '#EC4899',
  },
  
  // Semantic Colors
  semantic: {
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
  },
  
  // Component States
  states: {
    hover: {
      primary: '#0056CC',
      secondary: '#248A3D',
      tertiary: '#CC7700',
    },
    pressed: {
      primary: '#0047AB',
      secondary: '#15803d',
      tertiary: '#c2410c',
    },
    disabled: {
      background: '#F3F4F6',
      text: '#9CA3AF',
      border: '#E5E7EB',
    },
  },
} as const;

export type ColorTokens = typeof colorTokens;

// Color contrast utilities
export const getContrastText = (backgroundColor: string): string => {
  const brightColors = ['#FFFFFF', '#F9FAFB', '#F3F4F6', '#E5E7EB'];
  return brightColors.includes(backgroundColor) ? colorTokens.surface.textPrimary : '#FFFFFF';
};

// Brand color utilities
export const getBrandGradient = (type: 'primary' | 'secondary' | 'tertiary' | 'global'): string => {
  const gradients = {
    primary: 'linear-gradient(135deg, #007AFF 0%, #0056CC 100%)',
    secondary: 'linear-gradient(135deg, #34C759 0%, #248A3D 100%)',
    tertiary: 'linear-gradient(135deg, #FF9500 0%, #CC7700 100%)',
    global: 'linear-gradient(135deg, #007AFF 0%, #34C759 50%, #FF9500 100%)',
  };
  return gradients[type];
};

// Accessibility compliance
export const accessibilityColors = {
  focusRing: 'rgba(0, 122, 255, 0.25)',
  errorState: '#EF4444',
  successState: '#10B981',
  warningState: '#F59E0B',
  minContrastRatio: 4.5,
};
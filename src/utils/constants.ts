// API endpoints and configurations
export const API_TIMEOUT = 30000; // 30 seconds

// Feature flags
export const FEATURES = {
  ENABLE_MONITORING: import.meta.env.VITE_ENABLE_MONITORING === 'true',
  ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  ENABLE_REAL_TIME: import.meta.env.VITE_ENABLE_REAL_TIME === 'true',
};

// Application constants
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'UGLIES Platform';
export const APP_VERSION = import.meta.env.VITE_APP_VERSION || '1.0.0';
export const APP_ENVIRONMENT = import.meta.env.VITE_APP_ENVIRONMENT || 'development';

// Pagination defaults
export const DEFAULT_PAGE_SIZE = 12;
export const DEFAULT_PAGE = 1;

// Group buy constants
export const GROUP_MIN_PARTICIPANTS = 3;
export const GROUP_MAX_PARTICIPANTS = 50;
export const GROUP_DEFAULT_DURATION_DAYS = 3;

// Currency codes and symbols
export const CURRENCY_CODES = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CNY', 'MXN'];

export const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  CAD: 'C$',
  AUD: 'A$',
  JPY: '¥',
  CNY: '¥',
  MXN: 'Mex$',
};

// Weight/volume units
export const PRODUCT_UNITS = [
  'lb', 'kg', 'oz', 'g',
  'each', 'bunch', 'box', 'crate', 'basket',
  'liter', 'gallon', 'quart', 'pint'
];

// Image defaults
export const DEFAULT_AVATAR = 'https://images.pexels.com/photos/1002703/pexels-photo-1002703.jpeg';
export const DEFAULT_PRODUCT_IMAGE = 'https://images.pexels.com/photos/4207910/pexels-photo-4207910.jpeg';

// Form validation constants
export const MIN_PASSWORD_LENGTH = 8;
export const MAX_PRODUCT_NAME_LENGTH = 100;
export const MAX_PRODUCT_DESCRIPTION_LENGTH = 1000;
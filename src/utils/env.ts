import { z } from 'zod';

const envSchema = z.object({
  // Application
  VITE_APP_NAME: z.string(),
  VITE_APP_VERSION: z.string(),
  VITE_APP_ENVIRONMENT: z.enum(['development', 'staging', 'production']),
  VITE_APP_URL: z.string().url(),

  // Supabase
  VITE_SUPABASE_URL: z.string().url(),
  VITE_SUPABASE_ANON_KEY: z.string(),
  VITE_SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),

  // Feature Flags
  VITE_ENABLE_AUTHENTICATION: z.string().transform(val => val === 'true'),
  VITE_ENABLE_REAL_TIME: z.string().transform(val => val === 'true'),
  VITE_ENABLE_GROUP_BUYING: z.string().transform(val => val === 'true'),
  VITE_ENABLE_PHOTO_ENHANCEMENT: z.string().transform(val => val === 'true'),
  VITE_ENABLE_VIDEO_GENERATION: z.string().transform(val => val === 'true'),
  VITE_ENABLE_AI_RECOMMENDATIONS: z.string().transform(val => val === 'true'),
  VITE_ENABLE_ERROR_MONITORING: z.string().transform(val => val === 'true'),

  // External Services
  VITE_SENTRY_DSN: z.string().optional(),
  VITE_PICA_AI_API_KEY: z.string().optional(),
  VITE_TAVUS_API_KEY: z.string().optional(),
  VITE_DAPPIER_API_KEY: z.string().optional(),
  VITE_REVENUECAT_PUBLIC_KEY: z.string().optional(),

  // Security
  VITE_JWT_EXPIRY: z.string().transform(Number),
  VITE_SESSION_TIMEOUT: z.string().transform(Number),
  VITE_MAX_LOGIN_ATTEMPTS: z.string().transform(Number),
  VITE_API_RATE_LIMIT: z.string().transform(Number),

  // Internationalization
  VITE_DEFAULT_LOCALE: z.string(),
  VITE_SUPPORTED_LOCALES: z.string(),
  VITE_FALLBACK_LOCALE: z.string(),
});

export type Env = z.infer<typeof envSchema>;

function validateEnv(): Env {
  try {
    return envSchema.parse(import.meta.env);
  } catch (error) {
    console.error('Invalid environment variables:', error);
    throw new Error('Invalid environment configuration');
  }
}

export const env = validateEnv();

// Environment helper functions
export const isDevelopment = env.VITE_APP_ENVIRONMENT === 'development';
export const isProduction = env.VITE_APP_ENVIRONMENT === 'production';
export const isFeatureEnabled = (feature: keyof Env) => env[feature] === true;

// Service configuration getters
export const getSupabaseConfig = () => ({
  url: env.VITE_SUPABASE_URL,
  anonKey: env.VITE_SUPABASE_ANON_KEY,
  serviceRoleKey: env.VITE_SUPABASE_SERVICE_ROLE_KEY,
});

export const getSentryConfig = () => ({
  dsn: env.VITE_SENTRY_DSN,
  environment: env.VITE_APP_ENVIRONMENT,
  enabled: isFeatureEnabled('VITE_ENABLE_ERROR_MONITORING'),
});

export const getLocaleConfig = () => ({
  default: env.VITE_DEFAULT_LOCALE,
  supported: env.VITE_SUPPORTED_LOCALES.split(','),
  fallback: env.VITE_FALLBACK_LOCALE,
});
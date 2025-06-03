/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_VERSION: string;
  readonly VITE_APP_ENVIRONMENT: 'development' | 'staging' | 'production';
  readonly VITE_APP_URL: string;
  
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_SUPABASE_SERVICE_ROLE_KEY?: string;
  
  readonly VITE_ENABLE_AUTHENTICATION: string;
  readonly VITE_ENABLE_REAL_TIME: string;
  readonly VITE_ENABLE_GROUP_BUYING: string;
  readonly VITE_ENABLE_PHOTO_ENHANCEMENT: string;
  readonly VITE_ENABLE_VIDEO_GENERATION: string;
  readonly VITE_ENABLE_AI_RECOMMENDATIONS: string;
  readonly VITE_ENABLE_ERROR_MONITORING: string;
  
  readonly VITE_SENTRY_DSN?: string;
  readonly VITE_PICA_AI_API_KEY?: string;
  readonly VITE_TAVUS_API_KEY?: string;
  readonly VITE_DAPPIER_API_KEY?: string;
  readonly VITE_REVENUECAT_PUBLIC_KEY?: string;
  
  readonly VITE_JWT_EXPIRY: string;
  readonly VITE_SESSION_TIMEOUT: string;
  readonly VITE_MAX_LOGIN_ATTEMPTS: string;
  readonly VITE_API_RATE_LIMIT: string;
  
  readonly VITE_DEFAULT_LOCALE: string;
  readonly VITE_SUPPORTED_LOCALES: string;
  readonly VITE_FALLBACK_LOCALE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
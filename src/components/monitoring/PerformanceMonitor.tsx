import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import * as Sentry from '@sentry/react';
import { getCLS, getFID, getLCP, getFCP, getTTFB } from 'web-vitals';
import { useAnalytics } from '@/hooks/useAnalytics';
import { env } from '@/utils/env';

interface PerformanceMonitorProps {
  children: React.ReactNode;
}

export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({ children }) => {
  const location = useLocation();
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    if (env.VITE_ENABLE_PERFORMANCE_MONITORING === 'true') {
      // Core Web Vitals monitoring
      getCLS(metric => {
        trackEvent('web_vital_cls', {
          value: metric.value,
          path: location.pathname
        });
        
        if (metric.value > 0.1) {
          Sentry.captureMessage('High CLS detected', {
            level: 'warning',
            extra: {
              cls: metric.value,
              path: location.pathname
            }
          });
        }
      });

      getFID(metric => {
        trackEvent('web_vital_fid', {
          value: metric.value,
          path: location.pathname
        });
        
        if (metric.value > 100) {
          
          Sentry.captureMessage('High FID detected', {
            level: 'warning',
            extra: {
              fid: metric.value,
              path: location.pathname
            }
          });
        }
      });

      getLCP(metric => {
        trackEvent('web_vital_lcp', {
          value: metric.value,
          path: location.pathname
        });
        
        if (metric.value > 2500) {
          Sentry.captureMessage('High LCP detected', {
            level: 'warning',
            extra: {
              lcp: metric.value,
              path: location.pathname
            }
          });
        }
      });

      getFCP(metric => {
        trackEvent('web_vital_fcp', {
          value: metric.value,
          path: location.pathname
        });
      });

      getTTFB(metric => {
        trackEvent('web_vital_ttfb', {
          value: metric.value,
          path: location.pathname
        });
        
        if (metric.value > 600) {
          Sentry.captureMessage('High TTFB detected', {
            level: 'warning',
            extra: {
              ttfb: metric.value,
              path: location.pathname
            }
          });
        }
      });

      // Navigation timing
      window.addEventListener('load', () => {
        setTimeout(() => {
          const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
          
          if (navigation) {
            const timing = {
              dns: navigation.domainLookupEnd - navigation.domainLookupStart,
              tcp: navigation.connectEnd - navigation.connectStart,
              ssl: navigation.connectEnd - navigation.secureConnectionStart,
              ttfb: navigation.responseStart - navigation.requestStart,
              download: navigation.responseEnd - navigation.responseStart,
              dom: navigation.domComplete - navigation.domInteractive,
              load: navigation.loadEventEnd - navigation.loadEventStart,
              total: navigation.loadEventEnd - navigation.startTime
            };

            trackEvent('page_load_timing', {
              ...timing,
              path: location.pathname
            });

            // Alert if total load time is over budget
            if (timing.total > 3000) {
              Sentry.captureMessage('Page load time exceeded budget', {
                level: 'warning',
                extra: {
                  timing,
                  path: location.pathname
                }
              });
            }
          }
        }, 0);
      });

      // Memory usage monitoring
      if (performance.memory) {
        setInterval(() => {
          const memory = performance.memory;
          if (memory.usedJSHeapSize > memory.jsHeapSizeLimit * 0.9) {
            Sentry.captureMessage('High memory usage detected', {
              level: 'warning',
              extra: {
                usedHeap: memory.usedJSHeapSize,
                totalHeap: memory.totalJSHeapSize,
                heapLimit: memory.jsHeapSizeLimit,
                path: location.pathname
              }
            });
          }
        }, 30000);
      }

      // Long task monitoring
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.duration > 50) {
            trackEvent('long_task_detected', {
              duration: entry.duration,
              path: location.pathname
            });
          }
        });
      });

      observer.observe({ entryTypes: ['longtask'] });

      return () => {
        observer.disconnect();
      };
    }
  }, [location.pathname, trackEvent]);

  return <>{children}</>;
};
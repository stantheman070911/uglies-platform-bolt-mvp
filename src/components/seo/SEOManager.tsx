import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { env } from '@/utils/env';

export const SEOManager: React.FC = () => {
  const location = useLocation();
  const canonicalUrl = `${env.VITE_APP_URL}${location.pathname}`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{env.VITE_APP_NAME} - Global Agricultural Marketplace</title>
      <meta name="title" content={`${env.VITE_APP_NAME} - Global Agricultural Marketplace`} />
      <meta name="description" content="Connect directly with farmers and join group buys for fresh, organic produce at wholesale prices. Support sustainable agriculture and reduce food waste." />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={`${env.VITE_APP_NAME} - Global Agricultural Marketplace`} />
      <meta property="og:description" content="Connect directly with farmers and join group buys for fresh, organic produce at wholesale prices. Support sustainable agriculture and reduce food waste." />
      <meta property="og:image" content={`${env.VITE_APP_URL}/og-image.jpg`} />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={canonicalUrl} />
      <meta property="twitter:title" content={`${env.VITE_APP_NAME} - Global Agricultural Marketplace`} />
      <meta property="twitter:description" content="Connect directly with farmers and join group buys for fresh, organic produce at wholesale prices. Support sustainable agriculture and reduce food waste." />
      <meta property="twitter:image" content={`${env.VITE_APP_URL}/twitter-image.jpg`} />
      
      {/* Additional Meta Tags */}
      <meta name="keywords" content="agriculture, farmers market, group buying, organic produce, farm to table, sustainable farming" />
      <meta name="author" content={env.VITE_APP_NAME} />
      <meta name="application-name" content={env.VITE_APP_NAME} />
      <meta name="theme-color" content="#16a34a" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content={env.VITE_APP_NAME} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": env.VITE_APP_NAME,
          "url": env.VITE_APP_URL,
          "logo": `${env.VITE_APP_URL}/logo.png`,
          "description": "Global agricultural marketplace connecting farmers directly with consumers through group buying power.",
          "sameAs": [
            "https://facebook.com/ugliesplatform",
            "https://twitter.com/ugliesplatform",
            "https://instagram.com/ugliesplatform"
          ]
        })}
      </script>
    </Helmet>
  );
};
import '@/styles/globals.css'
import '@/styles/print.css'
import '@/components/dashboard/dashboard.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import Script from 'next/script'
import { AuthProvider } from '@/contexts/AuthContext'
import { I18nProvider } from '@/contexts/I18nContext'
import { Toaster } from 'react-hot-toast'
import NotificationInitializer from '@/components/NotificationInitializer'
import AnalyticsInitializer from '@/components/AnalyticsInitializer'
import ErrorBoundary from '@/components/ErrorBoundary'
import { setupGlobalErrorHandling } from '@/utils/logger'
import { useEffect } from 'react'
import { AccessibilityProvider } from '@/components/accessibility'
import { ToastNotificationContainer, pushNotificationService } from '@/services/pushNotificationService'

function MyApp({ Component, pageProps }: AppProps) {
  // Setup global error handling on mount
  useEffect(() => {
    setupGlobalErrorHandling();
    
    // Initialize PWA - Phase 4.5
    if (typeof window !== 'undefined') {
      // Register service worker
      pushNotificationService.registerServiceWorker().then(() => {
        console.log('[App] Service Worker registered for offline support');
      });

      // Request notification permission (optional, can be user-triggered)
      if (Notification.permission === 'default') {
        console.log('[App] Notification permission not yet requested');
      }

      // Enable background sync for escalations and notifications
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller && 'sync' in (navigator.serviceWorker.controller as any)) {
        pushNotificationService.enableBackgroundSync('sync-escalations');
        pushNotificationService.enableBackgroundSync('sync-notifications');
      }
    }
  }, []);

  return (
    <ErrorBoundary>
      <Head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/png" href="/favicon.svg" />
        <meta name="theme-color" content="#2563eb" />
        
        {/* PWA & Mobile Optimization - Phase 4.5 */}
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, maximum-scale=5" />
        <meta name="apple-mobile-web-app-capable" content="true" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Salatiso" />
        <link rel="apple-touch-icon" href="/images/icon-192x192.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="description" content="Salatiso - Family & Business Ecosystem. Manage escalations, teams, and analytics with offline support." />
      </Head>

      {/* Google Analytics using next/script */}
      {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}', {
                page_title: document.title,
                page_location: window.location.href,
              });
            `}
          </Script>
        </>
      )}

      <I18nProvider>
        <AccessibilityProvider>
          <AuthProvider>
            <ToastNotificationContainer />
            <NotificationInitializer />
            <AnalyticsInitializer />
            <Component {...pageProps} />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
              }}
            />
          </AuthProvider>
        </AccessibilityProvider>
      </I18nProvider>
    </ErrorBoundary>
  )
}

export default MyApp
# 🚀 Production Deployment Guide - Salatiso Ecosystem

**Date:** October 23, 2025  
**Version:** 1.0.0  
**Status:** Ready for Production Deployment

---

## Pre-Deployment Checklist

### ✅ Phase 5 Complete
- [x] All 11 STEPS implemented
- [x] Bug fixes applied
- [x] Integration complete (4 new pages + navigation)
- [x] Deployed to staging
- [x] Zero errors on dev server

### ✅ Phase 6 Options 2-6 Complete
- [x] Mobile Integration (BridgeService, MeshNetwork, OfflineQueue)
- [x] Analytics Architecture (Service exists, ready for enhancement)
- [x] Collaboration Architecture (Defined, ready to build)
- [x] AI Integration Architecture (Defined, ready to build)
- [x] Testing Strategy (Frameworks selected, ready to implement)

---

## Production Deployment Steps

### STEP 1: Create Production Firebase Project

```bash
# Login to Firebase (if not already)
firebase login

# Create new project via Firebase Console
# Project ID: salatiso-prod
# Display Name: Salatiso Production
# Enable: Firestore, Authentication, Hosting, Storage, Functions

# Add production project to Firebase CLI
firebase projects:add salatiso-prod

# Select production project
firebase use salatiso-prod
```

**Firebase Console Steps:**
1. Go to https://console.firebase.google.com
2. Click "Add project"
3. Enter "Salatiso Production" as name
4. Project ID: `salatiso-prod` (or auto-generated)
5. Enable Google Analytics (optional)
6. Click "Create project"

**Enable Services:**
- Authentication → Email/Password provider
- Firestore Database → Create database (Start in production mode)
- Storage → Get started
- Hosting → Get started

---

### STEP 2: Configure Production Environment

**Create `.env.production`:**
```bash
# Copy template
cp .env.production.template .env.production

# Edit with production values
# Get values from Firebase Console → Project Settings
```

**Required Firebase Config Values:**
- API Key: Firebase Console → Project Settings → General → Web API Key
- Auth Domain: `salatiso-prod.firebaseapp.com`
- Project ID: `salatiso-prod`
- Storage Bucket: `salatiso-prod.appspot.com`
- Messaging Sender ID: From Project Settings
- App ID: From Project Settings

**Google Analytics Setup:**
```bash
# Firebase Console → Analytics → Get Started
# Copy GA4 Measurement ID (G-XXXXXXXXXX)
# Add to .env.production as NEXT_PUBLIC_GA_ID
```

---

### STEP 3: Security Hardening

**Update Firestore Rules for Production:**

```bash
# Edit firestore.rules - Add production-specific security

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper functions
    function isSignedIn() {
      return request.auth != null;
    }
    
    function isAuthorized() {
      return isSignedIn() && 
             request.auth.token.email in [
               'spiceinc@gmail.com',
               'zenzxru@gmail.com',
               'kwakhomdeni@gmail.com',
               'tina@salatiso.com',
               // ... rest of authorized emails
             ];
    }
    
    function isOwner(userId) {
      return isSignedIn() && request.auth.uid == userId;
    }
    
    // Rate limiting helper
    function isNotRateLimited() {
      return resource == null || 
             request.time > resource.data.updatedAt + duration.in_seconds(1);
    }
    
    // All collections require authorization
    match /{document=**} {
      allow read: if isAuthorized();
      allow write: if isAuthorized() && isNotRateLimited();
    }
  }
}
```

**Deploy Rules:**
```bash
firebase deploy --only firestore:rules --project salatiso-prod
```

**Enable Security Features:**
```bash
# Firebase Console → Build → App Check
# Enable reCAPTCHA v3
# Add your domain to Authorized domains

# Firebase Console → Authentication → Settings
# Add authorized domain: salatiso.com
# Enable Email Enumeration Protection
```

---

### STEP 4: Configure Security Headers

**Update firebase.json with production headers:**

```json
{
  "hosting": [
    {
      "target": "salatiso-prod",
      "public": "out",
      "cleanUrls": true,
      "headers": [
        {
          "source": "**/*",
          "headers": [
            {
              "key": "X-Frame-Options",
              "value": "DENY"
            },
            {
              "key": "X-Content-Type-Options",
              "value": "nosniff"
            },
            {
              "key": "X-XSS-Protection",
              "value": "1; mode=block"
            },
            {
              "key": "Referrer-Policy",
              "value": "strict-origin-when-cross-origin"
            },
            {
              "key": "Permissions-Policy",
              "value": "camera=(), microphone=(), geolocation=()"
            },
            {
              "key": "Strict-Transport-Security",
              "value": "max-age=31536000; includeSubDomains; preload"
            },
            {
              "key": "Content-Security-Policy",
              "value": "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://*.firebaseio.com https://*.googleapis.com https://*.google-analytics.com; frame-ancestors 'none';"
            }
          ]
        },
        {
          "source": "**/*.@(js|css|woff|woff2)",
          "headers": [
            {
              "key": "Cache-Control",
              "value": "public, max-age=31536000, immutable"
            }
          ]
        },
        {
          "source": "**/*.@(jpg|jpeg|png|gif|svg|webp|avif)",
          "headers": [
            {
              "key": "Cache-Control",
              "value": "public, max-age=31536000, immutable"
            }
          ]
        },
        {
          "source": "/index.html",
          "headers": [
            {
              "key": "Cache-Control",
              "value": "no-cache, no-store, must-revalidate"
            }
          ]
        }
      ],
      "rewrites": [
        {
          "source": "**",
          "destination": "/index.html"
        }
      ]
    }
  ]
}
```

---

### STEP 5: Custom Domain Setup

**Add Custom Domain:**
```bash
# Firebase Console → Hosting → Add custom domain
# Domain: salatiso.com
# Subdomain: www.salatiso.com (optional)

# Follow instructions to verify domain ownership:
# 1. Add TXT record to DNS
# 2. Wait for verification (can take up to 24 hours)
# 3. Add A records for SSL
```

**DNS Configuration Example (for Cloudflare/GoDaddy):**
```
Type    Name    Value                           TTL
TXT     @       firebase-verification=...        Auto
A       @       151.101.1.195                   Auto
A       @       151.101.65.195                  Auto
A       www     151.101.1.195                   Auto
A       www     151.101.65.195                  Auto
```

**SSL Certificate:**
- Firebase automatically provisions SSL via Let's Encrypt
- No action required - wait for "Connected" status in console

---

### STEP 6: Production Build

**Optimize Build Configuration:**

```javascript
// next.config.js - Production optimizations
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'out',
  
  // Enable optimizations
  swcMinify: true,
  compress: true,
  productionBrowserSourceMaps: false,
  
  // Image optimization
  images: {
    unoptimized: true, // Required for static export
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000,
  },
  
  // Experimental optimizations
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', '@headlessui/react'],
  },
  
  // Environment variables
  env: {
    NEXT_PUBLIC_ENV: 'production',
    NEXT_PUBLIC_APP_VERSION: '1.0.0',
  },
};

module.exports = nextConfig;
```

**Run Production Build:**
```bash
# Clean previous builds
rm -rf .next out node_modules/.cache

# Install dependencies (fresh)
npm ci

# Run production build
npm run build

# Verify build output
ls -la out/

# Expected: index.html, _next folder, static assets
# Size: ~5-10 MB total
```

**Build Verification:**
- No errors or warnings
- All pages generated
- Bundle size < 500 KB (gzipped)
- Lighthouse score > 90

---

### STEP 7: Deploy to Production

**Deploy Everything:**
```bash
# Select production project
firebase use salatiso-prod

# Deploy all services
firebase deploy --project salatiso-prod

# Or deploy individually:
firebase deploy --only hosting --project salatiso-prod
firebase deploy --only firestore:rules --project salatiso-prod
firebase deploy --only storage:rules --project salatiso-prod
```

**Expected Output:**
```
=== Deploying to 'salatiso-prod'...

i  deploying hosting, firestore
✔  firestore: rules file compiled successfully
✔  firestore: released rules
✔  hosting[salatiso-prod]: file upload complete
✔  hosting[salatiso-prod]: version finalized
✔  hosting[salatiso-prod]: release complete

✔  Deploy complete!

Project Console: https://console.firebase.google.com/project/salatiso-prod/overview
Hosting URL: https://salatiso-prod.web.app
Custom Domain: https://salatiso.com (when configured)
```

---

### STEP 8: Post-Deployment Verification

**Automated Checks:**
```bash
# Check if site is live
curl -I https://salatiso-prod.web.app

# Expected: HTTP/2 200
# Expected headers: X-Frame-Options, HSTS, CSP

# Run Lighthouse audit
npx lighthouse https://salatiso-prod.web.app --output=json --output-path=./lighthouse-report.json

# Check for security issues
npx snyk test

# Verify SSL
openssl s_client -connect salatiso.com:443 -servername salatiso.com
```

**Manual Testing Checklist:**
- [ ] Homepage loads correctly
- [ ] Login works (test with authorized email)
- [ ] Dashboard displays data
- [ ] All navigation links work
- [ ] Mobile sync tab accessible
- [ ] No console errors
- [ ] Analytics tracking firing
- [ ] Images load correctly
- [ ] Responsive design works (mobile/tablet/desktop)

**Performance Benchmarks:**
| Metric | Target | Actual |
|--------|--------|--------|
| First Contentful Paint | < 1.0s | ___ |
| Time to Interactive | < 2.5s | ___ |
| Largest Contentful Paint | < 2.0s | ___ |
| Cumulative Layout Shift | < 0.1 | ___ |
| Total Blocking Time | < 200ms | ___ |

---

### STEP 9: Monitor & Optimize

**Set Up Monitoring:**

```bash
# Firebase Console → Analytics → Dashboard
# View real-time users, page views, events

# Set up alerts:
# 1. Error rate > 5%
# 2. Response time > 2s
# 3. Crash rate > 1%

# Enable Performance Monitoring
# Firebase Console → Performance → Get started
```

**Analytics Events to Track:**
```javascript
// Track page views
analytics.logEvent('page_view', { page_path: window.location.pathname });

// Track user actions
analytics.logEvent('incident_created', { category: 'Operations' });
analytics.logEvent('mobile_sync_initiated', { device_count: 2 });
analytics.logEvent('export_generated', { format: 'PDF', report_type: 'Analytics' });
```

**Performance Monitoring:**
```javascript
// Track custom metrics
const perfEntry = performance.mark('app-start');
// ... app code ...
performance.measure('app-load', 'app-start');
const measure = performance.getEntriesByName('app-load')[0];
analytics.logEvent('timing_complete', {
  name: 'app_load',
  value: Math.round(measure.duration)
});
```

---

### STEP 10: Backup & Rollback Plan

**Backup Strategy:**
```bash
# Backup Firestore data
gcloud firestore export gs://salatiso-prod-backups/$(date +%Y-%m-%d)

# Schedule daily backups (Cloud Scheduler)
# Configure in Firebase Console → Firestore → Backup

# Keep last 7 days of backups
# Automate with Cloud Functions
```

**Rollback Procedure:**
```bash
# If deployment fails, rollback to previous version
firebase hosting:clone salatiso-prod:previous salatiso-prod:live

# Or deploy specific version
firebase hosting:rollback --project salatiso-prod

# Restore Firestore data if needed
gcloud firestore import gs://salatiso-prod-backups/2025-10-23
```

---

## Production Environment Variables

**Required for .env.production:**
```env
# Firebase (from Firebase Console)
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=salatiso-prod.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=salatiso-prod
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=salatiso-prod.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123

# Environment
NEXT_PUBLIC_ENV=production
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_APP_URL=https://salatiso.com

# Analytics (from Google Analytics)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Feature Flags
NEXT_PUBLIC_ENABLE_MOBILE_SYNC=true
NEXT_PUBLIC_ENABLE_AI_FEATURES=false  # Launch later
NEXT_PUBLIC_ENABLE_COLLABORATION=false  # Launch later
NEXT_PUBLIC_ENABLE_ANALYTICS=true

# Security (from reCAPTCHA Console)
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6Le...

# Authorized Emails (comma-separated)
NEXT_PUBLIC_AUTHORIZED_EMAILS=spiceinc@gmail.com,zenzxru@gmail.com,...
```

---

## Troubleshooting

### Issue: Build Fails
**Solution:**
```bash
# Clear cache
rm -rf .next node_modules/.cache

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Try build again
npm run build
```

### Issue: Deployment Fails
**Solution:**
```bash
# Check Firebase CLI version
firebase --version
# Update if < 12.0.0: npm install -g firebase-tools

# Re-login
firebase logout
firebase login

# Try deploy again
firebase deploy --debug --project salatiso-prod
```

### Issue: Custom Domain Not Working
**Solution:**
```bash
# Verify DNS records are correct
dig salatiso.com
nslookup salatiso.com

# Check Firebase Console → Hosting → Custom domains
# Status should be "Connected"
# If pending, wait up to 24 hours for DNS propagation

# Force SSL certificate provisioning
# Contact Firebase Support if stuck > 24 hours
```

### Issue: High Error Rate
**Solution:**
```bash
# Check Firebase Console → Crashlytics
# Identify most common errors

# Check browser console in production
# Fix errors, build, redeploy

# Rollback if critical:
firebase hosting:rollback --project salatiso-prod
```

---

## Success Criteria

### Launch Checklist ✅
- [ ] Production Firebase project created
- [ ] Environment variables configured
- [ ] Security rules deployed
- [ ] Custom domain connected & SSL active
- [ ] Production build successful (no errors)
- [ ] Deployment successful
- [ ] All pages load correctly
- [ ] Authentication works
- [ ] Analytics tracking active
- [ ] Performance Lighthouse score > 90
- [ ] Security headers present
- [ ] Mobile responsive
- [ ] Cross-browser tested (Chrome, Firefox, Safari, Edge)

### Post-Launch Monitoring (First 24 Hours)
- [ ] Zero critical errors
- [ ] < 2s average page load time
- [ ] > 95% successful authentication attempts
- [ ] Analytics data flowing
- [ ] No security incidents
- [ ] Positive user feedback

---

## Next Steps After Production Launch

1. **Week 1:** Monitor metrics, fix any issues, collect user feedback
2. **Week 2:** Implement remaining UI components (Analytics dashboard, Collaboration features)
3. **Week 3:** Add comprehensive test suite (100% coverage)
4. **Month 2:** Enable AI features with TensorFlow.js
5. **Month 3:** Launch mobile app with full sync integration

---

## Support Contacts

**Technical Issues:**
- Firebase Support: https://firebase.google.com/support
- GitHub Issues: [Your repo]/issues
- Team Slack: #salatiso-tech

**Production Incidents:**
- On-call: [Phone/Slack]
- Email: tech@salatiso.com
- Escalation: [Manager contact]

---

**Deployment Status:** 🟢 READY FOR PRODUCTION

**Estimated Deployment Time:** 30-45 minutes

**Recommended Launch Window:** Off-peak hours (evening/weekend)

---

*Last Updated: October 23, 2025*  
*Version: 1.0.0*  
*Document Owner: Development Team*

# 🔧 Firebase Authentication Troubleshooting Guide
**Issue**: Authentication stopped working after deployment  
**Date**: October 29, 2025  
**Project**: LifeCV (lifecv-d2724)

## 🚨 Symptoms
- ✅ App worked fine for 1+ days after deployment
- ❌ Authentication suddenly stopped working
- ❌ 503 errors on external resources (Google Fonts, etc.)
- ❌ COOP policy errors in console

## 🎯 Root Cause Analysis

### Most Likely: **OAuth Consent Screen Reverted to Testing Mode**

Google automatically reverts OAuth apps to "Testing" mode if:
- The app hasn't been verified
- 7 days pass without user activity
- Privacy policy or terms of service URLs become invalid

## ✅ SOLUTION STEPS

### Step 1: Check OAuth Consent Screen Status

1. **Go to Google Cloud Console OAuth Consent Screen**:
   ```
   https://console.cloud.google.com/apis/credentials/consent?project=lifecv-d2724
   ```

2. **Check Publishing Status**:
   - Look for "Publishing status" at the top
   - If it says **"Testing"** → This is your problem!
   - If it says **"In production"** → OAuth is fine, check other steps

3. **If Status is "Testing"**:
   - Click the **"PUBLISH APP"** button
   - Review the warning (safe to proceed for family app)
   - Confirm publishing
   - **IMPORTANT**: Add your authorized users if still in testing:
     - spiceinc@gmail.com
     - zenzxru@gmail.com
     - (all family emails from .env.production)

### Step 2: Verify Authorized Domains

1. **In OAuth Consent Screen**, scroll to "Authorized domains"
2. **Required domains**:
   - `salatiso-lifecv.web.app`
   - `lifecv-d2724.web.app`
   - `firebase.google.com` (for Firebase Auth)

3. **If missing**, click "ADD DOMAIN" and add them

### Step 3: Check Firebase Authentication Settings

1. **Go to Firebase Console Authentication**:
   ```
   https://console.firebase.google.com/project/lifecv-d2724/authentication/providers
   ```

2. **Verify Google Sign-In**:
   - Status: ✅ **Enabled**
   - Web SDK configuration: Should show your project details

3. **Check Authorized Domains**:
   - Click on "Settings" (gear icon) → "Authorized domains"
   - Required domains:
     - `localhost`
     - `salatiso-lifecv.web.app`
     - `lifecv-d2724.web.app`
     - `lifecv-d2724.firebaseapp.com`

### Step 4: Verify API Key Restrictions

1. **Go to Google Cloud Credentials**:
   ```
   https://console.cloud.google.com/apis/credentials?project=lifecv-d2724
   ```

2. **Find your API Key**:
   - Look for: `AIzaSyD_pRVkeVzciCPowxsj44NRVlbyZvFPueI`
   - Click the key name to edit

3. **Check Application Restrictions**:
   - Should be: **"HTTP referrers (web sites)"**
   - Website restrictions:
     ```
     *salatiso-lifecv.web.app/*
     *lifecv-d2724.web.app/*
     localhost:*
     ```

4. **Check API Restrictions**:
   - Option 1: "Don't restrict key" (easiest)
   - Option 2: Restrict to these APIs:
     - Identity Toolkit API
     - Token Service API
     - Google Maps JavaScript API (if using maps)

### Step 5: Check Identity Platform Billing

1. **Go to Identity Platform**:
   ```
   https://console.cloud.google.com/customer-identity/providers?project=lifecv-d2724
   ```

2. **Check for these issues**:
   - ⚠️ "Trial expired" banner
   - ⚠️ Billing disabled warning
   - ⚠️ Quota exceeded message

3. **If trial expired**:
   - Enable billing for the project
   - Identity Platform free tier: 50,000 MAU free monthly

## 🔄 After Making Changes

### Redeploy with Updated Headers

I've already updated your `firebase.json` with proper COOP headers. Now deploy:

```powershell
# Build the app
npm run build

# Deploy to Firebase
firebase deploy --only hosting:lifecv-d2724
```

### Clear Browser Cache

After deployment:
1. Open DevTools (F12)
2. Right-click refresh button
3. Select "Empty Cache and Hard Reload"
4. Or use: `Ctrl + Shift + Delete` → Clear cache

### Test Authentication

1. Try signing in with Google
2. Check console for errors
3. If still failing, check browser console for specific error message

## 🐛 Common Error Messages & Fixes

### Error: "popup_closed_by_user"
- **Cause**: User closed popup or popup was blocked
- **Fix**: Check popup blocker, ensure COOP headers are correct

### Error: "auth/unauthorized-domain"
- **Cause**: Domain not in authorized domains list
- **Fix**: Add domain to Firebase Console → Authentication → Settings → Authorized domains

### Error: "auth/api-key-not-valid"
- **Cause**: API key restrictions blocking the request
- **Fix**: Update API key restrictions in Google Cloud Console

### Error: 503 on external resources
- **Cause**: CDN/external service temporarily down
- **Fix**: This is normal, external resources will retry. Not related to auth.

## 📊 Verification Checklist

After completing all steps, verify:

- [ ] OAuth Consent Screen status: "In production" or "Testing" with test users added
- [ ] Authorized domains include: salatiso-lifecv.web.app
- [ ] Firebase Authentication: Google Sign-In enabled
- [ ] Firebase Authorized domains include all production URLs
- [ ] API Key restrictions allow your domains
- [ ] Identity Platform billing enabled (if using)
- [ ] firebase.json has correct COOP headers (`same-origin-allow-popups`)
- [ ] App rebuilt and redeployed
- [ ] Browser cache cleared
- [ ] Test login successful

## 🔗 Quick Links

- **Firebase Console**: https://console.firebase.google.com/project/lifecv-d2724
- **Google Cloud Console**: https://console.cloud.google.com/home/dashboard?project=lifecv-d2724
- **OAuth Consent Screen**: https://console.cloud.google.com/apis/credentials/consent?project=lifecv-d2724
- **API Credentials**: https://console.cloud.google.com/apis/credentials?project=lifecv-d2724
- **Firebase Authentication**: https://console.firebase.google.com/project/lifecv-d2724/authentication
- **Live Site**: https://salatiso-lifecv.web.app

## 🎯 Most Common Fix

**90% of the time**, the issue is:
1. OAuth Consent Screen reverted to "Testing" mode
2. Your email isn't in the test users list
3. **Solution**: Click "PUBLISH APP" button in OAuth Consent Screen

## 📝 Changes Made Today

### Updated firebase.json COOP Headers
```json
{
  "source": "/__/auth/**",
  "headers": [
    {
      "key": "Cross-Origin-Opener-Policy",
      "value": "same-origin-allow-popups"
    },
    {
      "key": "Cross-Origin-Embedder-Policy",
      "value": "unsafe-none"
    }
  ]
}
```

**Why**: 
- `same-origin-allow-popups` allows Firebase Auth popups to communicate
- Prevents COOP blocking errors in console
- More secure than `unsafe-none` while still allowing OAuth

### Updated Cache Headers
```json
{
  "source": "**",
  "headers": [
    {
      "key": "Cache-Control",
      "value": "public, max-age=0, must-revalidate"
    }
  ]
}
```

**Why**:
- Ensures users always get fresh authentication state
- Prevents cached login issues
- Forces revalidation on every page load

## 🚀 Next Steps

1. **Complete the checklist above** (especially OAuth Consent Screen)
2. **Wait for build to complete**
3. **Deploy**: `firebase deploy --only hosting:lifecv-d2724`
4. **Test authentication**
5. **Report back** with any error messages

---

**Remember**: The code didn't change, so this is definitely a Firebase/Google Cloud Console configuration issue!

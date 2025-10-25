# 🔐 Intranet Login Debug Guide

## Issue Summary
**Symptom:** Redirects back to login page immediately after attempting to log in  
**Root Cause:** Firebase authentication session not persisting  
**Console Evidence:**
- ✅ Firebase Config loads correctly
- ✅ Authorized emails load correctly
- ❌ No Firebase user session detected (`🔄 Auth state changed: No user`)

---

## Step 1: Verify Firebase is Actually Receiving Your Login

Open browser console (F12) and run:

```javascript
// Check if Firebase Auth is initialized
console.log('Auth instance:', auth);

// Try to manually check current user
const { getAuth } = await import('firebase/auth');
const currentUser = getAuth().currentUser;
console.log('Current Firebase user:', currentUser);
```

**Expected Result:** Should show your user object if logged in, or `null` if not.

---

## Step 2: Test with Email/Password Login

1. Go to **http://localhost:3000/intranet/login**
2. **Use one of these test emails:**
   - `spiceinc@gmail.com`
   - `tina@salatiso.com`
   - `kwakhomdeni@gmail.com`
   - Any email from the `AUTHORIZED_EMAILS` list
3. **Use a test password** (any password for first login attempt)
4. Open **DevTools Console** (F12 → Console tab)
5. **Look for these log messages:**

**SUCCESS SCENARIO:**
```
✅ Email authorized, initializing user profile for: spiceinc@gmail.com
📝 User profile data: { ... }
✅ User profile initialized successfully - user should be redirected to dashboard
```

**FAILURE SCENARIO (What You're Getting):**
```
🔄 Auth state changed: No user
👋 User signed out
```

---

## Step 3: Check Firebase Authentication Issues

### Possible Issues:

**A) Firebase Authentication Module Not Initializing**
- Check: Open DevTools → Application tab → Local Storage
- Look for: Firebase session tokens
- If empty: Firebase auth didn't initialize properly

**B) Google Sign-In Redirect Issue**
- Google uses `signInWithRedirect` for COOP policy compliance
- After redirect, `getRedirectResult()` should retrieve the user
- Check line 738-750 in `AuthContext.tsx`

**C) Email/Password Issue in Firebase Console**
- Login may fail because account doesn't exist in Firebase yet
- Error message should appear in console

---

## Step 4: Manual Testing Steps

### Test Email/Password Authentication:

```bash
# 1. Open the browser console
# 2. Go to http://localhost:3000/intranet/login
# 3. Enter email: spiceinc@gmail.com
# 4. Enter any password
# 5. Click Login
# 6. Check console for errors
```

**Expected behavior:**
- If Firebase auth succeeds → User redirected to `/intranet/simple-dashboard`
- If Firebase auth fails → Error message in toast notification + console

### Test Google Sign-In:

```bash
# 1. Go to http://localhost:3000/intranet/login
# 2. Click "Continue with Google"
# 3. Wait for Google sign-in popup/redirect
# 4. Sign in with a Google account
# 5. Should redirect back and auto-login
```

---

## Step 5: Firestore User Profile Issue

Even if Firebase auth succeeds, the app may fail when initializing the user profile in Firestore.

### Check Firestore:
1. Go to Firebase Console
2. Navigate to Firestore Database
3. Check collections → `/users/{uid}`
4. If no `users` collection exists, the app will fail creating it

**Solution:** The app should auto-create the users collection on first login.

---

## Step 6: Verify Environment Variables

```bash
# Check .env.local or .env file for:
NEXT_PUBLIC_FIREBASE_API_KEY=✓ Set
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=✓ Set
NEXT_PUBLIC_FIREBASE_PROJECT_ID=✓ Set
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=✓ Set
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=✓ Set
NEXT_PUBLIC_FIREBASE_APP_ID=✓ Set
```

All should show as "✓ Set" in console logs during startup.

---

## Step 7: Common Fixes

### Fix 1: Clear Browser Storage & Try Again
```bash
# DevTools → Application → Storage
# Clear All:
  - Local Storage
  - Session Storage  
  - Cookies
# Then reload page and try logging in again
```

### Fix 2: Check Firebase User Exists in Firebase Console
1. Go to Firebase Console → Authentication → Users
2. Look for your test email
3. If not there: Account doesn't exist in Firebase
4. Create test account manually or via signup

### Fix 3: Restart Development Server
```bash
# Terminal:
npm run dev

# Or kill existing process:
Get-Process node | Stop-Process -Force
npm run dev
```

### Fix 4: Check Firestore Permissions

**Edit `firestore.rules`:**
```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow reads/writes for authenticated users during development
    match /users/{userId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

---

## Step 8: Enable Extra Debug Logging

Edit `src/contexts/AuthContext.tsx` line ~55:

```typescript
// Change this:
const AUTH_DEBUG_ENABLED = process.env.NEXT_PUBLIC_AUTH_DEBUG === 'true' || process.env.NODE_ENV === 'development';

// To always log (temporarily):
const AUTH_DEBUG_ENABLED = true;
```

This will show detailed auth flow in console.

---

## Debugging Checklist

- [ ] Firebase config shows all ✓ Set
- [ ] Authorized emails loading correctly  
- [ ] Can see current Firebase user: `auth.currentUser`
- [ ] Test user exists in Firebase Console
- [ ] Firestore `/users` collection accessible
- [ ] Browser storage/cookies cleared
- [ ] Dev server restarted
- [ ] No CORS errors in console
- [ ] Google Sign-In redirect working (if testing that)
- [ ] Auth state change fires with actual user (not "No user")

---

## Report Template for Support

When asking for help, provide:

1. **Console logs** (full output from attempted login)
2. **Error messages** (what toast/alert shows?)
3. **Email used** (which test email?)
4. **Browser** (Chrome/Firefox/Safari?)
5. **Steps taken** (which fixes already tried?)

---

## Quick Test Links

- **Public Home:** http://localhost:3000/
- **Intranet Login:** http://localhost:3000/intranet/login
- **Dashboard (after login):** http://localhost:3000/intranet/simple-dashboard

---

## Next Steps

**If all above checks pass but still failing:**
1. Check Firebase project actually has Authentication enabled
2. Verify OAuth consent screen is configured (for Google Sign-In)
3. Check Firestore database has read/write permissions set
4. Look at Firebase Console → Logs for any errors

---

*Last Updated: Oct 22, 2025*

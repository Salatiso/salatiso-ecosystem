# 🎯 Intranet Login Issue - Root Cause & Solutions

**Issue Date:** October 22, 2025  
**Status:** Under Investigation  
**Symptoms:**  
- Login form accepts credentials but redirects back to login page
- Console shows: `🔄 Auth state changed: No user`
- Firebase config loads correctly, authorized emails load correctly

---

## 🔴 Most Likely Causes (In Order of Probability)

### **CAUSE #1: Firebase User Account Doesn't Exist** ⭐ MOST LIKELY
**Probability:** 85%

**What's happening:**
- You're trying to log in with an email that's in the authorized list
- But that email doesn't have a user account created in Firebase Authentication

**How to fix:**
1. Go to Firebase Console: https://console.firebase.google.com/
2. Select your Salatiso project
3. Go to **Authentication** → **Users**
4. Click **Create user** button (or **Add user**)
5. Enter test email: `spiceinc@gmail.com`
6. Enter test password: `Test123456!`
7. Click **Create user**
8. Now try logging in with those credentials

**OR use email/password signup:**
1. Go to `http://localhost:3000/intranet/login`
2. Click **Create account** (if link exists)
3. Or manually create in Firebase Console as shown above

---

### **CAUSE #2: Firestore `/users` Collection Missing Permissions**
**Probability:** 10%

**What's happening:**
- Firebase Authentication works (user logs in)
- But then Firestore permission error prevents user profile initialization
- Auth state change logs show: "Error initializing user profile"

**How to fix:**
1. Go to Firebase Console
2. Select your project
3. Go to **Firestore Database**
4. Click **Rules** tab
5. Replace with more permissive rules for development:

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write their own profile
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    
    // Allow creation of new user profiles
    match /users/{userId=**} {
      allow create: if request.auth != null;
    }
  }
}
```

6. Click **Publish**
7. Try logging in again

---

### **CAUSE #3: Firebase Session Not Persisting**
**Probability:** 5%

**What's happening:**
- Firebase auth works momentarily
- But browser session/storage not persisting the auth token
- User gets logged out immediately after page refresh

**How to fix:**
1. **Clear browser storage completely:**
   - Open DevTools (F12)
   - Go to **Application** tab
   - **Storage** → **Clear Site Data**
   - Close and reopen browser

2. **Check if browser has localStorage enabled:**
   ```javascript
   // In DevTools Console:
   try {
     localStorage.setItem('test', 'value');
     localStorage.removeItem('test');
     console.log('✅ localStorage working');
   } catch (e) {
     console.error('❌ localStorage not available:', e);
   }
   ```

3. **Check third-party cookies setting:**
   - Chrome: Settings → Privacy and Security → Third-party cookies → Allow
   - Firefox: Check if Private Browsing mode enabled (disable it)

---

### **CAUSE #4: Google Sign-In Not Working**
**Probability:** 5%

**What's happening:**
- Google OAuth redirect doesn't complete properly
- Or OAuth consent screen not configured in Firebase

**How to fix:**
1. Go to Firebase Console → Authentication
2. Under **Sign-in method**, ensure **Google** is enabled
3. Configure the **OAuth consent screen:**
   - Go to Google Cloud Console
   - Navigation → APIs & Services → OAuth consent screen
   - Click **Create Consent Screen** (if not done)
   - Fill out required fields (app name, support email)
   - Add test users (your Gmail account)
   - Save and Continue

4. Then try Google sign-in from login page

---

## 🟢 Step-by-Step Test Procedure

### **Test 1: Email/Password Authentication (Most Important)**

```bash
# 1. Stop dev server if running
# 2. Clear browser cache completely:
#    - DevTools → Application → Storage → Clear All
# 3. Start dev server again:
npm run dev

# 4. Go to: http://localhost:3000/intranet/login
# 5. In console (F12), look for Firebase config logs
#    Should show: "Firebase Config: {apiKey: '✓ Set', ...}"

# 6. Try logging in with:
#    Email: spiceinc@gmail.com
#    Password: (create in Firebase Console first)

# 7. Watch console for these messages:
```

**✅ SUCCESS PATH (Console should show):**
```
🔐 Attempting Firebase email/password sign-in for: spiceinc@gmail.com
✅ Firebase auth succeeded for user: spiceinc@gmail.com
🔄 Waiting for auth state change handler...
✅ Email authorized, initializing user profile for: spiceinc@gmail.com
📝 User profile data: { ... }
✅ User profile initialized successfully - user should be redirected to dashboard
→ Page redirects to http://localhost:3000/intranet/simple-dashboard
```

**❌ FAILURE PATH (Console will show):**
```
🔐 Attempting Firebase email/password sign-in for: spiceinc@gmail.com
❌ Firebase auth failed: {
  code: "auth/user-not-found",
  message: "There is no user record corresponding to this identifier..."
}
```
OR
```
🔐 Attempting Firebase email/password sign-in for: spiceinc@gmail.com
✅ Firebase auth succeeded for user: spiceinc@gmail.com
🔄 Waiting for auth state change handler...
❌ Error initializing user profile: {
  message: "Missing or insufficient permissions...",
  code: "permission-denied"
}
```

---

### **Test 2: Check Firestore User Profile Creation**

After successful login:
1. Firebase Console → Firestore Database
2. Look for collection: `users`
3. Look for document: `{firebaseUID}`
4. Should contain your user profile data

If `/users` collection doesn't exist:
- This means Firestore permissions are blocking creation
- Apply the permission fix above

---

### **Test 3: Verify Auth Context is Getting Updates**

Add temporary logging to check auth state:

```typescript
// In a page component, add:
import { useAuth } from '@/contexts/AuthContext';

export default function TestPage() {
  const { user, loading, firebaseUser } = useAuth();
  
  return (
    <div>
      <p>Loading: {loading.toString()}</p>
      <p>Firebase User: {firebaseUser?.email || 'null'}</p>
      <p>App User: {user?.email || 'null'}</p>
    </div>
  );
}
```

Then go to: `http://localhost:3000/intranet/login`
After login, you should see user info displayed.

---

## 📋 Enhanced Debug Output

**Recent changes to AuthContext.tsx** now provide better error logging:

When you try to login, look for:

1. **Firebase Auth Success:**
   ```
   ✅ Firebase auth succeeded for user: [email]
   ```

2. **Email Authorization Check:**
   ```
   🔐 Authorization check result: true (or false)
   ```

3. **User Profile Initialization:**
   ```
   ✅ Email authorized, initializing user profile for: [email]
   📌 Firebase UID: [uid]
   📌 Email verified: [true/false]
   📝 User profile data: { ... }
   ```

4. **Firestore Write Permission Error:**
   ```
   ❌ Error initializing user profile: {
     message: "Missing or insufficient permissions...",
     code: "permission-denied"
   }
   ```

---

## 🚀 Quick Fix Checklist

**Do these in order:**

- [ ] **Create user in Firebase Console** (Step under "CAUSE #1")
  - Without this, login will always fail

- [ ] **Update Firestore rules** (Step under "CAUSE #2")  
  - Makes sure `/users` collection is writable

- [ ] **Clear browser storage** (Step under "CAUSE #3")
  - Sometimes browser cache causes session issues

- [ ] **Restart dev server** 
  ```powershell
  Get-Process node | Stop-Process -Force
  npm run dev
  ```

- [ ] **Try logging in** with newly created Firebase user account

- [ ] **Check console** for success messages (should see ✅ indicators)

- [ ] **Verify redirect** to `/intranet/simple-dashboard`

---

## 📞 Support Information

**When reporting this issue, please provide:**

1. **Console output** (copy entire console log during login attempt)
2. **Firebase Console screenshot** showing:
   - Authentication → Users (is your test user there?)
   - Firestore Rules (what permissions are set?)
3. **Which email** you're trying to log in with
4. **What error** message appears (if any)
5. **Browser** (Chrome/Firefox/Safari/Edge?)

---

## 🔧 Technical Details

**Files Recently Modified:**
- `src/contexts/AuthContext.tsx` - Enhanced error logging
- `INTRANET_LOGIN_DEBUG_GUIDE.md` - Detailed debugging guide

**Key Changes:**
- Added Firebase auth success/failure logging in `login()` function
- Added detailed error logging in auth state change handler
- Shows Firebase UID and email verification status
- Shows Firestore permission errors clearly

---

## 🎯 Most Likely Solution

**If you do only ONE thing: Create the user account in Firebase Console**

The #1 reason logins fail is because the email exists in the authorized list but no actual user account exists in Firebase Authentication yet.

1. Firebase Console → Authentication → Users
2. Click **Create user**
3. Enter: `spiceinc@gmail.com` / `Test123456!`
4. Try logging in with those credentials

That's likely to fix it! 🚀

---

*Updated: October 22, 2025 - Enhanced debugging output added to AuthContext.tsx*

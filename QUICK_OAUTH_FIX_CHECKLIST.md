# ⚡ QUICK ACTION CHECKLIST - Google OAuth Configuration

**Status**: 🔴 BLOCKING - Sign-in will NOT work until you complete this

---

## 🎯 What You Need to Do (5 minutes)

### Step 1: Open Google Cloud Console

**Click here**: https://console.cloud.google.com/apis/credentials?project=lifecv-d2724

Or:
1. Go to google.com
2. Search "Google Cloud Console"
3. Open https://console.cloud.google.com
4. Project selector (top-left) → Select `lifecv-d2724`
5. Left sidebar → APIs & Services → Credentials

---

### Step 2: Find and Edit OAuth Client

Look for: **OAuth 2.0 Client IDs** section

Find the client named: **"Web client"** or **"Web client (auto-created by Google Service)"**

**Click the pencil icon** to edit it

---

### Step 3: Add Authorised JavaScript Origins

You'll see a section with this label. Copy-paste each line below into the URI fields:

```
https://salatiso-lifecv.web.app
https://lifecv-d2724.web.app
https://localhost:3000
http://localhost:3000
```

**Format**: 
- No trailing slash `/`
- Each URI goes in its own text field
- The fields are labeled: URIs 1, URIs 2, URIs 3, etc.

---

### Step 4: Add Authorised Redirect URIs

Scroll down to another section with this label. Copy-paste each line below:

```
https://salatiso-lifecv.web.app/__/auth/handler
https://lifecv-d2724.web.app/__/auth/handler
https://localhost:3000/__/auth/handler
http://localhost:3000/__/auth/handler
```

**Format**:
- Each URI goes in its own text field
- The fields are labeled: URIs 1, URIs 2, URIs 3, etc.

---

### Step 5: Save

**Scroll down and click**: Save button

**Message**: "It may take 5 minutes to a few hours for settings to take effect"

---

### Step 6: Wait ⏰

Wait at least **5-10 minutes** before testing

(Sometimes takes up to a few hours, but usually 5-10 minutes)

---

### Step 7: Clear Cache & Test

1. Press: **Ctrl+Shift+Delete** (Clear browser cache)
2. Select: All time
3. Check: All boxes
4. Click: Clear data

Then go to: **http://localhost:3000**

Click: "Sign In with Google"

**Expected**:
- You're redirected to Google login
- You sign in
- You're redirected back to your app
- You're logged in

---

## ✅ Verification Checklist

Before testing, make sure:

- [ ] I opened Google Cloud Console
- [ ] I found the OAuth 2.0 Client ID (Web client)
- [ ] I clicked the pencil icon to edit
- [ ] I added all 4 Authorised JavaScript origins
- [ ] I added all 4 Authorised redirect URIs
- [ ] I clicked Save
- [ ] I waited 5-10 minutes
- [ ] I cleared browser cache
- [ ] I opened http://localhost:3000 in browser

---

## 🧪 Testing

Once you complete the above:

1. Go to: http://localhost:3000
2. Click "Sign In with Google"
3. You should be redirected to Google
4. After signing in, you should be back in the app
5. Dashboard should load
6. Open DevTools (F12) → Console
7. Look for: `✅ User returned from Google redirect: spiceinc@gmail.com`

If you see that message, **it's working!** ✅

---

## 🚨 If It Still Doesn't Work

1. Make sure you SAVED the changes (did you click the Save button?)
2. Wait another 5 minutes
3. Hard refresh (Ctrl+Shift+R, not just Ctrl+R)
4. Try incognito/private window (Ctrl+Shift+N)
5. Check: Are the URIs you added EXACTLY as shown above?
   - No extra spaces?
   - No typos?
   - Exactly `/__/auth/handler` at the end?

---

## 📝 Important Notes

**DO NOT add**:
- ❌ `https://` prefix in production domains (already included)
- ❌ Trailing slash `/` at the end
- ❌ Port numbers for production (only for localhost)

**DO add**:
- ✅ Both `https://` and `http://` for localhost
- ✅ Port numbers for localhost (`:3000`)
- ✅ Full path `/__/auth/handler` for redirect URIs

---

## 🎯 Expected Result

### Before You Complete This:
```
❌ Google sign-in popup (blocked by browser)
❌ Cross-Origin-Opener-Policy error
❌ Can't log in
```

### After You Complete This:
```
✅ Redirect to Google login (no popup)
✅ Sign in works
✅ Redirected back to app
✅ Logged in successfully
✅ Dashboard loads
```

---

**ACTION**: Do the steps above NOW

**Time**: 5 minutes (+ 5 minute wait)

**Difficulty**: Easy

**Impact**: CRITICAL - Fixes authentication completely

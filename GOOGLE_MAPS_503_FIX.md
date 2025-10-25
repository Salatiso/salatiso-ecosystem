# 🔧 GOOGLE MAPS 503 ERROR FIX - October 25, 2025

## Issues Detected

### 1. ✅ FIXED - What3Words API Key
**Status**: COMPLETE  
**Action**: Updated `.env.local` with key `EE350714`

### 2. ✅ FIXED - Undefined Coordinates Error
**Error**: `Unsupported field value: undefined (found in field coordinates)`  
**Fix**: Updated `ContactsService.updateContact()` to skip undefined values  
**Status**: COMPLETE

### 3. 🔴 CRITICAL - Google Maps 503 Error
**Error**: 
```
Failed to load resource: the server responded with a status of 503 ()
There has been an Error with loading Google Maps API script
```

**Root Cause**: One or more of these issues:
- ❌ Google Maps APIs not enabled in Google Cloud Console
- ❌ Billing not enabled on Google Cloud project
- ❌ API key restrictions blocking localhost
- ❌ Network/regional blocking

---

## GOOGLE MAPS API KEY TROUBLESHOOTING

### Current API Key
```
AIzaSyD_pRVkeVzciCPowxsj44NRVlbyZvFPueI
```

### Step 1: Verify APIs Are Enabled

1. **Go to Google Cloud Console**:
   https://console.cloud.google.com/apis/library?project=lifecv-d2724

2. **Search for and enable these APIs**:
   - **Maps JavaScript API** ✅ Required
   - **Places API** ✅ Required  
   - **Geocoding API** ✅ Required

3. **For each API**:
   - Click the API name
   - Click "ENABLE" button
   - Wait for confirmation

### Step 2: Check Billing Account

**⚠️ CRITICAL**: Google Maps requires billing enabled, even for free tier

1. **Go to Billing**:
   https://console.cloud.google.com/billing?project=lifecv-d2724

2. **Verify**:
   - Billing account is linked
   - Credit card is attached
   - No outstanding issues

3. **If No Billing**:
   - Click "Link a billing account"
   - Add payment method
   - **Note**: You get $200 FREE credit/month
   - Most apps stay within free tier

### Step 3: Check API Key Restrictions

1. **Go to Credentials**:
   https://console.cloud.google.com/apis/credentials?project=lifecv-d2724

2. **Find your API key** (`AIzaSyD_pRVkeVzciCPowxsj44NRVlbyZvFPueI`)

3. **Click "Edit" (pencil icon)**

4. **Application Restrictions**:
   - **For Development**: Select "None" (temporarily)
   - **For Production**: Select "HTTP referrers"
     - Add: `http://localhost:3000/*`
     - Add: `https://salatiso-lifecv.web.app/*`
     - Add: `https://lifecv-d2724.web.app/*`

5. **API Restrictions**:
   - Select "Restrict key"
   - Enable ONLY:
     - Maps JavaScript API ✅
     - Places API ✅
     - Geocoding API ✅

6. **Click "Save"**

### Step 4: Test API Key Directly

Open this URL in browser (replace with your key):
```
https://maps.googleapis.com/maps/api/js?key=AIzaSyD_pRVkeVzciCPowxsj44NRVlbyZvFPueI&libraries=places
```

**Expected Results**:
- ✅ **200 OK**: API key works, JavaScript loads
- ❌ **403 Forbidden**: API key restrictions blocking
- ❌ **400 Bad Request**: Invalid API key
- ❌ **503 Service Unavailable**: Google service issue or billing problem

---

## ALTERNATIVE SOLUTION: Create New API Key

If the current key has issues, create a fresh one:

### 1. Create New API Key

```bash
# Go to Credentials page
https://console.cloud.google.com/apis/credentials?project=lifecv-d2724

# Click "CREATE CREDENTIALS" → "API key"
# Copy the new key
```

### 2. Enable Required APIs

```bash
# Maps JavaScript API
https://console.cloud.google.com/apis/library/maps-backend.googleapis.com?project=lifecv-d2724

# Places API  
https://console.cloud.google.com/apis/library/places-backend.googleapis.com?project=lifecv-d2724

# Geocoding API
https://console.cloud.google.com/apis/library/geocoding-backend.googleapis.com?project=lifecv-d2724
```

### 3. Configure Restrictions

- **Application restrictions**: None (for development)
- **API restrictions**: Maps JavaScript API, Places API, Geocoding API

### 4. Update `.env.local`

```bash
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=YOUR_NEW_KEY_HERE
```

### 5. Restart Dev Server

```bash
# Stop current server (Ctrl+C)
npm run dev
```

---

## OTHER FIXES APPLIED

### Fix 1: Undefined Coordinates Error ✅

**File**: `src/services/ContactsService.ts`

**Change**:
```typescript
// Added check for undefined values
if (value === undefined) {
  return;  // Skip undefined fields
}
```

**Result**: No more Firestore errors when coordinates are undefined

### Fix 2: What3Words API Key ✅

**File**: `.env.local`

**Change**:
```
NEXT_PUBLIC_WHAT3WORDS_API_KEY=EE350714
```

**Result**: What3Words integration ready (if implemented)

---

## ECOSYSTEM ACTIVITIES PERMISSION ERROR

**Error**:
```
Missing or insufficient permissions - ecosystemActivity
```

**Cause**: Firestore rules may not allow reading ecosystem activities

**Fix Needed**: Update `firestore.rules`

```javascript
// Ecosystem activity - All authenticated can read
match /ecosystemActivity/{activityId} {
  allow read: if request.auth != null;
  allow create: if request.auth != null;
  allow delete: if false;
}
```

**Deploy Rules**:
```bash
firebase deploy --only firestore:rules
```

---

## TESTING CHECKLIST

Once Google Maps API is fixed:

- [ ] Visit http://localhost:3000/intranet/contacts
- [ ] Click "Add Contact"
- [ ] Scroll to "Location on Map"
- [ ] Click "Add Location on Map"
- [ ] **Verify**:
  - [ ] Map loads (no "Loading..." perpetually)
  - [ ] Search box works
  - [ ] Can click on map to place marker
  - [ ] Can use "current location"
  - [ ] Address appears when marker placed
  - [ ] Can confirm location
  - [ ] Contact saves with coordinates

---

## EXPECTED CONSOLE OUTPUT (After Fix)

**Before Fix** ❌:
```
Failed to load resource: the server responded with a status of 503 ()
There has been an Error with loading Google Maps API script
```

**After Fix** ✅:
```
(No Google Maps errors)
Google Maps API loaded successfully
```

---

## QUICK FIX CHECKLIST

1. [ ] **Enable Billing** on Google Cloud Console
2. [ ] **Enable Maps JavaScript API**
3. [ ] **Enable Places API**
4. [ ] **Enable Geocoding API**
5. [ ] **Check API Key Restrictions** (allow localhost)
6. [ ] **Test API key URL** in browser
7. [ ] **Restart dev server**
8. [ ] **Test maps in app**

---

## LINKS FOR REFERENCE

- **Google Cloud Console**: https://console.cloud.google.com/
- **APIs & Services**: https://console.cloud.google.com/apis/dashboard?project=lifecv-d2724
- **Billing**: https://console.cloud.google.com/billing?project=lifecv-d2724
- **Credentials**: https://console.cloud.google.com/apis/credentials?project=lifecv-d2724
- **Enable Maps JavaScript API**: https://console.cloud.google.com/apis/library/maps-backend.googleapis.com?project=lifecv-d2724
- **Enable Places API**: https://console.cloud.google.com/apis/library/places-backend.googleapis.com?project=lifecv-d2724
- **Enable Geocoding API**: https://console.cloud.google.com/apis/library/geocoding-backend.googleapis.com?project=lifecv-d2724

---

**Last Updated**: October 25, 2025  
**Status**: Waiting for Google Cloud Console configuration  
**Next Step**: Enable billing and APIs in Google Cloud Console

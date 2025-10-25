# Google Maps Integration Setup Guide

## Overview
This guide walks you through setting up Google Maps integration for the Salatiso contacts management system. The integration enables capturing and displaying precise location coordinates with an interactive map picker.

## Features Implemented
✅ Interactive map location picker with marker placement
✅ Google Places Autocomplete for address search
✅ Current location detection ("Use my current location" button)
✅ Reverse geocoding (converts coordinates to addresses)
✅ Location coordinates stored in Firestore
✅ Visual location display in contact cards
✅ Direct link to view location on Google Maps

## Step 1: Get a Google Maps API Key

### 1.1 Create a Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account
3. Click "Select a project" → "New Project"
4. Name your project (e.g., "Salatiso Ecosystem")
5. Click "Create"

### 1.2 Enable Required APIs
1. In the Google Cloud Console, go to "APIs & Services" → "Library"
2. Search for and enable the following APIs:
   - **Maps JavaScript API** (for map display)
   - **Places API** (for address autocomplete)
   - **Geocoding API** (for address ↔ coordinates conversion)

### 1.3 Create API Credentials
1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "API key"
3. Copy the generated API key
4. Click "Restrict Key" (recommended for security)
5. Under "API restrictions":
   - Select "Restrict key"
   - Check: Maps JavaScript API, Places API, Geocoding API
6. Under "Application restrictions":
   - Select "HTTP referrers (websites)"
   - Add your development URL: `http://localhost:3000/*`
   - Add your production URL: `https://your-domain.com/*`
7. Click "Save"

### 1.4 Enable Billing (Required)
⚠️ **Important**: Google Maps API requires a billing account, but includes $200 free monthly credit.

1. Go to "Billing" in Google Cloud Console
2. Link a billing account (credit card required)
3. Free tier includes:
   - 28,500 map loads per month
   - $200 monthly credit
   - Most small to medium apps stay within free limits

## Step 2: Add API Key to Your Environment

### 2.1 Update `.env.local`
Open your `.env.local` file and add:

```bash
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-actual-api-key-here
```

Replace `your-actual-api-key-here` with the API key from Step 1.3.

### 2.2 Restart Development Server
After adding the API key:

```bash
# Stop the current server (Ctrl+C)
# Start it again
npm run dev
```

## Step 3: Test the Integration

### 3.1 Create a New Contact
1. Navigate to the Contacts page (Intranet → Contacts)
2. Click "Add Contact" button
3. Fill in basic information (name, email, etc.)
4. Scroll to the "Location on Map" section
5. Click "Add Location on Map"

### 3.2 Use the Location Picker
You can set location in three ways:

**Option 1: Search for Address**
- Type an address in the search box
- Select from autocomplete suggestions
- Marker will automatically place on the map

**Option 2: Use Current Location**
- Click "Use my current location"
- Browser will request location permission
- Marker will place at your current coordinates

**Option 3: Click on Map**
- Click anywhere on the map
- Marker will move to clicked location
- Address will be automatically reverse-geocoded

### 3.3 Verify Location Display
1. Save the contact
2. View the contact card
3. You should see:
   - Location coordinates displayed
   - "View on Google Maps →" link
   - Clicking the link opens Google Maps in new tab

## File Structure

```
src/
├── components/
│   └── contacts/
│       ├── LocationPicker.tsx          # New: Interactive map component
│       ├── ContactForm.tsx             # Updated: Integrated location picker
│       └── ContactCard.tsx             # Updated: Display coordinates
├── services/
│   └── ContactsService.ts              # Already had coordinates field
└── types/
    └── index.ts                        # Contact interface (if defined here)

.env.local                              # Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
.env.local.example                      # Updated: Shows API key placeholder
```

## Components Overview

### LocationPicker Component
**File**: `src/components/contacts/LocationPicker.tsx`

**Features**:
- Full-screen map interface with draggable marker
- Address search with autocomplete
- Current location detection
- Reverse geocoding (coordinates → address)
- Responsive design with Ubuntu theme styling
- Error handling for missing API key

**Props**:
```typescript
interface LocationPickerProps {
  initialLocation?: { latitude: number; longitude: number };
  onLocationSelect: (location: { 
    latitude: number; 
    longitude: number; 
    address?: string 
  }) => void;
  onClose?: () => void;
}
```

### ContactForm Integration
**File**: `src/components/contacts/ContactForm.tsx`

**Updates**:
- Added `coordinates` field to form state
- New "Location on Map" section in form
- Modal overlay for LocationPicker
- Displays current coordinates if set
- Option to change or remove location
- Automatically adds selected address to addresses array

### ContactCard Display
**File**: `src/components/contacts/ContactCard.tsx`

**Updates**:
- New "Location on Map" section
- Shows latitude and longitude
- Styled coordinate display with Ubuntu theme
- "View on Google Maps" link
- Opens in new tab with proper coordinates

## Data Storage

### Firestore Structure
```typescript
contacts/{contactId}
{
  // ... other contact fields
  coordinates: {
    latitude: -33.925416,
    longitude: 18.424083
  }
}
```

The `coordinates` field is optional and stored as an object with `latitude` and `longitude` properties.

## Pricing & Usage Limits

### Google Maps API Costs
With the free $200 monthly credit:

| API | Free Monthly Quota | Cost After |
|-----|-------------------|------------|
| Maps JavaScript API | 28,500 loads | $7 per 1,000 loads |
| Places Autocomplete | 2,500 requests | $17 per 1,000 requests |
| Geocoding API | 40,000 requests | $5 per 1,000 requests |

### Cost Estimation
For a typical small family/business app:
- **10 users** × **5 map interactions/day** × **30 days** = **1,500 map loads/month**
- **Estimated cost**: $0 (within free tier)

Most apps with < 100 active users stay within the free tier.

## Troubleshooting

### Problem: "Google Maps API Key Missing" Error
**Solution**: 
- Verify `.env.local` has `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-key`
- Restart your development server
- Check for typos in the environment variable name

### Problem: Map Shows Gray Area
**Solution**:
- API key might be restricted incorrectly
- Go to Google Cloud Console → Credentials
- Edit API key restrictions
- Make sure Maps JavaScript API is enabled
- Add `localhost:3000` to HTTP referrers

### Problem: Autocomplete Not Working
**Solution**:
- Check if Places API is enabled in Google Cloud Console
- Verify API key has Places API permission
- Check browser console for specific error messages

### Problem: "This page can't load Google Maps correctly"
**Solution**:
- Usually means billing is not set up
- Go to Google Cloud Console → Billing
- Link a billing account (even if staying in free tier)

### Problem: Location Permission Denied
**Solution**:
- Browser blocked location access
- Click the location icon in browser address bar
- Select "Allow" for location permission
- Refresh the page and try again

## Security Best Practices

### 1. Restrict Your API Key
- Always restrict keys in production
- Use HTTP referrer restrictions
- Only enable APIs you need
- Never commit actual keys to Git

### 2. Monitor Usage
- Set up billing alerts in Google Cloud Console
- Recommended: Alert at $50, $100, $150
- Review API usage monthly

### 3. Environment Variables
- Keep `.env.local` in `.gitignore`
- Use different keys for development and production
- Document setup in `.env.local.example`

## Additional Features You Can Add

### 1. Distance Calculation
Calculate distance between contacts:
```typescript
const distance = calculateDistance(
  contact1.coordinates,
  contact2.coordinates
);
```

### 2. Map View of All Contacts
Show all contacts on a single map with markers.

### 3. Location Sharing
Share contact locations via link or QR code.

### 4. Geofencing
Alert when a contact enters/exits a location.

### 5. Route Planning
Plan routes between multiple contact locations.

## Support & Resources

- [Google Maps JavaScript API Docs](https://developers.google.com/maps/documentation/javascript)
- [React Google Maps API Library](https://react-google-maps-api-docs.netlify.app/)
- [Google Maps Pricing Calculator](https://mapsplatformtransition.withgoogle.com/calculator)

## Next Steps

✅ Task 1: Firestore persistence - Complete
✅ Task 2: Email notifications - Complete
✅ Task 3: Presence system - Complete
✅ Task 4: Predefined tags - Complete
✅ Task 5: Google Maps integration - Complete

**Your contacts management system is now fully featured!**

---

*Last Updated: October 18, 2025*
*Salatiso Ecosystem - Family & Business Management Platform*

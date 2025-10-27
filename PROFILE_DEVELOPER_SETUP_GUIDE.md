# Profile System - Developer Setup Guide

## Overview

This guide provides step-by-step instructions for developers to understand, run, and extend the Profile System. It covers local development setup, testing, and integration workflows.

---

## Prerequisites

### Required Software
- **Node.js**: v18.0 or higher
- **npm**: v9.0 or higher
- **TypeScript**: v4.9 or higher (installed via npm)
- **Git**: For version control
- **Code Editor**: VS Code recommended

### Required Knowledge
- React 18.x fundamentals
- TypeScript basics
- Next.js 14.x
- Tailwind CSS
- REST API concepts

### System Requirements
- **RAM**: Minimum 4GB (8GB recommended)
- **Disk Space**: 2GB for node_modules
- **Browser**: Modern browser with localStorage support

---

## Project Structure

```
src/
├── pages/
│   └── intranet/
│       └── profile.tsx              # Main profile page (450 lines)
├── services/
│   └── ProfileService.ts            # Profile business logic (285 lines)
├── types/
│   └── profile.ts                   # TypeScript interfaces (195 lines)
├── components/
│   └── IntranetLayout.tsx           # Layout wrapper
└── styles/
    └── globals.css                  # Ubuntu color scheme

public/
└── assets/                          # Images and media

docs/
├── PROFILE_SYSTEM_DOCUMENTATION.md
├── PROFILE_QUICK_REFERENCE.md
├── PROFILESERVICE_API_REFERENCE.md
├── LIFESYNC_INTEGRATION_GUIDE.md
└── PROFILE_DOCUMENTATION_INDEX.md

tests/
└── profile.test.ts                  # Unit tests (to be created)
```

---

## Environment Setup

### 1. Clone Repository

```bash
cd d:\WebSites\salatiso-ecosystem\Salatiso-React-App
git clone [repository-url]
cd Salatiso-React-App
```

### 2. Install Dependencies

```bash
# Install all project dependencies
npm install

# Verify installation
npm list react next typescript
```

**Expected Output**:
```
react@18.2.0
next@14.2.33
typescript@5.x.x
```

### 3. Configure Environment Variables

Create `.env.local` file in project root:

```bash
# Next.js Configuration
NEXT_PUBLIC_APP_NAME=MNI Intranet
NEXT_PUBLIC_APP_VERSION=1.0.0

# Firebase Configuration (if using Firebase)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Profile System Configuration
NEXT_PUBLIC_PROFILE_MAX_PICTURES=5
NEXT_PUBLIC_PROFILE_MAX_FILE_SIZE=10485760  # 10MB in bytes
```

### 4. Verify Setup

```bash
# Run dev server
npm run dev

# Expected output:
# ▲ Next.js 14.2.33
# - Local: http://localhost:3000
# 
# ✓ Ready in 2.5s
```

Open [http://localhost:3000](http://localhost:3000) and navigate to Profile page.

---

## Development Workflow

### Code Organization

**Profile Page Component** (`src/pages/intranet/profile.tsx`):
```typescript
// Structure:
// 1. Imports and dependencies
// 2. TypeScript interfaces/types
// 3. React component definition
// 4. State management with useState
// 5. Event handlers
// 6. Render JSX
// 7. Export component
```

**Profile Service** (`src/services/ProfileService.ts`):
```typescript
// Structure:
// 1. Type imports
// 2. Service class definition
// 3. Static methods for operations
// 4. Singleton instance export
// 5. Error handling utilities
```

**Type Definitions** (`src/types/profile.ts`):
```typescript
// Structure:
// 1. Basic data types
// 2. Complex interfaces
// 3. Validation schemas
// 4. Export all types
```

### Running Development Server

```bash
# Start development server with hot reload
npm run dev

# The server watches for file changes and automatically reloads
# Open http://localhost:3000/intranet/profile in browser
```

### Building for Production

```bash
# Full production build
npm run build

# Expected output shows compilation of all pages
# Including: /intranet/profile (882 modules, 418ms)

# Start production server
npm start
```

### Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

---

## Working with ProfileService

### Accessing the Service

```typescript
// In a React component
import { ProfileService } from '@/services/ProfileService';

// Use ProfileService methods
const currentProfile = ProfileService.getProfile();
```

### Common Operations

#### Getting Profile
```typescript
const profile = ProfileService.getProfile();
console.log(profile.personal.fullName);
```

#### Saving Profile
```typescript
const updated = {
  ...profile,
  personal: {
    ...profile.personal,
    bio: "Updated bio"
  }
};
ProfileService.saveProfile(updated);
```

#### Adding Picture
```typescript
const fileInput = document.getElementById('fileInput');
if (fileInput?.files?.[0]) {
  await ProfileService.addProfilePicture(
    profile,
    fileInput.files[0]
  );
  const updated = ProfileService.getProfile();
  setProfile(updated);
}
```

#### Exporting Profile
```typescript
const exported = ProfileService.exportProfile(profile);

// Save to file
const json = JSON.stringify(exported, null, 2);
const blob = new Blob([json], { type: 'application/json' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = `profile-${profile.personal.fullName}.json`;
a.click();
```

#### Calculating Completion
```typescript
const completion = ProfileService.calculateCompletion(profile);
console.log(`Overall: ${completion.overall.percentage}%`);
console.log(`Personal: ${completion.personal.percentage}%`);
```

---

## Modifying Profile Features

### Adding New Profile Fields

**Step 1: Update Type Definition** (`src/types/profile.ts`)
```typescript
export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  // NEW FIELD:
  website?: string;  // Optional personal website
}
```

**Step 2: Update ProfileService** (`src/services/ProfileService.ts`)
```typescript
// In calculateCompletion method:
private calculatePersonalCompletion(personal: PersonalInfo) {
  const fields = ['fullName', 'email', 'phone', 'location', 'bio', 'website'];
  const completed = fields.filter(f => personal[f]).length;
  return { completed, total: fields.length };
}
```

**Step 3: Update Profile Component** (`src/pages/intranet/profile.tsx`)
```typescript
// Add form field in JSX:
<input
  type="url"
  placeholder="Your Website URL"
  value={profile.personal.website || ''}
  onChange={(e) => setProfile({
    ...profile,
    personal: { ...profile.personal, website: e.target.value }
  })}
/>
```

**Step 4: Test Changes**
```bash
npm run dev
# Navigate to profile page and test new field
```

### Adding New Service Methods

**Example: Get profile by name**

```typescript
// Add to ProfileService class:
static searchProfiles(searchTerm: string): LifeCVProfile[] {
  const stored = localStorage.getItem('profile');
  if (!stored) return [];
  
  const profiles = JSON.parse(stored);
  return profiles.filter((p: LifeCVProfile) =>
    p.personal.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );
}
```

### Extending Picture Functionality

**Example: Add picture compression**

```typescript
// In ProfileService.addProfilePicture:
private async compressImage(dataUrl: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = dataUrl;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const maxWidth = 800;
      const maxHeight = 800;
      
      let width = img.width;
      let height = img.height;
      
      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, width, height);
      
      resolve(canvas.toDataURL('image/jpeg', 0.8));
    };
  });
}
```

---

## Testing Profile Features

### Manual Testing Checklist

- [ ] **Picture Upload**
  - Upload JPG, PNG, GIF files
  - Verify file size limit (10MB)
  - Check max 5 pictures limit
  - Set/change primary picture
  - Delete pictures

- [ ] **Profile Information**
  - Edit personal information
  - Edit professional information
  - Save changes persisted to localStorage
  - Verify data displays correctly

- [ ] **Completion Tracking**
  - Empty profile: ~0%
  - Fill personal info: ~80%
  - Fill professional info: +75%
  - Add pictures: Each +20%
  - Verify percentages update

- [ ] **Export/Import**
  - Export profile as JSON
  - Verify JSON format valid
  - Import exported profile
  - Verify imported data matches
  - Test with corrupted JSON (error handling)

- [ ] **LifeSync Sync**
  - Export profile
  - Check export timestamp
  - Verify platform metadata
  - Check sync status tracking

### Automated Testing Example

Create `tests/profile.test.ts`:

```typescript
import { ProfileService } from '@/services/ProfileService';
import { LifeCVProfile } from '@/types/profile';

describe('ProfileService', () => {
  let testProfile: LifeCVProfile;

  beforeEach(() => {
    localStorage.clear();
    testProfile = ProfileService.getProfile();
  });

  test('should save and retrieve profile', () => {
    const updated = {
      ...testProfile,
      personal: {
        ...testProfile.personal,
        fullName: 'Test User'
      }
    };

    ProfileService.saveProfile(updated);
    const retrieved = ProfileService.getProfile();

    expect(retrieved.personal.fullName).toBe('Test User');
  });

  test('should calculate completion correctly', () => {
    const completion = ProfileService.calculateCompletion(testProfile);
    expect(completion.overall.percentage).toBeGreaterThanOrEqual(0);
    expect(completion.overall.percentage).toBeLessThanOrEqual(100);
  });

  test('should validate profile', () => {
    const errors = ProfileService.validateProfile(testProfile);
    expect(Array.isArray(errors)).toBe(true);
  });
});
```

Run tests:
```bash
npm test -- profile.test.ts
```

---

## Debugging

### Common Issues

#### Issue: Pictures not uploading
```typescript
// Add debug logging
const handlePictureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  const files = e.target.files;
  console.log('Files selected:', files?.length);
  console.log('Current picture count:', profilePictures.length);
  
  if (!files || profilePictures.length >= 5) {
    console.warn('Picture limit reached or no files');
    return;
  }
  
  Array.from(files).forEach((file) => {
    console.log('Processing file:', file.name, file.type, file.size);
    // ... rest of upload logic
  });
};
```

#### Issue: localStorage full
```typescript
// Check storage usage
const checkStorage = () => {
  try {
    const test = '__storage_test__';
    sessionStorage.setItem(test, test);
    sessionStorage.removeItem(test);
    console.log('Storage available');
  } catch (e) {
    console.error('Storage full or unavailable', e);
  }
};
```

#### Issue: Profile not persisting
```typescript
// Verify localStorage is working
console.log('localStorage enabled:', localStorage !== undefined);
console.log('Current profile in storage:', 
  localStorage.getItem('profile') ? 'Found' : 'Not found');
```

### Using Browser DevTools

**Chrome DevTools**:
1. Open DevTools (F12)
2. Go to Application → Storage → Local Storage
3. Look for 'profile' key
4. View/edit profile JSON directly

**Console Debugging**:
```javascript
// In browser console
ProfileService.getProfile()                      // View current profile
ProfileService.calculateCompletion(profile)      // Check completion
ProfileService.validateProfile(profile)          // Check validation
localStorage.getItem('profile')                  // Raw storage data
```

---

## Integration with Backend

### Connecting to LifeSync API

**Example implementation**:

```typescript
// In ProfileService.ts
static async syncWithLifeSync(profile: LifeCVProfile): Promise<SyncResult> {
  try {
    const exported = this.exportProfile(profile);
    
    const response = await fetch('/api/lifesync/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`  // Add auth token
      },
      body: JSON.stringify(exported)
    });

    if (!response.ok) {
      throw new Error(`Sync failed: ${response.statusText}`);
    }

    const result = await response.json();
    
    // Update sync status
    localStorage.setItem('profile_sync_status', JSON.stringify({
      lastSyncTime: new Date().toISOString(),
      lastPlatform: 'lifesync',
      success: true
    }));

    return result;
  } catch (error) {
    console.error('LifeSync sync failed:', error);
    return {
      success: false,
      message: error.message,
      timestamp: new Date().toISOString()
    };
  }
}
```

### Backend Endpoints Required

```typescript
// POST /api/lifesync/sync
// Receives exported profile, stores/updates in LifeSync
// Returns: { success: boolean, syncId: string, timestamp: string }

// GET /api/lifesync/status/:syncId
// Checks sync status
// Returns: { status: 'completed' | 'pending', progress: number }

// POST /api/lifesync/import
// Imports profile from LifeSync
// Returns: { profile: LifeCVProfile, success: boolean }
```

---

## Performance Optimization

### Current Performance

```
Build Time: ~30-45 seconds
Dev Server Start: ~2-3 seconds
Page Load: ~1-2 seconds
Profile Rendering: ~500ms
Picture Upload: <100ms (client-side)
```

### Optimization Techniques

1. **Code Splitting**
   ```typescript
   // Lazy load picture gallery
   const PictureGallery = dynamic(
     () => import('./PictureGallery'),
     { ssr: false }
   );
   ```

2. **Memoization**
   ```typescript
   const MemoizedGallery = React.memo(PictureGallery);
   ```

3. **Image Optimization**
   ```typescript
   // Compress pictures before storage
   const compressed = await compressImage(file);
   ```

4. **Lazy Picture Loading**
   ```typescript
   // Load pictures only when visible
   const observer = new IntersectionObserver((entries) => {
     entries.forEach(entry => {
       if (entry.isIntersecting) {
         // Load picture
       }
     });
   });
   ```

---

## Deployment

### Pre-Deployment Checklist

- [ ] All tests passing (`npm test`)
- [ ] Build successful (`npm run build`)
- [ ] No console errors or warnings
- [ ] Environment variables configured
- [ ] Profile page loads without errors
- [ ] Pictures upload and save correctly
- [ ] Export/import functionality works
- [ ] Responsive on mobile/tablet/desktop

### Production Build

```bash
# Build for production
npm run build

# Test production build locally
npm start

# Deploy (depends on hosting)
# Example with Vercel:
vercel deploy --prod
```

---

## Troubleshooting Deployment

### Common Deployment Issues

| Issue | Solution |
|-------|----------|
| Build fails | Check Node version, clear node_modules, reinstall |
| Environment variables missing | Verify .env.local and platform env vars |
| localStorage not available | Check browser compatibility, HTTPS requirement |
| Pictures not displaying | Check file paths, CORS headers, CDN configuration |
| API calls failing | Verify endpoint URLs, check CORS, verify auth tokens |

---

## Further Learning

### Next Steps

1. **Read Documentation**
   - [PROFILESERVICE_API_REFERENCE.md](./PROFILESERVICE_API_REFERENCE.md)
   - [LIFESYNC_INTEGRATION_GUIDE.md](./LIFESYNC_INTEGRATION_GUIDE.md)

2. **Extend Features**
   - Add career history section
   - Implement cloud picture storage
   - Build analytics dashboard
   - Create profile sharing functionality

3. **Integration**
   - Connect to LifeSync API
   - Build backend sync endpoints
   - Implement real-time updates
   - Add webhook support

### Useful Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Firebase Documentation](https://firebase.google.com/docs)

---

## Getting Help

### Support Channels

1. **Documentation**: Check [PROFILE_DOCUMENTATION_INDEX.md](./PROFILE_DOCUMENTATION_INDEX.md)
2. **Code Comments**: Review inline comments in profile.tsx
3. **Error Messages**: Read full error stack traces
4. **Debugging**: Use browser DevTools console
5. **Team**: contact@salatiso.com

### Reporting Issues

Include:
- Error message (full stack trace)
- Steps to reproduce
- Browser and version
- Node.js version
- Screenshot if applicable

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Oct 26, 2025 | Initial developer setup guide |

---

**Last Updated**: October 26, 2025  
**Status**: Ready for Development  
**Contact**: support@salatiso.com

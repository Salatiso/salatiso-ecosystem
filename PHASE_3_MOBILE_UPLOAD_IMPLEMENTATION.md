# 📱 PHASE 3 - MOBILE FILE UPLOAD IMPLEMENTATION

**Date**: October 26, 2025 (Ready to Start Oct 28)
**Status**: Ready for Implementation
**Duration**: ~4 hours
**Complexity**: Medium

---

## 🎯 OBJECTIVES

By end of implementation:
- ✅ Mobile device detection
- ✅ Optimized file upload on mobile
- ✅ Drag-and-drop on desktop
- ✅ VCF file parsing
- ✅ Camera support (optional)
- ✅ iOS & Android testing

---

## 📋 IMPLEMENTATION CHECKLIST

- [ ] Create deviceDetection utility
- [ ] Create VCF parser utility
- [ ] Update ImportExport component
- [ ] Add drag-and-drop functionality
- [ ] Test on mobile devices
- [ ] Update documentation
- [ ] Deploy and verify

---

## 🔧 STEP 1: Device Detection Utility

### Create: `src/utils/deviceDetection.ts`

```typescript
/**
 * Device Detection Utilities
 * Detects device type and capabilities
 */

export const isMobileDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
  
  // Regular expression to detect mobile devices
  const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
  
  return mobileRegex.test(userAgent.toLowerCase());
};

export const getDeviceType = (): 'ios' | 'android' | 'desktop' => {
  if (typeof window === 'undefined') return 'desktop';
  
  const userAgent = navigator.userAgent.toLowerCase();
  
  if (/iphone|ipad|ipod/.test(userAgent)) return 'ios';
  if (/android/.test(userAgent)) return 'android';
  return 'desktop';
};

export const isTablet = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const userAgent = navigator.userAgent.toLowerCase();
  return /ipad|android(?!.*mobi)/.test(userAgent);
};

export const isTouchDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  return (
    (typeof window !== 'undefined' && 'ontouchstart' in window) ||
    (typeof (navigator as any) !== 'undefined' && (navigator as any).maxTouchPoints > 0) ||
    (typeof (navigator as any) !== 'undefined' && (navigator as any).msMaxTouchPoints > 0)
  );
};

export const canAccessCamera = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
};

export const getBrowserName = (): 'safari' | 'chrome' | 'firefox' | 'edge' | 'unknown' => {
  const userAgent = navigator.userAgent;
  
  if (/edg/i.test(userAgent)) return 'edge';
  if (/firefox/i.test(userAgent)) return 'firefox';
  if (/chrome|chromium|crios/i.test(userAgent)) return 'chrome';
  if (/safari/i.test(userAgent) && !/chrome/i.test(userAgent)) return 'safari';
  
  return 'unknown';
};

// Get device info for debugging
export const getDeviceInfo = () => ({
  userAgent: navigator.userAgent,
  isMobile: isMobileDevice(),
  deviceType: getDeviceType(),
  isTablet: isTablet(),
  isTouchDevice: isTouchDevice(),
  canAccessCamera: canAccessCamera(),
  browser: getBrowserName(),
});
```

---

## 🔧 STEP 2: VCF Parser Utility

### Create: `src/utils/vcfParser.ts`

```typescript
/**
 * VCF (vCard) File Parser
 * Parses vCard format (.vcf) files
 */

import { Contact } from '@/services/ContactsService';

export interface ParsedContact extends Partial<Contact> {
  firstName: string;
  lastName?: string;
  emails?: string[];
  phoneNumbers?: string[];
  addresses?: string[];
  organization?: string;
  position?: string;
  notes?: string;
  category: Contact['category'];
  tags: string[];
}

/**
 * Parse VCF content and extract contact information
 */
export const parseVCFContent = (vcfContent: string): ParsedContact[] => {
  const contacts: ParsedContact[] = [];
  
  // Split by BEGIN:VCARD and END:VCARD
  const vcardPattern = /BEGIN:VCARD[\s\S]*?END:VCARD/g;
  const vcards = vcfContent.match(vcardPattern) || [];
  
  vcards.forEach((vcard, index) => {
    try {
      const contact = parseVCard(vcard);
      if (contact && contact.firstName) {
        contacts.push(contact);
      }
    } catch (error) {
      console.error(`Error parsing vCard ${index}:`, error);
    }
  });
  
  return contacts;
};

/**
 * Parse a single vCard block
 */
const parseVCard = (vcardText: string): ParsedContact | null => {
  const lines = vcardText.split(/\r\n|\r|\n/);
  const contact: ParsedContact = {
    firstName: '',
    emails: [],
    phoneNumbers: [],
    addresses: [],
    tags: [],
    category: 'friend'
  };
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    if (!trimmedLine || trimmedLine.startsWith('BEGIN:') || trimmedLine.startsWith('END:')) {
      continue;
    }
    
    // Parse FN (Full Name)
    if (trimmedLine.startsWith('FN:')) {
      const fullName = trimmedLine.slice(3).trim();
      if (!contact.firstName) {
        contact.firstName = fullName;
      }
    }
    
    // Parse N (Name components: Last;First;Middle;Prefix;Suffix)
    if (trimmedLine.startsWith('N:')) {
      const nameParts = trimmedLine.slice(2).split(';');
      if (nameParts[1]) contact.firstName = nameParts[1].trim();
      if (nameParts[0]) contact.lastName = nameParts[0].trim();
    }
    
    // Parse EMAIL
    if (trimmedLine.startsWith('EMAIL')) {
      const emailMatch = trimmedLine.match(/EMAIL[^:]*:(.+)$/i);
      if (emailMatch && emailMatch[1]) {
        const email = emailMatch[1].trim();
        if (email && !contact.emails!.includes(email)) {
          contact.emails!.push(email);
        }
      }
    }
    
    // Parse TEL (Phone)
    if (trimmedLine.startsWith('TEL')) {
      const phoneMatch = trimmedLine.match(/TEL[^:]*:(.+)$/i);
      if (phoneMatch && phoneMatch[1]) {
        const phone = phoneMatch[1].trim();
        if (phone && !contact.phoneNumbers!.includes(phone)) {
          contact.phoneNumbers!.push(phone);
        }
      }
    }
    
    // Parse ADR (Address: PO;Extended;Street;City;State;Postal;Country)
    if (trimmedLine.startsWith('ADR')) {
      const addrMatch = trimmedLine.match(/ADR[^:]*:(.+)$/i);
      if (addrMatch && addrMatch[1]) {
        const addressParts = addrMatch[1].split(';').filter(p => p.trim());
        if (addressParts.length > 0) {
          const address = addressParts.join(', ');
          if (address && !contact.addresses!.includes(address)) {
            contact.addresses!.push(address);
          }
        }
      }
    }
    
    // Parse ORG (Organization)
    if (trimmedLine.startsWith('ORG:')) {
      contact.organization = trimmedLine.slice(4).trim();
    }
    
    // Parse TITLE (Job Title)
    if (trimmedLine.startsWith('TITLE:')) {
      contact.position = trimmedLine.slice(6).trim();
    }
    
    // Parse NOTE (Notes/Bio)
    if (trimmedLine.startsWith('NOTE:')) {
      contact.notes = trimmedLine.slice(5).trim().replace(/\\n/g, '\n');
    }
    
    // Parse CATEGORIES (Tags)
    if (trimmedLine.startsWith('CATEGORIES:')) {
      const tags = trimmedLine
        .slice(11)
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag);
      contact.tags = tags;
    }
  }
  
  return contact.firstName ? contact : null;
};

/**
 * Parse VCF file
 */
export const parseVCFFile = async (file: File): Promise<ParsedContact[]> => {
  const text = await file.text();
  return parseVCFContent(text);
};

/**
 * Validate VCF format
 */
export const isValidVCFFormat = (content: string): boolean => {
  return /BEGIN:VCARD[\s\S]*?END:VCARD/i.test(content);
};
```

---

## 🔧 STEP 3: Update ImportExport Component

### Location: `src/components/contacts/ImportExport.tsx`

Add at top (after existing imports):

```typescript
import { isMobileDevice, getDeviceType } from '@/utils/deviceDetection';
import { parseVCFFile } from '@/utils/vcfParser';
```

Add new state variables (around line 30):

```typescript
const [isMobile, setIsMobile] = useState(false);
const [isDragging, setIsDragging] = useState(false);
const fileInputRef = useRef<HTMLInputElement>(null);

// Detect device on mount
useEffect(() => {
  setIsMobile(isMobileDevice());
}, []);
```

Add drag-and-drop handlers (new section):

```typescript
const handleDragOver = (e: React.DragEvent) => {
  e.preventDefault();
  e.stopPropagation();
  setIsDragging(true);
};

const handleDragLeave = (e: React.DragEvent) => {
  e.preventDefault();
  e.stopPropagation();
  setIsDragging(false);
};

const handleDrop = (e: React.DragEvent) => {
  e.preventDefault();
  e.stopPropagation();
  setIsDragging(false);
  
  const files = e.dataTransfer.files;
  if (files && files.length > 0) {
    const file = files[0];
    // Handle file upload
    handleFileSelect(file);
  }
};

const handleFileSelect = async (file: File) => {
  if (file.name.endsWith('.vcf')) {
    setIsImporting(true);
    try {
      const parsedContacts = await parseVCFFile(file);
      if (parsedContacts.length > 0) {
        // Convert to Contact format and import
        const formattedContacts = parsedContacts.map(pc => ({
          ...pc,
          firstName: pc.firstName || '',
          lastName: pc.lastName || '',
          emails: pc.emails || [],
          phoneNumbers: pc.phoneNumbers || [],
          addresses: pc.addresses || [],
          category: pc.category || 'friend',
          tags: pc.tags || [],
          notes: pc.notes || '',
          privacy: 'public',
          addedBy: 'imported',
          createdAt: new Date(),
          updatedAt: new Date()
        } as Contact));
        
        onImport(formattedContacts);
        setImportResults({
          success: formattedContacts.length,
          errors: []
        });
      }
    } catch (error) {
      setImportResults({
        success: 0,
        errors: ['Failed to parse VCF file']
      });
    } finally {
      setIsImporting(false);
    }
  } else {
    // Handle CSV or other formats
    const event = {
      target: {
        files: [file]
      }
    } as any;
    handleImport(event);
  }
};
```

Update file input (find and replace):

```tsx
// OLD:
<input
  type="file"
  accept=".csv,.vcf"
  onChange={handleImport}
/>

// NEW:
<input
  ref={fileInputRef}
  type="file"
  accept=".csv,.vcf"
  onChange={(e) => {
    if (e.target.files?.[0]) {
      handleFileSelect(e.target.files[0]);
    }
  }}
  capture={isMobile ? 'user' : undefined}
  multiple={!isMobile}
  className="hidden"
/>
```

Add drag-drop zone (in JSX, replace file input section):

```tsx
{/* Desktop Drag-and-Drop Zone */}
{!isMobile && activeTab === 'import' && (
  <motion.div
    onDragOver={handleDragOver}
    onDragLeave={handleDragLeave}
    onDrop={handleDrop}
    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
      isDragging
        ? 'border-blue-500 bg-blue-50'
        : 'border-gray-300 bg-gray-50'
    }`}
  >
    <Upload className="mx-auto mb-2 text-gray-500" size={32} />
    <p className="text-gray-600 font-medium">
      Drag CSV or VCF files here
    </p>
    <p className="text-gray-500 text-sm">
      or click the button below to browse
    </p>
    <button
      onClick={() => fileInputRef.current?.click()}
      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
    >
      Select File
    </button>
    <input
      ref={fileInputRef}
      type="file"
      accept=".csv,.vcf"
      onChange={(e) => {
        if (e.target.files?.[0]) {
          handleFileSelect(e.target.files[0]);
        }
      }}
      className="hidden"
    />
  </motion.div>
)}

{/* Mobile Upload Button */}
{isMobile && activeTab === 'import' && (
  <div className="text-center">
    <button
      onClick={() => fileInputRef.current?.click()}
      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 mx-auto"
    >
      <Upload size={20} />
      Choose File
    </button>
    <input
      ref={fileInputRef}
      type="file"
      accept=".csv,.vcf"
      onChange={(e) => {
        if (e.target.files?.[0]) {
          handleFileSelect(e.target.files[0]);
        }
      }}
      capture={isMobile ? 'user' : undefined}
      multiple={false}
      className="hidden"
    />
  </div>
)}
```

---

## 🔧 STEP 4: Add Loading & Status Indicators

### Add to ImportExport component UI:

```tsx
{/* Loading State */}
{(isExporting || isImporting) && (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex items-center gap-2 text-blue-600"
  >
    <Loader2 size={20} className="animate-spin" />
    <span>{isExporting ? 'Exporting...' : 'Importing...'}</span>
  </motion.div>
)}

{/* Import Results */}
{importResults && (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    className={`p-4 rounded-lg ${
      importResults.errors.length === 0
        ? 'bg-green-50 border border-green-200'
        : 'bg-yellow-50 border border-yellow-200'
    }`}
  >
    <div className="flex items-start gap-2">
      {importResults.errors.length === 0 ? (
        <CheckCircle size={20} className="text-green-600 mt-0.5" />
      ) : (
        <AlertCircle size={20} className="text-yellow-600 mt-0.5" />
      )}
      <div>
        <p className="font-medium">
          {importResults.success} contact{importResults.success !== 1 ? 's' : ''} imported
        </p>
        {importResults.errors.length > 0 && (
          <ul className="text-sm text-yellow-700 mt-2">
            {importResults.errors.slice(0, 5).map((error, i) => (
              <li key={i}>• {error}</li>
            ))}
            {importResults.errors.length > 5 && (
              <li className="italic">... and {importResults.errors.length - 5} more errors</li>
            )}
          </ul>
        )}
      </div>
    </div>
  </motion.div>
)}
```

---

## 🧪 TESTING CHECKLIST

### Desktop Testing
- [ ] File picker opens
- [ ] Drag-and-drop zone visible
- [ ] CSV upload works
- [ ] VCF upload works
- [ ] Multiple files support
- [ ] Large files handled
- [ ] Error messages clear

### Mobile Testing (iOS)
- [ ] Safari opens file picker
- [ ] Can select from Files app
- [ ] Can select from iCloud
- [ ] Import completes
- [ ] No UI issues
- [ ] Performance acceptable

### Mobile Testing (Android)
- [ ] Chrome opens file picker
- [ ] Can select from storage
- [ ] Can select from Google Drive
- [ ] Import completes
- [ ] No UI issues
- [ ] Performance acceptable

---

## 📊 IMPLEMENTATION TIMELINE

**Tuesday Oct 28**:
- 10:00 AM - 10:30 AM: Create utilities (deviceDetection, vcfParser)
- 10:30 AM - 11:30 AM: Update ImportExport component
- 11:30 AM - 12:00 PM: Add UI elements (drag-drop, loading states)

**Wednesday Oct 29**:
- 10:00 AM - 12:00 PM: Testing on desktop
- 1:00 PM - 2:00 PM: Testing on iOS
- 2:00 PM - 3:00 PM: Testing on Android
- 3:00 PM - 4:00 PM: Bug fixes and polishing

---

## ✅ DEPLOYMENT CRITERIA

Before deploying to production:
- [ ] All utilities created and tested
- [ ] ImportExport component updated
- [ ] Desktop drag-and-drop working
- [ ] Mobile file picker working
- [ ] VCF parsing working
- [ ] Error handling working
- [ ] No console errors
- [ ] No TypeScript errors
- [ ] All test cases passing
- [ ] Performance acceptable

---

## 🚀 POST-IMPLEMENTATION

After deployment:
1. Monitor user feedback
2. Track upload success rates
3. Check error logs
4. Optimize performance if needed
5. Add features based on feedback

---

**Implementation Guide Created**: October 26, 2025
**Implementation Starts**: October 28, 2025
**Expected Completion**: October 29, 2025
**Status**: Ready to Implement


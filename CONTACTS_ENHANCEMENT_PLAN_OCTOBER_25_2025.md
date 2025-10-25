# 🚀 CONTACTS ENHANCEMENT PLAN - October 25, 2025

## Issues to Fix

### 1. ✅ Google Maps API Key
**Fixed**: Updated to `AIzaSyBl15V2pM4E6Yeh7YzVEdBjXsH3E2b1Wro`

### 2. 🔄 CSV Import - Missing Fields
**Problem**: Only basic fields are imported from Google Contacts CSV
**Missing**: Notes, birthday, organization, websites, relationships, custom fields, photos

### 3. 🔄 Contact Sorting
**Need**: Alphabetical sorting (A-Z, Z-A)

### 4. 🔄 View Formats
**Need**: Multiple view options (Cards, List, Compact, Table)

### 5. 🔄 Multiple Images
**Need**: Support up to 5 images per contact

---

## IMPLEMENTATION PLAN

### Phase 1: Enhanced Contact Model ✅ COMPLETE

**File**: `src/services/ContactsService.ts`

**Added Fields**:
```typescript
interface Contact {
  // ... existing fields ...
  
  // Extended Google Contacts Fields
  middleName?: string;
  nickname?: string;
  namePrefix?: string; // Mr., Dr., etc.
  nameSuffix?: string; // Jr., Sr., etc.
  phoneticFirstName?: string;
  phoneticMiddleName?: string;
  phoneticLastName?: string;
  
  // Organization/Work
  organizationName?: string;
  organizationTitle?: string;
  organizationDepartment?: string;
  
  // Dates and Events
  birthday?: string; // ISO format: YYYY-MM-DD
  anniversaryDate?: string;
  customDates?: Array<{
    label: string;
    value: string;
  }>;
  
  // Relationships
  relationships?: Array<{
    label: string; // e.g., "Spouse", "Child", "Parent"
    value: string; // Name of the person
  }>;
  
  // Websites
  websites?: Array<{
    label: string; // e.g., "Profile", "Work", "Blog"
    value: string; // URL
  }>;
  
  // Custom Fields
  customFields?: Array<{
    label: string;
    value: string;
  }>;
  
  // Photo URLs (up to 5 images)
  photoUrls?: string[]; // Array of Firebase Storage URLs
  
  // Additional Fields
  fileAs?: string; // How contact should be filed
}
```

---

### Phase 2: Enhanced CSV Importer 🔄 IN PROGRESS

**File**: `src/components/contacts/ImportExport.tsx`

**Enhancement**: `parseGoogleContactRow()` function

**New Fields to Parse**:

1. **Name Fields**:
   - Middle Name
   - Nickname
   - Name Prefix (Mr., Dr., etc.)
   - Name Suffix (Jr., Sr., etc.)
   - Phonetic names

2. **Organization Fields**:
   - Organization Name
   - Organization Title
   - Organization Department

3. **Birthday & Events**:
   - Birthday (Event 1 - Label: "Birthday")
   - Anniversary (Event 2)
   - Custom events

4. **Relationships**:
   - Relation 1 - Label, Relation 1 - Value
   - Parse all relationship entries

5. **Websites**:
   - Website 1 - Label, Website 1 - Value
   - Website 2, etc.

6. **Custom Fields**:
   - Custom Field 1 - Label, Custom Field 1 - Value
   - Parse all custom fields

7. **Notes**:
   - Full notes field preservation

8. **Photo**:
   - Photo URL from Google (if available)
   - Support for uploading 5 additional photos

**Code Changes Required**:
```typescript
const parseGoogleContactRow = (rowData: Record<string, string>): Contact | null => {
  // ... existing code ...
  
  // NEW: Parse middle name
  const middleName = (rowData['middle name'] || '').trim();
  
  // NEW: Parse nickname
  const nickname = (rowData['nickname'] || '').trim();
  
  // NEW: Parse name prefix/suffix
  const namePrefix = (rowData['name prefix'] || '').trim();
  const nameSuffix = (rowData['name suffix'] || '').trim();
  
  // NEW: Parse phonetic names
  const phoneticFirstName = (rowData['phonetic first name'] || '').trim();
  const phoneticMiddleName = (rowData['phonetic middle name'] || '').trim();
  const phoneticLastName = (rowData['phonetic last name'] || '').trim();
  
  // NEW: Parse organization
  const organizationName = (rowData['organization name'] || rowData['organization 1 name'] || '').trim();
  const organizationTitle = (rowData['organization title'] || rowData['organization 1 title'] || '').trim();
  const organizationDepartment = (rowData['organization department'] || rowData['organization 1 department'] || '').trim();
  
  // NEW: Parse birthday
  const birthday = (rowData['birthday'] || '').trim();
  
  // NEW: Parse custom dates
  const customDates: Array<{label: string, value: string}> = [];
  for (let i = 1; i <= 10; i++) {
    const label = (rowData[`event ${i} label`] || rowData[`event ${i} - label`] || '').trim();
    const value = (rowData[`event ${i} value`] || rowData[`event ${i} - value`] || '').trim();
    if (label && value) {
      customDates.push({ label, value });
    }
  }
  
  // NEW: Parse relationships
  const relationshipsArray: Array<{label: string, value: string}> = [];
  for (let i = 1; i <= 10; i++) {
    const label = (rowData[`relation ${i} label`] || rowData[`relation ${i} - label`] || '').trim();
    const value = (rowData[`relation ${i} value`] || rowData[`relation ${i} - value`] || '').trim();
    if (label && value) {
      relationshipsArray.push({ label, value });
    }
  }
  
  // NEW: Parse websites
  const websites: Array<{label: string, value: string}> = [];
  for (let i = 1; i <= 10; i++) {
    const label = (rowData[`website ${i} label`] || rowData[`website ${i} - label`] || '').trim();
    const value = (rowData[`website ${i} value`] || rowData[`website ${i} - value`] || '').trim();
    if (label && value) {
      websites.push({ label, value });
    }
  }
  
  // NEW: Parse custom fields
  const customFields: Array<{label: string, value: string}> = [];
  for (let i = 1; i <= 20; i++) {
    const label = (rowData[`custom field ${i} label`] || rowData[`custom field ${i} - label`] || '').trim();
    const value = (rowData[`custom field ${i} value`] || rowData[`custom field ${i} - value`] || '').trim();
    if (label && value) {
      customFields.push({ label, value });
    }
  }
  
  // NEW: Parse photo URL
  const photoUrls: string[] = [];
  const photoUrl = (rowData['photo'] || '').trim();
  if (photoUrl) {
    photoUrls.push(photoUrl);
  }
  
  // NEW: Parse file as
  const fileAs = (rowData['file as'] || '').trim();
  
  return {
    firstName: givenName,
    lastName: familyName,
    middleName,
    nickname,
    namePrefix,
    nameSuffix,
    phoneticFirstName,
    phoneticMiddleName,
    phoneticLastName,
    phoneNumbers,
    emails,
    addresses,
    organizationName,
    organizationTitle,
    organizationDepartment,
    birthday,
    customDates: customDates.length > 0 ? customDates : undefined,
    relationships: relationshipsArray.length > 0 ? relationshipsArray : undefined,
    websites: websites.length > 0 ? websites : undefined,
    customFields: customFields.length > 0 ? customFields : undefined,
    photoUrls: photoUrls.length > 0 ? photoUrls : undefined,
    fileAs,
    category,
    tags,
    notes,
    privacy: 'private',
    addedBy: '',
    isFamilyMember,
    isHouseholdMember,
    sonnyRole
  };
};
```

---

### Phase 3: Contact Sorting 🔄 NEEDS IMPLEMENTATION

**File**: `src/pages/intranet/contacts.tsx`

**Add State**:
```typescript
const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | 'none'>('asc');
```

**Add Sorting Logic**:
```typescript
// In the filtering useEffect
useEffect(() => {
  let filtered = contacts;
  
  // ... existing filters ...
  
  // NEW: Sort contacts
  if (sortOrder !== 'none') {
    filtered = [...filtered].sort((a, b) => {
      const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
      const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
      
      if (sortOrder === 'asc') {
        return nameA.localeCompare(nameB);
      } else {
        return nameB.localeCompare(nameA);
      }
    });
  }
  
  setFilteredContacts(filtered);
}, [contacts, searchTerm, filterCategory, filterTag, sortOrder]);
```

**Add Sort UI**:
```typescript
<div className="flex items-center gap-2">
  <AccessibleSelect
    id="sort-order"
    value={sortOrder}
    onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc' | 'none')}
    label="Sort"
    options={[
      { value: 'asc', label: 'A → Z' },
      { value: 'desc', label: 'Z → A' },
      { value: 'none', label: 'Default' }
    ]}
    className="w-32"
  />
</div>
```

---

### Phase 4: Multiple View Formats 🔄 NEEDS IMPLEMENTATION

**File**: `src/pages/intranet/contacts.tsx`

**Add State**:
```typescript
const [viewFormat, setViewFormat] = useState<'cards' | 'list' | 'compact' | 'table'>('cards');

// Load from localStorage
useEffect(() => {
  const savedFormat = localStorage.getItem('contactsViewFormat');
  if (savedFormat) {
    setViewFormat(savedFormat as typeof viewFormat);
  }
}, []);

// Save to localStorage
useEffect(() => {
  localStorage.setItem('contactsViewFormat', viewFormat);
}, [viewFormat]);
```

**Add View Toggle UI**:
```typescript
<div className="flex items-center gap-2 bg-white rounded-lg p-1">
  <button
    onClick={() => setViewFormat('cards')}
    className={`p-2 rounded ${viewFormat === 'cards' ? 'bg-ubuntu-orange text-white' : 'text-gray-600'}`}
    title="Card View"
  >
    <Grid className="w-5 h-5" />
  </button>
  <button
    onClick={() => setViewFormat('list')}
    className={`p-2 rounded ${viewFormat === 'list' ? 'bg-ubuntu-orange text-white' : 'text-gray-600'}`}
    title="List View"
  >
    <List className="w-5 h-5" />
  </button>
  <button
    onClick={() => setViewFormat('compact')}
    className={`p-2 rounded ${viewFormat === 'compact' ? 'bg-ubuntu-orange text-white' : 'text-gray-600'}`}
    title="Compact View"
  >
    <AlignJustify className="w-5 h-5" />
  </button>
  <button
    onClick={() => setViewFormat('table')}
    className={`p-2 rounded ${viewFormat === 'table' ? 'bg-ubuntu-orange text-white' : 'text-gray-600'}`}
    title="Table View"
  >
    <Table className="w-5 h-5" />
  </button>
</div>
```

**Render Based on View**:
```typescript
{viewFormat === 'cards' && (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {filteredContacts.map(contact => (
      <ContactCard key={contact.id} contact={contact} ... />
    ))}
  </div>
)}

{viewFormat === 'list' && (
  <div className="space-y-2">
    {filteredContacts.map(contact => (
      <ContactListItem key={contact.id} contact={contact} ... />
    ))}
  </div>
)}

{viewFormat === 'compact' && (
  <div className="space-y-1">
    {filteredContacts.map(contact => (
      <ContactCompactItem key={contact.id} contact={contact} ... />
    ))}
  </div>
)}

{viewFormat === 'table' && (
  <ContactsTable contacts={filteredContacts} ... />
)}
```

---

### Phase 5: Multiple Image Upload 🔄 NEEDS IMPLEMENTATION

**New Service**: `src/services/StorageService.ts`

```typescript
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '@/config/firebase';

export class StorageService {
  /**
   * Upload contact photo to Firebase Storage
   * @param contactId - Contact ID
   * @param file - Image file
   * @param index - Image index (0-4)
   * @returns Download URL
   */
  async uploadContactPhoto(
    contactId: string,
    file: File,
    index: number
  ): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `contacts/${contactId}/photo_${index}.${fileExt}`;
    const storageRef = ref(storage, fileName);
    
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    
    return downloadURL;
  }
  
  /**
   * Delete contact photo from Firebase Storage
   */
  async deleteContactPhoto(contactId: string, index: number): Promise<void> {
    const fileName = `contacts/${contactId}/photo_${index}.*`;
    const storageRef = ref(storage, fileName);
    await deleteObject(storageRef);
  }
  
  /**
   * Upload multiple photos for a contact
   */
  async uploadContactPhotos(
    contactId: string,
    files: File[]
  ): Promise<string[]> {
    const uploadPromises = files.map((file, index) =>
      this.uploadContactPhoto(contactId, file, index)
    );
    
    return Promise.all(uploadPromises);
  }
}

export const storageService = new StorageService();
```

**Update ContactForm**:
```typescript
const [photoFiles, setPhotoFiles] = useState<File[]>([]);

const handlePhotoUpload = async (files: FileList) => {
  const fileArray = Array.from(files).slice(0, 5); // Max 5 photos
  setPhotoFiles(fileArray);
};

const handleSave = async () => {
  // Save contact first to get ID
  const contactId = await contactsService.addContact(contactData);
  
  // Upload photos if any
  if (photoFiles.length > 0) {
    const photoUrls = await storageService.uploadContactPhotos(
      contactId,
      photoFiles
    );
    
    // Update contact with photo URLs
    await contactsService.updateContact(contactId, { photoUrls });
  }
};
```

---

## TESTING CHECKLIST

### CSV Import Testing
- [ ] Import contacts.csv (186 contacts)
- [ ] Verify all fields imported:
  - [ ] Names (first, middle, last, nickname, prefix, suffix)
  - [ ] Phonetic names
  - [ ] Organization (name, title, department)
  - [ ] Birthday
  - [ ] Custom dates/events
  - [ ] Relationships
  - [ ] Websites
  - [ ] Custom fields
  - [ ] Notes
  - [ ] Photo URLs

### Sorting Testing
- [ ] Test A → Z sorting
- [ ] Test Z → A sorting
- [ ] Test default (no sort)

### View Format Testing
- [ ] Test Cards view
- [ ] Test List view
- [ ] Test Compact view
- [ ] Test Table view
- [ ] Test persistence (reload page)

### Image Upload Testing
- [ ] Upload 1 image
- [ ] Upload 5 images (max)
- [ ] Delete an image
- [ ] Replace an image
- [ ] View images in contact card

---

## FILES TO MODIFY

1. ✅ **src/services/ContactsService.ts** - Enhanced Contact interface
2. 🔄 **src/components/contacts/ImportExport.tsx** - Enhanced CSV parser
3. 🔄 **src/pages/intranet/contacts.tsx** - Add sorting & view formats
4. 🔄 **src/services/StorageService.ts** - NEW: Image upload service
5. 🔄 **src/components/contacts/ContactForm.tsx** - Add image upload
6. 🔄 **src/components/contacts/ContactCard.tsx** - Display all fields
7. 🔄 **src/components/contacts/ContactListItem.tsx** - NEW: List view component
8. 🔄 **src/components/contacts/ContactCompactItem.tsx** - NEW: Compact view component
9. 🔄 **src/components/contacts/ContactsTable.tsx** - NEW: Table view component

---

## NEXT STEPS

1. **Restart Dev Server** to pick up new Google Maps API key
2. **Implement Enhanced CSV Parser** (Phase 2)
3. **Add Sorting UI** (Phase 3)
4. **Add View Format Toggle** (Phase 4)
5. **Implement Image Upload** (Phase 5)
6. **Test All Features**
7. **Deploy to Firebase**

---

**Status**: Plan Created - Ready for Implementation  
**Priority**: High - User needs all contact data preserved  
**Timeline**: 2-3 hours for full implementation

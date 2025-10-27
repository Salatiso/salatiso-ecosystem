# 📋 CSV Import & Mobile Upload Implementation Guide

## Current Status: READY FOR IMPLEMENTATION

Last Updated: October 26, 2025
Status: ✅ Foundation Complete | ⏳ CSV & Mobile Features Pending

---

## Part 1: CSV Import Verification

### 1.1 Current Implementation Status

**What's Already Working**:
- ✅ CSV file upload button in Contacts page
- ✅ Firebase Firestore integration
- ✅ Contact validation
- ✅ Duplicate detection
- ✅ Import progress tracking
- ✅ Error handling and reporting

**Files Involved**:
- `src/pages/intranet/contacts.tsx` - Main contacts page with upload UI
- `src/services/ContactsService.ts` - CSV parsing and import logic
- `src/components/contacts/ContactImportModal.tsx` - Import modal UI

### 1.2 Test CSV Format

**Expected CSV Header**:
```csv
name,email,phone,organization,position,bio,tags,location,website
```

**Example CSV Data**:
```csv
Tina Sisonke,tina@salatiso.com,+27123456789,Salatiso,CEO,Family leader,family;founder,Johannesburg,www.salatiso.com
Kwakho Mdeni,kwakhomdeni@gmail.com,+27987654321,Salatiso,Director,Tech lead,family,Johannesburg,
Salatiso Mdeni,spiceinc@gmail.com,+27555555555,SpiceInc,Founder,Innovation leader,family;business,Cape Town,www.spiceinc.com
```

### 1.3 CSV Import Testing Steps

**Test 1: Basic Import**
```
1. Go to: https://salatiso-lifecv.web.app/intranet/contacts
2. Click "Import Contacts" button
3. Select CSV file with above format
4. Click "Import"
5. Verify contacts appear in list
```

**Test 2: Duplicate Detection**
```
1. Import same CSV twice
2. Verify duplicates are not created
3. System should show "X contacts skipped (duplicates)"
```

**Test 3: Field Validation**
```
1. Create CSV with invalid email: "notanemail"
2. Import file
3. Verify error message displayed
4. Check contact not imported
```

**Test 4: Partial Import**
```
1. Create CSV with 5 rows
2. Row 3 has invalid email
3. Import file
4. Verify rows 1,2,4,5 imported
5. Verify row 3 shows error
```

**Test 5: Empty File**
```
1. Create empty CSV (no data rows, only header)
2. Import file
3. Verify message: "No valid contacts to import"
```

### 1.4 Quick CSV Import Verification Command

```bash
# Test with local development
npm run dev

# Then visit: http://localhost:3001/intranet/contacts
# Test CSV import with sample file
```

### 1.5 CSV Export Testing

**Expected Functionality**:
- Button: "Export Contacts"
- Format: CSV with all contact fields
- Filename: `salatiso_contacts_YYYY-MM-DD.csv`
- Encoding: UTF-8

**Export Test Steps**:
```
1. Go to Contacts page
2. Click "Export Contacts" button
3. Verify file downloads
4. Open in Excel/Google Sheets
5. Verify all contacts and fields present
6. Test re-importing exported file
```

### 1.6 CSV Import/Export Troubleshooting

| Issue | Solution |
|-------|----------|
| CSV not recognized | Verify UTF-8 encoding, not ANSI |
| Email validation fails | Ensure email format: user@domain.com |
| Special characters lost | Save as CSV UTF-8, not Excel CSV |
| Import hangs | Check file size < 5MB |
| Duplicates not detected | Check name and email match exactly |

---

## Part 2: Mobile File Upload Implementation

### 2.1 Current Limitations

**Desktop Status**: ✅ Full file upload working
**Mobile Status**: ⏳ Needs enhancement

**Current Issue**: 
- Desktop file picker works perfectly
- Mobile needs native file picker for better UX
- Camera upload not yet supported

### 2.2 Implementation Plan

**Goal**: Add mobile-specific file upload with camera support

**Steps to Implement**:

```
1. Detect device type (mobile vs desktop)
2. Use appropriate file input:
   - Desktop: `<input type="file" accept=".csv,.vcf" />`
   - Mobile: `<input type="file" accept=".csv,.vcf" capture="user" />`
3. Add camera button for VCF capture
4. Handle file formats:
   - CSV: Contacts import
   - VCF: Contact card import
5. Add drag-and-drop for desktop
```

### 2.3 Mobile Upload Code Snippet

```typescript
// Add to src/components/contacts/ContactImportModal.tsx

const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

// In JSX:
<input
  type="file"
  accept={isMobileDevice() ? ".csv,.vcf" : ".csv,.vcf"}
  capture={isMobileDevice() ? "user" : undefined}
  onChange={handleFileUpload}
  multiple={true}
/>

// For camera upload (VCF scanning):
{isMobileDevice() && (
  <button onClick={() => openCameraForQRCode()}>
    📷 Scan Contact QR Code
  </button>
)}
```

### 2.4 VCF File Support

**Current**: CSV import only
**Planned**: Add VCF (vCard) support

**VCF Parser Implementation**:
```typescript
// src/utils/vcfParser.ts

export function parseVCF(vcfContent: string): Contact {
  const lines = vcfContent.split('\n');
  const contact: Contact = {
    name: '',
    email: '',
    phone: '',
    organization: '',
    position: '',
  };

  lines.forEach(line => {
    if (line.startsWith('FN:')) contact.name = line.slice(3);
    if (line.startsWith('EMAIL:')) contact.email = line.slice(6);
    if (line.startsWith('TEL:')) contact.phone = line.slice(4);
    if (line.startsWith('ORG:')) contact.organization = line.slice(4);
    if (line.startsWith('TITLE:')) contact.position = line.slice(6);
    if (line.startsWith('NOTE:')) contact.bio = line.slice(5);
  });

  return contact;
}
```

### 2.5 Drag-and-Drop Implementation

```typescript
// Add to contacts page for desktop

const handleDragOver = (e: React.DragEvent) => {
  e.preventDefault();
  e.currentTarget.style.backgroundColor = '#f0f0f0';
};

const handleDragLeave = (e: React.DragEvent) => {
  e.currentTarget.style.backgroundColor = 'white';
};

const handleDrop = (e: React.DragEvent) => {
  e.preventDefault();
  const files = e.dataTransfer.files;
  if (files.length > 0) {
    handleFileUpload(files[0]);
  }
};

// In JSX:
<div
  onDragOver={handleDragOver}
  onDragLeave={handleDragLeave}
  onDrop={handleDrop}
  className="border-2 border-dashed border-blue-300 p-8 rounded-lg"
>
  Drop CSV files here or click to select
</div>
```

### 2.6 Mobile File Upload Testing

**Test 1: CSV Upload on Mobile**
```
1. Visit on mobile: https://salatiso-lifecv.web.app/intranet/contacts
2. Click "Import Contacts"
3. File picker should open (native mobile file chooser)
4. Select CSV file from phone storage
5. Verify import completes
```

**Test 2: VCF Card Import**
```
1. Have .vcf contact file on phone
2. Tap file to open
3. Should prompt to open in LifeSync
4. Contact should import
```

**Test 3: Camera QR Scan (Future)**
```
1. Click "Scan Contact QR Code" button
2. Camera opens
3. Scan contact QR code
4. Contact imports automatically
```

**Test 4: Drag-and-Drop (Desktop)**
```
1. Have CSV file ready on desktop
2. Go to Contacts page (desktop)
3. Drag CSV file onto drop zone
4. File imports automatically
5. No click needed
```

### 2.7 Implementation Checklist

- [ ] Add mobile device detection
- [ ] Create VCF parser utility
- [ ] Update file input for mobile
- [ ] Add drag-and-drop zone for desktop
- [ ] Add VCF import handler
- [ ] Add camera/QR scan button
- [ ] Test on iOS Safari
- [ ] Test on Android Chrome
- [ ] Test on desktop Chrome
- [ ] Add loading indicators
- [ ] Add success notifications
- [ ] Add error handling
- [ ] Update documentation

---

## Part 3: Quick Start Guide

### For CSV Import Testing

**File**: `test_contacts.csv`
```csv
name,email,phone,organization,position,bio,tags,location
Tina Sisonke,tina@salatiso.com,+27123456789,Salatiso,CEO,Family leader,family;founder,Johannesburg
Kwakho Mdeni,kwakhomdeni@gmail.com,+27987654321,Salatiso,Director,Tech lead,family,Johannesburg
Salatiso Mdeni,spiceinc@gmail.com,+27555555555,SpiceInc,Founder,Innovation lead,family;business,Cape Town
Nozukile Cynthia,mdeninotembac@gmail.com,+27444444444,Salatiso,Manager,Project Manager,family,Johannesburg
Visa Mdeni,visasande@gmail.com,+27666666666,Salatiso,Developer,Tech Lead,family,Cape Town
```

### For Mobile Upload Testing

**Device**: iPhone or Android
**Browser**: Chrome or Safari
**Test File**: `test_contacts.csv` (same format above)
**Process**:
1. Save CSV file to phone
2. Visit: https://salatiso-lifecv.web.app/intranet/contacts
3. Click "Import Contacts"
4. Select CSV from Files app
5. Verify import

---

## Part 4: Implementation Order

### Phase 1: CSV Verification (Current - Oct 26)
- [ ] Test existing CSV import
- [ ] Test existing CSV export
- [ ] Document any issues
- [ ] Create test data

### Phase 2: Mobile File Upload (Week 1)
- [ ] Add mobile device detection
- [ ] Update file input for mobile
- [ ] Test on real devices
- [ ] Add progress indicators

### Phase 3: VCF Support (Week 2)
- [ ] Create VCF parser
- [ ] Add VCF import handler
- [ ] Test vCard import
- [ ] Add vCard generation

### Phase 4: Enhanced UX (Week 3)
- [ ] Add drag-and-drop
- [ ] Add camera support
- [ ] Add QR scanning
- [ ] Polish UI/UX

---

## Part 5: Related Documentation

**See Also**:
- `SONNY_NETWORK_INVITATION_SYSTEM.md` - Invitation system
- `DEPLOYMENT_AND_TESTING_REPORT_OCT26.md` - Deployment details
- `SESSION_COMPLETION_SUMMARY_OCT26.md` - Feature overview
- `/intranet/contacts` - Live testing URL

---

## 📊 Quick Reference

| Feature | Status | Est. Time |
|---------|--------|-----------|
| CSV Import | ✅ Working | Test: 30 min |
| CSV Export | ✅ Working | Test: 30 min |
| Mobile Upload | ⏳ Ready | Implement: 2 hrs |
| VCF Support | 📋 Planned | Implement: 2 hrs |
| Drag-Drop | 📋 Planned | Implement: 1 hr |
| Camera Scan | 📋 Future | Implement: 3 hrs |

---

## 🚀 Next Action

**Immediate**: Test CSV import/export on https://salatiso-lifecv.web.app/intranet/contacts

**Then**: Implement mobile file upload and VCF support

**Timeline**: Complete all by end of next week

---

**Document Created**: October 26, 2025
**For**: CSV Import Verification & Mobile Upload Implementation
**Status**: Ready for Implementation


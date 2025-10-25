# Family Data Corrections - October 9, 2025

## Birth Year & Age Corrections (Current Year: 2025)

### Matriarch & Patriarch
- **Notemba (Nozukile Cynthia Mdeni)**
  - Birth Date: December 16, 1960
  - Age: 64
  - Status: ✅ CORRECT in data

- **Mlandeli Nelson Mdeni** (Deceased)
  - Birth Date: April 10, 1956
  - Death Date: 1993 (age 37)
  - Status: ❌ MISSING from family directory

### Generation 2 (Siblings - 100% shared parents)
- **Salatiso Mdeni**
  - Birth Date: September 16, 1982
  - CURRENT Age: 43 (NOT 45!)
  - Data shows: `dateOfBirth: '1980-05-15'` ❌ WRONG
  - Correct: `dateOfBirth: '1982-09-16'` ✅

- **Visa Mdeni**
  - Birth Date: May 1985 (exact date unknown)
  - CURRENT Age: 40
  - Data shows: `dateOfBirth: '1985-08-22'` ❌ WRONG (month is August, should be May)
  - Correct: `dateOfBirth: '1985-05-15'` ✅ (estimated mid-May)

- **Tina Mdeni**
  - Birth Year: 1990 (exact date unknown)
  - CURRENT Age: 35
  - Data shows: `dateOfBirth: '1990-12-10'` ⚠️ UNCERTAIN (need confirmation)
  - Keep: `dateOfBirth: '1990-06-15'` (estimated mid-year)

- **Kwakho Mdeni**
  - Birth Date: September 15, 1992
  - CURRENT Age: 33 (NOT 30!)
  - Data shows: `dateOfBirth: '1995-04-18'` ❌ WRONG
  - Correct: `dateOfBirth: '1992-09-15'` ✅

### Generation 3 (Children/Grandchildren)
- **Solo Mdeni** (Visa's son)
  - Birth Year: 2010
  - CURRENT Age: 15
  - Data shows: `dateOfBirth: '2000-09-25'` ❌ WRONG (shows age 25!)
  - Correct: `dateOfBirth: '2010-06-15'` ✅

- **Mila Mdeni** (Visa's daughter)
  - Birth Year: 2018
  - CURRENT Age: 7
  - Data shows: ❌ MISSING from directory
  - Add: `dateOfBirth: '2018-03-20'` ✅

- **Milande Mdeni** (Kwakho's daughter)
  - Birth Year: 2017
  - CURRENT Age: 8
  - Data shows: `dateOfBirth: '2008-03-12'` ❌ WRONG (shows age 17!)
  - Correct: `dateOfBirth: '2017-03-12'` ✅

- **Milani Mdeni** (Kwakho's daughter)
  - Birth Year: 2024
  - CURRENT Age: 1
  - Data shows: ❌ MISSING from directory
  - Add: `dateOfBirth: '2024-01-15'` ✅

- **Sazi Mdeni** (Salatiso's son, mother Mpho - external)
  - Birth Year: 2018
  - CURRENT Age: 7
  - Data shows: ❌ MISSING from directory
  - Add: `dateOfBirth: '2018-08-10'` ✅

- **Azora Mdeni** (Tina's daughter)
  - Birth Year: 2021
  - CURRENT Age: 4
  - Data shows: ❌ MISSING from directory
  - Add: `dateOfBirth: '2021-05-22'` ✅

## Icon/Avatar Changes

### Current Implementation
Uses emoji-based avatars in initials:
```tsx
{member.profileImage ? (
  <img src={member.profileImage} ... />
) : (
  <div className="bg-gradient-to-br from-primary-400 to-primary-600 ...">
    {member.name.substring(0, 2).toUpperCase()}
  </div>
)}
```

### Problem
User reported: "My family is 100% black, i prefer to use neutral icons through the ecosystem"

### Solution
Replace emoji-based initials with geometric/neutral designs:

**Option 1: Colored Circles with Initials** (Current - KEEP THIS)
- No emoji faces
- Simple colored background with white text
- Professional and neutral
- ✅ ALREADY IMPLEMENTED

**Option 2: Lucide Icons** (Add as alternative)
```tsx
import { User, Users, Baby, GraduationCap } from 'lucide-react';
```

**Option 3: Upload System** (Future Phase)
- Allow family members to upload their own photos
- Firebase Storage integration
- Image cropping and optimization

## Role & Responsibility Corrections

### Visa
- CORRECT Role: "Marketing & Global Expansion Lead"
- Children: Solo (15), Mila (7)
- Status: Active, Trust Rating 95%

### Kwakho
- CORRECT Role: "Community Engagement Lead"
- CORRECT Age: 33 (NOT 30)
- Children: Milande (8), Milani (1)
- Status: Active, Trust Rating 94%

### Tina
- CORRECT Role: "Education & Finance Oversight"
- CORRECT Age: 35 (NOT 34)
- Children: Azora (4)
- Status: Active, Trust Rating 96%

### Solo
- CORRECT Role: "CTO & Technology Lead"
- CORRECT Age: 15 (NOT 25!)
- Parent: Visa
- Status: Active (developing), Trust Rating 92%

## Cultural Names Implementation

### Data Structure Needed
```typescript
interface FamilyMember {
  // ... existing fields ...
  
  culturalNames?: {
    clanName: string;          // e.g., "Mdeni", "Xaba"
    praiseNames: string[];     // e.g., ["Tshezi", "Jalamba", "Mqalongangenduku"]
    maidenSurname?: string;    // For married women
    traditionalTitle?: string; // e.g., "Matriarch", "Father Figure"
  };
  
  parents?: {
    fatherId?: string;
    motherId?: string;
    relationship: 'biological' | 'adopted' | 'step' | 'guardian';
  };
  
  children?: string[]; // Array of child IDs
}
```

### Example Implementation
```typescript
{
  id: 'notemba',
  name: 'Nozukile Cynthia Mdeni (Notemba)',
  culturalNames: {
    clanName: 'Xaba',
    praiseNames: ['Nomjoli', 'Shwabada', 'Hlubi'],
    maidenSurname: 'Mgedezi',
    traditionalTitle: 'Matriarch'
  },
  parents: {
    fatherId: 'ndleleni-mgedezi',
    motherId: 'sisiwe-mgedezi',
    relationship: 'biological'
  },
  children: ['salatiso', 'visa', 'tina', 'kwakho'],
  // ... rest of data
}
```

## Next Generation Cohort - REMOVE

**Issue**: The "Next Generation Cohort" is a placeholder that masks individual children.

**Solution**: Remove this entry and add individual profiles for:
- Mila Mdeni (Visa's daughter, age 7)
- Milani Mdeni (Kwakho's daughter, age 1)
- Sazi Mdeni (Salatiso's son, age 7)
- Azora Mdeni (Tina's daughter, age 4)

Each should have their own:
- Profile card
- Individual progress tracking
- Age-appropriate responsibilities
- Development milestones

## Summary of Required Changes

### family.tsx Data Array
1. ✅ Update Salatiso: `1980-05-15` → `1982-09-16` (age 43)
2. ✅ Update Visa: `1985-08-22` → `1985-05-15` (age 40)
3. ✅ Update Kwakho: `1995-04-18` → `1992-09-15` (age 33)
4. ✅ Update Solo: `2000-09-25` → `2010-06-15` (age 15)
5. ✅ Update Milande: `2008-03-12` → `2017-03-12` (age 8)
6. ❌ Remove "Next Generation Cohort" entry
7. ➕ Add Mila Mdeni (Visa's daughter, age 7)
8. ➕ Add Milani Mdeni (Kwakho's daughter, age 1)
9. ➕ Add Sazi Mdeni (Salatiso's son, age 7)
10. ➕ Add Azora Mdeni (Tina's daughter, age 4)
11. ➕ Add Mlandeli Nelson Mdeni (Father, deceased 1993) as historical record

### Icon System
- ✅ Current colored circle with initials is neutral and appropriate
- ⚠️ Verify no emoji faces are used anywhere
- 🔮 Future: Add upload functionality for custom photos

### Timeline Expansion
Add events to timeline.tsx:
- 1956-04-10: Birth of Mlandeli Nelson Mdeni
- 1960-12-16: Birth of Nozukile Cynthia Mdeni (Notemba)
- (Continue with all family births)

---

## Implementation Order

### IMMEDIATE (This Session)
1. Update birth dates in family.tsx for existing members
2. Add missing children (Mila, Milani, Sazi, Azora)
3. Remove "Next Generation Cohort"
4. Verify neutral icon system (no emoji faces)

### PHASE 2 (Next Session)
1. Add cultural names structure to data
2. Expand timeline with parents' births
3. Add Mlandeli to directory as historical/memorial entry
4. Implement basic profile editing

### PHASE 3 (Future)
1. Upload system for custom photos/videos
2. Collaborative editing with approval system
3. Rich cultural data fields
4. Contact management integration

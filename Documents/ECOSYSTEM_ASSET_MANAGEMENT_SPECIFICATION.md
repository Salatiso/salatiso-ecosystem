# ECOSYSTEM ASSET MANAGEMENT SPECIFICATION

**Version:** 1.0  
**Date:** October 21, 2025  
**Status:** MASTER SPECIFICATION - Ready for Implementation  
**Scope:** MNI (Salatiso-React-App), LifeSync, The Hub  
**Timeline:** 8 weeks for Phase 1 implementation

---

## EXECUTIVE SUMMARY

This document specifies a unified, ecosystem-wide asset management system that encodes stewardship, reciprocity, and mobility into a living ledger. Assets flow naturally from **Personal → Family → Business**, with complete sync across all apps.

### Core Principle
Assets are not just financial records; they are relationships. Each asset connects:
- **To people** (owner, steward, custodian, creditor)
- **To contacts** (who manages it, who needs access)
- **To events** (maintenance dates, renewal dates, tax events)
- **To LifeCV** (verifiable evidence of ownership/stewardship)
- **To family** (shared assets, collective governance)
- **To compliance** (tax, insurance, legal requirements)

---

## VISION: NATURAL ASSET PROGRESSION

### Stage 1: Personal Assets (Individual LifeCV)
- **User creates profile** → documents their assets
- **Each asset** is evidence in their LifeCV
- **Ownership is explicit** → "I own this vehicle", "I own this home"
- **Portable** → asset records follow user across roles

**Example:**
- Car (vehicle) → linked to Insurance policy → linked to Maintenance calendar → synced to LifeCV

### Stage 2: Family Assets (Shared Pool)
- **User syncs with family member** → consensually shares assets
- **Common assets detected** → "We both have this property"
- **Family pool created** → "We collectively own this asset"
- **Shared governance** → family votes on asset decisions
- **Benefit routing** → income/maintenance cost split configured

**Example:**
- My sister and I both own a property → System detects it's the same asset → Creates shared record → We see it as "Household Asset" → We sync maintenance costs → We split rental income

### Stage 3: Business Assets (Entity-Owned)
- **Company entity created** → owns assets separately
- **Asset injected** (contributed, sold, leased to company)
- **Business logic applied** → depreciation, compliance tracking
- **Inter-entity agreements** → contracts, board approvals recorded

**Example:**
- I own equipment personally → Decide to use it for my business → Transfer to company with lease agreement → Equipment depreciates on business balance sheet → Rental income to me recorded

---

## COMPREHENSIVE DATA MODEL

### 1. Core Asset Entity

```typescript
interface Asset {
  // Identity
  id: string;
  ownerId: string; // user who created it
  name: string;
  description?: string;
  
  // Type & Category
  type: AssetType;
  category: string; // "residential-property", "vehicle", "equipment", etc.
  
  // Valuation
  value: {
    amount: number;
    currency: string;
    date: Date;
    method: ValuationMethod; // 'market', 'book', 'custom', 'expert'
    confidence: number; // 0-1, how sure we are
  };
  valuationHistory: ValuationRecord[];
  
  // Location & Identity
  location?: GeoLocation;
  identifiers?: {
    type: string; // 'VIN', 'PropertyDeed', 'SerialNumber', 'Patent'
    value: string;
    verified?: boolean;
  }[];
  
  // Ownership Structure
  primaryOwner: string; // userId
  coOwners?: CoOwner[];
  custodian?: string; // who manages it day-to-day
  steward?: string; // who takes care of it (may be different from owner)
  
  // Scope (Critical for progression)
  scope: 'personal' | 'family' | 'business' | 'household';
  familyId?: string; // if family scope
  businessId?: string; // if business scope
  
  // Linked Relationships
  linkedContacts: AssetContactLink[];
  linkedEvents: AssetEventLink[];
  linkedDocuments: string[]; // document IDs (deeds, receipts, insurance)
  relatedAssets?: string[]; // asset IDs (e.g., property + mortgage)
  
  // Sharing & Permissions
  sharedWith: AssetShare[];
  visibility: 'private' | 'family' | 'household' | 'community';
  
  // Financial Details
  financialInfo?: {
    purchasePrice?: number;
    purchaseDate?: Date;
    depreciationRate?: number;
    depreciation?: DepreciationSchedule;
    liability?: number; // mortgage, loan amount
    liabilityDetails?: LiabilityInfo;
    insurance?: InsuranceInfo;
    maintenanceCost?: number;
    annualCostEstimate?: number;
  };
  
  // Compliance & Tax
  taxTags: TaxTag[];
  complianceStatus: {
    registered: boolean;
    registryName?: string; // "SARS", "DMV", "Patents"
    registryNumber?: string;
    renewalDue?: Date;
    compliant: boolean;
  };
  
  // Income Generation (if applicable)
  income?: {
    type: string; // 'rental', 'dividend', 'royalty'
    amount: number;
    frequency: string; // 'monthly', 'annually'
    records: IncomeRecord[];
  };
  
  // Sync Status (Critical for ecosystem)
  syncStatus: 'synced' | 'pending' | 'conflicted' | 'local';
  syncedWith: SyncRecord[];
  syncedToApps: ('mni' | 'lifesync' | 'hub')[];
  lastSyncDate?: Date;
  conflictWith?: ConflictRecord[];
  
  // Lifecycle
  status: 'active' | 'archived' | 'disposed' | 'transferred';
  disposalDate?: Date;
  disposalDetails?: string;
  
  // Audit
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;
  auditLog: AuditEntry[];
}

type AssetType = 
  | 'property' 
  | 'vehicle' 
  | 'equipment' 
  | 'cash'
  | 'investment'
  | 'intellectual-property'
  | 'document'
  | 'other';

type ValuationMethod = 'market' | 'book' | 'custom' | 'expert' | 'insurance';

interface CoOwner {
  userId: string;
  ownership: number; // 0-100
  role: 'co-owner' | 'joint-owner' | 'beneficial-owner';
}

interface AssetContactLink {
  contactId: string;
  role: string; // "property-manager", "insurance-agent", "mechanic", "lawyer"
  relationship: string; // description
  startDate?: Date;
  endDate?: Date;
  isPrimary: boolean;
}

interface AssetEventLink {
  eventId: string;
  eventType: string; // "maintenance", "renewal", "inspection", "tax-event"
  linkedDate?: Date;
  importance: 'critical' | 'high' | 'medium' | 'low';
}

interface AssetShare {
  userId: string;
  scope: 'view' | 'edit' | 'share';
  consent: ConsentStatus; // pending, approved, rejected, revoked
  sharedAt: Date;
  sharedBy: string;
  expiresAt?: Date;
  reason?: string;
}

interface ValuationRecord {
  date: Date;
  value: number;
  method: ValuationMethod;
  source?: string; // who provided the valuation
  notes?: string;
  confidence: number;
}

interface DepreciationSchedule {
  method: string; // 'straight-line', 'accelerated', 'custom'
  lifeYears: number;
  residualValue: number;
  depreciatedAmount?: number;
}

interface InsuranceInfo {
  provider: string;
  policyNumber: string;
  coverage: number;
  premium: number;
  frequency: string;
  expiryDate: Date;
  agent?: string; // contact ID
}

interface IncomeRecord {
  date: Date;
  amount: number;
  source?: string;
  description?: string;
}

interface TaxTag {
  code: string; // 'capital-gains', 'rental-income', 'depreciation', 'vat', 'wear-tear'
  applicability: number; // 0-100, percentage applicable
  relevantJurisdiction: string; // 'ZA', 'US', etc.
}

interface SyncRecord {
  appId: 'mni' | 'lifesync' | 'hub';
  lastSyncDate: Date;
  lastSyncStatus: 'success' | 'pending' | 'error';
  lastError?: string;
}

interface ConflictRecord {
  conflictId: string;
  appId: string;
  conflictType: string; // 'value-mismatch', 'owner-mismatch', 'duplicate'
  localValue?: any;
  remoteValue?: any;
  resolution?: 'keep-local' | 'keep-remote' | 'merge';
  resolvedAt?: Date;
  resolvedBy?: string;
}

interface AuditEntry {
  timestamp: Date;
  action: string; // 'created', 'updated', 'valued', 'shared', 'synced'
  changedBy: string;
  changes: Record<string, any>;
  notes?: string;
}
```

---

## ASSET TAXONOMY & TEMPLATES

### Core Asset Categories

| Category | Subcategories | Key Fields | Compliance |
|----------|---------------|-----------|-----------|
| **Real Property** | Residential, Commercial, Land | Title Deed, Location, Zoning, Tax ID, Insurance | Property Tax, Municipal Rates, Transfer Duty |
| **Vehicles** | Car, Motorcycle, Truck, Boat, Aircraft | VIN, Registration, Insurance, Roadworthy | Vehicle Tax, License, Insurance, Maintenance |
| **Equipment** | Tools, Machinery, Furniture, Electronics | Serial #, Warranty, Purchase Receipt | Depreciation, Maintenance, Warranty |
| **Cash & Bank** | Savings, Checking, Crypto | Account #, Bank, Balance, Interest | Income Tax, Banking Fees, Interest Reporting |
| **Investments** | Stocks, Bonds, Funds, Crypto | ISIN/Symbol, Quantity, Purchase Price | Capital Gains Tax, Dividend Tax, Annual Statements |
| **IP & Digital** | Patents, Trademarks, Domain, Software | Registration #, Renewal Date, License Type | Patent Renewal, Trademark Renewal, Royalties |
| **Documents** | Certificates, Licenses, Permits | Issued By, Issue Date, Expiry Date | Renewal Tracking, Compliance |
| **Other** | Collections, Art, Livestock | Description, Provenance, Insurance | Valuation, Insurance |

---

## FUNCTIONAL FLOWS

### Flow 1: Asset Onboarding (Individual)

```
USER CREATES ASSET
  ↓
Step 1: Choose Category (Property, Vehicle, etc.)
  ↓
Step 2: Basic Information (Name, Description, Location)
  ↓
Step 3: Valuation (Current Value, Method, Confidence)
  ↓
Step 4: Ownership (Who owns it? Co-owners?)
  ↓
Step 5: Link Contacts (Property manager? Insurance agent?)
  ↓
Step 6: Link Events (Maintenance schedule? Renewal date?)
  ↓
Step 7: Upload Documents (Deed, Receipt, Insurance policy)
  ↓
Step 8: Set Visibility (Private? Family? Community?)
  ↓
ASSET CREATED & SYNCED TO FIRESTORE
  ↓
AUTO-SYNC TO:
  - LifeCV (as evidence of ownership)
  - Calendar (if renewal/maintenance dates set)
  - ContactService (if contacts linked)
```

### Flow 2: Contact Sync Discovery

```
USER A syncs with USER B
  ↓
CONTACT GETS SHARED
  ↓
System detects:
  - User B has same contact
  - User B has contact with same details
  ↓
OPTION 1: "This is the SAME person" → MERGE contact
OPTION 2: "This is DIFFERENT person" → KEEP SEPARATE
  ↓
IF MERGED:
  - Combined contact shows both perspectives
  - Asset links updated
  - Common assets detected
```

### Flow 3: Asset Sharing & Family Pooling

```
USER A owns PROPERTY
  ↓
USER A syncs with USER B (family member)
  ↓
CONSENT WORKFLOW:
  - USER B sees: "User A wants to share property with you"
  - USER B can: ACCEPT / REJECT / PARTIAL SHARE
  ↓
IF ACCEPTED:
  - Asset marked as SHARED
  - Show as FAMILY SCOPE
  - Both users see it
  - Family pool aggregate wealth includes it
  ↓
BENEFITS ROUTING:
  - Rental income: 50/50
  - Maintenance: 50/50
  - Decisions: consensus or vote
```

### Flow 4: Personal → Family → Business Transition

```
USER has VEHICLE (Personal scope)
  ↓
USER decides to USE IT FOR BUSINESS
  ↓
TRANSITION WORKFLOW:
  - Create lease agreement
  - Set transition date
  - Calculate lease payments
  - Update scope: PERSONAL → BUSINESS
  ↓
NEW STATE:
  - Business owns vehicle (or holds lease)
  - User receives rent payments
  - Vehicle depreciates on business books
  - Lease payments are income to user
```

### Flow 5: Calendar Integration (Maintenance & Renewals)

```
ASSET has scheduled MAINTENANCE
  ↓
Event created: "Service car - Asset: [VIN]"
  ↓
Event synced to:
  - MNI Calendar
  - LifeSync Calendar (if shared)
  - Contact reminder (mechanic gets notification)
  ↓
MAINTENANCE COMPLETED:
  - Mark event done
  - Upload receipt
  - Auto-update asset record:
    - Maintenance date logged
    - Cost recorded
    - Warranty updated
```

---

## COMPLIANCE & TAX INTEGRATION

### Tax Tags (South Africa Focus)

```typescript
TaxTag Options:
  ├─ RENTAL_INCOME
  │  ├─ South Africa: Schedule 6 (rental property)
  │  ├─ Calculation: Gross rent - deductible expenses
  │  └─ Rate: Personal income tax rates
  │
  ├─ CAPITAL_GAINS
  │  ├─ South Africa: CGT (asset disposed, gain realized)
  │  ├─ Rate: 50% of gain included in taxable income (individuals)
  │  └─ Exemption: First R40,000/year
  │
  ├─ DEPRECIATION
  │  ├─ South Africa: Section 11(e) allowance
  │  ├─ Applies to: Business equipment, vehicles, buildings
  │  └─ Method: Straight-line, accelerated per asset class
  │
  ├─ VAT
  │  ├─ Input: VAT on purchases (recoverable if registered)
  │  ├─ Output: VAT on sales
  │  └─ Registration: Required if turnover > R1m
  │
  ├─ WEAR_AND_TEAR
  │  ├─ South Africa: For rental properties
  │  ├─ Allowance: 1% of cost per annum (max 10%)
  │  └─ Claim separately from depreciation
  │
  └─ TRANSFER_DUTY
     ├─ South Africa: Due when property transfers
     ├─ Rate: Sliding scale 0-13%
     └─ Trigger: Asset scope change (personal → business)
```

### Compliance Tracking

```
Asset Register View:
├─ Tax Compliant Assets (green)
│  └─ All renewals current, records filed
│
├─ Tax Pending (yellow)
│  └─ Renewal due this quarter
│  └─ Documentation needed
│
└─ Tax Non-Compliant (red)
   └─ Overdue renewals
   └─ Missing documentation
```

---

## NETWORK EFFECTS: CONTACTS + ASSETS

### Contact Roles in Asset Context

```
Property Asset:
  ├─ Contact: Estate Agent
  │  └─ Role: "Sold/Rented property"
  │  └─ Commission tracking
  │
  ├─ Contact: Tenant
  │  └─ Role: "Occupies property"
  │  └─ Rent due dates, lease terms
  │
  ├─ Contact: Maintenance Plumber
  │  └─ Role: "Services property"
  │  └─ Service history, ratings
  │
  ├─ Contact: Insurance Broker
  │  └─ Role: "Insures property"
  │  └─ Policy details, renewals
  │
  └─ Contact: Tax Accountant
     └─ Role: "Advises on tax"
     └─ Documentation submitted

WHEN ASSET SYNCS WITH FAMILY:
  ├─ All contacts linked to asset get visibility option
  ├─ Family can add their own contacts
  ├─ Common contacts detected
  └─ Service coordination possible
```

---

## FIRESTORE SCHEMA

```
users/{userId}
  ├─ assets/
  │  └─ {assetId}
  │     ├─ name: string
  │     ├─ type: AssetType
  │     ├─ value: number
  │     ├─ scope: 'personal' | 'family' | 'business'
  │     ├─ linkedContacts: ContactLink[]
  │     ├─ syncStatus: SyncStatus
  │     ├─ sharedWith: AssetShare[]
  │     └─ auditLog: AuditEntry[]
  │
  └─ assetSyncLog/
     └─ {logId} - Track all syncs

families/{familyId}
  ├─ pooledAssets/
  │  └─ {assetId}
  │     ├─ assetRef: reference to user asset
  │     ├─ sharedBy: userId[]
  │     ├─ ownership: {userId: percentage}
  │     ├─ incomeRouting: {userId: percentage}
  │     └─ status: 'shared' | 'pooled'
  │
  └─ familyWealth/
     └─ snapshot: {
        "date": Date,
        "totalAssets": number,
        "totalLiabilities": number,
        "netWealth": number,
        "assetBreakdown": {}
        }
```

---

## SERVICE INTERFACE SPECIFICATION

```typescript
interface IAssetService {
  // CRUD Operations
  createAsset(userId: string, asset: Partial<Asset>): Promise<string>;
  getAsset(userId: string, assetId: string): Promise<Asset>;
  getUserAssets(userId: string, scope?: 'personal'|'family'|'business'): Promise<Asset[]>;
  updateAsset(userId: string, assetId: string, updates: Partial<Asset>): Promise<void>;
  deleteAsset(userId: string, assetId: string): Promise<void>;
  
  // Valuation
  updateValuation(userId: string, assetId: string, value: number, method: string): Promise<void>;
  getValuationHistory(userId: string, assetId: string): Promise<ValuationRecord[]>;
  
  // Sharing & Permissions
  shareAsset(userId: string, assetId: string, targetUserId: string, scope: 'view'|'edit'): Promise<void>;
  unshareAsset(userId: string, assetId: string, targetUserId: string): Promise<void>;
  getSharedAssets(userId: string): Promise<Asset[]>;
  respondToShareRequest(userId: string, assetId: string, approved: boolean): Promise<void>;
  
  // Contact Linking
  linkContact(userId: string, assetId: string, contactId: string, role: string): Promise<void>;
  unlinkContact(userId: string, assetId: string, contactId: string): Promise<void>;
  getAssetContacts(userId: string, assetId: string): Promise<Contact[]>;
  
  // Event Linking
  linkEvent(userId: string, assetId: string, eventId: string, eventType: string): Promise<void>;
  unlinkEvent(userId: string, assetId: string, eventId: string): Promise<void>;
  
  // Ownership & Co-Ownership
  addCoOwner(userId: string, assetId: string, coOwnerId: string, percentage: number): Promise<void>;
  removeCoOwner(userId: string, assetId: string, coOwnerId: string): Promise<void>;
  updateCoOwnershipPercentage(userId: string, assetId: string, coOwnerId: string, percentage: number): Promise<void>;
  
  // Scoping & Transitions
  changeScope(userId: string, assetId: string, newScope: string, reason: string): Promise<void>;
  getScopeTransitionHistory(userId: string, assetId: string): Promise<ScopeTransition[]>;
  
  // Net Wealth Calculation
  calculatePersonalNetWealth(userId: string, date?: Date): Promise<number>;
  calculateFamilyNetWealth(familyId: string, date?: Date): Promise<number>;
  getNetWealthBreakdown(userId: string): Promise<AssetBreakdown>;
  
  // Compliance
  getTaxableAssets(userId: string, taxYear: number): Promise<Asset[]>;
  generateTaxReport(userId: string, taxYear: number): Promise<TaxReport>;
  getComplianceStatus(userId: string): Promise<ComplianceStatus>;
  
  // Sync
  syncAsset(userId: string, assetId: string, targetApp: string): Promise<void>;
  getSyncHistory(userId: string, assetId: string): Promise<SyncRecord[]>;
  resolveConflict(userId: string, assetId: string, resolution: 'keep-local'|'keep-remote'|'merge'): Promise<void>;
}
```

---

## UI/UX FLOWS

### My Assets Page
```
TAB 1: All Assets
  ├─ Filter by scope: Personal / Family / Business / Household
  ├─ Sort by: Value / Category / Date Added / Sync Status
  └─ List view showing:
     ├─ Asset name + category icon
     ├─ Current value
     ├─ Ownership status (mine / shared / pooled)
     ├─ Sync status (synced / pending / conflict)
     └─ Actions: View / Edit / Share / Sync / Delete

TAB 2: Add Asset
  ├─ Guided wizard:
     ├─ Step 1: Choose category
     ├─ Step 2: Enter details
     ├─ Step 3: Set valuation
     ├─ Step 4: Link contacts/events
     ├─ Step 5: Upload documents
     └─ Step 6: Set scope & sharing

TAB 3: Shared With Me
  ├─ Assets others shared
  ├─ Show sharer name
  ├─ Accept / Reject / Details
  └─ Once accepted, appears in "All Assets"

TAB 4: Net Wealth Dashboard
  ├─ Total personal net worth
  ├─ Breakdown by category (pie chart)
  ├─ Timeline showing wealth growth
  ├─ Major assets highlighted
  └─ Liabilities deducted
```

### Asset Detail Page
```
HEADER:
  ├─ Asset name, type icon, value
  ├─ Ownership badge (Personal / Shared / Pooled)
  ├─ Sync status
  └─ Last updated

TABS:
  ├─ Overview
  │  ├─ Description
  │  ├─ Current value + valuation date
  │  ├─ Location (if applicable)
  │  └─ Photos/Documents
  │
  ├─ Ownership
  │  ├─ Primary owner
  │  ├─ Co-owners with %
  │  ├─ Add/Remove co-owners
  │  └─ Steward/Custodian
  │
  ├─ Sharing
  │  ├─ Shared with (list)
  │  ├─ Share button
  │  ├─ Unshare options
  │  └─ Permission levels
  │
  ├─ Contacts
  │  ├─ Linked contacts (property manager, etc.)
  │  ├─ Add/Remove contact
  │  └─ Update role
  │
  ├─ Events
  │  ├─ Linked calendar events
  │  ├─ Maintenance history
  │  ├─ Renewal dates
  │  └─ Link new event
  │
  ├─ Compliance
  │  ├─ Tax tags
  │  ├─ Insurance details
  │  ├─ Renewal status
  │  └─ Documents
  │
  ├─ Valuation History
  │  ├─ Timeline of valuations
  │  ├─ Add new valuation
  │  └─ Depreciation chart
  │
  └─ Sync Log
     ├─ Synced to apps
     ├─ Sync status
     ├─ Last sync date
     └─ Conflict resolution
```

---

## IMPLEMENTATION ROADMAP

### Phase 1A (Week 1-2): Foundation
- [ ] Create `AssetService.ts` with core CRUD
- [ ] Create `Asset` data model and Firestore schema
- [ ] Build "My Assets" page with list view
- [ ] Build "Add Asset" wizard (basic)
- [ ] Deploy to MNI

### Phase 1B (Week 3-4): Enhancement
- [ ] Add asset detail page
- [ ] Link assets to contacts
- [ ] Link assets to calendar events
- [ ] Add valuation history
- [ ] Add compliance tagging

### Phase 2 (Week 5-6): Sharing & Family
- [ ] Implement asset sharing workflow
- [ ] Add consent for shared assets
- [ ] Build family asset pooling
- [ ] Add net wealth dashboard
- [ ] Sync to LifeSync

### Phase 3 (Week 7-8): Advanced
- [ ] Tax report generation
- [ ] Depreciation calculation
- [ ] Import/export functionality
- [ ] Mobile optimization
- [ ] Full ecosystem sync (Hub)

---

## SUCCESS METRICS

| Metric | Target | Measurement |
|--------|--------|-------------|
| Asset Coverage | 80% of types | All categories usable |
| Sync Accuracy | 100% | No data loss |
| Sharing Clarity | 100% | Users understand permissions |
| Tax Compliance | 95% | Reports ready for SARS |
| Family Pooling | 100% | Common assets merged |
| Performance | < 2s load | All pages responsive |

---

**Status:** ✅ SPECIFICATION COMPLETE  
**Next:** Build Asset Service & UI Components


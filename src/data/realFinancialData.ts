/**
 * Real Financial Data - Extracted from Asset-Register backups
 * October 22, 2025
 * 
 * Data extracted from:
 * - MLANDELI_NOTEMBA_PERSONAL_ASSET_LIABILITY_REGISTER.md
 * - Property bond statements
 * - Vehicle finance documentation
 * - Banking records
 * - IP Portfolio documentation
 */

import { Asset, Liability } from '@/types/financial';
import { primaryResidenceImprovements } from '@/data/propertyImprovements';
import { mniIPAssets } from '@/data/ipAssets';

/**
 * REAL ASSETS DATA
 * Based on October 21, 2025 asset register audit
 */
export const realAssets: Asset[] = [
  // PRIMARY RESIDENCE
  {
    id: 'asset-001',
    name: 'Primary Residence - Johannesburg',
    category: 'property',
    subCategory: 'house',
    description: 'Residential property with extensive improvements: 5 bedrooms (3 en-suite), 4 bathrooms, 3 rental units, solar system, battery storage, water harvesting, equipped workshop. Located at 22 Lineata.',
    value: 3500000,
    currency: 'ZAR',
    location: '22 Lineata, Johannesburg, Gauteng',
    owner: 'Salatiso Mdeni',
    coOwners: ['Visa Mdeni'],
    
    // Depreciation & Valuation
    purchaseValue: 1400000,
    purchaseYear: 2015,
    estimatedDepreciationRate: -0.02, // Appreciation ~2% per year
    condition: 'excellent',
    conditionNotes: 'Well-maintained with ongoing renovations and improvements. All systems operational. Regular maintenance schedule followed.',
    
    acquireDate: '2015-03-15',
    maintenanceNextDue: '2025-11-15',
    tags: ['primary-residence', 'family', 'owned', 'investment', 'solar', 'water-harvesting', 'rental-income'],
    shared: true,
    
    // Ownership & Use
    ownershipType: 'joint',
    useClassification: 'family-shared',
    primaryUser: 'Salatiso & Visa Mdeni (Family Residence)',
    
    // Property Improvements
    improvements: primaryResidenceImprovements,
    
    createdAt: new Date('2025-10-21').toISOString(),
    updatedAt: new Date('2025-10-22').toISOString(),
  },

  // VEHICLES
  {
    id: 'asset-002',
    name: 'Infiniti 2019 - Premium Sedan',
    category: 'vehicle',
    description: 'Premium sedan, daily use vehicle. Well-maintained with maintenance records. NOW PAID OFF (settled 2021).',
    value: 800000,
    currency: 'ZAR',
    location: 'Johannesburg',
    owner: 'Salatiso Mdeni',
    acquireDate: '2019-06-10',
    maintenanceNextDue: '2025-12-20',
    tags: ['vehicle', 'premium', 'daily-use', 'paid-off'],
    shared: true,
    ownershipType: 'personal',
    useClassification: 'family-shared',
    primaryUser: 'Salatiso Mdeni',
    createdAt: new Date('2025-10-21').toISOString(),
    updatedAt: new Date('2025-10-22').toISOString(),
  },

  {
    id: 'asset-003',
    name: 'Renault - Sedan',
    category: 'vehicle',
    description: 'Renault vehicle. Documentation in Vehicles/Renault folder.',
    value: 400000,
    currency: 'ZAR',
    location: 'Johannesburg',
    owner: 'Salatiso Mdeni',
    acquireDate: '2016-08-22',
    maintenanceNextDue: '2025-11-30',
    tags: ['vehicle', 'sedan'],
    shared: false,
    ownershipType: 'personal',
    useClassification: 'personal-use',
    primaryUser: 'Salatiso Mdeni',
    createdAt: new Date('2025-10-21').toISOString(),
    updatedAt: new Date('2025-10-22').toISOString(),
  },

  {
    id: 'asset-004',
    name: 'Triton Bakkie - Work Vehicle',
    category: 'vehicle',
    description: 'Triton bakkie/truck for work and utility purposes. Well-maintained. Primary user: Salatiso.',
    value: 350000,
    currency: 'ZAR',
    location: 'Johannesburg',
    owner: 'Salatiso Mdeni',
    acquireDate: '2020-11-15',
    maintenanceNextDue: '2025-11-01',
    tags: ['vehicle', 'work-vehicle', 'bakkie'],
    shared: true,
    ownershipType: 'business',
    useClassification: 'business',
    primaryUser: 'Salatiso Mdeni',
    createdAt: new Date('2025-10-21').toISOString(),
    updatedAt: new Date('2025-10-22').toISOString(),
  },

  // EQUIPMENT & PERSONAL PROPERTY
  {
    id: 'asset-005',
    name: 'Dash Cam Systems - Security Equipment',
    category: 'equipment',
    description: 'Multiple dash cam recording systems for security and surveillance. Active video monitoring.',
    value: 50000,
    currency: 'ZAR',
    location: 'Multiple (Johannesburg)',
    owner: 'Salatiso Mdeni',
    tags: ['security', 'equipment', 'video-surveillance'],
    shared: false,
    ownershipType: 'personal',
    useClassification: 'family-shared',
    primaryUser: 'Salatiso Mdeni',
    createdAt: new Date('2025-10-21').toISOString(),
    updatedAt: new Date('2025-10-22').toISOString(),
  },

  // CASH & EMERGENCY FUND
  {
    id: 'asset-006',
    name: 'Emergency Fund - Cash Reserves',
    category: 'cash',
    description: 'Liquid emergency reserves for family security and contingencies.',
    value: 100000,
    currency: 'ZAR',
    owner: 'Salatiso Mdeni',
    tags: ['emergency', 'liquid', 'cash-reserve'],
    shared: true,
    ownershipType: 'family',
    useClassification: 'family-shared',
    primaryUser: 'Family',
    createdAt: new Date('2025-10-21').toISOString(),
    updatedAt: new Date('2025-10-22').toISOString(),
  },

  // INTELLECTUAL PROPERTY (Reference from personal register)
  {
    id: 'asset-007',
    name: 'Professional Credentials & Certifications',
    category: 'ip',
    description: 'Safety, Environmental & Health (EHS) professional credentials, SAIOH membership, professional consulting expertise.',
    value: 0, // Income-generating asset but no fixed valuation
    currency: 'ZAR',
    owner: 'Salatiso Mdeni',
    tags: ['ip', 'professional', 'credentials', 'consulting'],
    shared: false,
    ownershipType: 'personal',
    useClassification: 'business',
    primaryUser: 'Salatiso Mdeni',
    createdAt: new Date('2025-10-21').toISOString(),
    updatedAt: new Date('2025-10-22').toISOString(),
  },

  // RENTAL UNITS - INCOME-GENERATING ASSETS
  {
    id: 'asset-008',
    name: 'Rental Unit A - 2 Bed, 1 Bath (Downstairs)',
    category: 'property',
    description: 'Rental unit within primary property. 2 bedrooms, 1 bathroom. Monthly rent: R6500. Electricity prepaid by tenant.',
    value: 280000, // Estimated market value
    currency: 'ZAR',
    location: 'Downstairs - Primary Property',
    owner: 'Salatiso Mdeni',
    coOwners: ['Visa Mdeni'],
    tags: ['rental-unit', 'income-generating', 'occupied'],
    shared: false,
    ownershipType: 'joint',
    useClassification: 'investment',
    primaryUser: 'Tenant - Current',
    createdAt: new Date('2025-10-22').toISOString(),
    updatedAt: new Date('2025-10-22').toISOString(),
  },

  {
    id: 'asset-009',
    name: 'Rental Unit B - Pool House (1 Bed, 1 Bath)',
    category: 'property',
    description: 'Rental unit - Pool House. 1 bedroom, 1 bathroom. Monthly rent: R5500. Electricity prepaid by tenant. Water included.',
    value: 220000, // Estimated market value
    currency: 'ZAR',
    location: 'Backyard (Pool House) - Primary Property',
    owner: 'Salatiso Mdeni',
    coOwners: ['Visa Mdeni'],
    tags: ['rental-unit', 'income-generating', 'occupied', 'pool-house'],
    shared: false,
    ownershipType: 'joint',
    useClassification: 'investment',
    primaryUser: 'Tenant - Current',
    createdAt: new Date('2025-10-22').toISOString(),
    updatedAt: new Date('2025-10-22').toISOString(),
  },

  {
    id: 'asset-010',
    name: 'Rental Unit C - Studio (Empty)',
    category: 'property',
    description: 'Rental unit - Empty studio. Rental potential: R8500/month. Ready for tenancy. Electricity and water prepaid utilities.',
    value: 200000, // Estimated market value
    currency: 'ZAR',
    location: 'Side Property - Primary Residence',
    owner: 'Salatiso Mdeni',
    coOwners: ['Visa Mdeni'],
    tags: ['rental-unit', 'income-potential', 'empty', 'studio'],
    shared: false,
    ownershipType: 'joint',
    useClassification: 'investment',
    primaryUser: 'Available for Tenant',
    createdAt: new Date('2025-10-22').toISOString(),
    updatedAt: new Date('2025-10-22').toISOString(),
  },

  // WORKSHOP EQUIPMENT COLLECTION
  {
    id: 'asset-011',
    name: 'Workshop Equipment - Power Tools Collection',
    category: 'equipment',
    description: 'Fully stocked woodworking and DIY workshop including: Planer, Table Saw, 2x Circular Saws (corded/cordless), Cordless Jigsaw, Reciprocating Saw.',
    value: 18200,
    currency: 'ZAR',
    location: 'Workshop - Primary Property',
    owner: 'Mlandeli Notemba',
    tags: ['workshop', 'power-tools', 'diy', 'woodworking'],
    shared: false,
    ownershipType: 'personal',
    useClassification: 'personal-use',
    primaryUser: 'Visa',
    createdAt: new Date('2025-10-22').toISOString(),
    updatedAt: new Date('2025-10-22').toISOString(),
  },

  {
    id: 'asset-012',
    name: 'Workshop Equipment - Grinders & Angle Tools',
    category: 'equipment',
    description: 'Professional grinders collection: Large corded grinder, standard corded grinder, 1x cordless grinder (needs repair).',
    value: 3500,
    currency: 'ZAR',
    location: 'Workshop - Primary Property',
    owner: 'Mlandeli Notemba',
    tags: ['workshop', 'grinders', 'metal-work'],
    shared: false,
    ownershipType: 'personal',
    useClassification: 'personal-use',
    primaryUser: 'Visa',
    createdAt: new Date('2025-10-22').toISOString(),
    updatedAt: new Date('2025-10-22').toISOString(),
  },

  {
    id: 'asset-013',
    name: 'Workshop Equipment - Drills & Impact Tools',
    category: 'equipment',
    description: 'Cordless drill collection: 2x Standard cordless drills, 2x Impact drills (high-power). All fully functional.',
    value: 4000,
    currency: 'ZAR',
    location: 'Workshop - Primary Property',
    owner: 'Mlandeli Notemba',
    tags: ['workshop', 'drills', 'cordless'],
    shared: false,
    ownershipType: 'personal',
    useClassification: 'personal-use',
    primaryUser: 'Visa',
    createdAt: new Date('2025-10-22').toISOString(),
    updatedAt: new Date('2025-10-22').toISOString(),
  },

  {
    id: 'asset-014',
    name: 'Workshop Equipment - Air Compressor System',
    category: 'equipment',
    description: '50-litre pneumatic air compressor with full hose system and fittings. Professional grade.',
    value: 6000,
    currency: 'ZAR',
    location: 'Workshop - Primary Property',
    owner: 'Mlandeli Notemba',
    tags: ['workshop', 'compressor', 'pneumatic'],
    shared: false,
    ownershipType: 'personal',
    useClassification: 'personal-use',
    primaryUser: 'Visa',
    createdAt: new Date('2025-10-22').toISOString(),
    updatedAt: new Date('2025-10-22').toISOString(),
  },

  {
    id: 'asset-015',
    name: 'Workshop Equipment - Pneumatic Nailers',
    category: 'equipment',
    description: 'Pneumatic nail gun collection: Framing nailer (large), Concrete nailer, Finish nailer (small). All operational.',
    value: 4100,
    currency: 'ZAR',
    location: 'Workshop - Primary Property',
    owner: 'Mlandeli Notemba',
    tags: ['workshop', 'pneumatic', 'nailers'],
    shared: false,
    ownershipType: 'personal',
    useClassification: 'personal-use',
    primaryUser: 'Visa',
    createdAt: new Date('2025-10-22').toISOString(),
    updatedAt: new Date('2025-10-22').toISOString(),
  },

  {
    id: 'asset-016',
    name: 'Workshop Equipment - Demolition Breaker',
    category: 'equipment',
    description: 'Heavy-duty pneumatic demolition breaker/jackhammer with multiple chisels and points. Professional tool.',
    value: 4500,
    currency: 'ZAR',
    location: 'Workshop - Primary Property',
    owner: 'Mlandeli Notemba',
    tags: ['workshop', 'demo-tools', 'pneumatic'],
    shared: false,
    ownershipType: 'personal',
    useClassification: 'personal-use',
    primaryUser: 'Visa',
    createdAt: new Date('2025-10-22').toISOString(),
    updatedAt: new Date('2025-10-22').toISOString(),
  },

  {
    id: 'asset-017',
    name: 'Workshop Equipment - Petrol Generator',
    category: 'equipment',
    description: '2.8 kW portable petrol/gas generator. Useful for on-site work and emergency backup power.',
    value: 3500,
    currency: 'ZAR',
    location: 'Workshop - Primary Property',
    owner: 'Mlandeli Notemba',
    tags: ['workshop', 'generator', 'power-backup'],
    shared: false,
    ownershipType: 'personal',
    useClassification: 'personal-use',
    primaryUser: 'Visa',
    createdAt: new Date('2025-10-22').toISOString(),
    updatedAt: new Date('2025-10-22').toISOString(),
  },

  // INTELLECTUAL PROPERTY ASSETS - MNI PORTFOLIO
  ...mniIPAssets,
];

/**
 * REAL LIABILITIES DATA
 * Based on financial documentation and bond statements
 */
export const realLiabilities: Liability[] = [
  // PRIMARY MORTGAGE
  {
    id: 'liability-001',
    name: 'Primary Residence Mortgage - Home Bond',
    category: 'mortgage',
    description: 'Home mortgage bond for primary residence in Johannesburg. Bond documents in Property/Properties folder.',
    amount: 1800000,
    currency: 'ZAR',
    owner: 'Mlandeli Notemba',
    dueDate: '2035-03-15',
    monthlyPayment: 18000,
    interestRate: 10.5,
    createdAt: new Date('2025-10-21').toISOString(),
    updatedAt: new Date('2025-10-22').toISOString(),
  },

  // VEHICLE FINANCE
  {
    id: 'liability-002',
    name: 'Vehicle Finance - Infiniti 2019',
    category: 'loan',
    description: 'Vehicle financing for Infiniti premium sedan. Terms and agreements in Vehicles/Vehicle Finance folder.',
    amount: 420000,
    currency: 'ZAR',
    owner: 'Mlandeli Notemba',
    dueDate: '2027-06-10',
    monthlyPayment: 8500,
    interestRate: 9.75,
    createdAt: new Date('2025-10-21').toISOString(),
    updatedAt: new Date('2025-10-22').toISOString(),
  },

  // MUNICIPAL RATES & PROPERTY TAX (Annual)
  {
    id: 'liability-003',
    name: 'Municipal Rates & Property Tax - Annual',
    category: 'tax',
    description: 'Annual municipal rates and property tax for primary residence. Payable monthly by arrangement.',
    amount: 45000,
    currency: 'ZAR',
    owner: 'Mlandeli Notemba',
    dueDate: '2025-12-31',
    monthlyPayment: 3750,
    createdAt: new Date('2025-10-21').toISOString(),
    updatedAt: new Date('2025-10-22').toISOString(),
  },

  // SERVICE OBLIGATIONS - BUNDLED
  {
    id: 'liability-004',
    name: 'Monthly Service Obligations',
    category: 'service',
    description: 'Bundled service obligations including internet (Multiple ISPs), mobile (MTN), medical aid, and insurance premiums.',
    amount: 10800, // Annual total: ~R900/month average x 12
    currency: 'ZAR',
    owner: 'Mlandeli Notemba',
    dueDate: '2025-12-31',
    monthlyPayment: 900,
    createdAt: new Date('2025-10-21').toISOString(),
    updatedAt: new Date('2025-10-22').toISOString(),
  },
];

/**
 * FINANCIAL SUMMARY
 * Real numbers based on October 22, 2025 audit (including rental units and workshop)
 */
export const financialSummary = {
  totalAssets: realAssets.reduce((sum, asset) => sum + asset.value, 0), // Calculated dynamically
  totalLiabilities: realLiabilities.reduce((sum, liability) => sum + liability.amount, 0), // R 2,275,800
  netWorth: 0, // Calculated as totalAssets - totalLiabilities
  
  breakdown: {
    assets: {
      realEstate: 2500000,
      rentalUnits: 700000, // 3 rental units: 280k + 220k + 200k
      vehicles: 1550000, // Infiniti + Renault + Triton
      workshopEquipment: 43400, // All workshop tools + equipment
      otherEquipment: 50000, // Dash cams
      cash: 100000,
    },
    liabilities: {
      mortgages: 1800000,
      autoLoans: 420000,
      taxes: 45000,
      services: 10800,
    },
  },
};

// Calculate net worth
financialSummary.netWorth = financialSummary.totalAssets - financialSummary.totalLiabilities;

/**
 * DATA EXTRACTION METADATA
 * For audit trail and verification
 */
export const dataExtractionMetadata = {
  extractionDate: new Date('2025-10-22').toISOString(),
  sourceRegister: 'MLANDELI_NOTEMBA_PERSONAL_ASSET_LIABILITY_REGISTER.md',
  backupFolders: [
    'Asset-Register/Personal-20251021T213802Z-1-001',
    'Asset-Register/Property-20251021T213500Z-1-001',
    'Asset-Register/Vehicles-20251021T213452Z-1-001',
  ],
  dataValidationStatus: 'VERIFIED',
  notes: 'Real data extracted from backup registers. Some values estimated pending formal valuations.',
};

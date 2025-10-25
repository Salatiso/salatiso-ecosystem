/**
 * Intellectual Property Assets - MNI Portfolio
 * October 22, 2025
 * 
 * All IP assets owned and managed by:
 * Mlandeli Notemba Investments (MNI) - K2025816934
 * 
 * Valuation Basis: South African Development Market Rates (2024)
 * Development costs based on enterprise-grade app development by reputable SA firms
 * Reference: Deloitte, Satyam, Accenture SA pricing models
 */

import { Asset, IPDetails } from '@/types/financial';

/**
 * IP Development Cost Baseline (South African Market Rates - 2024)
 * Based on quotes from top SA development firms
 */
export const SA_DEV_RATES = {
  // Mobile App Development (iOS/Android)
  mobileAppBasic: {
    label: 'Basic Mobile App (50 hours)',
    rate: 2500, // per hour
    hours: 50,
    total: 125000, // ZAR ~€8,400
  },
  mobileAppIntermediate: {
    label: 'Intermediate Mobile App (300 hours)',
    rate: 2500,
    hours: 300,
    total: 750000, // ZAR ~€50k
  },
  mobileAppEnterprise: {
    label: 'Enterprise Mobile App (1000+ hours)',
    rate: 2500,
    hours: 1000,
    total: 2500000, // ZAR ~€168k
  },
  
  // Web Platform Development
  webPlatformBasic: {
    label: 'Basic Web Platform (200 hours)',
    rate: 2000,
    hours: 200,
    total: 400000,
  },
  webPlatformEnterprise: {
    label: 'Enterprise Web Platform (1500+ hours)',
    rate: 2000,
    hours: 1500,
    total: 3000000,
  },
  
  // Patent Development & Filing
  patentDevelopment: {
    label: 'Patent Development & Documentation',
    cost: 50000,
  },
  patentFiling: {
    label: 'Patent Filing (SA + International)',
    cost: 75000,
  },
  
  // Cloud Infrastructure & Backend (Annual)
  cloudInfrastructureAnnual: {
    label: 'Enterprise Cloud Infrastructure (Annual)',
    cost: 500000,
  },
};

/**
 * MNI ECOSYSTEM APPS - IP ASSETS
 * All owned and managed by Mlandeli Notemba Investments
 */

// ==================== TIER 1: FLAGSHIP APPLICATIONS ====================

export const safetyHelpIP: Asset = {
  id: 'ip-001',
  name: 'SafetyHelp Platform',
  category: 'ip',
  subCategory: 'software',
  description: 'Community safety coordination & legal aid platform with incident reporting, emergency response coordination, and legal documentation tools.',
  value: 4500000, // Current estimated market value
  currency: 'ZAR',
  location: 'Cloud-based (Firebase)',
  owner: 'Mlandeli Notemba Investments',
  
  // Ownership
  ownershipType: 'business',
  useClassification: 'business',
  primaryUser: 'Public - Community Access',
  
  acquireDate: '2023-03-01',
  tags: ['flagship', 'active', 'community', 'safety', 'legal', 'revenue-generating'],
  shared: false,
  
  // Valuation
  purchaseValue: 0, // Built in-house
  purchaseYear: 2023,
  estimatedDepreciationRate: -0.05, // Appreciating 5% annually
  condition: 'excellent',
  conditionNotes: 'Actively maintained, regularly updated, strong user engagement',
  
  ipDetails: {
    // Valuation
    developmentCost: 1500000, // ~600 hours at SA rates
    developmentCostBasis: 'South African development market rates (Deloitte 2024) - 600 hours @ ZAR 2,500/hr',
    estimatedMarketValue: 4500000,
    valuationDate: '2025-10-22',
    valuationMethod: 'income-approach',
    
    // IP Type
    ipType: 'software',
    status: 'active',
    registrationNumber: 'SA-2023-SW-001',
    registrationDate: '2023-03-15',
    
    // Technology
    platforms: ['Android', 'Web'],
    technology: ['Firebase', 'React', 'React Native', 'Cloud Functions'],
    features: [
      'Incident reporting & tracking',
      'Community safety alerts',
      'Legal aid documentation',
      'Emergency response coordination',
      'Evidence capture',
      'Offline-first sync',
    ],
    
    // Business Performance
    revenue: 480000, // Annual estimate from various sources
    activeUsers: 45000,
    
    // Performance History
    annualPerformance: [
      {
        year: 2023,
        revenue: 150000,
        costs: 120000,
        profitLoss: 30000,
        activeUsers: 8000,
        growth: 0, // Launch year
        notes: 'Platform launched, initial adoption phase',
      },
      {
        year: 2024,
        revenue: 320000,
        costs: 180000,
        profitLoss: 140000,
        activeUsers: 28000,
        growth: 250,
        notes: 'Strong growth, community adoption accelerating',
      },
      {
        year: 2025,
        revenue: 480000,
        costs: 200000,
        profitLoss: 280000,
        activeUsers: 45000,
        growth: 61,
        notes: 'Continued growth, now sustainable',
      },
    ],
    
    // Risk
    riskLevel: 'low',
    securityStatus: 'Encrypted end-to-end, SOC 2 compliant',
    complianceNotes: 'POPIA compliant, Privacy Act aligned',
    
    // Licensing
    usageRights: 'Public access, freemium model',
    licensing: [
      {
        licenseType: 'non-exclusive',
        term: 'Perpetual',
      },
    ],
  },
  
  createdAt: '2025-10-21',
  updatedAt: '2025-10-22',
};

export const legalHelpIP: Asset = {
  id: 'ip-002',
  name: 'LegalHelp Documentation Suite',
  category: 'ip',
  subCategory: 'software',
  description: 'Legal document generation, template management, and compliance tracking for individuals and small businesses.',
  value: 2800000,
  currency: 'ZAR',
  location: 'Cloud-based (Firebase)',
  owner: 'Mlandeli Notemba Investments',
  
  ownershipType: 'business',
  useClassification: 'business',
  primaryUser: 'Public - Legal Professional & Small Business',
  
  acquireDate: '2023-06-01',
  tags: ['active', 'legal', 'compliance', 'document-generation'],
  shared: false,
  
  purchaseValue: 0,
  purchaseYear: 2023,
  estimatedDepreciationRate: -0.03,
  condition: 'excellent',
  conditionNotes: 'Well-maintained with regular compliance updates',
  
  ipDetails: {
    developmentCost: 950000, // ~380 hours
    developmentCostBasis: 'SA market rates - 380 hours @ ZAR 2,500/hr',
    estimatedMarketValue: 2800000,
    valuationDate: '2025-10-22',
    valuationMethod: 'income-approach',
    
    ipType: 'software',
    status: 'active',
    registrationNumber: 'SA-2023-SW-002',
    registrationDate: '2023-06-20',
    
    platforms: ['Android', 'Web'],
    technology: ['Firebase', 'React', 'Firestore', 'Document Generation API'],
    features: [
      'Legal template library',
      'Document generation',
      'Digital signature support',
      'Compliance checklist',
      'Document version control',
      'Multi-language support',
    ],
    
    revenue: 220000,
    activeUsers: 12000,
    
    annualPerformance: [
      {
        year: 2023,
        revenue: 50000,
        costs: 80000,
        profitLoss: -30000,
        activeUsers: 1500,
        growth: 0,
        notes: 'Initial launch, building features',
      },
      {
        year: 2024,
        revenue: 140000,
        costs: 95000,
        profitLoss: 45000,
        activeUsers: 7000,
        growth: 367,
        notes: 'Legal features gaining traction',
      },
      {
        year: 2025,
        revenue: 220000,
        costs: 110000,
        profitLoss: 110000,
        activeUsers: 12000,
        growth: 71,
        notes: 'Profitable, growing user base',
      },
    ],
    
    riskLevel: 'low',
    securityStatus: 'Bank-grade encryption, POPIA compliant',
    complianceNotes: 'Legal document compliance verified by Webber Wentzel',
    
    usageRights: 'Public access with premium tier',
    licensing: [
      {
        licenseType: 'non-exclusive',
        term: 'Perpetual',
      },
    ],
  },
  
  createdAt: '2025-10-21',
  updatedAt: '2025-10-22',
};

// ==================== TIER 2: ECOSYSTEM APPS ====================

export const bizHelpIP: Asset = {
  id: 'ip-003',
  name: 'BizHelp Business Tools',
  category: 'ip',
  subCategory: 'software',
  description: 'Small business management suite with invoicing, expense tracking, and client management.',
  value: 1800000,
  currency: 'ZAR',
  location: 'Cloud-based (Firebase)',
  owner: 'Mlandeli Notemba Investments',
  
  ownershipType: 'business',
  useClassification: 'business',
  primaryUser: 'Small Business Owners',
  
  acquireDate: '2023-09-01',
  tags: ['active', 'business-tools', 'b2b'],
  shared: false,
  
  purchaseValue: 0,
  purchaseYear: 2023,
  estimatedDepreciationRate: -0.04,
  condition: 'excellent',
  
  ipDetails: {
    developmentCost: 750000, // 300 hours
    developmentCostBasis: 'SA market rates - 300 hours @ ZAR 2,500/hr',
    estimatedMarketValue: 1800000,
    valuationDate: '2025-10-22',
    valuationMethod: 'income-approach',
    
    ipType: 'software',
    status: 'active',
    registrationNumber: 'SA-2023-SW-003',
    registrationDate: '2023-09-10',
    
    platforms: ['Android', 'Web'],
    technology: ['Firebase', 'React', 'Firestore'],
    features: [
      'Invoice generation',
      'Expense tracking',
      'Client management',
      'Financial reporting',
      'Multi-user collaboration',
      'Offline mode',
    ],
    
    revenue: 180000,
    activeUsers: 8500,
    
    annualPerformance: [
      {
        year: 2023,
        revenue: 30000,
        costs: 70000,
        profitLoss: -40000,
        activeUsers: 1000,
        growth: 0,
        notes: 'Beta phase',
      },
      {
        year: 2024,
        revenue: 95000,
        costs: 85000,
        profitLoss: 10000,
        activeUsers: 5000,
        growth: 400,
        notes: 'Gaining SME adoption',
      },
      {
        year: 2025,
        revenue: 180000,
        costs: 95000,
        profitLoss: 85000,
        activeUsers: 8500,
        growth: 70,
        notes: 'Strong SME market penetration',
      },
    ],
    
    riskLevel: 'low',
    usageRights: 'SaaS subscription model',
    licensing: [{ licenseType: 'non-exclusive', term: 'SaaS annual' }],
  },
  
  createdAt: '2025-10-21',
  updatedAt: '2025-10-22',
};

export const ekhayaIP: Asset = {
  id: 'ip-004',
  name: 'Ekhaya Property Management',
  category: 'ip',
  subCategory: 'software',
  description: 'Family property portfolio management and vacation rental coordination platform.',
  value: 1200000,
  currency: 'ZAR',
  location: 'Cloud-based (Firebase)',
  owner: 'Mlandeli Notemba Investments',
  
  ownershipType: 'business',
  useClassification: 'business',
  primaryUser: 'Property Managers & Owners',
  
  acquireDate: '2023-12-01',
  tags: ['active', 'property', 'real-estate'],
  shared: false,
  
  purchaseValue: 0,
  purchaseYear: 2023,
  estimatedDepreciationRate: -0.03,
  condition: 'excellent',
  
  ipDetails: {
    developmentCost: 500000, // 200 hours
    developmentCostBasis: 'SA market rates - 200 hours @ ZAR 2,500/hr',
    estimatedMarketValue: 1200000,
    valuationDate: '2025-10-22',
    valuationMethod: 'income-approach',
    
    ipType: 'software',
    status: 'active',
    registrationNumber: 'SA-2024-SW-001',
    registrationDate: '2024-01-15',
    
    platforms: ['Android', 'Web', 'iOS'],
    technology: ['Firebase', 'React', 'Google Maps API', 'Stripe'],
    features: [
      'Property portfolio tracking',
      'Rental booking system',
      'Tenant management',
      'Maintenance request tracking',
      'Payment processing',
      'Document storage',
    ],
    
    revenue: 150000,
    activeUsers: 2800,
    
    annualPerformance: [
      {
        year: 2024,
        revenue: 80000,
        costs: 60000,
        profitLoss: 20000,
        activeUsers: 1500,
        growth: 0,
        notes: 'Platform launched mid-year',
      },
      {
        year: 2025,
        revenue: 150000,
        costs: 70000,
        profitLoss: 80000,
        activeUsers: 2800,
        growth: 87,
        notes: 'Property market growth driving adoption',
      },
    ],
    
    riskLevel: 'low',
    usageRights: 'B2B SaaS for property managers',
    licensing: [{ licenseType: 'non-exclusive', term: 'SaaS annual' }],
  },
  
  createdAt: '2025-10-21',
  updatedAt: '2025-10-22',
};

// ==================== TIER 3: SUPPORT PLATFORMS ====================

export const familyValueIP: Asset = {
  id: 'ip-005',
  name: 'FamilyValue Wealth Tracking',
  category: 'ip',
  subCategory: 'software',
  description: 'Family financial dashboard with multi-generational wealth aggregation and planning.',
  value: 950000,
  currency: 'ZAR',
  location: 'Cloud-based (Firebase)',
  owner: 'Mlandeli Notemba Investments',
  
  ownershipType: 'business',
  useClassification: 'business',
  
  acquireDate: '2024-03-01',
  tags: ['active', 'financial', 'family'],
  shared: false,
  
  purchaseValue: 0,
  purchaseYear: 2024,
  estimatedDepreciationRate: -0.04,
  condition: 'excellent',
  
  ipDetails: {
    developmentCost: 425000, // 170 hours
    developmentCostBasis: 'SA market rates - 170 hours @ ZAR 2,500/hr',
    estimatedMarketValue: 950000,
    valuationDate: '2025-10-22',
    valuationMethod: 'cost-approach',
    
    ipType: 'software',
    status: 'active',
    
    platforms: ['Web'],
    technology: ['React', 'Firebase', 'Chart.js', 'Stripe'],
    features: [
      'Asset aggregation',
      'Multi-user access',
      'Financial dashboard',
      'Goal tracking',
      'Wealth planning tools',
    ],
    
    revenue: 85000,
    activeUsers: 1200,
    
    annualPerformance: [
      {
        year: 2024,
        revenue: 40000,
        costs: 50000,
        profitLoss: -10000,
        activeUsers: 600,
        growth: 0,
        notes: 'Launch phase',
      },
      {
        year: 2025,
        revenue: 85000,
        costs: 55000,
        profitLoss: 30000,
        activeUsers: 1200,
        growth: 100,
        notes: 'Growing adoption among high-net-worth families',
      },
    ],
    
    riskLevel: 'low',
    usageRights: 'Premium subscription model',
  },
  
  createdAt: '2025-10-21',
  updatedAt: '2025-10-22',
};

export const lifeSyncIP: Asset = {
  id: 'ip-006',
  name: 'LifeSync Platform Core',
  category: 'ip',
  subCategory: 'software',
  description: 'Cross-platform synchronization engine and data backbone for entire ecosystem.',
  value: 2200000, // Critical infrastructure
  currency: 'ZAR',
  location: 'Cloud-based (Firebase)',
  owner: 'Mlandeli Notemba Investments',
  
  ownershipType: 'business',
  useClassification: 'business',
  
  acquireDate: '2023-01-01',
  tags: ['flagship', 'infrastructure', 'patent-pending'],
  shared: false,
  
  purchaseValue: 0,
  purchaseYear: 2023,
  estimatedDepreciationRate: -0.08, // High appreciation due to patent value
  condition: 'excellent',
  
  ipDetails: {
    developmentCost: 1200000, // 480 hours complex development
    developmentCostBasis: 'SA enterprise rates - 480 hours @ ZAR 2,500/hr',
    estimatedMarketValue: 2200000,
    valuationDate: '2025-10-22',
    valuationMethod: 'income-approach',
    
    ipType: 'software',
    status: 'active',
    registrationNumber: 'PATENT-PENDING-LSP-2024',
    registrationDate: '2024-06-01',
    
    platforms: ['Android', 'Web', 'iOS'],
    technology: ['Firebase', 'Cloud Functions', 'React Native', 'Mesh Network'],
    features: [
      'Real-time sync across apps',
      'Offline-first architecture',
      'Conflict resolution',
      'End-to-end encryption',
      'Mesh network capability',
    ],
    
    // No direct revenue - infrastructure cost allocator
    revenue: 0,
    
    annualPerformance: [
      {
        year: 2023,
        revenue: 0,
        costs: 300000,
        profitLoss: -300000,
        activeUsers: 0,
        growth: 0,
        notes: 'Infrastructure development',
      },
      {
        year: 2024,
        revenue: 0,
        costs: 250000,
        profitLoss: -250000,
        activeUsers: 0,
        growth: 0,
        notes: 'Supporting all ecosystem apps',
      },
      {
        year: 2025,
        revenue: 0,
        costs: 200000,
        profitLoss: -200000,
        activeUsers: 0,
        growth: 0,
        notes: 'Core infrastructure, no direct monetization',
      },
    ],
    
    riskLevel: 'low',
    securityStatus: 'Bank-level encryption, continuous security audits',
    complianceNotes: 'GDPR and POPIA compliant',
    
    usageRights: 'Internal ecosystem use + licensing opportunity',
    licensing: [
      {
        licenseType: 'exclusive',
        term: 'Internal',
      },
    ],
  },
  
  createdAt: '2025-10-21',
  updatedAt: '2025-10-22',
};

// ==================== PATENTS & PENDING IP ====================

export const patentPendingIP: Asset = {
  id: 'ip-007',
  name: 'Patent Portfolio - Ecosystem Innovations',
  category: 'ip',
  subCategory: 'patent',
  description: 'Collection of 7 patent-pending innovations covering ecosystem governance model, sync protocols, and community communication architecture.',
  value: 1500000, // Conservative estimate pending approval
  currency: 'ZAR',
  location: 'South African Patent Office + International',
  owner: 'Mlandeli Notemba Investments',
  
  ownershipType: 'business',
  useClassification: 'business',
  
  acquireDate: '2024-06-01',
  tags: ['patent-pending', 'innovation', 'high-value', 'strategic'],
  shared: false,
  
  purchaseValue: 0,
  purchaseYear: 2024,
  estimatedDepreciationRate: 0, // Patents appreciate over time
  condition: 'excellent',
  
  ipDetails: {
    developmentCost: 125000, // Patent filing & documentation
    developmentCostBasis: 'SA Patent filing costs - 7 applications @ ~ZAR 18k each',
    estimatedMarketValue: 1500000,
    valuationDate: '2025-10-22',
    valuationMethod: 'market-comparison',
    
    ipType: 'patent',
    status: 'pending',
    registrationNumber: 'SA-PAT-PENDING-2024-001 through 007',
    registrationDate: '2024-06-15',
    
    features: [
      'Governance model (Patent 1)',
      'LifeSync protocol (Patent 2)',
      'Mesh network architecture (Patent 3)',
      'Community trust framework (Patent 4)',
      'Data privacy model (Patent 5)',
      'Cross-platform sync (Patent 6)',
      'Offline collaboration (Patent 7)',
    ],
    
    annualPerformance: [
      {
        year: 2024,
        revenue: 0,
        costs: 125000,
        profitLoss: -125000,
        activeUsers: 0,
        growth: 0,
        notes: 'Patent applications filed',
      },
      {
        year: 2025,
        revenue: 0,
        costs: 75000,
        profitLoss: -75000,
        activeUsers: 0,
        growth: 0,
        notes: 'In examination phase',
      },
    ],
    
    riskLevel: 'medium',
    securityStatus: 'Patent protection pending',
    complianceNotes: 'Applications submitted to SA Patent Office and WIPO',
    
    usageRights: 'Exclusive to MNI pending approval',
  },
  
  createdAt: '2025-10-21',
  updatedAt: '2025-10-22',
};

// ==================== SUPPORTING PLATFORMS ====================

export const theHubIP: Asset = {
  id: 'ip-008',
  name: 'The Hub - Ecosystem Dashboard',
  category: 'ip',
  subCategory: 'software',
  description: 'Central ecosystem dashboard and app launcher for all MNI applications.',
  value: 700000,
  currency: 'ZAR',
  location: 'Cloud-based (Firebase)',
  owner: 'Mlandeli Notemba Investments',
  
  ownershipType: 'business',
  useClassification: 'business',
  
  acquireDate: '2023-06-01',
  tags: ['active', 'platform'],
  shared: false,
  
  purchaseValue: 0,
  purchaseYear: 2023,
  estimatedDepreciationRate: -0.03,
  condition: 'excellent',
  
  ipDetails: {
    developmentCost: 300000,
    developmentCostBasis: 'SA market rates - 120 hours @ ZAR 2,500/hr',
    estimatedMarketValue: 700000,
    valuationDate: '2025-10-22',
    valuationMethod: 'cost-approach',
    
    ipType: 'software',
    status: 'active',
    
    platforms: ['Web'],
    technology: ['React', 'Firebase'],
    features: [
      'App launcher',
      'User dashboard',
      'Cross-app navigation',
      'Notification center',
      'User profile management',
    ],
    
    revenue: 0,
    activeUsers: 75000, // Aggregate across all users
    
    usageRights: 'Internal ecosystem interface',
  },
  
  createdAt: '2025-10-21',
  updatedAt: '2025-10-22',
};

/**
 * COMPLETE IP ASSETS ARRAY
 * All intellectual property owned by MNI
 */
export const mniIPAssets: Asset[] = [
  safetyHelpIP,
  legalHelpIP,
  bizHelpIP,
  ekhayaIP,
  familyValueIP,
  lifeSyncIP,
  patentPendingIP,
  theHubIP,
];

/**
 * IP PORTFOLIO SUMMARY
 */
export const ipPortfolioSummary = {
  totalIP: mniIPAssets.length,
  totalValue: mniIPAssets.reduce((sum, asset) => sum + asset.value, 0),
  activeApps: mniIPAssets.filter(a => a.ipDetails?.status === 'active').length,
  patentsPending: mniIPAssets.filter(a => a.ipDetails?.ipType === 'patent').length,
  totalAnnualRevenue: mniIPAssets.reduce((sum, a) => sum + (a.ipDetails?.revenue || 0), 0),
  totalActiveUsers: mniIPAssets.reduce((sum, a) => sum + (a.ipDetails?.activeUsers || 0), 0),
  
  currency: 'ZAR',
  lastUpdated: '2025-10-22',
  owner: 'Mlandeli Notemba Investments (MNI) - K2025816934',
};

export default mniIPAssets;

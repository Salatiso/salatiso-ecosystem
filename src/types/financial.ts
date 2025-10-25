/**
 * Financial Management Types
 * Asset and Liability interfaces
 */

export interface Asset {
  id: string;
  name: string;
  category: 'property' | 'vehicle' | 'equipment' | 'tools' | 'cash' | 'investment' | 'ip' | 'document' | 'other';
  subCategory?: string; // e.g., "house", "apartment", "car", "workshop", "power-tool", "software", "patent"
  description: string;
  value: number; // Current market value
  currency: string;
  location?: string;
  owner: string;
  coOwners?: string[];
  
  // Depreciation & Valuation
  purchaseValue?: number; // Original purchase price
  purchaseYear?: number; // Year acquired
  estimatedDepreciationRate?: number; // % per year (negative for appreciation)
  condition?: 'excellent' | 'good' | 'fair' | 'poor'; // Condition assessment
  conditionNotes?: string; // Detailed condition notes
  
  acquireDate?: string;
  maintenanceNextDue?: string;
  tags?: string[];
  shared?: boolean;
  
  // Ownership & Use Classification
  ownershipType: 'personal' | 'joint' | 'family' | 'business' | 'trust';
  useClassification: 'personal-use' | 'family-shared' | 'business' | 'investment' | 'storage' | 'other';
  primaryUser?: string;
  
  // Property Improvements (for real estate)
  improvements?: PropertyImprovement[];
  
  // IP-Specific Fields
  ipDetails?: IPDetails;
  
  // Platform Integration
  platformLinks?: {
    pigeeback?: { intent: 'sale' | 'lending'; listingId?: string; price?: number };
    ekhaya?: { intent: 'rental'; listingId?: string; price?: number };
    delivery?: { intent: 'delivery'; active?: boolean };
  };
  
  createdAt: string;
  updatedAt: string;
}

export interface PropertyImprovement {
  id: string;
  name: string;
  description: string;
  category: 'renovation' | 'addition' | 'conversion' | 'upgrade' | 'infrastructure' | 'other';
  completionYear?: number;
  estimatedValue?: number; // Cost/value added
  currency?: string;
  notes?: string;
}

export interface IPDetails {
  // Valuation Fields
  developmentCost?: number; // Original development cost
  developmentCostBasis?: string; // e.g., "South African market rates - Deloitte 2024"
  estimatedMarketValue?: number; // Market valuation if sold
  valuationDate?: string; // Date of valuation
  valuationMethod?: 'market-comparison' | 'cost-approach' | 'income-approach' | 'other';
  
  // Performance Tracking
  annualPerformance?: {
    year: number;
    revenue?: number;
    costs?: number;
    profitLoss?: number;
    activeUsers?: number;
    growth?: number; // % growth
    notes?: string;
  }[];
  
  // IP Type & Status
  ipType: 'software' | 'patent' | 'trademark' | 'trade-secret' | 'copyright' | 'other';
  status: 'active' | 'pending' | 'maintenance' | 'archived';
  registrationNumber?: string;
  registrationDate?: string;
  expirationDate?: string;
  jurisdictions?: string[]; // Where registered/protected
  
  // Technical Details
  platforms?: string[]; // e.g., ['iOS', 'Android', 'Web']
  technology?: string[]; // e.g., ['Firebase', 'React', 'Node.js']
  features?: string[]; // Core features/capabilities
  
  // Business Details
  revenue?: number; // Annual revenue if applicable
  activeUsers?: number; // Current user base
  usageRights?: string; // Who can use it and how
  licensing?: {
    licensee?: string;
    licenseType: 'exclusive' | 'non-exclusive';
    royaltyRate?: number;
    term?: string;
  }[];
  
  // Risk & Security
  riskLevel?: 'low' | 'medium' | 'high';
  securityStatus?: string;
  complianceNotes?: string;
  
  // Documentation
  portfolioLink?: string; // Link to detailed portfolio
  documentationLink?: string; // Technical documentation
}

export interface Liability {
  id: string;
  name: string;
  category: 'mortgage' | 'loan' | 'credit' | 'tax' | 'service' | 'other';
  description: string;
  amount: number;
  currency: string;
  owner: string;
  dueDate?: string;
  monthlyPayment?: number;
  interestRate?: number;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface FinancialSummary {
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
  breakdown?: {
    assets: Record<string, number>;
    liabilities: Record<string, number>;
  };
}

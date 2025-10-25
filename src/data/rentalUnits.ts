/**
 * Rental Units Asset Information
 * 3 rental units within the primary property generating rental income
 */

export interface RentalUnit {
  id: string;
  name: string;
  type: 'studio' | '1bed' | '2bed' | '3bed' | 'other';
  location: string; // e.g., "Downstairs", "Backyard", "Upper level"
  occupancyStatus: 'occupied' | 'empty' | 'maintenance';
  currentTenant?: string;
  rentalAmount: number; // Monthly rental in ZAR
  currency: string;
  utilities: {
    electricity: 'prepaid' | 'postpaid' | 'included';
    water: 'prepaid' | 'postpaid' | 'included';
    other?: string[];
  };
  bedrooms: number;
  bathrooms: number;
  amenities?: string[];
  lastMaintenanceDate?: Date;
  notes?: string;
  linkedAssetId?: string; // Link to Asset record in asset register
}

export const rentalUnits: RentalUnit[] = [
  {
    id: 'rental-001',
    name: 'Unit A - Downstairs 2 Bed, 1 Bath',
    type: '2bed',
    location: 'Downstairs',
    occupancyStatus: 'occupied',
    currentTenant: 'Current Tenant (To be updated)',
    rentalAmount: 6500,
    currency: 'ZAR',
    utilities: {
      electricity: 'prepaid',
      water: 'prepaid',
      other: ['refuse removal'],
    },
    bedrooms: 2,
    bathrooms: 1,
    amenities: ['kitchen', 'living area', 'off-street parking'],
    notes: 'Monthly rental: R6500. Electricity prepaid by tenant. Well-maintained unit.',
  },
  {
    id: 'rental-002',
    name: 'Unit B - Pool House (1 Bed, 1 Bath)',
    type: '1bed',
    location: 'Backyard (Pool House)',
    occupancyStatus: 'occupied',
    currentTenant: 'Current Tenant (To be updated)',
    rentalAmount: 5500,
    currency: 'ZAR',
    utilities: {
      electricity: 'prepaid',
      water: 'included',
    },
    bedrooms: 1,
    bathrooms: 1,
    amenities: ['kitchenette', 'lounge', 'en-suite bathroom'],
    notes: 'Monthly rental: R5500. Electricity prepaid by tenant. Pool House location.',
  },
  {
    id: 'rental-003',
    name: 'Unit C - Empty Unit (Studio)',
    type: 'studio',
    location: 'Side Property',
    occupancyStatus: 'empty',
    rentalAmount: 8500, // Potential rental
    currency: 'ZAR',
    utilities: {
      electricity: 'prepaid',
      water: 'prepaid',
    },
    bedrooms: 0,
    bathrooms: 1,
    amenities: ['open plan studio', 'kitchenette', 'bathroom', 'off-street parking'],
    notes: 'Currently empty. Rental potential: R8500/month. Ready for tenancy.',
  },
];

/**
 * Calculate total monthly rental income from occupied units
 */
export const getTotalMonthlyRentalIncome = (): number => {
  return rentalUnits
    .filter(unit => unit.occupancyStatus === 'occupied')
    .reduce((total, unit) => total + unit.rentalAmount, 0);
};

/**
 * Calculate potential rental income (including empty units)
 */
export const getTotalPotentialRentalIncome = (): number => {
  return rentalUnits.reduce((total, unit) => total + unit.rentalAmount, 0);
};

/**
 * Get occupancy rate
 */
export const getOccupancyRate = (): {
  occupied: number;
  empty: number;
  total: number;
  occupancyPercentage: number;
} => {
  const occupied = rentalUnits.filter(u => u.occupancyStatus === 'occupied').length;
  const total = rentalUnits.length;
  return {
    occupied,
    empty: total - occupied,
    total,
    occupancyPercentage: (occupied / total) * 100,
  };
};

/**
 * Get unit details by ID
 */
export const getRentalUnitById = (id: string): RentalUnit | undefined => {
  return rentalUnits.find(unit => unit.id === id);
};

/**
 * Get all occupied units
 */
export const getOccupiedUnits = (): RentalUnit[] => {
  return rentalUnits.filter(unit => unit.occupancyStatus === 'occupied');
};

/**
 * Get all empty units
 */
export const getEmptyUnits = (): RentalUnit[] => {
  return rentalUnits.filter(unit => unit.occupancyStatus === 'empty');
};

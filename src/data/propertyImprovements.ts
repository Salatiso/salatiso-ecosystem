/**
 * Property Improvements Tracker
 * Detailed tracking of all improvements made to properties
 */

import { PropertyImprovement } from '@/types/financial';

/**
 * PRIMARY RESIDENCE - IMPROVEMENTS SINCE 2015
 * Comprehensive breakdown of all renovations, additions, and infrastructure
 */

export const primaryResidenceImprovements: PropertyImprovement[] = [
  // STRUCTURAL ADDITIONS & CONVERSIONS
  {
    id: 'improvement-001',
    name: 'Downstairs 2-Bedroom Cottage Conversion',
    description: 'Converted original gamesroom into a 2-bedroom, 1-bathroom cottage unit with kitchen and living area. Full rental unit.',
    category: 'conversion',
    completionYear: 2018,
    estimatedValue: 280000,
    currency: 'ZAR',
    notes: 'Rental potential: R6,500/month. Currently occupied.',
  },

  {
    id: 'improvement-002',
    name: 'Pool House Conversion - 1 Bed Cottage',
    description: 'Removed swimming pool and lapa. Built new 1-bedroom, 1-bathroom cottage (50 sqm) in its place with kitchenette and modern amenities.',
    category: 'conversion',
    completionYear: 2019,
    estimatedValue: 220000,
    currency: 'ZAR',
    notes: 'Rental potential: R5,500/month. Currently occupied. Pool removed, replaced with rental unit.',
  },

  {
    id: 'improvement-003',
    name: 'Upstairs Duplex Addition',
    description: 'Added 2-bedroom duplex unit above pool house cottage (65 sqm). Currently unfinished - walls and flooring in place.',
    category: 'addition',
    completionYear: 2021,
    estimatedValue: 200000,
    currency: 'ZAR',
    notes: 'Rental potential: R8,000-10,000/month when completed. Ready for tenancy fit-out.',
  },

  {
    id: 'improvement-004',
    name: 'Extended Maids Quarters to Workshop',
    description: 'Expanded original maid\'s quarters and converted into professional DIY workshop. Fully stocked with equipment and power supply.',
    category: 'renovation',
    completionYear: 2017,
    estimatedValue: 150000,
    currency: 'ZAR',
    notes: 'Workshop houses R43,400 worth of equipment including planer, table saw, drills, compressor, and tools.',
  },

  // MAIN HOUSE RENOVATIONS
  {
    id: 'improvement-005',
    name: 'Main House Bathroom Expansion',
    description: 'Upgraded from 2 bathrooms to 4 bathrooms. Converted 2 additional rooms to include en-suite bathrooms.',
    category: 'renovation',
    completionYear: 2016,
    estimatedValue: 180000,
    currency: 'ZAR',
    notes: '2 new bathrooms added. 2 rooms now en-suite. Common bathroom accessible to other rooms.',
  },

  {
    id: 'improvement-006',
    name: 'Master Bedroom En-Suite Upgrade',
    description: 'Upgraded and renovated master bedroom with luxury en-suite bathroom.',
    category: 'renovation',
    completionYear: 2016,
    estimatedValue: 80000,
    currency: 'ZAR',
    notes: 'Master bedroom now has private en-suite with modern fixtures.',
  },

  {
    id: 'improvement-007',
    name: 'Visa\'s Room En-Suite Addition',
    description: 'Created dedicated bedroom for Visa with private en-suite bathroom.',
    category: 'renovation',
    completionYear: 2017,
    estimatedValue: 70000,
    currency: 'ZAR',
    notes: 'Second en-suite bedroom. Provides privacy and independence.',
  },

  {
    id: 'improvement-008',
    name: 'Kids Room En-Suite Addition',
    description: 'Third bedroom with en-suite bathroom for children.',
    category: 'renovation',
    completionYear: 2017,
    estimatedValue: 70000,
    currency: 'ZAR',
    notes: 'Kids have dedicated space with private bathroom.',
  },

  {
    id: 'improvement-009',
    name: 'Additional Common Rooms',
    description: 'Added 2 more rooms with access to common bathroom for guest/additional use.',
    category: 'addition',
    completionYear: 2018,
    estimatedValue: 120000,
    currency: 'ZAR',
    notes: 'Guest rooms or family accommodation. Share common bathroom.',
  },

  {
    id: 'improvement-010',
    name: 'Main House Layout - 3BR to Enhanced 3BR+',
    description: 'Converted original 3-bedroom house to enhanced configuration: 3 en-suite bedrooms + 2 additional rooms + 4 bathrooms.',
    category: 'renovation',
    completionYear: 2017,
    estimatedValue: 350000,
    currency: 'ZAR',
    notes: 'Total bedroom count: 5 (3 en-suite + 2 shared). Significant comfort and functionality upgrade.',
  },

  // RENEWABLE ENERGY & INFRASTRUCTURE
  {
    id: 'improvement-011',
    name: 'Solar Panel System - 3.8 kW Generation',
    description: 'Solar photovoltaic system with 3.8 kilowatt generation capacity. Provides renewable energy for property.',
    category: 'infrastructure',
    completionYear: 2020,
    estimatedValue: 85000,
    currency: 'ZAR',
    notes: 'Modern solar panels. Reduces electricity costs. Estimated savings: R800-1200/month.',
  },

  {
    id: 'improvement-012',
    name: 'Battery Storage - 3x 2.8 kW Pylontech',
    description: 'Three Pylontech lithium battery units, each 2.8 kilowatts capacity. Total: 8.4 kW storage.',
    category: 'infrastructure',
    completionYear: 2021,
    estimatedValue: 120000,
    currency: 'ZAR',
    notes: 'All new Pylontech batteries. Enables 24/7 power. Estimated replacement cost: R40k per unit.',
  },

  {
    id: 'improvement-013',
    name: 'Power Inverters - 2x 5 kW',
    description: 'Two 5-kilowatt power inverters. Convert solar/battery DC to AC for household use.',
    category: 'infrastructure',
    completionYear: 2021,
    estimatedValue: 50000,
    currency: 'ZAR',
    notes: 'Hybrid inverters. Handle both solar and battery switching. Current replacement: R25k each.',
  },

  {
    id: 'improvement-014',
    name: 'Water Harvesting System',
    description: 'Rainwater harvesting with storage tanks for sustainability and water independence.',
    category: 'infrastructure',
    completionYear: 2020,
    estimatedValue: 95000,
    currency: 'ZAR',
    notes: 'Three storage tanks: 5000L, 2500L, 2000L. Total capacity: 9,500 litres. Reduces municipal water usage.',
  },

  {
    id: 'improvement-015',
    name: 'Water Tank 5,000 Litre',
    description: 'Primary water storage tank - 5,000 litre capacity.',
    category: 'infrastructure',
    completionYear: 2020,
    estimatedValue: 35000,
    currency: 'ZAR',
    notes: 'Large capacity tank. Estimated replacement: R35,000.',
  },

  {
    id: 'improvement-016',
    name: 'Water Tank 2,500 Litre',
    description: 'Secondary water storage tank - 2,500 litre capacity.',
    category: 'infrastructure',
    completionYear: 2020,
    estimatedValue: 25000,
    currency: 'ZAR',
    notes: 'Mid-capacity tank. Estimated replacement: R25,000.',
  },

  {
    id: 'improvement-017',
    name: 'Water Tank 2,000 Litre',
    description: 'Tertiary water storage tank - 2,000 litre capacity.',
    category: 'infrastructure',
    completionYear: 2020,
    estimatedValue: 20000,
    currency: 'ZAR',
    notes: 'Smaller capacity tank. Estimated replacement: R20,000.',
  },

  // SECURITY & SAFETY
  {
    id: 'improvement-018',
    name: 'Security Enhancements',
    description: 'Gate upgrades, wall reinforcement, alarm system, and access control.',
    category: 'upgrade',
    completionYear: 2016,
    estimatedValue: 50000,
    currency: 'ZAR',
    notes: 'Enhanced perimeter security. Multiple access points with modern locks.',
  },
];

/**
 * Get total improvement value
 */
export const getTotalImprovementValue = (): number => {
  return primaryResidenceImprovements.reduce((sum, imp) => {
    return sum + (imp.estimatedValue || 0);
  }, 0);
};

/**
 * Get improvements by category
 */
export const getImprovementsByCategory = (
  category: PropertyImprovement['category']
): PropertyImprovement[] => {
  return primaryResidenceImprovements.filter(imp => imp.category === category);
};

/**
 * Get improvements by completion year
 */
export const getImprovementsByYear = (year: number): PropertyImprovement[] => {
  return primaryResidenceImprovements.filter(imp => imp.completionYear === year);
};

/**
 * Get improvements timeline
 */
export const getImprovementsTimeline = (): Map<number, PropertyImprovement[]> => {
  const timeline = new Map<number, PropertyImprovement[]>();
  primaryResidenceImprovements.forEach(imp => {
    if (imp.completionYear) {
      if (!timeline.has(imp.completionYear)) {
        timeline.set(imp.completionYear, []);
      }
      timeline.get(imp.completionYear)!.push(imp);
    }
  });
  return timeline;
};

/**
 * Property Value Build-up Over Time
 */
export const propertyValueTimeline = {
  2015: {
    description: '3-bedroom house with swimming pool, lapa, gameroom, maid\'s quarters',
    purchasePrice: 1400000,
    notes: 'Original purchase with basic amenities',
  },
  2016: {
    additions: [
      'Master en-suite upgrade',
      'Security enhancements',
      'Bathroom expansion (2→4)',
    ],
    estimatedValueAdd: 310000,
    cumulativeValue: 1710000,
  },
  2017: {
    additions: [
      'Visa\'s room with en-suite',
      'Kids room with en-suite',
      'Main house renovation completion',
      'Workshop conversion from maid\'s quarters',
    ],
    estimatedValueAdd: 420000,
    cumulativeValue: 2130000,
  },
  2018: {
    additions: [
      '2-bedroom cottage from gamesroom',
      '2 additional guest rooms',
    ],
    estimatedValueAdd: 400000,
    cumulativeValue: 2530000,
  },
  2019: {
    additions: [
      '1-bedroom pool house cottage',
      'Pool and lapa removed',
    ],
    estimatedValueAdd: 220000,
    cumulativeValue: 2750000,
  },
  2020: {
    additions: [
      'Solar system (3.8 kW)',
      'Water harvesting (9,500L capacity)',
    ],
    estimatedValueAdd: 180000,
    cumulativeValue: 2930000,
  },
  2021: {
    additions: [
      'Upstairs duplex addition',
      'Battery storage (3x 2.8kW)',
      'Power inverters (2x 5kW)',
    ],
    estimatedValueAdd: 370000,
    cumulativeValue: 3300000,
  },
  2025: {
    description: 'Current property valuation with all improvements',
    currentValue: 3500000,
    totalImprovementsValue: getTotalImprovementValue(),
    notes: 'Property now includes 3 rental units, solar, batteries, water harvesting, enhanced utilities',
  },
};

/**
 * Summary of property development
 */
export const propertyDevelopmentSummary = {
  originalPurchasePrice: 1400000,
  currentEstimatedValue: 3500000,
  totalImprovementsAdded: getTotalImprovementValue(),
  appreciationAmount: 2100000,
  appreciationPercentage: ((3500000 - 1400000) / 1400000) * 100,
  yearsOfDevelopment: 10,
  annualAppreciation: 210000,
  numberOfRentalUnits: 3,
  rentalIncomeMonthly: 12000,
  rentalIncomeAnnual: 144000,
  renewableEnergyCapacity: '3.8 kW solar + 8.4 kW battery + 9.5k L water storage',
  maintenanceFeatures: [
    '5 bedrooms (3 en-suite)',
    '4 bathrooms',
    '3 rental units with utilities',
    'Workshop fully equipped',
    'Solar + battery + water harvesting',
    'Enhanced security',
    'Modern renovations throughout',
  ],
};

/**
 * Individual property components for detailed view
 */
export const propertyComponents = {
  mainHouse: {
    name: 'Main Residence',
    bedrooms: 5,
    enSuiteBedrooms: 3,
    bathrooms: 4,
    commonBathrooms: 1,
    livingAreas: ['Master en-suite', 'Visa en-suite', 'Kids en-suite', '2 guest rooms with common bath'],
    estimatedValue: 2500000,
  },
  rentalUnits: {
    name: 'Rental Unit Complex',
    totalUnits: 3,
    totalEstimatedValue: 700000,
    monthlyIncome: 12000,
    occupancyRate: 0.667,
    details: [
      {
        name: 'Unit A - 2 Bed Downstairs',
        type: '2bed_1bath',
        estimatedValue: 280000,
        monthlyRent: 6500,
        occupied: true,
      },
      {
        name: 'Unit B - Pool House',
        type: '1bed_1bath',
        estimatedValue: 220000,
        monthlyRent: 5500,
        occupied: true,
      },
      {
        name: 'Unit C - Upstairs Duplex',
        type: '2bed_1bath_unfinished',
        estimatedValue: 200000,
        monthlyRent: 8500,
        occupied: false,
      },
    ],
  },
  infrastructure: {
    name: 'Renewable Energy & Water Systems',
    totalEstimatedValue: 365000,
    components: [
      {
        name: 'Solar PV System',
        capacity: '3.8 kW',
        value: 85000,
        status: 'operational',
      },
      {
        name: 'Battery Storage',
        capacity: '8.4 kW (3x 2.8kW Pylontech)',
        value: 120000,
        status: 'operational',
      },
      {
        name: 'Power Inverters',
        capacity: '2x 5 kW hybrid',
        value: 50000,
        status: 'operational',
      },
      {
        name: 'Water Harvesting',
        capacity: '9,500 litres (3 tanks)',
        value: 95000,
        status: 'operational',
      },
    ],
  },
  workshop: {
    name: 'DIY Workshop',
    location: 'Extended maid quarters',
    totalEquipmentValue: 43400,
    equipmentItems: 20,
    status: 'fully operational',
  },
};

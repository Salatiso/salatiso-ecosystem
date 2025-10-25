/**
 * Asset Categorization & Depreciation Calculations
 * Handles asset grouping, depreciation, and valuation over time
 */

import { Asset } from '@/types/financial';

/**
 * Asset Category Definitions
 * Organized by type with typical depreciation rates
 */
export const assetCategories = {
  property: {
    name: 'Properties & Real Estate',
    icon: 'home',
    subCategories: ['house', 'apartment', 'commercial', 'land', 'rental-unit'],
    typicalDepreciation: -0.02, // Negative = appreciation (2% per year typical)
    description: 'Real estate and property holdings',
  },
  vehicle: {
    name: 'Vehicles',
    icon: 'truck',
    subCategories: ['car', 'bakkie', 'van', 'motorcycle', 'commercial-vehicle'],
    typicalDepreciation: -0.15, // Depreciates ~15% per year
    description: 'Cars, trucks, and vehicles',
  },
  equipment: {
    name: 'Equipment & Machinery',
    icon: 'tool',
    subCategories: ['power-tools', 'workshop', 'compressor', 'generator', 'solar-system', 'batteries', 'inverters', 'water-system'],
    typicalDepreciation: -0.10, // Depreciates ~10% per year
    description: 'Professional equipment and machinery',
  },
  tools: {
    name: 'Tools & Hand Equipment',
    icon: 'wrench',
    subCategories: ['hand-tools', 'power-tools-small', 'measuring-tools', 'safety-equipment'],
    typicalDepreciation: -0.08, // Depreciates ~8% per year
    description: 'Small tools and equipment',
  },
  cash: {
    name: 'Cash & Liquid Assets',
    icon: 'wallet',
    subCategories: ['savings', 'emergency-fund', 'cash-reserves'],
    typicalDepreciation: -0.02, // Inflation adjustment (2% per year)
    description: 'Cash reserves and liquid savings',
  },
  investment: {
    name: 'Investments & Securities',
    icon: 'trending-up',
    subCategories: ['stocks', 'bonds', 'mutual-funds', 'crypto', 'property-investment'],
    typicalDepreciation: 0.05, // Appreciation ~5% per year (variable)
    description: 'Investment holdings',
  },
  ip: {
    name: 'Intellectual Property',
    icon: 'star',
    subCategories: ['credentials', 'patents', 'trademarks', 'software'],
    typicalDepreciation: 0.03, // Appreciation ~3% per year
    description: 'Professional credentials and IP',
  },
  other: {
    name: 'Other Assets',
    icon: 'box',
    subCategories: [],
    typicalDepreciation: -0.10,
    description: 'Miscellaneous assets',
  },
};

/**
 * Get category details
 */
export const getCategoryDetails = (category: string) => {
  return assetCategories[category as keyof typeof assetCategories] || assetCategories.other;
};

/**
 * Calculate current value with depreciation/appreciation
 * @param purchaseValue Original purchase price
 * @param purchaseYear Year of purchase
 * @param depreciationRate Annual depreciation rate (-0.15 = 15% depreciation, 0.05 = 5% appreciation)
 * @param currentYear Year to calculate to (default: current year)
 */
export const calculateCurrentValue = (
  purchaseValue: number,
  purchaseYear: number,
  depreciationRate: number = -0.10,
  currentYear: number = new Date().getFullYear()
): number => {
  const yearsHeld = currentYear - purchaseYear;
  const yearlyMultiplier = 1 + depreciationRate;
  const currentValue = purchaseValue * Math.pow(yearlyMultiplier, yearsHeld);
  return Math.round(currentValue);
};

/**
 * Calculate depreciation over time
 */
export const calculateDepreciation = (
  purchaseValue: number,
  purchaseYear: number,
  depreciationRate: number = -0.10,
  currentYear: number = new Date().getFullYear()
): {
  totalDepreciation: number;
  percentageLoss: number;
  yearlyAverage: number;
} => {
  const yearsHeld = currentYear - purchaseYear;
  const currentValue = calculateCurrentValue(purchaseValue, purchaseYear, depreciationRate, currentYear);
  const totalDepreciation = purchaseValue - currentValue;
  const percentageLoss = (totalDepreciation / purchaseValue) * 100;
  const yearlyAverage = yearsHeld > 0 ? totalDepreciation / yearsHeld : 0;

  return {
    totalDepreciation,
    percentageLoss: Math.round(percentageLoss * 100) / 100,
    yearlyAverage: Math.round(yearlyAverage),
  };
};

/**
 * Create depreciation timeline
 */
export const createDepreciationTimeline = (
  purchaseValue: number,
  purchaseYear: number,
  depreciationRate: number = -0.10,
  yearsToProject: number = 10
): Array<{ year: number; value: number; depreciation: number }> => {
  const timeline: Array<{ year: number; value: number; depreciation: number }> = [];
  
  for (let i = 0; i <= yearsToProject; i++) {
    const year = purchaseYear + i;
    const value = calculateCurrentValue(purchaseValue, purchaseYear, depreciationRate, year);
    const depreciation = purchaseValue - value;
    timeline.push({ year, value, depreciation });
  }
  
  return timeline;
};

/**
 * Asset categorization helper
 */
export const categorizeAssets = (
  assets: Asset[]
): Record<string, Asset[]> => {
  const categorized: Record<string, Asset[]> = {};
  
  Object.keys(assetCategories).forEach(category => {
    categorized[category] = assets.filter(asset => asset.category === category);
  });
  
  return categorized;
};

/**
 * Get assets by condition
 */
export const getAssetsByCondition = (
  assets: Asset[],
  condition: 'excellent' | 'good' | 'fair' | 'poor'
): Asset[] => {
  return assets.filter(asset => asset.condition === condition);
};

/**
 * Calculate total value by category
 */
export const getTotalValueByCategory = (assets: Asset[]): Record<string, number> => {
  const totals: Record<string, number> = {};
  
  assets.forEach(asset => {
    if (!totals[asset.category]) {
      totals[asset.category] = 0;
    }
    totals[asset.category] += asset.value;
  });
  
  return totals;
};

/**
 * Depreciation impact summary
 */
export const getDepreciationSummary = (assets: Asset[]) => {
  let totalPurchaseValue = 0;
  let totalCurrentValue = 0;
  let totalDepreciation = 0;
  const deprecationDetails: Array<{
    name: string;
    category: string;
    purchaseValue: number;
    currentValue: number;
    depreciation: number;
    percentageLoss: number;
  }> = [];

  assets.forEach(asset => {
    if (asset.purchaseValue && asset.purchaseYear) {
      totalPurchaseValue += asset.purchaseValue;
      totalCurrentValue += asset.value;
      
      const deprecation = asset.purchaseValue - asset.value;
      totalDepreciation += deprecation;
      
      const percentageLoss = (deprecation / asset.purchaseValue) * 100;
      deprecationDetails.push({
        name: asset.name,
        category: asset.category,
        purchaseValue: asset.purchaseValue,
        currentValue: asset.value,
        depreciation: Math.round(deprecation),
        percentageLoss: Math.round(percentageLoss * 100) / 100,
      });
    }
  });

  return {
    totalPurchaseValue,
    totalCurrentValue,
    totalDepreciation,
    overallPercentageLoss: totalPurchaseValue > 0 ? 
      Math.round((totalDepreciation / totalPurchaseValue) * 10000) / 100 : 0,
    details: deprecationDetails,
  };
};

/**
 * Asset condition impact on value
 * Adjusts current value based on condition rating
 */
export const getConditionAdjustedValue = (
  currentValue: number,
  condition?: 'excellent' | 'good' | 'fair' | 'poor'
): number => {
  const adjustments = {
    excellent: 1.0,
    good: 0.9,
    fair: 0.75,
    poor: 0.5,
  };
  
  const adjustment = condition ? adjustments[condition] : 1.0;
  return Math.round(currentValue * adjustment);
};

/**
 * Asset value trends
 */
export const getAssetValueTrends = (
  assets: Asset[],
  yearsToProject: number = 5
): Record<string, Array<{ year: number; value: number }>> => {
  const trends: Record<string, Array<{ year: number; value: number }>> = {};

  assets.forEach(asset => {
    if (asset.purchaseValue && asset.purchaseYear) {
      const depreciationRate = asset.estimatedDepreciationRate ?? -0.10;
      const timeline = createDepreciationTimeline(
        asset.purchaseValue,
        asset.purchaseYear,
        depreciationRate,
        yearsToProject
      );
      trends[asset.id] = timeline.map(item => ({
        year: item.year,
        value: item.value,
      }));
    }
  });

  return trends;
};

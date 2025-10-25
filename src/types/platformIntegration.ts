/**
 * External Platform Integration Types
 * Linking assets to pigeeback, ekhaya, delivery services, etc.
 */

export type PlatformName = 'pigeeback-sale' | 'pigeeback-lending' | 'ekhaya-rental' | 'delivery-service' | 'none';

export interface AssetPlatformLink {
  assetId: string;
  assetName: string;
  platform: PlatformName;
  purpose: 'sale' | 'lending' | 'rental' | 'delivery' | 'other';
  listingUrl?: string;
  listingId?: string;
  isActive: boolean;
  listedDate?: Date;
  price?: number;
  commission?: number;
  currency?: string;
  notes?: string;
}

/**
 * Platform Configuration & Integration Details
 */
export const platformIntegrations = {
  'pigeeback-sale': {
    name: 'Pigeeback - Item Marketplace',
    url: 'https://pigeeback-lifecv.web.app/money-lending',
    description: 'Platform for selling items and lending out equipment',
    icon: 'shopping-cart',
    purposes: ['sale', 'lending'],
  },
  'pigeeback-lending': {
    name: 'Pigeeback - Lending Platform',
    url: 'https://pigeeback-lifecv.web.app/tools-equipment',
    description: 'Specialized platform for lending out tools and equipment',
    icon: 'share-2',
    purposes: ['lending'],
  },
  'ekhaya-rental': {
    name: 'Ekhaya - Rural Empowerment',
    url: 'https://ekhaya-lifecv.web.app/rural-empowerment',
    description: 'Platform for renting properties and facilitating rural economic empowerment',
    icon: 'home',
    purposes: ['rental'],
  },
  'delivery-service': {
    name: 'Delivery Service Network',
    url: '#',
    description: 'Use vehicles for commercial deliveries and services',
    icon: 'truck',
    purposes: ['delivery', 'service'],
  },
};

/**
 * Asset Categories That Can Be Listed on Each Platform
 */
export const assetCategoryByPlatform: Record<string, string[]> = {
  'pigeeback-sale': ['equipment', 'vehicle', 'tools', 'other'],
  'pigeeback-lending': ['equipment', 'tools', 'generator', 'compressor'],
  'ekhaya-rental': ['property'],
  'delivery-service': ['vehicle'],
};

/**
 * Get recommended platforms for a given asset
 */
export function getRecommendedPlatforms(
  category: string,
  purpose?: 'sale' | 'lending' | 'rental' | 'delivery'
): PlatformName[] {
  const platforms: PlatformName[] = [];

  if (category === 'equipment' || category === 'vehicle') {
    if (!purpose || purpose === 'sale') platforms.push('pigeeback-sale');
    if (!purpose || purpose === 'lending') platforms.push('pigeeback-lending');
  }

  if (category === 'property' && (!purpose || purpose === 'rental')) {
    platforms.push('ekhaya-rental');
  }

  if (category === 'vehicle' && (!purpose || purpose === 'delivery')) {
    platforms.push('delivery-service');
  }

  return platforms;
}

/**
 * Asset Listing Intent
 * What the user wants to do with an asset
 */
export interface AssetListingIntent {
  assetId: string;
  intent: 'sell' | 'lend' | 'rent' | 'deliver';
  platforms: PlatformName[];
  estimatedPrice?: number;
  commission?: number;
  notes?: string;
}

/**
 * Recommended Assets for Pigeeback Lending
 * (Workshop equipment, tools that can be loaned out)
 */
export const recommendedForLending = [
  'Workshop Equipment - Power Tools Collection',
  'Workshop Equipment - Grinders & Angle Tools',
  'Workshop Equipment - Drills & Impact Tools',
  'Workshop Equipment - Air Compressor System',
  'Workshop Equipment - Pneumatic Nailers',
  'Workshop Equipment - Demolition Breaker',
  'Workshop Equipment - Petrol Generator',
];

/**
 * Recommended Assets for Pigeeback Sale
 * (Spare equipment, surplus items)
 */
export const recommendedForSale = [
  'Workshop Equipment - Petrol Generator',
  'Triton Bakkie - Work Vehicle', // If planning to upgrade
];

/**
 * Recommended Assets for Ekhaya Rental
 * (Rental units and property)
 */
export const recommendedForRental = [
  'Rental Unit A - 2 Bed, 1 Bath (Downstairs)',
  'Rental Unit B - Pool House (1 Bed, 1 Bath)',
  'Rental Unit C - Studio (Empty)',
];

/**
 * Recommended Vehicles for Delivery Service
 */
export const recommendedForDelivery = [
  'Triton Bakkie - Work Vehicle',
  'Infiniti 2019 - Premium Sedan', // For premium deliveries
];

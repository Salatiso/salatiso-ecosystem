/**
 * Workshop Equipment Asset Inventory
 * Fully stocked DIY and woodworking workshop equipment
 */

export interface WorkshopEquipment {
  id: string;
  name: string;
  category:
    | 'power-saws'
    | 'hand-tools'
    | 'drills'
    | 'grinders'
    | 'air-tools'
    | 'compressor'
    | 'demo-tools'
    | 'generator'
    | 'other';
  description: string;
  quantity: number;
  condition: 'excellent' | 'good' | 'fair' | 'needs-repair' | 'not-working';
  powerSource: 'corded' | 'cordless' | 'pneumatic' | 'manual' | 'petrol' | 'gas';
  estimatedValue: number;
  currency: string;
  location: 'Workshop' | 'Storage' | 'Garage' | 'Shed';
  notes?: string;
  linkedAssetId?: string; // Link to Asset record in asset register
  lastMaintenance?: Date;
}

export const workshopEquipment: WorkshopEquipment[] = [
  // Power Saws
  {
    id: 'workshop-001',
    name: 'Planer',
    category: 'power-saws',
    description: 'Professional wood planer for smoothing and sizing lumber',
    quantity: 1,
    condition: 'excellent',
    powerSource: 'corded',
    estimatedValue: 4500,
    currency: 'ZAR',
    location: 'Workshop',
    notes: 'Fully functional, regularly maintained. Essential for woodworking projects.',
  },
  {
    id: 'workshop-002',
    name: 'Table Saw',
    category: 'power-saws',
    description: 'Heavy-duty table saw for ripping and crosscutting',
    quantity: 1,
    condition: 'excellent',
    powerSource: 'corded',
    estimatedValue: 8000,
    currency: 'ZAR',
    location: 'Workshop',
    notes: 'Professional grade equipment. Safety guards and dust collection in place.',
  },
  {
    id: 'workshop-003',
    name: 'Circular Saw (Corded)',
    category: 'power-saws',
    description: 'Corded circular saw for general cutting tasks',
    quantity: 1,
    condition: 'good',
    powerSource: 'corded',
    estimatedValue: 1200,
    currency: 'ZAR',
    location: 'Workshop',
    notes: 'Standard corded model. Functional and reliable.',
  },
  {
    id: 'workshop-004',
    name: 'Circular Saw (Cordless)',
    category: 'power-saws',
    description: 'Cordless circular saw for portable cutting',
    quantity: 1,
    condition: 'good',
    powerSource: 'cordless',
    estimatedValue: 1500,
    currency: 'ZAR',
    location: 'Workshop',
    notes: 'Battery-powered model. Good for on-site work.',
  },
  {
    id: 'workshop-005',
    name: 'Cordless Jigsaw',
    category: 'power-saws',
    description: 'Cordless jigsaw for curved and intricate cuts',
    quantity: 1,
    condition: 'excellent',
    powerSource: 'cordless',
    estimatedValue: 1800,
    currency: 'ZAR',
    location: 'Workshop',
    notes: 'Perfect for detailed woodworking and pattern cutting.',
  },
  {
    id: 'workshop-006',
    name: 'Reciprocating Saw',
    category: 'power-saws',
    description: 'Reciprocating saw for demolition and rough cutting',
    quantity: 1,
    condition: 'excellent',
    powerSource: 'corded',
    estimatedValue: 2000,
    currency: 'ZAR',
    location: 'Workshop',
    notes: 'Professional demolition/cutting tool. Heavy-duty and reliable.',
  },

  // Grinders
  {
    id: 'workshop-007',
    name: 'Angle Grinder (Large - Wired)',
    category: 'grinders',
    description: 'Large professional angle grinder (corded) for metal and masonry',
    quantity: 1,
    condition: 'excellent',
    powerSource: 'corded',
    estimatedValue: 1500,
    currency: 'ZAR',
    location: 'Workshop',
    notes: 'Heavy-duty model. Includes safety guards and various grinding discs.',
  },
  {
    id: 'workshop-008',
    name: 'Angle Grinder (Standard - Wired)',
    category: 'grinders',
    description: 'Standard corded angle grinder',
    quantity: 1,
    condition: 'good',
    powerSource: 'corded',
    estimatedValue: 800,
    currency: 'ZAR',
    location: 'Workshop',
    notes: 'General purpose grinder. Well maintained.',
  },
  {
    id: 'workshop-009',
    name: 'Angle Grinder (Cordless)',
    category: 'grinders',
    description: 'Cordless angle grinder for portable applications',
    quantity: 1,
    condition: 'needs-repair',
    powerSource: 'cordless',
    estimatedValue: 1200,
    currency: 'ZAR',
    location: 'Workshop',
    notes: 'Currently not working. Battery may need replacement or repair.',
  },

  // Drills
  {
    id: 'workshop-010',
    name: 'Cordless Drill (Standard)',
    category: 'drills',
    description: 'Standard cordless drill-driver',
    quantity: 2,
    condition: 'excellent',
    powerSource: 'cordless',
    estimatedValue: 800,
    currency: 'ZAR',
    location: 'Workshop',
    notes: 'Two units available. Essential workshop tools.',
  },
  {
    id: 'workshop-011',
    name: 'Impact Drill (Cordless)',
    category: 'drills',
    description: 'High-power cordless impact drill for tough materials',
    quantity: 2,
    condition: 'excellent',
    powerSource: 'cordless',
    estimatedValue: 1200,
    currency: 'ZAR',
    location: 'Workshop',
    notes: 'Two units available. Excellent for concrete and masonry.',
  },

  // Pneumatic Tools & Compressor
  {
    id: 'workshop-012',
    name: 'Air Compressor (50 Litre)',
    category: 'compressor',
    description: 'Large capacity pneumatic compressor with pressure gauge and safety valve',
    quantity: 1,
    condition: 'excellent',
    powerSource: 'corded',
    estimatedValue: 6000,
    currency: 'ZAR',
    location: 'Workshop',
    notes: 'Professional 50-litre tank. Complete with hose and fittings.',
  },
  {
    id: 'workshop-013',
    name: 'Air Nailer - Framing Nailer (Large)',
    category: 'air-tools',
    description: 'Heavy-duty pneumatic framing nailer',
    quantity: 1,
    condition: 'excellent',
    powerSource: 'pneumatic',
    estimatedValue: 1500,
    currency: 'ZAR',
    location: 'Workshop',
    notes: 'Professional grade. Includes various nail sizes.',
  },
  {
    id: 'workshop-014',
    name: 'Air Nailer - Concrete Nailer',
    category: 'air-tools',
    description: 'Pneumatic concrete/powder actuated nailer',
    quantity: 1,
    condition: 'excellent',
    powerSource: 'pneumatic',
    estimatedValue: 2000,
    currency: 'ZAR',
    location: 'Workshop',
    notes: 'For anchoring materials to concrete. Heavy-duty tool.',
  },
  {
    id: 'workshop-015',
    name: 'Air Nailer - Small/Finish Nailer',
    category: 'air-tools',
    description: 'Pneumatic finish/brad nailer for delicate work',
    quantity: 1,
    condition: 'excellent',
    powerSource: 'pneumatic',
    estimatedValue: 600,
    currency: 'ZAR',
    location: 'Workshop',
    notes: 'Perfect for finish work and trim.',
  },

  // Demo Tools
  {
    id: 'workshop-016',
    name: 'Demolition Breaker (Pneumatic)',
    category: 'demo-tools',
    description: 'Heavy-duty pneumatic demolition/jackhammer',
    quantity: 1,
    condition: 'excellent',
    powerSource: 'pneumatic',
    estimatedValue: 4500,
    currency: 'ZAR',
    location: 'Workshop',
    notes: 'Professional demolition tool. Includes multiple chisels and points.',
  },

  // Generator
  {
    id: 'workshop-017',
    name: 'Petrol Generator (2.8 kW)',
    category: 'generator',
    description: 'Portable gas/petrol generator for emergency power and remote work',
    quantity: 1,
    condition: 'good',
    powerSource: 'petrol',
    estimatedValue: 3500,
    currency: 'ZAR',
    location: 'Workshop',
    notes: '2.8 kW output. Good for powering tools on-site or backup power.',
  },
];

/**
 * Calculate total value of workshop equipment
 */
export const getTotalWorkshopValue = (): number => {
  return workshopEquipment.reduce((total, item) => {
    return total + item.estimatedValue * item.quantity;
  }, 0);
};

/**
 * Get equipment by category
 */
export const getEquipmentByCategory = (
  category: WorkshopEquipment['category']
): WorkshopEquipment[] => {
  return workshopEquipment.filter(item => item.category === category);
};

/**
 * Get equipment by condition status
 */
export const getEquipmentByCondition = (
  condition: WorkshopEquipment['condition']
): WorkshopEquipment[] => {
  return workshopEquipment.filter(item => item.condition === condition);
};

/**
 * Get total number of items (accounting for quantity)
 */
export const getTotalItemCount = (): number => {
  return workshopEquipment.reduce((total, item) => total + item.quantity, 0);
};

/**
 * Get items needing repair or maintenance
 */
export const getItemsNeedingMaintenance = (): WorkshopEquipment[] => {
  return workshopEquipment.filter(
    item => item.condition === 'needs-repair' || item.condition === 'not-working'
  );
};

/**
 * Get all equipment as a simple list with expanded quantities
 */
export const getExpandedEquipmentList = (): WorkshopEquipment[] => {
  const expanded: WorkshopEquipment[] = [];
  workshopEquipment.forEach(item => {
    for (let i = 0; i < item.quantity; i++) {
      expanded.push({
        ...item,
        quantity: 1,
      });
    }
  });
  return expanded;
};

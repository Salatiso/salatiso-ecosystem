/**
 * Household Members Data
 * Tracks family members living in the primary residence and their occupancy status
 */

export interface HouseholdMember {
  id: string;
  name: string;
  relationship: string;
  staysAtPrimaryResidence: boolean;
  residenceType?: 'permanent' | 'temporary' | 'visiting';
  contactId?: string; // Link to contacts if available
  phoneNumber?: string;
  email?: string;
  notes?: string;
}

/**
 * Primary household members
 * Mother, Visa, Tina, Azora, Mila, Solo, Sazi - PERMANENT (stay at primary residence at 22 Lineata)
 * Kwakho, Milande, Milani - Reside in Randburg
 */
export const householdMembers: HouseholdMember[] = [
  // Permanent residents at 22 Lineata primary residence
  {
    id: 'member-001',
    name: 'Nozukile Cynthia Mdeni (Mother)',
    relationship: 'Mother',
    staysAtPrimaryResidence: true,
    residenceType: 'permanent',
    phoneNumber: 'mdeninotembac@gmail.com',
    notes: 'Family matriarch. Lives at 22 Lineata permanently',
  },
  {
    id: 'member-002',
    name: 'Salatiso Mdeni',
    relationship: 'Self',
    staysAtPrimaryResidence: true,
    residenceType: 'permanent',
    phoneNumber: 'spiceinc@gmail.com',
    notes: 'Primary owner and founder. Lives at 22 Lineata permanently.',
  },
  {
    id: 'member-003',
    name: 'Visa Mdeni',
    relationship: 'Sister',
    staysAtPrimaryResidence: true,
    residenceType: 'permanent',
    phoneNumber: 'visasande@gmail.com',
    notes: 'Co-owner of primary residence. Primary user of workshop assets. Lives at 22 Lineata permanently.',
  },
  {
    id: 'member-004',
    name: 'Tina Mdeni',
    relationship: 'Sister',
    staysAtPrimaryResidence: true,
    residenceType: 'permanent',
    phoneNumber: 'tina@salatiso.com',
    notes: 'Lives at 22 Lineata permanently',
  },
  {
    id: 'member-005',
    name: 'Azora Mdeni',
    relationship: 'Daughter (Tina)',
    staysAtPrimaryResidence: true,
    residenceType: 'permanent',
    phoneNumber: 'azoramdeni@gmail.com',
    notes: 'Lives at 22 Lineata permanently',
  },
  {
    id: 'member-006',
    name: 'Mila Mdeni',
    relationship: 'Daughter (Visa)',
    staysAtPrimaryResidence: true,
    residenceType: 'permanent',
    phoneNumber: 'milamdeni@gmail.com',
    notes: 'Lives at 22 Lineata permanently',
  },
  {
    id: 'member-007',
    name: 'Solonwabo Milile Mdeni (Solo)',
    relationship: 'Son (Visa)',
    staysAtPrimaryResidence: true,
    residenceType: 'permanent',
    phoneNumber: 'solo@mdeni.family',
    notes: 'Lives at 22 Lineata permanently',
  },
  {
    id: 'member-008',
    name: 'Sazi Mdeni',
    relationship: 'Son (Salatiso)',
    staysAtPrimaryResidence: true,
    residenceType: 'temporary',
    phoneNumber: 'sazisimdeni@gmail.com',
    notes: 'Primary residence at 22 Lineata with additional time in Melville with mother',
  },

  // Non-primary residence members (Randburg)
  {
    id: 'member-009',
    name: 'Kwakho Eyona Mdeni',
    relationship: 'Sister',
    staysAtPrimaryResidence: false,
    residenceType: 'temporary',
    phoneNumber: 'kwakhomdeni@gmail.com',
    notes: 'Resides in Randburg with family',
  },
  {
    id: 'member-010',
    name: 'Milande Paton Mdeni',
    relationship: 'Nephew (Kwakho)',
    staysAtPrimaryResidence: false,
    residenceType: 'temporary',
    phoneNumber: 'milandep.mdeni@gmail.com',
    notes: 'Son of Kwakho. Resides in Randburg',
  },
  {
    id: 'member-011',
    name: 'Milani Mdeni',
    relationship: 'Niece (Kwakho)',
    staysAtPrimaryResidence: false,
    residenceType: 'temporary',
    phoneNumber: 'milani@mdeni.family',
    notes: 'Daughter of Kwakho. Resides in Randburg',
  },
];

/**
 * Get permanent residents (people who live at the property)
 */
export const getPermanentResidents = (): HouseholdMember[] => {
  return householdMembers.filter(
    m => m.staysAtPrimaryResidence && m.residenceType === 'permanent'
  );
};

/**
 * Get all available users for primary user dropdown (permanent + temporary residents)
 */
export const getAllHouseholdUsers = (): HouseholdMember[] => {
  return householdMembers;
};

/**
 * Get a user by name (fuzzy match)
 */
export const getHouseholdMemberByName = (name: string): HouseholdMember | undefined => {
  return householdMembers.find(
    m => m.name.toLowerCase().includes(name.toLowerCase()) ||
         name.toLowerCase().includes(m.name.toLowerCase())
  );
};

/**
 * Get all household members who can be assigned as primary user
 * (for asset management - anyone in household can use an asset)
 */
export const getAvailablePrimaryUsers = (): string[] => {
  return householdMembers.map(m => m.name);
};

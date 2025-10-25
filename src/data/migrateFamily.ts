/**
 * Family Data Migration
 * Converts existing family.tsx and householdMembers.ts data to Contact format
 * Used for seeding Firebase Firestore with family data
 * 
 * USAGE:
 * import { getMigrationContacts, getMigrationRelationships } from '@/data/migrateFamily';
 * 
 * Then in your migration script:
 * const contacts = getMigrationContacts();
 * const relationships = getMigrationRelationships();
 * await contactsService.addContactsBatch(contacts);
 * // Then add relationships
 */

import type { Contact, ContactRelationship } from '@/services/ContactsService';

/**
 * Get all family members as Contact objects ready for Firestore
 * This normalizes data from family.tsx and householdMembers.ts
 */
export const getMigrationContacts = (userId: string): Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>[] => {
  return [
    // MATRIARCH & ELDERLY
    {
      firstName: 'Nozukile Cynthia',
      lastName: 'Mdeni',
      phoneNumbers: ['+27 81 000 0000'],
      emails: ['mdeninotembac@gmail.com'],
      addresses: ['22 Lineata, Johannesburg, South Africa'],
      category: 'family',
      tags: ['matriarch', 'family-foundation', 'trust-beneficiary'],
      notes: 'Family matriarch (age 64). Born December 16, 1960. Maiden name: Mgedezi (Clan: Xaba). Trust Beneficiary ensuring family legacy benefits all children and future generations.',
      privacy: 'family',
      addedBy: userId,
      isFamilyMember: true,
      isHouseholdMember: true,
      sonnyRole: 'monitor',
      status: 'active',
      dateOfBirth: '1960-12-16',
      residenceLocation: '22 Lineata, Johannesburg',
      residenceType: 'permanent'
    },
    
    // CURRENT GENERATION - SIBLINGS
    {
      firstName: 'Salatiso',
      lastName: 'Mdeni',
      phoneNumbers: ['+27 82 123 4567'],
      emails: ['spiceinc@gmail.com'],
      addresses: ['22 Lineata, Johannesburg, South Africa'],
      category: 'family',
      tags: ['founder', 'visionary', 'cto', 'steward'],
      notes: 'Founder and visionary leader (age 43). Born September 16, 1982. Became father figure at age 11 when father passed in 1993. Father of Sazi. Dedicated to building sustainable solutions through Ubuntu principles. Primary owner of 22 Lineata.',
      privacy: 'family',
      addedBy: userId,
      isFamilyMember: true,
      isHouseholdMember: true,
      sonnyRole: 'monitor',
      status: 'active',
      dateOfBirth: '1982-09-16',
      residenceLocation: '22 Lineata, Johannesburg',
      residenceType: 'permanent'
    },
    {
      firstName: 'Visa',
      lastName: 'Mdeni',
      phoneNumbers: ['+27 83 234 5678'],
      emails: ['visasande@gmail.com'],
      addresses: ['22 Lineata, Johannesburg, South Africa'],
      category: 'family',
      tags: ['marketing-lead', 'global-expansion', 'co-owner', 'business-strategist'],
      notes: 'Dynamic leader (age 40) driving global expansion and marketing excellence. Born May 28, 1985. Mother of Solonwabo (Solo) and Mila. Direct sibling of Salatiso, Tina, and Kwakho. Co-owner of primary residence.',
      privacy: 'family',
      addedBy: userId,
      isFamilyMember: true,
      isHouseholdMember: true,
      sonnyRole: 'monitor',
      status: 'active',
      dateOfBirth: '1985-05-28',
      residenceLocation: '22 Lineata, Johannesburg',
      residenceType: 'permanent'
    },
    {
      firstName: 'Tina',
      lastName: 'Mdeni',
      phoneNumbers: ['+27 84 345 6789'],
      emails: ['tina@salatiso.com'],
      addresses: ['22 Lineata, Johannesburg, South Africa'],
      category: 'family',
      tags: ['education-lead', 'finance-oversight', 'mother', 'strategist'],
      notes: 'Bridging education and financial excellence (age 35). Born May 1, 1990. Mother of Azora (born April 10, 2021). Direct sibling of Salatiso, Visa, and Kwakho. Resides permanently at 22 Lineata.',
      privacy: 'family',
      addedBy: userId,
      isFamilyMember: true,
      isHouseholdMember: true,
      sonnyRole: 'monitor',
      status: 'active',
      dateOfBirth: '1990-05-01',
      residenceLocation: '22 Lineata, Johannesburg',
      residenceType: 'permanent'
    },
    {
      firstName: 'Kwakho',
      lastName: 'Mdeni',
      phoneNumbers: ['+27 85 456 7890'],
      emails: ['kwakhomdeni@gmail.com'],
      addresses: ['Randburg, Johannesburg, South Africa'],
      category: 'family',
      tags: ['community-engagement', 'partnership-lead', 'youngest-sibling', 'mother'],
      notes: 'Building bridges between family enterprise and communities (age 32). Born September 15, 1993. Mother of Milande (May 5, 2017) and Milani (December 25, 2024). Youngest sibling, knew father least. Resides in Randburg with partner and family.',
      privacy: 'family',
      addedBy: userId,
      isFamilyMember: true,
      isHouseholdMember: false,
      sonnyRole: 'monitor',
      status: 'active',
      dateOfBirth: '1993-09-15',
      residenceLocation: 'Randburg, Johannesburg',
      residenceType: 'temporary'
    },

    // NEXT GENERATION - CHILDREN
    {
      firstName: 'Solonwabo Milile',
      lastName: 'Mdeni',
      phoneNumbers: ['+27 86 567 8901'],
      emails: ['solo@mdeni.family'],
      addresses: ['22 Lineata, Johannesburg, South Africa'],
      category: 'family',
      tags: ['cto', 'technology-lead', 'son-visa', 'young-leader'],
      notes: 'Next-generation technology leader (age 15). Born March 18, 2010. Son of Visa Mdeni. Elder brother to Mila. Developing technical excellence while balancing education. Resides at 22 Lineata.',
      privacy: 'family',
      addedBy: userId,
      isFamilyMember: true,
      isHouseholdMember: true,
      sonnyRole: 'monitored',
      status: 'developing',
      dateOfBirth: '2010-03-18',
      residenceLocation: '22 Lineata, Johannesburg',
      residenceType: 'permanent'
    },
    {
      firstName: 'Sazi',
      lastName: 'Mdeni',
      phoneNumbers: ['+27 87 111 2222'],
      emails: ['sazisimdeni@gmail.com'],
      addresses: ['22 Lineata, Johannesburg & Melville, South Africa'],
      category: 'family',
      tags: ['son-salatiso', 'young-learner', 'creative'],
      notes: 'Young family member (age 7). Born March 28, 2018. Son of Salatiso Mdeni. Primary residence at 22 Lineata with additional time spent in Melville with mother. Learning from family wisdom.',
      privacy: 'family',
      addedBy: userId,
      isFamilyMember: true,
      isHouseholdMember: true,
      sonnyRole: 'monitored',
      status: 'developing',
      dateOfBirth: '2018-03-28',
      residenceLocation: '22 Lineata, Johannesburg / Melville',
      residenceType: 'visiting'
    },
    {
      firstName: 'Azora',
      lastName: 'Mdeni',
      phoneNumbers: ['+27 87 555 6666'],
      emails: ['azoramdeni@gmail.com'],
      addresses: ['22 Lineata, Johannesburg, South Africa'],
      category: 'family',
      tags: ['daughter-tina', 'young-learner', 'joyful'],
      notes: 'Precious young family member (age 4). Born April 10, 2021. Daughter of Tina Mdeni. Learning through play and family interactions. Resides at 22 Lineata.',
      privacy: 'family',
      addedBy: userId,
      isFamilyMember: true,
      isHouseholdMember: true,
      sonnyRole: 'monitored',
      status: 'developing',
      dateOfBirth: '2021-04-10',
      residenceLocation: '22 Lineata, Johannesburg',
      residenceType: 'permanent'
    },
    {
      firstName: 'Mila Kgadi Makgamatha',
      lastName: 'Mdeni',
      phoneNumbers: ['+27 87 333 4444'],
      emails: ['milamdeni@gmail.com'],
      addresses: ['22 Lineata, Johannesburg, South Africa'],
      category: 'family',
      tags: ['daughter-visa', 'young-learner', 'creative'],
      notes: 'Bright young family member (age 6). Born October 3, 2018. Daughter of Visa Mdeni. Younger sister to Solo. Developing curiosity and family bonds. Resides at 22 Lineata.',
      privacy: 'family',
      addedBy: userId,
      isFamilyMember: true,
      isHouseholdMember: true,
      sonnyRole: 'monitored',
      status: 'developing',
      dateOfBirth: '2018-10-03',
      residenceLocation: '22 Lineata, Johannesburg',
      residenceType: 'permanent'
    },
    {
      firstName: 'Milande Paton',
      lastName: 'Mdeni',
      phoneNumbers: ['+27 87 678 9012'],
      emails: ['milandep.mdeni@gmail.com'],
      addresses: ['Randburg, Johannesburg, South Africa'],
      category: 'family',
      tags: ['son-kwakho', 'young-leader', 'academic'],
      notes: 'Emerging leader (age 8). Born May 5, 2017. Son of Kwakho. Elder brother to Milani. Resides in Randburg with family.',
      privacy: 'family',
      addedBy: userId,
      isFamilyMember: true,
      isHouseholdMember: false,
      sonnyRole: 'monitored',
      status: 'developing',
      dateOfBirth: '2017-05-05',
      residenceLocation: 'Randburg, Johannesburg',
      residenceType: 'temporary'
    },
    {
      firstName: 'Milani',
      lastName: 'Mdeni',
      phoneNumbers: ['+27 87 777 8888'],
      emails: ['milani@mdeni.family'],
      addresses: ['Randburg, Johannesburg, South Africa'],
      category: 'family',
      tags: ['daughter-kwakho', 'infant', 'newest-member'],
      notes: 'Newest family blessing (age 1). Born December 25, 2024. Daughter of Kwakho. Younger sister to Milande. Pure potential and hope. Resides in Randburg with family.',
      privacy: 'family',
      addedBy: userId,
      isFamilyMember: true,
      isHouseholdMember: false,
      sonnyRole: 'monitored',
      status: 'developing',
      dateOfBirth: '2024-12-25',
      residenceLocation: 'Randburg, Johannesburg',
      residenceType: 'temporary'
    },

    // DECEASED ANCESTORS
    {
      firstName: 'Sisiwe',
      lastName: 'Mgedezi',
      phoneNumbers: [],
      emails: [],
      addresses: ['Eastern Cape, South Africa'],
      category: 'family',
      tags: ['grandmother-maternal', 'ancestor', 'legacy'],
      notes: 'Beloved maternal grandmother (1940-deceased). Passed away when Notemba was only 11 years old. Her legacy of strength, resilience, and Ubuntu values lives on. Wife of Ndleleni Mgedezi. Maiden clan: Xaba.',
      privacy: 'family',
      addedBy: userId,
      isFamilyMember: true,
      isHouseholdMember: false,
      sonnyRole: 'none',
      status: 'deceased',
      dateOfBirth: '1940-01-01',
      residenceLocation: 'Eastern Cape, South Africa'
    },
    {
      firstName: 'Ndleleni',
      lastName: 'Mgedezi',
      phoneNumbers: [],
      emails: [],
      addresses: ['Eastern Cape, South Africa'],
      category: 'family',
      tags: ['grandfather-maternal', 'ancestor', 'legacy'],
      notes: 'Respected maternal grandfather (1938-2006). A man of wisdom and community leadership who established the family foundation. Husband of Sisiwe Mgedezi. His memory continues to guide the family.',
      privacy: 'family',
      addedBy: userId,
      isFamilyMember: true,
      isHouseholdMember: false,
      sonnyRole: 'none',
      status: 'deceased',
      dateOfBirth: '1938-01-01',
      residenceLocation: 'Eastern Cape, South Africa'
    }
  ];
};

/**
 * Map of contact names to their Contact IDs
 * This will be populated after contacts are created in Firestore
 */
export interface ContactNameMap {
  [fullName: string]: string;
}

/**
 * Get all relationships that should be created
 * These are bidirectional relationships (creator handles both directions)
 */
export const getMigrationRelationships = (
  contactMap: ContactNameMap
): Array<{
  contactId: string;
  relatedContactId: string;
  type: ContactRelationship['type'];
  notes?: string;
}> => {
  const getContactId = (name: string) => contactMap[name];
  
  return [
    // MATRIARCH RELATIONSHIPS
    {
      contactId: getContactId('Nozukile Cynthia Mdeni'),
      relatedContactId: getContactId('Salatiso Mdeni'),
      type: 'parent',
      notes: 'Mother and son'
    },
    {
      contactId: getContactId('Nozukile Cynthia Mdeni'),
      relatedContactId: getContactId('Visa Mdeni'),
      type: 'parent',
      notes: 'Mother and daughter'
    },
    {
      contactId: getContactId('Nozukile Cynthia Mdeni'),
      relatedContactId: getContactId('Tina Mdeni'),
      type: 'parent',
      notes: 'Mother and daughter'
    },
    {
      contactId: getContactId('Nozukile Cynthia Mdeni'),
      relatedContactId: getContactId('Kwakho Mdeni'),
      type: 'parent',
      notes: 'Mother and daughter'
    },

    // SIBLING RELATIONSHIPS
    {
      contactId: getContactId('Salatiso Mdeni'),
      relatedContactId: getContactId('Visa Mdeni'),
      type: 'sibling',
      notes: 'Brother and sister'
    },
    {
      contactId: getContactId('Salatiso Mdeni'),
      relatedContactId: getContactId('Tina Mdeni'),
      type: 'sibling',
      notes: 'Brother and sister'
    },
    {
      contactId: getContactId('Salatiso Mdeni'),
      relatedContactId: getContactId('Kwakho Mdeni'),
      type: 'sibling',
      notes: 'Brother and sister'
    },
    {
      contactId: getContactId('Visa Mdeni'),
      relatedContactId: getContactId('Tina Mdeni'),
      type: 'sibling',
      notes: 'Sisters'
    },
    {
      contactId: getContactId('Visa Mdeni'),
      relatedContactId: getContactId('Kwakho Mdeni'),
      type: 'sibling',
      notes: 'Sister and sister'
    },
    {
      contactId: getContactId('Tina Mdeni'),
      relatedContactId: getContactId('Kwakho Mdeni'),
      type: 'sibling',
      notes: 'Sisters'
    },

    // PARENT-CHILD RELATIONSHIPS
    {
      contactId: getContactId('Visa Mdeni'),
      relatedContactId: getContactId('Solonwabo Milile Mdeni'),
      type: 'parent',
      notes: 'Mother and son'
    },
    {
      contactId: getContactId('Visa Mdeni'),
      relatedContactId: getContactId('Mila Kgadi Makgamatha Mdeni'),
      type: 'parent',
      notes: 'Mother and daughter'
    },
    {
      contactId: getContactId('Tina Mdeni'),
      relatedContactId: getContactId('Azora Mdeni'),
      type: 'parent',
      notes: 'Mother and daughter'
    },
    {
      contactId: getContactId('Salatiso Mdeni'),
      relatedContactId: getContactId('Sazi Mdeni'),
      type: 'parent',
      notes: 'Father and son'
    },
    {
      contactId: getContactId('Kwakho Mdeni'),
      relatedContactId: getContactId('Milande Paton Mdeni'),
      type: 'parent',
      notes: 'Mother and son'
    },
    {
      contactId: getContactId('Kwakho Mdeni'),
      relatedContactId: getContactId('Milani Mdeni'),
      type: 'parent',
      notes: 'Mother and daughter'
    },

    // SIBLING RELATIONSHIPS (CHILDREN)
    {
      contactId: getContactId('Solonwabo Milile Mdeni'),
      relatedContactId: getContactId('Mila Kgadi Makgamatha Mdeni'),
      type: 'sibling',
      notes: 'Brother and sister'
    },
    {
      contactId: getContactId('Milande Paton Mdeni'),
      relatedContactId: getContactId('Milani Mdeni'),
      type: 'sibling',
      notes: 'Brother and sister'
    },

    // ANCESTOR RELATIONSHIPS
    {
      contactId: getContactId('Nozukile Cynthia Mdeni'),
      relatedContactId: getContactId('Sisiwe Mgedezi'),
      type: 'parent',
      notes: 'Daughter and mother (maternal)'
    },
    {
      contactId: getContactId('Nozukile Cynthia Mdeni'),
      relatedContactId: getContactId('Ndleleni Mgedezi'),
      type: 'parent',
      notes: 'Daughter and father (maternal)'
    },
    {
      contactId: getContactId('Sisiwe Mgedezi'),
      relatedContactId: getContactId('Ndleleni Mgedezi'),
      type: 'spouse',
      notes: 'Wife and husband'
    }
  ];
};

/**
 * Parse relationships to ensure all contact IDs exist
 * Returns only relationships where both contacts exist
 */
export const validateRelationships = (
  relationships: Array<any>,
  contactMap: ContactNameMap
): Array<any> => {
  return relationships.filter(rel => {
    const hasFromContact = Object.values(contactMap).some(id => id === rel.contactId);
    const hasToContact = Object.values(contactMap).some(id => id === rel.relatedContactId);
    return hasFromContact && hasToContact;
  });
};

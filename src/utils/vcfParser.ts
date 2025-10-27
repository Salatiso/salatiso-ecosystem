/**
 * VCF (vCard) Parser Utility
 * Parses vCard format (.vcf) files into Contact objects
 */

import { Contact } from '@/services/ContactsService';

export interface ParsedContact extends Partial<Contact> {
  firstName: string;
  lastName?: string;
  emails?: string[];
  phoneNumbers?: string[];
  addresses?: string[];
  organization?: string;
  position?: string;
  bio?: string;
  tags?: string[];
  category?: Contact['category'];
  website?: string;
}

/**
 * Parse VCF content and extract all contacts
 */
export const parseVCFContent = (vcfContent: string): {
  contacts: ParsedContact[];
  errors: string[];
} => {
  const contacts: ParsedContact[] = [];
  const errors: string[] = [];

  // Split by BEGIN:VCARD and END:VCARD
  const vcardPattern = /BEGIN:VCARD[\s\S]*?END:VCARD/g;
  const vcards = vcfContent.match(vcardPattern) || [];

  if (vcards.length === 0) {
    errors.push('No vCard entries found in file');
    return { contacts, errors };
  }

  vcards.forEach((vcard, index) => {
    try {
      const contact = parseVCard(vcard);
      if (contact && contact.firstName) {
        contacts.push(contact);
      } else if (!contact?.firstName) {
        errors.push(`vCard ${index + 1}: No name found`);
      }
    } catch (error) {
      errors.push(`vCard ${index + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });

  return { contacts, errors };
};

/**
 * Parse a single vCard block
 */
const parseVCard = (vcardText: string): ParsedContact | null => {
  const lines = vcardText.split(/\r\n|\r|\n/);
  const contact: ParsedContact = {
    firstName: '',
    lastName: '',
    emails: [],
    phoneNumbers: [],
    addresses: [],
    organization: '',
    position: '',
    bio: '',
    website: '',
    tags: [],
    category: 'friend'
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (!line || line.startsWith('BEGIN:') || line.startsWith('END:')) {
      continue;
    }

    // Handle line folding (lines starting with space/tab continue previous line)
    let fullLine = line;
    while (i + 1 < lines.length && (lines[i + 1].startsWith(' ') || lines[i + 1].startsWith('\t'))) {
      i++;
      fullLine += lines[i].trim();
    }

    const colonIndex = fullLine.indexOf(':');
    if (colonIndex === -1) continue;

    const property = fullLine.substring(0, colonIndex).split(';')[0].toUpperCase();
    const value = fullLine.substring(colonIndex + 1).trim();

    if (!value) continue;

    switch (property) {
      case 'FN':
        // Formatted name
        const nameParts = value.split(/\s+/);
        contact.firstName = nameParts[0] || '';
        if (nameParts.length > 1) {
          contact.lastName = nameParts.slice(1).join(' ');
        }
        break;

      case 'N':
        // Structured name: lastName;firstName;middleName;prefix;suffix
        const structuredName = value.split(';');
        contact.lastName = structuredName[0]?.trim() || contact.lastName || '';
        contact.firstName = structuredName[1]?.trim() || contact.firstName || '';
        break;

      case 'EMAIL':
        // Email address
        if (value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          if (!contact.emails!.includes(value)) {
            contact.emails!.push(value);
          }
        }
        break;

      case 'TEL':
        // Phone number - extract from value which may include type
        const phoneValue = extractPhoneNumber(value, fullLine);
        if (phoneValue && !contact.phoneNumbers!.includes(phoneValue)) {
          contact.phoneNumbers!.push(phoneValue);
        }
        break;

      case 'ORG':
        // Organization
        contact.organization = value.split(';')[0].trim();
        break;

      case 'TITLE':
        // Job title / position
        contact.position = value;
        break;

      case 'URL':
        // Website
        if (!contact.website) {
          contact.website = value;
        }
        break;

      case 'ADR':
        // Address: poBox;extended;street;city;state;zip;country
        const addressParts = value.split(';');
        const address = [
          addressParts[2],
          addressParts[3],
          addressParts[4],
          addressParts[5]
        ]
          .filter(Boolean)
          .join(', ');

        if (address && !contact.addresses!.includes(address)) {
          contact.addresses!.push(address);
        }
        break;

      case 'NOTE':
        // Notes / bio
        if (!contact.bio) {
          contact.bio = value;
        }
        break;

      case 'CATEGORIES':
        // Tags/categories
        const newTags = value.split(',').map(t => t.trim()).filter(Boolean);
        contact.tags = [...new Set([...contact.tags!, ...newTags])];
        break;

      case 'PHOTO':
      case 'LOGO':
      case 'VERSION':
      case 'PRODID':
      case 'REV':
      case 'UID':
        // Skip these properties
        break;

      default:
        // Ignore unknown properties
        break;
    }
  }

  // Validate that we have at least a name
  if (!contact.firstName) {
    return null;
  }

  // Clean up the contact object
  contact.emails = contact.emails?.filter(Boolean) || [];
  contact.phoneNumbers = contact.phoneNumbers?.filter(Boolean) || [];
  contact.addresses = contact.addresses?.filter(Boolean) || [];
  contact.tags = contact.tags?.filter(Boolean) || [];

  // Convert arrays to single values if only one item
  const result: ParsedContact = {
    firstName: contact.firstName,
    lastName: contact.lastName || undefined,
    organization: contact.organization || undefined,
    position: contact.position || undefined,
    bio: contact.bio || undefined,
    website: contact.website || undefined,
    tags: contact.tags && contact.tags.length > 0 ? contact.tags : undefined,
    category: contact.category
  };

  // Add emails/phones as main fields if they exist
  if (contact.emails && contact.emails.length > 0) {
    (result as any).email = contact.emails[0];
  }

  if (contact.phoneNumbers && contact.phoneNumbers.length > 0) {
    (result as any).phone = contact.phoneNumbers[0];
  }

  if (contact.addresses && contact.addresses.length > 0) {
    (result as any).location = contact.addresses[0];
  }

  return result;
};

/**
 * Extract phone number, cleaning up type information
 */
const extractPhoneNumber = (value: string, fullLine: string): string => {
  // Remove common type prefixes and cleaning
  let cleanValue = value;

  // Remove tel: prefix if present
  if (cleanValue.toLowerCase().startsWith('tel:')) {
    cleanValue = cleanValue.substring(4);
  }

  // Clean up phone number - remove spaces, dashes, parentheses for validation
  const phoneDigits = cleanValue.replace(/[\s\-()]/g, '');

  // Basic phone validation - should be 7-15 digits
  if (phoneDigits.length >= 7) {
    // Return original with basic cleaning
    return cleanValue.trim();
  }

  return '';
};

/**
 * Convert ParsedContact to Contact format
 */
export const parsedContactToContact = (parsed: ParsedContact): Partial<Contact> => {
  const emails: string[] = [];
  const phoneNumbers: string[] = [];
  const addresses: string[] = [];
  
  if ((parsed as any).email) {
    emails.push((parsed as any).email);
  }
  
  if ((parsed as any).phone) {
    phoneNumbers.push((parsed as any).phone);
  }
  
  if ((parsed as any).location) {
    addresses.push((parsed as any).location);
  }

  return {
    firstName: parsed.firstName,
    lastName: parsed.lastName,
    emails,
    phoneNumbers,
    addresses,
    organizationName: parsed.organization,
    organizationTitle: parsed.position,
    notes: parsed.bio || '',
    websites: parsed.website ? [{ label: 'profile', value: parsed.website }] : [],
    tags: parsed.tags || [],
    category: parsed.category || 'friend'
  };
};

/**
 * Generate VCF content from Contact
 */
export const generateVCF = (contact: Partial<Contact>): string => {
  const now = new Date().toISOString().replace(/[:\-]/g, '').split('.')[0];
  const uid = `${contact.id || 'contact'}-${now}`;

  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `UID:${uid}`,
    `FN:${contact.firstName}${contact.lastName ? ` ${contact.lastName}` : ''}`,
    `N:${contact.lastName || ''};${contact.firstName || ''};;;`
  ];

  // Handle emails
  if (contact.emails && contact.emails.length > 0) {
    contact.emails.forEach(email => {
      lines.push(`EMAIL:${email}`);
    });
  }

  // Handle phone numbers
  if (contact.phoneNumbers && contact.phoneNumbers.length > 0) {
    contact.phoneNumbers.forEach(phone => {
      lines.push(`TEL:${phone}`);
    });
  }

  // Handle organization
  if (contact.organizationName) {
    lines.push(`ORG:${contact.organizationName}`);
  }

  // Handle position/title
  if (contact.organizationTitle) {
    lines.push(`TITLE:${contact.organizationTitle}`);
  }

  // Handle websites
  if (contact.websites && contact.websites.length > 0) {
    contact.websites.forEach(site => {
      lines.push(`URL:${site.value}`);
    });
  }

  // Handle addresses
  if (contact.addresses && contact.addresses.length > 0) {
    contact.addresses.forEach(addr => {
      lines.push(`ADR:;;${addr};;;;`);
    });
  }

  // Handle notes/bio
  if (contact.notes) {
    lines.push(`NOTE:${contact.notes}`);
  }

  // Handle tags
  if (contact.tags && contact.tags.length > 0) {
    lines.push(`CATEGORIES:${contact.tags.join(',')}`);
  }

  lines.push('REV:' + now);
  lines.push('END:VCARD');

  return lines.join('\r\n');
};

/**
 * Validate VCF file
 */
export const validateVCFFile = (content: string): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!content || content.trim().length === 0) {
    errors.push('File is empty');
    return { valid: false, errors };
  }

  const hasBegin = content.includes('BEGIN:VCARD');
  const hasEnd = content.includes('END:VCARD');

  if (!hasBegin || !hasEnd) {
    errors.push('Invalid VCF format: missing BEGIN:VCARD or END:VCARD');
    return { valid: false, errors };
  }

  // Count matching BEGIN and END
  const beginCount = (content.match(/BEGIN:VCARD/g) || []).length;
  const endCount = (content.match(/END:VCARD/g) || []).length;

  if (beginCount !== endCount) {
    errors.push(`VCF format error: ${beginCount} BEGIN:VCARD but ${endCount} END:VCARD`);
    return { valid: false, errors };
  }

  return { valid: true, errors };
};

export default {
  parseVCFContent,
  parsedContactToContact,
  generateVCF,
  validateVCFFile
};

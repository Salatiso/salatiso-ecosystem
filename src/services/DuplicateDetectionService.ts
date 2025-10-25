import { Contact } from '@/services/ContactsService';

export interface DuplicateMatch {
  existingContactId: string;
  existingContact: Contact;
  newContactId?: string;
  newContact: Contact;
  confidence: number; // 0-100
  matchReasons: string[];
  conflictingFields: {
    field: string;
    existingValue: any;
    newValue: any;
  }[];
}

export class DuplicateDetectionService {
  /**
   * Normalize email for comparison
   */
  private normalizeEmail(email: string): string {
    return email.toLowerCase().trim();
  }

  /**
   * Normalize phone number (remove all non-digits)
   */
  private normalizePhone(phone: string): string {
    return phone.replace(/\D/g, '');
  }

  /**
   * Check if emails match
   */
  private emailsMatch(emails1: string[], emails2: string[]): boolean {
    const normalized1 = emails1.map(e => this.normalizeEmail(e));
    const normalized2 = emails2.map(e => this.normalizeEmail(e));

    return normalized1.some(e1 => normalized2.includes(e1));
  }

  /**
   * Check if phone numbers match
   */
  private phonesMatch(phones1: string[], phones2: string[]): boolean {
    const normalized1 = phones1.map(p => this.normalizePhone(p));
    const normalized2 = phones2.map(p => this.normalizePhone(p));

    return normalized1.some(p1 => p1 && normalized2.includes(p1));
  }

  /**
   * Calculate string similarity (Levenshtein distance)
   */
  private calculateDistance(str1: string, str2: string): number {
    const track = Array(str2.length + 1).fill(null).map(() =>
      Array(str1.length + 1).fill(null));

    for (let i = 0; i <= str1.length; i += 1) {
      track[0][i] = i;
    }
    for (let j = 0; j <= str2.length; j += 1) {
      track[j][0] = j;
    }

    for (let j = 1; j <= str2.length; j += 1) {
      for (let i = 1; i <= str1.length; i += 1) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        track[j][i] = Math.min(
          track[j][i - 1] + 1,
          track[j - 1][i] + 1,
          track[j - 1][i - 1] + indicator
        );
      }
    }

    return track[str2.length][str1.length];
  }

  /**
   * Calculate name similarity
   */
  private calculateNameSimilarity(name1: string, name2: string): number {
    const distance = this.calculateDistance(name1.toLowerCase(), name2.toLowerCase());
    const maxLength = Math.max(name1.length, name2.length);
    return Math.round((1 - distance / maxLength) * 100);
  }

  /**
   * Extract city from address
   */
  private extractCity(address: string): string {
    const parts = address.split(',');
    return parts[parts.length - 1].trim().toLowerCase();
  }

  /**
   * Check if addresses are similar
   */
  private addressesMatch(addresses1: string[], addresses2: string[]): boolean {
    if (addresses1.length === 0 || addresses2.length === 0) return false;

    const cities1 = addresses1.map(a => this.extractCity(a));
    const cities2 = addresses2.map(a => this.extractCity(a));

    return cities1.some(c1 => cities2.some(c2 => c1 === c2));
  }

  /**
   * Detect potential duplicates between two contacts
   */
  public detectDuplicate(existingContact: Contact, newContact: Contact): DuplicateMatch | null {
    const matchReasons: string[] = [];
    const conflictingFields: DuplicateMatch['conflictingFields'] = [];
    let confidence = 0;

    // Check email match (strong indicator - 40 points)
    if (this.emailsMatch(existingContact.emails, newContact.emails)) {
      matchReasons.push('Email match');
      confidence += 40;
    }

    // Check phone match (strong indicator - 35 points)
    if (this.phonesMatch(existingContact.phoneNumbers, newContact.phoneNumbers)) {
      matchReasons.push('Phone number match');
      confidence += 35;
    }

    // Check name similarity (weak-medium indicator - 25 points)
    const firstNameSimilarity = this.calculateNameSimilarity(existingContact.firstName, newContact.firstName);
    const lastNameSimilarity = this.calculateNameSimilarity(existingContact.lastName, newContact.lastName);

    if (firstNameSimilarity >= 85 && lastNameSimilarity >= 85) {
      matchReasons.push(`Name match (${Math.round((firstNameSimilarity + lastNameSimilarity) / 2)}% similar)`);
      confidence += 25;
    } else if (lastNameSimilarity >= 90) {
      // Strong last name match
      matchReasons.push(`Last name match (${lastNameSimilarity}% similar)`);
      confidence += 15;
    }

    // Check address match (medium indicator - 20 points)
    if (this.addressesMatch(existingContact.addresses, newContact.addresses)) {
      matchReasons.push('Same city/region');
      confidence += 20;
    }

    // If no matches found, return null
    if (matchReasons.length === 0) {
      return null;
    }

    // Detect conflicting information
    if (existingContact.phoneNumbers.length > 0 && 
        newContact.phoneNumbers.length > 0 && 
        !this.phonesMatch(existingContact.phoneNumbers, newContact.phoneNumbers)) {
      conflictingFields.push({
        field: 'phoneNumbers',
        existingValue: existingContact.phoneNumbers.join(', '),
        newValue: newContact.phoneNumbers.join(', ')
      });
    }

    if (existingContact.addresses.length > 0 && 
        newContact.addresses.length > 0 && 
        existingContact.addresses[0] !== newContact.addresses[0]) {
      conflictingFields.push({
        field: 'addresses',
        existingValue: existingContact.addresses.join(', '),
        newValue: newContact.addresses.join(', ')
      });
    }

    // Ensure confidence is capped at 100
    confidence = Math.min(100, confidence);

    // Only return match if confidence is at least 50%
    if (confidence >= 50) {
      return {
        existingContactId: existingContact.id,
        existingContact,
        newContact,
        confidence,
        matchReasons,
        conflictingFields
      };
    }

    return null;
  }

  /**
   * Find all potential duplicates for a new contact
   */
  public findDuplicates(newContact: Contact, existingContacts: Contact[]): DuplicateMatch[] {
    const duplicates: DuplicateMatch[] = [];

    for (const existingContact of existingContacts) {
      const match = this.detectDuplicate(existingContact, newContact);
      if (match) {
        duplicates.push(match);
      }
    }

    // Sort by confidence (descending)
    return duplicates.sort((a, b) => b.confidence - a.confidence);
  }

  /**
   * Find all potential duplicates across all contacts
   */
  public findAllDuplicates(allContacts: Contact[]): DuplicateMatch[] {
    const duplicates: DuplicateMatch[] = [];
    const seenPairs = new Set<string>();

    for (let i = 0; i < allContacts.length; i++) {
      for (let j = i + 1; j < allContacts.length; j++) {
        const pairKey = `${allContacts[i].id}-${allContacts[j].id}`;
        if (seenPairs.has(pairKey)) continue;

        const match = this.detectDuplicate(allContacts[i], allContacts[j]);
        if (match) {
          duplicates.push(match);
          seenPairs.add(pairKey);
        }
      }
    }

    return duplicates.sort((a, b) => b.confidence - a.confidence);
  }

  /**
   * Merge two contacts, keeping specified fields from new contact
   */
  public mergeContacts(existingContact: Contact, newContact: Contact, fieldsToUpdate: string[]): Partial<Contact> {
    const merged: Partial<Contact> = { ...existingContact };

    for (const field of fieldsToUpdate) {
      if (field === 'emails') {
        // Merge emails (deduplicate)
        const allEmails = new Set([...existingContact.emails, ...newContact.emails]);
        merged.emails = Array.from(allEmails);
      } else if (field === 'phoneNumbers') {
        // Merge phone numbers (deduplicate)
        const allPhones = new Set([...existingContact.phoneNumbers, ...newContact.phoneNumbers]);
        merged.phoneNumbers = Array.from(allPhones);
      } else if (field === 'addresses') {
        // Merge addresses (deduplicate)
        const allAddresses = new Set([...existingContact.addresses, ...newContact.addresses]);
        merged.addresses = Array.from(allAddresses);
      } else if (field === 'tags') {
        // Merge tags (deduplicate)
        const allTags = new Set([...existingContact.tags, ...newContact.tags]);
        merged.tags = Array.from(allTags);
      } else if ((newContact as any)[field] !== undefined) {
        // Update other fields from new contact
        (merged as any)[field] = (newContact as any)[field];
      }
    }

    merged.updatedAt = new Date();
    return merged;
  }
}

export const duplicateDetectionService = new DuplicateDetectionService();

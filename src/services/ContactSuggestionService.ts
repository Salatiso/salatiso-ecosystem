import { Contact } from '@/services/ContactsService';

export interface ContactSuggestion {
  contactId: string;
  suggestedContactId: string;
  suggestedContact: Contact;
  reason: string;
  confidence: number; // 0-100
  matchType: 'surname' | 'address' | 'mutual_friend' | 'same_organization';
}

export class ContactSuggestionService {
  /**
   * Calculate Levenshtein distance between two strings (for fuzzy matching)
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
   * Calculate string similarity (0-100)
   */
  private calculateSimilarity(str1: string, str2: string): number {
    const distance = this.calculateDistance(str1.toLowerCase(), str2.toLowerCase());
    const maxLength = Math.max(str1.length, str2.length);
    return Math.round((1 - distance / maxLength) * 100);
  }

  /**
   * Extract surname from a full address
   */
  private extractCity(address: string): string {
    // Simple extraction - get the last part after comma
    const parts = address.split(',');
    return parts[parts.length - 1].trim().toLowerCase();
  }

  /**
   * Find contacts with matching surnames
   */
  private findSurnameSuggestions(contact: Contact, allContacts: Contact[]): ContactSuggestion[] {
    const suggestions: ContactSuggestion[] = [];
    const contactLastName = contact.lastName.toLowerCase();

    for (const otherContact of allContacts) {
      if (otherContact.id === contact.id) continue;

      const similarity = this.calculateSimilarity(contactLastName, otherContact.lastName);
      
      // If similarity is 85% or higher, suggest them
      if (similarity >= 85) {
        suggestions.push({
          contactId: contact.id,
          suggestedContactId: otherContact.id,
          suggestedContact: otherContact,
          reason: `Matching surname: "${contact.lastName}" vs "${otherContact.lastName}"`,
          confidence: similarity,
          matchType: 'surname'
        });
      }
    }

    return suggestions;
  }

  /**
   * Find contacts with addresses in the same city/region
   */
  private findAddressSuggestions(contact: Contact, allContacts: Contact[]): ContactSuggestion[] {
    const suggestions: ContactSuggestion[] = [];

    // Extract city from contact's addresses
    const contactCities = contact.addresses
      .map(addr => this.extractCity(addr))
      .filter(city => city.length > 2);

    if (contactCities.length === 0) return suggestions;

    for (const otherContact of allContacts) {
      if (otherContact.id === contact.id) continue;

      const otherCities = otherContact.addresses
        .map(addr => this.extractCity(addr))
        .filter(city => city.length > 2);

      // Check for matching cities
      for (const contactCity of contactCities) {
        for (const otherCity of otherCities) {
          const similarity = this.calculateSimilarity(contactCity, otherCity);
          if (similarity >= 85) {
            suggestions.push({
              contactId: contact.id,
              suggestedContactId: otherContact.id,
              suggestedContact: otherContact,
              reason: `Same location: Both in "${contactCity}"`,
              confidence: Math.min(95, similarity + 10), // Slightly boost location matches
              matchType: 'address'
            });
            break; // Only suggest once per contact pair
          }
        }
        if (suggestions.length > 0) break;
      }
    }

    return suggestions;
  }

  /**
   * Find contacts that share tags (mutual interests/relationships)
   */
  private findMutualConnectionSuggestions(contact: Contact, allContacts: Contact[]): ContactSuggestion[] {
    const suggestions: ContactSuggestion[] = [];

    for (const otherContact of allContacts) {
      if (otherContact.id === contact.id) continue;

      // Find common tags
      const commonTags = contact.tags.filter(tag => otherContact.tags.includes(tag));

      if (commonTags.length > 0) {
        const confidence = Math.min(90, commonTags.length * 30);
        suggestions.push({
          contactId: contact.id,
          suggestedContactId: otherContact.id,
          suggestedContact: otherContact,
          reason: `Shared interests: ${commonTags.join(', ')}`,
          confidence,
          matchType: 'mutual_friend'
        });
      }
    }

    return suggestions;
  }

  /**
   * Find contacts by category matching (e.g., both business contacts)
   */
  private findCategorySuggestions(contact: Contact, allContacts: Contact[]): ContactSuggestion[] {
    const suggestions: ContactSuggestion[] = [];

    // Only suggest if contact is business/professional
    if (!['business', 'professional'].includes(contact.category)) {
      return suggestions;
    }

    for (const otherContact of allContacts) {
      if (otherContact.id === contact.id) continue;
      if (otherContact.category !== contact.category) continue;

      suggestions.push({
        contactId: contact.id,
        suggestedContactId: otherContact.id,
        suggestedContact: otherContact,
        reason: `Both ${contact.category} contacts`,
        confidence: 65,
        matchType: 'same_organization'
      });
    }

    return suggestions;
  }

  /**
   * Get all suggestions for a contact
   */
  public async getSuggestions(contact: Contact, allContacts: Contact[]): Promise<ContactSuggestion[]> {
    const suggestions: ContactSuggestion[] = [];

    // Collect all suggestions from different sources
    suggestions.push(...this.findSurnameSuggestions(contact, allContacts));
    suggestions.push(...this.findAddressSuggestions(contact, allContacts));
    suggestions.push(...this.findMutualConnectionSuggestions(contact, allContacts));
    suggestions.push(...this.findCategorySuggestions(contact, allContacts));

    // Remove duplicates and keep the highest confidence for each pair
    const suggestionMap = new Map<string, ContactSuggestion>();
    for (const suggestion of suggestions) {
      const key = `${suggestion.contactId}-${suggestion.suggestedContactId}`;
      const existing = suggestionMap.get(key);
      if (!existing || suggestion.confidence > existing.confidence) {
        suggestionMap.set(key, suggestion);
      }
    }

    // Convert to array and sort by confidence
    return Array.from(suggestionMap.values())
      .sort((a, b) => b.confidence - a.confidence);
  }

  /**
   * Get top N suggestions for a contact
   */
  public async getTopSuggestions(contact: Contact, allContacts: Contact[], limit: number = 5): Promise<ContactSuggestion[]> {
    const suggestions = await this.getSuggestions(contact, allContacts);
    return suggestions.slice(0, limit);
  }
}

export const contactSuggestionService = new ContactSuggestionService();

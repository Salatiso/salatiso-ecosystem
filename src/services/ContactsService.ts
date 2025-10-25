import { 
  collection, 
  doc, 
  getDocs, 
  getDoc,
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  Timestamp,
  writeBatch
} from 'firebase/firestore';
import { db } from '@/config/firebase';

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  phoneNumbers: string[];
  emails: string[];
  addresses: string[];
  category: 'family' | 'friend' | 'business' | 'professional' | 'service';
  tags: string[];
  notes: string;
  privacy: 'public' | 'family' | 'private';
  addedBy: string;
  createdAt: Date;
  updatedAt: Date;
  
  // Extended Google Contacts Fields
  nickname?: string;
  namePrefix?: string; // Mr., Dr., etc.
  nameSuffix?: string; // Jr., Sr., etc.
  phoneticFirstName?: string;
  phoneticMiddleName?: string;
  phoneticLastName?: string;
  
  // Organization/Work
  organizationName?: string;
  organizationTitle?: string;
  organizationDepartment?: string;
  
  // Dates and Events
  birthday?: string; // ISO format: YYYY-MM-DD
  anniversaryDate?: string;
  customDates?: Array<{
    label: string;
    value: string;
  }>;
  
  // Relationships
  relationships?: Array<{
    label: string; // e.g., "Spouse", "Child", "Parent"
    value: string; // Name of the person
  }>;
  
  // Websites
  websites?: Array<{
    label: string; // e.g., "Profile", "Work", "Blog"
    value: string; // URL
  }>;
  
  // Custom Fields
  customFields?: Array<{
    label: string;
    value: string;
  }>;
  
  // Photo URLs (up to 5 images)
  photoUrls?: string[]; // Array of Firebase Storage URLs
  
  // Additional Fields
  fileAs?: string; // How contact should be filed
  
  // Sonny Network Integration Fields
  isHouseholdMember?: boolean;
  isFamilyMember?: boolean;
  sonnyRole?: 'monitor' | 'monitored' | 'both' | 'none';
  familyTreeId?: string;
  
  // Status and tracking fields
  sonnyStatus?: 'online' | 'offline' | 'invisible';
  lastSeen?: Date;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  
  // Email invitation tracking
  invitationSent?: boolean;
  invitationSentDate?: Date;
  invitationAccepted?: boolean;
  
  // Relationship & Life Status
  status?: 'active' | 'developing' | 'deceased' | 'unknown';
  dateOfBirth?: string; // ISO format: YYYY-MM-DD
  residenceLocation?: string;
  residenceType?: 'permanent' | 'temporary' | 'visiting';
}

/**
 * Contact Relationship - Defines relationship between two contacts
 * Bidirectional relationships are automatically maintained
 */
export interface ContactRelationship {
  id: string;
  contactId: string; // The contact being related from
  relatedContactId: string; // The contact being related to
  type: 
    | 'parent' 
    | 'child' 
    | 'sibling' 
    | 'spouse' 
    | 'grandchild' 
    | 'grandparent'
    | 'friend' 
    | 'colleague' 
    | 'business_partner'
    | 'mentor'
    | 'mentee'
    | 'other';
  isBidirectional: boolean; // If true, inverse relationship is auto-created
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

class ContactsService {
  private collectionName = 'contacts';
  private relationshipsCollectionName = 'contact_relationships';

  /**
   * Get all contacts for a user
   */
  async getUserContacts(userId: string): Promise<Contact[]> {
    try {
      const contactsRef = collection(db, this.collectionName);
      const q = query(
        contactsRef,
        where('addedBy', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        lastSeen: doc.data().lastSeen?.toDate()
      } as Contact));
    } catch (error) {
      console.error('Error getting user contacts:', error);
      throw error;
    }
  }

  /**
   * Get a single contact by ID
   */
  async getContact(contactId: string): Promise<Contact | null> {
    try {
      const contactRef = doc(db, this.collectionName, contactId);
      const contactDoc = await getDoc(contactRef);
      
      if (!contactDoc.exists()) {
        return null;
      }

      return {
        id: contactDoc.id,
        ...contactDoc.data(),
        createdAt: contactDoc.data().createdAt?.toDate() || new Date(),
        updatedAt: contactDoc.data().updatedAt?.toDate() || new Date(),
        lastSeen: contactDoc.data().lastSeen?.toDate()
      } as Contact;
    } catch (error) {
      console.error('Error getting contact:', error);
      throw error;
    }
  }

  /**
   * Add a new contact
   */
  async addContact(contactData: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const contactsRef = collection(db, this.collectionName);
      const docRef = await addDoc(contactsRef, {
        ...contactData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      
      return docRef.id;
    } catch (error) {
      console.error('Error adding contact:', error);
      throw error;
    }
  }

  /**
   * Batch add multiple contacts (useful for imports)
   */
  async addContactsBatch(contacts: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<string[]> {
    try {
      const batch = writeBatch(db);
      const contactIds: string[] = [];
      
      contacts.forEach(contactData => {
        const contactRef = doc(collection(db, this.collectionName));
        contactIds.push(contactRef.id);
        batch.set(contactRef, {
          ...contactData,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now()
        });
      });
      
      await batch.commit();
      return contactIds;
    } catch (error) {
      console.error('Error batch adding contacts:', error);
      throw error;
    }
  }

  /**
   * Update a contact
   */
  async updateContact(contactId: string, updates: Partial<Contact>): Promise<void> {
    try {
      const contactRef = doc(db, this.collectionName, contactId);
      
      // Sanitize the updates - remove id and createdAt (shouldn't be updated)
      // and convert any Date objects to Timestamps
      const sanitizedUpdates: Record<string, any> = {};
      
      Object.entries(updates).forEach(([key, value]) => {
        // Skip fields that shouldn't be updated
        if (key === 'id' || key === 'createdAt' || key === 'addedBy') {
          return;
        }
        
        // Skip undefined values (Firestore doesn't support them)
        if (value === undefined) {
          return;
        }
        
        // Convert Date objects to Timestamps
        if (value instanceof Date) {
          sanitizedUpdates[key] = Timestamp.fromDate(value);
        } else {
          sanitizedUpdates[key] = value;
        }
      });
      
      // Always update the updatedAt timestamp
      sanitizedUpdates.updatedAt = Timestamp.now();
      
      console.log(`[ContactsService] Updating contact ${contactId}`, sanitizedUpdates);
      await updateDoc(contactRef, sanitizedUpdates);
      console.log(`[ContactsService] Successfully updated contact ${contactId}`);
    } catch (error: any) {
      console.error(`[ContactsService] Error updating contact ${contactId}:`, error);
      console.error('[ContactsService] Error code:', error.code);
      console.error('[ContactsService] Error message:', error.message);
      throw error;
    }
  }

  /**
   * Delete a contact
   */
  async deleteContact(contactId: string): Promise<void> {
    try {
      const contactRef = doc(db, this.collectionName, contactId);
      console.log(`[ContactsService] Deleting contact ${contactId}`);
      await deleteDoc(contactRef);
      console.log(`[ContactsService] Successfully deleted contact ${contactId}`);
    } catch (error: any) {
      console.error(`[ContactsService] Error deleting contact ${contactId}:`, error);
      console.error('[ContactsService] Error code:', error.code);
      console.error('[ContactsService] Error message:', error.message);
      throw error;
    }
  }

  /**
   * Update Sonny Network status
   */
  async updateSonnyStatus(contactId: string, status: 'online' | 'offline' | 'invisible'): Promise<void> {
    try {
      const contactRef = doc(db, this.collectionName, contactId);
      await updateDoc(contactRef, {
        sonnyStatus: status,
        lastSeen: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating Sonny status:', error);
      throw error;
    }
  }

  /**
   * Get contacts by Sonny Network status
   */
  async getContactsByStatus(userId: string, status: 'online' | 'offline' | 'invisible'): Promise<Contact[]> {
    try {
      const contactsRef = collection(db, this.collectionName);
      const q = query(
        contactsRef,
        where('addedBy', '==', userId),
        where('sonnyStatus', '==', status)
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        lastSeen: doc.data().lastSeen?.toDate()
      } as Contact));
    } catch (error) {
      console.error('Error getting contacts by status:', error);
      throw error;
    }
  }

  /**
   * Mark invitation as sent for a contact
   */
  async markInvitationSent(contactId: string): Promise<void> {
    try {
      const contactRef = doc(db, this.collectionName, contactId);
      await updateDoc(contactRef, {
        invitationSent: true,
        invitationSentDate: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error marking invitation as sent:', error);
      throw error;
    }
  }

  /**
   * Mark invitation as accepted for a contact
   */
  async markInvitationAccepted(contactId: string): Promise<void> {
    try {
      const contactRef = doc(db, this.collectionName, contactId);
      await updateDoc(contactRef, {
        invitationAccepted: true,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error marking invitation as accepted:', error);
      throw error;
    }
  }

  // ===== RELATIONSHIP MANAGEMENT =====

  /**
   * Add a bidirectional relationship between two contacts
   * Automatically creates the inverse relationship if isBidirectional is true
   */
  async addRelationship(
    contactId: string,
    relatedContactId: string,
    type: ContactRelationship['type'],
    isBidirectional: boolean = true,
    notes?: string
  ): Promise<string> {
    try {
      const batch = writeBatch(db);
      
      // Create forward relationship
      const relationshipRef = doc(collection(db, this.relationshipsCollectionName));
      const relationshipId = relationshipRef.id;
      
      batch.set(relationshipRef, {
        contactId,
        relatedContactId,
        type,
        isBidirectional,
        notes: notes || '',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });

      // Create inverse relationship if bidirectional
      if (isBidirectional) {
        const inverseType = this.getInverseRelationshipType(type);
        const inverseRelationshipRef = doc(collection(db, this.relationshipsCollectionName));
        
        batch.set(inverseRelationshipRef, {
          contactId: relatedContactId,
          relatedContactId: contactId,
          type: inverseType,
          isBidirectional: true,
          notes: notes ? `(Inverse) ${notes}` : '',
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now()
        });
      }

      await batch.commit();
      return relationshipId;
    } catch (error) {
      console.error('Error adding relationship:', error);
      throw error;
    }
  }

  /**
   * Get inverse relationship type for bidirectional relationships
   */
  private getInverseRelationshipType(type: ContactRelationship['type']): ContactRelationship['type'] {
    const inverseMap: Record<string, ContactRelationship['type']> = {
      'parent': 'child',
      'child': 'parent',
      'sibling': 'sibling',
      'spouse': 'spouse',
      'grandchild': 'grandparent',
      'grandparent': 'grandchild',
      'mentor': 'mentee',
      'mentee': 'mentor',
      'colleague': 'colleague',
      'business_partner': 'business_partner',
      'friend': 'friend',
      'other': 'other'
    };
    return inverseMap[type] || 'other';
  }

  /**
   * Get all relationships for a contact
   */
  async getContactRelationships(contactId: string): Promise<ContactRelationship[]> {
    try {
      const relationshipsRef = collection(db, this.relationshipsCollectionName);
      const q = query(
        relationshipsRef,
        where('contactId', '==', contactId)
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      } as ContactRelationship));
    } catch (error) {
      console.error('Error getting contact relationships:', error);
      throw error;
    }
  }

  /**
   * Get related contacts (full contact objects with relationship info)
   */
  async getRelatedContacts(contactId: string): Promise<Array<{ contact: Contact; relationship: ContactRelationship }>> {
    try {
      const relationships = await this.getContactRelationships(contactId);
      const relatedContacts: Array<{ contact: Contact; relationship: ContactRelationship }> = [];

      for (const relationship of relationships) {
        const contact = await this.getContact(relationship.relatedContactId);
        if (contact) {
          relatedContacts.push({ contact, relationship });
        }
      }

      return relatedContacts;
    } catch (error) {
      console.error('Error getting related contacts:', error);
      throw error;
    }
  }

  /**
   * Get relationships of a specific type
   */
  async getRelationshipsByType(
    contactId: string,
    type: ContactRelationship['type']
  ): Promise<Array<{ contact: Contact; relationship: ContactRelationship }>> {
    try {
      const allRelated = await this.getRelatedContacts(contactId);
      return allRelated.filter(item => item.relationship.type === type);
    } catch (error) {
      console.error(`Error getting ${type} relationships:`, error);
      throw error;
    }
  }

  /**
   * Update a relationship
   */
  async updateRelationship(
    relationshipId: string,
    updates: Partial<ContactRelationship>
  ): Promise<void> {
    try {
      const relationshipRef = doc(db, this.relationshipsCollectionName, relationshipId);
      await updateDoc(relationshipRef, {
        ...updates,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating relationship:', error);
      throw error;
    }
  }

  /**
   * Remove a relationship (and its inverse if bidirectional)
   */
  async removeRelationship(relationshipId: string): Promise<void> {
    try {
      const relationshipRef = doc(db, this.relationshipsCollectionName, relationshipId);
      const relationshipDoc = await getDoc(relationshipRef);
      
      if (!relationshipDoc.exists()) {
        return;
      }

      const batch = writeBatch(db);
      const relationship = relationshipDoc.data() as ContactRelationship;

      // Delete forward relationship
      batch.delete(relationshipRef);

      // Delete inverse relationship if it exists
      if (relationship.isBidirectional) {
        const inverseType = this.getInverseRelationshipType(relationship.type);
        const relationshipsRef = collection(db, this.relationshipsCollectionName);
        const q = query(
          relationshipsRef,
          where('contactId', '==', relationship.relatedContactId),
          where('relatedContactId', '==', relationship.contactId),
          where('type', '==', inverseType)
        );
        
        const querySnapshot = await getDocs(q);
        querySnapshot.docs.forEach(doc => batch.delete(doc.ref));
      }

      await batch.commit();
    } catch (error) {
      console.error('Error removing relationship:', error);
      throw error;
    }
  }

  /**
   * Update contact status (active, deceased, unknown)
   */
  async updateContactStatus(
    contactId: string,
    status: 'active' | 'deceased' | 'unknown'
  ): Promise<void> {
    try {
      const contactRef = doc(db, this.collectionName, contactId);
      await updateDoc(contactRef, {
        status,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating contact status:', error);
      throw error;
    }
  }

  /**
   * Get all family members (contacts marked as family)
   */
  async getFamilyMembers(userId: string): Promise<Contact[]> {
    try {
      const allContacts = await this.getUserContacts(userId);
      return allContacts.filter(c => c.isFamilyMember === true);
    } catch (error) {
      console.error('Error getting family members:', error);
      throw error;
    }
  }

  /**
   * Get all household members
   */
  async getHouseholdMembers(userId: string): Promise<Contact[]> {
    try {
      const allContacts = await this.getUserContacts(userId);
      return allContacts.filter(c => c.isHouseholdMember === true);
    } catch (error) {
      console.error('Error getting household members:', error);
      throw error;
    }
  }
}

export const contactsService = new ContactsService();
export default contactsService;

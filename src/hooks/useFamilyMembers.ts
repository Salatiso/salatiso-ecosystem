/**
 * Hook for loading and managing family members from ContactsService
 * Provides real-time sync with Firestore
 */

'use client';

import { useEffect, useState, useCallback } from 'react';
import { contactsService, type Contact, type ContactRelationship } from '@/services/ContactsService';
import { useAuth } from '@/contexts/AuthContext';

export interface FamilyMemberUI extends Contact {
  role: string;
  level: number;
  experiencePoints: number;
  responsibilities: string[];
  achievements: string[];
  careerPath: string;
  specializations: string[];
  trustRating: number;
  joinDate: string;
  profileImage?: string;
}

export const useFamilyMembers = () => {
  const { user } = useAuth();
  const [members, setMembers] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load contacts from Firestore
  const loadMembers = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const familyMembers = await contactsService.getFamilyMembers(user.id);
      setMembers(familyMembers);
      setError(null);
    } catch (err) {
      console.error('Error loading family members:', err);
      setError(err instanceof Error ? err.message : 'Failed to load family members');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Load members on mount and when user changes
  useEffect(() => {
    loadMembers();
  }, [loadMembers]);

  // Update a member
  const updateMember = useCallback(
    async (memberId: string, updates: Partial<Contact>) => {
      try {
        await contactsService.updateContact(memberId, updates);
        await loadMembers(); // Reload to get latest data
      } catch (err) {
        console.error('Error updating member:', err);
        throw err;
      }
    },
    [loadMembers]
  );

  // Get related family members (parents, siblings, children)
  const getRelatedMembers = useCallback(
    async (memberId: string) => {
      try {
        return await contactsService.getRelatedContacts(memberId);
      } catch (err) {
        console.error('Error getting related members:', err);
        return [];
      }
    },
    []
  );

  // Get specific relationship type
  const getMembersByRelationship = useCallback(
    async (memberId: string, relationshipType: ContactRelationship['type']) => {
      try {
        return await contactsService.getRelationshipsByType(memberId, relationshipType);
      } catch (err) {
        console.error(`Error getting ${relationshipType} for member:`, err);
        return [];
      }
    },
    []
  );

  return {
    members,
    loading,
    error,
    refresh: loadMembers,
    updateMember,
    getRelatedMembers,
    getMembersByRelationship
  };
};

// Re-export types
export type { ContactRelationship } from '@/services/ContactsService';

/**
 * @file CalendarSystemService.ts
 * @description Service layer for managing calendar systems in Firestore
 * @author Salatiso Ecosystem
 * @created October 25, 2025
 * @phase Phase 1 - Foundation
 * 
 * Provides CRUD operations and business logic for calendar systems
 */

import {
  collection,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  getDocs,
  addDoc,
  Timestamp
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { CalendarSystem, CalendarOverlay, SeasonalMarker, CulturalSignificance } from '@/types/calendar-systems';

/**
 * Calendar System Service
 * Manages calendar system definitions and overlays
 */
export class CalendarSystemService {
  private static readonly COLLECTION_NAME = 'calendarSystems';
  private static readonly OVERLAYS_COLLECTION = 'calendarOverlays';
  private static readonly MARKERS_COLLECTION = 'seasonalMarkers';

  /**
   * Get all available calendar systems
   */
  static async getCalendarSystems(): Promise<CalendarSystem[]> {
    try {
      const snapshot = await getDocs(collection(db, this.COLLECTION_NAME));
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as CalendarSystem));
    } catch (error) {
      console.error('Error fetching calendar systems:', error);
      throw error;
    }
  }

  /**
   * Get a specific calendar system by ID
   */
  static async getCalendarSystem(id: string): Promise<CalendarSystem | null> {
    try {
      const docRef = doc(db, this.COLLECTION_NAME, id);
      const snapshot = await getDoc(docRef);
      
      if (!snapshot.exists()) {
        return null;
      }

      return {
        id: snapshot.id,
        ...snapshot.data()
      } as CalendarSystem;
    } catch (error) {
      console.error('Error fetching calendar system:', error);
      throw error;
    }
  }

  /**
   * Get calendar system by name
   */
  static async getCalendarSystemByName(name: string): Promise<CalendarSystem | null> {
    try {
      const q = query(
        collection(db, this.COLLECTION_NAME),
        where('name', '==', name)
      );
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        return null;
      }

      const doc = snapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data()
      } as CalendarSystem;
    } catch (error) {
      console.error('Error fetching calendar system by name:', error);
      throw error;
    }
  }

  /**
   * Create a new calendar system
   */
  static async createCalendarSystem(system: Omit<CalendarSystem, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const systemData = {
        ...system,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };

      const docRef = await addDoc(collection(db, this.COLLECTION_NAME), systemData);
      return docRef.id;
    } catch (error) {
      console.error('Error creating calendar system:', error);
      throw error;
    }
  }

  /**
   * Update a calendar system
   */
  static async updateCalendarSystem(id: string, updates: Partial<CalendarSystem>): Promise<void> {
    try {
      const docRef = doc(db, this.COLLECTION_NAME, id);
      
      await updateDoc(docRef, {
        ...updates,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating calendar system:', error);
      throw error;
    }
  }

  /**
   * Delete a calendar system
   */
  static async deleteCalendarSystem(id: string): Promise<void> {
    try {
      const docRef = doc(db, this.COLLECTION_NAME, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting calendar system:', error);
      throw error;
    }
  }

  /**
   * Get all overlays for an event
   */
  static async getEventOverlays(eventId: string): Promise<CalendarOverlay[]> {
    try {
      const q = query(
        collection(db, this.OVERLAYS_COLLECTION),
        where('eventId', '==', eventId)
      );
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as CalendarOverlay));
    } catch (error) {
      console.error('Error fetching event overlays:', error);
      throw error;
    }
  }

  /**
   * Get overlay for a specific calendar system and event
   */
  static async getEventOverlay(eventId: string, calendarSystemId: string): Promise<CalendarOverlay | null> {
    try {
      const q = query(
        collection(db, this.OVERLAYS_COLLECTION),
        where('eventId', '==', eventId),
        where('calendarSystemId', '==', calendarSystemId)
      );
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        return null;
      }

      const doc = snapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data()
      } as CalendarOverlay;
    } catch (error) {
      console.error('Error fetching event overlay:', error);
      throw error;
    }
  }

  /**
   * Create or update calendar overlay for an event
   */
  static async setEventOverlay(overlay: Omit<CalendarOverlay, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      // Check if overlay already exists
      const existing = await this.getEventOverlay(overlay.eventId, overlay.calendarSystemId);
      
      const overlayData = {
        ...overlay,
        updatedAt: Timestamp.now(),
        ...(existing ? {} : { createdAt: Timestamp.now() })
      };

      if (existing) {
        // Update existing overlay
        await updateDoc(doc(db, this.OVERLAYS_COLLECTION, existing.id), overlayData);
        return existing.id;
      } else {
        // Create new overlay
        const docRef = await addDoc(collection(db, this.OVERLAYS_COLLECTION), {
          ...overlayData,
          createdAt: Timestamp.now()
        });
        return docRef.id;
      }
    } catch (error) {
      console.error('Error setting event overlay:', error);
      throw error;
    }
  }

  /**
   * Delete calendar overlay
   */
  static async deleteEventOverlay(eventId: string, calendarSystemId: string): Promise<void> {
    try {
      const existing = await this.getEventOverlay(eventId, calendarSystemId);
      
      if (existing) {
        await deleteDoc(doc(db, this.OVERLAYS_COLLECTION, existing.id));
      }
    } catch (error) {
      console.error('Error deleting event overlay:', error);
      throw error;
    }
  }

  /**
   * Get seasonal markers for a calendar system
   */
  static async getSeasonalMarkers(calendarSystemId: string): Promise<SeasonalMarker[]> {
    try {
      const q = query(
        collection(db, this.MARKERS_COLLECTION),
        where('calendarSystemId', '==', calendarSystemId)
      );
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as SeasonalMarker));
    } catch (error) {
      console.error('Error fetching seasonal markers:', error);
      throw error;
    }
  }

  /**
   * Add seasonal marker
   */
  static async addSeasonalMarker(marker: Omit<SeasonalMarker, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const markerData = {
        ...marker,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };

      const docRef = await addDoc(collection(db, this.MARKERS_COLLECTION), markerData);
      return docRef.id;
    } catch (error) {
      console.error('Error adding seasonal marker:', error);
      throw error;
    }
  }

  /**
   * Update seasonal marker
   */
  static async updateSeasonalMarker(id: string, updates: Partial<SeasonalMarker>): Promise<void> {
    try {
      const docRef = doc(db, this.MARKERS_COLLECTION, id);
      
      await updateDoc(docRef, {
        ...updates,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating seasonal marker:', error);
      throw error;
    }
  }

  /**
   * Delete seasonal marker
   */
  static async deleteSeasonalMarker(id: string): Promise<void> {
    try {
      const docRef = doc(db, this.MARKERS_COLLECTION, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting seasonal marker:', error);
      throw error;
    }
  }

  /**
   * Seed the Natural 13-Month calendar system
   * Called during app initialization if system doesn't exist
   */
  static async seedNatural13System(): Promise<string> {
    try {
      const existing = await this.getCalendarSystemByName('Natural 13-Month');
      
      if (existing) {
        return existing.id;
      }

      const natural13System: Omit<CalendarSystem, 'id' | 'createdAt' | 'updatedAt'> = {
        name: 'Natural 13-Month',
        displayName: 'Natural 13-Month Calendar',
        type: 'seasonal',
        config: {
          daysPerYear: 364,
          monthsPerYear: 13,
          daysPerMonth: 28,
          weekDaysPerMonth: 4,
          intercalationRules: [
            {
              type: 'leap_day',
              frequency: 'every 4 years',
              insertionPoint: 'after month 6',
              duration: 1
            }
          ],
          yearStartAlignment: 'solstice'
        },
        culturalOrigin: {
          regions: ['Southern Africa', 'Indigenous Cultures'],
          description: 'Indigenous natural calendar system honoring seasonal and lunar cycles',
          references: [
            'Traditional astronomical knowledge',
            'Seasonal ecological patterns'
          ]
        },
        isActive: true,
        isDefault: false
      };

      return await this.createCalendarSystem(natural13System);
    } catch (error) {
      console.error('Error seeding Natural13 system:', error);
      throw error;
    }
  }

  /**
   * Seed seasonal markers for Natural 13-Month calendar
   */
  static async seedNatural13Markers(calendarSystemId: string): Promise<void> {
    try {
      // Check if markers already exist
      const existing = await this.getSeasonalMarkers(calendarSystemId);
      
      if (existing.length > 0) {
        return;
      }

      const markers: Omit<SeasonalMarker, 'id' | 'createdAt' | 'updatedAt'>[] = [
        {
          calendarSystemId,
          name: 'Winter Solstice (Year Day)',
          localizedNames: { en: 'Winter Solstice' },
          type: 'solar',
          timing: {
            fixedDate: { month: 12, day: 21 },
            astronomicalEvent: 'solstice'
          },
          culturalSignificance: {
            origin: ['Indigenous Traditions'],
            description: 'Celebrates the return of the sun',
            traditionalActivities: ['Renewal ceremonies', 'Community gathering'],
            biologicalAlignment: ['Hibernation cycles', 'Deep rest period']
          },
          isActive: true
        },
        {
          calendarSystemId,
          name: 'Spring Equinox',
          localizedNames: { en: 'Spring Equinox' },
          type: 'solar',
          timing: {
            fixedDate: { month: 3, day: 21 },
            astronomicalEvent: 'equinox'
          },
          culturalSignificance: {
            origin: ['Indigenous Traditions'],
            description: 'Balance of day and night - Awakening and Growth',
            traditionalActivities: ['Planting ceremonies', 'Spring hunts'],
            biologicalAlignment: ['Breeding season begins', 'Plant sprouting']
          },
          isActive: true
        },
        {
          calendarSystemId,
          name: 'Summer Solstice',
          localizedNames: { en: 'Summer Solstice' },
          type: 'solar',
          timing: {
            fixedDate: { month: 6, day: 21 },
            astronomicalEvent: 'solstice'
          },
          culturalSignificance: {
            origin: ['Indigenous Traditions'],
            description: 'Peak of the sun\'s power - Abundance and Manifestation',
            traditionalActivities: ['Celebration of growth', 'Gathering preparations'],
            biologicalAlignment: ['Peak fruiting', 'High animal activity']
          },
          isActive: true
        },
        {
          calendarSystemId,
          name: 'Autumn Equinox',
          localizedNames: { en: 'Autumn Equinox' },
          type: 'solar',
          timing: {
            fixedDate: { month: 9, day: 21 },
            astronomicalEvent: 'equinox'
          },
          culturalSignificance: {
            origin: ['Indigenous Traditions'],
            description: 'Balance before darkness - Gratitude and Harvest',
            traditionalActivities: ['Harvest gatherings', 'Food preservation'],
            biologicalAlignment: ['Migration season', 'Seed dispersal']
          },
          isActive: true
        }
      ];

      for (const marker of markers) {
        await this.addSeasonalMarker(marker);
      }
    } catch (error) {
      console.error('Error seeding seasonal markers:', error);
      throw error;
    }
  }

  /**
   * Initialize calendar systems (called on app startup)
   */
  static async initialize(): Promise<void> {
    try {
      const systemId = await this.seedNatural13System();
      await this.seedNatural13Markers(systemId);
    } catch (error) {
      console.error('Error initializing calendar systems:', error);
      throw error;
    }
  }
}

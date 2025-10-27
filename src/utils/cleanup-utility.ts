/**
 * Contact Cleanup Utility
 * 
 * Usage (in browser console):
 * 
 * // Option 1: Quick import and run
 * await import('./cleanup-utility.ts').then(m => m.cleanupNonFamilyContacts(userId))
 * 
 * // Option 2: Via ContactsService
 * import { contactsService } from '@/services/ContactsService'
 * await contactsService.permanentlyDeleteAllNonFamilyContacts(userId)
 */

import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/config/firebase';

const FAMILY_EMAILS = new Set([
  'tina@salatiso.com',
  'kwakhomdeni@gmail.com',
  'spiceinc@gmail.com',
  'mdeninotembac@gmail.com',
  'visasande@gmail.com'
]);

interface ContactInfo {
  id: string;
  firstName: string;
  lastName: string;
  emails: string[];
  category: string;
}

/**
 * Delete all non-family contacts for a user
 */
export async function cleanupNonFamilyContacts(userId: string): Promise<void> {
  console.log('🔄 Starting contact cleanup...\n');

  try {
    // Fetch all contacts for this user
    console.log('📋 Fetching all contacts...');
    const contactsRef = collection(db, 'contacts');
    const q = query(
      contactsRef,
      where('addedBy', '==', userId)
    );

    const snapshot = await getDocs(q);
    const allContacts: ContactInfo[] = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        firstName: data.firstName,
        lastName: data.lastName,
        emails: data.emails || [],
        category: data.category
      };
    });

    console.log(`   Total contacts: ${allContacts.length}\n`);

    // Categorize contacts
    const toDelete: ContactInfo[] = [];
    const toKeep: ContactInfo[] = [];

    allContacts.forEach(contact => {
      const emails = (contact.emails || []).map((e: string) => e.toLowerCase());
      const isFamily = emails.some(e => FAMILY_EMAILS.has(e));

      if (isFamily) {
        toKeep.push(contact);
      } else {
        toDelete.push(contact);
      }
    });

    console.log(`✅ KEEP (Family): ${toKeep.length}`);
    toKeep.forEach(c => {
      console.log(`   ✓ ${c.firstName} ${c.lastName}`);
    });

    console.log(`\n❌ DELETE (Non-Family): ${toDelete.length}`);
    if (toDelete.length > 0) {
      toDelete.forEach(c => {
        console.log(`   ✗ ${c.firstName} ${c.lastName}`);
      });

      // Show confirmation in console
      console.log(`\n⚠️  Ready to delete ${toDelete.length} contacts.`);
      console.log('   Proceeding with deletion...\n');

      // Delete contacts
      console.log('🗑️  Deleting contacts...\n');
      let deleted = 0;
      let errors = 0;

      for (const contact of toDelete) {
        try {
          const contactRef = doc(db, 'contacts', contact.id);
          await deleteDoc(contactRef);
          deleted++;
          console.log(`   ✓ ${deleted}/${toDelete.length} - ${contact.firstName} ${contact.lastName}`);
        } catch (error) {
          errors++;
          console.error(`   ❌ Error deleting ${contact.firstName}: ${(error as Error).message}`);
        }
      }

      console.log(`\n✅ Deletion complete!`);
      console.log(`   Successfully deleted: ${deleted}`);
      console.log(`   Errors: ${errors}`);
      console.log(`   Remaining family contacts: ${toKeep.length}\n`);

      return;
    } else {
      console.log('✅ No non-family contacts to delete.\n');
    }
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    throw error;
  }
}

/**
 * Get summary of contacts by category
 */
export async function getContactsSummary(userId: string): Promise<void> {
  try {
    const contactsRef = collection(db, 'contacts');
    const q = query(
      contactsRef,
      where('addedBy', '==', userId)
    );

    const snapshot = await getDocs(q);
    const contacts = snapshot.docs.map(doc => doc.data());

    const summary: Record<string, number> = {};
    contacts.forEach(c => {
      const cat = c.category || 'unknown';
      summary[cat] = (summary[cat] || 0) + 1;
    });

    console.log('📊 Contacts Summary:');
    console.log(`   Total: ${contacts.length}`);
    Object.entries(summary).forEach(([cat, count]) => {
      console.log(`   ${cat}: ${count}`);
    });
  } catch (error) {
    console.error('Error getting summary:', error);
  }
}

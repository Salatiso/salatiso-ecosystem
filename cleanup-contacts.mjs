#!/usr/bin/env node
/**
 * Migration Script: Delete Non-Family Contacts
 * 
 * This script permanently deletes all contacts EXCEPT the 5 family members.
 * 
 * Family members to KEEP:
 * 1. Tina Sisonke Mdeni (tina@salatiso.com)
 * 2. Kwakho Mdeni (kwakhomdeni@gmail.com)
 * 3. Salatiso Mdeni (spiceinc@gmail.com)
 * 4. Nozukile Cynthia Mdeni / Notemba (mdeninotembac@gmail.com)
 * 5. Visa Mdeni (visasande@gmail.com)
 */

import { initializeApp, cert } from 'firebase-admin/app.js';
import { getFirestore, deleteDoc, collection, query, where, getDocs } from 'firebase-admin/firestore.js';
import * as fs from 'fs';
import * as path from 'path';

// Family member emails to KEEP
const FAMILY_EMAILS = new Set([
  'tina@salatiso.com',
  'kwakhomdeni@gmail.com',
  'spiceinc@gmail.com',
  'mdeninotembac@gmail.com',
  'visasande@gmail.com'
]);

const FAMILY_NAMES = new Set([
  'Tina',
  'Kwakho',
  'Salatiso',
  'Nozukile',
  'Notemba',
  'Visa'
]);

async function deleteNonFamilyContacts() {
  console.log('🔄 Starting contact cleanup...\n');

  // Initialize Firebase Admin SDK
  // Note: In production, use environment variables
  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || 
    path.join(process.cwd(), 'serviceAccount.json');

  if (!fs.existsSync(serviceAccountPath)) {
    console.error(`❌ ERROR: Service account file not found at ${serviceAccountPath}`);
    console.error('   To fix:');
    console.error('   1. Download service account key from Firebase Console');
    console.error('   2. Save as serviceAccount.json in project root');
    console.error('   3. Or set FIREBASE_SERVICE_ACCOUNT_PATH env var');
    process.exit(1);
  }

  try {
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
    
    initializeApp({
      credential: cert(serviceAccount),
    });

    const db = getFirestore();
    const contactsRef = collection(db, 'contacts');

    // Query all contacts
    console.log('📋 Fetching all contacts...');
    const allContactsSnapshot = await getDocs(contactsRef);
    const allContacts = allContactsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    console.log(`   Total contacts found: ${allContacts.length}\n`);

    // Identify contacts to delete
    const contactsToDelete = [];
    const contactsToKeep = [];

    allContacts.forEach(contact => {
      const emails = (contact.emails || []).map(e => e.toLowerCase());
      const firstName = (contact.firstName || '').toLowerCase();
      const lastName = (contact.lastName || '').toLowerCase();
      const fullName = `${firstName} ${lastName}`.toLowerCase();

      // Check if contact is a family member
      const isFamily = 
        emails.some(e => FAMILY_EMAILS.has(e)) ||
        FAMILY_NAMES.has(contact.firstName);

      if (isFamily) {
        contactsToKeep.push(contact);
      } else {
        contactsToDelete.push(contact);
      }
    });

    console.log(`✅ Contacts to KEEP (Family): ${contactsToKeep.length}`);
    contactsToKeep.forEach(c => {
      console.log(`   ✓ ${c.firstName} ${c.lastName} (${c.emails?.[0] || 'no email'})`);
    });

    console.log(`\n❌ Contacts to DELETE (Non-Family): ${contactsToDelete.length}`);
    if (contactsToDelete.length > 0) {
      contactsToDelete.slice(0, 10).forEach(c => {
        console.log(`   ✗ ${c.firstName} ${c.lastName} (${c.emails?.[0] || 'no email'})`);
      });
      if (contactsToDelete.length > 10) {
        console.log(`   ... and ${contactsToDelete.length - 10} more`);
      }
    }

    // Confirm deletion
    console.log(`\n⚠️  About to permanently delete ${contactsToDelete.length} contacts.`);
    console.log('   This action CANNOT be undone!\n');

    // In automated mode, proceed. In interactive mode, you could prompt here.
    const confirmDelete = process.env.CONFIRM_DELETE === 'true' || process.argv.includes('--confirm');
    
    if (!confirmDelete && contactsToDelete.length > 0) {
      console.log('❌ Aborting. To confirm deletion, run with --confirm flag:');
      console.log('   node cleanup-contacts.mjs --confirm\n');
      console.log('Or set environment variable:');
      console.log('   CONFIRM_DELETE=true node cleanup-contacts.mjs\n');
      process.exit(0);
    }

    // Delete non-family contacts
    if (contactsToDelete.length > 0) {
      console.log('🗑️  Deleting non-family contacts...\n');

      let deleted = 0;
      for (const contact of contactsToDelete) {
        try {
          await deleteDoc(db.collection('contacts').doc(contact.id));
          deleted++;
          process.stdout.write(`\r   Deleted: ${deleted}/${contactsToDelete.length}`);
        } catch (error) {
          console.error(`\n❌ Error deleting contact ${contact.id}:`, error.message);
        }
      }

      console.log(`\n\n✅ Successfully deleted ${deleted} contacts!\n`);
    } else {
      console.log('✅ No non-family contacts to delete.\n');
    }

    // Final verification
    console.log('📋 Final verification...');
    const finalSnapshot = await getDocs(contactsRef);
    const finalContacts = finalSnapshot.docs.length;
    console.log(`   Remaining contacts: ${finalContacts}\n`);

    console.log('✨ Cleanup complete!');
    console.log(`   Family members in database: ${contactsToKeep.length}`);
    console.log(`   Ready for fresh contact import.\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    process.exit(1);
  }
}

// Run the script
deleteNonFamilyContacts().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

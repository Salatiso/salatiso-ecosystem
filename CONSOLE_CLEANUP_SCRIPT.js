/**
 * Contact Cleanup Script
 * 
 * Run this in the browser console at http://localhost:3001/intranet/contacts
 * to delete all non-family contacts.
 * 
 * Steps:
 * 1. Open http://localhost:3001/intranet/contacts
 * 2. Open browser console (F12)
 * 3. Copy and paste this entire script
 * 4. Press Enter to execute
 * 
 * Family members to KEEP:
 * - Tina Sisonke Mdeni (tina@salatiso.com)
 * - Kwakho Mdeni (kwakhomdeni@gmail.com)
 * - Salatiso Mdeni (spiceinc@gmail.com)
 * - Nozukile Cynthia Mdeni (mdeninotembac@gmail.com)
 * - Visa Mdeni (visasande@gmail.com)
 */

(async function cleanupContacts() {
  console.log('🔄 Starting contact cleanup...\n');

  const FAMILY_EMAILS = new Set([
    'tina@salatiso.com',
    'kwakhomdeni@gmail.com',
    'spiceinc@gmail.com',
    'mdeninotembac@gmail.com',
    'visasande@gmail.com'
  ]);

  // Import Firebase modules
  const { collection, query, where, getDocs, deleteDoc, doc } = await import('firebase/firestore');
  const { db } = await import('./config/firebase');

  try {
    // Get current user
    const { getAuth } = await import('firebase/auth');
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      console.error('❌ Not authenticated. Please log in first.');
      return;
    }

    console.log(`👤 Logged in as: ${user.email}\n`);

    // Fetch all contacts for this user
    console.log('📋 Fetching all contacts...');
    const contactsRef = collection(db, 'contacts');
    const q = query(
      contactsRef,
      where('addedBy', '==', user.uid)
    );

    const snapshot = await getDocs(q);
    const allContacts = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    console.log(`   Total contacts: ${allContacts.length}\n`);

    // Categorize contacts
    const toDelete = [];
    const toKeep = [];

    allContacts.forEach(contact => {
      const emails = (contact.emails || []).map(e => e.toLowerCase());
      const isFamily = emails.some(e => FAMILY_EMAILS.has(e));

      if (isFamily) {
        toKeep.push(contact);
      } else {
        toDelete.push(contact);
      }
    });

    console.log(`✅ KEEP (Family): ${toKeep.length}`);
    toKeep.forEach(c => {
      console.log(`   ✓ ${c.firstName} ${c.lastName} - ${c.category}`);
    });

    console.log(`\n❌ DELETE (Non-Family): ${toDelete.length}`);
    if (toDelete.length > 0) {
      toDelete.forEach(c => {
        console.log(`   ✗ ${c.firstName} ${c.lastName} - ${c.category}`);
      });

      // Ask for confirmation
      console.log(`\n⚠️  Ready to delete ${toDelete.length} contacts.`);
      const confirmed = confirm(
        `Are you SURE you want to permanently delete ${toDelete.length} non-family contacts?\n\n` +
        `This CANNOT be undone!\n\n` +
        `Click OK to confirm, or Cancel to abort.`
      );

      if (!confirmed) {
        console.log('❌ Deletion cancelled by user.');
        return;
      }

      // Delete contacts
      console.log('\n🗑️  Deleting contacts...\n');
      let deleted = 0;

      for (const contact of toDelete) {
        try {
          await deleteDoc(doc(db, 'contacts', contact.id));
          deleted++;
          console.log(`   ✓ Deleted: ${contact.firstName} ${contact.lastName} (${deleted}/${toDelete.length})`);
        } catch (error) {
          console.error(`   ❌ Error deleting ${contact.firstName}: ${error.message}`);
        }
      }

      console.log(`\n✅ Deletion complete!`);
      console.log(`   Deleted: ${deleted}/${toDelete.length}`);
      console.log(`   Remaining (Family): ${toKeep.length}\n`);

      // Reload page
      console.log('🔄 Reloading page in 2 seconds...');
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } else {
      console.log('✅ No non-family contacts to delete.\n');
    }
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  }
})();

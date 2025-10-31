/**
 * Knowledge Base Initialization Script
 * 
 * USAGE:
 * 1. Run in your Next.js app or Node.js environment
 * 2. Execute: await initializeKnowledgeBase()
 * 3. Check Firestore Console: chatbot_knowledge_base collection should have 15 articles
 * 
 * Option A: Run from browser console (if authenticated):
 *   import { initializeKnowledgeBase } from '@/services/knowledgeBaseService'
 *   await initializeKnowledgeBase()
 * 
 * Option B: Run from Next.js API route:
 *   POST /api/admin/initialize-kb
 * 
 * Option C: Run from Node.js script with admin credentials
 */

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as serviceAccount from './path/to/serviceAccountKey.json';
import { KNOWLEDGE_BASE_ARTICLES } from '@/data/knowledgeBase';

async function runInitialization() {
  try {
    console.log('🚀 Starting Knowledge Base Initialization...\n');

    // Initialize Firebase Admin SDK (if not already initialized)
    if (!getApps().length) {
      initializeApp({
        credential: cert(serviceAccount as any),
        projectId: 'lifecv-d2724',
      });
    }

    const db = getFirestore();
    const kbCollection = db.collection('chatbot_knowledge_base');

    // Check existing articles
    const snapshot = await kbCollection.get();
    console.log(`📊 Current articles in knowledge base: ${snapshot.size}`);

    if (snapshot.size > 0) {
      console.log('⚠️  Knowledge base already populated. Articles found:');
      snapshot.forEach((doc) => {
        console.log(`   - ${doc.data().title}`);
      });
      console.log('\n✅ Knowledge base already initialized!');
      return;
    }

    // Add all articles
    console.log(`\n📝 Adding ${KNOWLEDGE_BASE_ARTICLES.length} articles...\n`);

    let count = 0;
    for (const article of KNOWLEDGE_BASE_ARTICLES) {
      await kbCollection.doc(article.id).set({
        id: article.id,
        title: article.title,
        category: article.category,
        subcategory: article.subcategory || null,
        content: article.content,
        keywords: article.keywords,
        relatedArticles: article.relatedArticles || [],
        difficulty: article.difficulty,
        lastUpdated: article.lastUpdated,
        isActive: true,
        views: 0,
        helpful: 0,
        notHelpful: 0,
        createdAt: new Date(),
      });

      count++;
      console.log(`✅ [${count}/${KNOWLEDGE_BASE_ARTICLES.length}] Added: ${article.title}`);
    }

    console.log(`\n🎉 SUCCESS! Knowledge base initialized with ${count} articles`);
    console.log('\n📍 Next steps:');
    console.log('1. Verify articles in Firebase Console > Firestore > chatbot_knowledge_base');
    console.log('2. Test chatbot components with new knowledge base');
    console.log('3. Phase 3 now at 50% complete! 🎉');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error initializing knowledge base:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  runInitialization();
}

export { runInitialization };

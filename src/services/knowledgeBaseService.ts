/**
 * Knowledge Base Initialization Script
 * 
 * This utility initializes the Salatiso chatbot knowledge base in Firestore.
 * Run this once during setup to populate the knowledge base with articles.
 * 
 * Usage:
 * - Call from admin page or Firebase Functions
 * - Or import and use: await initializeKnowledgeBase()
 */

import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, query, where } from 'firebase/firestore';
import { KNOWLEDGE_BASE_ARTICLES } from '@/data/knowledgeBase';

export interface KnowledgeBaseStats {
  totalArticles: number;
  byCategory: Record<string, number>;
  totalKeywords: number;
  createdAt: Date;
}

/**
 * Initialize the knowledge base in Firestore
 * Creates the collection and adds all articles
 */
export async function initializeKnowledgeBase(): Promise<boolean> {
  try {
    console.log('📚 Starting knowledge base initialization...');

    const kbCollection = collection(db, 'chatbot_knowledge_base');

    // Check if already populated
    const snapshot = await getDocs(kbCollection);
    if (snapshot.size > 0) {
      console.log(
        '⚠️ Knowledge base already contains',
        snapshot.size,
        'articles. Skipping initialization.'
      );
      return false;
    }

    // Add all articles
    for (const article of KNOWLEDGE_BASE_ARTICLES) {
      await addDoc(kbCollection, {
        id: article.id,
        title: article.title,
        category: article.category,
        subcategory: article.subcategory || null,
        content: article.content,
        keywords: article.keywords,
        relatedArticles: article.relatedArticles || [],
        difficulty: article.difficulty,
        lastUpdated: new Date(article.lastUpdated),
        views: 0,
        helpful: 0,
        notHelpful: 0,
        createdAt: new Date(),
      });
    }

    console.log(
      '✅ Successfully populated knowledge base with',
      KNOWLEDGE_BASE_ARTICLES.length,
      'articles'
    );
    return true;
  } catch (error) {
    console.error('❌ Error initializing knowledge base:', error);
    throw error;
  }
}

/**
 * Get statistics about the knowledge base
 */
export async function getKnowledgeBaseStats(): Promise<KnowledgeBaseStats> {
  try {
    const kbCollection = collection(db, 'chatbot_knowledge_base');
    const snapshot = await getDocs(kbCollection);

    const stats: KnowledgeBaseStats = {
      totalArticles: snapshot.size,
      byCategory: {},
      totalKeywords: 0,
      createdAt: new Date(),
    };

    let keywordSet = new Set<string>();

    snapshot.forEach((doc) => {
      const data = doc.data();

      // Count by category
      if (data.category) {
        stats.byCategory[data.category] = (stats.byCategory[data.category] || 0) + 1;
      }

      // Count keywords
      if (Array.isArray(data.keywords)) {
        data.keywords.forEach((kw: string) => keywordSet.add(kw));
      }
    });

    stats.totalKeywords = keywordSet.size;

    return stats;
  } catch (error) {
    console.error('❌ Error getting knowledge base stats:', error);
    throw error;
  }
}

/**
 * Search knowledge base articles in Firestore
 */
export async function searchKnowledgeBaseFirestore(
  searchQuery: string
): Promise<Array<Record<string, any>>> {
  try {
    const kbCollection = collection(db, 'chatbot_knowledge_base');
    const snapshot = await getDocs(kbCollection);

    const lowerQuery = searchQuery.toLowerCase();
    const results: Array<Record<string, any>> = [];

    snapshot.forEach((doc) => {
      const data = doc.data();
      const content = `${data.title} ${data.content} ${(data.keywords || []).join(' ')}`.toLowerCase();

      if (content.includes(lowerQuery)) {
        results.push({
          id: doc.id,
          ...data,
        });
      }
    });

    return results;
  } catch (error) {
    console.error('❌ Error searching knowledge base:', error);
    throw error;
  }
}

/**
 * Get articles by category from Firestore
 */
export async function getArticlesByCategory(
  category: string
): Promise<Array<Record<string, any>>> {
  try {
    const kbCollection = collection(db, 'chatbot_knowledge_base');
    const q = query(kbCollection, where('category', '==', category));
    const snapshot = await getDocs(q);

    const articles: Array<Record<string, any>> = [];
    snapshot.forEach((doc) => {
      articles.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return articles;
  } catch (error) {
    console.error('❌ Error getting articles by category:', error);
    throw error;
  }
}

/**
 * Get articles by difficulty level
 */
export async function getArticlesByDifficulty(
  difficulty: 'beginner' | 'intermediate' | 'advanced'
): Promise<Array<Record<string, any>>> {
  try {
    const kbCollection = collection(db, 'chatbot_knowledge_base');
    const q = query(kbCollection, where('difficulty', '==', difficulty));
    const snapshot = await getDocs(q);

    const articles: Array<Record<string, any>> = [];
    snapshot.forEach((doc) => {
      articles.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return articles;
  } catch (error) {
    console.error('❌ Error getting articles by difficulty:', error);
    throw error;
  }
}

/**
 * Get popular articles (most viewed)
 */
export async function getPopularArticles(
  limit: number = 10
): Promise<Array<Record<string, any>>> {
  try {
    const kbCollection = collection(db, 'chatbot_knowledge_base');
    const snapshot = await getDocs(kbCollection);

    const articles: Array<Record<string, any>> = [];
    snapshot.forEach((doc) => {
      articles.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    // Sort by views descending
    return articles.sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, limit);
  } catch (error) {
    console.error('❌ Error getting popular articles:', error);
    throw error;
  }
}

/**
 * Record article view
 */
export async function recordArticleView(docId: string): Promise<void> {
  try {
    const docRef = doc(db, 'chatbot_knowledge_base', docId);
    const snapshot = await getDocs(collection(db, 'chatbot_knowledge_base'));
    const targetDoc = snapshot.docs.find((d) => d.data().id === docId);

    if (targetDoc) {
      await updateDoc(targetDoc.ref, {
        views: (targetDoc.data().views || 0) + 1,
      });
    }
  } catch (error) {
    console.error('❌ Error recording article view:', error);
  }
}

/**
 * Record article feedback (helpful/not helpful)
 */
export async function recordArticleFeedback(
  docId: string,
  isHelpful: boolean
): Promise<void> {
  try {
    const snapshot = await getDocs(collection(db, 'chatbot_knowledge_base'));
    const targetDoc = snapshot.docs.find((d) => d.data().id === docId);

    if (targetDoc) {
      const updateData = isHelpful
        ? { helpful: (targetDoc.data().helpful || 0) + 1 }
        : { notHelpful: (targetDoc.data().notHelpful || 0) + 1 };

      await updateDoc(targetDoc.ref, updateData);
    }
  } catch (error) {
    console.error('❌ Error recording article feedback:', error);
  }
}

/**
 * Clear all knowledge base articles (admin only - be careful!)
 */
export async function clearKnowledgeBase(): Promise<void> {
  try {
    const kbCollection = collection(db, 'chatbot_knowledge_base');
    const snapshot = await getDocs(kbCollection);

    for (const doc of snapshot.docs) {
      await deleteDoc(doc.ref);
    }

    console.log('✅ Knowledge base cleared successfully');
  } catch (error) {
    console.error('❌ Error clearing knowledge base:', error);
    throw error;
  }
}

/**
 * Reset knowledge base to default articles
 */
export async function resetKnowledgeBase(): Promise<boolean> {
  try {
    console.log('🔄 Resetting knowledge base...');

    // Clear existing
    await clearKnowledgeBase();

    // Reinitialize
    return await initializeKnowledgeBase();
  } catch (error) {
    console.error('❌ Error resetting knowledge base:', error);
    throw error;
  }
}

// Import updateDoc from Firestore
import { updateDoc } from 'firebase/firestore';

/**
 * Export knowledge base to JSON
 */
export async function exportKnowledgeBase(): Promise<string> {
  try {
    const kbCollection = collection(db, 'chatbot_knowledge_base');
    const snapshot = await getDocs(kbCollection);

    const articles: Array<Record<string, any>> = [];
    snapshot.forEach((doc) => {
      articles.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return JSON.stringify(articles, null, 2);
  } catch (error) {
    console.error('❌ Error exporting knowledge base:', error);
    throw error;
  }
}

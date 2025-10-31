/**
 * API Route: Initialize Knowledge Base
 * 
 * USAGE:
 * POST /api/admin/initialize-kb
 * 
 * Response:
 * {
 *   success: true,
 *   message: "Knowledge base initialized with 15 articles",
 *   articlesCount: 15
 * }
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, getDocs, setDoc, doc, Timestamp } from 'firebase/firestore';
import { KNOWLEDGE_BASE_ARTICLES } from '@/data/knowledgeBase';
import { getAuth } from 'firebase/auth';

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Knowledge Base Initialization API called');

    // Verify authentication and admin status
    // Note: In production, verify the user is an admin via custom claims
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Unauthorized - no auth token' },
        { status: 401 }
      );
    }

    const kbCollection = collection(db, 'chatbot_knowledge_base');

    // Check existing articles
    const snapshot = await getDocs(kbCollection);
    if (snapshot.size > 0) {
      console.log(`⚠️ Knowledge base already has ${snapshot.size} articles`);
      return NextResponse.json(
        {
          success: false,
          message: `Knowledge base already initialized with ${snapshot.size} articles`,
          articlesCount: snapshot.size,
          alreadyInitialized: true,
        },
        { status: 400 }
      );
    }

    // Add all articles
    console.log(`📝 Adding ${KNOWLEDGE_BASE_ARTICLES.length} articles...`);
    let count = 0;

    for (const article of KNOWLEDGE_BASE_ARTICLES) {
      await setDoc(doc(kbCollection, article.id), {
        id: article.id,
        title: article.title,
        category: article.category,
        subcategory: article.subcategory || null,
        content: article.content,
        keywords: article.keywords,
        relatedArticles: article.relatedArticles || [],
        difficulty: article.difficulty,
        lastUpdated: Timestamp.fromDate(new Date(article.lastUpdated)),
        isActive: true,
        views: 0,
        helpful: 0,
        notHelpful: 0,
        createdAt: Timestamp.now(),
      });

      count++;
      console.log(`✅ [${count}/${KNOWLEDGE_BASE_ARTICLES.length}] ${article.title}`);
    }

    console.log(`🎉 Knowledge base initialized with ${count} articles`);

    return NextResponse.json(
      {
        success: true,
        message: `Knowledge base initialized with ${count} articles`,
        articlesCount: count,
        articles: KNOWLEDGE_BASE_ARTICLES.map((a) => ({
          id: a.id,
          title: a.title,
          category: a.category,
        })),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ Error initializing knowledge base:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

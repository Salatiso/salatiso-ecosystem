/**
 * Admin Page: Initialize Knowledge Base
 * 
 * USAGE:
 * 1. Navigate to: http://localhost:3000/admin/initialize-kb
 * 2. Click "Initialize Knowledge Base" button
 * 3. See real-time initialization progress
 * 4. Verify in Firebase Console > Firestore
 */

'use client';

import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

export const dynamic = 'force-dynamic';

interface InitializeResponse {
  success: boolean;
  message: string;
  articlesCount?: number;
  articles?: Array<{ id: string; title: string; category: string }>;
  error?: string;
  alreadyInitialized?: boolean;
}

export default function InitializeKBPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isInitializing, setIsInitializing] = useState(false);
  const [response, setResponse] = useState<InitializeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Check authentication status
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const handleInitialize = async () => {
    if (!user) {
      setError('You must be logged in');
      return;
    }

    setIsInitializing(true);
    setError(null);
    setResponse(null);

    try {
      console.log('🚀 Initializing knowledge base...');

      // Get auth token
      const token = await user!.getIdToken();

      // Call API
      const res = await fetch('/api/admin/initialize-kb', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      const data: InitializeResponse = await res.json();

      if (res.ok && data.success) {
        console.log('✅ Knowledge base initialized!');
        setResponse(data);
      } else {
        console.error('⚠️ Response:', data);
        setResponse(data);
        if (!data.alreadyInitialized) {
          setError(data.error || data.message);
        }
      }
    } catch (err) {
      console.error('❌ Error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsInitializing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-xl text-red-500 mb-4">❌ You must be logged in</p>
          <a href="/auth/login" className="text-blue-500 hover:underline">
            Go to login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🎓 Initialize Knowledge Base</h1>
          <p className="text-gray-600">Populate the Firestore knowledge base with 15 comprehensive articles</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Status */}
          <div className="mb-8 p-4 bg-gray-50 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Status</h2>
            <p className="text-gray-600">
              Logged in as: <span className="font-medium">{user.email}</span>
            </p>
            <p className="text-gray-600">
              Role: <span className="font-medium">Admin</span>
            </p>
          </div>

          {/* Initialize Button */}
          <button
            onClick={handleInitialize}
            disabled={isInitializing}
            className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all mb-6 ${
              isInitializing
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
            }`}
          >
            {isInitializing ? (
              <span className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                Initializing... This may take a moment
              </span>
            ) : (
              '▶️ Initialize Knowledge Base'
            )}
          </button>

          {/* Success Response */}
          {response && response.success && (
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-green-900 mb-2">✅ Success!</h3>
              <p className="text-green-800 mb-4">{response.message}</p>

              {response.articles && (
                <div className="mt-4">
                  <h4 className="font-semibold text-green-900 mb-2">Articles Added:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                    {response.articles.map((article) => (
                      <div key={article.id} className="text-sm text-green-800 p-2 bg-green-100 rounded">
                        <span className="font-medium">{article.title}</span>
                        <br />
                        <span className="text-xs text-green-700">Category: {article.category}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6 p-4 bg-white rounded border border-green-200">
                <h4 className="font-semibold text-gray-900 mb-2">📊 Next Steps:</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
                  <li>Verify in Firebase Console: Firestore Database → chatbot_knowledge_base collection</li>
                  <li>You should see 15 documents (kb-001 through kb-015)</li>
                  <li>Test the chatbot components with the new knowledge base</li>
                  <li>Phase 3 is now at 50% complete! 🎉</li>
                </ol>
              </div>
            </div>
          )}

          {/* Already Initialized */}
          {response && response.alreadyInitialized && (
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-yellow-900 mb-2">⚠️ Already Initialized</h3>
              <p className="text-yellow-800">{response.message}</p>
              <p className="text-sm text-yellow-700 mt-2">
                The knowledge base already contains {response.articlesCount} articles.
              </p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-red-900 mb-2">❌ Error</h3>
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 mb-2">ℹ️ Information</h3>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>This will add 15 articles to the chatbot_knowledge_base collection</li>
              <li>Articles include comprehensive documentation across 7 categories</li>
              <li>Safe to run multiple times (checks for existing articles)</li>
              <li>View progress in browser console (F12)</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-600">
          <p>Phase 3 Progress: Knowledge Base Initialization</p>
          <p>After this completes: 50% → Cloud Function Setup → Testing → Complete</p>
        </div>
      </div>
    </div>
  );
}

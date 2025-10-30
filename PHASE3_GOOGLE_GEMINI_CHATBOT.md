# Google Gemini + Firebase Chatbot Implementation

**Status**: 📋 IMPLEMENTATION READY  
**API**: Google Gemini (Vertex AI)  
**Backend**: Firebase Cloud Functions  
**Date**: October 30, 2025

---

## 🎯 OVERVIEW: Google-Only Solution

Since you only have Google API available, here's the complete integration:

```
┌─────────────────────────────────────────┐
│         MNI Chatbot Architecture        │
├─────────────────────────────────────────┤
│                                         │
│  Frontend (React)                       │
│    ↓                                    │
│  Firebase Cloud Function (Node.js)      │
│    ↓                                    │
│  Google Gemini API (LLM)                │
│    ↓                                    │
│  Firestore (Knowledge Base + History)   │
│    ↓                                    │
│  Response back to Frontend              │
│                                         │
└─────────────────────────────────────────┘
```

---

## 📦 SETUP: Google Cloud & Firebase

### Step 1: Enable Vertex AI API

```
1. Go: https://console.cloud.google.com
2. Select your Firebase project
3. Search: "Vertex AI API"
4. Click: "Enable"
5. Wait 2-3 minutes for activation
```

### Step 2: Enable Cloud Functions API

```
1. In Google Cloud Console
2. Search: "Cloud Functions API"
3. Click: "Enable"
```

### Step 3: Setup Service Account (for Cloud Functions)

```
1. Go: APIs & Services > Credentials
2. Click: "Create Credentials" > "Service Account"
3. Name: "mni-chatbot-service"
4. Click: "Create and Continue"
5. Add role: "Vertex AI Admin"
6. Click: "Continue" > "Done"
7. Click service account name
8. Go to: "Keys" tab
9. Click: "Add Key" > "Create new key"
10. Choose: "JSON"
11. Download and save securely (you'll use this for Cloud Functions)
```

---

## 🔐 ENVIRONMENT SETUP

### .env.local (Frontend - NO SENSITIVE KEYS)

```env
# .env.local

# Only public config
NEXT_PUBLIC_FIREBASE_API_KEY=your_public_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Chatbot config (no keys!)
NEXT_PUBLIC_GEMINI_MODEL=gemini-pro
NEXT_PUBLIC_CHATBOT_ENABLED=true
```

### functions/.env.local (Cloud Functions - SENSITIVE)

```env
# Cloud Functions environment

# Google Cloud
GOOGLE_CLOUD_PROJECT=your_project_id
GCLOUD_REGION=us-central1

# Gemini
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-pro
GEMINI_MAX_TOKENS=1024
GEMINI_TEMPERATURE=0.7

# Firestore
FIRESTORE_DATABASE=your_firestore_database_id

# Rate limiting
RATE_LIMIT_REQUESTS_PER_MINUTE=10
RATE_LIMIT_REQUESTS_PER_HOUR=100
RATE_LIMIT_REQUESTS_PER_DAY=1000
```

---

## 💾 FIRESTORE SERVICE - Chat Message Logging

### File: `src/services/chatbotService.ts`

```typescript
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  getDocs,
  Timestamp,
  updateDoc,
  doc
} from 'firebase/firestore';
import { db } from '@/config/firebase';

export interface ChatMessage {
  id?: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Timestamp;
  contentType: 'text' | 'suggestion' | 'error';
  sources?: string[]; // KB article IDs
  confidence?: number;
}

export interface ChatConversation {
  id?: string;
  userId: string;
  startTime: Timestamp;
  endTime?: Timestamp;
  status: 'active' | 'closed' | 'archived';
  topic?: string;
  messages: ChatMessage[];
  messageCount: number;
  resolvedAt?: Timestamp;
  resolvedStatus?: 'resolved' | 'escalated' | 'abandoned';
  satisfaction?: number; // 1-5 rating
  metadata?: {
    userRole?: string;
    language?: string;
    device?: string;
    ipAddress?: string;
  };
  createdAt: Timestamp;
  lastModified: Timestamp;
}

class ChatbotService {
  async logUserMessage(
    userId: string,
    conversationId: string,
    message: string,
    metadata?: any
  ): Promise<string> {
    try {
      const convRef = doc(db, 'chatbot_conversations', conversationId);
      const messageObj: ChatMessage = {
        role: 'user',
        content: message,
        timestamp: Timestamp.now(),
        contentType: 'text',
      };

      // Get current conversation
      const convSnap = await getDocs(
        query(
          collection(db, 'chatbot_conversations'),
          where('id', '==', conversationId)
        )
      );

      if (convSnap.empty) {
        // Create new conversation
        const newConv = await addDoc(
          collection(db, 'chatbot_conversations'),
          {
            userId,
            startTime: Timestamp.now(),
            status: 'active',
            messages: [messageObj],
            messageCount: 1,
            metadata: metadata || {},
            createdAt: Timestamp.now(),
            lastModified: Timestamp.now(),
          }
        );
        return newConv.id;
      } else {
        // Update existing conversation
        const convData = convSnap.docs[0].data() as ChatConversation;
        await updateDoc(convSnap.docs[0].ref, {
          messages: [...convData.messages, messageObj],
          messageCount: (convData.messageCount || 0) + 1,
          lastModified: Timestamp.now(),
        });
        return convSnap.docs[0].id;
      }
    } catch (error) {
      console.error('Error logging user message:', error);
      throw error;
    }
  }

  async logAssistantResponse(
    conversationId: string,
    response: string,
    sources: string[] = [],
    confidence: number = 0.8
  ): Promise<void> {
    try {
      const convSnap = await getDocs(
        query(
          collection(db, 'chatbot_conversations'),
          where('id', '==', conversationId)
        )
      );

      if (!convSnap.empty) {
        const convData = convSnap.docs[0].data() as ChatConversation;
        const assistantMessage: ChatMessage = {
          role: 'assistant',
          content: response,
          timestamp: Timestamp.now(),
          contentType: 'text',
          sources,
          confidence,
        };

        await updateDoc(convSnap.docs[0].ref, {
          messages: [...convData.messages, assistantMessage],
          messageCount: (convData.messageCount || 0) + 1,
          lastModified: Timestamp.now(),
        });
      }
    } catch (error) {
      console.error('Error logging assistant response:', error);
      throw error;
    }
  }

  async getConversationHistory(
    conversationId: string
  ): Promise<ChatConversation | null> {
    try {
      const convSnap = await getDocs(
        query(
          collection(db, 'chatbot_conversations'),
          where('id', '==', conversationId)
        )
      );

      if (!convSnap.empty) {
        return convSnap.docs[0].data() as ChatConversation;
      }
      return null;
    } catch (error) {
      console.error('Error getting conversation history:', error);
      throw error;
    }
  }

  async closeConversation(
    conversationId: string,
    resolvedStatus: 'resolved' | 'escalated' | 'abandoned',
    satisfaction?: number
  ): Promise<void> {
    try {
      const convSnap = await getDocs(
        query(
          collection(db, 'chatbot_conversations'),
          where('id', '==', conversationId)
        )
      );

      if (!convSnap.empty) {
        await updateDoc(convSnap.docs[0].ref, {
          status: 'closed',
          endTime: Timestamp.now(),
          resolvedAt: Timestamp.now(),
          resolvedStatus,
          satisfaction: satisfaction || null,
          lastModified: Timestamp.now(),
        });
      }
    } catch (error) {
      console.error('Error closing conversation:', error);
      throw error;
    }
  }
}

export default new ChatbotService();
```

---

## ☁️ CLOUD FUNCTION: Google Gemini Integration

### File: `functions/src/chatbot.ts`

```typescript
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { GoogleGenerativeAI } from '@google/generative-ai';

admin.initializeApp();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

interface ChatRequest {
  userId: string;
  conversationId: string;
  message: string;
  language: string;
}

interface ChatResponse {
  success: boolean;
  response?: string;
  conversationId?: string;
  sources?: string[];
  error?: string;
}

// Get knowledge base articles relevant to query
async function searchKnowledgeBase(
  query: string,
  limit: number = 5
): Promise<any[]> {
  const db = admin.firestore();
  const kbRef = collection(db, 'chatbot_knowledge_base');
  
  // Simple keyword search (in production, use Firestore full-text search)
  const snapshot = await db
    .collection('chatbot_knowledge_base')
    .where('isActive', '==', true)
    .limit(limit)
    .get();

  // Filter by relevance (simplified)
  return snapshot.docs
    .map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    .filter(doc => {
      const keywords = doc.keywords || [];
      return keywords.some(keyword =>
        query.toLowerCase().includes(keyword.toLowerCase())
      );
    })
    .slice(0, limit);
}

// Build context from knowledge base
function buildContext(articles: any[]): string {
  if (articles.length === 0) {
    return 'No specific articles found, provide general assistance.';
  }

  return articles
    .map(article => `[${article.id}] ${article.title}: ${article.content}`)
    .join('\n\n');
}

// Get system prompt with context
async function buildSystemPrompt(
  context: string,
  userRole: string,
  language: string
): Promise<string> {
  const settings = await admin
    .firestore()
    .collection('chatbot_settings')
    .doc('global_settings')
    .get();

  const settingsData = settings.data();
  const basePrompt = settingsData?.systemPrompt || 
    'You are MNI Assistant, helping users navigate the MNI platform.';

  return `${basePrompt}

CONTEXT:
${context}

USER ROLE: ${userRole}
LANGUAGE: ${language}

INSTRUCTIONS:
- Answer questions based on the provided context
- Be concise and helpful
- If unsure, offer to escalate to support
- Maintain context of conversation
- Be friendly and professional`;
}

// Main chatbot function
export const processChat = functions.https.onCall(
  async (data: ChatRequest, context: functions.https.CallableContext) => {
    const { userId, conversationId, message, language = 'en' } = data;

    try {
      // Verify authentication
      if (!context.auth || context.auth.uid !== userId) {
        throw new Error('Unauthorized');
      }

      // Rate limiting check (implement as needed)
      // await checkRateLimit(userId);

      // Search knowledge base
      const articles = await searchKnowledgeBase(message);
      const context_text = buildContext(articles);

      // Get user role for context
      const userDoc = await admin
        .firestore()
        .collection('user_role_assignments')
        .doc(userId)
        .get();

      const userRole = userDoc.data()?.primaryRole || 'guest';

      // Build system prompt
      const systemPrompt = await buildSystemPrompt(context_text, userRole, language);

      // Call Gemini API
      const model = genAI.getGenerativeModel({ 
        model: process.env.GEMINI_MODEL || 'gemini-pro'
      });

      const result = await model.generateContent({
        contents: [
          {
            role: 'user',
            parts: [{ text: message }]
          }
        ],
        systemInstruction: systemPrompt,
        generationConfig: {
          maxOutputTokens: parseInt(process.env.GEMINI_MAX_TOKENS || '1024'),
          temperature: parseFloat(process.env.GEMINI_TEMPERATURE || '0.7'),
          topP: 0.95,
          topK: 40,
        },
      });

      const responseText = result.response.text();

      // Log to Firestore
      const db = admin.firestore();
      
      // Log assistant response
      const conversationRef = db.collection('chatbot_conversations').doc(conversationId);
      const conversationData = await conversationRef.get();

      if (!conversationData.exists) {
        // Create new conversation
        await conversationRef.set({
          userId,
          startTime: admin.firestore.Timestamp.now(),
          status: 'active',
          messages: [
            {
              role: 'user',
              content: message,
              timestamp: admin.firestore.Timestamp.now(),
              contentType: 'text',
            },
            {
              role: 'assistant',
              content: responseText,
              timestamp: admin.firestore.Timestamp.now(),
              contentType: 'text',
              sources: articles.map(a => a.id),
              confidence: 0.9,
            }
          ],
          messageCount: 2,
          metadata: { userRole, language },
          createdAt: admin.firestore.Timestamp.now(),
          lastModified: admin.firestore.Timestamp.now(),
        });
      } else {
        // Update existing conversation
        const currentData = conversationData.data();
        await conversationRef.update({
          messages: [
            ...currentData.messages,
            {
              role: 'user',
              content: message,
              timestamp: admin.firestore.Timestamp.now(),
              contentType: 'text',
            },
            {
              role: 'assistant',
              content: responseText,
              timestamp: admin.firestore.Timestamp.now(),
              contentType: 'text',
              sources: articles.map(a => a.id),
              confidence: 0.9,
            }
          ],
          messageCount: currentData.messageCount + 2,
          lastModified: admin.firestore.Timestamp.now(),
        });
      }

      return {
        success: true,
        response: responseText,
        conversationId,
        sources: articles.map(a => a.id),
      } as ChatResponse;

    } catch (error: any) {
      console.error('Chatbot error:', error);

      // Log error for debugging
      await admin
        .firestore()
        .collection('chatbot_errors')
        .add({
          userId,
          message,
          error: error.message,
          timestamp: admin.firestore.Timestamp.now(),
        });

      return {
        success: false,
        error: error.message || 'Failed to process message',
      } as ChatResponse;
    }
  }
);
```

---

## 🎨 REACT COMPONENT: Chatbot Widget

### File: `src/components/Chatbot/PublicChatbot.tsx`

```typescript
import React, { useState, useRef, useEffect } from 'react';
import { httpsCallable } from 'firebase/functions';
import { functions } from '@/config/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { v4 as uuidv4 } from 'uuid';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const PublicChatbot: React.FC = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationId] = useState(uuidv4());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || !user) return;

    // Add user message
    const userMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Call Cloud Function
      const processChatFn = httpsCallable(functions, 'processChat');
      const result = await processChatFn({
        userId: user.uid,
        conversationId,
        message: input,
        language: 'en',
      });

      const data = result.data as any;

      if (data.success) {
        const assistantMessage: Message = {
          id: uuidv4(),
          role: 'assistant',
          content: data.response,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again later.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-96 bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div
        className="bg-ubuntu-warm-600 text-white p-4 rounded-t-lg cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-lg font-bold">MNI Assistant</h3>
        <p className="text-sm opacity-90">Chat with us</p>
      </div>

      {/* Chat */}
      {isOpen && (
        <div className="h-96 overflow-y-auto border-b p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              <p>Hi! How can I help you today?</p>
            </div>
          )}

          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs p-3 rounded-lg ${
                  msg.role === 'user'
                    ? 'bg-ubuntu-warm-600 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <p className="text-sm">{msg.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {msg.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 p-3 rounded-lg">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      )}

      {/* Input */}
      {isOpen && (
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type a message..."
              disabled={loading}
              className="flex-1 border rounded px-3 py-2 text-sm"
            />
            <button
              onClick={handleSendMessage}
              disabled={loading || !input.trim()}
              className="bg-ubuntu-warm-600 text-white px-4 py-2 rounded hover:bg-ubuntu-warm-700 disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
```

---

## 📝 KNOWLEDGE BASE SETUP

Add these to `chatbot_knowledge_base` collection:

```typescript
// Document 1: Getting Started
{
  id: "kb_001",
  title: "Getting Started with MNI",
  category: "onboarding",
  content: "Welcome to MNI! Here's how to get started with your account...",
  keywords: ["start", "begin", "new", "account", "setup"],
  isActive: true,
  language: "en"
}

// Document 2: Creating Child Accounts
{
  id: "kb_002",
  title: "Managing Child Accounts",
  category: "account",
  content: "As a parent, you can create accounts for your children...",
  keywords: ["child", "kids", "account", "parental", "control"],
  isActive: true,
  language: "en"
}

// Document 3: Kids Content
{
  id: "kb_003",
  title: "What Kids Can Access",
  category: "kids",
  content: "Child accounts have access to age-appropriate content...",
  keywords: ["kids", "content", "access", "children"],
  isActive: true,
  language: "en"
}
```

---

## 🚀 DEPLOYMENT STEPS

### Step 1: Install Packages

```bash
cd functions
npm install @google/generative-ai firebase-admin firebase-functions
```

### Step 2: Deploy Cloud Function

```bash
firebase deploy --only functions:processChat
```

### Step 3: Test Function

```bash
# In browser console or with curl
const processChatFn = httpsCallable(functions, 'processChat');
const result = await processChatFn({
  userId: 'test_user',
  conversationId: 'conv_001',
  message: 'How do I create a child account?',
  language: 'en'
});
console.log(result.data);
```

---

## ✅ IMPLEMENTATION CHECKLIST

```
☐ Firestore collections created (8 total)
☐ Security rules deployed
☐ chatbotService.ts created
☐ Cloud Function deployed (processChat)
☐ React component created (PublicChatbot.tsx)
☐ Knowledge base populated with 3+ articles
☐ Environment variables configured
☐ Testing complete
☐ Build passes (0 errors)
☐ Tested with real user interactions
```

---

## 🎯 SUCCESS METRICS

By completion of Week 6:

```
✅ Chatbot responds to queries in <2 seconds
✅ 80%+ query resolution rate
✅ 0 API errors
✅ Conversation history saved
✅ Multi-language support functional
✅ User satisfaction > 4.0/5
```

---

**Status**: 📋 READY TO IMPLEMENT  
**Next**: Deploy this week!

---

*Last Updated: October 30, 2025*  
*Google Gemini Integration: COMPLETE SPECIFICATION*

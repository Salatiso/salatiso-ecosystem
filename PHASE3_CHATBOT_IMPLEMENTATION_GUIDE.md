# PHASE 3.2: AI-POWERED CHATBOT INTEGRATION - IMPLEMENTATION GUIDE

**Status**: Implementation Guide  
**Estimated Duration**: 4 weeks  
**Target Start**: Week 13  
**Last Updated**: October 30, 2025

---

## 📋 EXECUTIVE SUMMARY

This guide details the implementation of a comprehensive AI chatbot system supporting:
- **Public Site Chatbot**: Welcome guide for visitors
- **Dashboard Assistant**: In-app help and troubleshooting
- **Context-Aware Help**: Module-specific guidance
- **Multilingual Support**: Full i18n integration

---

## 🏗️ ARCHITECTURE

### System Components

```
┌─────────────────────────────────────────────────┐
│          ChatBot System Architecture            │
├─────────────────────────────────────────────────┤
│                                                 │
│  1. AI Provider Layer (OpenAI)                 │
│     ├─ GPT-4 Turbo API                        │
│     ├─ Embeddings API (text-embedding-ada)   │
│     └─ Vision API (future)                    │
│                                                 │
│  2. Vector Database Layer (Pinecone)          │
│     ├─ Knowledge base embeddings              │
│     ├─ Similarity search                      │
│     └─ Metadata filtering                     │
│                                                 │
│  3. Context Management Layer                  │
│     ├─ User context extraction                │
│     ├─ Conversation history                   │
│     ├─ Memory management                      │
│     └─ Session management                     │
│                                                 │
│  4. Chatbot Service Layer                     │
│     ├─ Request processing                     │
│     ├─ RAG (Retrieval-Augmented Generation)  │
│     ├─ Response generation                    │
│     └─ Error handling                         │
│                                                 │
│  5. UI Layer                                  │
│     ├─ Public Site Widget                     │
│     ├─ Dashboard Assistant                    │
│     └─ Mobile Responsive                      │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Technology Stack

**Core AI/ML**
- OpenAI GPT-4 Turbo (primary model)
- Text Embedding Ada (embeddings)
- Pinecone (vector database)

**Backend**
- Node.js/Firebase Cloud Functions
- Python for knowledge base processing
- Redis for caching

**Frontend**
- React with TypeScript
- TailwindCSS for styling
- Socket.io for real-time updates (optional)

**Knowledge Base**
- Markdown documentation
- PDF parsing
- Video transcripts

---

## 📚 KNOWLEDGE BASE STRUCTURE

### Knowledge Base Organization

```
knowledge_base/
├── getting_started/
│   ├── welcome.md
│   ├── account_setup.md
│   ├── first_login.md
│   └── feature_overview.md
│
├── modules/
│   ├── governance/
│   │   ├── company_setup.md
│   │   ├── compliance_guide.md
│   │   ├── board_management.md
│   │   └── document_repository.md
│   │
│   ├── human_capital/
│   │   ├── org_structure.md
│   │   ├── role_management.md
│   │   ├── contract_management.md
│   │   ├── performance_reviews.md
│   │   └── development_plans.md
│   │
│   ├── operations/
│   │   ├── project_management.md
│   │   ├── task_tracking.md
│   │   ├── milestone_timeline.md
│   │   ├── knowledge_base.md
│   │   ├── risk_management.md
│   │   └── incident_reporting.md
│   │
│   ├── finance/
│   │   ├── budgeting.md
│   │   ├── expense_tracking.md
│   │   ├── reporting.md
│   │   └── forecasting.md
│   │
│   ├── marketing/
│   │   ├── campaign_management.md
│   │   ├── partnership_management.md
│   │   └── analytics.md
│   │
│   └── reporting/
│       ├── dashboards.md
│       ├── compliance_reports.md
│       ├── audit_logs.md
│       └── export.md
│
├── faq/
│   ├── general_faq.md
│   ├── technical_faq.md
│   ├── billing_faq.md
│   └── support_faq.md
│
├── troubleshooting/
│   ├── login_issues.md
│   ├── permission_issues.md
│   ├── data_issues.md
│   └── integration_issues.md
│
└── video_transcripts/
    ├── getting_started_tour.txt
    ├── module_tours/
    └── feature_tutorials/
```

### Knowledge Base Processing Pipeline

```typescript
interface KnowledgeProcessingPipeline {
  // 1. Document Ingestion
  ingestDocuments: (docs: Document[]) => Promise<void>;
  
  // 2. Chunking
  chunkDocuments: (doc: Document) => Chunk[];
  
  // 3. Embedding Generation
  generateEmbeddings: (chunks: Chunk[]) => Promise<Vector[]>;
  
  // 4. Vector Storage
  storeVectors: (vectors: Vector[]) => Promise<void>;
  
  // 5. Metadata Indexing
  indexMetadata: (chunks: Chunk[]) => Promise<void>;
}

interface Chunk {
  id: string;
  content: string;
  metadata: {
    source: string;
    module?: string;
    section?: string;
    page?: number;
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
  };
  embedding?: number[];
}
```

---

## 🤖 CHATBOT SERVICE IMPLEMENTATION

### chatbotService.ts

```typescript
import { OpenAI } from 'openai';
import { Pinecone } from '@pinecone-database/pinecone';
import * as admin from 'firebase-admin';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatContext {
  userId: string;
  userType: string;
  currentPage?: string;
  userRole?: string;
  conversationHistory: ChatMessage[];
  language: string;
}

interface ChatResponse {
  message: string;
  sources: Source[];
  suggestions: string[];
  confidence: number;
  requiresEscalation: boolean;
}

interface Source {
  title: string;
  section: string;
  url?: string;
  relevance: number;
}

export class ChatbotService {
  private openai: OpenAI;
  private pinecone: Pinecone;
  private cache: Map<string, any>;
  
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    
    this.pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
      environment: process.env.PINECONE_ENV
    });
    
    this.cache = new Map();
  }
  
  /**
   * Process user message and generate response
   */
  async processMessage(
    userMessage: string,
    context: ChatContext
  ): Promise<ChatResponse> {
    try {
      // 1. Extract intent and entities
      const intent = await this.extractIntent(userMessage);
      
      // 2. Retrieve relevant context (RAG)
      const relevantDocs = await this.retrieveRelevantDocuments(
        userMessage,
        context,
        intent
      );
      
      // 3. Build prompt with context
      const prompt = this.buildPrompt(
        userMessage,
        context,
        relevantDocs,
        intent
      );
      
      // 4. Call GPT-4
      const response = await this.callGPT4(
        prompt,
        context.conversationHistory
      );
      
      // 5. Parse and enhance response
      const enhancedResponse = await this.enhanceResponse(
        response,
        relevantDocs,
        context
      );
      
      // 6. Log interaction
      await this.logInteraction(userMessage, enhancedResponse, context);
      
      return enhancedResponse;
    } catch (error) {
      console.error('Chatbot error:', error);
      return this.buildErrorResponse(context);
    }
  }
  
  /**
   * Extract intent and entities from user message
   */
  private async extractIntent(userMessage: string): Promise<Intent> {
    const intentPrompt = `
      Analyze the following user message and extract:
      1. Primary intent (e.g., 'get_help', 'troubleshoot', 'learn_feature')
      2. Entities mentioned (e.g., modules, features)
      3. Urgency level (1-5)
      
      Message: "${userMessage}"
      
      Respond in JSON format.
    `;
    
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [{ role: 'user', content: intentPrompt }],
      temperature: 0.3,
      response_format: { type: 'json_object' }
    });
    
    return JSON.parse(response.choices[0].message.content || '{}');
  }
  
  /**
   * Retrieve relevant documents using semantic search
   */
  private async retrieveRelevantDocuments(
    userMessage: string,
    context: ChatContext,
    intent: Intent
  ): Promise<Chunk[]> {
    // Generate embedding for user message
    const embedding = await this.generateEmbedding(userMessage);
    
    // Filter criteria
    const filter = this.buildVectorFilter(context, intent);
    
    // Search Pinecone
    const pineconeClient = this.pinecone.Index('mni-knowledge-base');
    const results = await pineconeClient.query({
      vector: embedding,
      topK: 5,
      includeMetadata: true,
      filter
    });
    
    // Map results to chunks
    const chunks = results.matches.map(match => ({
      id: match.id,
      content: match.metadata.text,
      metadata: match.metadata as any,
      embedding: match.values,
      score: match.score
    }));
    
    return chunks;
  }
  
  /**
   * Build vector filter based on user context
   */
  private buildVectorFilter(context: ChatContext, intent: Intent): any {
    const filter: any = {
      $and: []
    };
    
    // Filter by language
    if (context.language && context.language !== 'en') {
      filter.$and.push({ language: context.language });
    }
    
    // Filter by module if known
    if (intent.entities.module) {
      filter.$and.push({ module: intent.entities.module });
    }
    
    // Filter by user type
    if (context.userType === 'administrator') {
      // Admin sees all
    } else if (context.userType === 'child') {
      filter.$and.push({ difficulty: { $in: ['beginner', 'intermediate'] } });
    }
    
    return filter.$and.length > 0 ? filter : undefined;
  }
  
  /**
   * Generate embedding for text
   */
  private async generateEmbedding(text: string): Promise<number[]> {
    const response = await this.openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text
    });
    
    return response.data[0].embedding;
  }
  
  /**
   * Build prompt with context and retrieved documents
   */
  private buildPrompt(
    userMessage: string,
    context: ChatContext,
    docs: Chunk[],
    intent: Intent
  ): string {
    const systemPrompt = this.getSystemPrompt(context);
    const contextStr = this.formatDocuments(docs);
    
    return `
${systemPrompt}

RETRIEVED CONTEXT:
${contextStr}

CONVERSATION HISTORY:
${this.formatConversationHistory(context.conversationHistory)}

CURRENT USER MESSAGE:
${userMessage}

RESPONSE:
`;
  }
  
  /**
   * Get system prompt based on user context
   */
  private getSystemPrompt(context: ChatContext): string {
    const basePrompt = `You are MNI Assistant, a helpful AI guide for the MNI platform.

Your responsibilities:
1. Help users navigate features
2. Provide clear, step-by-step instructions
3. Troubleshoot common issues
4. Answer questions about functionality
5. Direct to human support when needed

Context about the user:
- User Type: ${context.userType}
- Current Page: ${context.currentPage || 'unknown'}
- Language: ${context.language}

Guidelines:
- Be concise but helpful
- Use bullet points for steps
- Provide examples when relevant
- Acknowledge limitations
- Offer escalation paths
- Maintain professional tone
- Be culturally sensitive`;

    if (context.userType === 'child') {
      return basePrompt + `

IMPORTANT: This is a child user. Please:
- Use age-appropriate language
- Avoid complex technical jargon
- Encourage learning
- Suggest parental involvement for advanced topics`;
    }

    return basePrompt;
  }
  
  /**
   * Format documents for inclusion in prompt
   */
  private formatDocuments(docs: Chunk[]): string {
    return docs
      .map(
        doc => `
[${doc.metadata.source}]
Title: ${doc.metadata.section || 'General'}
Relevance: ${doc.score?.toFixed(2) || 'N/A'}

${doc.content}
`
      )
      .join('\n---\n');
  }
  
  /**
   * Call GPT-4 with conversation history
   */
  private async callGPT4(
    prompt: string,
    history: ChatMessage[]
  ): Promise<string> {
    const messages: ChatMessage[] = [
      ...history,
      { role: 'user', content: prompt }
    ];
    
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages,
      temperature: 0.7,
      max_tokens: 1000,
      top_p: 0.9
    });
    
    return response.choices[0].message.content || '';
  }
  
  /**
   * Enhance response with sources and suggestions
   */
  private async enhanceResponse(
    gptResponse: string,
    docs: Chunk[],
    context: ChatContext
  ): Promise<ChatResponse> {
    const sources: Source[] = docs.map(doc => ({
      title: doc.metadata.section || 'Documentation',
      section: doc.metadata.source,
      url: this.buildDocumentationUrl(doc),
      relevance: doc.score || 0
    }));
    
    const suggestions = await this.generateSuggestions(gptResponse, context);
    
    const confidence = this.calculateConfidence(gptResponse, docs);
    const requiresEscalation = this.detectEscalationNeeded(gptResponse, context);
    
    return {
      message: gptResponse,
      sources,
      suggestions,
      confidence,
      requiresEscalation
    };
  }
  
  /**
   * Generate follow-up suggestions
   */
  private async generateSuggestions(response: string, context: ChatContext): Promise<string[]> {
    const suggestionPrompt = `
Based on this response, suggest 2-3 natural follow-up questions the user might ask:

Response: ${response}

Provide suggestions as a JSON array of strings.
`;
    
    const result = await this.openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [{ role: 'user', content: suggestionPrompt }],
      temperature: 0.5,
      response_format: { type: 'json_object' }
    });
    
    try {
      const parsed = JSON.parse(result.choices[0].message.content || '{}');
      return parsed.suggestions || [];
    } catch {
      return [];
    }
  }
  
  /**
   * Calculate response confidence
   */
  private calculateConfidence(response: string, docs: Chunk[]): number {
    // Base confidence on number and quality of source documents
    if (docs.length === 0) return 0.3; // Low confidence
    
    const avgScore = docs.reduce((sum, doc) => sum + (doc.score || 0), 0) / docs.length;
    
    // Scale to 0-1
    return Math.min(avgScore, 1);
  }
  
  /**
   * Detect if issue requires human support escalation
   */
  private detectEscalationNeeded(response: string, context: ChatContext): boolean {
    const escalationKeywords = [
      'contact support',
      'reach out to support',
      'human support needed',
      'escalat',
      'technical issue',
      'bug',
      'error'
    ];
    
    return escalationKeywords.some(keyword =>
      response.toLowerCase().includes(keyword)
    );
  }
  
  /**
   * Log interaction for analytics
   */
  private async logInteraction(
    userMessage: string,
    response: ChatResponse,
    context: ChatContext
  ): Promise<void> {
    const db = admin.firestore();
    await db.collection('chatbot_logs').add({
      userId: context.userId,
      userType: context.userType,
      userMessage,
      botResponse: response.message,
      confidence: response.confidence,
      requiresEscalation: response.requiresEscalation,
      sourcesCount: response.sources.length,
      language: context.language,
      timestamp: new Date()
    });
  }
  
  /**
   * Build documentation URL
   */
  private buildDocumentationUrl(doc: Chunk): string {
    const baseUrl = 'https://docs.mni.app';
    const path = doc.metadata.source.replace(/\.md$/, '').replace(/ /g, '_');
    return `${baseUrl}/${path}`;
  }
  
  /**
   * Build error response
   */
  private buildErrorResponse(context: ChatContext): ChatResponse {
    return {
      message: `I encountered an issue processing your request. Please try:
1. Rephrase your question
2. Contact support for immediate help

We apologize for the inconvenience.`,
      sources: [],
      suggestions: ['Contact Support', 'Try a Different Question'],
      confidence: 0,
      requiresEscalation: true
    };
  }
}
```

---

## 💬 UI COMPONENTS

### PublicChatbot.tsx

```typescript
import React, { useState, useRef, useEffect } from 'react';
import { Send, Minimize2, Maximize2, X } from 'lucide-react';
import { chatbotService } from '@/services/chatbotService';

interface PublicChatbotProps {
  position?: 'bottom-right' | 'bottom-left';
  initialMessage?: string;
}

export const PublicChatbot: React.FC<PublicChatbotProps> = ({
  position = 'bottom-right',
  initialMessage = "Hi! I'm here to help. What would you like to know about MNI?"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: initialMessage }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;
    
    // Add user message
    const userMessage: ChatMessage = { role: 'user', content: inputValue };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    try {
      const response = await chatbotService.processMessage(inputValue, {
        userId: 'anonymous',
        userType: 'visitor',
        currentPage: window.location.pathname,
        conversationHistory: messages,
        language: 'en'
      });
      
      const botMessage: ChatMessage = {
        role: 'assistant',
        content: response.message
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const positionClasses = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4'
  };
  
  return (
    <>
      {/* Chat Widget */}
      {isOpen && (
        <div className={`fixed ${positionClasses[position]} w-96 h-96 bg-white rounded-lg shadow-xl flex flex-col z-50`}>
          {/* Header */}
          <div className="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
            <h3 className="font-bold">MNI Assistant</h3>
            <div className="flex gap-2">
              <button onClick={() => setIsOpen(false)} className="hover:bg-blue-700 p-1 rounded">
                <Minimize2 size={18} />
              </button>
            </div>
          </div>
          
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-gray-300 text-gray-900'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-300 px-4 py-2 rounded-lg">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input */}
          <form onSubmit={handleSubmit} className="border-t p-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                <Send size={18} />
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className={`fixed ${positionClasses[position]} bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 z-50`}
          aria-label="Open chatbot"
        >
          💬
        </button>
      )}
    </>
  );
};
```

### DashboardAssistant.tsx

```typescript
export const DashboardAssistant: React.FC = () => {
  const { user } = useAuth();
  const { currentPage } = useDashboardContext();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  
  const handleMessage = async (userMessage: string) => {
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    
    const response = await chatbotService.processMessage(userMessage, {
      userId: user.id,
      userType: user.userType,
      currentPage,
      conversationHistory: messages,
      language: user.preferredLanguage
    });
    
    setMessages(prev => [
      ...prev,
      { role: 'assistant', content: response.message }
    ]);
  };
  
  return (
    <div className="fixed bottom-4 right-4 z-40">
      {isOpen ? (
        <ChatWindow
          messages={messages}
          onMessage={handleMessage}
          onClose={() => setIsOpen(false)}
        />
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full p-3 shadow-lg hover:shadow-xl"
          aria-label="Open assistant"
        >
          ❓
        </button>
      )}
    </div>
  );
};
```

---

## 📊 IMPLEMENTATION TIMELINE

### Week 1: Setup & Knowledge Base
- [ ] OpenAI API setup
- [ ] Pinecone setup
- [ ] Create knowledge base structure
- [ ] Initial document ingestion

### Week 2: Service Implementation
- [ ] Implement chatbotService.ts
- [ ] Vector storage pipeline
- [ ] Caching layer
- [ ] Error handling

### Week 3: Frontend & Integration
- [ ] PublicChatbot component
- [ ] DashboardAssistant component
- [ ] Real-time message display
- [ ] Loading states

### Week 4: Testing & Deployment
- [ ] Unit tests
- [ ] Integration tests
- [ ] E2E testing
- [ ] Production deployment

---

**Next Document**: `PHASE3_MULTILINGUAL_IMPLEMENTATION_GUIDE.md`

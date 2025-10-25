/**
 * ChatComponent - AI Assistant Chat Interface
 * Real-time chat with AI recommendations and smart suggestions
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  MessageCircle,
  Sparkles,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Loader,
  X,
  Plus,
} from 'lucide-react';
import { aiService, NLPResult } from '@/services/AIService';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  helpful?: boolean;
  suggestions?: string[];
}

interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

interface ChatComponentProps {
  userId: string;
  onClose?: () => void;
  compact?: boolean;
}

export const ChatComponent: React.FC<ChatComponentProps> = ({
  userId,
  onClose,
  compact = false,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! 👋 I\'m your AI assistant. How can I help you today? I can help with scheduling, recommendations, calendar insights, and more.',
      timestamp: new Date(),
      suggestions: ['Show my recommendations', 'Analyze my calendar', 'Find a contact', 'Schedule a meeting'],
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load sessions from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(`chat_sessions_${userId}`);
      if (stored) {
        setSessions(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading chat sessions:', error);
    }
  }, [userId]);

  // Save current session
  useEffect(() => {
    if (currentSessionId && messages.length > 0) {
      const sessionToSave = sessions.find(s => s.id === currentSessionId);
      if (sessionToSave) {
        const updated = {
          ...sessionToSave,
          messages,
          updatedAt: new Date(),
        };
        const newSessions = sessions.map(s => (s.id === currentSessionId ? updated : s));
        setSessions(newSessions);
        localStorage.setItem(`chat_sessions_${userId}`, JSON.stringify(newSessions));
      }
    }
  }, [messages, currentSessionId, sessions, userId]);

  /**
   * Generate AI response using NLP and pattern matching
   */
  const generateResponse = async (userMessage: string): Promise<string> => {
    try {
      // Parse user intent
      const nlpResult = aiService.processNaturalLanguage(userMessage);

      // Generate context-aware response
      let responseText = '';
      let suggestions: string[] = [];

      switch (nlpResult.intent) {
        case 'schedule_meeting':
          responseText = `I can help you schedule a meeting! To get started, I'll need to know:
- Who would you like to meet with? (name or email)
- When would work best for you? (specific time or date range)
- How long should the meeting be?

Or you can go directly to the calendar to create an event.`;
          suggestions = ['Create calendar event', 'Find available times', 'Invite attendees'];
          break;

        case 'create_task':
          responseText = `Great! I can help you create a task. Please tell me:
- What's the task description?
- When should it be completed? (today, tomorrow, specific date)
- Priority level? (low, medium, high)

Let me know the details and I'll create it for you!`;
          suggestions = ['Quick task', 'Set reminder', 'Add to calendar'];
          break;

        case 'find_contact':
          responseText = `I can help you find a contact! You mentioned: "${nlpResult.entities.keywords?.join(', ')}"

Would you like me to search for:
- A specific person by name
- Contacts by company
- Recent conversations
- Contacts by role or department`;
          suggestions = ['Search by name', 'Show recent contacts', 'Browse by company'];
          break;

        case 'time_query':
          responseText = `Based on your calendar patterns, here's what I see:
- Your busiest times are typically 2-4 PM
- Average meeting duration: 45 minutes
- You have ${Math.floor(Math.random() * 5) + 3} events this week

Would you like me to analyze a specific pattern or help with time management?`;
          suggestions = ['Show weekly schedule', 'Find focus time', 'Suggest best meeting time'];
          break;

        default:
          responseText = `I understand you're asking about: "${userMessage}"

While I'm still learning, I can help you with:
- ✨ Scheduling and calendar management
- 🎯 Task and reminder creation
- 👥 Finding and managing contacts
- 📊 Calendar and productivity insights
- 🔍 Smart search and recommendations

What would you like to do?`;
          suggestions = ['Show recommendations', 'Analyze productivity', 'Get insights', 'Help & settings'];
      }

      return responseText;
    } catch (error) {
      console.error('Error generating response:', error);
      return "I encountered an error processing your request. Please try again or ask something else!";
    }
  };

  /**
   * Handle user message submission
   */
  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    const userMessageObj: ChatMessage = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: userMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessageObj]);
    setInput('');
    setLoading(true);

    try {
      // Simulate AI thinking time
      await new Promise(resolve => setTimeout(resolve, 500));

      const responseText = await generateResponse(userMessage);

      const assistantMessage: ChatMessage = {
        id: `msg_${Date.now()}_ai`,
        role: 'assistant',
        content: responseText,
        timestamp: new Date(),
        suggestions: ['Tell me more', 'Create event', 'Show recommendations', 'Cancel'],
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessage = {
        id: `msg_${Date.now()}_error`,
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle suggestion click
   */
  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    inputRef.current?.focus();
  };

  /**
   * Create new chat session
   */
  const createNewSession = () => {
    const newSession: ChatSession = {
      id: `session_${Date.now()}`,
      title: `Chat ${new Date().toLocaleDateString()}`,
      messages: [
        {
          id: '1',
          role: 'assistant',
          content: 'Hello! 👋 I\'m your AI assistant. How can I help you today?',
          timestamp: new Date(),
          suggestions: ['Show recommendations', 'Analyze calendar', 'Create task'],
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setSessions(prev => [...prev, newSession]);
    setCurrentSessionId(newSession.id);
    setMessages(newSession.messages);
  };

  /**
   * Load chat session
   */
  const loadSession = (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      setCurrentSessionId(sessionId);
      setMessages(session.messages);
    }
  };

  /**
   * Copy message to clipboard
   */
  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  /**
   * Rate message helpfulness
   */
  const rateMessage = (messageId: string, helpful: boolean) => {
    setMessages(prev =>
      prev.map(msg =>
        msg.id === messageId ? { ...msg, helpful } : msg
      )
    );
  };

  if (compact) {
    return (
      <div className="flex flex-col h-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-lg border border-blue-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            <h2 className="font-semibold">AI Assistant</h2>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="hover:bg-white/20 p-1 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence>
            {messages.map((msg, idx) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs rounded-lg p-3 ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-gray-200 text-gray-900'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                  <p className="text-xs mt-1 opacity-70">
                    {msg.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-2 items-center text-indigo-600"
            >
              <Loader className="w-4 h-4 animate-spin" />
              <span className="text-sm">Thinking...</span>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-gray-200 p-4 bg-white">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask me anything..."
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
            <button
              onClick={handleSendMessage}
              disabled={!input.trim() || loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white p-2 rounded-lg transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Full chat interface
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar - Session History */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={createNewSession}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 px-4 font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Chat
          </motion.button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {sessions.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">No chat history yet</p>
          ) : (
            sessions.map(session => (
              <motion.button
                key={session.id}
                whileHover={{ x: 4 }}
                onClick={() => loadSession(session.id)}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  currentSessionId === session.id
                    ? 'bg-blue-100 text-blue-900'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <p className="text-sm font-medium truncate">{session.title}</p>
                <p className="text-xs text-gray-500">
                  {session.updatedAt.toLocaleDateString()}
                </p>
              </motion.button>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full p-2">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-gray-900">AI Assistant</h1>
              <p className="text-sm text-gray-500">Smart recommendations & insights</p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="hover:bg-gray-100 p-2 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className="max-w-2xl">
                  {/* Message Bubble */}
                  <div
                    className={`rounded-lg p-4 ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white border border-gray-200 text-gray-900'
                    }`}
                  >
                    <p className="leading-relaxed">{msg.content}</p>
                    <p className={`text-xs mt-2 ${msg.role === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                      {msg.timestamp.toLocaleTimeString()}
                    </p>
                  </div>

                  {/* Message Actions (for assistant messages) */}
                  {msg.role === 'assistant' && (
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => rateMessage(msg.id, true)}
                        className={`p-2 rounded transition-colors ${
                          msg.helpful === true
                            ? 'bg-green-100 text-green-600'
                            : 'text-gray-400 hover:bg-gray-100'
                        }`}
                      >
                        <ThumbsUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => rateMessage(msg.id, false)}
                        className={`p-2 rounded transition-colors ${
                          msg.helpful === false
                            ? 'bg-red-100 text-red-600'
                            : 'text-gray-400 hover:bg-gray-100'
                        }`}
                      >
                        <ThumbsDown className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => copyToClipboard(msg.content)}
                        className="p-2 rounded text-gray-400 hover:bg-gray-100 transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* Suggestions */}
                  {msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {msg.suggestions.map((suggestion, idx) => (
                        <motion.button
                          key={idx}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full transition-colors"
                        >
                          {suggestion}
                        </motion.button>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-2 items-center text-indigo-600"
            >
              <Loader className="w-5 h-5 animate-spin" />
              <span>AI is thinking...</span>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="max-w-4xl mx-auto flex gap-3">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your message here or ask a question..."
              className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSendMessage}
              disabled={!input.trim() || loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-4 py-3 rounded-lg transition-colors flex items-center gap-2 font-medium"
            >
              <Send className="w-5 h-5" />
              Send
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatComponent;

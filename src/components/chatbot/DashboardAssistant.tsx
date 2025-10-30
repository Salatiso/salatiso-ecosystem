'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { db, auth } from '@/lib/firebase';
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
  doc,
} from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import permissionService from '@/services/permissionService';
import roleService from '@/services/roleService';
import contentFilterService from '@/services/contentFilterService';
import ageRoutingService from '@/services/ageRoutingService';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ConversationSession {
  id: string;
  userId: string;
  page: string;
  topic: string;
  messages: Message[];
  startedAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

interface ContextualHelp {
  page: string;
  topic: string;
  helpText: string;
  suggestions: string[];
}

const PAGE_HELP_CONTEXT: Record<string, ContextualHelp> = {
  dashboard: {
    page: 'dashboard',
    topic: 'Dashboard Overview',
    helpText:
      'Welcome to your dashboard! Here you can manage your profile, view activity, and access all features.',
    suggestions: [
      'How do I update my profile?',
      'What does the activity feed show?',
      'How can I manage contacts?',
      'How do I change my settings?',
    ],
  },
  contacts: {
    page: 'contacts',
    topic: 'Contact Management',
    helpText:
      'Manage your contacts efficiently. Import from CSV, organize by categories, and track interactions.',
    suggestions: [
      'How do I import contacts?',
      'Can I export my contacts?',
      'How do I organize contacts by category?',
      'How do I delete a contact?',
    ],
  },
  profile: {
    page: 'profile',
    topic: 'Profile Settings',
    helpText:
      'Customize your profile information and manage your account settings.',
    suggestions: [
      'How do I update my personal information?',
      'How do I change my password?',
      'How do I add a profile picture?',
      'How do I manage privacy settings?',
    ],
  },
  training: {
    page: 'training',
    topic: 'Training Hub',
    helpText: 'Access training materials and educational resources to improve your skills.',
    suggestions: [
      'What training courses are available?',
      'How do I enroll in a course?',
      'Can I download training materials?',
      'How do I track my progress?',
    ],
  },
  'activity-feed': {
    page: 'activity-feed',
    topic: 'Activity Feed',
    helpText:
      'View your recent activities and track changes made to your account and contacts.',
    suggestions: [
      'What activities are logged?',
      'Can I filter activity by type?',
      'How long is activity history kept?',
      'Can I export activity logs?',
    ],
  },
};

const DashboardAssistant: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [user] = useAuthState(auth);
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Determine current page from pathname
  useEffect(() => {
    const pageMap: Record<string, string> = {
      '/dashboard': 'dashboard',
      '/contacts': 'contacts',
      '/profile': 'profile',
      '/training': 'training',
      '/activity-feed': 'activity-feed',
    };

    const page = Object.keys(pageMap).find((key) => pathname.startsWith(key));
    if (page) {
      setCurrentPage(pageMap[page]);
    }
  }, [pathname]);

  // Initialize user role
  useEffect(() => {
    const initializeRole = async () => {
      if (user) {
        try {
          const primaryRole = await roleService.getUserPrimaryRole(user.uid);
          if (primaryRole) {
            setUserRole(primaryRole.id);
          }
        } catch (error) {
          console.error('Error loading user role:', error);
        }
      }
    };

    initializeRole();
  }, [user]);

  // Load existing conversation or create new one
  useEffect(() => {
    const initializeSession = async () => {
      if (!user) return;

      try {
        // Query for existing active session
        const q = query(
          collection(db, 'chatbot_conversations'),
          where('userId', '==', user.uid),
          where('page', '==', currentPage),
          where('isActive', '==', true),
          orderBy('updatedAt', 'desc'),
          limit(1)
        );

        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          const doc = snapshot.docs[0];
          setSessionId(doc.id);
          // Load recent messages
          const conversationData = doc.data();
          if (conversationData.messages && Array.isArray(conversationData.messages)) {
            setMessages(
              conversationData.messages.map(
                (msg: {
                  role: 'user' | 'assistant';
                  content: string;
                  timestamp: Timestamp;
                }) => ({
                  id: `${msg.timestamp.toMillis()}`,
                  role: msg.role,
                  content: msg.content,
                  timestamp: msg.timestamp.toDate(),
                })
              )
            );
          }
        } else {
          // Create new session
          const newSession = await addDoc(collection(db, 'chatbot_conversations'), {
            userId: user.uid,
            page: currentPage,
            topic: PAGE_HELP_CONTEXT[currentPage]?.topic || 'General Help',
            messages: [],
            startedAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
            isActive: true,
          });
          setSessionId(newSession.id);
          setMessages([]);
        }
      } catch (error) {
        console.error('Error initializing session:', error);
      }
    };

    if (isOpen && user) {
      initializeSession();
    }
  }, [isOpen, user, currentPage]);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send message to Cloud Function
  const sendMessage = useCallback(
    async (userMessage: string) => {
      if (!user || !sessionId || !userMessage.trim()) return;

      try {
        setIsLoading(true);
        const userMsg: Message = {
          id: `${Date.now()}`,
          role: 'user',
          content: userMessage,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        // Call Cloud Function
        const response = await fetch(
          process.env.NEXT_PUBLIC_CLOUD_FUNCTION_URL || 'http://localhost:5001/salatiso-lifecv/us-central1/processChat',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${await user.getIdToken()}`,
            },
            body: JSON.stringify({
              message: userMessage,
              conversationId: sessionId,
              userId: user.uid,
              page: currentPage,
              userRole: userRole || 'user',
              context: PAGE_HELP_CONTEXT[currentPage] || PAGE_HELP_CONTEXT.dashboard,
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`Cloud Function error: ${response.statusText}`);
        }

        const data = await response.json();
        const assistantMsg: Message = {
          id: `${Date.now()}-assistant`,
          role: 'assistant',
          content: data.reply || 'I encountered an issue processing your request. Please try again.',
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, assistantMsg]);

        // Update session in Firestore
        if (sessionId) {
          await updateDoc(doc(db, 'chatbot_conversations', sessionId), {
            messages: [
              ...messages,
              {
                role: userMsg.role,
                content: userMsg.content,
                timestamp: Timestamp.fromDate(userMsg.timestamp),
              },
              {
                role: assistantMsg.role,
                content: assistantMsg.content,
                timestamp: Timestamp.fromDate(assistantMsg.timestamp),
              },
            ],
            updatedAt: Timestamp.now(),
          });
        }
      } catch (error) {
        console.error('Error sending message:', error);
        const errorMsg: Message = {
          id: `${Date.now()}-error`,
          role: 'assistant',
          content:
            'Sorry, I encountered an error. Please try again or contact support if the problem persists.',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMsg]);
      } finally {
        setIsLoading(false);
        setIsTyping(false);
      }
    },
    [user, sessionId, messages, currentPage, userRole]
  );

  // Handle keyboard submit
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  // Get contextual help text
  const contextHelp = PAGE_HELP_CONTEXT[currentPage] || PAGE_HELP_CONTEXT.dashboard;

  if (!user) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Minimized Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200"
          aria-label="Open assistant"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5-4a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && !isMinimized && (
        <div className="bg-white rounded-lg shadow-2xl w-80 sm:w-96 h-96 flex flex-col border border-gray-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-sm">{contextHelp.topic}</h3>
              <p className="text-xs opacity-90">Context-aware assistance</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setIsMinimized(true)}
                className="hover:bg-blue-700 p-1 rounded transition-colors"
                aria-label="Minimize"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 12H4"
                  />
                </svg>
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setIsMinimized(false);
                }}
                className="hover:bg-blue-700 p-1 rounded transition-colors"
                aria-label="Close"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Initial Help View */}
          {messages.length === 0 && (
            <div className="flex-1 overflow-y-auto p-4 flex flex-col justify-center items-center text-center">
              <div className="mb-4">
                <svg
                  className="w-16 h-16 mx-auto text-blue-400 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">{contextHelp.helpText}</h4>
              <p className="text-xs text-gray-500 mb-4">Try asking:</p>
              <div className="space-y-2">
                {contextHelp.suggestions.slice(0, 2).map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => sendMessage(suggestion)}
                    className="text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 p-2 rounded transition-colors w-full text-left"
                  >
                    "{suggestion}"
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          {messages.length > 0 && (
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
                      msg.role === 'user'
                        ? 'bg-blue-500 text-white rounded-br-none'
                        : 'bg-gray-100 text-gray-800 rounded-bl-none'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg rounded-bl-none text-sm flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}

          {/* Input */}
          <div className="border-t border-gray-200 p-3 bg-gray-50 rounded-b-lg">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything..."
                disabled={isLoading}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={isLoading || !input.trim()}
                className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white px-3 py-2 rounded-lg text-sm transition-colors"
                aria-label="Send message"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Minimized State */}
      {isOpen && isMinimized && (
        <div className="bg-white rounded-lg shadow-lg p-3 border border-gray-200">
          <button
            onClick={() => setIsMinimized(false)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 12h16m-8-8v16"
              />
            </svg>
            {contextHelp.topic}
          </button>
        </div>
      )}
    </div>
  );
};

export default DashboardAssistant;

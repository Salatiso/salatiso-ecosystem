'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
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

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface PublicChatbotProps {
  widgetPosition?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  theme?: 'light' | 'dark' | 'gradient';
  headerTitle?: string;
  placeholder?: string;
  floatingButtonSize?: 'small' | 'medium' | 'large';
}

const PublicChatbot: React.FC<PublicChatbotProps> = ({
  widgetPosition = 'bottom-right',
  theme = 'gradient',
  headerTitle = 'Salatiso Assistant',
  placeholder = 'How can we help?',
  floatingButtonSize = 'medium',
}) => {
  const [user] = useAuthState(auth);
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Position classes
  const positionClasses: Record<string, string> = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
  };

  // Theme classes
  const themeClasses = {
    light: {
      button: 'bg-white text-blue-600 border-2 border-blue-600 hover:border-blue-700',
      header: 'bg-white text-gray-800 border-b border-gray-200',
      userMsg: 'bg-blue-500 text-white',
      assistantMsg: 'bg-gray-100 text-gray-800',
    },
    dark: {
      button: 'bg-gray-800 text-white hover:bg-gray-900',
      header: 'bg-gray-800 text-white',
      userMsg: 'bg-blue-500 text-white',
      assistantMsg: 'bg-gray-700 text-gray-100',
    },
    gradient: {
      button: 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white',
      header: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white',
      userMsg: 'bg-blue-500 text-white',
      assistantMsg: 'bg-gray-100 text-gray-800',
    },
  };

  const currentTheme = themeClasses[theme];
  const buttonSizeClasses = {
    small: 'w-12 h-12',
    medium: 'w-14 h-14',
    large: 'w-16 h-16',
  };

  // Initialize conversation session
  useEffect(() => {
    const initializeSession = async () => {
      try {
        // Use anonymous session ID for public users
        const sessionKey = user?.uid || `anonymous-${Math.random().toString(36).substr(2, 9)}`;

        const q = query(
          collection(db, 'chatbot_conversations'),
          where('userId', '==', sessionKey),
          where('page', '==', 'public'),
          where('isActive', '==', true),
          orderBy('updatedAt', 'desc'),
          limit(1)
        );

        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          const doc = snapshot.docs[0];
          setSessionId(doc.id);
          const conversationData = doc.data();
          if (conversationData.messages && Array.isArray(conversationData.messages)) {
            const loadedMessages = conversationData.messages.map(
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
            );
            setMessages(loadedMessages);
            setUnreadCount(0);
          }
        } else {
          // Create new session
          const newSession = await addDoc(collection(db, 'chatbot_conversations'), {
            userId: sessionKey,
            page: 'public',
            topic: 'Public Chat',
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

    if (isOpen) {
      initializeSession();
    }
  }, [isOpen, user]);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Track unread messages when minimized
  useEffect(() => {
    if (isMinimized && isTyping) {
      setUnreadCount((prev) => prev + 1);
    }
  }, [isTyping, isMinimized]);

  // Send message
  const sendMessage = useCallback(
    async (userMessage: string) => {
      if (!sessionId || !userMessage.trim()) return;

      try {
        setIsLoading(true);
        setUnreadCount(0);

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
        const idToken = user ? await user.getIdToken() : 'public';
        const response = await fetch(
          process.env.NEXT_PUBLIC_CLOUD_FUNCTION_URL ||
            'http://localhost:5001/salatiso-lifecv/us-central1/processChat',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${idToken}`,
            },
            body: JSON.stringify({
              message: userMessage,
              conversationId: sessionId,
              userId: user?.uid || 'public-user',
              page: 'public',
              isPublic: true,
              context: {
                page: 'public',
                topic: 'General Assistance',
                helpText: 'How can Salatiso help you today?',
              },
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
          content:
            data.reply ||
            'I apologize, but I encountered an issue. Please try again or contact support.',
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, assistantMsg]);

        // Update session in Firestore
        if (sessionId) {
          const sessionKey = user?.uid || `anonymous-${Math.random().toString(36).substr(2, 9)}`;
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
    [sessionId, user, messages]
  );

  // Handle keyboard submit
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  // Handle opening widget
  const handleOpen = () => {
    setIsOpen(true);
    setIsMinimized(false);
    setUnreadCount(0);
  };

  return (
    <div className={`fixed ${positionClasses[widgetPosition]} z-50`}>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={handleOpen}
          className={`${buttonSizeClasses[floatingButtonSize]} ${currentTheme.button} rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 relative`}
          aria-label="Open chat"
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
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>

          {/* Unread badge */}
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>
      )}

      {/* Chat Window */}
      {isOpen && !isMinimized && (
        <div className="bg-white rounded-2xl shadow-2xl w-80 sm:w-96 h-screen sm:h-96 flex flex-col border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className={`${currentTheme.header} px-4 py-4 flex justify-between items-center`}>
            <div>
              <h3 className="font-semibold text-sm">{headerTitle}</h3>
              <p className="text-xs opacity-75">Always here to help</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setIsMinimized(true);
                  setUnreadCount(0);
                }}
                className="hover:opacity-80 p-1 rounded transition-opacity"
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
                onClick={() => setIsOpen(false)}
                className="hover:opacity-80 p-1 rounded transition-opacity"
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

          {/* Welcome Message */}
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
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Welcome!</h4>
              <p className="text-sm text-gray-600 mb-4">
                Ask me anything about Salatiso or how we can help you.
              </p>
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
                        ? `${currentTheme.userMsg} rounded-br-none`
                        : `${currentTheme.assistantMsg} rounded-bl-none`
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className={`${currentTheme.assistantMsg} px-4 py-2 rounded-lg rounded-bl-none text-sm flex gap-1`}>
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
          <div className="border-t border-gray-200 p-3 bg-gray-50">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={placeholder}
                disabled={isLoading}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={isLoading || !input.trim()}
                className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white px-3 py-2 rounded-lg text-sm transition-colors"
                aria-label="Send"
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
        <div className={`${currentTheme.header} rounded-lg shadow-lg p-3 border border-gray-200 cursor-pointer hover:shadow-xl transition-shadow`}
          onClick={() => {
            setIsMinimized(false);
            setUnreadCount(0);
          }}
        >
          <div className="flex items-center justify-between">
            <span className="font-semibold text-sm">{headerTitle}</span>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold rounded-full px-2 py-1">
                {unreadCount}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicChatbot;

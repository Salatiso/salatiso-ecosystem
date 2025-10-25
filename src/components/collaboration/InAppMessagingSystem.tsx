/**
 * InAppMessagingSystem Component - Phase 4.7 Collaboration
 * Real-time messaging between team members
 * Message threads, read status, typing indicators
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, Users, Search, MoreVertical, Pin, Archive } from 'lucide-react';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: Date;
  readBy: string[];
  isEdited: boolean;
}

interface Conversation {
  id: string;
  name: string;
  type: 'direct' | 'group';
  members: string[];
  lastMessage?: Message;
  unreadCount: number;
  isPinned: boolean;
  isArchived: boolean;
}

interface InAppMessagingSystemProps {
  currentUserId?: string;
  onSendMessage?: (conversationId: string, message: string) => void;
}

/**
 * Message display component
 */
const MessageBubble: React.FC<{ message: Message; isOwn: boolean }> = ({ message, isOwn }) => {
  const readCountText = message.readBy.length === 0 ? 'Sent' : `Read by ${message.readBy.length}`;
  
  return (
    <div className={`flex gap-3 mb-3 ${isOwn ? 'flex-row-reverse' : ''}`}>
      {!isOwn && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
          {message.senderName.charAt(0)}
        </div>
      )}
      <div className={`flex-1 ${isOwn ? 'text-right' : ''}`}>
        {!isOwn && (
          <p className="text-xs font-semibold text-gray-700 mb-1">{message.senderName}</p>
        )}
        <div
          className={`inline-block px-4 py-2 rounded-lg max-w-md ${
            isOwn
              ? 'bg-blue-600 text-white rounded-br-none'
              : 'bg-gray-100 text-gray-900 rounded-bl-none'
          }`}
        >
          <p className="text-sm leading-relaxed">{message.content}</p>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          {isOwn && ` • ${readCountText}`}
        </p>
      </div>
    </div>
  );
};

/**
 * Conversation list item
 */
const ConversationItem: React.FC<{
  conv: Conversation;
  isActive: boolean;
  onClick: () => void;
}> = ({ conv, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-3 rounded-lg mb-2 transition-colors ${
        isActive
          ? 'bg-blue-100 border border-blue-300'
          : 'hover:bg-gray-100 border border-transparent'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className={`font-semibold text-gray-900 truncate ${conv.isPinned ? 'flex items-center gap-1' : ''}`}>
            {conv.isPinned && <Pin className="w-3 h-3 text-yellow-600" />}
            {conv.name}
          </p>
          <p className="text-sm text-gray-600 truncate">
            {conv.lastMessage?.content || 'No messages yet'}
          </p>
        </div>
        {conv.unreadCount > 0 && (
          <div className="w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold flex-shrink-0">
            {conv.unreadCount > 9 ? '9+' : conv.unreadCount}
          </div>
        )}
      </div>
    </button>
  );
};

export const InAppMessagingSystem: React.FC<InAppMessagingSystemProps> = ({
  currentUserId = 'user-123',
  onSendMessage,
}) => {
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: 'conv-1',
      name: 'Escalation Team',
      type: 'group',
      members: ['user-123', 'user-456', 'user-789'],
      unreadCount: 3,
      isPinned: true,
      isArchived: false,
      lastMessage: {
        id: 'msg-1',
        senderId: 'user-456',
        senderName: 'Sarah Johnson',
        content: 'The escalation issue has been resolved',
        timestamp: new Date(Date.now() - 5 * 60000),
        readBy: [],
        isEdited: false,
      },
    },
    {
      id: 'conv-2',
      name: 'Emma Rodriguez',
      type: 'direct',
      members: ['user-123', 'user-789'],
      unreadCount: 1,
      isPinned: false,
      isArchived: false,
      lastMessage: {
        id: 'msg-2',
        senderId: 'user-789',
        senderName: 'Emma Rodriguez',
        content: 'Got the update, thanks!',
        timestamp: new Date(Date.now() - 15 * 60000),
        readBy: ['user-123'],
        isEdited: false,
      },
    },
    {
      id: 'conv-3',
      name: 'Operations',
      type: 'group',
      members: ['user-123', 'user-012', 'user-345'],
      unreadCount: 0,
      isPinned: false,
      isArchived: false,
      lastMessage: {
        id: 'msg-3',
        senderId: 'user-123',
        senderName: 'You',
        content: 'Let me check on that for you',
        timestamp: new Date(Date.now() - 1 * 60000),
        readBy: ['user-012', 'user-345'],
        isEdited: false,
      },
    },
  ]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-1',
      senderId: 'user-456',
      senderName: 'Sarah Johnson',
      content: 'Hey team, we have a critical escalation incoming',
      timestamp: new Date(Date.now() - 30 * 60000),
      readBy: ['user-123'],
      isEdited: false,
    },
    {
      id: 'msg-2',
      senderId: 'user-123',
      senderName: 'You',
      content: 'Got it. I\'ll start investigating',
      timestamp: new Date(Date.now() - 25 * 60000),
      readBy: ['user-456'],
      isEdited: false,
    },
    {
      id: 'msg-3',
      senderId: 'user-789',
      senderName: 'Emma Rodriguez',
      content: 'I found the issue! It\'s in the API response parsing',
      timestamp: new Date(Date.now() - 10 * 60000),
      readBy: ['user-123', 'user-456'],
      isEdited: false,
    },
    {
      id: 'msg-4',
      senderId: 'user-456',
      senderName: 'Sarah Johnson',
      content: 'The escalation issue has been resolved',
      timestamp: new Date(Date.now() - 5 * 60000),
      readBy: [],
      isEdited: false,
    },
  ]);

  const [activeConversationId, setActiveConversationId] = useState('conv-1');
  const [messageInput, setMessageInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: currentUserId,
      senderName: 'You',
      content: messageInput,
      timestamp: new Date(),
      readBy: [],
      isEdited: false,
    };

    setMessages([...messages, newMessage]);
    onSendMessage?.(activeConversationId, messageInput);
    setMessageInput('');
    setIsTyping(false);
  };

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeConversation = conversations.find(c => c.id === activeConversationId);

  return (
    <div className="flex gap-6 h-screen max-h-[calc(100vh-200px)] bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Conversation List */}
      <div className="w-80 border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <MessageCircle className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">Messages</h2>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto p-4">
          {filteredConversations.length > 0 ? (
            filteredConversations.map(conv => (
              <ConversationItem
                key={conv.id}
                conv={conv}
                isActive={conv.id === activeConversationId}
                onClick={() => setActiveConversationId(conv.id)}
              />
            ))
          ) : (
            <p className="text-center text-gray-600 py-8">No conversations found</p>
          )}
        </div>

        {/* New Conversation */}
        <div className="p-4 border-t border-gray-200">
          <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center justify-center gap-2">
            <Users className="w-4 h-4" />
            New Conversation
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {activeConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{activeConversation.name}</h3>
                <p className="text-sm text-gray-600">
                  {activeConversation.type === 'group'
                    ? `${activeConversation.members.length} members`
                    : 'Direct message'}
                </p>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <MoreVertical className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
              {messages.map(msg => (
                <MessageBubble
                  key={msg.id}
                  message={msg}
                  isOwn={msg.senderId === currentUserId}
                />
              ))}

              {isTyping && (
                <div className="flex gap-2 items-center mb-3">
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                    <span className="text-xs">…</span>
                  </div>
                  <div className="text-xs text-gray-600">Someone is typing</div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-6 border-t border-gray-200 bg-white">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => {
                    setMessageInput(e.target.value);
                    setIsTyping(e.target.value.length > 0);
                  }}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium transition-colors"
                >
                  <Send className="w-4 h-4" />
                  Send
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-600">
            <p>Select a conversation to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
};

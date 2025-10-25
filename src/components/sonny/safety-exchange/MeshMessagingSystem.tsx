import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageCircle, Check, CheckCheck, Clock, MapPin, AlertTriangle, Users, Wifi, WifiOff } from 'lucide-react';

// ============================================================================
// MESH MESSAGING SYSTEM COMPONENT
// ============================================================================

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  recipientId: string | null; // null = broadcast
  type: 'TEXT' | 'LOCATION' | 'CHECK_IN' | 'EMERGENCY';
  content: string;
  timestamp: number;
  isPostbox: boolean;
  hopCount: number;
  maxHops: number;
  deliveryStatus: 'sending' | 'sent' | 'delivered' | 'read';
  location?: {
    lat: number;
    lng: number;
  };
}

interface MeshMessagingSystemProps {
  familyMembers: any[];
  currentUserId: string;
  onSendMessage?: (message: Omit<Message, 'id' | 'timestamp' | 'deliveryStatus'>) => void;
}

const MeshMessagingSystem: React.FC<MeshMessagingSystemProps> = ({
  familyMembers,
  currentUserId,
  onSendMessage
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const [selectedRecipient, setSelectedRecipient] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'TEXT' | 'LOCATION' | 'CHECK_IN' | 'EMERGENCY'>('TEXT');
  const [isBroadcast, setIsBroadcast] = useState(false);
  const [meshStatus, setMeshStatus] = useState<'online' | 'offline' | 'degraded'>('online');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock messages for demonstration
  useEffect(() => {
    const mockMessages: Message[] = [
      {
        id: '1',
        senderId: 'user-123',
        senderName: 'Sarah Johnson',
        recipientId: currentUserId,
        type: 'TEXT',
        content: 'Just checking in - everything okay?',
        timestamp: Date.now() - 3600000,
        isPostbox: false,
        hopCount: 1,
        maxHops: 3,
        deliveryStatus: 'read'
      },
      {
        id: '2',
        senderId: currentUserId,
        senderName: 'You',
        recipientId: 'user-123',
        type: 'CHECK_IN',
        content: 'All good here! Safety check-in completed.',
        timestamp: Date.now() - 1800000,
        isPostbox: false,
        hopCount: 1,
        maxHops: 3,
        deliveryStatus: 'delivered'
      },
      {
        id: '3',
        senderId: 'user-456',
        senderName: 'Michael Chen',
        recipientId: null, // broadcast
        type: 'EMERGENCY',
        content: 'Family emergency alert: Please check in immediately',
        timestamp: Date.now() - 900000,
        isPostbox: true,
        hopCount: 2,
        maxHops: 5,
        deliveryStatus: 'delivered'
      }
    ];
    setMessages(mockMessages);
  }, [currentUserId]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!messageText.trim()) return;

    const newMessage: Omit<Message, 'id' | 'timestamp' | 'deliveryStatus'> = {
      senderId: currentUserId,
      senderName: 'You',
      recipientId: isBroadcast ? null : selectedRecipient,
      type: messageType,
      content: messageText,
      isPostbox: isBroadcast,
      hopCount: 1,
      maxHops: isBroadcast ? 5 : 3
    };

    // Add to local messages with sending status
    const messageWithId: Message = {
      ...newMessage,
      id: `msg-${Date.now()}`,
      timestamp: Date.now(),
      deliveryStatus: 'sending'
    };

    setMessages(prev => [...prev, messageWithId]);

    // Simulate delivery
    setTimeout(() => {
      setMessages(prev => prev.map(msg =>
        msg.id === messageWithId.id
          ? { ...msg, deliveryStatus: 'sent' as const }
          : msg
      ));

      setTimeout(() => {
        setMessages(prev => prev.map(msg =>
          msg.id === messageWithId.id
            ? { ...msg, deliveryStatus: 'delivered' as const }
            : msg
        ));
      }, 1000);
    }, 500);

    if (onSendMessage) {
      onSendMessage(newMessage);
    }

    setMessageText('');
  };

  const handleLocationShare = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const locationMessage = `📍 Location shared: ${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`;
          setMessageText(locationMessage);
          setMessageType('LOCATION');
        },
        (error) => {
          alert('Location access denied. Please enable location services.');
        }
      );
    }
  };

  const handleEmergencyBroadcast = () => {
    setMessageText('🚨 EMERGENCY: Immediate assistance required!');
    setMessageType('EMERGENCY');
    setIsBroadcast(true);
    setSelectedRecipient(null);
  };

  const getMessageTypeIcon = (type: Message['type']) => {
    switch (type) {
      case 'LOCATION': return <MapPin className="h-4 w-4" />;
      case 'CHECK_IN': return <Check className="h-4 w-4" />;
      case 'EMERGENCY': return <AlertTriangle className="h-4 w-4" />;
      default: return <MessageCircle className="h-4 w-4" />;
    }
  };

  const getMessageTypeColor = (type: Message['type']) => {
    switch (type) {
      case 'EMERGENCY': return 'text-red-600 bg-red-50 border-red-200';
      case 'LOCATION': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'CHECK_IN': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getDeliveryStatusIcon = (status: Message['deliveryStatus']) => {
    switch (status) {
      case 'sending': return <Clock className="h-3 w-3 text-gray-400" />;
      case 'sent': return <Check className="h-3 w-3 text-gray-500" />;
      case 'delivered': return <CheckCheck className="h-3 w-3 text-blue-500" />;
      case 'read': return <CheckCheck className="h-3 w-3 text-green-500" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {/* Header with Mesh Status */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Mesh Messaging</h3>
        <div className="flex items-center space-x-2">
          {meshStatus === 'online' ? (
            <Wifi className="h-4 w-4 text-green-500" />
          ) : (
            <WifiOff className="h-4 w-4 text-red-500" />
          )}
          <span className={`text-sm font-medium ${
            meshStatus === 'online' ? 'text-green-600' :
            meshStatus === 'degraded' ? 'text-yellow-600' : 'text-red-600'
          }`}>
            {meshStatus === 'online' ? 'Connected' :
             meshStatus === 'degraded' ? 'Degraded' : 'Offline'}
          </span>
        </div>
      </div>

      {/* Messages Display */}
      <div className="bg-gray-50 rounded-lg p-4 mb-4 max-h-96 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <MessageCircle className="h-12 w-12 mx-auto mb-2 text-gray-300" />
            <p>No messages yet</p>
            <p className="text-sm">Send your first mesh message below</p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.senderId === currentUserId
                      ? 'bg-indigo-600 text-white'
                      : getMessageTypeColor(message.type)
                  }`}
                >
                  {/* Message Header */}
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-1">
                      {getMessageTypeIcon(message.type)}
                      <span className="text-xs font-medium">
                        {message.senderId === currentUserId ? 'You' : message.senderName}
                      </span>
                      {message.recipientId === null && (
                        <Users className="h-3 w-3 text-gray-500" />
                      )}
                    </div>
                    <div className="flex items-center space-x-1">
                      {getDeliveryStatusIcon(message.deliveryStatus)}
                      <span className="text-xs opacity-75">
                        {new Date(message.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Message Content */}
                  <p className="text-sm">{message.content}</p>

                  {/* Postbox Info */}
                  {message.isPostbox && (
                    <div className="text-xs opacity-75 mt-1">
                      📡 Hop {message.hopCount}/{message.maxHops}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Message Composer */}
      <div className="space-y-4">
        {/* Recipient Selection */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="broadcast"
              checked={isBroadcast}
              onChange={(e) => {
                setIsBroadcast(e.target.checked);
                if (e.target.checked) setSelectedRecipient(null);
              }}
              className="rounded"
            />
            <label htmlFor="broadcast" className="text-sm font-medium text-gray-700">
              Broadcast to all
            </label>
          </div>

          {!isBroadcast && (
            <select
              value={selectedRecipient || ''}
              onChange={(e) => setSelectedRecipient(e.target.value || null)}
              className="flex-1 border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select recipient...</option>
              {familyMembers.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name} ({member.status})
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Message Type Selection */}
        <div className="flex space-x-2">
          {[
            { type: 'TEXT' as const, label: 'Text', icon: MessageCircle },
            { type: 'LOCATION' as const, label: 'Location', icon: MapPin },
            { type: 'CHECK_IN' as const, label: 'Check-in', icon: Check },
            { type: 'EMERGENCY' as const, label: 'Emergency', icon: AlertTriangle }
          ].map(({ type, label, icon: Icon }) => (
            <button
              key={type}
              onClick={() => setMessageType(type)}
              className={`flex items-center space-x-1 px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                messageType === type
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="flex space-x-2">
          <button
            onClick={handleLocationShare}
            className="flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm hover:bg-blue-200 transition-colors"
          >
            <MapPin className="h-4 w-4" />
            <span>Share Location</span>
          </button>
          <button
            onClick={handleEmergencyBroadcast}
            className="flex items-center space-x-1 px-3 py-1 bg-red-100 text-red-700 rounded-md text-sm hover:bg-red-200 transition-colors"
          >
            <AlertTriangle className="h-4 w-4" />
            <span>Emergency</span>
          </button>
        </div>

        {/* Message Input */}
        <div className="flex space-x-2">
          <textarea
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            rows={2}
            placeholder="Type your message..."
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <button
            onClick={handleSendMessage}
            disabled={!messageText.trim() || (!isBroadcast && !selectedRecipient)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>

        {/* Send Requirements */}
        {(!isBroadcast && !selectedRecipient) && (
          <p className="text-xs text-gray-500">
            Select a recipient or enable broadcast to send
          </p>
        )}
      </div>
    </div>
  );
};

export default MeshMessagingSystem;
/**
 * CollaborativeEditor Component - Real-Time Co-Editing with TipTap + Yjs
 * 
 * Rich text editor with:
 * - CRDT-based conflict-free editing
 * - Live cursor presence
 * - User highlighting
 * - Version history
 * - Ubuntu-aligned collaboration features
 * 
 * @module CollaborativeEditor
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Collaboration from '@tiptap/extension-collaboration';
import CollaborationCursor from '@tiptap/extension-collaboration-cursor';
import Placeholder from '@tiptap/extension-placeholder';
import { useTranslation } from '@/contexts/I18nContext';
import {
  CollaborativeEditingService,
  getCollaborativeEditingService,
  CollaborativeSession,
  UserPresence
} from '@/services/CollaborativeEditingService';

interface CollaborativeEditorProps {
  /** Document ID to collaborate on */
  documentId: string;
  /** Current user ID */
  userId: string;
  /** Current user name */
  userName: string;
  /** User role */
  userRole?: 'elder' | 'member' | 'guest';
  /** Initial content (if new document) */
  initialContent?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Read-only mode */
  readOnly?: boolean;
  /** Callback when content changes */
  onChange?: (content: string) => void;
  /** Callback when save requested */
  onSave?: (content: string) => void;
}

/**
 * Collaborative editor component
 */
export default function CollaborativeEditor({
  documentId,
  userId,
  userName,
  userRole = 'member',
  initialContent = '',
  placeholder = 'Start typing...',
  readOnly = false,
  onChange,
  onSave
}: CollaborativeEditorProps) {
  const { t } = useTranslation();
  const [service] = useState<CollaborativeEditingService>(
    () => getCollaborativeEditingService()
  );
  const [session, setSession] = useState<CollaborativeSession | null>(null);
  const [connectedUsers, setConnectedUsers] = useState<UserPresence[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Initialize editor
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        history: false // Disable built-in history (Yjs handles it)
      }),
      Placeholder.configure({
        placeholder
      }),
      // Collaboration will be configured after session is ready
    ],
    editable: !readOnly,
    content: initialContent,
    onUpdate: ({ editor }) => {
      if (onChange) {
        onChange(editor.getHTML());
      }
    }
  });

  // Connect to collaborative session
  useEffect(() => {
    let mounted = true;

    const connect = async () => {
      try {
        const newSession = await service.connectToDocument(
          documentId,
          userId,
          userName,
          userRole
        );

        if (!mounted) return;

        setSession(newSession);
        setIsConnected(newSession.isConnected);

        // Update editor with collaboration extensions
        if (editor) {
          editor.setOptions({
            extensions: [
              StarterKit.configure({
                history: false
              }),
              Placeholder.configure({
                placeholder
              }),
              Collaboration.configure({
                document: newSession.ydoc
              }),
              CollaborationCursor.configure({
                provider: newSession.wsProvider,
                user: {
                  name: userName,
                  color: newSession.awareness.getLocalState()?.color || '#000000'
                }
              })
            ]
          });
        }

        // Update connected users periodically
        const interval = setInterval(() => {
          if (mounted) {
            const users = service.getConnectedUsers(documentId);
            setConnectedUsers(users);
            setIsConnected(newSession.isConnected);
          }
        }, 1000);

        return () => {
          clearInterval(interval);
        };
      } catch (error) {
        console.error('Failed to connect:', error);
      }
    };

    connect();

    return () => {
      mounted = false;
      service.disconnectFromDocument(documentId);
    };
  }, [documentId, userId, userName, userRole, service, editor, placeholder]);

  // Handle save
  const handleSave = async () => {
    if (!editor || !onSave) return;

    setIsSaving(true);
    try {
      const content = editor.getHTML();
      await onSave(content);
      
      // Create snapshot
      if (session) {
        service.createSnapshot(
          documentId,
          userId,
          `Saved by ${userName} at ${new Date().toLocaleString()}`
        );
      }
    } catch (error) {
      console.error('Save failed:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + S to save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleSave]);

  if (!editor) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="collaborative-editor flex flex-col h-full bg-white rounded-lg shadow-md border border-gray-200">
      {/* Toolbar */}
      <div className="border-b border-gray-200 bg-gray-50 p-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {/* Formatting buttons */}
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={readOnly}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              editor.isActive('bold') ? 'bg-gray-300' : ''
            } ${readOnly ? 'opacity-50 cursor-not-allowed' : ''}`}
            title="Bold"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M11 6V4H5v2h2v6H5v2h6v-2H9V6h2zm5.66 3.06c.78.46 1.34 1.23 1.34 2.15 0 1.43-1.16 2.58-2.59 2.58H11V6h4.41c1.43 0 2.59 1.16 2.59 2.59 0 .92-.56 1.69-1.34 2.15zM13 10v2h2.59c.55 0 1-.45 1-1s-.45-1-1-1H13zm0-2h2.41c.55 0 1-.45 1-1s-.45-1-1-1H13v2z" />
            </svg>
          </button>

          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={readOnly}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              editor.isActive('italic') ? 'bg-gray-300' : ''
            } ${readOnly ? 'opacity-50 cursor-not-allowed' : ''}`}
            title="Italic"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z" />
            </svg>
          </button>

          <div className="w-px h-6 bg-gray-300 mx-2" />

          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            disabled={readOnly}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              editor.isActive('bulletList') ? 'bg-gray-300' : ''
            } ${readOnly ? 'opacity-50 cursor-not-allowed' : ''}`}
            title="Bullet List"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            disabled={readOnly}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
              editor.isActive('orderedList') ? 'bg-gray-300' : ''
            } ${readOnly ? 'opacity-50 cursor-not-allowed' : ''}`}
            title="Numbered List"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
            </svg>
          </button>

          {onSave && !readOnly && (
            <>
              <div className="w-px h-6 bg-gray-300 mx-2" />
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded transition-colors disabled:opacity-50 flex items-center space-x-2"
              >
                {isSaving ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>{t('editor.saving', 'Saving...')}</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                    </svg>
                    <span>{t('editor.save', 'Save')}</span>
                  </>
                )}
              </button>
            </>
          )}
        </div>

        {/* Connection status and user count */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
            <span className="text-gray-600">
              {isConnected ? t('editor.connected', 'Connected') : t('editor.offline', 'Offline')}
            </span>
          </div>

          {connectedUsers.length > 0 && (
            <div className="flex items-center space-x-2">
              <div className="flex -space-x-2">
                {connectedUsers.slice(0, 5).map((user, index) => (
                  <div
                    key={user.userId}
                    className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-semibold"
                    style={{ backgroundColor: user.color }}
                    title={`${user.name} (${user.role})`}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                ))}
                {connectedUsers.length > 5 && (
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-400 flex items-center justify-center text-white text-xs font-semibold">
                    +{connectedUsers.length - 5}
                  </div>
                )}
              </div>
              <span className="text-sm text-gray-600">
                {connectedUsers.length} {connectedUsers.length === 1 ? t('editor.editor', 'editor') : t('editor.editors', 'editors')}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Editor content */}
      <div className="flex-1 overflow-y-auto p-6">
        <EditorContent 
          editor={editor}
          className="prose prose-sm max-w-none focus:outline-none"
        />
      </div>

      {/* Active editors indicator */}
      {connectedUsers.length > 0 && (
        <div className="border-t border-gray-200 bg-orange-50 p-3">
          <div className="flex flex-wrap gap-2">
            {connectedUsers.map((user) => (
              <div
                key={user.userId}
                className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm"
                style={{ 
                  backgroundColor: `${user.color}20`,
                  borderLeft: `3px solid ${user.color}`
                }}
              >
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: user.color }}
                />
                <span className="font-medium text-gray-900">{user.name}</span>
                {user.role === 'elder' && (
                  <span className="text-xs">👑</span>
                )}
                {service.isUserEditing(documentId, user.userId) && (
                  <span className="text-xs text-gray-600">
                    {t('editor.typing', 'typing...')}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

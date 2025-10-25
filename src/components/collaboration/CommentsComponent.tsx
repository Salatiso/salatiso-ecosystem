import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import collaborationService, { Comment, Reaction } from '@/services/CollaborationService';
import { Send, Heart, MoreVertical, Trash2, Edit2, Reply } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CommentsComponentProps {
  eventId: string;
  onCommentCount?: (count: number) => void;
  maxHeight?: string;
}

/**
 * CommentsComponent
 * Real-time comment threading with reactions, editing, and nested replies
 */
export const CommentsComponent: React.FC<CommentsComponentProps> = ({
  eventId,
  onCommentCount,
  maxHeight = 'max-h-96',
}) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [hoveredComment, setHoveredComment] = useState<string | null>(null);
  const [userReactions, setUserReactions] = useState<Map<string, Set<string>>>(
    new Map()
  );
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Subscribe to comments
  useEffect(() => {
    setLoading(true);

    const unsubscribe = collaborationService.subscribeToComments(
      eventId,
      (fetchedComments) => {
        setComments(fetchedComments);
        setLoading(false);

        if (onCommentCount) {
          onCommentCount(fetchedComments.length);
        }

        // Auto-scroll to bottom
        setTimeout(() => {
          if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
          }
        }, 100);
      },
      (error) => {
        console.error('Failed to load comments:', error);
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [eventId, onCommentCount]);

  // Handle adding new comment
  const handleAddComment = async () => {
    if (!commentText.trim() || !user) return;

    try {
      await collaborationService.addComment(
        eventId,
        user.id,
        commentText
      );
      setCommentText('');
      inputRef.current?.focus();
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  // Handle editing comment
  const handleEditComment = async (commentId: string) => {
    if (!editText.trim()) return;

    try {
      await collaborationService.updateComment(eventId, commentId, editText);
      setEditingId(null);
      setEditText('');
    } catch (error) {
      console.error('Failed to edit comment:', error);
    }
  };

  // Handle deleting comment
  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Delete this comment?')) return;

    try {
      await collaborationService.deleteComment(eventId, commentId);
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };

  // Handle adding reaction
  const handleAddReaction = async (commentId: string, emoji: string) => {
    if (!user) return;

    try {
      await collaborationService.addReaction(
        eventId,
        commentId,
        user.id,
        emoji
      );

      const key = `${commentId}-${emoji}`;
      setUserReactions((prev) => {
        const newMap = new Map(prev);
        if (!newMap.has(key)) {
          newMap.set(key, new Set());
        }
        newMap.get(key)!.add(user.id);
        return newMap;
      });
    } catch (error) {
      console.error('Failed to add reaction:', error);
    }
  };

  // Handle reply
  const handleAddReply = async () => {
    if (!replyText.trim() || !user || !replyingTo) return;

    try {
      await collaborationService.addComment(
        eventId,
        user.id,
        replyText,
        replyingTo
      );
      setReplyText('');
      setReplyingTo(null);
    } catch (error) {
      console.error('Failed to add reply:', error);
    }
  };

  // Parse mentions for highlighting
  const highlightMentions = (text: string) => {
    return text.split(/(@\w+)/g).map((part, i) => {
      if (part.startsWith('@')) {
        return (
          <span key={i} className="font-semibold text-blue-600 bg-blue-50 px-1 rounded">
            {part}
          </span>
        );
      }
      return part;
    });
  };

  // Reaction emoji options
  const reactionEmojis = ['👍', '❤️', '😂', '🔥', '🎉', '✨'];

  // Group comments by thread
  const rootComments = comments.filter((c) => !c.threadId);
  const replies: Map<string, Comment[]> = new Map();

  comments.forEach((c) => {
    if (c.threadId) {
      if (!replies.has(c.threadId)) {
        replies.set(c.threadId, []);
      }
      replies.get(c.threadId)!.push(c);
    }
  });

  return (
    <div className="flex flex-col h-full bg-white rounded-lg border border-gray-200">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <span>💬 Comments</span>
          <span className="ml-auto bg-blue-100 text-blue-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">
            {comments.length}
          </span>
        </h3>
      </div>

      {/* Comments List */}
      <div
        ref={scrollRef}
        className={`flex-1 overflow-y-auto ${maxHeight} space-y-3 p-4`}
      >
        <AnimatePresence>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            </div>
          ) : comments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <span className="text-3xl mb-2">💭</span>
              <p className="text-sm">No comments yet. Be the first!</p>
            </div>
          ) : (
            rootComments.map((comment) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-2"
              >
                {/* Root Comment */}
                <div
                  className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors"
                  onMouseEnter={() => setHoveredComment(comment.id)}
                  onMouseLeave={() => setHoveredComment(null)}
                >
                  {/* Edit Mode */}
                  {editingId === comment.id ? (
                    <div className="space-y-2">
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        rows={2}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditComment(comment.id)}
                          className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setEditingId(null);
                            setEditText('');
                          }}
                          className="text-xs px-2 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Comment Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                            {comment.author?.name?.charAt(0) || 'U'}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs font-semibold text-gray-900">
                              {comment.author?.name || 'Anonymous'}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(comment.createdAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                              {comment.status === 'edited' && (
                                <span className="ml-1 text-gray-400">(edited)</span>
                              )}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        {hoveredComment === comment.id && user?.id === comment.userId && (
                          <div className="flex gap-1">
                            <button
                              onClick={() => {
                                setEditingId(comment.id);
                                setEditText(comment.text);
                              }}
                              className="p-1 hover:bg-gray-200 rounded transition-colors"
                            >
                              <Edit2 size={14} className="text-gray-600" />
                            </button>
                            <button
                              onClick={() => handleDeleteComment(comment.id)}
                              className="p-1 hover:bg-red-100 rounded transition-colors"
                            >
                              <Trash2 size={14} className="text-red-600" />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Comment Text */}
                      <p className="text-sm text-gray-800 mt-1">
                        {highlightMentions(comment.text)}
                      </p>

                      {/* Reactions */}
                      <div className="flex items-center gap-1 mt-2 flex-wrap">
                        {comment.reactions && comment.reactions.length > 0 && (
                          <>
                            {Array.from(
                              new Map(
                                comment.reactions.map((r) => [
                                  r.emoji,
                                  {
                                    emoji: r.emoji,
                                    count: comment.reactions.filter(
                                      (reaction) => reaction.emoji === r.emoji
                                    ).length,
                                  },
                                ])
                              ).values()
                            ).map(({ emoji, count }) => (
                              <button
                                key={emoji}
                                onClick={() => handleAddReaction(comment.id, emoji)}
                                className="flex items-center gap-1 px-2 py-0.5 bg-white border border-gray-300 rounded-full hover:border-blue-500 text-xs transition-colors"
                              >
                                <span>{emoji}</span>
                                <span className="text-gray-600">{count}</span>
                              </button>
                            ))}
                          </>
                        )}
                      </div>

                      {/* Reaction & Reply Buttons */}
                      <div className="flex gap-2 mt-2">
                        <div className="flex gap-1">
                          {reactionEmojis.map((emoji) => (
                            <button
                              key={emoji}
                              onClick={() => handleAddReaction(comment.id, emoji)}
                              className="p-1 hover:bg-gray-200 rounded transition-colors"
                              title={`React with ${emoji}`}
                            >
                              <span className="text-sm">{emoji}</span>
                            </button>
                          ))}
                        </div>

                        <button
                          onClick={() => setReplyingTo(comment.id)}
                          className="flex items-center gap-1 text-xs text-gray-600 hover:text-blue-600 transition-colors"
                        >
                          <Reply size={14} />
                          Reply
                        </button>
                      </div>
                    </>
                  )}
                </div>

                {/* Replies */}
                {replies.has(comment.id) && (
                  <div className="ml-4 space-y-2 border-l-2 border-blue-200 pl-3">
                    <AnimatePresence>
                      {replies.get(comment.id)!.map((reply) => (
                        <motion.div
                          key={reply.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          className="bg-blue-50 rounded-lg p-2 hover:bg-blue-100 transition-colors text-xs"
                        >
                          <div className="flex items-start gap-2">
                            <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                              {reply.author?.name?.charAt(0) || 'U'}
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold text-gray-900">
                                {reply.author?.name || 'Anonymous'}
                              </div>
                              <p className="text-gray-700 mt-0.5">
                                {highlightMentions(reply.text)}
                              </p>
                              <span className="text-gray-500 text-xs mt-1 block">
                                {new Date(reply.createdAt).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}

                {/* Reply Input */}
                {replyingTo === comment.id && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="ml-4 bg-blue-50 rounded-lg p-2 space-y-2"
                  >
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Write a reply..."
                      className="w-full px-2 py-1 text-xs border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      rows={2}
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleAddReply}
                        className="flex items-center gap-1 text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                      >
                        <Send size={12} />
                        Reply
                      </button>
                      <button
                        onClick={() => {
                          setReplyingTo(null);
                          setReplyText('');
                        }}
                        className="text-xs px-2 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Input Area */}
      {user && (
        <div className="border-t border-gray-200 p-3 bg-gray-50">
          <div className="flex gap-2">
            <textarea
              ref={inputRef}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.ctrlKey) {
                  handleAddComment();
                }
              }}
              placeholder="Add a comment... (Ctrl+Enter to send)"
              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={2}
              disabled={loading}
            />
            <button
              onClick={handleAddComment}
              disabled={!commentText.trim() || loading}
              className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors flex items-center gap-1"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentsComponent;

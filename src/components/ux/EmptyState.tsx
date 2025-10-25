/**
 * Empty State Components
 * Phase 5 UX Enhancements
 * Better than showing nothing
 */

'use client';

import React from 'react';
import { Plus, Search, Package, Users, FileText, Inbox, Star, ChevronRight } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * Generic Empty State
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = <Package className="w-16 h-16" />,
  title,
  description,
  action,
  secondaryAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="text-gray-400 mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      {description && (
        <p className="text-gray-600 text-center max-w-md mb-6">{description}</p>
      )}
      <div className="flex gap-3">
        {action && (
          <button
            onClick={action.onClick}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <Plus className="w-4 h-4" />
            {action.label}
          </button>
        )}
        {secondaryAction && (
          <button
            onClick={secondaryAction.onClick}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
          >
            {secondaryAction.label}
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

/**
 * No Results for Search
 */
export const NoSearchResults: React.FC<{
  query: string;
  onClear: () => void;
}> = ({ query, onClear }) => {
  return (
    <EmptyState
      icon={<Search className="w-16 h-16" />}
      title="No results found"
      description={`We couldn't find anything matching "${query}". Try adjusting your search.`}
      action={{
        label: 'Clear search',
        onClick: onClear,
      }}
    />
  );
};

/**
 * No Contacts
 */
export const NoContacts: React.FC<{
  onAdd: () => void;
}> = ({ onAdd }) => {
  return (
    <EmptyState
      icon={<Users className="w-16 h-16" />}
      title="No contacts yet"
      description="Start building your network by adding your first contact."
      action={{
        label: 'Add contact',
        onClick: onAdd,
      }}
    />
  );
};

/**
 * No Messages
 */
export const NoMessages: React.FC<{
  onCompose: () => void;
}> = ({ onCompose }) => {
  return (
    <EmptyState
      icon={<Inbox className="w-16 h-16" />}
      title="No messages"
      description="Your inbox is empty. Compose your first message to get started."
      action={{
        label: 'Compose',
        onClick: onCompose,
      }}
    />
  );
};

/**
 * No Documents
 */
export const NoDocuments: React.FC<{
  onCreate: () => void;
}> = ({ onCreate }) => {
  return (
    <EmptyState
      icon={<FileText className="w-16 h-16" />}
      title="No documents"
      description="Create your first document to get started."
      action={{
        label: 'Create document',
        onClick: onCreate,
      }}
    />
  );
};

/**
 * No Favorites
 */
export const NoFavorites: React.FC = () => {
  return (
    <EmptyState
      icon={<Star className="w-16 h-16" />}
      title="No favorites yet"
      description="Mark items as favorites to see them here."
    />
  );
};

/**
 * Offline State
 */
export const OfflineState: React.FC<{
  onRetry: () => void;
}> = ({ onRetry }) => {
  return (
    <EmptyState
      icon={<Package className="w-16 h-16" />}
      title="You're offline"
      description="Check your internet connection and try again."
      action={{
        label: 'Retry',
        onClick: onRetry,
      }}
    />
  );
};

/**
 * Error State
 */
export const ErrorState: React.FC<{
  title?: string;
  message?: string;
  onRetry: () => void;
  onBack?: () => void;
}> = ({
  title = 'Something went wrong',
  message = 'An error occurred while loading this content.',
  onRetry,
  onBack,
}) => {
  return (
    <EmptyState
      icon={<Package className="w-16 h-16" />}
      title={title}
      description={message}
      action={{
        label: 'Retry',
        onClick: onRetry,
      }}
      secondaryAction={
        onBack
          ? {
              label: 'Go back',
              onClick: onBack,
            }
          : undefined
      }
    />
  );
};

/**
 * Permission Denied State
 */
export const PermissionDenied: React.FC<{
  onRequestAccess?: () => void;
}> = ({ onRequestAccess }) => {
  return (
    <EmptyState
      icon={<Package className="w-16 h-16" />}
      title="Access denied"
      description="You don't have permission to view this content."
      action={
        onRequestAccess
          ? {
              label: 'Request access',
              onClick: onRequestAccess,
            }
          : undefined
      }
    />
  );
};

/**
 * Loading Empty State
 */
export const LoadingEmpty: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 animate-pulse">
      <div className="w-16 h-16 bg-gray-200 rounded-full mb-4" />
      <div className="h-6 bg-gray-200 rounded w-48 mb-2" />
      <div className="h-4 bg-gray-200 rounded w-64" />
    </div>
  );
};

/**
 * List Empty State
 */
export const ListEmpty: React.FC<{
  title: string;
  description?: string;
}> = ({ title, description }) => {
  return (
    <div className="text-center py-8 text-gray-500">
      <p className="font-medium">{title}</p>
      {description && <p className="text-sm mt-1">{description}</p>}
    </div>
  );
};

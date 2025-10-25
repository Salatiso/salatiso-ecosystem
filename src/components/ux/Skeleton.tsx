/**
 * Loading Skeleton Components
 * Phase 5 UX Enhancements
 * Better loading states than spinners
 */

'use client';

import React from 'react';

/**
 * Generic Skeleton Loader
 */
export const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div
      className={`bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse rounded ${className}`}
    />
  );
};

/**
 * Card Skeleton (for list items)
 */
export const CardSkeleton: React.FC<{ count?: number }> = ({ count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-lg shadow p-4 mb-4">
          <Skeleton className="h-4 w-3/4 mb-3" />
          <Skeleton className="h-3 w-full mb-2" />
          <Skeleton className="h-3 w-5/6" />
        </div>
      ))}
    </>
  );
};

/**
 * Table Skeleton
 */
export const TableSkeleton: React.FC<{
  rows?: number;
  columns?: number;
}> = ({ rows = 5, columns = 4 }) => {
  return (
    <div className="w-full">
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div key={rowIdx} className="flex gap-4 mb-3 p-3 bg-white rounded">
          {Array.from({ length: columns }).map((_, colIdx) => (
            <Skeleton
              key={colIdx}
              className="h-4 flex-1"
            />
          ))}
        </div>
      ))}
    </div>
  );
};

/**
 * Dashboard Widget Skeleton
 */
export const WidgetSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <Skeleton className="h-5 w-1/3 mb-4" />
      <div className="space-y-3">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-2/3" />
      </div>
    </div>
  );
};

/**
 * Text Skeleton (multiple lines)
 */
export const TextSkeleton: React.FC<{ lines?: number }> = ({ lines = 3 }) => {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={`h-4 ${i === lines - 1 ? 'w-2/3' : 'w-full'}`}
        />
      ))}
    </div>
  );
};

/**
 * Avatar Skeleton
 */
export const AvatarSkeleton: React.FC = () => {
  return <Skeleton className="w-10 h-10 rounded-full" />;
};

/**
 * Profile Skeleton
 */
export const ProfileSkeleton: React.FC = () => {
  return (
    <div className="space-y-4">
      <Skeleton className="w-20 h-20 rounded-full mx-auto" />
      <Skeleton className="h-6 w-1/2 mx-auto" />
      <Skeleton className="h-4 w-2/3 mx-auto" />
    </div>
  );
};

/**
 * Form Skeleton
 */
export const FormSkeleton: React.FC<{ fields?: number }> = ({ fields = 4 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i}>
          <Skeleton className="h-4 w-1/4 mb-2" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
    </div>
  );
};

/**
 * List Item Skeleton
 */
export const ListItemSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3 bg-white rounded">
          <AvatarSkeleton />
          <div className="flex-1">
            <Skeleton className="h-4 w-1/3 mb-2" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * Chart Skeleton
 */
export const ChartSkeleton: React.FC = () => {
  return (
    <div className="w-full h-64 bg-white rounded-lg shadow p-4">
      <Skeleton className="h-5 w-1/4 mb-4" />
      <div className="flex items-end gap-4 h-48 mt-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="flex-1">
            <Skeleton className={`w-full ${Math.random() * 60 + 40}px`} />
          </div>
        ))}
      </div>
    </div>
  );
};

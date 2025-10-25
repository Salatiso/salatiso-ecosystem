/**
 * Tooltip Component
 * Phase 5 UX Enhancements
 * Reusable tooltip component with hover support
 */

'use client';

import React, { useState } from 'react';
import { Info } from 'lucide-react';

interface TooltipProps {
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  children: React.ReactNode;
  delay?: number;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  position = 'top',
  children,
  delay = 200,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    const id = setTimeout(() => setIsVisible(true), delay);
    setTimeoutId(id);
  };

  const handleMouseLeave = () => {
    if (timeoutId) clearTimeout(timeoutId);
    setIsVisible(false);
  };

  const positionClasses = {
    top: 'bottom-full mb-2',
    bottom: 'top-full mt-2',
    left: 'right-full mr-2',
    right: 'left-full ml-2',
  };

  const arrowClasses = {
    top: 'top-full border-t-gray-900',
    bottom: 'bottom-full border-b-gray-900',
    left: 'left-full border-l-gray-900',
    right: 'right-full border-r-gray-900',
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {isVisible && (
        <div
          className={`absolute ${positionClasses[position]} z-50 px-3 py-2 bg-gray-900 text-white text-sm rounded shadow-lg whitespace-nowrap`}
        >
          {content}
          <div
            className={`absolute w-2 h-2 bg-gray-900 transform rotate-45 ${arrowClasses[position]}`}
          />
        </div>
      )}
    </div>
  );
};

/**
 * Help Icon with Tooltip
 */
interface HelpIconProps {
  text: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export const HelpIcon: React.FC<HelpIconProps> = ({ text, position = 'right' }) => {
  return (
    <Tooltip content={text} position={position}>
      <Info className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help inline-block" />
    </Tooltip>
  );
};

/**
 * Enhanced Button with Tooltip
 */
interface TooltipButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  tooltip?: string;
  children: React.ReactNode;
}

export const TooltipButton: React.FC<TooltipButtonProps> = ({
  tooltip,
  children,
  className = '',
  ...props
}) => {
  if (!tooltip) {
    return (
      <button className={className} {...props}>
        {children}
      </button>
    );
  }

  return (
    <Tooltip content={tooltip} position="bottom">
      <button className={className} {...props}>
        {children}
      </button>
    </Tooltip>
  );
};

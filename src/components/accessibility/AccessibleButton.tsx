import React, { forwardRef, ButtonHTMLAttributes } from 'react';
import { useReducedMotion } from './AccessibilityUtils';

interface AccessibleButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
}

export const AccessibleButton = forwardRef<HTMLButtonElement, AccessibleButtonProps>(
  ({ variant = 'primary', size = 'md', className = '', children, ...props }, ref) => {
    const prefersReducedMotion = useReducedMotion();

    const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors';

    const variantClasses = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 border border-transparent',
      secondary: 'bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500 border border-gray-300',
      danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 border border-transparent',
      success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 border border-transparent',
    };

    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
    };

    const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

    return (
      <button
        ref={ref}
        className={combinedClasses}
        style={prefersReducedMotion ? { transition: 'none' } : undefined}
        {...props}
      >
        {children}
      </button>
    );
  }
);

AccessibleButton.displayName = 'AccessibleButton';
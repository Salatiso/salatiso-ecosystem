import React, { forwardRef, InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes } from 'react';
import { useReducedMotion } from './AccessibilityUtils';

interface BaseFieldProps {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  className?: string;
}

interface InputProps extends BaseFieldProps, Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> {}

export const AccessibleInput = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, required, className = '', id, ...props }, ref) => {
    const fieldId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const errorId = `${fieldId}-error`;
    const hintId = `${fieldId}-hint`;
    const prefersReducedMotion = useReducedMotion();

    return (
      <div className={`space-y-1 ${className}`}>
        <label
          htmlFor={fieldId}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
          {required && (
            <span className="text-red-500 ml-1" aria-label="required">
              *
            </span>
          )}
        </label>

        {hint && (
          <p id={hintId} className="text-sm text-gray-500">
            {hint}
          </p>
        )}

        <input
          ref={ref}
          id={fieldId}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          aria-invalid={!!error}
          aria-required={required}
          className={`
            block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
            ${error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'}
            ${prefersReducedMotion ? '' : 'transition-colors duration-200'}
            sm:text-sm
          `}
          {...props}
        />

        {error && (
          <p id={errorId} className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

AccessibleInput.displayName = 'AccessibleInput';

interface TextareaProps extends BaseFieldProps, Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'className'> {}

export const AccessibleTextarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, required, className = '', id, ...props }, ref) => {
    const fieldId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
    const errorId = `${fieldId}-error`;
    const hintId = `${fieldId}-hint`;
    const prefersReducedMotion = useReducedMotion();

    return (
      <div className={`space-y-1 ${className}`}>
        <label
          htmlFor={fieldId}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
          {required && (
            <span className="text-red-500 ml-1" aria-label="required">
              *
            </span>
          )}
        </label>

        {hint && (
          <p id={hintId} className="text-sm text-gray-500">
            {hint}
          </p>
        )}

        <textarea
          ref={ref}
          id={fieldId}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          aria-invalid={!!error}
          aria-required={required}
          className={`
            block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
            ${error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'}
            ${prefersReducedMotion ? '' : 'transition-colors duration-200'}
            sm:text-sm resize-vertical min-h-[80px]
          `}
          {...props}
        />

        {error && (
          <p id={errorId} className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

AccessibleTextarea.displayName = 'AccessibleTextarea';

interface SelectProps extends BaseFieldProps, Omit<SelectHTMLAttributes<HTMLSelectElement>, 'className'> {
  options: Array<{ value: string; label: string; disabled?: boolean }>;
}

export const AccessibleSelect = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, required, options, className = '', id, ...props }, ref) => {
    const fieldId = id || `select-${Math.random().toString(36).substr(2, 9)}`;
    const errorId = `${fieldId}-error`;
    const hintId = `${fieldId}-hint`;
    const prefersReducedMotion = useReducedMotion();

    return (
      <div className={`space-y-1 ${className}`}>
        <label
          htmlFor={fieldId}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
          {required && (
            <span className="text-red-500 ml-1" aria-label="required">
              *
            </span>
          )}
        </label>

        {hint && (
          <p id={hintId} className="text-sm text-gray-500">
            {hint}
          </p>
        )}

        <select
          ref={ref}
          id={fieldId}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          aria-invalid={!!error}
          aria-required={required}
          className={`
            block w-full px-3 py-2 border rounded-md shadow-sm
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
            ${error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'}
            ${prefersReducedMotion ? '' : 'transition-colors duration-200'}
            sm:text-sm bg-white
          `}
          {...props}
        >
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>

        {error && (
          <p id={errorId} className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

AccessibleSelect.displayName = 'AccessibleSelect';

// Accessible Checkbox
interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'className'> {
  label: string;
  error?: string;
  hint?: string;
  className?: string;
}

export const AccessibleCheckbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, hint, className = '', id, ...props }, ref) => {
    const fieldId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;
    const errorId = `${fieldId}-error`;
    const hintId = `${fieldId}-hint`;
    const prefersReducedMotion = useReducedMotion();

    return (
      <div className={`space-y-1 ${className}`}>
        <div className="flex items-start">
          <input
            ref={ref}
            id={fieldId}
            type="checkbox"
            aria-describedby={error ? errorId : hint ? hintId : undefined}
            aria-invalid={!!error}
            className={`
              h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded
              ${prefersReducedMotion ? '' : 'transition-colors duration-200'}
            `}
            {...props}
          />
          <label
            htmlFor={fieldId}
            className="ml-2 block text-sm text-gray-700 cursor-pointer"
          >
            {label}
          </label>
        </div>

        {hint && (
          <p id={hintId} className="text-sm text-gray-500 ml-6">
            {hint}
          </p>
        )}

        {error && (
          <p id={errorId} className="text-sm text-red-600 ml-6" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

AccessibleCheckbox.displayName = 'AccessibleCheckbox';

// Accessible Radio Group
interface RadioOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface RadioGroupProps {
  name: string;
  label: string;
  options: RadioOption[];
  value?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  onChange?: (value: string) => void;
  className?: string;
}

export const AccessibleRadioGroup: React.FC<RadioGroupProps> = ({
  name,
  label,
  options,
  value,
  error,
  hint,
  required,
  onChange,
  className = '',
}) => {
  const groupId = `radio-group-${Math.random().toString(36).substr(2, 9)}`;
  const errorId = `${groupId}-error`;
  const hintId = `${groupId}-hint`;
  const prefersReducedMotion = useReducedMotion();

  return (
    <fieldset className={`space-y-1 ${className}`}>
      <legend className="block text-sm font-medium text-gray-700">
        {label}
        {required && (
          <span className="text-red-500 ml-1" aria-label="required">
            *
          </span>
        )}
      </legend>

      {hint && (
        <p id={hintId} className="text-sm text-gray-500">
          {hint}
        </p>
      )}

      <div className="space-y-2">
        {options.map((option) => {
          const optionId = `${groupId}-${option.value}`;
          return (
            <div key={option.value} className="flex items-center">
              <input
                id={optionId}
                name={name}
                type="radio"
                value={option.value}
                checked={value === option.value}
                disabled={option.disabled}
                onChange={(e) => onChange?.(e.target.value)}
                aria-describedby={error ? errorId : hint ? hintId : undefined}
                className={`
                  h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300
                  ${prefersReducedMotion ? '' : 'transition-colors duration-200'}
                `}
              />
              <label
                htmlFor={optionId}
                className={`ml-2 block text-sm cursor-pointer ${
                  option.disabled ? 'text-gray-400' : 'text-gray-700'
                }`}
              >
                {option.label}
              </label>
            </div>
          );
        })}
      </div>

      {error && (
        <p id={errorId} className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </fieldset>
  );
};
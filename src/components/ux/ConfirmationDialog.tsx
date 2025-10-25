/**
 * Confirmation Dialog Component
 * Phase 5 UX Enhancements
 * For destructive or important actions
 */

'use client';

import React, { useState } from 'react';
import { AlertCircle, CheckCircle, XCircle, Info } from 'lucide-react';

export type DialogType = 'warning' | 'danger' | 'info' | 'success';

interface ConfirmationDialogProps {
  isOpen: boolean;
  type?: DialogType;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDangerous?: boolean;
  requiresInput?: boolean;
  inputPlaceholder?: string;
}

/**
 * Modal Overlay
 */
const Overlay: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <div
    className="fixed inset-0 bg-black bg-opacity-50 z-40"
    onClick={onClick}
  />
);

/**
 * Get icon and colors based on dialog type
 */
const getDialogConfig = (type: DialogType) => {
  const config: Record<DialogType, {
    icon: React.ReactNode;
    bgColor: string;
    iconColor: string;
    confirmBg: string;
    confirmHover: string;
  }> = {
    warning: {
      icon: <AlertCircle className="w-6 h-6" />,
      bgColor: 'bg-yellow-50',
      iconColor: 'text-yellow-600',
      confirmBg: 'bg-yellow-600',
      confirmHover: 'hover:bg-yellow-700',
    },
    danger: {
      icon: <XCircle className="w-6 h-6" />,
      bgColor: 'bg-red-50',
      iconColor: 'text-red-600',
      confirmBg: 'bg-red-600',
      confirmHover: 'hover:bg-red-700',
    },
    success: {
      icon: <CheckCircle className="w-6 h-6" />,
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      confirmBg: 'bg-green-600',
      confirmHover: 'hover:bg-green-700',
    },
    info: {
      icon: <Info className="w-6 h-6" />,
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      confirmBg: 'bg-blue-600',
      confirmHover: 'hover:bg-blue-700',
    },
  };
  return config[type];
};

/**
 * Main Confirmation Dialog Component
 */
export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  type = 'warning',
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  isDangerous = false,
  requiresInput = false,
  inputPlaceholder = '',
}) => {
  const [inputValue, setInputValue] = useState('');
  const config = getDialogConfig(type);
  const canConfirm = !requiresInput || inputValue.length > 0;

  if (!isOpen) return null;

  return (
    <>
      <Overlay onClick={onCancel} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className={`${config.bgColor} rounded-lg shadow-xl max-w-sm w-full overflow-hidden`}>
          {/* Header with icon */}
          <div className="p-6 bg-white border-b border-gray-200 flex items-center gap-4">
            <div className={config.iconColor}>{config.icon}</div>
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          </div>

          {/* Message */}
          <div className="p-6">
            <p className="text-gray-700 mb-4">{message}</p>

            {/* Optional input field */}
            {requiresInput && (
              <input
                type="text"
                placeholder={inputPlaceholder}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                autoFocus
              />
            )}
          </div>

          {/* Actions */}
          <div className="p-4 bg-gray-50 border-t border-gray-200 flex gap-3 justify-end">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              disabled={!canConfirm}
              className={`px-4 py-2 text-white rounded-lg transition ${config.confirmBg} ${config.confirmHover} disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

/**
 * Hook for easy dialog management
 */
export const useConfirmationDialog = () => {
  const [state, setState] = useState<{
    isOpen: boolean;
    type: DialogType;
    title: string;
    message: string;
    confirmText: string;
    cancelText: string;
    onConfirm?: () => void;
    onCancel?: () => void;
    isDangerous?: boolean;
    requiresInput?: boolean;
    inputPlaceholder?: string;
  }>({
    isOpen: false,
    type: 'warning',
    title: '',
    message: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
  });

  const open = (config: Omit<typeof state, 'isOpen'>) => {
    setState({ ...config, isOpen: true });
  };

  const close = () => {
    setState((prev) => ({ ...prev, isOpen: false }));
  };

  const confirm = () => {
    state.onConfirm?.();
    close();
  };

  const cancel = () => {
    state.onCancel?.();
    close();
  };

  return {
    isOpen: state.isOpen,
    open,
    close,
    confirm,
    cancel,
    Dialog: (
      <ConfirmationDialog
        isOpen={state.isOpen}
        type={state.type}
        title={state.title}
        message={state.message}
        confirmText={state.confirmText}
        cancelText={state.cancelText}
        onConfirm={confirm}
        onCancel={cancel}
        isDangerous={state.isDangerous}
        requiresInput={state.requiresInput}
        inputPlaceholder={state.inputPlaceholder}
      />
    ),
  };
};

/**
 * Simple Alert Dialog (info only, no cancel)
 */
export const AlertDialog: React.FC<{
  isOpen: boolean;
  title: string;
  message: string;
  type?: Omit<DialogType, 'warning'>;
  buttonText?: string;
  onClose: () => void;
}> = ({
  isOpen,
  title,
  message,
  type = 'info',
  buttonText = 'OK',
  onClose,
}) => {
  const config = getDialogConfig(type as DialogType);

  if (!isOpen) return null;

  return (
    <>
      <Overlay onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className={`${config.bgColor} rounded-lg shadow-xl max-w-sm w-full overflow-hidden`}>
          <div className="p-6 bg-white border-b border-gray-200 flex items-center gap-4">
            <div className={config.iconColor}>{config.icon}</div>
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          </div>

          <div className="p-6">
            <p className="text-gray-700">{message}</p>
          </div>

          <div className="p-4 bg-gray-50 border-t border-gray-200">
            <button
              onClick={onClose}
              className={`w-full px-4 py-2 text-white rounded-lg transition ${config.confirmBg} ${config.confirmHover}`}
            >
              {buttonText}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

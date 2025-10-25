/**
 * Keyboard Shortcuts Help Component
 * Phase 5 UX Enhancements
 */

'use client';

import React from 'react';

export const KeyboardShortcutsHelp = () => {
  const shortcuts = [
    { keys: ['⌘', 'K'], desc: 'Open search' },
    { keys: ['⌘', '/'], desc: 'Open help & shortcuts' },
    { keys: ['Esc'], desc: 'Close modal / dialog' },
    { keys: ['⌘', 'S'], desc: 'Save form' },
    { keys: ['Tab'], desc: 'Navigate forward' },
    { keys: ['Shift', 'Tab'], desc: 'Navigate backward' },
    { keys: ['Enter'], desc: 'Select / activate' },
    { keys: ['Space'], desc: 'Toggle checkbox / button' },
    { keys: ['↑', '↓'], desc: 'Navigate options' },
  ];

  return (
    <div className="space-y-3">
      <h3 className="font-bold text-gray-900">Keyboard Shortcuts</h3>
      <div className="space-y-2">
        {shortcuts.map((shortcut, i) => (
          <div key={i} className="flex items-center justify-between text-sm">
            <div className="flex gap-1">
              {shortcut.keys.map((key, j) => (
                <span key={j}>
                  <kbd className="px-2 py-1 bg-gray-200 border border-gray-300 rounded text-xs font-mono">
                    {key}
                  </kbd>
                  {j < shortcut.keys.length - 1 && <span className="mx-1">+</span>}
                </span>
              ))}
            </div>
            <span className="text-gray-600">{shortcut.desc}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

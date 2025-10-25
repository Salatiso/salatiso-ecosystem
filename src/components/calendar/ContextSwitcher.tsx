import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Users,
  Globe,
  Briefcase,
  ChevronDown,
} from 'lucide-react';
import { ContextLevel } from '@/types/calendar';

interface ContextSwitcherProps {
  current: ContextLevel;
  onChange: (context: ContextLevel) => void;
}

const contextMetadata: Record<ContextLevel, {
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}> = {
  [ContextLevel.INDIVIDUAL]: {
    label: 'Personal',
    description: 'My personal events and activities',
    icon: <User className="w-5 h-5" />,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 border-blue-200',
  },
  [ContextLevel.FAMILY]: {
    label: 'Family',
    description: 'Family events and gatherings',
    icon: <Users className="w-5 h-5" />,
    color: 'text-red-600',
    bgColor: 'bg-red-50 border-red-200',
  },
  [ContextLevel.COMMUNITY]: {
    label: 'Community',
    description: 'Community and group events',
    icon: <Globe className="w-5 h-5" />,
    color: 'text-green-600',
    bgColor: 'bg-green-50 border-green-200',
  },
  [ContextLevel.PROFESSIONAL]: {
    label: 'Professional',
    description: 'Work and professional events',
    icon: <Briefcase className="w-5 h-5" />,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50 border-indigo-200',
  },
};

const ContextSwitcher: React.FC<ContextSwitcherProps> = ({ current, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSelectContext = (context: ContextLevel) => {
    onChange(context);
    setIsOpen(false);
    // Persist to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('calendar-context', context);
    }
  };

  if (!mounted) return null;

  const currentMeta = contextMetadata[current];

  return (
    <div className="relative">
      {/* Desktop: Button grid */}
      <div className="hidden sm:flex gap-2 flex-wrap">
        {(Object.values(ContextLevel) as ContextLevel[]).map((context) => {
          const meta = contextMetadata[context];
          const isActive = current === context;

          return (
            <motion.button
              key={context}
              onClick={() => handleSelectContext(context)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`
                px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2
                ${isActive
                  ? `${meta.bgColor} border-2 ${meta.color} shadow-md`
                  : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300'
                }
              `}
              title={meta.description}
            >
              {meta.icon}
              <span className="hidden md:inline">{meta.label}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Mobile: Dropdown */}
      <div className="sm:hidden">
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`
            w-full px-4 py-3 rounded-lg font-medium transition-all flex items-center justify-between
            ${currentMeta.bgColor} border-2 ${currentMeta.color} shadow-md
          `}
        >
          <div className="flex items-center gap-2">
            {currentMeta.icon}
            <span>{currentMeta.label}</span>
          </div>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </motion.button>

        {/* Dropdown Menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden"
          >
            {(Object.values(ContextLevel) as ContextLevel[]).map((context) => {
              const meta = contextMetadata[context];
              const isActive = current === context;

              return (
                <motion.button
                  key={context}
                  onClick={() => handleSelectContext(context)}
                  whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
                  className={`
                    w-full px-4 py-3 text-left transition-colors flex items-center gap-3
                    border-b border-gray-100 last:border-b-0
                    ${isActive ? `${meta.bgColor} font-semibold` : 'hover:bg-gray-50'}
                  `}
                >
                  <span className={meta.color}>{meta.icon}</span>
                  <div>
                    <div className="font-medium text-gray-900">{meta.label}</div>
                    <div className="text-xs text-gray-600">{meta.description}</div>
                  </div>
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </div>

      {/* Info Card - Shows current context description */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className={`mt-2 hidden md:block px-4 py-2 rounded-lg text-sm ${currentMeta.bgColor} border`}
      >
        <p className={`font-medium ${currentMeta.color}`}>{currentMeta.description}</p>
      </motion.div>
    </div>
  );
};

export default ContextSwitcher;

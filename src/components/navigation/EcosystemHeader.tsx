import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown, Globe, BookOpen, Zap } from 'lucide-react';
import LanguageSwitcher from '@/components/LanguageSwitcher';

/**
 * Ecosystem Header Component
 * Displays navigation to all ecosystem modules and Sazi Life Academy
 */

interface EcosystemLink {
  name: string;
  description?: string;
  url: string;
  icon?: React.ReactNode;
}

const EcosystemHeader: React.FC = () => {
  const [isEcosystemOpen, setIsEcosystemOpen] = useState(false);
  const [isAcademyOpen, setIsAcademyOpen] = useState(false);
  const ecosystemRef = useRef<HTMLDivElement>(null);
  const academyRef = useRef<HTMLDivElement>(null);

  // Main ecosystem modules
  const ecosystemModules: EcosystemLink[] = [
    {
      name: 'Salatiso',
      description: 'The Engine & Vision',
      url: 'https://salatiso-lifecv.web.app/',
      icon: <Zap className="w-4 h-4" />,
    },
    {
      name: 'LifeSync',
      description: 'Sync Your Life',
      url: 'https://lifesync-lifecv.web.app/',
      icon: <Globe className="w-4 h-4" />,
    },
    {
      name: 'The Hub',
      description: 'Ecosystem Center',
      url: 'https://the-hub-lifecv.web.app/',
      icon: <Globe className="w-4 h-4" />,
    },
    {
      name: 'BizHelp',
      url: 'https://bizhelp-lifecv.web.app/',
    },
    {
      name: 'DocHelp',
      url: 'https://dochelp-lifecv.web.app/',
    },
    {
      name: 'Ekhaya',
      url: 'https://ekhaya-lifecv.web.app/',
    },
    {
      name: 'FamilyValue',
      url: 'https://familyvalue-lifecv.web.app/',
    },
    {
      name: 'FinHelp',
      url: 'https://finhelp-lifecv.web.app/',
    },
    {
      name: 'Flamea',
      url: 'https://flamea-lifecv.web.app/',
    },
    {
      name: 'LegalHelp',
      url: 'https://legalhelp-lifecv.web.app/',
    },
    {
      name: 'HrHelp',
      url: 'https://hrhelp-lifecv.web.app/',
    },
    {
      name: 'PigeeBack',
      url: 'https://pigeeback-lifecv.web.app/',
    },
    {
      name: 'PubHelp',
      url: 'https://pubhelp-lifecv.web.app/',
    },
    {
      name: 'SafetyHelp',
      url: 'https://safetyhelp-lifecv.web.app/',
    },
  ];

  // Sazi Life Academy modules
  const academyModules: EcosystemLink[] = [
    {
      name: 'Sazi Life Academy',
      description: 'Main Academy Platform',
      url: 'https://sazi-life-academy.web.app/',
      icon: <BookOpen className="w-4 h-4" />,
    },
    {
      name: 'Sazi Homeschooling',
      description: 'Homeschool Program',
      url: 'https://sazi-life-homeschooling.web.app/',
    },
    {
      name: 'Sazi Language Learn',
      description: 'Language Learning',
      url: 'https://sazi-life-language.web.app/',
    },
    {
      name: 'Sazi Home Life',
      description: 'Home Life Resources',
      url: 'https://sazi-life-home-life.web.app/',
    },
    {
      name: 'Sazi Code Create',
      description: 'Code & Development',
      url: 'https://sazi-life-code-create.web.app/',
    },
  ];

  // Handle clicking outside dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ecosystemRef.current && !ecosystemRef.current.contains(event.target as Node)) {
        setIsEcosystemOpen(false);
      }
      if (academyRef.current && !academyRef.current.contains(event.target as Node)) {
        setIsAcademyOpen(false);
      }
    };

    if (isEcosystemOpen || isAcademyOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isEcosystemOpen, isAcademyOpen]);

  const DropdownButton = ({
    label,
    isOpen,
    onClick,
  }: {
    label: string;
    isOpen: boolean;
    onClick: () => void;
  }) => (
    <button
      onClick={onClick}
      className="flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-ubuntu-warm-700 hover:bg-gray-100 transition-colors"
    >
      {label}
      <ChevronDown
        className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
      />
    </button>
  );

  const DropdownMenu = ({
    items,
    isOpen,
  }: {
    items: EcosystemLink[];
    isOpen: boolean;
  }) => {
    if (!isOpen) return null;

    return (
      <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-200 w-64 max-h-96 overflow-y-auto z-50">
        {items.map((item, index) => (
          <a
            key={index}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors group"
          >
            {item.icon && <div className="text-ubuntu-warm-600 mt-0.5">{item.icon}</div>}
            <div className="flex-1 min-w-0">
              <div className="font-medium text-gray-900 group-hover:text-ubuntu-warm-700">
                {item.name}
              </div>
              {item.description && (
                <div className="text-xs text-gray-500 truncate">{item.description}</div>
              )}
            </div>
          </a>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white shadow-sm border-b border-ubuntu-warm-200">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Ecosystem Links */}
          <div className="flex items-center gap-1">
            {/* Main Salatiso Link */}
            <a
              href="https://salatiso-lifecv.web.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-semibold text-white bg-ubuntu-warm-600 hover:bg-ubuntu-warm-700 transition-colors"
              title="Go to Salatiso - The Engine & Vision"
            >
              <Globe className="w-4 h-4" />
              Salatiso
            </a>

            {/* Ecosystem Dropdown */}
            <div ref={ecosystemRef} className="relative">
              <DropdownButton
                label="Ecosystem"
                isOpen={isEcosystemOpen}
                onClick={() => {
                  setIsEcosystemOpen(!isEcosystemOpen);
                  setIsAcademyOpen(false);
                }}
              />
              <DropdownMenu items={ecosystemModules} isOpen={isEcosystemOpen} />
            </div>

            {/* Sazi Life Academy Dropdown */}
            <div ref={academyRef} className="relative">
              <DropdownButton
                label="Academy"
                isOpen={isAcademyOpen}
                onClick={() => {
                  setIsAcademyOpen(!isAcademyOpen);
                  setIsEcosystemOpen(false);
                }}
              />
              <DropdownMenu items={academyModules} isOpen={isAcademyOpen} />
            </div>
          </div>

          {/* Right side - Language Switcher */}
          <LanguageSwitcher />
        </div>
      </div>
    </div>
  );
};

export default EcosystemHeader;

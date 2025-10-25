import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from '@/contexts/I18nContext';
import { Globe } from 'lucide-react';
import { AccessibleMenu, AccessibleMenuItem } from '@/components/accessibility';

interface LanguageSwitcherProps {
  className?: string;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ className = '' }) => {
  const router = useRouter();
  const { locale, setLocale, languages } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const languageList = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'xh', name: 'isiXhosa', flag: '🇿🇦' },
    { code: 'zu', name: 'isiZulu', flag: '🇿🇦' },
    { code: 'af', name: 'Afrikaans', flag: '🇿🇦' }
  ];

  const currentLanguage = languageList.find(lang => lang.code === locale) || languageList[0];

  const switchLanguage = (newLocale: string) => {
    setLocale(newLocale);
    setIsOpen(false);
  };

  const handleToggle = () => setIsOpen(!isOpen);
  const handleClose = () => setIsOpen(false);

  return (
    <AccessibleMenu
      trigger={
        <div className="flex items-center space-x-2 px-3 py-2 rounded-lg border border-gray-200 hover:border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">{currentLanguage.name}</span>
          <span className="sm:hidden">{currentLanguage.flag}</span>
          <svg className="h-4 w-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      }
      isOpen={isOpen}
      onToggle={handleToggle}
      onClose={handleClose}
      placement="bottom-right"
      className={className}
    >
      {languageList.map((language) => (
        <AccessibleMenuItem
          key={language.code}
          onClick={() => switchLanguage(language.code)}
          className={language.code === locale ? 'bg-primary-50 text-primary-600' : ''}
        >
          <div className="flex items-center space-x-3">
            <span className="text-lg">{language.flag}</span>
            <span>{language.name}</span>
            {language.code === locale && (
              <svg className="h-4 w-4 ml-auto text-primary-600" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </div>
        </AccessibleMenuItem>
      ))}
    </AccessibleMenu>
  );
};

export default LanguageSwitcher;
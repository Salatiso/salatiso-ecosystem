import React, { ReactNode } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Menu, X, Home, Info, MapPin, Book, GraduationCap, Sparkles, TestTube, FileText, Wifi } from 'lucide-react';
import { useState } from 'react';
import { SkipLink } from '@/components/accessibility';

interface PublicLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

const PublicLayout: React.FC<PublicLayoutProps> = ({
  children,
  title = "Mlandeli Notemba Investments",
  description = "Family holding company stewarding the Salatiso ecosystem: Sazi Life Academy, Homestead OS, LifeKey, and pending patents"
}) => {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'About', href: '/about', icon: Info },
    { name: 'Journey', href: '/journey', icon: MapPin },
    { name: 'Templates', href: '/templates', icon: FileText },
    { name: 'Sonny Network', href: '/sonny', icon: Wifi },
    { name: 'Training Academy', href: '/training', icon: GraduationCap },
    { name: 'Testing Hub', href: '/testing', icon: TestTube },
    { name: 'Kids Zone', href: '/training#kids-zone', icon: Sparkles },
  ];

  const footerQuickLinks = [
    ...navigation,
    { name: 'Contact', href: '/contact' },
    { name: 'Ecosystem Overview', href: '/ecosystem' }
  ];

  const ecosystemLinks = [
    { name: 'The Hub', href: 'https://the-hub-lifecv.web.app/', external: true },
    { name: 'Salatiso.com', href: 'https://salatiso-lifecv.web.app/', external: true },
    { name: 'BizHelp', href: 'https://bizhelp-lifecv.web.app/', external: true },
    { name: 'DocHelp', href: 'https://dochelp-lifecv.web.app/', external: true },
    { name: 'eKhaya', href: 'https://ekhaya-lifecv.web.app/', external: true },
    { name: 'FamilyValue', href: 'https://familyvalue-lifecv.web.app/', external: true },
    { name: 'FinHelp', href: 'https://finhelp-lifecv.web.app/', external: true },
    { name: 'Flamea', href: 'https://flamea-lifecv.web.app/', external: true },
    { name: 'LegalHelp', href: 'https://legalhelp-lifecv.web.app/', external: true },
    { name: 'LifeSync', href: 'https://lifesync-lifecv.web.app/', external: true },
    { name: 'HrHelp', href: 'https://hrhelp-lifecv.web.app/', external: true },
    { name: 'PigeeBack', href: 'https://pigeeback-lifecv.web.app/', external: true },
    { name: 'PubHelp', href: 'https://pubhelp-lifecv.web.app/', external: true },
    { name: 'SafetyHelp', href: 'https://safetyhelp-lifecv.web.app/', external: true },
    { name: 'LifeCV', href: 'https://lifecv-d2724.web.app/', external: true }
  ];

  const academyLinks = [
    { name: 'Sazi Life Academy', href: 'https://sazi-life-academy.web.app/', external: true },
    { name: 'Sazi Homeschooling', href: 'https://sazi-life-homeschooling.web.app/', external: true },
    { name: 'Sazi Language Learn', href: 'https://sazi-life-language.web.app/', external: true },
    { name: 'Sazi Home Life', href: 'https://sazi-life-home-life.web.app/', external: true },
    { name: 'Sazi Code Create', href: 'https://sazi-life-code-create.web.app/', external: true }
  ];

  const isActive = (path: string) => router.pathname === path;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="alternate icon" href="/favicon.ico" />
      </Head>

      {/* Skip Navigation Links */}
      <SkipLink href="#main-content">Skip to main content</SkipLink>
      <SkipLink href="#navigation">Skip to navigation</SkipLink>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-50">
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link href="/" className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">MNI</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-gray-900 text-base leading-tight">
                    Mlandeli-Notemba Investments
                  </span>
                  <span className="text-xs text-gray-500 font-light">
                    by Salatiso
                  </span>
                </div>
              </Link>

              {/* Desktop Navigation */}
              <nav id="navigation" className="hidden md:flex items-center space-x-8" aria-label="Main navigation">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                      isActive(item.href)
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                ))}
              </nav>

              {/* Auth Button */}
              <div className="hidden md:flex items-center space-x-4">
                <Link href="/intranet" className="btn-primary btn flex items-center space-x-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-white/20 text-[0.6rem] font-bold uppercase tracking-wide text-white">
                    MNI
                  </div>
                  <span>MNI Intranet</span>
                </Link>
              </div>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 bg-white">
              <div className="px-6 py-4 space-y-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                      isActive(item.href)
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                ))}
                <div className="pt-4 mt-4 border-t border-gray-200">
                  <Link
                    href="/intranet"
                    className="btn-primary btn w-full justify-center flex items-center space-x-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-white/20 text-[0.6rem] font-bold uppercase tracking-wide text-white">
                      MNI
                    </div>
                    <span>MNI Intranet</span>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </header>

        {/* Main Content */}
        <main id="main-content">{children}</main>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-5 gap-8">
              {/* Company Info */}
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">MNI</span>
                  </div>
                  <span className="font-display font-bold text-lg">
                    Mlandeli-Notemba
                  </span>
                </div>
                <p className="text-gray-400 text-sm">
                  Family holding company for the Salatiso ecosystem — housing Sazi Life Academy, Homestead OS, LifeKey, and pending patents.
                </p>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
                <ul className="space-y-2">
                  {footerQuickLinks.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-gray-400 hover:text-white text-sm transition-colors"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Ecosystem Modules */}
              <div>
                <h3 className="font-semibold text-lg mb-4">Ecosystem Modules</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  {ecosystemLinks.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        target={item.external ? "_blank" : undefined}
                        rel={item.external ? "noopener noreferrer" : undefined}
                        className="hover:text-white transition-colors"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Sazi Life Academy */}
              <div>
                <h3 className="font-semibold text-lg mb-4">Sazi Life Academy</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  {academyLinks.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        target={item.external ? "_blank" : undefined}
                        rel={item.external ? "noopener noreferrer" : undefined}
                        className="hover:text-white transition-colors"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact */}
              <div>
                <h3 className="font-semibold text-lg mb-4">Contact</h3>
                <div className="space-y-3 text-sm text-gray-400">
                  <div>
                    <p className="text-gray-300 font-medium">Email</p>
                    <div className="flex flex-col space-y-1">
                      <a
                        href="mailto:hub@salatiso.com"
                        className="hover:text-white transition-colors"
                      >
                        hub@salatiso.com
                      </a>
                      <a
                        href="mailto:lifecvhub@gmail.com"
                        className="hover:text-white transition-colors"
                      >
                        lifecvhub@gmail.com
                      </a>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-300 font-medium">Business Enquiries</p>
                    <a
                      href="https://bizhelp-lifecv.web.app/marketplace"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-white transition-colors"
                    >
                      BizHelp Marketplace
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-800 mt-8 pt-8 text-center">
              <p className="text-gray-400 text-sm">
                © 2025 Mlandeli Notemba Investments (Pty) Ltd. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default PublicLayout;
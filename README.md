# Salatiso**Current Status:**
- ✅ **Beta Testing System**: Fully implemented and deployed (October 8, 2025)
- ✅ **Homestead OS Phase 1**: Foundation complete (October 8, 2025)
- ✅ **Phase 2 Family & Business Content**: Interactive tree, timeline, organogram, and career paths deployed (October 10, 2025)
- 🔄 **Phase 3 Sazi Life Academy**: Learning system integration in progress (October 10, 2025)

**Documentation:**
- 📋 [**HOMESTEAD_OS_INTEGRATION_PLAN.md**](./HOMESTEAD_OS_INTEGRATION_PLAN.md) - Complete 12-week implementation roadmap
- 📊 [**MNI_ECOSYSTEM_UPGRADE_SUMMARY.md**](./MNI_ECOSYSTEM_UPGRADE_SUMMARY.md) - Current status and cost analysis
- 🧪 [**Beta Testing System**](./src/components/beta-testing/) - Automated family assignment and weekly reporting
- 🌳 [**Family Content**](./src/components/family/) - Interactive family tree and timeline

**New Features:**
- Interactive family tree visualization with Ubuntu design
- Family timeline with chronological history and educational content
- Business organogram with career paths
- Community collaboration tools
- Ubuntu wisdom integration throughout interface
- Real-time collaborative editing with family-first navigation

## Overview

A comprehensive family governance and business management platform built on Ubuntu principles, supporting all 11 official South African languages.

## 🚀 Homestead OS Integration (October 2025)

**Major upgrade in progress!** Homestead OS integrates Ubuntu philosophy with family-first design principles.

**Current Status:**
- ✅ **Beta Testing System**: Fully implemented and deployed (October 8, 2025)
- 🔄 **Homestead OS Integration**: Phase 2 complete - Family & Business content deployed (October 10, 2025)

**Documentation:**
- � [**HOMESTEAD_OS_INTEGRATION_PLAN.md**](./HOMESTEAD_OS_INTEGRATION_PLAN.md) - Complete 12-week implementation roadmap
- 📊 [**MNI_ECOSYSTEM_UPGRADE_SUMMARY.md**](./MNI_ECOSYSTEM_UPGRADE_SUMMARY.md) - Current status and cost analysis
- 🧪 [**Beta Testing System**](./src/components/beta-testing/) - Automated family assignment and weekly reporting

**New Features Completed:**
- ✅ Interactive family tree visualization with Ubuntu design
- ✅ Family timeline with chronological history and educational content
- ✅ Business organogram with hierarchical team structure
- ✅ Career paths framework with detailed role profiles
- Community collaboration tools
- Ubuntu wisdom integration throughout interface
- Real-time collaborative editing with family-first navigation

## Features

### 🧪 Beta Testing System
- **Automated Family Assignment**: Smart beta tester allocation based on family roles
- **Weekly Performance Reports**: Automated tracking and reporting system
- **LifeCV Integration**: Beta testing achievements integrated into career documents
- **Real-time Analytics**: Performance metrics and engagement tracking
- **Family-First Access**: Restricted to authorized family members only

### 🌍 Multi-Language Support
- **Complete Translations**: English, isiXhosa, isiZulu, Afrikaans
- **Additional Languages**: Sesotho, Setswana, siSwati, Tshivenda, Xitsonga, isiNdebele, Sepedi
- **Client-Side Translation**: Fast switching without page reload
- **Persistent Preferences**: Language selection saved locally

### 🏠 Family Governance
- **Dashboard**: Ubuntu-centered family overview
- **Member Management**: Family directory and profiles
- **Project Tracking**: Cross-venture initiative management
- **Business Planning**: Strategic oversight and metrics

### 🎓 Development & Learning
- **Career Paths**: Structured development tracks
- **Learning Hub**: Sazi Life Academy integration
- **LifeCV**: Recognition and achievement tracking
- **Timeline**: Portfolio delivery management

### 🔧 Ecosystem Integration
- **DocuHelp**: Document automation workflows
- **SafetyHelp**: Safety protocol management
- **BizHelp**: Business operation support
- **LifeSync**: Community hub integration

## Technology Stack

- **Framework**: Next.js 14 (Static Export)
- **Styling**: Tailwind CSS
- **Authentication**: Firebase Auth (Google OAuth)
- **Deployment**: Firebase Hosting
- **Internationalization**: Custom client-side i18n
- **Icons**: Lucide React

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Firebase account

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd salatiso-com-react

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

### Environment Variables

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

## Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run export       # Generate static export
npm run deploy       # Build + Export + Firebase deploy

# Testing
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Generate coverage report

# Linting
npm run lint         # Run ESLint
```

```
src/
├── components/          # Reusable UI components
│   ├── beta-testing/   # Beta testing system components
│   │   ├── BetaTesting.tsx
│   │   ├── TestingDashboard.tsx
│   │   ├── WeeklyReport.tsx
│   │   └── PerformanceTracker.tsx
│   ├── family/         # Family content components
│   │   ├── FamilyTree.tsx
│   │   └── FamilyTimeline.tsx
│   ├── icons/          # Ubuntu-inspired icons
│   ├── layouts/        # Layout components
│   └── LanguageSwitcher.tsx
├── contexts/           # React contexts
│   ├── AuthContext.tsx
│   └── I18nContext.tsx
├── pages/             # Next.js pages
│   ├── family/        # Family content pages
│   │   ├── tree.tsx
│   │   └── timeline.tsx
│   ├── intranet/      # Protected intranet pages
│   ├── testing.tsx    # Beta testing page
│   └── _app.tsx
├── styles/            # Global styles
└── types/             # TypeScript definitions
```

### Adding New Languages

1. **Add Language Code**: Update `I18nContext.tsx` languages object
2. **Create Translations**: Add language-specific translations to the context
3. **Test Implementation**: Verify language switching and fallbacks
4. **Update Documentation**: Add language to supported list

### Translation Keys

Translation keys follow dot notation:
```typescript
// Common UI elements
t('common.save')           // "Save"
t('common.loading')        // "Loading..."

// Navigation
t('navigation.home')       // "Home"
t('intranet.dashboard')   // "Dashboard"

// Feature-specific
t('career.title')         // "Career Development Hub"
t('learning.subtitle')    // "Curated learning experiences..."
```

## Deployment

### Firebase Deployment

The application is deployed to two Firebase projects:

- **Production**: https://salatiso-lifecv.web.app/ (permanent home)
- **Testing**: https://lifecv-d2724.web.app/ (for testing and staging)

#### Deploy to Production
```bash
npm run build
firebase deploy --only hosting:salatiso-lifecv
```

#### Deploy to Testing
```bash
npm run build
firebase deploy --project testing --only hosting:lifecv-d2724
```

#### Deploy to Both Environments
```bash
npm run build
firebase deploy --only hosting
```

#### Preview Deployment
```bash
firebase hosting:channel:deploy preview
```

### Static Export

The application uses Next.js static export for optimal Firebase hosting compatibility:

```bash
npm run build     # Builds and exports to /out directory
```

## Authentication

### Authorized Users

Access is restricted to family members with authorized email addresses configured in Firebase. The authorization list is managed through the `AUTHORIZED_FAMILY_MEMBERS.md` file.

### Adding New Users

1. Add email to authorized list in Firebase configuration
2. Update `AUTHORIZED_FAMILY_MEMBERS.md` documentation
3. Notify user of access availability

## Contributing

### Development Workflow

1. **Feature Branch**: Create feature branch from `main`
2. **Implementation**: Follow coding standards and patterns
3. **Testing**: Ensure tests pass and add new ones as needed
4. **Translation**: Add i18n support for new UI strings
5. **Documentation**: Update relevant documentation
6. **Pull Request**: Submit PR with clear description

### Coding Standards

- **TypeScript**: Strict typing required
- **Components**: Functional components with hooks
- **Styling**: Tailwind CSS utility classes
- **Internationalization**: All user-facing strings must be translatable
- **Accessibility**: WCAG 2.1 AA compliance

### Testing

- **Unit Tests**: Jest + React Testing Library
- **Integration Tests**: Component interaction testing
- **E2E Tests**: Cypress for critical user flows
- **Translation Testing**: Verify all languages display correctly

## Ubuntu Principles

The platform embodies Ubuntu philosophy through:

- **Community-First Design**: Prioritizing family collective success
- **Inclusive Access**: Multi-language support for all family members
- **Transparent Governance**: Open project tracking and decision-making
- **Collaborative Growth**: Shared learning and development opportunities
- **Intergenerational Wisdom**: Bridging traditional values with modern technology

## Performance

### Optimization Features

- **Static Generation**: Pre-built pages for fast loading
- **Code Splitting**: Dynamic imports for optimal bundle size
- **Image Optimization**: Next.js Image component with WebP support
- **Caching**: Firebase CDN with aggressive caching policies
- **Lazy Loading**: Components loaded on demand

### Performance Metrics

- **Lighthouse Score**: 95+ across all metrics
- **First Contentful Paint**: <1.5s
- **Largest Contentful Paint**: <2.5s
- **Cumulative Layout Shift**: <0.1
- **Time to Interactive**: <3s

## Security

### Security Measures

- **Authentication**: Firebase Auth with Google OAuth
- **Authorization**: Email-based access control
- **HTTPS**: Enforced SSL/TLS encryption
- **CSP**: Content Security Policy headers
- **Data Validation**: Input sanitization and validation

### Privacy

- **Data Minimization**: Only necessary data collected
- **Local Storage**: Language preferences only
- **No Tracking**: No third-party analytics
- **Family-Only**: Restricted access by design

## Browser Support

- **Modern Browsers**: Chrome 80+, Firefox 75+, Safari 13+, Edge 80+
- **Mobile**: iOS Safari 13+, Chrome Mobile 80+
- **Progressive Enhancement**: Core functionality works without JavaScript
- **Accessibility**: Screen reader and keyboard navigation support

## License

This project is proprietary software for the Salatiso Family ecosystem. All rights reserved.

## Support

For technical support or feature requests:

- **Documentation**: See `/docs` directory
- **Issues**: Internal family development team
- **Security**: Contact family IT administrator

---

**Last Updated**: October 8, 2025  
**Version**: Homestead OS v1.0 (Beta Testing Complete)  
**Build Status**: ✅ Production Ready (Beta Testing Deployed)
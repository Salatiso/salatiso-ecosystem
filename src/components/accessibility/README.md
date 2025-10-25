# Accessibility System

This directory contains a comprehensive accessibility system for the Salatiso Ecosystem platform, implementing WCAG 2.1 AA compliance standards.

## Overview

The accessibility system provides:
- **WCAG 2.1 AA Compliant Components**: Form inputs, navigation, and interactive elements
- **User Preference Management**: High contrast, reduced motion, large text, and color scheme options
- **Screen Reader Support**: ARIA labels, live regions, and announcements
- **Keyboard Navigation**: Full keyboard accessibility with focus management
- **Accessibility Auditing**: Automated scanning and reporting of accessibility issues

## Components

### Core Utilities (`AccessibilityUtils.tsx`)

#### Hooks
- `useReducedMotion()`: Detects user's motion preferences
- `useHighContrast()`: Detects high contrast mode preference
- `useKeyboardNavigation()`: Provides keyboard navigation state
- `useAnnouncer()`: Screen reader announcements utility

#### Components
- `SkipLink`: Skip navigation links for keyboard users
- `FocusTrap`: Manages focus within modal dialogs
- `LiveRegion`: Announces dynamic content changes to screen readers

### Form Components (`AccessibleForm.tsx`)

WCAG-compliant form components with proper ARIA support:

- `AccessibleInput`: Text input with validation and error handling
- `AccessibleTextarea`: Multi-line text input
- `AccessibleSelect`: Dropdown selection with keyboard navigation
- `AccessibleCheckbox`: Checkbox with proper labeling
- `AccessibleRadioGroup`: Radio button group with arrow key navigation

### Navigation Components (`AccessibleNavigation.tsx`)

Accessible navigation patterns:

- `AccessibleMenu`: Dropdown menus with keyboard support
- `AccessibleBreadcrumbs`: Navigation breadcrumbs
- `AccessibleTabs`: Tabbed interfaces
- `AccessibleModal`: Modal dialogs with focus management

### Configuration System (`AccessibilityConfig.tsx`)

User preference management:

- `AccessibilityProvider`: Context provider for accessibility settings
- `AccessibilitySettingsPanel`: Comprehensive settings interface
- `AccessibilityToolbar`: Floating toolbar for quick accessibility toggles
- `useAccessibility()`: Hook to access and modify settings

### Audit Tools (`AccessibilityAudit.tsx`)

Development and testing utilities:

- `useAccessibilityAudit()`: Automated accessibility scanning
- `AccessibilityAuditDashboard`: Visual audit results interface
- `useAccessibilityTesting()`: Integration testing hooks

## Usage

### Basic Setup

Wrap your application with the accessibility provider:

```tsx
import { AccessibilityProvider, AccessibilityToolbar } from '@/components/accessibility';

function MyApp({ Component, pageProps }) {
  return (
    <AccessibilityProvider>
      <Component {...pageProps} />
      <AccessibilityToolbar />
    </AccessibilityProvider>
  );
}
```

### Using Accessible Components

Replace standard form elements with accessible versions:

```tsx
import { AccessibleInput, AccessibleSelect } from '@/components/accessibility';

function ContactForm() {
  return (
    <form>
      <AccessibleInput
        label="Name"
        required
        error={errors.name}
      />

      <AccessibleSelect
        label="Country"
        options={countries}
        value={selectedCountry}
        onChange={setSelectedCountry}
      />
    </form>
  );
}
```

### Accessibility Hooks

Use hooks for dynamic accessibility features:

```tsx
import { useAnnouncer, useReducedMotion } from '@/components/accessibility';

function DynamicContent() {
  const announce = useAnnouncer();
  const prefersReducedMotion = useReducedMotion();

  const handleUpdate = () => {
    announce('Content updated successfully');
    // Animate only if user doesn't prefer reduced motion
    if (!prefersReducedMotion) {
      // ... animation code
    }
  };

  return <button onClick={handleUpdate}>Update</button>;
}
```

### Skip Links

Add skip navigation to page layouts:

```tsx
import { SkipLink } from '@/components/accessibility';

function Layout({ children }) {
  return (
    <>
      <SkipLink href="#main-content">Skip to main content</SkipLink>
      <header>...</header>
      <main id="main-content">{children}</main>
    </>
  );
}
```

### Focus Management

Use focus traps for modals:

```tsx
import { FocusTrap } from '@/components/accessibility';

function Modal({ isOpen, onClose, children }) {
  return (
    <FocusTrap isActive={isOpen} onEscape={onClose}>
      <div role="dialog" aria-modal="true">
        {children}
      </div>
    </FocusTrap>
  );
}
```

### Accessibility Auditing

Add audit tools during development:

```tsx
import { AccessibilityAuditDashboard, useAccessibilityAudit } from '@/components/accessibility';

function DevTools() {
  const { issues, isScanning, scanForIssues, clearIssues } = useAccessibilityAudit({
    autoScan: process.env.NODE_ENV === 'development'
  });

  return (
    <AccessibilityAuditDashboard
      issues={issues}
      isScanning={isScanning}
      onScan={scanForIssues}
      onClear={clearIssues}
    />
  );
}
```

## Accessibility Settings

The system supports the following user preferences:

### Visual Preferences
- **High Contrast**: Enhanced color contrast for better visibility
- **Reduced Motion**: Disables animations and transitions
- **Large Text**: Increases font sizes throughout the application

### Navigation
- **Focus Visible**: Ensures focus indicators are always visible
- **Skip Links**: Shows skip navigation links

### Screen Reader Support
- **Screen Reader Optimized**: Enhanced ARIA labeling and structure
- **Announce Page Changes**: Automatic announcements for navigation

### Color Vision
- **Color Schemes**: Support for different color vision deficiencies
  - Default
  - Deuteranopia (green-weak)
  - Protanopia (red-weak)
  - Tritanopia (blue-weak)

## WCAG Compliance

This system implements WCAG 2.1 AA compliance for:

### Perceivable
- **Text Alternatives** (1.1.1): Alt text for images, ARIA labels
- **Time-based Media** (1.2.x): Not applicable (no media content)
- **Adaptable** (1.3.x): Semantic markup, heading hierarchy
- **Distinguishable** (1.4.x): Color contrast, text resizing

### Operable
- **Keyboard Accessible** (2.1.1): All interactive elements keyboard accessible
- **Enough Time** (2.2.x): No time limits on content
- **Seizures and Physical Reactions** (2.3.x): Reduced motion support
- **Navigable** (2.4.x): Skip links, focus management, logical tab order

### Understandable
- **Readable** (3.1.x): Language attributes, simplified content option
- **Predictable** (3.2.x): Consistent navigation and behavior
- **Input Assistance** (3.3.x): Form validation, error messages

### Robust
- **Compatible** (4.1.x): Valid markup, ARIA support

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Development Guidelines

### Component Development
1. Always use semantic HTML elements
2. Provide ARIA labels and descriptions
3. Ensure keyboard navigation support
4. Test with screen readers (NVDA, JAWS, VoiceOver)
5. Validate color contrast ratios
6. Support user preferences (motion, contrast, etc.)

### Testing
- Use automated accessibility audit tools
- Manual testing with keyboard navigation
- Screen reader testing
- Color contrast validation
- User preference testing

### Integration
- Import components from the index file: `@/components/accessibility`
- Wrap app with `AccessibilityProvider`
- Include `AccessibilityToolbar` for user control
- Use audit tools during development

## Contributing

When adding new components:
1. Follow WCAG guidelines
2. Include proper TypeScript types
3. Add accessibility documentation
4. Test with assistive technologies
5. Update this README if needed

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/TR/WCAG21/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM Accessibility Resources](https://webaim.org/resources/)
- [MDN Accessibility Documentation](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
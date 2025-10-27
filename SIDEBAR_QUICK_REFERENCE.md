# Enhanced Sidebar Navigation - Quick Reference

## 🚀 Quick Start

### Import and Use
```tsx
import { EnhancedSidebar } from '@/components/navigation';

<EnhancedSidebar onLogout={handleLogout} />
```

### File Locations
```
src/components/navigation/
├── Sidebar.tsx (main component)
├── NavSection.tsx (collapsible sections)
├── NavItem.tsx (individual links)
├── navigation.types.ts (types)
└── index.ts (barrel export)

src/config/
└── navigation.config.ts (config)

src/hooks/
└── useNavigation.ts (state management)
```

---

## 🎯 Key Components

### EnhancedSidebar
**Main component - handles everything**

```tsx
<EnhancedSidebar 
  onLogout={async () => {}} 
/>
```

**Props:**
- `onLogout`: async function called when user clicks logout

**Features:**
- Responsive (desktop/tablet/mobile)
- Mobile hamburger menu
- Section collapse/expand
- Active item highlighting
- localStorage persistence

---

### useNavigation Hook
**State management for sidebar**

```tsx
const {
  state,              // { expandedSections, activeItem }
  toggleSection,      // (id: string) => void
  expandSection,      // (id: string) => void
  collapseSection,    // (id: string) => void
  setActiveItem,      // (id: string) => void
} = useNavigation();
```

**Example:**
```tsx
const { state, toggleSection } = useNavigation();

<button onClick={() => toggleSection('personal')}>
  Toggle Personal Section
</button>
```

---

### Navigation Structure

| Section | Items | Key Link |
|---------|-------|----------|
| 📊 Dashboard | 1 | Dashboard |
| 👤 Personal | 7 | My Profile, LifeCV, Calendar, Projects |
| 👨‍👩‍👧‍👦 Family | 8 | Family Tree, Family Calendar, Household |
| 💼 Professional | 7 | Business Ops, Organogram, Business Plan |
| 🌐 Communities | 6 | Sonny Network, PigeeBack, LifeSync |
| 🔧 Common Tools | 6 | Assets, Analytics, Sazi Academy, Sync |

---

## 🔗 Context-Aware Links

### Calendar Link Builder
```tsx
import { buildCalendarLink } from '@/components/navigation';

buildCalendarLink('family')     // /calendar?context=family
buildCalendarLink('professional') // /calendar?context=professional
buildCalendarLink('individual')   // /calendar?context=individual
```

### Asset Link Builder
```tsx
import { buildAssetLink } from '@/components/navigation';

buildAssetLink('family')        // /assets?context=family
buildAssetLink('professional')  // /assets?context=professional
```

### Project Link Builder
```tsx
import { buildProjectLink } from '@/components/navigation';

buildProjectLink('family')      // /projects?context=family
buildProjectLink('professional') // /projects?context=professional
```

---

## 🎨 Badge Types

| Badge | Color | Usage |
|-------|-------|-------|
| `core` | Blue | Core platform features |
| `mesh` | Cyan | Mesh network features |
| `mni` | Purple | MNI specific |
| `external` | Amber | External apps |
| `new` | Green | New features |

**Example:**
```tsx
{
  id: 'lifecv',
  label: 'LifeCV',
  href: '/intranet/lifecv',
  badge: 'core', // Shows blue "Core" badge
}
```

---

## 📱 Responsive Breakpoints

| Screen Size | Behavior |
|------------|----------|
| ≥1024px | Sidebar always visible, width 288px |
| 768px-1023px | Collapsible drawer with overlay |
| <768px | Full-screen drawer, hamburger menu |

---

## ♿ Accessibility Features

- ✅ WCAG 2.1 AA compliant
- ✅ Keyboard navigation (Tab, Enter, Escape)
- ✅ Screen reader support (ARIA)
- ✅ High contrast focus indicators
- ✅ Semantic HTML

**Keyboard Shortcuts:**
- `Tab` - Navigate items
- `Enter` / `Space` - Activate link
- `Escape` - Close mobile drawer (if open)

---

## 💾 localStorage Keys

```
'sidebar:expandedSections' -> { personal: true, family: false, ... }
'sidebar:activeItem' -> 'dashboard'
```

Clear with:
```tsx
localStorage.removeItem('sidebar:expandedSections');
localStorage.removeItem('sidebar:activeItem');
```

---

## 🐛 Common Issues

### Mobile drawer won't close?
Ensure `escape` key handling is enabled. Check `useMobile()` hook.

### Links not highlighting?
Use `useActiveNavPath()` hook or check URL matches item href.

### localStorage not persisting?
Check browser localStorage is enabled.

### Sidebar not responsive?
Verify Tailwind CSS breakpoints are configured. Check `tailwind.config.ts`.

---

## 🔍 Example Integration

```tsx
// src/components/layouts/IntranetLayout.tsx
import { EnhancedSidebar } from '@/components/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/router';

export default function IntranetLayout({ children }) {
  const { logout } = useAuth();
  const router = useRouter();
  
  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <div className="flex h-screen bg-slate-900">
      <EnhancedSidebar onLogout={handleLogout} />
      <main className="flex-1 overflow-auto bg-slate-950">
        {children}
      </main>
    </div>
  );
}
```

---

## 📚 Additional Resources

- Full Implementation: `SIDEBAR_NAVIGATION_IMPLEMENTATION.md`
- Navigation Config: `src/config/navigation.config.ts`
- Navigation Types: `src/components/navigation/navigation.types.ts`
- Component Source: `src/components/navigation/Sidebar.tsx`

---

## ⚡ Performance Tips

1. **Lazy load sections** - Only expand visible sections
2. **Use React.memo** - NavItem, NavSection are memoized
3. **Cache links** - Calendar/Asset links use memoization
4. **Optimize icons** - Use SVG icons, not images
5. **Minimize re-renders** - useCallback for handlers

---

## 🚢 Deployment Checklist

- [ ] All files created
- [ ] No TypeScript errors
- [ ] Sidebar renders correctly
- [ ] All links work
- [ ] Mobile responsive
- [ ] Accessibility passes
- [ ] localStorage works
- [ ] Tests pass
- [ ] Deployed to staging
- [ ] QA approved
- [ ] Deployed to production

---

*Happy navigating! 🚀*

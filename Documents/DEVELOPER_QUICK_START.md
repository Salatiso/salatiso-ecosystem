# MNI Web Apps Upgrade - Developer Quick Start
## Getting Started with Phase 1 Development

**Version:** 1.0  
**Date:** October 8, 2025  
**Target:** Development Team (Solo, Tina, Visa, Kwakho)

---

## 📚 Required Reading (Priority Order)

1. **First:** [UPGRADE_EXECUTIVE_SUMMARY.md](./UPGRADE_EXECUTIVE_SUMMARY.md) (15 min read)
   - Understand the big picture
   - Review cost and timeline
   - See what we're building

2. **Second:** [MNI_WEB_APPS_UPGRADE_PLAN.md](./MNI_WEB_APPS_UPGRADE_PLAN.md) (30 min read)
   - Detailed phase breakdown
   - Your specific tasks
   - Success metrics

3. **Reference:** [TECHNICAL_SPECIFICATION_V2.md](./TECHNICAL_SPECIFICATION_V2.md)
   - Architecture diagrams
   - Data models
   - Security rules

4. **Reference:** [COMPONENT_LIBRARY.md](./COMPONENT_LIBRARY.md)
   - UI components to build
   - Usage examples
   - Design system

5. **Reference:** [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
   - API endpoints
   - Request/response formats
   - Authentication

---

## 🎯 Phase 1 Goals (Week 1-2)

### Week 1 Deliverables

#### Solo (Lead Developer) - 40 hours
**Day 1-2: Setup & Planning**
- [ ] Review all upgrade documentation
- [ ] Setup development environment
- [ ] Create project board (Trello/Asana)
- [ ] Initialize git branch: `feature/v2-upgrade`

**Day 3-5: Foundation Work**
- [ ] Setup shared component structure
- [ ] Implement Ubuntu theme provider
- [ ] Create base layout components
- [ ] Setup Firestore data models

**Day 6-10: Family Tree Component**
- [ ] Install react-flow-renderer
- [ ] Build FamilyTree component
- [ ] Create FamilyTreeNode sub-component
- [ ] Implement pan/zoom controls
- [ ] Add click handlers

**Estimated Hours:** 40 hours (full week)

---

#### Tina (Support Developer) - 15 hours
**Tasks:**
- [ ] Review component library documentation
- [ ] Setup testing environment
- [ ] Create FamilyMemberCard component
- [ ] Build FamilyNavigation component
- [ ] Write unit tests for components

**Estimated Hours:** 15 hours (3 days)

---

#### Visa (QA & Content) - 10 hours
**Tasks:**
- [ ] Review Ubuntu wisdom content
- [ ] Prepare family data structure (Excel/JSON)
- [ ] Test existing features
- [ ] Document current user flows
- [ ] Create test data for development

**Estimated Hours:** 10 hours (2 days)

---

#### Kwakho (Content & Design) - 5 hours
**Tasks:**
- [ ] Review Ubuntu color scheme
- [ ] Gather family photos (with permissions)
- [ ] Prepare cultural elements/patterns
- [ ] Draft Ubuntu wisdom quotes
- [ ] Review design mockups

**Estimated Hours:** 5 hours (1 day)

---

## 🛠️ Development Setup

### 1. Environment Setup

```bash
# Navigate to project directory
cd d:/WebSites/salatiso-ecosystem/Salatiso-React-App

# Ensure Node.js 18+ installed
node --version

# Install dependencies
npm install

# Install new dependencies for Phase 1
npm install react-flow-renderer d3 date-fns
npm install --save-dev @types/d3
```

### 2. Create Feature Branch

```bash
# Create and switch to feature branch
git checkout -b feature/v2-upgrade

# Create phase-specific branch
git checkout -b feature/v2-phase1-foundation
```

### 3. Environment Variables

Ensure `.env.local` has all Firebase credentials:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

### 4. Start Development Server

```bash
npm run dev
```

Access at: http://localhost:3000

---

## 📁 File Structure for Phase 1

### New Directories to Create

```bash
# Family components
mkdir src/components/family
mkdir src/components/ubuntu
mkdir src/components/ui

# Contexts
mkdir src/contexts

# Hooks
mkdir src/hooks

# Services
mkdir src/services

# Utils
mkdir src/utils

# Types
# (already exists, will extend)

# Test directories
mkdir src/components/family/__tests__
mkdir src/components/ubuntu/__tests__
```

### Files to Create (Week 1)

```
src/
├── components/
│   ├── family/
│   │   ├── FamilyTree.tsx          ← Solo (Priority 1)
│   │   ├── FamilyTreeNode.tsx      ← Solo
│   │   ├── FamilyTreeControls.tsx  ← Solo
│   │   ├── FamilyMemberCard.tsx    ← Tina
│   │   └── FamilyNavigation.tsx    ← Tina
│   ├── ubuntu/
│   │   ├── UbuntuThemeProvider.tsx ← Solo (Priority 2)
│   │   └── UbuntuWisdom.tsx        ← Week 2
│   └── ui/
│       ├── Button.tsx              ← Tina
│       ├── Card.tsx                ← Tina
│       └── LoadingSpinner.tsx      ← Tina
├── contexts/
│   ├── FamilyDataContext.tsx       ← Solo
│   └── UbuntuThemeContext.tsx      ← Solo
├── hooks/
│   └── useFamilyData.ts            ← Solo
├── services/
│   └── familyService.ts            ← Solo
├── types/
│   └── family.ts                   ← Solo
└── utils/
    └── familyTreeHelpers.ts        ← Solo
```

---

## 🎨 Ubuntu Theme Configuration

### Colors to Use

```typescript
// src/styles/ubuntu-theme.ts
export const ubuntuTheme = {
  colors: {
    primary: {
      purple: '#6B46C1',
      gold: '#D69E2E',
    },
    secondary: {
      blue: '#3182CE',
      green: '#38A169',
    }
  },
  spacing: {
    unit: 8,
  },
  borderRadius: {
    default: '8px',
    large: '16px',
  }
};
```

### Tailwind Configuration

Add to `tailwind.config.js`:
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        'ubuntu-purple': '#6B46C1',
        'ubuntu-gold': '#D69E2E',
      }
    }
  }
}
```

---

## 🔥 Firestore Data Models (Phase 1)

### Collection: family_members

```typescript
// src/types/family.ts
export interface FamilyMember {
  id: string;
  firstName: string;
  lastName: string;
  photo: string;
  birthDate: Date;
  bio: string;
  role: string;
  generation: number;
  parents?: string[];
  spouse?: string;
  children?: string[];
  createdAt: Date;
  updatedAt: Date;
}
```

### Initial Data Structure

Create `data/family-members.json`:
```json
[
  {
    "id": "notemba",
    "firstName": "Notemba",
    "lastName": "Mdeni",
    "role": "Matriarch & Mother",
    "generation": 1,
    "children": ["salatiso", "visa"]
  },
  {
    "id": "salatiso",
    "firstName": "Salatiso",
    "lastName": "Lonwabo Mdeni",
    "role": "Founder & Father",
    "generation": 2,
    "parents": ["notemba"]
  },
  {
    "id": "visa",
    "firstName": "Visa",
    "lastName": "Mdeni",
    "role": "Cultural Curator",
    "generation": 2,
    "parents": ["notemba"],
    "children": ["solo", "mila"]
  }
]
```

---

## 🧪 Testing Setup

### Test File Example

```typescript
// src/components/family/__tests__/FamilyTree.test.tsx
import { render, screen } from '@testing-library/react';
import { FamilyTree } from '../FamilyTree';

describe('FamilyTree', () => {
  it('renders without crashing', () => {
    render(<FamilyTree />);
    expect(screen.getByTestId('family-tree')).toBeInTheDocument();
  });
  
  it('displays family members', () => {
    const members = [
      { id: '1', firstName: 'Test', lastName: 'Member' }
    ];
    render(<FamilyTree members={members} />);
    expect(screen.getByText('Test Member')).toBeInTheDocument();
  });
});
```

### Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

---

## 📝 Daily Standup Template

**Time:** 9:00 AM daily (15 minutes)  
**Format:** Async (Slack/WhatsApp) or Video Call

### Standup Questions:
1. **Yesterday:** What did you complete?
2. **Today:** What will you work on?
3. **Blockers:** Any issues preventing progress?

### Example Post:
```
👋 Daily Update - October 9, 2025

Yesterday ✅
- Setup development environment
- Created FamilyTree component skeleton
- Reviewed technical specifications

Today 🎯
- Implement FamilyTreeNode component
- Add pan/zoom functionality
- Test with sample data

Blockers 🚧
- Need family photos from Kwakho
- Waiting for Firebase permissions

Hours logged: 8/40
```

---

## 🔄 Git Workflow

### Branch Strategy

```
main
  └── feature/v2-upgrade
        ├── feature/v2-phase1-foundation
        ├── feature/v2-phase1-family-tree
        └── feature/v2-phase1-ubuntu-theme
```

### Commit Message Format

```
type(scope): description

[optional body]
[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance

**Examples:**
```bash
git commit -m "feat(family): add FamilyTree component"
git commit -m "style(ubuntu): apply theme colors to components"
git commit -m "test(family): add FamilyTree unit tests"
```

---

## 📊 Progress Tracking

### Week 1 Checklist

**Solo's Tasks (40 hours)**
- [ ] Development environment setup (4h)
- [ ] Ubuntu theme provider (6h)
- [ ] Firestore data models (6h)
- [ ] FamilyTree component (16h)
- [ ] FamilyDataContext (4h)
- [ ] familyService.ts (4h)

**Tina's Tasks (15 hours)**
- [ ] Testing environment setup (3h)
- [ ] FamilyMemberCard component (4h)
- [ ] UI components (Button, Card) (4h)
- [ ] Unit tests (4h)

**Visa's Tasks (10 hours)**
- [ ] Family data preparation (4h)
- [ ] Ubuntu wisdom content (3h)
- [ ] Test data creation (3h)

**Kwakho's Tasks (5 hours)**
- [ ] Family photos gathering (2h)
- [ ] Cultural elements research (2h)
- [ ] Ubuntu quotes drafting (1h)

---

## 🐛 Troubleshooting

### Common Issues

#### 1. Firebase Connection Errors
```bash
# Verify credentials
echo $NEXT_PUBLIC_FIREBASE_PROJECT_ID

# Test Firebase connection
npm run test:firebase
```

#### 2. Dependency Installation Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### 3. TypeScript Errors
```bash
# Rebuild TypeScript
npm run build
```

#### 4. Port Already in Use
```bash
# Kill process on port 3000
npx kill-port 3000

# Or use different port
npm run dev -- -p 3001
```

---

## 📞 Communication Channels

### Primary: Family WhatsApp Group
- Daily updates
- Quick questions
- Screenshots/demos

### Secondary: GitHub Issues
- Bug reports
- Feature discussions
- Technical questions

### Meetings:
- **Daily Standup:** 9:00 AM (15 min)
- **Weekly Review:** Friday 4:00 PM (1 hour)
- **Planning:** Monday 9:00 AM (30 min)

---

## 🎓 Learning Resources

### React Flow (Family Tree)
- Docs: https://reactflow.dev/docs/
- Examples: https://reactflow.dev/examples/

### D3.js (Data Visualization)
- Docs: https://d3js.org/
- Tutorial: https://observablehq.com/@d3/learn-d3

### Firebase Firestore
- Docs: https://firebase.google.com/docs/firestore
- Security Rules: https://firebase.google.com/docs/firestore/security/get-started

### Tailwind CSS
- Docs: https://tailwindcss.com/docs
- Components: https://tailwindui.com/components

---

## ✅ Definition of Done

A task is "Done" when:
- [ ] Code is written and working
- [ ] Unit tests pass (80% coverage)
- [ ] Code is reviewed by Solo
- [ ] Documentation updated
- [ ] Committed to feature branch
- [ ] No console errors/warnings
- [ ] Works on mobile and desktop
- [ ] Meets accessibility standards

---

## 🚀 Week 1 Goal

**By End of Week 1:**
✅ FamilyTree component rendering  
✅ Ubuntu theme applied  
✅ Sample data loading  
✅ Basic navigation working  
✅ Tests passing  
✅ Documentation complete  

**Success Metric:** Can view interactive family tree with Notemba (Mother) as root

---

## 📅 Week 2 Preview

**Goals:**
- Complete FamilyTimeline component
- Start BusinessOrganogram
- Refine FamilyTree based on feedback
- Add more family data
- Implement search/filter

---

## 🎯 Remember

1. **Ubuntu First** - Family and community-centered design
2. **Quality over Speed** - Take time to do it right
3. **Ask Questions** - No question is too small
4. **Document Everything** - Future you will thank you
5. **Test Early** - Don't wait until the end
6. **Have Fun** - We're building something amazing together!

---

## 💪 Motivation

*"We are building more than a web app. We are creating a digital home for our family's legacy, a platform that will serve generations to come. Every line of code, every component, every feature is an investment in our collective future."*

**Ubuntu: I am because we are.**

---

## Contact

**Tech Lead:** Solo Mdeni  
**Project Owner:** Salatiso Lonwabo Mdeni  
**Team:** Tina, Visa, Kwakho

**Let's build something amazing! 🚀**

---

*Last Updated: October 8, 2025*

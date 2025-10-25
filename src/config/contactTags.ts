/**
 * Predefined tags for contacts with categories and colors
 */

export interface TagOption {
  id: string;
  label: string;
  category: 'family' | 'business' | 'community' | 'skills' | 'role' | 'relationship';
  color: string;
  description?: string;
}

export const PREDEFINED_TAGS: TagOption[] = [
  // Family Tags
  {
    id: 'family-member',
    label: 'Family Member',
    category: 'family',
    color: 'bg-blue-100 text-blue-700 border-blue-300',
    description: 'Close family member'
  },
  {
    id: 'immediate-family',
    label: 'Immediate Family',
    category: 'family',
    color: 'bg-blue-100 text-blue-700 border-blue-300',
    description: 'Parent, sibling, or child'
  },
  {
    id: 'extended-family',
    label: 'Extended Family',
    category: 'family',
    color: 'bg-indigo-100 text-indigo-700 border-indigo-300',
    description: 'Aunt, uncle, cousin, etc.'
  },
  {
    id: 'in-law',
    label: 'In-Law',
    category: 'family',
    color: 'bg-purple-100 text-purple-700 border-purple-300',
    description: 'Family through marriage'
  },

  // Business Tags
  {
    id: 'business-partner',
    label: 'Business Partner',
    category: 'business',
    color: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    description: 'Business collaboration partner'
  },
  {
    id: 'client',
    label: 'Client',
    category: 'business',
    color: 'bg-green-100 text-green-700 border-green-300',
    description: 'Business client or customer'
  },
  {
    id: 'supplier',
    label: 'Supplier',
    category: 'business',
    color: 'bg-orange-100 text-orange-700 border-orange-300',
    description: 'Service or product supplier'
  },
  {
    id: 'investor',
    label: 'Investor',
    category: 'business',
    color: 'bg-emerald-100 text-emerald-700 border-emerald-300',
    description: 'Financial investor or backer'
  },
  {
    id: 'mentor',
    label: 'Mentor',
    category: 'business',
    color: 'bg-teal-100 text-teal-700 border-teal-300',
    description: 'Business mentor or advisor'
  },

  // Community Tags
  {
    id: 'community-lead',
    label: 'Community Lead',
    category: 'community',
    color: 'bg-pink-100 text-pink-700 border-pink-300',
    description: 'Community leadership role'
  },
  {
    id: 'education-lead',
    label: 'Education Lead',
    category: 'community',
    color: 'bg-cyan-100 text-cyan-700 border-cyan-300',
    description: 'Leads educational initiatives'
  },
  {
    id: 'volunteer',
    label: 'Volunteer',
    category: 'community',
    color: 'bg-lime-100 text-lime-700 border-lime-300',
    description: 'Community volunteer'
  },
  {
    id: 'neighbor',
    label: 'Neighbor',
    category: 'community',
    color: 'bg-amber-100 text-amber-700 border-amber-300',
    description: 'Lives nearby'
  },

  // Skills Tags
  {
    id: 'tech-expert',
    label: 'Tech Expert',
    category: 'skills',
    color: 'bg-violet-100 text-violet-700 border-violet-300',
    description: 'Technology expertise'
  },
  {
    id: 'creative',
    label: 'Creative',
    category: 'skills',
    color: 'bg-fuchsia-100 text-fuchsia-700 border-fuchsia-300',
    description: 'Creative skills (art, design, etc.)'
  },
  {
    id: 'healthcare',
    label: 'Healthcare',
    category: 'skills',
    color: 'bg-red-100 text-red-700 border-red-300',
    description: 'Healthcare professional'
  },
  {
    id: 'legal',
    label: 'Legal',
    category: 'skills',
    color: 'bg-slate-100 text-slate-700 border-slate-300',
    description: 'Legal expertise'
  },
  {
    id: 'finance',
    label: 'Finance',
    category: 'skills',
    color: 'bg-emerald-100 text-emerald-700 border-emerald-300',
    description: 'Financial expertise'
  },

  // Role Tags
  {
    id: 'emergency-contact',
    label: 'Emergency Contact',
    category: 'role',
    color: 'bg-red-100 text-red-700 border-red-300',
    description: 'Contact in case of emergency'
  },
  {
    id: 'trusted-advisor',
    label: 'Trusted Advisor',
    category: 'role',
    color: 'bg-blue-100 text-blue-700 border-blue-300',
    description: 'Trusted for advice and guidance'
  },
  {
    id: 'collaborator',
    label: 'Collaborator',
    category: 'role',
    color: 'bg-purple-100 text-purple-700 border-purple-300',
    description: 'Active project collaborator'
  },

  // Relationship Tags
  {
    id: 'close-friend',
    label: 'Close Friend',
    category: 'relationship',
    color: 'bg-pink-100 text-pink-700 border-pink-300',
    description: 'Close personal friend'
  },
  {
    id: 'acquaintance',
    label: 'Acquaintance',
    category: 'relationship',
    color: 'bg-gray-100 text-gray-700 border-gray-300',
    description: 'Known but not close'
  },
  {
    id: 'school-friend',
    label: 'School Friend',
    category: 'relationship',
    color: 'bg-blue-100 text-blue-700 border-blue-300',
    description: 'Friend from school/university'
  },
  {
    id: 'work-colleague',
    label: 'Work Colleague',
    category: 'relationship',
    color: 'bg-indigo-100 text-indigo-700 border-indigo-300',
    description: 'Current or former colleague'
  }
];

export const TAG_CATEGORIES = [
  { id: 'family', label: 'Family', icon: '👨‍👩‍👧‍👦' },
  { id: 'business', label: 'Business', icon: '💼' },
  { id: 'community', label: 'Community', icon: '🌍' },
  { id: 'skills', label: 'Skills', icon: '⚡' },
  { id: 'role', label: 'Role', icon: '🎯' },
  { id: 'relationship', label: 'Relationship', icon: '❤️' }
] as const;

/**
 * Get tag option by ID
 */
export function getTagById(id: string): TagOption | undefined {
  return PREDEFINED_TAGS.find(tag => tag.id === id);
}

/**
 * Get tags by category
 */
export function getTagsByCategory(category: TagOption['category']): TagOption[] {
  return PREDEFINED_TAGS.filter(tag => tag.category === category);
}

/**
 * Get tag color class
 */
export function getTagColor(tagLabel: string): string {
  const tag = PREDEFINED_TAGS.find(t => t.label === tagLabel);
  return tag?.color || 'bg-gray-100 text-gray-700 border-gray-300';
}

/**
 * Check if a tag is predefined
 */
export function isPredefinedTag(tagLabel: string): boolean {
  return PREDEFINED_TAGS.some(t => t.label === tagLabel);
}

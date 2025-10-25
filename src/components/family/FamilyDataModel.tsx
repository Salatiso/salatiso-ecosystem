/**
 * Family Data Model & Components
 * Phase 5 - STEP 5
 * Mdeni Family Foundation - Complete family structure
 */

'use client';

import React, { useState } from 'react';
import { ChevronDown, Heart, Shield, Users, Layers } from 'lucide-react';

// ===== Data Models =====

export interface FamilyMember {
  id: string;
  name: string;
  role: 'matriarch' | 'steward' | 'heir' | 'contributor';
  age?: number;
  bio?: string;
  photo?: string;
  contact?: {
    email?: string;
    phone?: string;
  };
  relationships?: string[]; // IDs of related members
}

export interface Household {
  id: string;
  name: string;
  location: string;
  primaryMembers: string[]; // IDs
  steward: string; // Matriarch/steward ID
  description?: string;
  established?: string;
}

export interface SuccessionPlan {
  currentSteward: string;
  nextSteward: string;
  successors: Array<{
    position: number;
    memberId: string;
    shares: number; // % ownership
  }>;
  rules?: {
    minAge?: number;
    requiresConsensus?: boolean;
    consensusThreshold?: number;
  };
}

// ===== Mdeni Family Data =====

export const MDENI_FAMILY_DATA = {
  members: {
    ncMdeni: {
      id: 'nc-mdeni',
      name: 'NC Mdeni',
      role: 'matriarch',
      bio: 'Matriarch of the Mdeni family. Visionary leader and foundation steward.',
      relationships: ['salatiso', 'visa', 'tina', 'kwakho'],
    } as FamilyMember,
    salatiso: {
      id: 'salatiso',
      name: 'Salatiso',
      role: 'steward',
      bio: 'Primary steward. Manages core family operations and strategic planning.',
      relationships: ['nc-mdeni', 'solo', 'visa', 'tina', 'kwakho'],
    } as FamilyMember,
    visa: {
      id: 'visa',
      name: 'Visa',
      role: 'contributor',
      bio: 'Business strategist. Drives professional and community initiatives.',
      relationships: ['nc-mdeni', 'salatiso', 'solo'],
    } as FamilyMember,
    solo: {
      id: 'solo',
      name: 'Solo',
      role: 'heir',
      age: 16,
      bio: 'Young leader in training. Health & sustainability focus.',
      relationships: ['visa', 'salatiso'],
    } as FamilyMember,
    tina: {
      id: 'tina',
      name: 'Tina',
      role: 'contributor',
      bio: 'Executive leader. Education and development focus.',
      relationships: ['nc-mdeni', 'salatiso', 'azora'],
    } as FamilyMember,
    azora: {
      id: 'azora',
      name: 'Azora',
      role: 'heir',
      age: 14,
      bio: 'Future leader. Academic excellence and innovation focus.',
      relationships: ['tina', 'salatiso'],
    } as FamilyMember,
    kwakho: {
      id: 'kwakho',
      name: 'Kwakho',
      role: 'contributor',
      bio: 'Logistics and operations. Sustainability champion.',
      relationships: ['nc-mdeni', 'salatiso', 'milani', 'milande'],
    } as FamilyMember,
    milani: {
      id: 'milani',
      name: 'Milani',
      role: 'heir',
      age: 12,
      bio: 'Systems thinker. Technology and innovation focus.',
      relationships: ['kwakho', 'milande', 'salatiso'],
    } as FamilyMember,
    milande: {
      id: 'milande',
      name: 'Milande',
      role: 'heir',
      age: 10,
      bio: 'Creative leader. Arts and culture focus.',
      relationships: ['kwakho', 'milani', 'salatiso'],
    } as FamilyMember,
    sazi: {
      id: 'sazi',
      name: 'Sazi',
      role: 'heir',
      age: 8,
      bio: 'Young explorer. Learning and discovery focus.',
      relationships: ['salatiso'],
    } as FamilyMember,
    mila: {
      id: 'mila',
      name: 'Mila',
      role: 'heir',
      age: 6,
      bio: 'Creative spirit. Art, music, and play focus.',
      relationships: ['salatiso'],
    } as FamilyMember,
    azanya: {
      id: 'azanya',
      name: 'Azanya',
      role: 'heir',
      age: 4,
      bio: 'Curious mind. Early learning and exploration.',
      relationships: ['salatiso'],
    } as FamilyMember,
  },

  households: {
    lineata: {
      id: 'lineata-primary',
      name: '22 Lineata - Primary Homestead',
      location: 'Lineata Avenue',
      steward: 'nc-mdeni',
      primaryMembers: ['nc-mdeni', 'salatiso', 'visa', 'solo'],
      description: 'Main family compound. Ancestral home and operational hub.',
      established: '2008',
    } as Household,
    melville: {
      id: 'melville-secondary',
      name: 'Melville Secondary',
      location: 'Melville',
      steward: 'salatiso',
      primaryMembers: ['salatiso', 'tina', 'azora', 'sazi', 'mila', 'azanya'],
      description: 'Family residence. Educational and development focus.',
      established: '2015',
    } as Household,
    kwakho: {
      id: 'kwakho-residence',
      name: 'Kwakho Residence',
      location: 'Operations Base',
      steward: 'kwakho',
      primaryMembers: ['kwakho', 'milani', 'milande'],
      description: 'Operations and logistics headquarters.',
      established: '2018',
    } as Household,
  },

  succession: {
    currentSteward: 'nc-mdeni',
    nextSteward: 'salatiso',
    successors: [
      { position: 1, memberId: 'salatiso', shares: 30 },
      { position: 2, memberId: 'visa', shares: 25 },
      { position: 3, memberId: 'tina', shares: 20 },
      { position: 4, memberId: 'kwakho', shares: 15 },
      { position: 5, memberId: 'solo', shares: 5 },
      { position: 6, memberId: 'azora', shares: 3 },
      { position: 7, memberId: 'milani', shares: 2 },
    ],
    rules: {
      minAge: 18,
      requiresConsensus: true,
      consensusThreshold: 60,
    },
  } as SuccessionPlan,
};

// ===== Components =====

/**
 * Family Tree Component
 */
export const FamilyTree: React.FC = () => {
  const members = Object.values(MDENI_FAMILY_DATA.members);
  const [expandedRole, setExpandedRole] = useState<string | null>('steward');

  const roleColors: Record<string, string> = {
    matriarch: 'bg-purple-100 text-purple-900 border-purple-300',
    steward: 'bg-blue-100 text-blue-900 border-blue-300',
    heir: 'bg-green-100 text-green-900 border-green-300',
    contributor: 'bg-amber-100 text-amber-900 border-amber-300',
  };

  const roleIcons: Record<string, React.ReactNode> = {
    matriarch: <Heart className="w-4 h-4" />,
    steward: <Shield className="w-4 h-4" />,
    heir: <Layers className="w-4 h-4" />,
    contributor: <Users className="w-4 h-4" />,
  };

  const groupedByRole = members.reduce((acc, member) => {
    if (!acc[member.role]) acc[member.role] = [];
    acc[member.role].push(member);
    return acc;
  }, {} as Record<string, FamilyMember[]>);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Users className="w-5 h-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">Mdeni Family Structure</h3>
      </div>

      {Object.entries(groupedByRole).map(([role, roleMembers]) => (
        <div key={role} className="border border-gray-200 rounded-lg overflow-hidden">
          <button
            onClick={() =>
              setExpandedRole(expandedRole === role ? null : role)
            }
            className="w-full px-4 py-3 flex items-center gap-3 bg-gray-50 hover:bg-gray-100 transition"
          >
            <ChevronDown
              className={`w-5 h-5 transition ${
                expandedRole === role ? 'rotate-180' : ''
              }`}
            />
            <span className="text-sm font-semibold text-gray-700 capitalize">
              {role}s ({roleMembers.length})
            </span>
          </button>

          {expandedRole === role && (
            <div className="p-4 space-y-3">
              {roleMembers.map((member) => (
                <div
                  key={member.id}
                  className={`p-3 rounded-lg border-2 ${roleColors[member.role]}`}
                >
                  <div className="flex items-center gap-3">
                    {roleIcons[member.role]}
                    <div className="flex-1">
                      <p className="font-medium">{member.name}</p>
                      {member.age && (
                        <p className="text-sm opacity-75">Age: {member.age}</p>
                      )}
                    </div>
                  </div>
                  {member.bio && (
                    <p className="text-sm mt-2 opacity-75">{member.bio}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

/**
 * Households Component
 */
export const HouseholdsView: React.FC = () => {
  const households = Object.values(MDENI_FAMILY_DATA.households);
  const members = MDENI_FAMILY_DATA.members;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Heart className="w-5 h-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">Family Households</h3>
      </div>

      <div className="grid gap-4">
        {households.map((household) => (
          <div
            key={household.id}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-semibold text-gray-900">{household.name}</h4>
                <p className="text-sm text-gray-600">{household.location}</p>
              </div>
              <span className="px-2 py-1 bg-blue-100 text-blue-900 text-xs font-medium rounded">
                Established {household.established}
              </span>
            </div>

            {household.description && (
              <p className="text-sm text-gray-700 mb-3">{household.description}</p>
            )}

            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-600 uppercase">Members</p>
              <div className="flex flex-wrap gap-2">
                {household.primaryMembers.map((memberId) => {
                  const member = Object.values(members).find((m) => m.id === memberId);
                  return member ? (
                    <span
                      key={memberId}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded"
                    >
                      {member.name}
                    </span>
                  ) : null;
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Succession Planning Component
 */
export const SuccessionPlanning: React.FC = () => {
  const succession = MDENI_FAMILY_DATA.succession;
  const members = MDENI_FAMILY_DATA.members;
  const currentSteward = Object.values(members).find(
    (m) => m.id === succession.currentSteward
  );
  const nextSteward = Object.values(members).find(
    (m) => m.id === succession.nextSteward
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Shield className="w-5 h-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">Succession Planning</h3>
      </div>

      {/* Current & Next Steward */}
      <div className="grid grid-cols-2 gap-4">
        <div className="border-2 border-purple-300 rounded-lg p-4 bg-purple-50">
          <p className="text-xs font-semibold text-purple-600 uppercase mb-2">
            Current Matriarch
          </p>
          <p className="text-lg font-bold text-purple-900">
            {currentSteward?.name}
          </p>
        </div>
        <div className="border-2 border-blue-300 rounded-lg p-4 bg-blue-50">
          <p className="text-xs font-semibold text-blue-600 uppercase mb-2">
            Next Steward
          </p>
          <p className="text-lg font-bold text-blue-900">{nextSteward?.name}</p>
        </div>
      </div>

      {/* Succession Line */}
      <div className="border border-gray-200 rounded-lg p-4">
        <p className="text-sm font-semibold text-gray-900 mb-3">Line of Succession</p>
        <div className="space-y-2">
          {succession.successors.map((successor, idx) => {
            const member = Object.values(members).find(
              (m) => m.id === successor.memberId
            );
            return member ? (
              <div key={idx} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{member.name}</p>
                  <p className="text-xs text-gray-600">{successor.shares}% share</p>
                </div>
              </div>
            ) : null;
          })}
        </div>
      </div>

      {/* Rules */}
      {succession.rules && (
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <p className="text-sm font-semibold text-gray-900 mb-2">Succession Rules</p>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>✓ Minimum age: {succession.rules.minAge} years</li>
            <li>
              ✓ Requires consensus:{' '}
              {succession.rules.requiresConsensus ? 'Yes' : 'No'}
            </li>
            {succession.rules.consensusThreshold && (
              <li>✓ Consensus threshold: {succession.rules.consensusThreshold}%</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

/**
 * Family Overview Dashboard
 */
export const FamilyOverview: React.FC = () => {
  const totalMembers = Object.keys(MDENI_FAMILY_DATA.members).length;
  const totalHouseholds = Object.keys(MDENI_FAMILY_DATA.households).length;
  const heirs = Object.values(MDENI_FAMILY_DATA.members).filter(
    (m) => m.role === 'heir'
  ).length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
          <p className="text-xs font-semibold text-purple-600 uppercase">Total Members</p>
          <p className="text-2xl font-bold text-purple-900 mt-1">{totalMembers}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
          <p className="text-xs font-semibold text-blue-600 uppercase">Households</p>
          <p className="text-2xl font-bold text-blue-900 mt-1">{totalHouseholds}</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
          <p className="text-xs font-semibold text-green-600 uppercase">Heirs</p>
          <p className="text-2xl font-bold text-green-900 mt-1">{heirs}</p>
        </div>
      </div>

      {/* Tabs for different views */}
      <div className="space-y-6">
        <FamilyTree />
        <HouseholdsView />
        <SuccessionPlanning />
      </div>
    </div>
  );
};

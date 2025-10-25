import React, { useState, useMemo } from 'react';
import { FamilyIcon, UbuntuIcon, MilestoneIcon } from '@/components/icons';

export interface FamilyMember {
  id: string;
  name: string;
  role: string;
  birthYear?: number;
  achievements: string[];
  children?: FamilyMember[];
  ubuntuWisdom?: string;
  profileImage?: string;
  isPatriarch?: boolean;
  isMatriarch?: boolean;
}

const familyData: FamilyMember = {
  id: 'ndleleni',
  name: 'Ndleleni Mgedezi',
  role: 'Maternal Grandfather',
  achievements: [
    'Passed away around 2006',
    'Community leader and cultural heritage guardian'
  ],
  ubuntuWisdom: 'Cultural heritage is the foundation of community strength',
  children: [
    {
      id: 'sisiwe',
      name: 'Sisiwe Mgedezi',
      role: 'Maternal Grandmother',
      achievements: [
        'Passed away when Notemba was 11 years old',
        'Legacy of Ubuntu values and resilience'
      ],
      ubuntuWisdom: 'Ubuntu wisdom passed through generations',
      children: [
        {
          id: 'notemba',
          name: 'Notemba Mdeni',
          role: 'Matriarch - Mother',
          achievements: [
            'Raised 4 children with Ubuntu values',
            'Supported family through loss of husband in 1993',
            'Foundation of family strength and wisdom'
          ],
          ubuntuWisdom: 'A mother\'s love is the root from which the family tree grows',
          isMatriarch: true,
          children: [
            {
              id: 'salatiso',
              name: 'Salatiso Lonwabo Mdeni',
              role: 'Eldest Sibling & Father Figure (Father died 1993, age 11)',
              birthYear: 1982,
              achievements: [
                'Established Mlandeli-Notemba Investments with family-first principles',
                'Managed multiple bonds demonstrating financial responsibility (2003-2017)',
                'Purchased family home in Glenvista, Johannesburg',
                'Became father figure to siblings after father\'s passing at age 11',
                'Advocate for equal parental rights in custody proceedings (2019-2025)',
                'Developer of Salatiso Ecosystem (LifeCV, BizHelp, Sazi Life Academy)'
              ],
              ubuntuWisdom: '"I am because we are" - When father fell, family rose together. Vague distinction between brother and father\'s successor.',
              children: [
                {
                  id: 'sazi',
                  name: 'Lukhanyo Sazi Mkosana',
                  role: 'Son (Mother: Mpho Mkosana - External)',
                  birthYear: 2018,
                  achievements: [
                    'Represents the next generation bridging technology and Ubuntu wisdom',
                    'Subject of educational examples in Sazi Life Academy'
                  ],
                  ubuntuWisdom: 'The future belongs to those who honor their roots'
                }
              ]
            },
            {
              id: 'visa',
              name: 'Visa Mdeni',
              role: 'Direct Sibling - CEO & Front Face (Born May 1985, knew father ~8 years)',
              birthYear: 1985,
              achievements: [
                'Extensive experience in strategic business development',
                'Leads MNI\'s public face and coordinates strategic initiatives',
                'Mother of Solo and Mila'
              ],
              ubuntuWisdom: 'Leadership is service to the family collective',
              children: [
                {
                  id: 'solo',
                  name: 'Solonwabo (Solo) Mdeni',
                  role: 'AI Media Creator & Family Profile Developer',
                  birthYear: 2010,
                  achievements: [
                    'AI media creation specialist',
                    'Family profile and content developer'
                  ],
                  ubuntuWisdom: 'Innovation serves the family legacy'
                },
                {
                  id: 'mila',
                  name: 'Mila Mdeni',
                  role: 'Family Member',
                  birthYear: 2018,
                  achievements: ['Growing in family-first values'],
                  ubuntuWisdom: 'Every voice contributes to our Ubuntu circle'
                }
              ]
            },
            {
              id: 'tina',
              name: 'Tina Mdeni',
              role: 'Direct Sibling - Marketing Lead (Born 1990, second youngest, knew father <4 years)',
              birthYear: 1990,
              achievements: [
                'Digital marketing campaigns and social media management',
                'Promotes MNI\'s Ubuntu philosophy online',
                'Mother of Azora'
              ],
              ubuntuWisdom: 'Communication connects our family to the world',
              children: [
                {
                  id: 'azora',
                  name: 'Azora (Sgantsontso) Mdeni',
                  role: 'Family Member',
                  birthYear: 2021,
                  achievements: ['Growing with family love and Ubuntu wisdom'],
                  ubuntuWisdom: 'Love knows no boundaries in our family'
                }
              ]
            },
            {
              id: 'kwakho',
              name: 'Kwakho Mdeni',
              role: 'Direct Sibling - Academy Coordinator (Born Sept 15, 1992, youngest, knew father least)',
              birthYear: 1992,
              achievements: [
                'Manages professional profiles and oversees educational programs',
                'Coordinates Sazi Life Academy curriculum',
                'Mother of Milande and Milani'
              ],
              ubuntuWisdom: 'Education is the foundation of family prosperity',
              children: [
                {
                  id: 'milande',
                  name: 'Milande Mdeni',
                  role: 'Family Member',
                  birthYear: 2017,
                  achievements: ['Developing family values and education'],
                  ubuntuWisdom: 'Youth are the seeds of tomorrow\'s harvest'
                },
                {
                  id: 'milani',
                  name: 'Milani Mdeni',
                  role: 'Family Member',
                  birthYear: 2024,
                  achievements: ['Newest member of our Ubuntu circle'],
                  ubuntuWisdom: 'Every child brings new light to our family'
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};

interface FamilyMemberNodeProps {
  member: FamilyMember;
  level: number;
  onMemberClick: (member: FamilyMember) => void;
  selectedMember?: FamilyMember;
}

const FamilyMemberNode: React.FC<FamilyMemberNodeProps> = ({
  member,
  level,
  onMemberClick,
  selectedMember
}) => {
  const isSelected = selectedMember?.id === member.id;
  const nodeSize = Math.max(80 - level * 8, 60); // Smaller nodes for deeper levels

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={() => onMemberClick(member)}
        className={`
          relative rounded-full border-2 transition-all duration-300 hover:scale-105
          ${isSelected
            ? 'border-ubuntu-gold bg-ubuntu-warm-100 shadow-lg'
            : 'border-ubuntu-warm-300 bg-ubuntu-warm-50 hover:border-ubuntu-gold'
          }
        `}
        style={{
          width: nodeSize,
          height: nodeSize,
          background: member.isPatriarch
            ? 'linear-gradient(135deg, #6B46C1 0%, #D69E2E 100%)'
            : member.isMatriarch
            ? 'linear-gradient(135deg, #D69E2E 0%, #6B46C1 100%)'
            : undefined
        }}
      >
        {member.isPatriarch ? (
          <UbuntuIcon className="w-6 h-6 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        ) : member.isMatriarch ? (
          <FamilyIcon className="w-6 h-6 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        ) : (
          <div className="w-3 h-3 bg-ubuntu-warm-600 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        )}
      </button>

      <div className="text-center mt-2 max-w-24">
        <p className={`text-xs font-ubuntu font-medium truncate ${
          isSelected ? 'text-ubuntu-warm-900' : 'text-ubuntu-warm-700'
        }`}>
          {member.name.split(' ')[0]}
        </p>
        {member.birthYear && (
          <p className="text-xs text-ubuntu-warm-500">
            {member.birthYear}
          </p>
        )}
      </div>
    </div>
  );
};

interface FamilyTreeProps {
  onMemberSelect?: (member: FamilyMember) => void;
}

const FamilyTree: React.FC<FamilyTreeProps> = ({ onMemberSelect }) => {
  const [selectedMember, setSelectedMember] = useState<FamilyMember | undefined>(familyData);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFamily = useMemo(() => {
    if (!searchTerm) return familyData;

    const filterMember = (member: FamilyMember): FamilyMember | null => {
      const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           member.role.toLowerCase().includes(searchTerm.toLowerCase());

      const filteredChildren = member.children
        ?.map(filterMember)
        .filter(Boolean) as FamilyMember[];

      if (matchesSearch || (filteredChildren && filteredChildren.length > 0)) {
        return {
          ...member,
          children: filteredChildren || member.children
        };
      }

      return null;
    };

    return filterMember(familyData);
  }, [searchTerm]);

  const handleMemberClick = (member: FamilyMember) => {
    setSelectedMember(member);
    onMemberSelect?.(member);
  };

  const renderFamilyLevel = (members: FamilyMember[], level: number = 0) => {
    if (!members || members.length === 0) return null;

    return (
      <div className="flex flex-wrap justify-center gap-8 mb-8">
        {members.map((member) => (
          <div key={member.id} className="flex flex-col items-center">
            <FamilyMemberNode
              member={member}
              level={level}
              onMemberClick={handleMemberClick}
              selectedMember={selectedMember}
            />

            {/* Connection line to children */}
            {member.children && member.children.length > 0 && (
              <>
                <div className="w-px h-6 bg-ubuntu-warm-300 mt-2" />
                <div className="border-l-2 border-t-2 border-ubuntu-warm-300 rounded-tl-lg w-full max-w-xs mt-2">
                  {renderFamilyLevel(member.children, level + 1)}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    );
  };

  if (!filteredFamily) {
    return (
      <div className="text-center py-12">
        <p className="text-ubuntu-warm-600">No family members found matching your search.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search family members..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md px-4 py-2 border border-ubuntu-warm-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ubuntu-gold focus:border-transparent"
        />
      </div>

      {/* Family Tree */}
      <div className="bg-ubuntu-warm-25 rounded-xl p-6 border border-ubuntu-warm-200">
        <div className="overflow-x-auto">
          {renderFamilyLevel([filteredFamily])}
        </div>
      </div>

      {/* Selected Member Details */}
      {selectedMember && (
        <div className="mt-6 bg-white rounded-xl p-6 border border-ubuntu-warm-200 shadow-sm">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              {selectedMember.isPatriarch ? (
                <UbuntuIcon className="w-12 h-12 text-ubuntu-purple" />
              ) : selectedMember.isMatriarch ? (
                <FamilyIcon className="w-12 h-12 text-ubuntu-gold" />
              ) : (
                <MilestoneIcon className="w-12 h-12 text-ubuntu-warm-600" />
              )}
            </div>

            <div className="flex-1">
              <h3 className="text-xl font-ubuntu font-bold text-ubuntu-warm-900 mb-2">
                {selectedMember.name}
              </h3>
              <p className="text-ubuntu-warm-700 font-medium mb-3">
                {selectedMember.role}
              </p>

              {selectedMember.ubuntuWisdom && (
                <blockquote className="text-ubuntu-warm-800 italic border-l-4 border-ubuntu-gold pl-4 mb-4">
                  {selectedMember.ubuntuWisdom}
                </blockquote>
              )}

              <div>
                <h4 className="font-ubuntu font-semibold text-ubuntu-warm-900 mb-2">
                  Key Achievements
                </h4>
                <ul className="space-y-1">
                  {selectedMember.achievements.map((achievement, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-ubuntu-gold rounded-full mt-2 flex-shrink-0" />
                      <span className="text-ubuntu-warm-700 text-sm">{achievement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FamilyTree;
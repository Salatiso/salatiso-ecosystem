import React, { useState } from 'react';
import { Calendar, Plus, Edit } from 'lucide-react';
import { MilestoneIcon, FamilyIcon } from '@/components/icons';
import TimelineEditor from './TimelineEditor';
import VotingInterface from './VotingInterface';
import { useAuth } from '@/contexts/AuthContext';

interface TimelineEvent {
  id: string;
  year: number;
  month?: number;
  title: string;
  description: string;
  category: 'foundation' | 'financial' | 'family' | 'legal' | 'business' | 'education';
  familyMembers?: string[];
  ubuntuLesson?: string;
  impact: 'low' | 'medium' | 'high';
}

interface TimelineProposal {
  id: string;
  eventId?: string;
  originalEvent?: TimelineEvent;
  proposedEvent: TimelineEvent;
  proposedBy: {
    id: string;
    name: string;
    email: string;
  };
  proposedAt: Date;
  votes: Record<string, 'approve' | 'reject'>;
  status: 'pending' | 'approved' | 'rejected';
  requiredApprovals: number;
}

const timelineEvents: TimelineEvent[] = [
  // 1956-1960: Foundation Generation
  {
    id: '1956-father-birth',
    year: 1956,
    month: 4,
    title: 'Birth of Mlandeli Nelson Mdeni',
    description: 'April 10, 1956: Birth of Mlandeli Nelson Mdeni (Father). Clan name: Mdeni. Praise names: Tshezi, Jalamba, Mqalongangenduku, Nkonjane\'s Bhabhe Mafini, Njilo Njilo. He would become the father who planted the seeds of our family\'s Ubuntu values.',
    category: 'family',
    familyMembers: ['Mlandeli (Father)'],
    ubuntuLesson: 'The roots of a great tree determine the strength of its branches',
    impact: 'high'
  },
  {
    id: '1960-mother-birth',
    year: 1960,
    month: 12,
    title: 'Birth of Nozukile Cynthia Mdeni (Notemba)',
    description: 'December 16, 1960: Birth of Nozukile Cynthia Mgedezi (Notemba), our beloved matriarch. Maiden surname: Mgedezi. Clan name: Xaba. Praise names: Nomjoli, Shwabada, Hlubi. Parents: Ndleleni and Sisiwe Mgedezi. She would become the pillar of strength who holds our family together.',
    category: 'family',
    familyMembers: ['Notemba'],
    ubuntuLesson: 'A mother\'s wisdom is the foundation upon which generations build',
    impact: 'high'
  },

  // 1982-1993: Early Family Foundations
  {
    id: '1982-salatiso-birth',
    year: 1982,
    month: 9,
    title: 'Salatiso Born',
    description: 'September 16, 1982: Birth of Salatiso Lonwabo Mdeni, first child of Notemba and Mlandeli',
    category: 'family',
    familyMembers: ['Salatiso', 'Notemba', 'Mlandeli (Father)'],
    ubuntuLesson: 'The eldest carries the responsibility of lighting the path',
    impact: 'high'
  },
  {
    id: '1985-visa-birth',
    year: 1985,
    month: 5,
    title: 'Visa Born',
    description: 'May 1985: Birth of Visa Mdeni, second child',
    category: 'family',
    familyMembers: ['Visa', 'Notemba', 'Salatiso'],
    ubuntuLesson: 'Each child strengthens the family bond',
    impact: 'high'
  },
  {
    id: '1990-tina-birth',
    year: 1990,
    title: 'Tina Born',
    description: '1990: Birth of Tina Mdeni, third child (second youngest)',
    category: 'family',
    familyMembers: ['Tina', 'Notemba', 'Salatiso', 'Visa'],
    ubuntuLesson: 'The circle grows, so does the Ubuntu',
    impact: 'high'
  },
  {
    id: '1992-kwakho-birth',
    year: 1992,
    month: 9,
    title: 'Kwakho Born',
    description: 'September 15, 1992: Birth of Kwakho Mdeni, youngest child. Conceived before father\'s passing.',
    category: 'family',
    familyMembers: ['Kwakho', 'Notemba', 'Salatiso', 'Visa', 'Tina'],
    ubuntuLesson: 'The youngest inherits the wisdom of all who came before',
    impact: 'high'
  },
  {
    id: '1993-father-death',
    year: 1993,
    title: 'Father\'s Passing - Salatiso Becomes Father Figure',
    description: '1993: Father passes away. Salatiso (age 11) steps into father figure role. Kwakho (1 yr, knew father least), Tina (3 yrs, knew father <4 years), Visa (8 yrs, limited memories). A vague distinction emerges between Salatiso\'s role as brother and as father\'s successor.',
    category: 'family',
    familyMembers: ['Salatiso', 'Visa', 'Tina', 'Kwakho', 'Notemba'],
    ubuntuLesson: 'When one falls, the family rises together - the eldest shoulders the responsibility with love',
    impact: 'high'
  },

  // 2000s: Foundations Continue
  {
    id: 'pre2003-salatiso-work',
    year: 2000,
    title: 'Salatiso Begins Working',
    description: 'Contributes taxes, establishes financial responsibility, continues father figure role',
    category: 'foundation',
    familyMembers: ['Salatiso'],
    ubuntuLesson: 'Individual contribution builds collective strength',
    impact: 'high'
  },
  {
    id: 'pre2003-mpho-empowerment',
    year: 2000,
    title: 'Mpho Mkosana\'s Empowerment Journey',
    description: 'Sazi\'s mother benefits from women\'s empowerment programs',
    category: 'foundation',
    familyMembers: ['Mpho (External)'],
    ubuntuLesson: 'Community support lifts individuals and families',
    impact: 'medium'
  },

  // 2003-2017: Financial Responsibility
  {
    id: '2003-bonds',
    year: 2003,
    title: 'Three Bonds Management',
    description: 'Salatiso manages three bonds demonstrating ongoing financial responsibility',
    category: 'financial',
    familyMembers: ['Salatiso'],
    ubuntuLesson: 'Financial discipline ensures family stability',
    impact: 'high'
  },
  {
    id: '2017-home-purchase',
    year: 2017,
    title: 'Family Home Purchase',
    description: 'Acquires property in Glenvista, Johannesburg, providing family stability',
    category: 'financial',
    familyMembers: ['Salatiso'],
    ubuntuLesson: 'A stable home is the foundation of family security',
    impact: 'high'
  },

  // 2017-2018: Parenthood
  {
    id: '2017-conception',
    year: 2017,
    month: 6,
    title: 'Conception of Sazi',
    description: 'June 2017: Conception of Lukhanyo Sazi Mkosana during relationship with Mpho',
    category: 'family',
    familyMembers: ['Salatiso', 'Mpho', 'Sazi'],
    ubuntuLesson: 'New life brings new responsibilities and joys to the family',
    impact: 'high'
  },
  {
    id: '2018-birth-sazi',
    year: 2018,
    month: 2,
    title: 'Birth of Sazi',
    description: 'February 28, 2018: Birth of Sazi in Port Elizabeth. Salatiso excluded from birth process despite advocacy for parenting plan',
    category: 'family',
    familyMembers: ['Salatiso', 'Mpho', 'Sazi'],
    ubuntuLesson: 'Every child deserves both parents\' love and guidance',
    impact: 'high'
  },

  // Third Generation Births
  {
    id: '2010-birth-solo',
    year: 2010,
    month: 6,
    title: 'Birth of Solo',
    description: 'June 2010: Birth of Solonwabo (Solo) Mdeni, son of Visa. First grandchild of Notemba, bringing new energy to the family.',
    category: 'family',
    familyMembers: ['Visa', 'Solo', 'Notemba'],
    ubuntuLesson: 'Each child brings unique gifts to the family circle - the firstborn of a new generation carries special responsibility',
    impact: 'high'
  },
  {
    id: '2017-birth-milande',
    year: 2017,
    month: 3,
    title: 'Birth of Milande',
    description: 'March 12, 2017: Birth of Milande Mdeni, daughter of Kwakho. A bright spirit joining the family.',
    category: 'family',
    familyMembers: ['Kwakho', 'Milande', 'Notemba'],
    ubuntuLesson: 'Children are the living continuation of family wisdom',
    impact: 'medium'
  },
  {
    id: '2018-birth-mila',
    year: 2018,
    month: 3,
    title: 'Birth of Mila',
    description: 'March 20, 2018: Birth of Mila Mdeni, daughter of Visa. Solo\'s younger sister, expanding the family bonds.',
    category: 'family',
    familyMembers: ['Visa', 'Mila', 'Solo', 'Notemba'],
    ubuntuLesson: 'Siblings share a special bond that strengthens the family',
    impact: 'medium'
  },
  {
    id: '2021-birth-azora',
    year: 2021,
    month: 5,
    title: 'Birth of Azora',
    description: 'May 22, 2021: Birth of Azora Mdeni, daughter of Tina. Bringing joy and energy to the family.',
    category: 'family',
    familyMembers: ['Tina', 'Azora', 'Notemba'],
    ubuntuLesson: 'Every child carries family history and brings new hope',
    impact: 'medium'
  },
  {
    id: '2024-birth-milani',
    year: 2024,
    month: 1,
    title: 'Birth of Milani',
    description: 'January 15, 2024: Birth of Milani Mdeni, daughter of Kwakho. Our newest family blessing, representing the future.',
    category: 'family',
    familyMembers: ['Kwakho', 'Milani', 'Milande', 'Notemba'],
    ubuntuLesson: 'New generations bring fresh energy to family traditions - each birth renews our commitment to Ubuntu',
    impact: 'high'
  },

  // 2019: Legal Advocacy Begins
  {
    id: '2019-legal-advocacy',
    year: 2019,
    title: 'Legal Advocacy Begins',
    description: 'Family Advocate and Children\'s Court mediation: Salatiso seeks equal parental rights',
    category: 'legal',
    familyMembers: ['Salatiso', 'Mpho', 'Sazi'],
    ubuntuLesson: 'Justice requires persistence and courage',
    impact: 'high'
  },

  // 2020-2024: Extended Proceedings
  {
    id: '2024-interim-order',
    year: 2024,
    month: 2,
    title: 'Interim Custody Order',
    description: 'February 26, 2024: Interim order grants primary residence to Mpho, limited access for Salatiso',
    category: 'legal',
    familyMembers: ['Salatiso', 'Mpho', 'Sazi'],
    ubuntuLesson: 'Legal battles test family resilience and unity',
    impact: 'high'
  },

  // 2024-2025: Resolution and Business
  {
    id: '2025-final-judgment',
    year: 2025,
    month: 6,
    title: 'Final Custody Judgment',
    description: 'June 11, 2025: Final judgment maintains Mpho\'s primary custody with conditions (parenting classes, mediation)',
    category: 'legal',
    familyMembers: ['Salatiso', 'Mpho', 'Sazi'],
    ubuntuLesson: 'Resolution brings opportunity for growth and healing',
    impact: 'high'
  },

  // Business Development
  {
    id: '2024-mni-foundation',
    year: 2024,
    title: 'MNI Foundation',
    description: 'Establishment of Mlandeni-Notemba Investments with family-first focus',
    category: 'business',
    familyMembers: ['Salatiso', 'Visa', 'Kwakho', 'Tina'],
    ubuntuLesson: 'Business should serve family prosperity and community good',
    impact: 'high'
  },

  // Education
  {
    id: '2024-sazi-homeschooling',
    year: 2024,
    title: 'Sazi\'s Homeschooling Journey',
    description: 'Transition to personalized, holistic education aligned with Ubuntu values',
    category: 'education',
    familyMembers: ['Sazi', 'Salatiso', 'Kwakho'],
    ubuntuLesson: 'Education should nurture the whole person and cultural identity',
    impact: 'high'
  }
];

interface FamilyTimelineProps {
  onEventSelect?: (event: TimelineEvent) => void;
}

const FamilyTimeline: React.FC<FamilyTimelineProps> = ({ onEventSelect }) => {
  const { user } = useAuth();
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterMember, setFilterMember] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'timeline' | 'proposals'>('timeline');
  const [showEditor, setShowEditor] = useState(false);
  const [editingEvent, setEditingEvent] = useState<TimelineEvent | null>(null);
  const [editorMode, setEditorMode] = useState<'add' | 'edit'>('add');

  // Proposals data - will be loaded from Firestore in production
  const [proposals, setProposals] = useState<TimelineProposal[]>([]);

  const categories = [
    { id: 'all', name: 'All Events', color: 'bg-ubuntu-warm-100 text-ubuntu-warm-800' },
    { id: 'foundation', name: 'Foundations', color: 'bg-purple-100 text-purple-800' },
    { id: 'financial', name: 'Financial', color: 'bg-green-100 text-green-800' },
    { id: 'family', name: 'Family', color: 'bg-blue-100 text-blue-800' },
    { id: 'legal', name: 'Legal', color: 'bg-red-100 text-red-800' },
    { id: 'business', name: 'Business', color: 'bg-yellow-100 text-yellow-800' },
    { id: 'education', name: 'Education', color: 'bg-indigo-100 text-indigo-800' }
  ];

  const familyMembers = [
    'Salatiso', 'Visa', 'Kwakho', 'Tina', 'Solo', 'Mila', 'Milande', 'Azora', 'Milani', 'Sazi', 'Mpho (External)'
  ];

  const filteredEvents = timelineEvents.filter(event => {
    const categoryMatch = filterCategory === 'all' || event.category === filterCategory;
    const memberMatch = filterMember === 'all' ||
      (event.familyMembers && event.familyMembers.includes(filterMember));
    return categoryMatch && memberMatch;
  });

  const groupedEvents = filteredEvents.reduce((groups, event) => {
    const year = event.year;
    if (!groups[year]) {
      groups[year] = [];
    }
    groups[year].push(event);
    return groups;
  }, {} as Record<number, TimelineEvent[]>);

  const sortedYears = Object.keys(groupedEvents)
    .map(Number)
    .sort((a, b) => a - b);

  const handleEventClick = (event: TimelineEvent) => {
    setSelectedEvent(event);
    onEventSelect?.(event);
  };

  const handleAddEvent = () => {
    setEditingEvent(null);
    setEditorMode('add');
    setShowEditor(true);
  };

  const handleEditEvent = (event: TimelineEvent) => {
    setEditingEvent(event);
    setEditorMode('edit');
    setShowEditor(true);
  };

  const handleSaveEvent = async (eventData: Omit<TimelineEvent, 'id'>) => {
    if (editorMode === 'add') {
      // In real app, this would create a proposal
      console.log('Creating proposal for new event:', eventData);
      // For now, just close the editor
      setShowEditor(false);
    } else if (editorMode === 'edit' && editingEvent) {
      // In real app, this would create an edit proposal
      console.log('Creating proposal to edit event:', editingEvent.id, eventData);
      // For now, just close the editor
      setShowEditor(false);
    }
  };

  const handleVoteOnProposal = async (proposalId: string, vote: 'approve' | 'reject') => {
    if (!user) return;

    // In real app, this would update Firestore
    setProposals(prevProposals =>
      prevProposals.map(proposal => {
        if (proposal.id === proposalId) {
          const newVotes = { ...proposal.votes, [user.id || 'unknown']: vote };
          const approveCount = Object.values(newVotes).filter(v => v === 'approve').length;

          // Check if approved
          const newStatus = approveCount >= proposal.requiredApprovals ? 'approved' : 'pending';

          return {
            ...proposal,
            votes: newVotes,
            status: newStatus
          };
        }
        return proposal;
      })
    );
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      foundation: 'border-purple-500 bg-purple-50',
      financial: 'border-green-500 bg-green-50',
      family: 'border-blue-500 bg-blue-50',
      legal: 'border-red-500 bg-red-50',
      business: 'border-yellow-500 bg-yellow-50',
      education: 'border-indigo-500 bg-indigo-50'
    };
    return colors[category] || 'border-ubuntu-warm-500 bg-ubuntu-warm-50';
  };

  const getImpactSize = (impact: string) => {
    switch (impact) {
      case 'high': return 'w-4 h-4';
      case 'medium': return 'w-3 h-3';
      default: return 'w-2 h-2';
    }
  };

  return (
    <div className="w-full">
      {/* View Mode Toggle and Actions */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex bg-ubuntu-warm-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'timeline'
                  ? 'bg-white text-ubuntu-warm-900 shadow-sm'
                  : 'text-ubuntu-warm-600 hover:text-ubuntu-warm-900'
              }`}
            >
              Timeline View
            </button>
            <button
              onClick={() => setViewMode('proposals')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'proposals'
                  ? 'bg-white text-ubuntu-warm-900 shadow-sm'
                  : 'text-ubuntu-warm-600 hover:text-ubuntu-warm-900'
              }`}
            >
              Proposals ({proposals.length})
            </button>
          </div>
        </div>

        {user && (
          <div className="flex items-center space-x-2">
            <button
              onClick={handleAddEvent}
              className="inline-flex items-center px-4 py-2 bg-ubuntu-gold text-white rounded-lg hover:bg-ubuntu-gold/90 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Event
            </button>
          </div>
        )}
      </div>

      {/* Show different views based on mode */}
      {viewMode === 'proposals' ? (
        <VotingInterface
          proposals={proposals}
          currentUserId={user?.id || ''}
          currentUserEmail={user?.email || ''}
          onVote={handleVoteOnProposal}
        />
      ) : (
        <>
          {/* Filters */}
      <div className="mb-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-ubuntu-warm-700 mb-2">
            Filter by Category
          </label>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setFilterCategory(category.id)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  filterCategory === category.id
                    ? category.color
                    : 'bg-ubuntu-warm-100 text-ubuntu-warm-600 hover:bg-ubuntu-warm-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-ubuntu-warm-700 mb-2">
            Filter by Family Member
          </label>
          <select
            value={filterMember}
            onChange={(e) => setFilterMember(e.target.value)}
            className="px-3 py-2 border border-ubuntu-warm-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ubuntu-gold focus:border-transparent"
          >
            <option value="all">All Members</option>
            {familyMembers.map(member => (
              <option key={member} value={member}>{member}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-8">
        {sortedYears.map(year => (
          <div key={year} className="relative">
            {/* Year Header */}
            <div className="flex items-center mb-4">
              <div className="flex items-center space-x-3">
                <Calendar className="w-6 h-6 text-ubuntu-gold" />
                <h3 className="text-2xl font-ubuntu font-bold text-ubuntu-warm-900">
                  {year}
                </h3>
              </div>
              <div className="flex-1 ml-4 h-px bg-ubuntu-warm-300" />
            </div>

            {/* Events for this year */}
            <div className="space-y-4 ml-9">
              {groupedEvents[year]
                .sort((a, b) => (a.month || 0) - (b.month || 0))
                .map(event => (
                  <div key={event.id} className="relative flex items-start space-x-4">
                    {/* Timeline dot */}
                    <div className={`absolute -left-9 top-2 rounded-full border-2 ${getCategoryColor(event.category)}`}>
                      <div className={`rounded-full bg-ubuntu-gold ${getImpactSize(event.impact)}`} />
                    </div>

                    {/* Event card */}
                    <button
                      onClick={() => handleEventClick(event)}
                      className={`flex-1 text-left p-4 rounded-lg border transition-all hover:shadow-md ${
                        selectedEvent?.id === event.id
                          ? 'border-ubuntu-gold bg-ubuntu-warm-50 shadow-md'
                          : 'border-ubuntu-warm-200 bg-white hover:border-ubuntu-warm-300'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-ubuntu font-semibold text-ubuntu-warm-900 mb-1">
                            {event.title}
                          </h4>
                          <p className="text-ubuntu-warm-700 text-sm mb-2">
                            {event.description}
                          </p>
                          {event.familyMembers && event.familyMembers.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-2">
                              {event.familyMembers.map(member => (
                                <span
                                  key={member}
                                  className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-ubuntu-warm-100 text-ubuntu-warm-700"
                                >
                                  <FamilyIcon className="w-3 h-3 mr-1" />
                                  {member}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
                          {user && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditEvent(event);
                              }}
                              className="p-1 text-ubuntu-warm-500 hover:text-ubuntu-gold transition-colors"
                              title="Edit event"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          )}
                          <MilestoneIcon className="w-5 h-5 text-ubuntu-gold" />
                        </div>
                      </div>
                    </button>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      {/* Selected Event Details */}
      {selectedEvent && (
        <div className="mt-8 bg-white rounded-xl p-6 border border-ubuntu-warm-200 shadow-sm">
          <div className="flex items-start space-x-4">
            <MilestoneIcon className="w-8 h-8 text-ubuntu-gold flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-xl font-ubuntu font-bold text-ubuntu-warm-900 mb-2">
                {selectedEvent.title}
              </h3>
              <p className="text-ubuntu-warm-700 mb-4">
                {selectedEvent.description}
              </p>

              {selectedEvent.ubuntuLesson && (
                <div className="mb-4">
                  <h4 className="font-ubuntu font-semibold text-ubuntu-warm-900 mb-2">
                    Ubuntu Wisdom
                  </h4>
                  <blockquote className="text-ubuntu-warm-800 italic border-l-4 border-ubuntu-gold pl-4">
                    {selectedEvent.ubuntuLesson}
                  </blockquote>
                </div>
              )}

              {selectedEvent.familyMembers && (
                <div>
                  <h4 className="font-ubuntu font-semibold text-ubuntu-warm-900 mb-2">
                    Family Members Involved
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedEvent.familyMembers.map(member => (
                      <span
                        key={member}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-ubuntu-warm-100 text-ubuntu-warm-700"
                      >
                        <FamilyIcon className="w-4 h-4 mr-1" />
                        {member}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      </>
      )}

      {/* Timeline Editor Modal */}
      {showEditor && (
        <TimelineEditor
          event={editingEvent}
          isOpen={showEditor}
          onClose={() => setShowEditor(false)}
          onSave={handleSaveEvent}
          mode={editorMode}
        />
      )}
    </div>
  );
};

export default FamilyTimeline;
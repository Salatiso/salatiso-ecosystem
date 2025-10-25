import React from 'react';
import IntranetLayout from '../components/layouts/IntranetLayout';
import { 
  Brain, 
  Sparkles, 
  Rocket, 
  Users, 
  BookOpen, 
  Target,
  TrendingUp,
  Award,
  Zap,
  Globe,
  Code,
  Megaphone,
  Palette,
  Heart
} from 'lucide-react';

const AILearningPage: React.FC = () => {
  const familyMembers = [
    {
      name: 'Solo',
      role: 'Lead Developer & Platform Architect',
      icon: Code,
      color: 'purple',
      focus: 'AI Agent Development & Automation',
      tools: [
        { name: 'LangChain', type: 'Agent Framework', free: true },
        { name: 'AutoGPT', type: 'Autonomous Agents', free: true },
        { name: 'n8n', type: 'Workflow Automation', free: true },
        { name: 'Claude API', type: 'Content Generation', free: 'Tier' },
        { name: 'GitHub Copilot', type: 'Code Assistant', free: false }
      ],
      goals: [
        'Build autonomous agents for business automation',
        'Create content generation systems',
        'Automate campaign management',
        'Extract articles/books from context'
      ],
      timeCommitment: '5-10 hours/week',
      targetCompletion: '3 months'
    },
    {
      name: 'Tina',
      role: 'Marketing & Communications Manager',
      icon: Megaphone,
      color: 'blue',
      focus: 'AI-Powered Digital Marketing',
      tools: [
        { name: 'Canva', type: 'Design & Social Media', free: true },
        { name: 'Buffer', type: 'Social Management', free: 'Tier' },
        { name: 'Copy.ai', type: 'Marketing Copy', free: '2k words/mo' },
        { name: 'Mailchimp', type: 'Email Marketing', free: '500 contacts' },
        { name: 'ChatGPT', type: 'Content Generation', free: true }
      ],
      goals: [
        '10x content production speed',
        'Professional designs without designer',
        'Data-driven campaign optimization',
        '50% improvement in engagement'
      ],
      timeCommitment: '5-8 hours/week',
      targetCompletion: '2 months'
    },
    {
      name: 'Kwakho',
      role: 'Content Creator - Sazi Life Academy',
      icon: Palette,
      color: 'green',
      focus: 'AI-Enhanced Educational Content',
      tools: [
        { name: 'Genially', type: 'Interactive Content', free: true },
        { name: 'Synthesia', type: 'AI Video Creation', free: 'Trial' },
        { name: 'Leonardo.AI', type: 'AI Art Generation', free: '150/day' },
        { name: 'Kahoot!', type: 'Interactive Quizzes', free: true },
        { name: 'ElevenLabs', type: 'AI Voice Generation', free: '10k chars/mo' }
      ],
      goals: [
        'Create 20+ interactive learning modules',
        '90% student engagement rates',
        'Immersive educational experiences',
        'Multi-language content production'
      ],
      timeCommitment: '6-10 hours/week',
      targetCompletion: '2-3 months'
    },
    {
      name: 'Visa (Sibling)',
      role: 'Ubuntu Wisdom Keeper & Cultural Curator',
      icon: Heart,
      color: 'yellow',
      focus: 'AI-Assisted Cultural Documentation',
      tools: [
        { name: 'ChatGPT', type: 'Story Enhancement', free: true },
        { name: 'Remini', type: 'Photo Restoration', free: 'Tier' },
        { name: 'Otter.ai', type: 'Story Transcription', free: '300 min/mo' },
        { name: 'Descript', type: 'Audio Preservation', free: 'Tier' }
      ],
      goals: [
        'Document 100+ family stories',
        'Heritage in all 15 platform languages',
        'Interactive family history',
        'Cultural wisdom in Sazi Life Academy'
      ],
      timeCommitment: '2-4 hours/week',
      targetCompletion: 'Ongoing project'
    }
  ];

  const programPhases = [
    {
      phase: 'Phase 1',
      title: 'AI Awareness',
      duration: 'Week 1-2',
      activities: [
        'Introduction to AI capabilities',
        'Hands-on demonstrations',
        'Use case discussions'
      ]
    },
    {
      phase: 'Phase 2',
      title: 'Tool Selection',
      duration: 'Week 3-4',
      activities: [
        'Identify priority tools',
        'Account setup and training',
        'Create sample projects'
      ]
    },
    {
      phase: 'Phase 3',
      title: 'Skill Development',
      duration: 'Month 2-3',
      activities: [
        'Weekly practice sessions',
        'Project-based learning',
        'Peer teaching'
      ]
    },
    {
      phase: 'Phase 4',
      title: 'Integration & Automation',
      duration: 'Month 4+',
      activities: [
        'Daily workflow integration',
        'Custom automation workflows',
        'Productivity measurement'
      ]
    }
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; border: string }> = {
      purple: { bg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-300' },
      blue: { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-300' },
      green: { bg: 'bg-green-100', text: 'text-green-600', border: 'border-green-300' },
      yellow: { bg: 'bg-yellow-100', text: 'text-yellow-600', border: 'border-yellow-300' }
    };
    return colors[color] || colors.purple;
  };

  return (
    <IntranetLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-ubuntu-purple to-ubuntu-gold text-white p-8 rounded-lg mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center mb-4">
                <Brain className="w-12 h-12 mr-4" />
                <div>
                  <h1 className="text-3xl font-bold">AI-Powered Family Skills Development</h1>
                  <p className="text-lg opacity-90">Ubuntu-aligned continuous learning for the entire family</p>
                </div>
              </div>
              <p className="text-sm opacity-90 max-w-3xl">
                Every family member equipped with AI tools to excel in their role, contribute to collective success,
                and build sustainable Ubuntu-aligned businesses through continuous learning and innovation.
              </p>
            </div>
            <div className="hidden md:block">
              <Sparkles className="w-24 h-24 opacity-50" />
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-4 text-center">
            <Users className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">4</div>
            <div className="text-sm text-gray-600">Family Members</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-4 text-center">
            <Zap className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">20+</div>
            <div className="text-sm text-gray-600">Free AI Tools</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-4 text-center">
            <Globe className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">15</div>
            <div className="text-sm text-gray-600">Languages Supported</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-4 text-center">
            <TrendingUp className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">10x</div>
            <div className="text-sm text-gray-600">Productivity Goal</div>
          </div>
        </div>

        {/* Family Learning Paths */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-ubuntu-purple mb-6 flex items-center">
            <Target className="w-6 h-6 mr-2" />
            Family-Specific AI Learning Paths
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {familyMembers.map((member) => {
              const colors = getColorClasses(member.color);
              const MemberIcon = member.icon;
              
              return (
                <div key={member.name} className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className={`${colors.bg} p-6 border-b-4 ${colors.border}`}>
                    <div className="flex items-center mb-3">
                      <div className={`w-12 h-12 ${colors.bg} rounded-full flex items-center justify-center mr-4 border-2 ${colors.border}`}>
                        <MemberIcon className={`w-6 h-6 ${colors.text}`} />
                      </div>
                      <div>
                        <h3 className={`text-xl font-bold ${colors.text}`}>{member.name}</h3>
                        <p className="text-sm text-gray-600">{member.role}</p>
                      </div>
                    </div>
                    <div className={`inline-block px-3 py-1 ${colors.bg} ${colors.text} rounded-full text-sm font-semibold`}>
                      {member.focus}
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Recommended AI Tools:</h4>
                      <div className="space-y-2">
                        {member.tools.map((tool, idx) => (
                          <div key={idx} className="flex items-center justify-between text-sm">
                            <div>
                              <span className="font-medium">{tool.name}</span>
                              <span className="text-gray-500 ml-2">• {tool.type}</span>
                            </div>
                            <span className={`px-2 py-1 rounded text-xs ${
                              tool.free === true ? 'bg-green-100 text-green-700' :
                              tool.free === false ? 'bg-orange-100 text-orange-700' :
                              'bg-blue-100 text-blue-700'
                            }`}>
                              {tool.free === true ? 'Free' : tool.free === false ? 'Paid' : tool.free}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Learning Goals:</h4>
                      <ul className="space-y-1 text-sm">
                        {member.goals.map((goal, idx) => (
                          <li key={idx} className="flex items-start">
                            <Award className="w-4 h-4 text-ubuntu-gold mr-2 flex-shrink-0 mt-0.5" />
                            <span>{goal}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex justify-between text-xs text-gray-600 pt-4 border-t">
                      <div>
                        <span className="font-semibold">Time:</span> {member.timeCommitment}
                      </div>
                      <div>
                        <span className="font-semibold">Target:</span> {member.targetCompletion}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Program Structure */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-ubuntu-purple mb-6 flex items-center">
            <Rocket className="w-6 h-6 mr-2" />
            4-Phase AI Education Program
          </h2>

          <div className="grid md:grid-cols-4 gap-4">
            {programPhases.map((phase, idx) => (
              <div key={idx} className="border-2 border-ubuntu-purple rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-ubuntu-purple text-white rounded-full flex items-center justify-center font-bold mr-3">
                    {idx + 1}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{phase.title}</h3>
                    <p className="text-xs text-gray-500">{phase.duration}</p>
                  </div>
                </div>
                <ul className="space-y-1 text-sm">
                  {phase.activities.map((activity, actIdx) => (
                    <li key={actIdx} className="flex items-start">
                      <span className="text-ubuntu-gold mr-2">•</span>
                      <span>{activity}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Mandatory Training */}
        <div className="bg-gradient-to-r from-ubuntu-purple to-ubuntu-gold text-white rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <BookOpen className="w-6 h-6 mr-2" />
            Mandatory AI Training Components (HR Requirement)
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">1. AI Literacy Module (4 hours)</h3>
              <ul className="space-y-1 text-sm opacity-90">
                <li>• Understanding AI capabilities and limitations</li>
                <li>• Ethical AI use and data privacy</li>
                <li>• Prompt engineering basics</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">2. Role-Specific Training (10-20 hours)</h3>
              <ul className="space-y-1 text-sm opacity-90">
                <li>• Tailored to individual responsibilities</li>
                <li>• Hands-on tool mastery</li>
                <li>• Project completion requirement</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">3. Monthly AI Skill Updates (2 hours/month)</h3>
              <ul className="space-y-1 text-sm opacity-90">
                <li>• New tool discoveries</li>
                <li>• Best practice sharing</li>
                <li>• Family showcase presentations</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">4. Quarterly AI Impact Review</h3>
              <ul className="space-y-1 text-sm opacity-90">
                <li>• Productivity metrics analysis</li>
                <li>• Cost savings measurement</li>
                <li>• Workflow optimization opportunities</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Success Metrics */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-ubuntu-purple mb-6 flex items-center">
            <TrendingUp className="w-6 h-6 mr-2" />
            Success Metrics & Expected Outcomes
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Individual KPIs:</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-sm">Hours saved per week</span>
                  <span className="font-bold text-green-600">Target: 10+</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-sm">Quality improvement</span>
                  <span className="font-bold text-green-600">Target: 50%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-sm">New capabilities acquired</span>
                  <span className="font-bold text-green-600">Target: 5+</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Family Enterprise KPIs:</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-sm">Content production time reduction</span>
                  <span className="font-bold text-green-600">-50% (3 months)</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-sm">Marketing content output increase</span>
                  <span className="font-bold text-green-600">10x (2 months)</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-sm">Repetitive tasks automated</span>
                  <span className="font-bold text-green-600">80% (6 months)</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <span className="text-sm">Family AI literacy</span>
                  <span className="font-bold text-green-600">100% (3 months)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-8 bg-gradient-to-r from-ubuntu-purple to-ubuntu-gold text-white rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Transform Your Role with AI?</h2>
          <p className="mb-6 opacity-90">
            Start your AI learning journey today and unlock unprecedented productivity and creativity.
          </p>
          <div className="flex justify-center gap-4">
            <button className="bg-white text-ubuntu-purple px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
              View Full Program Details
            </button>
            <button className="border-2 border-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition">
              Start AI Literacy Module
            </button>
          </div>
        </div>
      </div>
    </IntranetLayout>
  );
};

export default AILearningPage;
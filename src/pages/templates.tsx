import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FileText, Search, Filter, Download, Eye, Star, Clock, Users, Wifi } from 'lucide-react';
import { useRouter } from 'next/router';
import { SonnyTemplateCard, SonnyCollaborationPanel } from '@/components/templates/SonnyTemplateCard';
import Head from 'next/head';
import PublicLayout from '@/components/layouts/PublicLayout';

interface Template {
  id: string;
  name: string;
  category: 'personal' | 'professional' | 'family' | 'quickstart';
  type: 'guide' | 'manual' | 'interactive' | 'brochure' | 'pack';
  description: string;
  version: string;
  path: string;
  saziFocus: string;
  lifecvProofType: string;
  downloadCount?: number;
  rating?: number;
  lastUpdated: string;
  // Enhanced properties for Sonny integration
  collaborationMode?: 'individual' | 'family' | 'group';
  ubuntuPrinciples?: string[];
  requiredParticipants?: string[];
  estimatedTime?: string;
  sonnyEnabled?: boolean;
}

// Template categories and filters
const categories = [
  { id: 'all', name: 'All Templates', icon: FileText },
  { id: 'family', name: 'Family', icon: Users },
  { id: 'personal', name: 'Personal', icon: Eye },
  { id: 'professional', name: 'Professional', icon: FileText },
  { id: 'quickstart', name: 'Quick Start', icon: Clock },
];

const filters = [
  'Most Popular',
  'Most Recent',
  'Ubuntu Principles',
  'Family Collaboration',
  'Sonny Enabled',
];

const TemplatesPage: React.FC = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'personal' | 'professional' | 'family' | 'quickstart'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'category' | 'downloads' | 'rating'>('name');
  const [selectedFilter, setSelectedFilter] = useState('Most Popular');
  const [showSonnyOnly, setShowSonnyOnly] = useState(false);
  const [activeCollaboration, setActiveCollaboration] = useState<string | null>(null);

  const templates: Template[] = useMemo(() => [
    // Personal Templates
    {
      id: 'p1-welcome-orientation',
      name: 'Welcome Orientation Brochure',
      category: 'personal',
      type: 'brochure',
      description: 'Introduction to BizHelp and the Salatiso ecosystem for new users',
      version: '1.0',
      path: '/templates/personal/p1-welcome-orientation.html',
      saziFocus: 'Personal Level 1',
      lifecvProofType: 'Orientation Completion',
      downloadCount: 245,
      rating: 4.8,
      lastUpdated: '2025-10-01',
      collaborationMode: 'individual',
      ubuntuPrinciples: [
        'Personal growth serves community benefit',
        'Learning with cultural identity',
        'Individual success lifts others'
      ],
      requiredParticipants: ['self'],
      estimatedTime: '30-60 minutes',
      sonnyEnabled: true
    },
    {
      id: 'p2-business-basics',
      name: 'Business Basics Guide',
      category: 'personal',
      type: 'guide',
      description: 'Fundamental concepts of starting and running a business in South Africa',
      version: '1.0',
      path: '/templates/personal/p2-business-basics.html',
      saziFocus: 'Personal Level 2',
      lifecvProofType: 'Business Fundamentals',
      downloadCount: 189,
      rating: 4.6,
      lastUpdated: '2025-10-01'
    },
    {
      id: 'p3-business-idea-journal',
      name: 'Business Idea Journal',
      category: 'personal',
      type: 'interactive',
      description: 'Interactive workbook for developing and validating business ideas',
      version: '1.0',
      path: '/templates/personal/p3-business-idea-journal.html',
      saziFocus: 'Personal Level 3',
      lifecvProofType: 'Idea Validation',
      downloadCount: 156,
      rating: 4.9,
      lastUpdated: '2025-10-01'
    },
    {
      id: 'p4-business-names-branding',
      name: 'Business Names & Branding Guide',
      category: 'personal',
      type: 'guide',
      description: 'Complete guide to choosing business names and building brand identity',
      version: '1.0',
      path: '/templates/personal/p4-business-names-branding.html',
      saziFocus: 'Personal Level 4',
      lifecvProofType: 'Brand Development',
      downloadCount: 134,
      rating: 4.7,
      lastUpdated: '2025-10-01'
    },
    {
      id: 'p5-money-basics',
      name: 'Money Basics Guide',
      category: 'personal',
      type: 'guide',
      description: 'Essential financial literacy and money management for entrepreneurs',
      version: '1.0',
      path: '/templates/personal/p5-money-basics.html',
      saziFocus: 'Personal Level 5',
      lifecvProofType: 'Financial Literacy',
      downloadCount: 203,
      rating: 4.5,
      lastUpdated: '2025-10-01'
    },

    // Professional Templates
    {
      id: 'pr1-wizard-guide',
      name: 'Business Setup Wizard Guide',
      category: 'professional',
      type: 'manual',
      description: 'Step-by-step guide for setting up your professional business structure',
      version: '1.0',
      path: '/templates/professional/pr1-wizard-guide.html',
      saziFocus: 'Professional Level 1',
      lifecvProofType: 'Business Setup',
      downloadCount: 178,
      rating: 4.8,
      lastUpdated: '2025-10-01'
    },
    {
      id: 'pr2-business-operations',
      name: 'Professional Business Operations Guide',
      category: 'professional',
      type: 'guide',
      description: 'Comprehensive guide to running professional business operations',
      version: '1.0',
      path: '/templates/professional/pr2-business-operations.html',
      saziFocus: 'Professional Level 2',
      lifecvProofType: 'Operations Management',
      downloadCount: 145,
      rating: 4.6,
      lastUpdated: '2025-10-01'
    },
    {
      id: 'pr3-marketing-sales',
      name: 'Marketing & Sales Guide',
      category: 'professional',
      type: 'guide',
      description: 'Professional marketing and sales strategies for South African businesses',
      version: '1.0',
      path: '/templates/professional/pr3-marketing-sales.html',
      saziFocus: 'Professional Level 3',
      lifecvProofType: 'Marketing Strategy',
      downloadCount: 167,
      rating: 4.7,
      lastUpdated: '2025-10-01'
    },
    {
      id: 'pr4-financial-management',
      name: 'Financial Management Guide',
      category: 'professional',
      type: 'guide',
      description: 'Professional financial management and accounting practices',
      version: '1.0',
      path: '/templates/professional/pr4-financial-management.html',
      saziFocus: 'Professional Level 4',
      lifecvProofType: 'Financial Management',
      downloadCount: 198,
      rating: 4.9,
      lastUpdated: '2025-10-01'
    },
    {
      id: 'pr5-operations-compliance',
      name: 'Operations & Compliance Guide',
      category: 'professional',
      type: 'guide',
      description: 'Operational excellence and regulatory compliance for businesses',
      version: '1.0',
      path: '/templates/professional/pr5-operations-compliance.html',
      saziFocus: 'Professional Level 5',
      lifecvProofType: 'Compliance Achievement',
      downloadCount: 134,
      rating: 4.5,
      lastUpdated: '2025-10-01'
    },
    {
      id: 'pr6-scaling-growth',
      name: 'Scaling & Growth Guide',
      category: 'professional',
      type: 'guide',
      description: 'Strategies for scaling and growing your professional business',
      version: '1.0',
      path: '/templates/professional/pr6-scaling-growth.html',
      saziFocus: 'Professional Level 6',
      lifecvProofType: 'Business Scaling',
      downloadCount: 112,
      rating: 4.8,
      lastUpdated: '2025-10-01'
    },

    // Family Templates
    {
      id: 'f1-business-together',
      name: 'Business Together Guide',
      category: 'family',
      type: 'guide',
      description: 'Starting a business with family members and maintaining relationships',
      version: '1.0',
      path: '/templates/family/f1-business-together.html',
      saziFocus: 'Family Level 1',
      lifecvProofType: 'Family Business Start',
      downloadCount: 156,
      rating: 4.7,
      lastUpdated: '2025-10-01',
      collaborationMode: 'family',
      ubuntuPrinciples: [
        'Collective ownership and shared responsibility',
        'Transparent decision-making processes',
        'Mutual support in business challenges',
        'Wealth sharing that benefits entire family'
      ],
      requiredParticipants: ['family-head', 'business-partners', 'elder-advisor'],
      estimatedTime: '2-4 hours',
      sonnyEnabled: true
    },
    {
      id: 'f2-council-governance',
      name: 'Council Governance Guide',
      category: 'family',
      type: 'guide',
      description: 'Setting up family councils and governance structures',
      version: '1.0',
      path: '/templates/family/f2-council-governance.html',
      saziFocus: 'Family Level 2',
      lifecvProofType: 'Governance Setup',
      downloadCount: 98,
      rating: 4.6,
      lastUpdated: '2025-10-01',
      collaborationMode: 'family',
      ubuntuPrinciples: [
        'Every voice matters in family decisions',
        'Elders provide wisdom, youth provide innovation',
        'Consensus over individual preference',
        'Collective well-being guides all choices'
      ],
      requiredParticipants: ['all-adult-family-members'],
      estimatedTime: '3-5 hours',
      sonnyEnabled: true
    },
    {
      id: 'f3-company-registration',
      name: 'Company Registration Guide',
      category: 'family',
      type: 'guide',
      description: 'Registering family businesses with CIPC and related processes',
      version: '1.0',
      path: '/templates/family/f3-company-registration.html',
      saziFocus: 'Family Level 3',
      lifecvProofType: 'Company Registration',
      downloadCount: 187,
      rating: 4.8,
      lastUpdated: '2025-10-01'
    },
    {
      id: 'f3-succession-planning',
      name: 'Succession Planning Guide',
      category: 'family',
      type: 'guide',
      description: 'Planning for business succession and family wealth transfer',
      version: '1.0',
      path: '/templates/family/f3-succession-planning.html',
      saziFocus: 'Family Level 3',
      lifecvProofType: 'Succession Planning',
      downloadCount: 134,
      rating: 4.9,
      lastUpdated: '2025-10-01'
    },
    {
      id: 'f4-shareholders-agreement',
      name: 'Shareholders Agreement Guide',
      category: 'family',
      type: 'guide',
      description: 'Creating shareholder agreements for family businesses',
      version: '1.0',
      path: '/templates/family/f4-shareholders-agreement.html',
      saziFocus: 'Family Level 4',
      lifecvProofType: 'Shareholder Agreement',
      downloadCount: 145,
      rating: 4.7,
      lastUpdated: '2025-10-01'
    },
    {
      id: 'f5-ip-protection',
      name: 'IP Protection Guide',
      category: 'family',
      type: 'guide',
      description: 'Protecting intellectual property in family businesses',
      version: '1.0',
      path: '/templates/family/f5-ip-protection.html',
      saziFocus: 'Family Level 5',
      lifecvProofType: 'IP Protection',
      downloadCount: 89,
      rating: 4.5,
      lastUpdated: '2025-10-01'
    },
    {
      id: 'f6-trust-setup',
      name: 'Trust Setup Guide',
      category: 'family',
      type: 'guide',
      description: 'Setting up family trusts for asset protection and succession',
      version: '1.0',
      path: '/templates/family/f6-trust-setup.html',
      saziFocus: 'Family Level 6',
      lifecvProofType: 'Trust Establishment',
      downloadCount: 76,
      rating: 4.8,
      lastUpdated: '2025-10-01'
    },

    // QuickStart Templates
    {
      id: 'mission-cards',
      name: 'Mission Cards Pack',
      category: 'quickstart',
      type: 'pack',
      description: 'Quick-start mission cards for immediate business action',
      version: '1.0',
      path: '/templates/quickstart/mission-cards.html',
      saziFocus: 'QuickStart',
      lifecvProofType: 'Mission Initiation',
      downloadCount: 234,
      rating: 4.9,
      lastUpdated: '2025-10-01'
    }
  ], []);

  const templatesWithCount = [
    { id: 'all', name: 'All Templates', count: templates.length, icon: FileText },
    { id: 'personal', name: 'Personal', count: templates.filter(t => t.category === 'personal').length, icon: Eye },
    { id: 'professional', name: 'Professional', count: templates.filter(t => t.category === 'professional').length, icon: FileText },
    { id: 'family', name: 'Family', count: templates.filter(t => t.category === 'family').length, icon: Users },
    { id: 'quickstart', name: 'QuickStart', count: templates.filter(t => t.category === 'quickstart').length, icon: Clock }
  ];

  const filteredAndSortedTemplates = useMemo(() => {
    let filtered = templates.filter(template => {
      const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
      const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          template.saziFocus.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Apply additional filters
      const matchesFilter = (() => {
        switch (selectedFilter) {
          case 'Ubuntu Principles':
            return template.ubuntuPrinciples && template.ubuntuPrinciples.length > 0;
          case 'Family Collaboration':
            return template.collaborationMode === 'family';
          case 'Sonny Enabled':
            return template.sonnyEnabled === true;
          case 'Most Recent':
            return new Date(template.lastUpdated) > new Date('2025-09-01');
          default:
            return true;
        }
      })();
      
      const matchesSonnyFilter = !showSonnyOnly || template.sonnyEnabled === true;
      
      return matchesCategory && matchesSearch && matchesFilter && matchesSonnyFilter;
    });

    // Sort templates
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'category':
          return a.category.localeCompare(b.category);
        case 'downloads':
          return (b.downloadCount || 0) - (a.downloadCount || 0);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [templates, selectedCategory, searchTerm, sortBy, selectedFilter, showSonnyOnly]);

  const handleViewTemplate = (template: Template) => {
    window.open(template.path, '_blank');
  };

  const handleDownloadTemplate = (template: Template) => {
    // Create a temporary anchor element to trigger download
    const link = document.createElement('a');
    link.href = template.path;
    link.download = `${template.name.replace(/\s+/g, '_')}_v${template.version}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  return (
    <PublicLayout>
      <Head>
        <title>Template Library | Salatiso Ecosystem</title>
        <meta 
          name="description" 
          content="Professional business document templates with Ubuntu principles and Sonny collaboration features for South African entrepreneurs." 
        />
      </Head>
      
      <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="flex justify-center mb-6">
              <FileText className="w-16 h-16" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Template Library
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Professional business document templates with Ubuntu principles and Sonny collaboration features for South African entrepreneurs and family businesses.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => document.getElementById('template-grid')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Browse Templates
              </button>
                <button
                  onClick={() => setShowSonnyOnly(true)}
                  className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  <Wifi className="w-5 h-5" />
                  Sonny Collaboration
                </button>
                <button
                  onClick={() => router.push('/testing')}
                  className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors"
                >
                  Testing Hub
                </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="text-gray-400 w-5 h-5" />
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {filters.map(filter => (
                    <option key={filter} value={filter}>{filter}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="name">Sort by Name</option>
                  <option value="category">Sort by Category</option>
                  <option value="downloads">Sort by Downloads</option>
                  <option value="rating">Sort by Rating</option>
                </select>
              </div>

              {/* Sonny Toggle */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowSonnyOnly(!showSonnyOnly)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                    showSonnyOnly 
                      ? 'bg-blue-600 text-white border-blue-600' 
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <Wifi className="w-4 h-4" />
                  <span className="text-sm font-medium">Sonny Only</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="py-4 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2">
            {templatesWithCount.map((category) => {
              const IconComponent = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id as any)}
                  className={`flex items-center gap-2 px-6 py-2 rounded-full font-medium transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-purple-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  {category.name} ({category.count})
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Templates Grid */}
      <section id="template-grid" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {selectedCategory === 'all' ? 'All Templates' : `${templatesWithCount.find(c => c.id === selectedCategory)?.name} Templates`}
            </h2>
            <p className="text-gray-600">
              {filteredAndSortedTemplates.length} template{filteredAndSortedTemplates.length !== 1 ? 's' : ''} found
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedTemplates.map((template, index) => {
              // Convert template to Sonny format
              const sonnyTemplate = {
                id: template.id,
                title: template.name,
                description: template.description,
                category: template.category,
                type: template.category as 'business' | 'governance' | 'development' | 'ethics' | 'technical',
                collaborationMode: template.collaborationMode || 'individual' as const,
                ubuntuPrinciples: template.ubuntuPrinciples || [],
                requiredParticipants: template.requiredParticipants || ['self'],
                estimatedTime: template.estimatedTime || '1-2 hours',
                tags: [
                  template.category,
                  template.saziFocus.toLowerCase().replace(/\s+/g, '-'),
                  ...(template.sonnyEnabled ? ['sonny'] : []),
                  ...(template.ubuntuPrinciples && template.ubuntuPrinciples.length > 0 ? ['ubuntu'] : [])
                ],
                rating: template.rating || 0,
                uses: template.downloadCount || 0
              };

              return template.sonnyEnabled ? (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <SonnyTemplateCard 
                      templateId={template.id}
                templateName={template.name}
                templateCategory={template.category}
                templatePath={template.path}
                      collaborationMode={sonnyTemplate.collaborationMode}
                      ubuntuPrinciples={sonnyTemplate.ubuntuPrinciples}
                    onStartCollaboration={(sessionId) => setActiveCollaboration(sessionId)}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        template.category === 'personal' ? 'bg-blue-100 text-blue-800' :
                        template.category === 'professional' ? 'bg-green-100 text-green-800' :
                        template.category === 'family' ? 'bg-purple-100 text-purple-800' :
                        'bg-orange-100 text-orange-800'
                      }`}>
                        {template.category}
                      </div>
                      <div className="text-xs text-gray-500">v{template.version}</div>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {template.name}
                    </h3>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {template.description}
                    </p>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-xs text-gray-500">
                          <Star className="w-3 h-3 mr-1 text-yellow-400" />
                          {template.rating} • {template.downloadCount} downloads
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="w-3 h-3 mr-1" />
                          {template.saziFocus}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewTemplate(template)}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                        <button
                          onClick={() => window.open(template.path, '_blank')}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
            })}
          </div>

          {filteredAndSortedTemplates.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-4">
              Need Custom Templates?
            </h2>
            <p className="text-xl mb-8 text-purple-100">
              Don&apos;t see what you need? We can create custom templates tailored to your specific business requirements.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push('/contact')}
                className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Request Custom Template
              </button>
              <button
                onClick={() => router.push('/testing')}
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition-colors"
              >
                Help Test New Templates
              </button>
            </div>
          </motion.div>
        </div>
      </section>
      </div>

      {/* Collaboration Panel */}
      {activeCollaboration && (
        <SonnyCollaborationPanel
            session={{
              id: activeCollaboration,
              templateId: activeCollaboration.split('-')[0] || 'unknown',
            initiator: 'current-user',
              participants: [],
            status: 'active',
            createdAt: new Date(),
            ubuntuCheckpoints: []
            }}
            onUpdateSession={(session) => {
              // Handle session updates
              console.log('Session updated:', session);
            }}
            onEndSession={() => setActiveCollaboration(null)}
        />
      )}
    </PublicLayout>
  );
};

export default TemplatesPage;
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Download, Eye, Star, Clock, Users } from 'lucide-react';

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
}

interface TemplateCatalogProps {
  templates: Template[];
  onViewTemplate: (template: Template) => void;
  onDownloadTemplate: (template: Template) => void;
}

export const TemplateCatalog: React.FC<TemplateCatalogProps> = ({
  templates,
  onViewTemplate,
  onDownloadTemplate
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'personal' | 'professional' | 'family' | 'quickstart'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'category' | 'downloads' | 'rating'>('name');

  const categories = [
    { id: 'all', name: 'All Templates', count: templates.length },
    { id: 'personal', name: 'Personal', count: templates.filter(t => t.category === 'personal').length },
    { id: 'professional', name: 'Professional', count: templates.filter(t => t.category === 'professional').length },
    { id: 'family', name: 'Family', count: templates.filter(t => t.category === 'family').length },
    { id: 'quickstart', name: 'QuickStart', count: templates.filter(t => t.category === 'quickstart').length }
  ];

  const filteredAndSortedTemplates = useMemo(() => {
    let filtered = templates.filter(template => {
      const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
      const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          template.saziFocus.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
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
  }, [templates, selectedCategory, searchTerm, sortBy]);

  return (
    <div className="space-y-8">
      {/* Search and Filter Section */}
      <div className="bg-white border-b p-6">
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

          {/* Sort */}
          <div className="flex items-center gap-2">
            <Filter className="text-gray-400 w-5 h-5" />
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
        </div>
      </div>

      {/* Category Tabs */}
      <div className="bg-gray-50 p-6">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id as any)}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {category.name} ({category.count})
            </button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      <div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {selectedCategory === 'all' ? 'All Templates' : `${categories.find(c => c.id === selectedCategory)?.name} Templates`}
          </h2>
          <p className="text-gray-600">
            {filteredAndSortedTemplates.length} template{filteredAndSortedTemplates.length !== 1 ? 's' : ''} found
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedTemplates.map((template, index) => (
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
                    onClick={() => onViewTemplate(template)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                  <button
                    onClick={() => onDownloadTemplate(template)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredAndSortedTemplates.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 text-gray-400 mx-auto mb-4">
              <Search className="w-full h-full" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};
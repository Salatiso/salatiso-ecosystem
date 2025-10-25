import React from 'react';
import { motion } from 'framer-motion';
import { Download, Eye, Star, Clock } from 'lucide-react';

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

interface TemplateCardProps {
  template: Template;
  index: number;
  onView: (template: Template) => void;
  onDownload: (template: Template) => void;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  index,
  onView,
  onDownload
}) => {
  return (
    <motion.div
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
            onClick={() => onView(template)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
          >
            <Eye className="w-4 h-4" />
            View
          </button>
          <button
            onClick={() => onDownload(template)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
          >
            <Download className="w-4 h-4" />
            Download
          </button>
        </div>
      </div>
    </motion.div>
  );
};
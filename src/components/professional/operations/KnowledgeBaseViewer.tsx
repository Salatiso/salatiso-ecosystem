import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Search,
  FileText,
  FolderOpen,
  ChevronRight,
  Download,
  Eye,
  AlertTriangle
} from 'lucide-react';
import { AccessibleInput, AccessibleSelect } from '@/components/accessibility';
import { useOperations } from '@/hooks/useOperations';
import { useBizHelpIntegration } from '@/hooks/useBizHelpIntegration';

interface KnowledgeBaseViewerProps {
  className?: string;
}

interface KnowledgeBaseDocument {
  id: string;
  title: string;
  description: string;
  category: string;
  fileType: string;
  fileSize: number;
  lastModified: Date;
  tags: string[];
  url?: string;
  content?: string;
}

export const KnowledgeBaseViewer: React.FC<KnowledgeBaseViewerProps> = ({ className = '' }) => {
  const {
    operations,
    loading,
    error
  } = useOperations();

  const { activityLogger } = useBizHelpIntegration('');

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDocument, setSelectedDocument] = useState<KnowledgeBaseDocument | null>(null);

  // Mock knowledge base documents - in real implementation, this would come from operations.knowledgeBase
  const mockDocuments: KnowledgeBaseDocument[] = [
    {
      id: '1',
      title: 'Project Management Standard Operating Procedure',
      description: 'Comprehensive guide for project lifecycle management and best practices',
      category: 'Operations',
      fileType: 'PDF',
      fileSize: 2457600, // 2.4MB
      lastModified: new Date('2024-01-15'),
      tags: ['project management', 'SOP', 'processes'],
      url: '#',
      content: 'Detailed SOP content would be here...'
    },
    {
      id: '2',
      title: 'Risk Assessment Framework',
      description: 'Framework for identifying, assessing, and mitigating project risks',
      category: 'Risk Management',
      fileType: 'DOCX',
      fileSize: 512000, // 512KB
      lastModified: new Date('2024-01-10'),
      tags: ['risk', 'assessment', 'mitigation'],
      url: '#',
      content: 'Risk assessment framework content...'
    },
    {
      id: '3',
      title: 'Quality Assurance Guidelines',
      description: 'Quality standards and assurance procedures for all deliverables',
      category: 'Quality',
      fileType: 'PDF',
      fileSize: 1843200, // 1.8MB
      lastModified: new Date('2024-01-08'),
      tags: ['quality', 'assurance', 'standards'],
      url: '#',
      content: 'Quality assurance guidelines content...'
    },
    {
      id: '4',
      title: 'Change Management Process',
      description: 'Process for managing organizational changes and transitions',
      category: 'Operations',
      fileType: 'PPTX',
      fileSize: 3145728, // 3MB
      lastModified: new Date('2024-01-05'),
      tags: ['change management', 'process', 'organizational'],
      url: '#',
      content: 'Change management process content...'
    }
  ];

  const categories = ['all', ...Array.from(new Set(mockDocuments.map(doc => doc.category)))];

  const filteredDocuments = mockDocuments.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDocumentAccess = async (document: KnowledgeBaseDocument) => {
    // Log activity: document accessed
    await activityLogger?.log('document_accessed', {
      documentTitle: document.title,
      category: document.category,
      fileType: document.fileType,
      fileSize: document.fileSize,
      tags: document.tags
    });

    setSelectedDocument(document);
  };

  const getFileIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case 'pdf': return <FileText className="h-5 w-5 text-red-600" />;
      case 'docx': return <FileText className="h-5 w-5 text-blue-600" />;
      case 'pptx': return <FileText className="h-5 w-5 text-orange-600" />;
      default: return <FileText className="h-5 w-5 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-4 bg-red-50 border border-red-200 rounded-lg ${className}`}>
        <div className="flex items-center">
          <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
          <span className="text-red-800">Error loading knowledge base: {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Knowledge Base</h2>
          <p className="text-gray-600">Access documentation, SOPs, and operational guides</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <AccessibleInput
            label="Search documents"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by title, description, or tags..."
          />
        </div>
        <div className="sm:w-64">
          <AccessibleSelect
            label="Category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            options={categories.map(category => ({
              value: category,
              label: category === 'all' ? 'All Categories' : category
            }))}
          />
        </div>
      </div>

      {/* Document Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDocuments.map((document, index) => (
          <motion.div
            key={document.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handleDocumentAccess(document)}
          >
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                {getFileIcon(document.fileType)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {document.title}
                </h3>
                <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                  {document.description}
                </p>
                <div className="flex items-center space-x-4 mt-3 text-xs text-gray-500">
                  <span className="px-2 py-1 bg-gray-100 rounded-full">
                    {document.category}
                  </span>
                  <span>{formatFileSize(document.fileSize)}</span>
                  <span>
                    {document.lastModified.toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {document.tags.slice(0, 3).map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                  {document.tags.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      +{document.tags.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredDocuments.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
          <p className="text-gray-600">
            {searchTerm || selectedCategory !== 'all'
              ? 'Try adjusting your search or filter criteria'
              : 'Knowledge base documents will appear here once they are added'}
          </p>
        </div>
      )}

      {/* Document Viewer Modal */}
      {selectedDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                {getFileIcon(selectedDocument.fileType)}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {selectedDocument.title}
                  </h3>
                  <p className="text-sm text-gray-600">{selectedDocument.category}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <Eye className="h-5 w-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <Download className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setSelectedDocument(null)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-96">
              <div className="prose max-w-none">
                <p className="text-gray-700 mb-4">{selectedDocument.description}</p>

                {selectedDocument.content && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Document Content</h4>
                    <p className="text-gray-700">{selectedDocument.content}</p>
                  </div>
                )}

                <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-900">File Type:</span>
                    <span className="ml-2 text-gray-600">{selectedDocument.fileType}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">File Size:</span>
                    <span className="ml-2 text-gray-600">{formatFileSize(selectedDocument.fileSize)}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">Last Modified:</span>
                    <span className="ml-2 text-gray-600">
                      {selectedDocument.lastModified.toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">Category:</span>
                    <span className="ml-2 text-gray-600">{selectedDocument.category}</span>
                  </div>
                </div>

                <div className="mt-4">
                  <span className="font-medium text-gray-900">Tags:</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedDocument.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
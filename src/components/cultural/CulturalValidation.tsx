import React, { useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Shield, Heart, Users, BookOpen } from 'lucide-react';
import { UbuntuIcon } from '../icons';

interface UbuntuPrinciple {
  id: string;
  name: string;
  xhosa: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
}

const ubuntuPrinciples: UbuntuPrinciple[] = [
  {
    id: 'interconnectedness',
    name: 'Interconnectedness',
    xhosa: 'Ubuntu',
    description: 'A person is a person through other people. We are all connected.',
    icon: Users,
    color: 'text-blue-600'
  },
  {
    id: 'reciprocity',
    name: 'Reciprocity',
    xhosa: 'Ukuphindisela',
    description: 'What goes around comes around. Give and you shall receive.',
    icon: Heart,
    color: 'text-red-600'
  },
  {
    id: 'respect',
    name: 'Respect',
    xhosa: 'Inhlonipho',
    description: 'Respect for elders, ancestors, and community wisdom.',
    icon: Shield,
    color: 'text-purple-600'
  },
  {
    id: 'wisdom',
    name: 'Collective Wisdom',
    xhosa: 'Ubulumko',
    description: 'Drawing from the wisdom of ancestors and community knowledge.',
    icon: BookOpen,
    color: 'text-green-600'
  }
];

interface ValidationResult {
  principle: UbuntuPrinciple;
  score: number; // 0-100
  feedback: string;
  suggestions: string[];
}

interface CulturalValidationProps {
  content: string;
  contentType: 'policy' | 'decision' | 'communication' | 'project' | 'other';
  onValidationComplete?: (results: ValidationResult[]) => void;
}

const CulturalValidation: React.FC<CulturalValidationProps> = ({
  content,
  contentType,
  onValidationComplete
}) => {
  const [isValidating, setIsValidating] = useState(false);
  const [results, setResults] = useState<ValidationResult[]>([]);
  const [hasValidated, setHasValidated] = useState(false);

  const validateContent = async () => {
    setIsValidating(true);

    // Simulate AI/validation analysis
    await new Promise(resolve => setTimeout(resolve, 2000));

    const validationResults: ValidationResult[] = ubuntuPrinciples.map(principle => {
      // Simple keyword-based analysis (in real implementation, this would use AI/ML)
      const keywords = {
        interconnectedness: ['together', 'community', 'people', 'connected', 'ubuntu', 'family', 'collective'],
        reciprocity: ['give', 'receive', 'share', 'reciprocity', 'mutual', 'exchange', 'support'],
        respect: ['respect', 'honor', 'elders', 'ancestors', 'tradition', 'wisdom', 'dignity'],
        wisdom: ['learn', 'teach', 'knowledge', 'experience', 'ancestors', 'tradition', 'wisdom']
      };

      const contentLower = content.toLowerCase();
      const principleKeywords = keywords[principle.id as keyof typeof keywords];
      const matches = principleKeywords.filter(keyword => contentLower.includes(keyword)).length;
      const score = Math.min(100, (matches / principleKeywords.length) * 100);

      let feedback = '';
      let suggestions: string[] = [];

      if (score >= 80) {
        feedback = `Excellent alignment with ${principle.name}. This content strongly embodies Ubuntu principles.`;
      } else if (score >= 60) {
        feedback = `Good alignment with ${principle.name}. Consider strengthening this aspect.`;
        suggestions = [
          `Add references to ${principle.name.toLowerCase()}`,
          'Include community impact considerations',
          'Reference traditional wisdom or practices'
        ];
      } else if (score >= 40) {
        feedback = `Moderate alignment with ${principle.name}. This principle could be better integrated.`;
        suggestions = [
          `Explicitly address ${principle.name.toLowerCase()} in your content`,
          'Consider how this affects community relationships',
          'Add cultural context or traditional perspectives'
        ];
      } else {
        feedback = `Limited alignment with ${principle.name}. This is a key Ubuntu principle that should be addressed.`;
        suggestions = [
          `Integrate ${principle.name.toLowerCase()} as a core consideration`,
          'Consult with community elders or cultural experts',
          'Reference Ubuntu proverbs or traditional teachings'
        ];
      }

      return {
        principle,
        score: Math.round(score),
        feedback,
        suggestions
      };
    });

    setResults(validationResults);
    setHasValidated(true);
    setIsValidating(false);

    if (onValidationComplete) {
      onValidationComplete(validationResults);
    }
  };

  const getOverallScore = () => {
    if (results.length === 0) return 0;
    return Math.round(results.reduce((sum, result) => sum + result.score, 0) / results.length);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="w-5 h-5 text-green-600" />;
    if (score >= 60) return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
    return <XCircle className="w-5 h-5 text-red-600" />;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center mb-6">
        <UbuntuIcon className="w-8 h-8 text-ubuntu-purple mr-3" />
        <div>
          <h2 className="text-xl font-bold text-ubuntu-purple">Ubuntu Cultural Validation</h2>
          <p className="text-gray-600 text-sm">
            Validate content against Ubuntu principles for cultural authenticity
          </p>
        </div>
      </div>

      {!hasValidated ? (
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">Content Preview</h3>
            <p className="text-sm text-gray-600 line-clamp-3">{content}</p>
            <div className="mt-2">
              <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                Type: {contentType}
              </span>
            </div>
          </div>

          <button
            onClick={validateContent}
            disabled={isValidating}
            className="w-full px-4 py-3 bg-ubuntu-purple text-white rounded-lg hover:bg-ubuntu-gold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isValidating ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Validating against Ubuntu principles...
              </div>
            ) : (
              'Validate Content'
            )}
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Overall Score */}
          <div className="bg-gradient-to-r from-ubuntu-purple to-ubuntu-gold rounded-lg p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">Overall Ubuntu Alignment</h3>
                <p className="text-sm opacity-90">Cultural authenticity score</p>
              </div>
              <div className="text-right">
                <div className={`text-3xl font-bold ${getScoreColor(getOverallScore())}`}>
                  {getOverallScore()}%
                </div>
                <div className="flex items-center mt-1">
                  {getScoreIcon(getOverallScore())}
                  <span className="text-sm ml-1">
                    {getOverallScore() >= 80 ? 'Excellent' : getOverallScore() >= 60 ? 'Good' : 'Needs Improvement'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Principle Breakdown */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Principle Analysis</h3>
            {results.map((result) => (
              <div key={result.principle.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center">
                    <result.principle.icon className={`w-6 h-6 ${result.principle.color} mr-3`} />
                    <div>
                      <h4 className="font-medium text-gray-900">{result.principle.name}</h4>
                      <p className="text-sm text-gray-600">{result.principle.xhosa}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className={`text-lg font-bold mr-2 ${getScoreColor(result.score)}`}>
                      {result.score}%
                    </span>
                    {getScoreIcon(result.score)}
                  </div>
                </div>

                <p className="text-sm text-gray-700 mb-3">{result.principle.description}</p>
                <p className="text-sm text-gray-600 mb-3">{result.feedback}</p>

                {result.suggestions.length > 0 && (
                  <div>
                    <h5 className="text-sm font-medium text-gray-900 mb-2">Suggestions:</h5>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {result.suggestions.map((suggestion, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="w-1.5 h-1.5 bg-ubuntu-purple rounded-full mt-2 mr-2 flex-shrink-0"></span>
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => {
                setHasValidated(false);
                setResults([]);
              }}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Validate Different Content
            </button>
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-ubuntu-purple text-white rounded-lg hover:bg-ubuntu-gold transition-colors"
            >
              Export Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CulturalValidation;
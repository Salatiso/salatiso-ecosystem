import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Brain, Heart, Users, BookOpen, Target } from 'lucide-react';
import { UbuntuIcon } from '../icons';

interface AssessmentQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: 'ubuntu' | 'cultural' | 'business' | 'leadership';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

interface AssessmentResult {
  category: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  feedback: string;
  recommendations: string[];
}

const assessmentQuestions: AssessmentQuestion[] = [
  {
    id: 'ubuntu-1',
    question: 'What does the Xhosa proverb "Umntu ngumntu ngabanye abantu" mean?',
    options: [
      'A person is wealthy through their possessions',
      'A person is a person through other people',
      'A person achieves success alone',
      'A person is defined by their work'
    ],
    correctAnswer: 1,
    explanation: 'This fundamental Ubuntu principle emphasizes that our humanity is realized through our relationships with others.',
    category: 'ubuntu',
    difficulty: 'beginner'
  },
  {
    id: 'cultural-1',
    question: 'In Ubuntu philosophy, what is the appropriate response when someone shares their success?',
    options: [
      'Express jealousy and competition',
      'Celebrate their achievement and seek to learn',
      'Ignore it to avoid appearing envious',
      'Immediately try to outdo them'
    ],
    correctAnswer: 1,
    explanation: 'Ubuntu encourages collective celebration of success and learning from others\' achievements.',
    category: 'cultural',
    difficulty: 'intermediate'
  },
  {
    id: 'leadership-1',
    question: 'A servant leader in Ubuntu tradition would prioritize:',
    options: [
      'Personal power and authority',
      'Community needs and collective well-being',
      'Individual achievements only',
      'Strict hierarchical control'
    ],
    correctAnswer: 1,
    explanation: 'Ubuntu leadership focuses on serving the community and ensuring collective prosperity.',
    category: 'leadership',
    difficulty: 'advanced'
  },
  {
    id: 'business-1',
    question: 'In Ubuntu-aligned business practices, profit should:',
    options: [
      'Be the sole focus of all decisions',
      'Balance with community benefit and sustainability',
      'Be maximized at any cost',
      'Be secondary to personal gain'
    ],
    correctAnswer: 1,
    explanation: 'Ubuntu business principles integrate profit with social responsibility and community well-being.',
    category: 'business',
    difficulty: 'intermediate'
  },
  {
    id: 'ubuntu-2',
    question: 'Which of these best represents the Ubuntu concept of "ubuntu-botho"?',
    options: [
      'Individual competition and rivalry',
      'Shared humanity and mutual respect',
      'Personal achievement over others',
      'Hierarchical social structures'
    ],
    correctAnswer: 1,
    explanation: 'Ubuntu-botho refers to the shared humanity and mutual respect that connects all people.',
    category: 'ubuntu',
    difficulty: 'intermediate'
  }
];

const CulturalCompetencyAssessment: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [assessmentStarted, setAssessmentStarted] = useState(false);
  const [results, setResults] = useState<AssessmentResult[]>([]);

  const startAssessment = () => {
    setAssessmentStarted(true);
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResults(false);
  };

  const selectAnswer = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestion < assessmentQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResults();
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateResults = () => {
    const categoryResults: { [key: string]: { correct: number; total: number; questions: AssessmentQuestion[] } } = {};

    assessmentQuestions.forEach((question, index) => {
      if (!categoryResults[question.category]) {
        categoryResults[question.category] = { correct: 0, total: 0, questions: [] };
      }
      categoryResults[question.category].total++;
      categoryResults[question.category].questions.push(question);

      if (answers[index] === question.correctAnswer) {
        categoryResults[question.category].correct++;
      }
    });

    const assessmentResults: AssessmentResult[] = Object.entries(categoryResults).map(([category, data]) => {
      const score = Math.round((data.correct / data.total) * 100);
      let feedback = '';
      let recommendations: string[] = [];

      if (score >= 90) {
        feedback = `Excellent understanding of ${category} principles! You demonstrate deep cultural competency.`;
        recommendations = [
          'Consider mentoring others in this area',
          'Explore advanced applications of these principles',
          'Share your insights with the community'
        ];
      } else if (score >= 70) {
        feedback = `Good grasp of ${category} concepts. You show solid cultural awareness.`;
        recommendations = [
          'Review the core principles more deeply',
          'Practice applying these concepts in daily situations',
          'Seek mentorship from cultural experts'
        ];
      } else if (score >= 50) {
        feedback = `Developing understanding of ${category}. More study is recommended.`;
        recommendations = [
          'Complete foundational Ubuntu training',
          'Engage with cultural elders and mentors',
          'Practice Ubuntu principles in community settings',
          'Study traditional stories and proverbs'
        ];
      } else {
        feedback = `Limited understanding of ${category} principles. Cultural competency training is essential.`;
        recommendations = [
          'Start with Ubuntu Foundation certification',
          'Participate in community cultural activities',
          'Learn traditional greetings and customs',
          'Study South African cultural history',
          'Engage with Ubuntu mentors regularly'
        ];
      }

      return {
        category,
        score,
        totalQuestions: data.total,
        correctAnswers: data.correct,
        feedback,
        recommendations
      };
    });

    setResults(assessmentResults);
    setShowResults(true);
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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'ubuntu': return UbuntuIcon;
      case 'cultural': return Heart;
      case 'leadership': return Users;
      case 'business': return Target;
      default: return BookOpen;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'ubuntu': return 'text-purple-600';
      case 'cultural': return 'text-red-600';
      case 'leadership': return 'text-blue-600';
      case 'business': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  if (!assessmentStarted) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-ubuntu-purple/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Brain className="w-8 h-8 text-ubuntu-purple" />
          </div>
          <h2 className="text-2xl font-bold text-ubuntu-purple mb-2">Cultural Competency Assessment</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Test your understanding of Ubuntu principles and South African cultural contexts.
            This assessment evaluates your cultural awareness across four key areas.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-purple-50 rounded-lg p-4">
              <UbuntuIcon className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <h3 className="font-medium text-purple-900">Ubuntu Philosophy</h3>
              <p className="text-sm text-purple-700">Core principles of interconnectedness</p>
            </div>
            <div className="bg-red-50 rounded-lg p-4">
              <Heart className="w-6 h-6 text-red-600 mx-auto mb-2" />
              <h3 className="font-medium text-red-900">Cultural Awareness</h3>
              <p className="text-sm text-red-700">South African traditions and customs</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <h3 className="font-medium text-blue-900">Leadership</h3>
              <p className="text-sm text-blue-700">Servant leadership principles</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <Target className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <h3 className="font-medium text-green-900">Business Ethics</h3>
              <p className="text-sm text-green-700">Ubuntu-aligned business practices</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-gray-900 mb-2">Assessment Details</h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div>📚 {assessmentQuestions.length} Questions</div>
              <div>⏱️ ~15 minutes</div>
              <div>🎯 Multiple choice format</div>
            </div>
          </div>

          <button
            onClick={startAssessment}
            className="px-8 py-3 bg-ubuntu-purple text-white rounded-lg hover:bg-ubuntu-gold transition-colors font-medium"
          >
            Start Cultural Assessment
          </button>
        </div>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-ubuntu-purple/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-ubuntu-purple mb-2">Assessment Complete!</h2>
          <p className="text-gray-600">Here are your cultural competency results</p>
        </div>

        {/* Overall Score */}
        <div className="bg-gradient-to-r from-ubuntu-purple to-ubuntu-gold rounded-lg p-6 text-white text-center mb-8">
          <div className="text-4xl font-bold mb-2">{getOverallScore()}%</div>
          <div className="text-lg">Overall Cultural Competency Score</div>
          <div className="flex items-center justify-center mt-2">
            {getScoreIcon(getOverallScore())}
            <span className="ml-2">
              {getOverallScore() >= 80 ? 'Excellent' : getOverallScore() >= 60 ? 'Good' : 'Needs Development'}
            </span>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="space-y-4 mb-8">
          <h3 className="text-lg font-semibold text-gray-900">Category Analysis</h3>
          {results.map((result) => {
            const CategoryIcon = getCategoryIcon(result.category);
            return (
              <div key={result.category} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <CategoryIcon className={`w-6 h-6 ${getCategoryColor(result.category)} mr-3`} />
                    <div>
                      <h4 className="font-medium text-gray-900 capitalize">{result.category}</h4>
                      <p className="text-sm text-gray-600">{result.correctAnswers}/{result.totalQuestions} correct</p>
                    </div>
                  </div>
                  <div className={`text-2xl font-bold ${getScoreColor(result.score)}`}>
                    {result.score}%
                  </div>
                </div>

                <p className="text-sm text-gray-700 mb-3">{result.feedback}</p>

                <div>
                  <h5 className="text-sm font-medium text-gray-900 mb-2">Recommendations:</h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {result.recommendations.map((rec, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="w-1.5 h-1.5 bg-ubuntu-purple rounded-full mt-2 mr-2 flex-shrink-0"></span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* Next Steps */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Next Steps</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Immediate Actions</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Review incorrect answers above</li>
                <li>• Complete Ubuntu Foundation training</li>
                <li>• Join community cultural activities</li>
                <li>• Practice Ubuntu principles daily</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Long-term Development</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Pursue Ubuntu certifications</li>
                <li>• Become a cultural mentor</li>
                <li>• Lead community initiatives</li>
                <li>• Share Ubuntu wisdom with others</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-6 space-x-4">
          <button
            onClick={startAssessment}
            className="px-6 py-2 bg-ubuntu-purple text-white rounded-lg hover:bg-ubuntu-gold transition-colors"
          >
            Retake Assessment
          </button>
          <button
            onClick={() => window.print()}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Export Results
          </button>
        </div>
      </div>
    );
  }

  const question = assessmentQuestions[currentQuestion];
  const selectedAnswer = answers[currentQuestion];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <UbuntuIcon className="w-6 h-6 text-ubuntu-purple mr-2" />
            <span className="text-sm text-gray-600">
              Question {currentQuestion + 1} of {assessmentQuestions.length}
            </span>
          </div>
          <div className="text-sm text-gray-600 capitalize">
            {question.category} • {question.difficulty}
          </div>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div
            className="bg-ubuntu-purple h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / assessmentQuestions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">{question.question}</h3>

        <div className="space-y-3">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => selectAnswer(index)}
              className={`w-full text-left p-4 rounded-lg border transition-colors ${
                selectedAnswer === index
                  ? 'border-ubuntu-purple bg-ubuntu-purple/5 text-ubuntu-purple'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                  selectedAnswer === index ? 'border-ubuntu-purple bg-ubuntu-purple' : 'border-gray-300'
                }`}>
                  {selectedAnswer === index && (
                    <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                  )}
                </div>
                <span className="text-sm">{option}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={previousQuestion}
          disabled={currentQuestion === 0}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        <button
          onClick={nextQuestion}
          disabled={selectedAnswer === undefined}
          className="px-4 py-2 bg-ubuntu-purple text-white rounded-lg hover:bg-ubuntu-gold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {currentQuestion === assessmentQuestions.length - 1 ? 'Complete Assessment' : 'Next'}
        </button>
      </div>
    </div>
  );
};

export default CulturalCompetencyAssessment;
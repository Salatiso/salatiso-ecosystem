import React, { useState } from 'react';
import { Play, CheckCircle, Clock, Users, Star, ArrowLeft, ArrowRight, BookOpen } from 'lucide-react';
import { UbuntuIcon, JourneyIcon } from '../icons';

interface ModuleStep {
  id: string;
  title: string;
  content: string;
  completed: boolean;
  type: 'video' | 'reading' | 'exercise' | 'quiz';
  duration: string;
}

interface LearningModuleProps {
  currentModuleId?: string;
}

const sampleModule: {
  id: string;
  title: string;
  description: string;
  level: number;
  duration: string;
  enrolled: number;
  rating: number;
  steps: ModuleStep[];
} = {
  id: 'personal-safety',
  title: 'Personal Safety & LifeKey OS',
  description: 'Master personal safety practices and digital identity management in our Ubuntu ecosystem',
  level: 1,
  duration: '2 hours',
  enrolled: 24,
  rating: 4.8,
  steps: [
    {
      id: 'intro-safety',
      title: 'Introduction to Personal Safety',
      content: 'Understanding the importance of personal safety in our interconnected community. Learn how Ubuntu principles guide our approach to safety and security.',
      completed: true,
      type: 'video',
      duration: '15 min'
    },
    {
      id: 'lifekey-basics',
      title: 'LifeKey OS Fundamentals',
      content: 'Explore the core features of LifeKey OS and how it protects your digital identity while enabling community collaboration.',
      completed: true,
      type: 'reading',
      duration: '20 min'
    },
    {
      id: 'identity-management',
      title: 'Digital Identity Management',
      content: 'Learn how to manage your digital identity securely and share appropriate information with your community.',
      completed: false,
      type: 'exercise',
      duration: '30 min'
    },
    {
      id: 'safety-practices',
      title: 'Daily Safety Practices',
      content: 'Implement daily safety habits that protect both yourself and your community members.',
      completed: false,
      type: 'video',
      duration: '25 min'
    },
    {
      id: 'emergency-protocols',
      title: 'Emergency Protocols',
      content: 'Understanding emergency response procedures and how to support community safety during crises.',
      completed: false,
      type: 'quiz',
      duration: '15 min'
    },
    {
      id: 'ubuntu-integration',
      title: 'Ubuntu Safety Philosophy',
      content: 'How Ubuntu wisdom guides our approach to safety - "I am safe when we are all safe."',
      completed: false,
      type: 'reading',
      duration: '15 min'
    }
  ]
};

const LearningModule: React.FC<LearningModuleProps> = ({ currentModuleId = 'personal-safety' }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set(['intro-safety', 'lifekey-basics']));

  const currentModule = sampleModule; // In a real app, this would be fetched based on currentModuleId
  const currentStepData = currentModule.steps[currentStep];

  const markStepComplete = (stepId: string) => {
    const newCompleted = new Set(completedSteps);
    newCompleted.add(stepId);
    setCompletedSteps(newCompleted);
  };

  const getStepIcon = (type: string) => {
    switch (type) {
      case 'video': return '🎥';
      case 'reading': return '📖';
      case 'exercise': return '💪';
      case 'quiz': return '❓';
      default: return '📝';
    }
  };

  const progressPercentage = (completedSteps.size / currentModule.steps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-ubuntu-purple/5 via-white to-ubuntu-gold/5 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium">
                    Level {currentModule.level}
                  </span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    Safety
                  </span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900">{currentModule.title}</h1>
                <p className="text-gray-600 mt-1">{currentModule.description}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {currentModule.duration}
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  {currentModule.enrolled} enrolled
                </div>
                <div className="flex items-center">
                  <Star className="w-4 h-4 mr-1 fill-current text-yellow-400" />
                  {currentModule.rating}
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Module Progress</h2>
              <span className="text-sm text-gray-600">
                {completedSteps.size} of {currentModule.steps.length} steps completed
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-ubuntu-purple to-ubuntu-gold h-3 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Steps Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Learning Steps</h3>
              <div className="space-y-3">
                {currentModule.steps.map((step, index) => (
                  <button
                    key={step.id}
                    onClick={() => setCurrentStep(index)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      index === currentStep
                        ? 'bg-ubuntu-purple text-white'
                        : completedSteps.has(step.id)
                        ? 'bg-green-50 text-green-800 border border-green-200'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {completedSteps.has(step.id) ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <span className="text-sm">{getStepIcon(step.type)}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`text-sm font-medium truncate ${
                          index === currentStep ? 'text-white' : 'text-gray-900'
                        }`}>
                          {step.title}
                        </div>
                        <div className={`text-xs ${
                          index === currentStep ? 'text-white/80' : 'text-gray-500'
                        }`}>
                          {step.duration} • {step.type}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-lg p-8">
              {/* Step Header */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getStepIcon(currentStepData.type)}</span>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{currentStepData.title}</h2>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                        <span>{currentStepData.type.charAt(0).toUpperCase() + currentStepData.type.slice(1)}</span>
                        <span>•</span>
                        <span>{currentStepData.duration}</span>
                      </div>
                    </div>
                  </div>
                  {completedSteps.has(currentStepData.id) && (
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  )}
                </div>
              </div>

              {/* Step Content */}
              <div className="prose prose-lg max-w-none mb-8">
                <p className="text-gray-700 leading-relaxed">{currentStepData.content}</p>

                {/* Content based on type */}
                {currentStepData.type === 'video' && (
                  <div className="mt-6">
                    <div className="bg-gray-100 rounded-lg p-8 text-center">
                      <Play className="w-16 h-16 text-ubuntu-purple mx-auto mb-4" />
                      <p className="text-gray-600">Video content would be embedded here</p>
                      <button className="mt-4 px-6 py-3 bg-ubuntu-purple text-white rounded-lg hover:bg-ubuntu-gold transition-colors">
                        Watch Video
                      </button>
                    </div>
                  </div>
                )}

                {currentStepData.type === 'reading' && (
                  <div className="mt-6 bg-blue-50 rounded-lg p-6">
                    <div className="flex items-start space-x-3">
                      <BookOpen className="w-6 h-6 text-blue-600 mt-1" />
                      <div>
                        <h3 className="font-semibold text-blue-900 mb-2">Reading Material</h3>
                        <p className="text-blue-800">
                          This reading covers fundamental concepts that build the foundation for your Ubuntu journey.
                          Take your time to absorb the wisdom shared here.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {currentStepData.type === 'exercise' && (
                  <div className="mt-6 bg-orange-50 rounded-lg p-6">
                    <h3 className="font-semibold text-orange-900 mb-4">Practical Exercise</h3>
                    <div className="space-y-4">
                      <div className="bg-white rounded-lg p-4 border border-orange-200">
                        <h4 className="font-medium text-gray-900 mb-2">Task 1: Set up your LifeKey OS</h4>
                        <p className="text-gray-600 mb-3">Navigate to your LifeKey OS settings and configure your basic security preferences.</p>
                        <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                          Open LifeKey OS
                        </button>
                      </div>
                      <div className="bg-white rounded-lg p-4 border border-orange-200">
                        <h4 className="font-medium text-gray-900 mb-2">Task 2: Create your first digital identity</h4>
                        <p className="text-gray-600 mb-3">Set up your primary digital identity with appropriate privacy settings.</p>
                        <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                          Create Identity
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {currentStepData.type === 'quiz' && (
                  <div className="mt-6 bg-purple-50 rounded-lg p-6">
                    <h3 className="font-semibold text-purple-900 mb-4">Knowledge Check</h3>
                    <div className="space-y-4">
                      <div className="bg-white rounded-lg p-4 border border-purple-200">
                        <p className="font-medium text-gray-900 mb-3">Question 1: What is the primary purpose of LifeKey OS?</p>
                        <div className="space-y-2">
                          <label className="flex items-center">
                            <input type="radio" name="q1" className="mr-3" />
                            <span>To store personal photos</span>
                          </label>
                          <label className="flex items-center">
                            <input type="radio" name="q1" className="mr-3" />
                            <span>To protect digital identity and enable community collaboration</span>
                          </label>
                          <label className="flex items-center">
                            <input type="radio" name="q1" className="mr-3" />
                            <span>To manage social media accounts</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                  disabled={currentStep === 0}
                  className="flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Previous
                </button>

                <div className="flex space-x-3">
                  {!completedSteps.has(currentStepData.id) && (
                    <button
                      onClick={() => markStepComplete(currentStepData.id)}
                      className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Mark Complete
                    </button>
                  )}

                  <button
                    onClick={() => setCurrentStep(Math.min(currentModule.steps.length - 1, currentStep + 1))}
                    disabled={currentStep === currentModule.steps.length - 1}
                    className="flex items-center px-6 py-3 bg-ubuntu-purple text-white rounded-lg hover:bg-ubuntu-gold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ubuntu Wisdom Footer */}
        <div className="mt-12 bg-gradient-to-r from-ubuntu-purple/10 to-ubuntu-gold/10 rounded-lg p-8">
          <div className="text-center">
            <UbuntuIcon className="w-8 h-8 text-ubuntu-purple mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-4">Ubuntu Learning Wisdom</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              &ldquo;One finger cannot kill a louse.&rdquo; Just as we work together to accomplish tasks,
              we learn together to build wisdom that serves our entire community.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningModule;
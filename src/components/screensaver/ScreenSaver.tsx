import React, { useState, useEffect } from 'react';
import { Users, Heart, GraduationCap, BookOpen, Shield, Target } from 'lucide-react';
import { UbuntuIcon, FamilyIcon, JourneyIcon, RondavelIcon } from '../icons';

interface ScreenSaverContent {
  id: string;
  xhosa: string;
  english: string;
  application: string;
  visual: string;
  duration: number;
  background: string;
}

const ubuntuProverbs: ScreenSaverContent[] = [
  {
    id: 'umntu-ngumntu',
    xhosa: 'Umntu ngumntu ngabanye abantu',
    english: 'A person is a person through other people',
    application: 'LifeSync Community Hub',
    visual: 'interconnected_circles',
    duration: 30000,
    background: 'sunset_gradient'
  },
  {
    id: 'village-child',
    xhosa: 'Kusetyenzwa yedwa umntwana akakhuli kakuhle',
    english: 'A child doesn\'t grow well when working alone',
    application: 'Sazi.Life Academy',
    visual: 'village_children',
    duration: 30000,
    background: 'rural_landscape'
  },
  {
    id: 'wealth-health',
    xhosa: 'Impilo yobutyebi bam',
    english: 'My health is my wealth',
    application: 'SafetyHelp OHS Resources',
    visual: 'healthy_family',
    duration: 30000,
    background: 'green_fields'
  },
  {
    id: 'embraced-child',
    xhosa: 'Umntwana ongawelwanga yilali uza kuyitshisa ukuze azive ubushushu bayo',
    english: 'The child who is not embraced by the village will burn it down to feel its warmth',
    application: 'FamilyValue Module',
    visual: 'family_embrace',
    duration: 35000,
    background: 'night_firelight'
  },
  {
    id: 'go-far-together',
    xhosa: 'Ukuba ufuna ukuhamba ngokukhawuleza, hamba wedwa. Ukuba ufuna ukuhamba ixhala elide, hamba kunye',
    english: 'If you want to go fast, go alone. If you want to go far, go together',
    application: 'PigeeBack Community Transport',
    visual: 'community_journey',
    duration: 30000,
    background: 'winding_path'
  }
];

const ScreenSaver: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [showEnglish, setShowEnglish] = useState(false);

  const currentContent = ubuntuProverbs[currentIndex];

  useEffect(() => {
    if (!isActive) return;

    const timer = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % ubuntuProverbs.length);
      setShowEnglish(false);
    }, currentContent.duration);

    // Show English translation halfway through
    const englishTimer = setTimeout(() => {
      setShowEnglish(true);
    }, currentContent.duration / 2);

    return () => {
      clearTimeout(timer);
      clearTimeout(englishTimer);
    };
  }, [currentIndex, isActive, currentContent.duration]);

  const getBackgroundStyle = (background: string) => {
    switch (background) {
      case 'sunset_gradient':
        return 'bg-gradient-to-br from-orange-400 via-purple-600 to-purple-800';
      case 'rural_landscape':
        return 'bg-gradient-to-br from-green-400 via-blue-500 to-purple-600';
      case 'green_fields':
        return 'bg-gradient-to-br from-green-300 via-green-500 to-blue-600';
      case 'night_firelight':
        return 'bg-gradient-to-br from-gray-900 via-orange-900 to-red-900';
      case 'winding_path':
        return 'bg-gradient-to-br from-yellow-400 via-green-500 to-blue-600';
      default:
        return 'bg-gradient-to-br from-purple-600 to-purple-800';
    }
  };

  const getVisualElement = (visual: string) => {
    switch (visual) {
      case 'interconnected_circles':
        return (
          <div className="flex items-center justify-center space-x-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <FamilyIcon className="w-8 h-8 text-white" />
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <Heart className="w-8 h-8 text-white" />
            </div>
          </div>
        );
      case 'village_children':
        return (
          <div className="flex items-center justify-center space-x-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <Users className="w-8 h-8 text-white" />
            </div>
          </div>
        );
      case 'healthy_family':
        return (
          <div className="flex items-center justify-center space-x-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <FamilyIcon className="w-8 h-8 text-white" />
            </div>
          </div>
        );
      case 'family_embrace':
        return (
          <div className="flex items-center justify-center">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
              <Heart className="w-12 h-12 text-white" />
            </div>
          </div>
        );
      case 'community_journey':
        return (
          <div className="flex items-center justify-center space-x-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <JourneyIcon className="w-8 h-8 text-white" />
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <Target className="w-8 h-8 text-white" />
            </div>
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center">
            <UbuntuIcon className="w-16 h-16 text-white" />
          </div>
        );
    }
  };

  const handleInteraction = () => {
    setIsActive(false);
    // In a real screen saver, this would exit the screen saver
    // For demo purposes, we'll just pause it
  };

  if (!isActive) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Screen Saver Paused</h2>
          <button
            onClick={() => setIsActive(true)}
            className="px-6 py-3 bg-ubuntu-purple text-white rounded-lg hover:bg-ubuntu-gold transition-colors"
          >
            Resume Screen Saver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen flex items-center justify-center cursor-pointer transition-all duration-1000 ${getBackgroundStyle(currentContent.background)}`}
      onClick={handleInteraction}
    >
      <div className="max-w-4xl mx-auto px-8 text-center">
        {/* Ubuntu Icon */}
        <div className="mb-8">
          <UbuntuIcon className="w-20 h-20 text-white mx-auto mb-4" />
        </div>

        {/* Visual Element */}
        <div className="mb-8">
          {getVisualElement(currentContent.visual)}
        </div>

        {/* Xhosa Text */}
        <div className="mb-6">
          <p className="text-2xl md:text-3xl font-bold text-white leading-relaxed">
            &ldquo;{currentContent.xhosa}&rdquo;
          </p>
        </div>

        {/* English Translation (appears halfway through) */}
        {showEnglish && (
          <div className="mb-8 animate-fade-in">
            <p className="text-xl md:text-2xl text-white/90 italic">
              {currentContent.english}
            </p>
          </div>
        )}

        {/* Application Link */}
        <div className="mb-8">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3">
            <span className="text-white/80">Explore:</span>
            <span className="text-white font-medium">{currentContent.application}</span>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex justify-center space-x-2">
            {ubuntuProverbs.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex ? 'bg-white' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Interactive Hint */}
        <div className="text-white/60 text-sm">
          Click anywhere to interact • Auto-advances every {currentContent.duration / 1000} seconds
        </div>
      </div>
    </div>
  );
};

export default ScreenSaver;
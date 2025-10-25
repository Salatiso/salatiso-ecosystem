import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image, ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';

interface FamilyPhoto {
  id: string;
  url: string;
  alt: string;
  caption?: string;
  category: 'family' | 'events' | 'achievements' | 'memories';
  year?: number;
}

// Placeholder family photos - replace with actual family photos from Firebase Storage
const familyPhotos: FamilyPhoto[] = [
  {
    id: '1',
    url: '/images/family/milande-birth.jpg',
    alt: 'Milande\'s birth celebration',
    caption: 'Welcome to the world, Milande!',
    category: 'family',
    year: 2017
  },
  {
    id: '2',
    url: '/images/family/mila-birth.jpg',
    alt: 'Mila\'s birth celebration',
    caption: 'Our newest family blessing',
    category: 'family',
    year: 2018
  },
  {
    id: '3',
    url: '/images/family/azora-birth.jpg',
    alt: 'Azora\'s birth celebration',
    caption: 'Bringing joy and energy to our family',
    category: 'family',
    year: 2021
  },
  {
    id: '4',
    url: '/images/family/milani-birth.jpg',
    alt: 'Milani\'s birth celebration',
    caption: 'Our future is bright with you',
    category: 'family',
    year: 2024
  },
  {
    id: '5',
    url: '/images/events/family-gathering.jpg',
    alt: 'Family gathering',
    caption: 'Ubuntu in action - together we are stronger',
    category: 'events'
  },
  {
    id: '6',
    url: '/images/achievements/salatiso-graduation.jpg',
    alt: 'Salatiso\'s achievements',
    caption: 'Leading by example for the next generation',
    category: 'achievements'
  },
  {
    id: '7',
    url: '/images/memories/legacy.jpg',
    alt: 'Family legacy',
    caption: 'Building a legacy of Ubuntu values',
    category: 'memories'
  }
];

interface PhotoSlideshowProps {
  photos?: FamilyPhoto[];
  autoPlay?: boolean;
  interval?: number;
  showControls?: boolean;
  category?: FamilyPhoto['category'];
  transition?: 'fade' | 'slide' | 'zoom';
}

const PhotoSlideshow: React.FC<PhotoSlideshowProps> = ({
  photos = familyPhotos,
  autoPlay = true,
  interval = 8000, // 8 seconds
  showControls = true,
  category,
  transition = 'fade'
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [filteredPhotos, setFilteredPhotos] = useState<FamilyPhoto[]>(photos);

  // Filter photos by category
  useEffect(() => {
    const filtered = category
      ? photos.filter(photo => photo.category === category)
      : photos;
    setFilteredPhotos(filtered);
    setCurrentIndex(0); // Reset to first photo when filter changes
  }, [photos, category]);

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying || filteredPhotos.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex(prevIndex =>
        prevIndex === filteredPhotos.length - 1 ? 0 : prevIndex + 1
      );
    }, interval);

    return () => clearInterval(timer);
  }, [isPlaying, filteredPhotos.length, interval]);

  const goToPrevious = () => {
    setCurrentIndex(prevIndex =>
      prevIndex === 0 ? filteredPhotos.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex(prevIndex =>
      prevIndex === filteredPhotos.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const getTransitionVariants = () => {
    switch (transition) {
      case 'slide':
        return {
          enter: { x: 300, opacity: 0 },
          center: { x: 0, opacity: 1 },
          exit: { x: -300, opacity: 0 }
        };
      case 'zoom':
        return {
          enter: { scale: 0.8, opacity: 0 },
          center: { scale: 1, opacity: 1 },
          exit: { scale: 1.2, opacity: 0 }
        };
      default: // fade
        return {
          enter: { opacity: 0 },
          center: { opacity: 1 },
          exit: { opacity: 0 }
        };
    }
  };

  if (filteredPhotos.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-ubuntu-warm-50">
        <div className="text-center">
          <Image className="w-16 h-16 text-ubuntu-warm-300 mx-auto mb-4" />
          <p className="text-ubuntu-warm-600">No photos available</p>
        </div>
      </div>
    );
  }

  const currentPhoto = filteredPhotos[currentIndex];

  return (
    <div className="relative w-full h-full overflow-hidden bg-black">
      {/* Photo Display */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPhoto.id}
          variants={getTransitionVariants()}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.7 }}
          className="absolute inset-0"
        >
          <img
            src={currentPhoto.url}
            alt={currentPhoto.alt}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback for missing images
              const target = e.target as HTMLImageElement;
              target.src = `https://via.placeholder.com/800x600/8B4513/FFFFFF?text=${encodeURIComponent(currentPhoto.caption || 'Family Photo')}`;
            }}
          />

          {/* Photo Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Caption */}
          {currentPhoto.caption && (
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-white text-xl md:text-2xl font-ubuntu font-medium text-center"
              >
                {currentPhoto.caption}
              </motion.p>
              {currentPhoto.year && (
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-ubuntu-gold text-lg text-center mt-2"
                >
                  {currentPhoto.year}
                </motion.p>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      {showControls && (
        <>
          {/* Navigation Arrows */}
          {filteredPhotos.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
                aria-label="Previous photo"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
                aria-label="Next photo"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Play/Pause Button */}
          {filteredPhotos.length > 1 && (
            <button
              onClick={togglePlayPause}
              className="absolute top-4 right-4 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
              aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>
          )}

          {/* Photo Indicators */}
          {filteredPhotos.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {filteredPhotos.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentIndex
                      ? 'bg-white'
                      : 'bg-white/50 hover:bg-white/75'
                  }`}
                  aria-label={`Go to photo ${index + 1}`}
                />
              ))}
            </div>
          )}

          {/* Photo Counter */}
          <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
            {currentIndex + 1} / {filteredPhotos.length}
          </div>
        </>
      )}
    </div>
  );
};

export default PhotoSlideshow;
export type { FamilyPhoto };
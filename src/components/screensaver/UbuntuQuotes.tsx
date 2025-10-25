import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, Heart, Users, Lightbulb } from 'lucide-react';

interface UbuntuQuote {
  text: string;
  author?: string;
  category: 'unity' | 'community' | 'wisdom' | 'family';
  language: 'english' | 'xhosa' | 'zulu' | 'afrikaans';
}

const ubuntuQuotes: UbuntuQuote[] = [
  // Ubuntu Philosophy
  {
    text: "I am because we are",
    author: "Traditional Ubuntu Proverb",
    category: 'unity',
    language: 'english'
  },
  {
    text: "Umuntu ngumuntu ngabantu",
    author: "Zulu Ubuntu Saying",
    category: 'unity',
    language: 'zulu'
  },
  {
    text: "Ubuntu ngumntu ngabantu",
    author: "Xhosa Ubuntu Philosophy",
    category: 'unity',
    language: 'xhosa'
  },
  {
    text: "A person is a person through other persons",
    author: "Ubuntu Translation",
    category: 'unity',
    language: 'english'
  },

  // Community & Family
  {
    text: "The roots of a great tree determine the strength of its branches",
    category: 'family',
    language: 'english'
  },
  {
    text: "A mother\'s wisdom is the foundation upon which generations build",
    category: 'family',
    language: 'english'
  },
  {
    text: "Children are the living continuation of family wisdom",
    category: 'family',
    language: 'english'
  },
  {
    text: "Siblings share a special bond that strengthens the family",
    category: 'family',
    language: 'english'
  },

  // Wisdom & Growth
  {
    text: "Individual contribution builds collective strength",
    category: 'wisdom',
    language: 'english'
  },
  {
    text: "Justice requires persistence and courage",
    category: 'wisdom',
    language: 'english'
  },
  {
    text: "Resolution brings opportunity for growth and healing",
    category: 'wisdom',
    language: 'english'
  },
  {
    text: "Education should nurture the whole person and cultural identity",
    category: 'wisdom',
    language: 'english'
  },

  // Community Impact
  {
    text: "Business should serve family prosperity and community good",
    category: 'community',
    language: 'english'
  },
  {
    text: "Community support lifts individuals and families",
    category: 'community',
    language: 'english'
  },
  {
    text: "New generations bring fresh energy to family traditions",
    category: 'community',
    language: 'english'
  }
];

interface UbuntuQuotesProps {
  currentQuote?: UbuntuQuote;
  onQuoteChange?: (quote: UbuntuQuote) => void;
  autoRotate?: boolean;
  rotationInterval?: number;
  category?: UbuntuQuote['category'];
  language?: UbuntuQuote['language'];
}

const UbuntuQuotes: React.FC<UbuntuQuotesProps> = ({
  currentQuote,
  onQuoteChange,
  autoRotate = true,
  rotationInterval = 10000, // 10 seconds
  category,
  language
}) => {
  const [activeQuote, setActiveQuote] = useState<UbuntuQuote>(
    currentQuote || ubuntuQuotes[0]
  );

  // Filter quotes based on props
  const filteredQuotes = ubuntuQuotes.filter(quote => {
    if (category && quote.category !== category) return false;
    if (language && quote.language !== language) return false;
    return true;
  });

  useEffect(() => {
    if (!autoRotate || filteredQuotes.length <= 1) return;

    const interval = setInterval(() => {
      const currentIndex = filteredQuotes.findIndex(q => q.text === activeQuote.text);
      const nextIndex = (currentIndex + 1) % filteredQuotes.length;
      const nextQuote = filteredQuotes[nextIndex];

      setActiveQuote(nextQuote);
      onQuoteChange?.(nextQuote);
    }, rotationInterval);

    return () => clearInterval(interval);
  }, [activeQuote, filteredQuotes, autoRotate, rotationInterval, onQuoteChange]);

  useEffect(() => {
    if (currentQuote) {
      setActiveQuote(currentQuote);
    }
  }, [currentQuote]);

  const getCategoryIcon = (cat: UbuntuQuote['category']) => {
    switch (cat) {
      case 'unity':
        return <Users className="w-6 h-6 text-ubuntu-gold" />;
      case 'family':
        return <Heart className="w-6 h-6 text-ubuntu-gold" />;
      case 'wisdom':
        return <Lightbulb className="w-6 h-6 text-ubuntu-gold" />;
      case 'community':
        return <Users className="w-6 h-6 text-ubuntu-gold" />;
      default:
        return <Quote className="w-6 h-6 text-ubuntu-gold" />;
    }
  };

  const getCategoryColor = (cat: UbuntuQuote['category']) => {
    switch (cat) {
      case 'unity':
        return 'border-purple-200 bg-purple-50';
      case 'family':
        return 'border-pink-200 bg-pink-50';
      case 'wisdom':
        return 'border-blue-200 bg-blue-50';
      case 'community':
        return 'border-green-200 bg-green-50';
      default:
        return 'border-ubuntu-warm-200 bg-ubuntu-warm-50';
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-8">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeQuote.text}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className={`max-w-2xl mx-auto text-center p-8 rounded-xl border-2 ${getCategoryColor(activeQuote.category)}`}
        >
          {/* Category Icon */}
          <div className="flex justify-center mb-6">
            {getCategoryIcon(activeQuote.category)}
          </div>

          {/* Quote Text */}
          <blockquote className="text-2xl md:text-3xl font-ubuntu font-medium text-ubuntu-warm-900 mb-4 leading-relaxed">
            &ldquo;{activeQuote.text}&rdquo;
          </blockquote>

          {/* Author */}
          {activeQuote.author && (
            <cite className="text-lg text-ubuntu-warm-700 font-medium">
              — {activeQuote.author}
            </cite>
          )}

          {/* Language & Category */}
          <div className="mt-6 flex items-center justify-center space-x-4 text-sm text-ubuntu-warm-600">
            <span className="capitalize">{activeQuote.category}</span>
            <span>•</span>
            <span className="capitalize">{activeQuote.language}</span>
          </div>

          {/* Quote Navigation Dots */}
          {filteredQuotes.length > 1 && (
            <div className="mt-8 flex justify-center space-x-2">
              {filteredQuotes.map((quote, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setActiveQuote(quote);
                    onQuoteChange?.(quote);
                  }}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    quote.text === activeQuote.text
                      ? 'bg-ubuntu-gold'
                      : 'bg-ubuntu-warm-300 hover:bg-ubuntu-warm-400'
                  }`}
                  aria-label={`Go to quote ${index + 1}`}
                />
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default UbuntuQuotes;
export type { UbuntuQuote };
import React, { useState } from 'react';
import { BookOpen, Users, Heart, MapPin, Calendar, Award, ChevronRight, Play } from 'lucide-react';
import { UbuntuIcon, FamilyIcon, RondavelIcon } from '../icons';

interface CulturalStory {
  id: string;
  title: string;
  titleXhosa: string;
  category: 'ancestral' | 'community' | 'personal' | 'traditional';
  excerpt: string;
  fullStory: string;
  author: string;
  location: string;
  date: string;
  tags: string[];
  image?: string;
  audio?: string;
  video?: string;
}

interface CulturalElement {
  id: string;
  name: string;
  nameXhosa: string;
  description: string;
  significance: string;
  icon: React.ComponentType<any>;
  color: string;
}

const culturalElements: CulturalElement[] = [
  {
    id: 'rondavel',
    name: 'Rondavel',
    nameXhosa: 'Indlu engqukuva',
    description: 'Traditional round house with thatched roof',
    significance: 'Symbol of community gathering and family unity',
    icon: RondavelIcon,
    color: 'text-amber-600'
  },
  {
    id: 'ubuntu_philosophy',
    name: 'Ubuntu Philosophy',
    nameXhosa: 'Ubuntu',
    description: 'I am because we are - interconnectedness of humanity',
    significance: 'Foundation of South African cultural values',
    icon: UbuntuIcon,
    color: 'text-purple-600'
  },
  {
    id: 'family_ubuntu',
    name: 'Family Ubuntu',
    nameXhosa: 'Usapho lwe-Ubuntu',
    description: 'Extended family networks and communal living',
    significance: 'Strength through family and community bonds',
    icon: FamilyIcon,
    color: 'text-blue-600'
  },
  {
    id: 'oral_tradition',
    name: 'Oral Tradition',
    nameXhosa: 'Izithethe zomlomo',
    description: 'Storytelling, proverbs, and ancestral wisdom',
    significance: 'Preservation of cultural knowledge and history',
    icon: BookOpen,
    color: 'text-green-600'
  }
];

const sampleStories: CulturalStory[] = [
  {
    id: 'grandmothers_wisdom',
    title: 'The Wisdom of Grandmothers',
    titleXhosa: 'Ubulumko Bookhokho',
    category: 'ancestral',
    excerpt: 'How the stories and teachings of our grandmothers shaped our understanding of Ubuntu...',
    fullStory: 'In the quiet hours of the evening, when the sun painted the sky in hues of orange and purple, my grandmother would gather us children around the fire. Her voice, strong and steady, would weave tales of our ancestors - stories of courage, wisdom, and the unbreakable bonds of family. "Remember," she would say, "umntu ngumntu ngabanye abantu" - a person is a person through other people. These were not just words; they were the foundation of our identity, our values, our very being.',
    author: 'Nomsa Mthembu',
    location: 'KwaZulu-Natal',
    date: '2025-09-15',
    tags: ['ancestors', 'wisdom', 'family', 'tradition']
  },
  {
    id: 'community_garden',
    title: 'The Community Garden Project',
    titleXhosa: 'Iprojekthi Yegadi Yoluntu',
    category: 'community',
    excerpt: 'How one small garden became a symbol of Ubuntu in action...',
    fullStory: 'When the drought came and food became scarce, our community didn\'t turn inward. Instead, we came together. What started as a few families sharing seeds and tools grew into a thriving community garden that fed dozens of households. In the process, we learned that Ubuntu isn\'t just a philosophy - it\'s a way of life. When one person plants a seed, the whole community reaps the harvest.',
    author: 'Sipho Nkosi',
    location: 'Eastern Cape',
    date: '2025-08-22',
    tags: ['community', 'sustainability', 'reciprocity', 'growth']
  },
  {
    id: 'ubuntu_in_business',
    title: 'Ubuntu in Modern Business',
    titleXhosa: 'Ubuntu Kumsebenzi Wanamhlanje',
    category: 'personal',
    excerpt: 'How traditional Ubuntu values transformed my approach to entrepreneurship...',
    fullStory: 'Starting my business was challenging, but the Ubuntu principles my father taught me made all the difference. Instead of seeing competitors, I saw potential partners. Instead of focusing only on profit, I considered how my success could benefit the community. Today, my company doesn\'t just employ people - it empowers families, supports local suppliers, and contributes to community development. Ubuntu isn\'t old-fashioned; it\'s the key to sustainable success.',
    author: 'Thandiwe Zulu',
    location: 'Gauteng',
    date: '2025-07-10',
    tags: ['business', 'modernity', 'leadership', 'impact']
  }
];

const CulturalHeritage: React.FC = () => {
  const [selectedStory, setSelectedStory] = useState<CulturalStory | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filteredStories = activeCategory === 'all'
    ? sampleStories
    : sampleStories.filter(story => story.category === activeCategory);

  const categories = [
    { id: 'all', name: 'All Stories', count: sampleStories.length },
    { id: 'ancestral', name: 'Ancestral Wisdom', count: sampleStories.filter(s => s.category === 'ancestral').length },
    { id: 'community', name: 'Community', count: sampleStories.filter(s => s.category === 'community').length },
    { id: 'personal', name: 'Personal Journey', count: sampleStories.filter(s => s.category === 'personal').length },
    { id: 'traditional', name: 'Traditional', count: sampleStories.filter(s => s.category === 'traditional').length }
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center mb-6">
        <UbuntuIcon className="w-8 h-8 text-ubuntu-purple mr-3" />
        <div>
          <h2 className="text-xl font-bold text-ubuntu-purple">Cultural Heritage Center</h2>
          <p className="text-gray-600 text-sm">
            Preserving and sharing Ubuntu wisdom and South African cultural traditions
          </p>
        </div>
      </div>

      {/* Cultural Elements */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Ubuntu Cultural Elements</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {culturalElements.map((element) => (
            <div key={element.id} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 hover:shadow-md transition-shadow">
              <element.icon className={`w-8 h-8 ${element.color} mb-3`} />
              <h4 className="font-medium text-gray-900 mb-1">{element.name}</h4>
              <p className="text-sm text-gray-600 mb-2">{element.nameXhosa}</p>
              <p className="text-xs text-gray-500">{element.significance}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Story Categories */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Ubuntu Stories</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeCategory === category.id
                  ? 'bg-ubuntu-purple text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.name} ({category.count})
            </button>
          ))}
        </div>
      </div>

      {/* Stories Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {filteredStories.map((story) => (
          <div
            key={story.id}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedStory(story)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 mb-1">{story.title}</h4>
                <p className="text-sm text-ubuntu-purple mb-2">{story.titleXhosa}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>

            <p className="text-sm text-gray-600 mb-3 line-clamp-3">{story.excerpt}</p>

            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center">
                <MapPin className="w-3 h-3 mr-1" />
                {story.location}
              </div>
              <div className="flex items-center">
                <Calendar className="w-3 h-3 mr-1" />
                {new Date(story.date).toLocaleDateString()}
              </div>
            </div>

            <div className="flex flex-wrap gap-1 mt-3">
              {story.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 text-xs bg-ubuntu-purple/10 text-ubuntu-purple rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Story Modal */}
      {selectedStory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{selectedStory.title}</h3>
                  <p className="text-ubuntu-purple">{selectedStory.titleXhosa}</p>
                </div>
                <button
                  onClick={() => setSelectedStory(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  {selectedStory.author}
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {selectedStory.location}
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(selectedStory.date).toLocaleDateString()}
                </div>
              </div>

              <div className="prose prose-sm max-w-none mb-4">
                <p className="text-gray-700 leading-relaxed">{selectedStory.fullStory}</p>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {selectedStory.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-sm bg-ubuntu-purple/10 text-ubuntu-purple rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  {selectedStory.audio && (
                    <button className="flex items-center px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200">
                      <Play className="w-4 h-4 mr-1" />
                      Audio
                    </button>
                  )}
                  {selectedStory.video && (
                    <button className="flex items-center px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200">
                      <Play className="w-4 h-4 mr-1" />
                      Video
                    </button>
                  )}
                </div>
                <button className="px-4 py-2 bg-ubuntu-purple text-white rounded-lg hover:bg-ubuntu-gold transition-colors">
                  Share Story
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-ubuntu-purple to-ubuntu-gold rounded-lg p-6 text-white text-center">
        <h3 className="text-lg font-bold mb-2">Share Your Ubuntu Story</h3>
        <p className="text-sm opacity-90 mb-4">
          Help preserve our cultural heritage by sharing your experiences with Ubuntu philosophy
        </p>
        <button className="px-6 py-3 bg-white text-ubuntu-purple rounded-lg hover:bg-gray-100 transition-colors font-medium">
          Submit Your Story
        </button>
      </div>
    </div>
  );
};

export default CulturalHeritage;
import React from 'react';
import { useCategories } from '../hooks/useCategories';

interface SubNavProps {
  selectedCategory: string;
  onCategoryClick: (categoryId: string) => void;
}

const SubNav: React.FC<SubNavProps> = ({ selectedCategory, onCategoryClick }) => {
  const { categories, loading } = useCategories();

  return (
    <div className="sticky top-20 z-40 bg-fuji-darkGray/95 backdrop-blur-md border-b border-fuji-gold/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-3 overflow-x-auto py-4 scrollbar-hide">
          {loading ? (
            <div className="flex space-x-3">
              {[1,2,3,4,5].map(i => (
                <div key={i} className="h-9 w-24 bg-fuji-black rounded animate-pulse" />
              ))}
            </div>
          ) : (
            <>
              <button
                onClick={() => onCategoryClick('all')}
                className={`px-4 py-2 text-sm font-sans font-medium transition-all duration-300 border-2 whitespace-nowrap ${
                  selectedCategory === 'all'
                    ? 'bg-fuji-red text-white border-fuji-red shadow-lg shadow-fuji-red/50'
                    : 'bg-fuji-black text-fuji-gold border-fuji-gold hover:border-fuji-red hover:text-white'
                }`}
              >
                ALL
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => onCategoryClick(c.id)}
                  className={`px-4 py-2 text-sm font-sans font-medium transition-all duration-300 border-2 flex items-center space-x-2 whitespace-nowrap ${
                    selectedCategory === c.id
                      ? 'bg-fuji-red text-white border-fuji-red shadow-lg shadow-fuji-red/50'
                      : 'bg-fuji-black text-fuji-gold border-fuji-gold hover:border-fuji-red hover:text-white'
                  }`}
                >
                  <span className="text-base">{c.icon}</span>
                  <span className="uppercase tracking-wide">{c.name}</span>
                </button>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubNav;



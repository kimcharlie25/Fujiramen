import React from 'react';
import { useCategories } from '../hooks/useCategories';

interface MobileNavProps {
  activeCategory: string;
  onCategoryClick: (categoryId: string) => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ activeCategory, onCategoryClick }) => {
  const { categories } = useCategories();

  return (
    <div className="sticky top-20 z-40 bg-fuji-darkGray/95 backdrop-blur-md border-b border-fuji-gold/30 md:hidden shadow-lg">
      <div className="flex overflow-x-auto scrollbar-hide px-4 py-3">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryClick(category.id)}
            className={`flex-shrink-0 flex items-center space-x-2 px-4 py-2 border-2 mr-3 transition-all duration-300 ${
              activeCategory === category.id
                ? 'bg-fuji-red text-white border-fuji-red shadow-lg shadow-fuji-red/50'
                : 'bg-fuji-black text-fuji-gold border-fuji-gold hover:border-fuji-red hover:text-white'
            }`}
          >
            <span className="text-base">{category.icon}</span>
            <span className="text-sm font-sans font-medium whitespace-nowrap uppercase tracking-wide">{category.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MobileNav;
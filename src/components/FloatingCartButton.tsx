import React from 'react';
import { ShoppingCart } from 'lucide-react';

interface FloatingCartButtonProps {
  itemCount: number;
  onCartClick: () => void;
}

const FloatingCartButton: React.FC<FloatingCartButtonProps> = ({ itemCount, onCartClick }) => {
  if (itemCount === 0) return null;

  return (
    <button
      onClick={onCartClick}
      className="fixed bottom-6 right-6 bg-fuji-red text-white p-5 border-4 border-fuji-gold shadow-2xl hover:bg-fuji-gold hover:text-fuji-black transition-all duration-300 transform hover:scale-110 z-40 md:hidden animate-bounce-gentle"
    >
      <div className="relative">
        <ShoppingCart className="h-7 w-7" />
        <span className="absolute -top-3 -right-3 bg-fuji-black text-fuji-gold border-2 border-fuji-gold text-sm font-kanji font-bold h-7 w-7 flex items-center justify-center">
          {itemCount}
        </span>
      </div>
    </button>
  );
};

export default FloatingCartButton;
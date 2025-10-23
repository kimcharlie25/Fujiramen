import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useSiteSettings } from '../hooks/useSiteSettings';

interface HeaderProps {
  cartItemsCount: number;
  onCartClick: () => void;
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ cartItemsCount, onCartClick, onMenuClick }) => {
  const { siteSettings, loading } = useSiteSettings();

  return (
    <header className="sticky top-0 z-50 bg-fuji-black border-b-2 border-fuji-red shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <button 
            onClick={onMenuClick}
            className="flex items-center space-x-3 group"
          >
            {loading ? (
              <div className="w-12 h-12 bg-fuji-darkGray rounded animate-pulse" />
            ) : (
              <img 
                src={siteSettings?.site_logo || "/logo.jpg"} 
                alt="FujiRamen"
                className="w-12 h-12 object-cover border-2 border-fuji-gold transition-all duration-300 group-hover:border-fuji-red"
                onError={(e) => {
                  e.currentTarget.src = "/logo.jpg";
                }}
              />
            )}
            <div className="flex flex-col">
              <h1 className="text-2xl md:text-3xl font-kanji font-black text-white tracking-wider group-hover:text-fuji-red transition-colors duration-300">
                {loading ? (
                  <div className="w-32 h-7 bg-fuji-darkGray rounded animate-pulse" />
                ) : (
                  siteSettings?.site_name?.toUpperCase() || "FUJIRAMEN"
                )}
              </h1>
              <p className="text-[10px] md:text-xs font-sans text-fuji-gold tracking-widest uppercase">
                {loading ? (
                  <div className="w-24 h-3 bg-fuji-darkGray rounded animate-pulse mt-1" />
                ) : (
                  siteSettings?.site_description || "Angeles Branch"
                )}
              </p>
            </div>
          </button>

          <div className="flex items-center space-x-2">
            <button 
              onClick={onCartClick}
              className="relative p-3 text-white hover:text-fuji-red hover:bg-fuji-darkGray rounded-lg transition-all duration-300 border border-transparent hover:border-fuji-red"
            >
              <ShoppingCart className="h-6 w-6" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-fuji-red text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center animate-bounce-gentle border-2 border-fuji-black">
                  {cartItemsCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
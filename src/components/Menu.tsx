import React from 'react';
import { MenuItem, CartItem } from '../types';
import { useCategories } from '../hooks/useCategories';
import MenuItemCard from './MenuItemCard';

// Preload images for better performance
const preloadImages = (items: MenuItem[]) => {
  items.forEach(item => {
    if (item.image) {
      const img = new Image();
      img.src = item.image;
    }
  });
};

interface MenuProps {
  menuItems: MenuItem[];
  addToCart: (item: MenuItem, quantity?: number, variation?: any, addOns?: any[]) => void;
  cartItems: CartItem[];
  updateQuantity: (id: string, quantity: number) => void;
}

const Menu: React.FC<MenuProps> = ({ menuItems, addToCart, cartItems, updateQuantity }) => {
  const { categories } = useCategories();

  // Preload images when menu items change
  React.useEffect(() => {
    if (menuItems.length > 0) {
      preloadImages(menuItems);
    }
  }, [menuItems]);


  return (
    <main className="min-h-screen bg-fuji-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16 border-b-2 border-fuji-gold/30 pb-12">
          <h2 className="text-5xl md:text-6xl font-kanji font-black text-white mb-4 tracking-wider">
            OUR MENU
          </h2>
          <div className="w-24 h-1 bg-fuji-red mx-auto mb-6"></div>
          <p className="text-fuji-gold text-lg md:text-xl max-w-3xl mx-auto font-sans leading-relaxed">
            Each bowl is a testament to authentic Japanese craftsmanship. Our signature Tonkotsu broth simmers for 
            18 hours to achieve its rich, creamy perfection. Paired with our handmade specialty noodles, 
            every dish honors the traditions of true ramen artistry.
          </p>
        </div>

          {categories.map((category) => {
            const categoryItems = menuItems.filter(item => item.category === category.id);
            
            if (categoryItems.length === 0) return null;
            
            return (
              <section key={category.id} id={category.id} className="mb-20">
                <div className="flex items-center justify-center mb-10 pb-4 border-b border-fuji-gold/20">
                  <span className="text-4xl mr-4">{category.icon}</span>
                  <h3 className="text-4xl font-kanji font-bold text-fuji-gold uppercase tracking-widest">
                    {category.name}
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {categoryItems.map((item) => {
                    const cartItem = cartItems.find(cartItem => cartItem.id === item.id);
                    return (
                      <MenuItemCard
                        key={item.id}
                        item={item}
                        onAddToCart={addToCart}
                        quantity={cartItem?.quantity || 0}
                        onUpdateQuantity={updateQuantity}
                      />
                    );
                  })}
                </div>
              </section>
            );
        })}
      </div>
    </main>
  );
};

export default Menu;
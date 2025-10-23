import React from 'react';
import { Trash2, Plus, Minus, ArrowLeft } from 'lucide-react';
import { CartItem } from '../types';

interface CartProps {
  cartItems: CartItem[];
  updateQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  onContinueShopping: () => void;
  onCheckout: () => void;
}

const Cart: React.FC<CartProps> = ({
  cartItems,
  updateQuantity,
  removeFromCart,
  clearCart,
  getTotalPrice,
  onContinueShopping,
  onCheckout
}) => {
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-fuji-black flex items-center justify-center px-4 py-12">
        <div className="text-center py-16 max-w-2xl">
          <div className="text-8xl mb-6">🍜</div>
          <h2 className="text-4xl font-kanji font-black text-white mb-4 uppercase tracking-widest">Cart Empty</h2>
          <div className="w-24 h-1 bg-fuji-red mx-auto mb-6"></div>
          <p className="text-fuji-gold text-lg mb-8 font-sans">Your journey to flavor awaits. Explore our authentic ramen selection.</p>
          <button
            onClick={onContinueShopping}
            className="bg-fuji-red text-white px-10 py-4 border-2 border-white hover:bg-white hover:text-fuji-red transition-all duration-300 font-sans font-bold text-lg uppercase tracking-widest shadow-lg hover:shadow-2xl"
          >
            View Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-fuji-black py-8">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between mb-10 border-b-2 border-fuji-gold/30 pb-6">
          <button
            onClick={onContinueShopping}
            className="flex items-center space-x-2 text-fuji-gold hover:text-white transition-colors duration-300 font-sans font-medium uppercase tracking-wide"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Menu</span>
          </button>
          <h1 className="text-4xl font-kanji font-black text-white uppercase tracking-widest">Your Order</h1>
          <button
            onClick={clearCart}
            className="text-fuji-red hover:text-white transition-colors duration-300 font-sans font-medium uppercase tracking-wide"
          >
            Clear All
          </button>
        </div>

        <div className="space-y-4 mb-8">
          {cartItems.map((item, index) => (
            <div key={item.id} className="bg-fuji-darkGray border-2 border-fuji-gold/30 hover:border-fuji-gold p-6 transition-all duration-300">
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div className="flex-1 min-w-[200px]">
                  <h3 className="text-xl font-kanji font-bold text-white mb-2 uppercase tracking-wide">{item.name}</h3>
                  {item.selectedVariation && (
                    <p className="text-sm text-fuji-gold/80 mb-1 font-sans">
                      <span className="text-fuji-gold">Bowl Size:</span> {item.selectedVariation.name}
                    </p>
                  )}
                  {item.selectedAddOns && item.selectedAddOns.length > 0 && (
                    <p className="text-sm text-fuji-gold/80 mb-2 font-sans">
                      <span className="text-fuji-gold">Enhancements:</span> {item.selectedAddOns.map(addOn => 
                        addOn.quantity && addOn.quantity > 1 
                          ? `${addOn.name} ×${addOn.quantity}`
                          : addOn.name
                      ).join(', ')}
                    </p>
                  )}
                  <p className="text-lg font-kanji font-bold text-fuji-gold">₱{item.totalPrice.toFixed(2)} <span className="text-sm text-fuji-gold/70">each</span></p>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 bg-fuji-gold border-2 border-fuji-black p-1">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-2 hover:bg-fuji-black hover:text-fuji-gold transition-all duration-200"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="font-kanji font-bold text-fuji-black min-w-[40px] text-center text-lg">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-2 hover:bg-fuji-black hover:text-fuji-gold transition-all duration-200"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="text-right min-w-[100px]">
                    <p className="text-2xl font-kanji font-bold text-white">₱{(item.totalPrice * item.quantity).toFixed(2)}</p>
                  </div>
                  
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-3 text-fuji-red hover:text-white hover:bg-fuji-red border-2 border-fuji-red transition-all duration-300"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-fuji-darkGray border-4 border-fuji-red p-8">
          <div className="flex items-center justify-between text-4xl font-kanji font-black mb-8 border-b-2 border-fuji-gold/30 pb-6">
            <span className="text-white uppercase tracking-wider">Total:</span>
            <span className="text-fuji-gold">₱{parseFloat(getTotalPrice() || 0).toFixed(2)}</span>
          </div>
          
          <button
            onClick={onCheckout}
            className="w-full bg-fuji-red text-white py-6 border-2 border-white hover:bg-white hover:text-fuji-red transition-all duration-300 transform hover:scale-105 font-sans font-black text-xl uppercase tracking-widest shadow-2xl"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
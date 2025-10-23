import React, { useState } from 'react';
import { Plus, Minus, X, ShoppingCart } from 'lucide-react';
import { MenuItem, Variation, AddOn } from '../types';

interface MenuItemCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem, quantity?: number, variation?: Variation, addOns?: AddOn[]) => void;
  quantity: number;
  onUpdateQuantity: (id: string, quantity: number) => void;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ 
  item, 
  onAddToCart, 
  quantity, 
  onUpdateQuantity 
}) => {
  const [showCustomization, setShowCustomization] = useState(false);
  const [selectedVariation, setSelectedVariation] = useState<Variation | undefined>(
    item.variations?.[0]
  );
  const [selectedAddOns, setSelectedAddOns] = useState<(AddOn & { quantity: number })[]>([]);

  const calculatePrice = () => {
    // Use effective price (discounted or regular) as base
    let price = item.effectivePrice || item.basePrice;
    if (selectedVariation) {
      price = (item.effectivePrice || item.basePrice) + selectedVariation.price;
    }
    selectedAddOns.forEach(addOn => {
      price += addOn.price * addOn.quantity;
    });
    return price;
  };

  const handleAddToCart = () => {
    if (item.variations?.length || item.addOns?.length) {
      setShowCustomization(true);
    } else {
      onAddToCart(item, 1);
    }
  };

  const handleCustomizedAddToCart = () => {
    // Convert selectedAddOns back to regular AddOn array for cart
    const addOnsForCart: AddOn[] = selectedAddOns.flatMap(addOn => 
      Array(addOn.quantity).fill({ ...addOn, quantity: undefined })
    );
    onAddToCart(item, 1, selectedVariation, addOnsForCart);
    setShowCustomization(false);
    setSelectedAddOns([]);
  };

  const handleIncrement = () => {
    onUpdateQuantity(item.id, quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 0) {
      onUpdateQuantity(item.id, quantity - 1);
    }
  };

  const updateAddOnQuantity = (addOn: AddOn, quantity: number) => {
    setSelectedAddOns(prev => {
      const existingIndex = prev.findIndex(a => a.id === addOn.id);
      
      if (quantity === 0) {
        // Remove add-on if quantity is 0
        return prev.filter(a => a.id !== addOn.id);
      }
      
      if (existingIndex >= 0) {
        // Update existing add-on quantity
        const updated = [...prev];
        updated[existingIndex] = { ...updated[existingIndex], quantity };
        return updated;
      } else {
        // Add new add-on with quantity
        return [...prev, { ...addOn, quantity }];
      }
    });
  };

  const groupedAddOns = item.addOns?.reduce((groups, addOn) => {
    const category = addOn.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(addOn);
    return groups;
  }, {} as Record<string, AddOn[]>);

  return (
    <>
      <div className={`bg-fuji-darkGray rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group animate-scale-in border-2 ${!item.available ? 'opacity-60 border-gray-700' : 'border-fuji-gold/30 hover:border-fuji-red'}`}>
        {/* Image Container with Badges */}
        <div className="relative h-56 bg-gradient-to-br from-black to-fuji-darkGray overflow-hidden">
          {item.image ? (
            <>
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                loading="lazy"
                decoding="async"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-fuji-black/80 via-transparent to-transparent"></div>
            </>
          ) : null}
          <div className={`absolute inset-0 flex items-center justify-center ${item.image ? 'hidden' : ''}`}>
            <div className="text-6xl opacity-20 text-fuji-gold">🍜</div>
          </div>
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {item.isOnDiscount && item.discountPrice && (
              <div className="bg-fuji-red text-white text-xs font-bold px-3 py-2 border-2 border-white shadow-lg animate-pulse uppercase tracking-wider">
                SPECIAL
              </div>
            )}
            {item.popular && (
              <div className="bg-fuji-gold text-fuji-black text-xs font-bold px-3 py-2 border-2 border-fuji-black shadow-lg uppercase tracking-wider">
                SIGNATURE
              </div>
            )}
          </div>
          
          {!item.available && (
            <div className="absolute top-3 right-3 bg-fuji-black text-white text-xs font-bold px-3 py-2 border-2 border-fuji-red shadow-lg uppercase">
              SOLD OUT
            </div>
          )}
          
          {/* Discount Percentage Badge */}
          {item.isOnDiscount && item.discountPrice && (
            <div className="absolute bottom-3 right-3 bg-fuji-red text-white text-sm font-bold px-3 py-2 border-2 border-white shadow-lg">
              -{Math.round(((item.basePrice - item.discountPrice) / item.basePrice) * 100)}%
            </div>
          )}
        </div>
        
        {/* Content */}
        <div className="p-6 bg-fuji-darkGray">
          <div className="flex items-start justify-between mb-3">
            <h4 className="text-xl font-kanji font-bold text-white leading-tight flex-1 pr-2 tracking-wide">{item.name}</h4>
            {item.variations && item.variations.length > 0 && (
              <div className="text-xs text-fuji-gold bg-fuji-black px-3 py-1.5 border border-fuji-gold whitespace-nowrap font-sans">
                {item.variations.length} SIZES
              </div>
            )}
          </div>
          
          <p className={`text-sm mb-4 leading-relaxed font-sans ${!item.available ? 'text-gray-500' : 'text-fuji-gold/80'}`}>
            {!item.available ? 'Currently Unavailable' : item.description}
          </p>
          
          {/* Pricing Section */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex-1">
              {item.isOnDiscount && item.discountPrice ? (
                <div className="space-y-1">
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl font-bold text-fuji-red font-kanji">
                      ₱{item.discountPrice.toFixed(2)}
                    </span>
                    <span className="text-sm text-gray-500 line-through">
                      ₱{item.basePrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="text-xs text-fuji-gold font-sans">
                    You save ₱{(item.basePrice - item.discountPrice).toFixed(2)}
                  </div>
                </div>
              ) : (
                <div className="text-3xl font-bold text-fuji-gold font-kanji">
                  ₱{item.basePrice.toFixed(2)}
                </div>
              )}
              
              {item.variations && item.variations.length > 0 && (
                <div className="text-xs text-gray-400 mt-1 font-sans">
                  Starting price
                </div>
              )}
            </div>
            
            {/* Action Buttons */}
            <div className="flex-shrink-0">
              {!item.available ? (
                <button
                  disabled
                  className="bg-gray-700 text-gray-400 px-5 py-3 border-2 border-gray-600 cursor-not-allowed font-sans font-bold text-sm uppercase tracking-wider"
                >
                  Sold Out
                </button>
              ) : quantity === 0 ? (
                <button
                  onClick={handleAddToCart}
                  className="bg-fuji-red text-white px-6 py-3 border-2 border-white hover:bg-white hover:text-fuji-red transition-all duration-300 transform hover:scale-105 font-sans font-bold text-sm shadow-lg hover:shadow-2xl uppercase tracking-wider"
                >
                  {item.variations?.length || item.addOns?.length ? 'Customize' : 'Order'}
                </button>
              ) : (
                <div className="flex items-center space-x-2 bg-fuji-gold border-2 border-fuji-black p-1">
                  <button
                    onClick={handleDecrement}
                    className="p-2 hover:bg-fuji-black hover:text-fuji-gold transition-all duration-200"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="font-bold text-fuji-black min-w-[32px] text-center font-kanji text-lg">{quantity}</span>
                  <button
                    onClick={handleIncrement}
                    className="p-2 hover:bg-fuji-black hover:text-fuji-gold transition-all duration-200"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Add-ons indicator */}
          {item.addOns && item.addOns.length > 0 && (
            <div className="flex items-center space-x-2 text-xs text-fuji-gold bg-fuji-black px-3 py-2 border border-fuji-gold font-sans">
              <span className="text-sm">+</span>
              <span className="uppercase tracking-wider">{item.addOns.length} add-on{item.addOns.length > 1 ? 's' : ''} available</span>
            </div>
          )}
        </div>
      </div>

      {/* Customization Modal */}
      {showCustomization && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-fuji-darkGray border-2 border-fuji-gold max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-fuji-black border-b-2 border-fuji-red p-6 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-kanji font-bold text-white uppercase tracking-wider">Customize</h3>
                <p className="text-sm text-fuji-gold mt-1 font-sans">{item.name}</p>
              </div>
              <button
                onClick={() => setShowCustomization(false)}
                className="p-2 hover:bg-fuji-red text-white transition-all duration-300 border-2 border-transparent hover:border-white"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6 bg-fuji-darkGray">
              {/* Size Variations */}
              {item.variations && item.variations.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-kanji font-bold text-fuji-gold mb-4 uppercase tracking-wider text-lg">Bowl Size</h4>
                  <div className="space-y-3">
                    {item.variations.map((variation) => (
                      <label
                        key={variation.id}
                        className={`flex items-center justify-between p-4 border-2 cursor-pointer transition-all duration-300 ${
                          selectedVariation?.id === variation.id
                            ? 'border-fuji-red bg-fuji-red/20'
                            : 'border-fuji-gold/30 hover:border-fuji-gold hover:bg-fuji-black'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <input
                            type="radio"
                            name="variation"
                            checked={selectedVariation?.id === variation.id}
                            onChange={() => setSelectedVariation(variation)}
                            className="text-fuji-red focus:ring-fuji-red"
                          />
                          <span className="font-sans font-medium text-white uppercase tracking-wide">{variation.name}</span>
                        </div>
                        <span className="text-fuji-gold font-kanji font-bold text-lg">
                          ₱{((item.effectivePrice || item.basePrice) + variation.price).toFixed(2)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Add-ons */}
              {groupedAddOns && Object.keys(groupedAddOns).length > 0 && (
                <div className="mb-6">
                  <h4 className="font-kanji font-bold text-fuji-gold mb-4 uppercase tracking-wider text-lg">Enhance Your Bowl</h4>
                  {Object.entries(groupedAddOns).map(([category, addOns]) => (
                    <div key={category} className="mb-4">
                      <h5 className="text-sm font-sans font-medium text-fuji-gold/80 mb-3 uppercase tracking-wider">
                        {category.replace('-', ' ')}
                      </h5>
                      <div className="space-y-3">
                        {addOns.map((addOn) => (
                          <div
                            key={addOn.id}
                            className="flex items-center justify-between p-4 border-2 border-fuji-gold/30 hover:border-fuji-gold hover:bg-fuji-black transition-all duration-300"
                          >
                            <div className="flex-1">
                              <span className="font-sans font-medium text-white">{addOn.name}</span>
                              <div className="text-sm text-fuji-gold/70">
                                {addOn.price > 0 ? `₱${addOn.price.toFixed(2)} each` : 'Complimentary'}
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              {selectedAddOns.find(a => a.id === addOn.id) ? (
                                <div className="flex items-center space-x-2 bg-fuji-gold border-2 border-fuji-black p-1">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const current = selectedAddOns.find(a => a.id === addOn.id);
                                      updateAddOnQuantity(addOn, (current?.quantity || 1) - 1);
                                    }}
                                    className="p-1.5 hover:bg-fuji-black hover:text-fuji-gold transition-all duration-200"
                                  >
                                    <Minus className="h-3 w-3" />
                                  </button>
                                  <span className="font-kanji font-bold text-fuji-black min-w-[24px] text-center">
                                    {selectedAddOns.find(a => a.id === addOn.id)?.quantity || 0}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const current = selectedAddOns.find(a => a.id === addOn.id);
                                      updateAddOnQuantity(addOn, (current?.quantity || 0) + 1);
                                    }}
                                    className="p-1.5 hover:bg-fuji-black hover:text-fuji-gold transition-all duration-200"
                                  >
                                    <Plus className="h-3 w-3" />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => updateAddOnQuantity(addOn, 1)}
                                  className="flex items-center space-x-1 px-4 py-2 bg-fuji-red text-white border-2 border-white hover:bg-white hover:text-fuji-red transition-all duration-300 text-sm font-sans font-bold uppercase tracking-wider"
                                >
                                  <Plus className="h-3 w-3" />
                                  <span>Add</span>
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Price Summary */}
              <div className="border-t-2 border-fuji-red pt-6 mb-6">
                <div className="flex items-center justify-between text-3xl font-kanji font-black">
                  <span className="text-white">TOTAL:</span>
                  <span className="text-fuji-gold">₱{calculatePrice().toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleCustomizedAddToCart}
                className="w-full bg-fuji-red text-white py-5 border-2 border-white hover:bg-white hover:text-fuji-red transition-all duration-300 font-sans font-black text-lg flex items-center justify-center space-x-3 shadow-lg hover:shadow-2xl transform hover:scale-105 uppercase tracking-widest"
              >
                <ShoppingCart className="h-6 w-6" />
                <span>Add ₱{calculatePrice().toFixed(2)}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MenuItemCard;
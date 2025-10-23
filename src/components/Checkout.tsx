import React, { useState } from 'react';
import { ArrowLeft, Clock } from 'lucide-react';
import { CartItem, PaymentMethod, ServiceType } from '../types';
import { usePaymentMethods } from '../hooks/usePaymentMethods';

interface CheckoutProps {
  cartItems: CartItem[];
  totalPrice: number;
  onBack: () => void;
}

const Checkout: React.FC<CheckoutProps> = ({ cartItems, totalPrice, onBack }) => {
  const { paymentMethods } = usePaymentMethods();
  const [step, setStep] = useState<'details' | 'payment'>('details');
  const [customerName, setCustomerName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [serviceType, setServiceType] = useState<ServiceType>('dine-in');
  const [address, setAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [pickupTime, setPickupTime] = useState('5-10');
  const [customTime, setCustomTime] = useState('');
  // Dine-in specific state
  const [partySize, setPartySize] = useState(1);
  const [dineInTime, setDineInTime] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('gcash');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [notes, setNotes] = useState('');

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  // Set default payment method when payment methods are loaded
  React.useEffect(() => {
    if (paymentMethods.length > 0 && !paymentMethod) {
      setPaymentMethod(paymentMethods[0].id as PaymentMethod);
    }
  }, [paymentMethods, paymentMethod]);

  const selectedPaymentMethod = paymentMethods.find(method => method.id === paymentMethod);

  const handleProceedToPayment = () => {
    setStep('payment');
  };

  const handlePlaceOrder = () => {
    const timeInfo = serviceType === 'pickup' 
      ? (pickupTime === 'custom' ? customTime : `${pickupTime} minutes`)
      : '';
    
    const dineInInfo = serviceType === 'dine-in' 
      ? `👥 Party Size: ${partySize} person${partySize !== 1 ? 's' : ''}\n🕐 Preferred Time: ${new Date(dineInTime).toLocaleString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric', 
          hour: '2-digit', 
          minute: '2-digit' 
        })}`
      : '';
    
    const orderDetails = `
🛒 FUJIRAMEN ORDER

👤 Customer: ${customerName}
📞 Contact: ${contactNumber}
📍 Service: ${serviceType.charAt(0).toUpperCase() + serviceType.slice(1)}
${serviceType === 'delivery' ? `🏠 Address: ${address}${landmark ? `\n🗺️ Landmark: ${landmark}` : ''}` : ''}
${serviceType === 'pickup' ? `⏰ Pickup Time: ${timeInfo}` : ''}
${serviceType === 'dine-in' ? dineInInfo : ''}


📋 ORDER DETAILS:
${cartItems.map(item => {
  let itemDetails = `• ${item.name}`;
  if (item.selectedVariation) {
    itemDetails += ` (${item.selectedVariation.name})`;
  }
  if (item.selectedAddOns && item.selectedAddOns.length > 0) {
    itemDetails += ` + ${item.selectedAddOns.map(addOn => 
      addOn.quantity && addOn.quantity > 1 
        ? `${addOn.name} x${addOn.quantity}`
        : addOn.name
    ).join(', ')}`;
  }
  itemDetails += ` x${item.quantity} - ₱${item.totalPrice * item.quantity}`;
  return itemDetails;
}).join('\n')}

💰 TOTAL: ₱${totalPrice}
${serviceType === 'delivery' ? `🛵 DELIVERY FEE:` : ''}

💳 Payment: ${selectedPaymentMethod?.name || paymentMethod}
📸 Payment Screenshot: Please attach your payment receipt screenshot

${notes ? `📝 Notes: ${notes}` : ''}

Please confirm this order to proceed. Thank you for choosing FUJIRAMEN!
    `.trim();

    const encodedMessage = encodeURIComponent(orderDetails);
    const messengerUrl = `https://m.me/fujiramenangelesbranch?text=${encodedMessage}`;
    
    window.open(messengerUrl, '_blank');
    
  };

  const isDetailsValid = customerName && contactNumber && 
    (serviceType !== 'delivery' || address) && 
    (serviceType !== 'pickup' || (pickupTime !== 'custom' || customTime)) &&
    (serviceType !== 'dine-in' || (partySize > 0 && dineInTime));

  if (step === 'details') {
    return (
      <div className="min-h-screen bg-fuji-black py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center mb-10 border-b-2 border-fuji-gold/30 pb-6">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-fuji-gold hover:text-white transition-colors duration-300 font-sans font-medium uppercase tracking-wide"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Cart</span>
            </button>
            <h1 className="text-4xl font-kanji font-black text-white ml-auto uppercase tracking-widest">Order Details</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Order Summary */}
            <div className="bg-fuji-darkGray border-2 border-fuji-gold p-8">
              <h2 className="text-3xl font-kanji font-black text-white mb-6 uppercase tracking-wider border-b-2 border-fuji-red pb-4">Your Order</h2>
              
              <div className="space-y-4 mb-8">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-start justify-between py-3 border-b border-fuji-gold/20">
                    <div className="flex-1">
                      <h4 className="font-kanji font-bold text-white text-lg mb-1">{item.name}</h4>
                      {item.selectedVariation && (
                        <p className="text-sm text-fuji-gold/80 font-sans">
                          Bowl: {item.selectedVariation.name}
                        </p>
                      )}
                      {item.selectedAddOns && item.selectedAddOns.length > 0 && (
                        <p className="text-sm text-fuji-gold/80 font-sans">
                          Enhancements: {item.selectedAddOns.map(addOn => addOn.name).join(', ')}
                        </p>
                      )}
                      <p className="text-sm text-fuji-gold font-sans mt-1">₱{item.totalPrice.toFixed(2)} × {item.quantity}</p>
                    </div>
                    <span className="font-kanji font-bold text-fuji-gold text-xl ml-4">₱{(item.totalPrice * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
              <div className="border-t-2 border-fuji-red pt-6">
                <div className="flex items-center justify-between text-3xl font-kanji font-black">
                  <span className="text-white uppercase">Total:</span>
                  <span className="text-fuji-gold">₱{totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Customer Details Form */}
            <div className="bg-fuji-darkGray border-2 border-fuji-gold p-8">
              <h2 className="text-3xl font-kanji font-black text-white mb-6 uppercase tracking-wider border-b-2 border-fuji-red pb-4">Your Information</h2>
            
              <form className="space-y-6">
                {/* Customer Information */}
                <div>
                  <label className="block text-sm font-sans font-medium text-fuji-gold mb-2 uppercase tracking-wide">Full Name *</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-4 py-3 bg-white border-2 border-fuji-gold text-fuji-black focus:ring-2 focus:ring-fuji-red focus:border-fuji-red transition-all duration-300 font-sans placeholder:text-gray-400"
                    placeholder="Your full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-sans font-medium text-fuji-gold mb-2 uppercase tracking-wide">Contact Number *</label>
                  <input
                    type="tel"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    className="w-full px-4 py-3 bg-white border-2 border-fuji-gold text-fuji-black focus:ring-2 focus:ring-fuji-red focus:border-fuji-red transition-all duration-300 font-sans placeholder:text-gray-400"
                    placeholder="09XX XXX XXXX"
                    required
                  />
                </div>

                {/* Service Type */}
                <div>
                  <label className="block text-sm font-sans font-medium text-fuji-gold mb-3 uppercase tracking-wide">Service Type *</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: 'dine-in', label: 'Dine In', icon: '🪑' },
                      { value: 'pickup', label: 'Pickup', icon: '🚶' },
                      { value: 'delivery', label: 'Delivery', icon: '🛵' }
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setServiceType(option.value as ServiceType)}
                        className={`p-4 border-2 transition-all duration-300 ${
                          serviceType === option.value
                            ? 'border-fuji-red bg-fuji-red text-white'
                            : 'border-fuji-gold/50 bg-fuji-black text-fuji-gold hover:border-fuji-gold'
                        }`}
                      >
                        <div className="text-2xl mb-1">{option.icon}</div>
                        <div className="text-sm font-sans font-bold uppercase">{option.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dine-in Details */}
                {serviceType === 'dine-in' && (
                  <>
                    <div>
                      <label className="block text-sm font-sans font-medium text-fuji-gold mb-2 uppercase tracking-wide">Party Size *</label>
                      <div className="flex items-center space-x-4">
                        <button
                          type="button"
                          onClick={() => setPartySize(Math.max(1, partySize - 1))}
                          className="w-12 h-12 border-2 border-fuji-gold flex items-center justify-center text-fuji-gold bg-fuji-black hover:bg-fuji-gold hover:text-fuji-black transition-all duration-300 text-2xl font-bold"
                        >
                          -
                        </button>
                        <span className="text-3xl font-kanji font-black text-white min-w-[4rem] text-center">{partySize}</span>
                        <button
                          type="button"
                          onClick={() => setPartySize(Math.min(20, partySize + 1))}
                          className="w-12 h-12 border-2 border-fuji-gold flex items-center justify-center text-fuji-gold bg-fuji-black hover:bg-fuji-gold hover:text-fuji-black transition-all duration-300 text-2xl font-bold"
                        >
                          +
                        </button>
                        <span className="text-sm text-fuji-gold/80 ml-2 font-sans">guest{partySize !== 1 ? 's' : ''}</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-sans font-medium text-fuji-gold mb-2 uppercase tracking-wide">Preferred Time *</label>
                      <input
                        type="datetime-local"
                        value={dineInTime}
                        onChange={(e) => setDineInTime(e.target.value)}
                        className="w-full px-4 py-3 bg-white border-2 border-fuji-gold text-fuji-black focus:ring-2 focus:ring-fuji-red focus:border-fuji-red transition-all duration-300 font-sans [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-100"
                        required
                      />
                      <p className="text-xs text-fuji-gold/70 mt-2 font-sans">Select your preferred dining time</p>
                    </div>
                  </>
                )}

                {/* Pickup Time Selection */}
                {serviceType === 'pickup' && (
                  <div>
                    <label className="block text-sm font-sans font-medium text-fuji-gold mb-3 uppercase tracking-wide">Pickup Time *</label>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { value: '5-10', label: '5-10 min' },
                          { value: '15-20', label: '15-20 min' },
                          { value: '25-30', label: '25-30 min' },
                          { value: 'custom', label: 'Custom' }
                        ].map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => setPickupTime(option.value)}
                            className={`p-3 border-2 transition-all duration-300 text-sm ${
                              pickupTime === option.value
                                ? 'border-fuji-red bg-fuji-red text-white'
                                : 'border-fuji-gold/50 bg-fuji-black text-fuji-gold hover:border-fuji-gold'
                            }`}
                          >
                            <Clock className="h-4 w-4 mx-auto mb-1" />
                            <span className="font-sans font-bold uppercase">{option.label}</span>
                          </button>
                        ))}
                      </div>
                      
                      {pickupTime === 'custom' && (
                        <input
                          type="text"
                          value={customTime}
                          onChange={(e) => setCustomTime(e.target.value)}
                          className="w-full px-4 py-3 bg-white border-2 border-fuji-gold text-fuji-black focus:ring-2 focus:ring-fuji-red focus:border-fuji-red transition-all duration-300 font-sans placeholder:text-gray-400"
                          placeholder="e.g., 45 minutes, 1 hour, 2:30 PM"
                          required
                        />
                      )}
                    </div>
                  </div>
                )}

                {/* Delivery Address */}
                {serviceType === 'delivery' && (
                  <>
                    <div>
                      <label className="block text-sm font-sans font-medium text-fuji-gold mb-2 uppercase tracking-wide">Delivery Address *</label>
                      <textarea
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full px-4 py-3 bg-white border-2 border-fuji-gold text-fuji-black focus:ring-2 focus:ring-fuji-red focus:border-fuji-red transition-all duration-300 font-sans placeholder:text-gray-400"
                        placeholder="Your complete address"
                        rows={3}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-sans font-medium text-fuji-gold mb-2 uppercase tracking-wide">Landmark</label>
                      <input
                        type="text"
                        value={landmark}
                        onChange={(e) => setLandmark(e.target.value)}
                        className="w-full px-4 py-3 bg-white border-2 border-fuji-gold text-fuji-black focus:ring-2 focus:ring-fuji-red focus:border-fuji-red transition-all duration-300 font-sans placeholder:text-gray-400"
                        placeholder="Nearby landmark for reference"
                      />
                    </div>
                  </>
                )}

                {/* Special Notes */}
                <div>
                  <label className="block text-sm font-sans font-medium text-fuji-gold mb-2 uppercase tracking-wide">Special Requests</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-4 py-3 bg-white border-2 border-fuji-gold text-fuji-black focus:ring-2 focus:ring-fuji-red focus:border-fuji-red transition-all duration-300 font-sans placeholder:text-gray-400"
                    placeholder="Any special instructions..."
                    rows={3}
                  />
                </div>

                <button
                  onClick={handleProceedToPayment}
                  disabled={!isDetailsValid}
                  className={`w-full py-5 font-sans font-black text-xl uppercase tracking-widest transition-all duration-300 transform border-2 ${
                    isDetailsValid
                      ? 'bg-fuji-red text-white border-white hover:bg-white hover:text-fuji-red hover:scale-105 shadow-2xl'
                      : 'bg-gray-700 text-gray-400 border-gray-600 cursor-not-allowed'
                  }`}
                >
                  Continue to Payment
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Payment Step
  return (
    <div className="min-h-screen bg-fuji-black py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center mb-10 border-b-2 border-fuji-gold/30 pb-6">
          <button
            onClick={() => setStep('details')}
            className="flex items-center space-x-2 text-fuji-gold hover:text-white transition-colors duration-300 font-sans font-medium uppercase tracking-wide"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back</span>
          </button>
          <h1 className="text-4xl font-kanji font-black text-white ml-auto uppercase tracking-widest">Payment</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment Method Selection */}
          <div className="bg-fuji-darkGray border-2 border-fuji-gold p-8">
            <h2 className="text-3xl font-kanji font-black text-white mb-6 uppercase tracking-wider border-b-2 border-fuji-red pb-4">Payment Method</h2>
            
            <div className="grid grid-cols-1 gap-4 mb-8">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setPaymentMethod(method.id as PaymentMethod)}
                  className={`p-5 border-2 transition-all duration-300 flex items-center space-x-4 ${
                    paymentMethod === method.id
                      ? 'border-fuji-red bg-fuji-red text-white'
                      : 'border-fuji-gold/50 bg-fuji-black text-fuji-gold hover:border-fuji-gold'
                  }`}
                >
                  <span className="text-2xl">💳</span>
                  <span className="font-sans font-bold uppercase tracking-wider text-lg">{method.name}</span>
                </button>
              ))}
            </div>

            {/* Payment Details with QR Code */}
            {selectedPaymentMethod && (
              <div className="bg-fuji-black border-2 border-fuji-gold/30 p-6 mb-6">
                <h3 className="font-kanji font-bold text-fuji-gold mb-4 text-xl uppercase tracking-wide">Account Details</h3>
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div className="flex-1">
                    <p className="text-sm text-fuji-gold/70 mb-1 font-sans uppercase tracking-wide">{selectedPaymentMethod.name}</p>
                    <p className="font-mono text-white font-bold text-lg mb-2">{selectedPaymentMethod.account_number}</p>
                    <p className="text-sm text-fuji-gold/80 mb-4 font-sans">
                      <span className="text-fuji-gold">Name:</span> {selectedPaymentMethod.account_name}
                    </p>
                    <p className="text-2xl font-kanji font-black text-fuji-red">
                      Amount: ₱{totalPrice.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <img 
                      src={selectedPaymentMethod.qr_code_url} 
                      alt={`${selectedPaymentMethod.name} QR Code`}
                      className="w-36 h-36 border-4 border-fuji-gold shadow-xl"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.pexels.com/photos/8867482/pexels-photo-8867482.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop';
                      }}
                    />
                    <p className="text-xs text-fuji-gold text-center mt-2 font-sans uppercase tracking-wider">Scan QR</p>
                  </div>
                </div>
              </div>
            )}

            {/* Reference Number */}
            <div className="bg-fuji-red/20 border-2 border-fuji-red p-5">
              <h4 className="font-kanji font-bold text-white mb-3 text-lg uppercase tracking-wide">📸 Payment Proof Required</h4>
              <p className="text-sm text-fuji-gold font-sans leading-relaxed">
                After payment, take a screenshot of your receipt. You'll attach it when confirming your order via Messenger. 
                This ensures swift verification and processing of your FujiRamen order.
              </p>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-fuji-darkGray border-2 border-fuji-gold p-8">
            <h2 className="text-3xl font-kanji font-black text-white mb-6 uppercase tracking-wider border-b-2 border-fuji-red pb-4">Final Order</h2>
            
            <div className="space-y-6 mb-8">
              <div className="bg-fuji-black border-2 border-fuji-gold/30 p-6">
                <h4 className="font-kanji font-bold text-fuji-gold mb-4 text-lg uppercase tracking-wide">Customer Details</h4>
                <p className="text-sm text-white mb-2 font-sans"><span className="text-fuji-gold">Name:</span> {customerName}</p>
                <p className="text-sm text-white mb-2 font-sans"><span className="text-fuji-gold">Contact:</span> {contactNumber}</p>
                <p className="text-sm text-white font-sans"><span className="text-fuji-gold">Service:</span> {serviceType.charAt(0).toUpperCase() + serviceType.slice(1)}</p>
                {serviceType === 'delivery' && (
                  <>
                    <p className="text-sm text-white mb-2 font-sans"><span className="text-fuji-gold">Address:</span> {address}</p>
                    {landmark && <p className="text-sm text-white font-sans"><span className="text-fuji-gold">Landmark:</span> {landmark}</p>}
                  </>
                )}
                {serviceType === 'pickup' && (
                  <p className="text-sm text-white font-sans">
                    <span className="text-fuji-gold">Pickup:</span> {pickupTime === 'custom' ? customTime : `${pickupTime} minutes`}
                  </p>
                )}
                {serviceType === 'dine-in' && (
                  <>
                    <p className="text-sm text-white mb-2 font-sans">
                      <span className="text-fuji-gold">Party Size:</span> {partySize} guest{partySize !== 1 ? 's' : ''}
                    </p>
                    <p className="text-sm text-white font-sans">
                      <span className="text-fuji-gold">Time:</span> {dineInTime ? new Date(dineInTime).toLocaleString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric', 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      }) : 'Not selected'}
                    </p>
                  </>
                )}
              </div>

              {cartItems.map((item) => (
                <div key={item.id} className="flex items-start justify-between py-3 border-b border-fuji-gold/20">
                  <div className="flex-1">
                    <h4 className="font-kanji font-bold text-white text-lg">{item.name}</h4>
                    {item.selectedVariation && (
                      <p className="text-sm text-fuji-gold/80 font-sans">Bowl: {item.selectedVariation.name}</p>
                    )}
                    {item.selectedAddOns && item.selectedAddOns.length > 0 && (
                      <p className="text-sm text-fuji-gold/80 font-sans">
                        Enhancements: {item.selectedAddOns.map(addOn => 
                          addOn.quantity && addOn.quantity > 1 
                            ? `${addOn.name} ×${addOn.quantity}`
                            : addOn.name
                        ).join(', ')}
                      </p>
                    )}
                    <p className="text-sm text-fuji-gold font-sans mt-1">₱{item.totalPrice.toFixed(2)} × {item.quantity}</p>
                  </div>
                  <span className="font-kanji font-bold text-fuji-gold text-xl ml-4">₱{(item.totalPrice * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            <div className="border-t-2 border-fuji-red pt-6 mb-8">
              <div className="flex items-center justify-between text-4xl font-kanji font-black">
                <span className="text-white uppercase">Total:</span>
                <span className="text-fuji-gold">₱{totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              className="w-full py-6 border-2 border-white font-sans font-black text-xl uppercase tracking-widest transition-all duration-300 transform bg-fuji-red text-white hover:bg-white hover:text-fuji-red hover:scale-105 shadow-2xl mb-4"
            >
              Confirm Order via Messenger
            </button>
            
            <p className="text-xs text-fuji-gold/80 text-center font-sans leading-relaxed">
              You'll be redirected to Messenger to finalize your order. Remember to attach your payment screenshot for swift processing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
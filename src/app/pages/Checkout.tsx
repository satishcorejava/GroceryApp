import { useNavigate } from "react-router";
import { ArrowLeft, MapPin, CreditCard, Calendar, Smartphone, Wallet, Banknote } from "lucide-react";
import { useCart } from "../hooks/useCart";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useState } from "react";

export function Checkout() {
  const navigate = useNavigate();
  const { cartItems, getTotal, clearCart } = useCart();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("card");

  const subtotal = getTotal();
  const tax = subtotal * 0.08;
  const deliveryFee = subtotal > 50 ? 0 : 4.99;
  const total = subtotal + tax + deliveryFee;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setOrderPlaced(true);
    setTimeout(() => {
      clearCart();
      navigate("/");
    }, 3000);
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-green-50">
        <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mb-4">
          <svg
            className="w-10 h-10 text-white"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h1 className="mb-2 text-green-600">Order Placed!</h1>
        <p className="text-gray-600 text-center">
          Your order has been confirmed and will be delivered soon.
        </p>
        <p className="text-sm text-gray-500 mt-4">
          Redirecting to home...
        </p>
      </div>
    );
  }

  if (cartItems.length === 0) {
    navigate("/cart");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-48">
      {/* Header */}
      <div className="bg-green-600 text-white p-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1>Checkout</h1>
        </div>
      </div>

      <form onSubmit={handlePlaceOrder} className="p-4 space-y-4">
        {/* Delivery Address */}
        <div className="bg-white rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-5 h-5 text-green-600" />
            <h2>Delivery Address</h2>
          </div>
          
          <div className="space-y-3">
            <div>
              <Label htmlFor="address">Street Address</Label>
              <Input
                id="address"
                type="text"
                placeholder="123 Main St"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  type="text"
                  placeholder="New York"
                  required
                />
              </div>
              <div>
                <Label htmlFor="zip">ZIP Code</Label>
                <Input
                  id="zip"
                  type="text"
                  placeholder="10001"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Time */}
        <div className="bg-white rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-5 h-5 text-green-600" />
            <h2>Delivery Time</h2>
          </div>
          
          <select
            className="w-full px-3 py-2 border rounded-lg"
            required
          >
            <option value="">Select delivery time</option>
            <option value="asap">ASAP (30-45 min)</option>
            <option value="1hour">In 1 hour</option>
            <option value="2hours">In 2 hours</option>
            <option value="tomorrow">Tomorrow</option>
          </select>
        </div>

        {/* Payment Method */}
        <div className="bg-white rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="w-5 h-5 text-green-600" />
            <h2>Payment Method</h2>
          </div>
          
          {/* Payment Method Options */}
          <div className="space-y-3 mb-4">
            {/* Credit/Debit Card */}
            <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-green-50" style={{borderColor: selectedPaymentMethod === 'card' ? '#16a34a' : '#e5e7eb'}}>
              <input
                type="radio"
                name="paymentMethod"
                value="card"
                checked={selectedPaymentMethod === 'card'}
                onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                className="mr-3"
              />
              <CreditCard className="w-5 h-5 text-green-600 mr-2" />
              <span className="font-medium">Credit/Debit Card</span>
            </label>

            {/* UPI */}
            <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-green-50" style={{borderColor: selectedPaymentMethod === 'upi' ? '#16a34a' : '#e5e7eb'}}>
              <input
                type="radio"
                name="paymentMethod"
                value="upi"
                checked={selectedPaymentMethod === 'upi'}
                onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                className="mr-3"
              />
              <Smartphone className="w-5 h-5 text-green-600 mr-2" />
              <span className="font-medium">UPI</span>
            </label>

            {/* Digital Wallets */}
            <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-green-50" style={{borderColor: selectedPaymentMethod === 'wallet' ? '#16a34a' : '#e5e7eb'}}>
              <input
                type="radio"
                name="paymentMethod"
                value="wallet"
                checked={selectedPaymentMethod === 'wallet'}
                onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                className="mr-3"
              />
              <Wallet className="w-5 h-5 text-green-600 mr-2" />
              <span className="font-medium">Digital Wallets</span>
            </label>

            {/* Net Banking */}
            <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-green-50" style={{borderColor: selectedPaymentMethod === 'netbanking' ? '#16a34a' : '#e5e7eb'}}>
              <input
                type="radio"
                name="paymentMethod"
                value="netbanking"
                checked={selectedPaymentMethod === 'netbanking'}
                onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                className="mr-3"
              />
              <Banknote className="w-5 h-5 text-green-600 mr-2" />
              <span className="font-medium">Net Banking</span>
            </label>

            {/* Cash on Delivery */}
            <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-green-50" style={{borderColor: selectedPaymentMethod === 'cod' ? '#16a34a' : '#e5e7eb'}}>
              <input
                type="radio"
                name="paymentMethod"
                value="cod"
                checked={selectedPaymentMethod === 'cod'}
                onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                className="mr-3"
              />
              <Banknote className="w-5 h-5 text-green-600 mr-2" />
              <span className="font-medium">Cash on Delivery</span>
            </label>
          </div>

          {/* Card Details - Only show for card method */}
          {selectedPaymentMethod === 'card' && (
            <div className="space-y-3 pt-4 border-t">
              <div>
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input
                    id="expiry"
                    type="text"
                    placeholder="MM/YY"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    type="text"
                    placeholder="123"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* UPI Details - Only show for UPI method */}
          {selectedPaymentMethod === 'upi' && (
            <div className="space-y-3 pt-4 border-t">
              <div>
                <Label htmlFor="upiId">UPI ID</Label>
                <Input
                  id="upiId"
                  type="text"
                  placeholder="yourname@upi"
                  required
                />
              </div>
              <p className="text-xs text-gray-500">We will send you a payment request</p>
            </div>
          )}

          {/* Wallet Selection - Only show for wallet method */}
          {selectedPaymentMethod === 'wallet' && (
            <div className="space-y-3 pt-4 border-t">
              <Label>Select Wallet</Label>
              <select className="w-full px-3 py-2 border rounded-lg" required>
                <option value="">Choose a wallet</option>
                <option value="googleplay">Google Pay</option>
                <option value="paytm">Paytm</option>
                <option value="phonepe">PhonePe</option>
                <option value="mobikwik">MobiKwik</option>
              </select>
            </div>
          )}

          {/* Net Banking - Only show for net banking method */}
          {selectedPaymentMethod === 'netbanking' && (
            <div className="space-y-3 pt-4 border-t">
              <Label>Select Bank</Label>
              <select className="w-full px-3 py-2 border rounded-lg" required>
                <option value="">Choose your bank</option>
                <option value="sbi">State Bank of India</option>
                <option value="hdfc">HDFC Bank</option>
                <option value="icici">ICICI Bank</option>
                <option value="axis">Axis Bank</option>
                <option value="kotak">Kotak Mahindra Bank</option>
              </select>
            </div>
          )}

          {/* COD Message */}
          {selectedPaymentMethod === 'cod' && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-xs text-yellow-800">
                You will pay ₹{total.toFixed(2)} when your order is delivered.
              </p>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-lg p-4">
          <h2 className="mb-3">Order Summary</h2>
          
          <div className="space-y-2 text-sm mb-3">
            {cartItems.map((item) => {
              const price = item.product.discount
                ? item.product.price * (1 - item.product.discount / 100)
                : item.product.price;
              
              return (
                <div key={item.product.id} className="flex justify-between">
                  <span className="text-gray-600">
                    {item.product.name} x {item.quantity}
                  </span>
                  <span>₹{(price * item.quantity).toFixed(2)}</span>
                </div>
              );
            })}
          </div>
          
          <div className="border-t pt-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax (8%)</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Delivery Fee</span>
              <span>
                {deliveryFee === 0 ? (
                  <span className="text-green-600">FREE</span>
                ) : (
                  `₹${deliveryFee.toFixed(2)}`
                )}
              </span>
            </div>
            <div className="border-t pt-2 flex justify-between">
              <span>Total</span>
              <span className="text-green-600">₹{total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </form>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-16 left-0 right-0 bg-white border-t p-4 max-w-md mx-auto z-40">
        <Button
          onClick={handlePlaceOrder}
          className="w-full bg-green-600 hover:bg-green-700 text-white"
        >
          Place Order - ₹{total.toFixed(2)}
        </Button>
      </div>
    </div>
  );
}

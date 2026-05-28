import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../hooks/useCart'; // Assuming CartContext is exported from useCart
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { Loader2 } from 'lucide-react';
import { api } from '../services/api';

// Declare Razorpay global object
declare global {
  interface Window {
    Razorpay: new (options: any) => any;
  }
}

const CheckoutPage: React.FC = () => {
  const { cartItems, cartTotal, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/menu'); // Redirect if cart is empty
    }

    // Dynamically load Razorpay script
    const loadRazorpayScript = () => {
      return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      });
    };

    loadRazorpayScript();
  }, [cartItems, navigate]);

  const handleCheckout = async () => {
    if (!address || !phone) {
      setError('Please provide a delivery address and phone number.');
      return;
    }
    if (cartItems.length === 0) {
      setError('Your cart is empty. Please add items to proceed.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // 1. Create order in backend and get Razorpay order details
      const orderData = {
        items: cartItems.map(item => ({
          menuItemId: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        totalAmount: cartTotal,
        deliveryAddress: address,
        customerPhone: phone,
      };

      const response = await api.post('/api/orders/create-razorpay-order', orderData);
      const { razorpayOrderId, amount, currency, keyId, orderId: backendOrderId } = response.data;

      if (!window.Razorpay) {
        setError('Razorpay SDK not loaded. Please try again.');
        setLoading(false);
        return;
      }

      const options = {
        key: keyId, // Your Razorpay Key ID
        amount: amount, // Amount in smallest currency unit (e.g., paise for INR)
        currency: currency,
        name: 'Yeti - The Himalayan Kitchen',
        description: 'Order from Yeti',
        order_id: razorpayOrderId, // Razorpay Order ID
        handler: async function (response: any) {
          setPaymentProcessing(true);
          try {
            // 2. Verify payment on successful transaction
            const verificationResponse = await api.post('/api/payments/verify', {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              orderId: backendOrderId, // Our backend order ID
            });

            if (verificationResponse.data.status === 'PAID') {
              setSuccess('Payment successful! Your order has been placed.');
              clearCart();
              navigate('/order-success', { state: { orderId: backendOrderId } });
            } else {
              setError('Payment verification failed. Please contact support.');
            }
          } catch (verifyError: any) {
            console.error('Payment verification error:', verifyError);
            setError(verifyError.response?.data?.message || 'Payment verification failed due to an unexpected error.');
          } finally {
            setPaymentProcessing(false);
          }
        },
        prefill: {
          name: 'Customer Name', // You might get this from user context
          email: 'customer@example.com', // You might get this from user context
          contact: phone,
        },
        notes: {
          address: address,
          orderId: backendOrderId,
        },
        theme: {
          color: '#8B4513', // Earthy brown, matching theme
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        setError(response.error.description || 'Payment failed. Please try again.');
        setPaymentProcessing(false);
      });
      rzp.open();

    } catch (err: any) {
      console.error('Checkout error:', err);
      setError(err.response?.data?.message || 'Failed to initiate checkout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-12 px-4 min-h-[calc(100vh-120px)] bg-stone-50 text-stone-800">
      <h1 className="text-4xl font-bold text-blue-900 mb-8 text-center font-serif tracking-wide">
        Final Checkout
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Order Summary */}
        <Card className="bg-white shadow-lg border-amber-600/30 border">
          <CardHeader className="bg-amber-600/10 py-4 rounded-t-lg">
            <CardTitle className="text-2xl text-blue-900 font-semibold">Your Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {cartItems.length === 0 ? (
              <p className="text-stone-600 italic">Your cart is empty.</p>
            ) : (
              <ul className="space-y-3 mb-4">
                {cartItems.map((item) => (
                  <li key={item.id} className="flex justify-between items-center border-b border-stone-200 pb-2 last:border-b-0">
                    <span className="text-lg font-medium text-stone-700">{item.name} x {item.quantity}</span>
                    <span className="text-lg font-semibold text-blue-800">₹{(item.price * item.quantity).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            )}
            <div className="flex justify-between items-center pt-4 border-t-2 border-amber-600/50 mt-4">
              <span className="text-xl font-bold text-blue-900">Total:</span>
              <span className="text-2xl font-extrabold text-amber-700">₹{cartTotal.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Delivery Details & Payment */}
        <Card className="bg-white shadow-lg border-amber-600/30 border">
          <CardHeader className="bg-amber-600/10 py-4 rounded-t-lg">
            <CardTitle className="text-2xl text-blue-900 font-semibold">Delivery & Payment</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="address" className="text-lg font-medium text-stone-700">Delivery Address</Label>
              <Input
                id="address"
                type="text"
                placeholder="Enter your delivery address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="p-3 text-lg border-stone-300 focus:border-amber-600 focus:ring-amber-600"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-lg font-medium text-stone-700">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter your phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="p-3 text-lg border-stone-300 focus:border-amber-600 focus:ring-amber-600"
              />
            </div>

            {error && (
              <Alert variant="destructive" className="bg-red-100 border-red-400 text-red-700">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert className="bg-green-100 border-green-400 text-green-700">
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter className="p-6 pt-0">
            <Button
              onClick={handleCheckout}
              disabled={loading || paymentProcessing || cartItems.length === 0}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white text-xl py-3 rounded-lg transition-colors duration-300 flex items-center justify-center"
            >
              {(loading || paymentProcessing) && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
              {paymentProcessing ? 'Processing Payment...' : loading ? 'Initiating Order...' : 'Pay Now with Razorpay'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default CheckoutPage;
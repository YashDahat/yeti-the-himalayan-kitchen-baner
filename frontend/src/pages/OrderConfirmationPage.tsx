import { useParams, Link } from 'react-router-dom';
import { useOrderById } from '@/hooks/useOrders';
import { format } from 'date-fns';
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { OrderStatus } from '@/types/order';

const getStatusColorClass = (status: OrderStatus) => {
  switch (status) {
    case 'CONFIRMED':
    case 'DELIVERED':
      return 'text-green-600';
    case 'PENDING':
    case 'OUT_FOR_DELIVERY':
      return 'text-yellow-600';
    case 'CANCELLED':
      return 'text-red-600';
    default:
      return 'text-gray-600';
  }
};

const OrderConfirmationPage = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { data: order, isLoading, isError, error } = useOrderById(orderId || '');

  if (isLoading) {
    return (
      <Layout>
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-xl text-gray-700">Loading order details...</p>
          </div>
        </section>
      </Layout>
    );
  }

  if (isError) {
    return (
      <Layout>
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-2xl font-semibold text-red-600">Error loading order</h2>
            <p className="text-gray-700">{error?.message || 'An unexpected error occurred.'}</p>
          </div>
        </section>
      </Layout>
    );
  }

  if (!order) {
    return (
      <Layout>
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-2xl font-semibold text-gray-800">Order Not Found</h2>
            <p className="text-gray-700">The order you are looking for does not exist or could not be retrieved.</p>
            <Link to="/profile" className="mt-4 inline-block text-[#CC5500] hover:underline transition-all duration-200">
              View Your Order History
            </Link>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section */}
      <section
        className="relative h-[500px] md:h-[600px] bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `url(https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1920&q=80)` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Your Culinary Journey Confirmed!</h1>
          <p className="text-lg md:text-xl text-white leading-relaxed">
            Thank you for your order at Yeti - The Himalayan Kitchen, Baner. Your adventure begins now.
          </p>
        </div>
      </section>

      {/* Order Summary Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-8 text-center">Order Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-6 bg-white rounded-xl shadow-md border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Order Details</h3>
              <p className="text-gray-700 mb-2">
                <strong>Order ID:</strong> {order.id}
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Order Date:</strong> {order.orderDate ? format(new Date(order.orderDate), 'PPP p') : 'N/A'}
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Total Amount:</strong> ₹{order.totalAmount.toFixed(2)}
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Status:</strong> <span className={`${getStatusColorClass(order.status)} font-medium`}>{order.status}</span>
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Delivery Address:</strong> {order.deliveryAddress}
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Contact Phone:</strong> {order.contactPhone}
              </p>
              {order.notes && (
                <p className="text-gray-700 mb-2">
                  <strong>Notes:</strong> {order.notes}
                </p>
              )}
            </Card>

            <Card className="p-6 bg-white rounded-xl shadow-md border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Items Ordered</h3>
              {order.orderItems.length > 0 ? (
                <ul className="space-y-4">
                  {order.orderItems.map((item) => (
                    <li key={item.menuItemId} className="flex justify-between items-center border-b pb-2 last:border-b-0 last:pb-0">
                      <div>
                        <p className="font-medium text-gray-800">{item.menuItemName}</p>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-gray-800">₹{(item.priceAtOrder * item.quantity).toFixed(2)}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600">No items found in this order.</p>
              )}
            </Card>
          </div>
        </div>
      </section>

      {/* Next Steps Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6">What's Next?</h2>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Button asChild className="bg-[#CC5500] hover:bg-[#A34300] text-white font-semibold rounded-full px-8 py-3 transition-all duration-200">
              <Link to="/menu">Explore More of Our Menu</Link>
            </Button>
            <Link to="/profile" className="text-[#CC5500] hover:underline font-semibold transition-all duration-200">
              View Your Order History
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default OrderConfirmationPage;
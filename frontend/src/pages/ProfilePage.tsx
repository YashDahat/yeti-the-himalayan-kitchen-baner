import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import useAuth from '../hooks/useAuth';
import { useOrdersByCurrentUser } from '../hooks/useOrders';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import clsx from 'clsx';
import type { OrderResponse, OrderStatus } from '@/types/order';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { data: orders, isLoading, isError, error } = useOrdersByCurrentUser();

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

  const sortedOrders = orders
    ? [...orders].sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())
    : [];

  return (
    <Layout>
      {/* Hero Section */}
      <section
        className="relative h-[500px] md:h-[600px] bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80)' }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Your Himalayan Profile</h1>
          <p className="text-lg md:text-xl text-white">
            Manage your details and explore your past culinary adventures at Yeti - The Himalayan Kitchen, Baner.
          </p>
        </div>
      </section>

      {/* Profile Details Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-8">Personal Details</h2>
          <Card className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-500">Email Address:</p>
                <p className="text-lg font-medium text-gray-900">{user?.email || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-500">Name:</p>
                <p className="text-lg font-medium text-gray-900">
                  {user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : 'N/A'}
                </p>
              </div>
            </div>
            <p className="mt-6 text-gray-600">
              This section will allow you to edit your personal information in the future.
            </p>
          </Card>
        </div>
      </section>

      {/* Order History Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-8">Your Order History</h2>

          {isLoading && (
            <div className="text-center text-gray-600">Loading your orders...</div>
          )}

          {isError && (
            <div className="text-center text-red-600">Error loading orders: {error?.message}</div>
          )}

          {!isLoading && !isError && sortedOrders.length === 0 && (
            <div className="text-center text-gray-600 p-8 border border-gray-200 rounded-lg bg-white shadow-sm">
              <p className="text-lg font-medium mb-2">No orders found.</p>
              <p>It looks like you haven't placed any orders yet. Start your culinary journey!</p>
              <Link to="/menu" className="mt-4 inline-block">
                <Button className="bg-[#CC5500] hover:bg-[#A34300] text-white font-semibold rounded-full px-8 py-3 transition-all duration-200">
                  Explore Our Menu
                </Button>
              </Link>
            </div>
          )}

          {!isLoading && !isError && sortedOrders.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedOrders.map((order) => (
                <Card key={order.id} className="p-6 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Order #{order.id.substring(0, 8)}...</h3>
                    <p className="text-gray-600 mb-1">
                      <span className="font-medium">Date:</span> {format(new Date(order.orderDate), 'PPP')}
                    </p>
                    <p className="text-gray-600 mb-1">
                      <span className="font-medium">Total:</span> ₹{order.totalAmount.toFixed(2)}
                    </p>
                    <p className="text-gray-600 mb-4">
                      <span className="font-medium">Status:</span>{' '}
                      <span className={clsx('font-semibold', getStatusColorClass(order.status))}>
                        {order.status.replace(/_/g, ' ')}
                      </span>
                    </p>
                  </div>
                  <Link to={`/order-confirmation/${order.id}`} className="mt-4 self-start">
                    <Button variant="outline" className="border-[#CC5500] text-[#CC5500] hover:bg-[#CC5500] hover:text-white transition-all duration-200">
                      View Details
                    </Button>
                  </Link>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default ProfilePage;
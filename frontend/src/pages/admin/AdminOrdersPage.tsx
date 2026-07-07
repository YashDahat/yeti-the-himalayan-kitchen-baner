import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import clsx from 'clsx';

import { AdminLayout } from '@/components/AdminLayout';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@radix-ui/react-select';

import { useAllOrders, useUpdateOrderStatus, useCancelOrder } from '@/hooks/useOrders';
import type { OrderResponse, OrderStatus } from '@/types/order';

const AdminOrdersPage: React.FC = () => {
  const { data: orders, isLoading, isError, error } = useAllOrders();
  const updateStatusMutation = useUpdateOrderStatus();
  const cancelOrderMutation = useCancelOrder();

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    updateStatusMutation.mutate({ orderId, status: newStatus });
  };

  const handleCancelOrder = (orderId: string) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      cancelOrderMutation.mutate(orderId);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <section className="py-8 px-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Manage Customer Orders</h1>
            <div className="animate-pulse">
              <div className="h-10 bg-gray-200 rounded mb-4"></div>
              <div className="h-8 bg-gray-100 rounded mb-2"></div>
              <div className="h-8 bg-gray-100 rounded mb-2"></div>
              <div className="h-8 bg-gray-100 rounded mb-2"></div>
            </div>
          </div>
        </section>
      </AdminLayout>
    );
  }

  if (isError) {
    return (
      <AdminLayout>
        <section className="py-8 px-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Manage Customer Orders</h1>
            <p className="text-red-500">Error loading orders: {error?.message}</p>
          </div>
        </section>
      </AdminLayout>
    );
  }

  const orderStatusOptions: OrderStatus[] = [
    'PENDING',
    'CONFIRMED',
    'OUT_FOR_DELIVERY',
    'DELIVERED',
    'CANCELLED',
  ];

  return (
    <AdminLayout>
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Manage Customer Orders</h1>

          {orders && orders.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-600 text-lg">No orders found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto bg-white rounded-xl shadow-md border border-gray-100">
              <Table>
                <TableHeader className="bg-gray-200 text-gray-700 font-semibold">
                  <TableRow>
                    <TableHead className="min-w-[120px]">Order ID</TableHead>
                    <TableHead className="min-w-[120px]">User ID</TableHead>
                    <TableHead className="min-w-[150px]">Order Date</TableHead>
                    <TableHead className="min-w-[100px]">Total Amount</TableHead>
                    <TableHead className="min-w-[200px]">Delivery Address</TableHead>
                    <TableHead className="min-w-[150px]">Contact Phone</TableHead>
                    <TableHead className="min-w-[150px]">Status</TableHead>
                    <TableHead className="min-w-[200px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders?.map((order: OrderResponse) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.userId}</TableCell>
                      <TableCell>{format(new Date(order.orderDate), 'MMM dd, yyyy HH:mm')}</TableCell>
                      <TableCell>₹{order.totalAmount.toFixed(2)}</TableCell>
                      <TableCell>{order.deliveryAddress}</TableCell>
                      <TableCell>{order.contactPhone}</TableCell>
                      <TableCell>
                        <Select
                          value={order.status}
                          onValueChange={(value) => handleStatusChange(order.id, value as OrderStatus)}
                          disabled={updateStatusMutation.isPending}
                        >
                          <SelectTrigger
                            className={clsx(
                              'w-[140px] text-sm py-2 px-3 rounded-md border',
                              {
                                'bg-yellow-100 text-yellow-800 border-yellow-300': order.status === 'PENDING',
                                'bg-green-100 text-green-800 border-green-300': order.status === 'CONFIRMED' || order.status === 'DELIVERED',
                                'bg-blue-100 text-blue-800 border-blue-300': order.status === 'OUT_FOR_DELIVERY',
                                'bg-red-100 text-red-800 border-red-300': order.status === 'CANCELLED',
                              }
                            )}
                          >
                            <SelectValue placeholder="Select Status" />
                          </SelectTrigger>
                          <SelectContent>
                            {orderStatusOptions.map((status) => (
                              <SelectItem key={status} value={status}>
                                {status.replace(/_/g, ' ')}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Link to={`/admin/orders/${order.id}`}>
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </Link>
                          {order.status !== 'CANCELLED' && order.status !== 'DELIVERED' && (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleCancelOrder(order.id)}
                              disabled={cancelOrderMutation.isPending}
                            >
                              Cancel Order
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </section>
    </AdminLayout>
  );
};

export default AdminOrdersPage;
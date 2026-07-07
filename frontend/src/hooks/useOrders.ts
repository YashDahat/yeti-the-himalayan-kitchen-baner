import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createOrder,
  getOrdersByUserId,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
} from '@/services/orderService';
import type { CreateOrderRequest, OrderResponse, OrderStatus } from '@/types/order';

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation<OrderResponse, Error, CreateOrderRequest>({
    mutationFn: createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userOrders'] });
      queryClient.invalidateQueries({ queryKey: ['adminOrders'] });
    },
  });
};

export const useOrdersByCurrentUser = () => {
  return useQuery<OrderResponse[], Error>({
    queryKey: ['userOrders'],
    queryFn: getOrdersByUserId,
  });
};

export const useOrderById = (orderId: string) => {
  return useQuery<OrderResponse, Error>({
    queryKey: ['order', orderId],
    queryFn: () => getOrderById(orderId),
    enabled: !!orderId,
  });
};

export const useCancelOrder = () => {
  const queryClient = useQueryClient();
  return useMutation<OrderResponse, Error, string>({
    mutationFn: cancelOrder,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['order', data.id] });
      queryClient.invalidateQueries({ queryKey: ['userOrders'] });
      queryClient.invalidateQueries({ queryKey: ['adminOrders'] });
    },
  });
};

export const useAllOrders = () => {
  return useQuery<OrderResponse[], Error>({
    queryKey: ['adminOrders'],
    queryFn: getAllOrders,
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  return useMutation<OrderResponse, Error, { orderId: string; status: OrderStatus }>({
    mutationFn: ({ orderId, status }) => updateOrderStatus(orderId, { status }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['order', data.id] });
      queryClient.invalidateQueries({ queryKey: ['adminOrders'] });
    },
  });
};
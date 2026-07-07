// GENERATED from the backend API contract — do not edit by hand.
// One function per endpoint; paths and types are ground truth.

import apiClient from '@/api/client';
import type { CreateOrderRequest, OrderResponse, PaymentOrderResponse } from '@/types/order';

export const initiatePayment = async (): Promise<PaymentOrderResponse> => {
  const response = await apiClient.post<PaymentOrderResponse>('/api/v1/payments/initiate');
  return response.data;
};

export const createOrder = async (request: CreateOrderRequest): Promise<OrderResponse> => {
  const response = await apiClient.post<OrderResponse>('/api/v1/orders', request);
  return response.data;
};

export const getOrdersByUserId = async (): Promise<OrderResponse[]> => {
  const response = await apiClient.get<OrderResponse[]>('/api/v1/orders');
  return response.data;
};

export const getOrderById = async (orderId: string): Promise<OrderResponse> => {
  const response = await apiClient.get<OrderResponse>(`/api/v1/orders/${orderId}`);
  return response.data;
};

export const cancelOrder = async (orderId: string): Promise<OrderResponse> => {
  const response = await apiClient.put<OrderResponse>(`/api/v1/orders/${orderId}/cancel`);
  return response.data;
};

export const getAllOrders = async (): Promise<OrderResponse[]> => {
  const response = await apiClient.get<OrderResponse[]>('/api/v1/admin/orders');
  return response.data;
};

export const adminGetOrderById = async (orderId: string): Promise<OrderResponse> => {
  const response = await apiClient.get<OrderResponse>(`/api/v1/admin/orders/${orderId}`);
  return response.data;
};

export const updateOrderStatus = async (orderId: string, request: unknown): Promise<OrderResponse> => {
  const response = await apiClient.put<OrderResponse>(`/api/v1/admin/orders/${orderId}/status`, request);
  return response.data;
};


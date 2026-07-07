// GENERATED from the backend API contract — do not edit by hand.
// Source of truth: backend controllers/DTOs (see docs/API_INVENTORY.json).

export interface OrderResponse {
  id: string | null;
  userId: string | null;
  orderDate: string | null;
  totalAmount: number | null;
  status: OrderStatus | null;
  deliveryAddress: string | null;
  contactPhone: string | null;
  notes: string | null;
  orderItems: OrderItemResponse[] | null;
}

export interface PaymentOrderResponse {
  razorpayOrderId: string | null;
  amount: number | null;
  currency: string | null;
  receipt: string | null;
  key: string | null;
}

export interface CreateOrderRequest {
  orderItems: OrderItemRequest[] | null;
  deliveryAddress: string | null;
  contactPhone: string | null;
  notes: string | null;
}

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';

export interface OrderItemResponse {
  orderItemId: string | null;
  menuItemId: string | null;
  menuItemName: string | null;
  quantity: number | null;
  priceAtOrder: number | null;
}

export interface OrderItemRequest {
  menuItemId: string | null;
  quantity: number | null;
}


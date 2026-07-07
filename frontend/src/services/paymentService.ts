// GENERATED from the backend API contract — do not edit by hand.
// One function per endpoint; paths and types are ground truth.

import apiClient from '@/api/client';
import type { PaymentVerificationRequest } from '@/types/payment';

export const verifyPayment = async (request: PaymentVerificationRequest): Promise<unknown> => {
  const response = await apiClient.post<unknown>('/api/v1/payments/verify', request);
  return response.data;
};


import type { OrderResponse } from '../types/order';
import type { PaymentResponse } from '../types/payment';
import { createApiUrl, extractErrorMessage } from './api';

export class OrderError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'OrderError';
  }
}

export async function getMyOrders(accessToken: string): Promise<OrderResponse[]> {
  const response = await fetch(createApiUrl('/api/orders/my-orders'), {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!response.ok) {
    const message = await extractErrorMessage(response);
    throw new OrderError(message);
  }
  const data: unknown = await response.json();
  return data as OrderResponse[];
}

export async function fetchOrder(
  accessToken: string,
  orderId: string,
): Promise<OrderResponse> {
  const response = await fetch(createApiUrl(`/api/orders/${orderId}`), {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!response.ok) {
    const message = await extractErrorMessage(response);
    throw new OrderError(message);
  }
  const data: unknown = await response.json();
  return data as OrderResponse;
}

export async function fetchOrderPayment(
  accessToken: string,
  orderId: string,
): Promise<PaymentResponse | null> {
  const response = await fetch(createApiUrl(`/api/orders/${orderId}/payment`), {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (response.status === 404) return null;
  if (!response.ok) {
    const message = await extractErrorMessage(response);
    throw new OrderError(message);
  }
  const data: unknown = await response.json();
  return data as PaymentResponse;
}

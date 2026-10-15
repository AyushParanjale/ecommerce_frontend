import type { OrderResponse } from '../types/order';
import { createApiUrl, extractErrorMessage } from './api';

export class CheckoutError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CheckoutError';
  }
}

export async function createOrder(accessToken: string): Promise<OrderResponse> {
  const response = await fetch(createApiUrl('/api/checkout'), {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!response.ok) {
    const message =
      response.status === 409
        ? 'Stock was updated while placing your order. Please try again.'
        : await extractErrorMessage(response);
    throw new CheckoutError(message);
  }
  const data: unknown = await response.json();
  return data as OrderResponse;
}

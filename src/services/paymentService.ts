import type { PaymentResponse } from '../types/payment';
import { createApiUrl, extractErrorMessage } from './api';

export class PaymentError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PaymentError';
  }
}

export async function submitPayment(
  accessToken: string,
  orderId: string,
  idempotencyKey: string,
): Promise<PaymentResponse> {
  const response = await fetch(createApiUrl('/api/payments'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ orderId, idempotencyKey }),
  });
  if (!response.ok) {
    const message =
      response.status === 503
        ? 'Payment service is temporarily unavailable. Please try again.'
        : await extractErrorMessage(response);
    throw new PaymentError(message);
  }
  const data: unknown = await response.json();
  return data as PaymentResponse;
}

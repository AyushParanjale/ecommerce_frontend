export type PaymentStatus = 'Pending' | 'Succeeded' | 'Failed';

export interface PaymentResponse {
	id: string;
	orderId: string;
	amount: number;
	status: PaymentStatus;
	providerReference: string | null;
	failureReason: string | null;
	createdAt: string;
	updatedAt: string;
}

export interface CartItemResponse {
	id: string;
	productId: string;
	productName: string;
	imageUrl: string | null;
	category: string;
	quantity: number;
	availableStock: number;
	currentUnitPrice: number;
	lineTotal: number;
}

export interface CartResponse {
	id: string;
	userId: string;
	items: CartItemResponse[];
	totalItems: number;
	totalAmount: number;
	createdAt: string;
	updatedAt: string;
}

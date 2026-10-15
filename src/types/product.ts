export interface Product {
	id: string;
	name: string;
	description: string;
	price: number;
	category: string;
	stockQuantity: number;
	imageUrl: string | null;
}

export interface CreateProductRequest {
	name: string;
	description: string;
	price: number;
	category: string;
	stockQuantity: number;
	imageUrl?: string;
}

export type UpdateProductRequest = CreateProductRequest;

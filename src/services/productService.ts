import type { Product } from '../types/product';
import { createApiUrl } from './api';

export async function fetchProducts(): Promise<Product[]> {
	const response = await fetch(createApiUrl('/api/products'));
	if (!response.ok) {
		throw new Error(`Request failed with status ${response.status}`);
	}
	const data: unknown = await response.json();
	return data as Product[];
}

export class NotFoundError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'NotFoundError';
	}
}

export async function fetchProductById(productId: string): Promise<Product> {
	const response = await fetch(createApiUrl(`/api/products/${productId}`));
	if (response.status === 404) {
		throw new NotFoundError(`Product not found.`);
	}
	if (!response.ok) {
		throw new Error(`Request failed with status ${response.status}`);
	}
	const data: unknown = await response.json();
	return data as Product;
}

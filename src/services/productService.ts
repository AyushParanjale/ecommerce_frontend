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

import type { Product } from '../types/product';

export async function fetchProducts(): Promise<Product[]> {
	const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products`);
	if (!response.ok) {
		throw new Error(`Request failed with status ${response.status}`);
	}
	const data: unknown = await response.json();
	return data as Product[];
}

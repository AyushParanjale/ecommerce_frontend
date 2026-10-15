import type { Product, CreateProductRequest, UpdateProductRequest } from '../types/product';
import { createApiUrl, extractProblemDetails } from './api';

export class ApiError extends Error {
	status: number;
	fieldErrors?: Record<string, string[]>;

	constructor(message: string, status: number, fieldErrors?: Record<string, string[]>) {
		super(message);
		this.name = 'ApiError';
		this.status = status;
		this.fieldErrors = fieldErrors;
	}
}

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

export async function createProduct(data: CreateProductRequest, accessToken: string): Promise<Product> {
	const response = await fetch(createApiUrl('/api/products'), {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${accessToken}`,
		},
		body: JSON.stringify(data),
	});
	if (!response.ok) {
		const problem = await extractProblemDetails(response);
		const message = problem.detail ?? problem.title ?? `Request failed with status ${response.status}`;
		throw new ApiError(message, response.status, problem.errors);
	}
	const result: unknown = await response.json();
	return result as Product;
}

export async function updateProduct(id: string, data: UpdateProductRequest, accessToken: string): Promise<Product> {
	const response = await fetch(createApiUrl(`/api/products/${id}`), {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${accessToken}`,
		},
		body: JSON.stringify(data),
	});
	if (!response.ok) {
		const problem = await extractProblemDetails(response);
		const message = problem.detail ?? problem.title ?? `Request failed with status ${response.status}`;
		throw new ApiError(message, response.status, problem.errors);
	}
	const result: unknown = await response.json();
	return result as Product;
}

export async function deleteProduct(id: string, accessToken: string): Promise<void> {
	const response = await fetch(createApiUrl(`/api/products/${id}`), {
		method: 'DELETE',
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	});
	if (!response.ok) {
		const problem = await extractProblemDetails(response);
		const message = problem.detail ?? problem.title ?? `Request failed with status ${response.status}`;
		throw new ApiError(message, response.status);
	}
}

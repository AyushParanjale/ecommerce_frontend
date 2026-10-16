import type { CartResponse } from '../types/cart';
import { createApiUrl, extractErrorMessage } from './api';

export class CartError extends Error {

	constructor(message: string) {
		super(message);
		this.name = 'CartError';
	}
}

export async function fetchCart(accessToken: string): Promise<CartResponse> {

	const response = await fetch(createApiUrl('/api/cart'), {
		headers: { Authorization: `Bearer ${accessToken}` },
	});

	if (!response.ok) {
		const message = await extractErrorMessage(response);
		throw new CartError(message);
	}

	const data: unknown = await response.json();
	return data as CartResponse;
}

export async function addCartItem(
	accessToken: string,
	productId: string,
	quantity: number,
): Promise<CartResponse> {

	const response = await fetch(createApiUrl('/api/cart/items'), {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${accessToken}`,
		},
		body: JSON.stringify({ productId, quantity }),
	});

	if (!response.ok) {
		const message =
			response.status === 409
				? 'Item is already in your cart.'
				: await extractErrorMessage(response);
		throw new CartError(message);
	}

	const data: unknown = await response.json();
	return data as CartResponse;
}

export async function updateCartItem(
	accessToken: string,
	itemId: string,
	quantity: number,
): Promise<CartResponse> {

	const response = await fetch(createApiUrl(`/api/cart/items/${itemId}`), {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${accessToken}`,
		},
		body: JSON.stringify({ quantity }),
	});

	if (!response.ok) {
		const message = await extractErrorMessage(response);
		throw new CartError(message);
	}

	const data: unknown = await response.json();
	return data as CartResponse;
}

export async function removeCartItem(accessToken: string, itemId: string): Promise<void> {

	const response = await fetch(createApiUrl(`/api/cart/items/${itemId}`), {
		method: 'DELETE',
		headers: { Authorization: `Bearer ${accessToken}` },
	});

	if (!response.ok) {
		const message = await extractErrorMessage(response);
		throw new CartError(message);
	}
}

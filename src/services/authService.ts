import type { RegisterRequest, RegisterResponse, LoginRequest, LoginResponse, User } from '../types/auth';
import { createApiUrl, extractErrorMessage } from './api';

export class AuthError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'AuthError';
	}
}

export async function register(request: RegisterRequest): Promise<RegisterResponse> {
	const response = await fetch(createApiUrl('/api/auth/register'), {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(request),
	});
	if (!response.ok) {
		const message = await extractErrorMessage(response);
		throw new AuthError(message);
	}
	const data: unknown = await response.json();
	return data as RegisterResponse;
}

export async function login(request: LoginRequest): Promise<LoginResponse> {
	const response = await fetch(createApiUrl('/api/auth/login'), {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(request),
	});
	if (!response.ok) {
		const message = await extractErrorMessage(response);
		throw new AuthError(message);
	}
	const data: unknown = await response.json();
	return data as LoginResponse;
}

export async function getMe(accessToken: string): Promise<User> {
	const response = await fetch(createApiUrl('/api/auth/me'), {
		headers: { Authorization: `Bearer ${accessToken}` },
	});
	if (!response.ok) {
		const message = await extractErrorMessage(response);
		throw new AuthError(message);
	}
	const data: unknown = await response.json();
	return data as User;
}

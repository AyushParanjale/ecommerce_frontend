export interface RegisterRequest {
	email: string;
	password: string;
	name: string;
}

export interface RegisterResponse {
	id: string;
	email: string;
	name: string;
	role: 'Customer' | 'Admin';
}

export interface LoginRequest {
	email: string;
	password: string;
}

export interface User {
	id: string;
	email: string;
	name: string;
	role: 'Customer' | 'Admin';
}

export interface LoginResponse {
	accessToken: string;
	tokenType: 'Bearer';
	expiresAtUtc: string;
	user: User;
}

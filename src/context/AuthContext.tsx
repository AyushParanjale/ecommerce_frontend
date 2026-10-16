import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { User, LoginRequest } from '../types/auth';
import { login as loginService, getMe } from '../services/authService';

const ACCESS_TOKEN_KEY = 'reprua_access_token';

interface AuthContextValue {
	user: User | null;
	accessToken: string | null;
	isAuthenticated: boolean;
	isRestoringSession: boolean;
	login: (request: LoginRequest) => Promise<void>;
	logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {

	const [user, setUser] = useState<User | null>(null);
	const [accessToken, setAccessToken] = useState<string | null>(null);
	const [isRestoringSession, setIsRestoringSession] = useState(() =>
		Boolean(localStorage.getItem(ACCESS_TOKEN_KEY)),
	);

	useEffect(() => {

		const storedToken = localStorage.getItem(ACCESS_TOKEN_KEY);

		if (!storedToken) {
			return;
		}

		getMe(storedToken)
			.then((fetchedUser) => {
				setUser(fetchedUser);
				setAccessToken(storedToken);
			})
			.catch(() => {
				localStorage.removeItem(ACCESS_TOKEN_KEY);
			})
			.finally(() => {
				setIsRestoringSession(false);
			});
	}, []);

	function doLogin(request: LoginRequest): Promise<void> {

		return loginService(request).then((response) => {
			localStorage.setItem(ACCESS_TOKEN_KEY, response.accessToken);
			setUser(response.user);
			setAccessToken(response.accessToken);
		});
	}

	function logout() {

		localStorage.removeItem(ACCESS_TOKEN_KEY);
		setUser(null);
		setAccessToken(null);
	}

	return (
		<AuthContext.Provider
			value={{
				user,
				accessToken,
				isAuthenticated: user !== null,
				isRestoringSession,
				login: doLogin,
				logout,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth(): AuthContextValue {

	const ctx = useContext(AuthContext);

	if (!ctx) {
		throw new Error('useAuth must be used inside AuthProvider');
	}

	return ctx;
}

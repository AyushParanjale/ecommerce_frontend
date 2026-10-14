import { useState } from 'react';
import { Link, Navigate, useNavigate, useLocation } from 'react-router-dom';
import type { FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import { AuthError } from '../services/authService';

export default function LoginPage() {
	const { isAuthenticated, isRestoringSession, login } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	function doLogin() {
		login({ email, password }).then(
			() => {
				setIsSubmitting(false);
				navigate('/');
			},
			(err: unknown) => {
				setError(
					err instanceof AuthError ? err.message : 'Something went wrong. Please try again.',
				);
				setIsSubmitting(false);
			},
		);
	}

	function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setError(null);
		setIsSubmitting(true);
		doLogin();
	}

	if (isRestoringSession) {
		return (
			<main className="mx-auto flex w-full max-w-md flex-1 items-center justify-center px-6 py-16">
				<p className="text-sm text-slate-500">Loading…</p>
			</main>
		);
	}

	if (isAuthenticated) {
		return <Navigate to="/" replace />;
	}

	const successMessage =
		typeof (location.state as { message?: unknown })?.message === 'string'
			? (location.state as { message: string }).message
			: null;

	return (
		<main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-16">
			<h1 className="mb-2 text-2xl font-bold text-slate-900">Sign in</h1>
			<p className="mb-8 text-sm text-slate-500">
				Don't have an account?{' '}
				<Link to="/register" className="text-blue-600 hover:underline">
					Create one
				</Link>
			</p>

			<form onSubmit={handleSubmit} className="space-y-5" noValidate>
				{successMessage && (
					<div
						role="status"
						className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
					>
						{successMessage}
					</div>
				)}

				{error && (
					<div
						role="alert"
						className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
					>
						{error}
					</div>
				)}

				<div>
					<label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">
						Email
					</label>
					<input
						id="email"
						type="email"
						autoComplete="email"
						required
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition focus:border-blue-500"
					/>
				</div>

				<div>
					<label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-700">
						Password
					</label>
					<input
						id="password"
						type="password"
						autoComplete="current-password"
						required
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition focus:border-blue-500"
					/>
				</div>

				<button
					type="submit"
					disabled={isSubmitting}
					className="w-full rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
				>
					{isSubmitting ? 'Signing in…' : 'Sign in'}
				</button>
			</form>
		</main>
	);
}

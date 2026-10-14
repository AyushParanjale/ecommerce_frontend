import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import type { FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import { register } from '../services/authService';
import { AuthError } from '../services/authService';

export default function RegisterPage() {
	const { isAuthenticated, isRestoringSession } = useAuth();
	const navigate = useNavigate();
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	function doRegister() {
		register({ name, email, password }).then(
			() => {
				setIsSubmitting(false);
				navigate('/login', { state: { message: 'Account created! Please sign in.' } });
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
		doRegister();
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

	return (
		<main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-16">
			<h1 className="mb-2 text-2xl font-bold text-slate-900">Create account</h1>
			<p className="mb-8 text-sm text-slate-500">
				Already have an account?{' '}
				<Link to="/login" className="text-blue-600 hover:underline">
					Sign in
				</Link>
			</p>

			<form onSubmit={handleSubmit} className="space-y-5" noValidate>
				{error && (
					<div
						role="alert"
						className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
					>
						{error}
					</div>
				)}

				<div>
					<label htmlFor="name" className="mb-1 block text-sm font-medium text-slate-700">
						Full name
					</label>
					<input
						id="name"
						type="text"
						autoComplete="name"
						required
						value={name}
						onChange={(e) => setName(e.target.value)}
						className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition focus:border-blue-500"
					/>
				</div>

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
						autoComplete="new-password"
						required
						minLength={8}
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition focus:border-blue-500"
					/>
					<p className="mt-1 text-xs text-slate-400">At least 8 characters</p>
				</div>

				<button
					type="submit"
					disabled={isSubmitting}
					className="w-full rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
				>
					{isSubmitting ? 'Creating account…' : 'Create account'}
				</button>
			</form>
		</main>
	);
}

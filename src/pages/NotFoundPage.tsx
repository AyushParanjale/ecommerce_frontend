import { Link } from 'react-router-dom';

export default function NotFoundPage() {
	return (
		<main className="mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center px-6 py-20 text-center">
			<p className="text-6xl font-bold text-slate-200">404</p>
			<h1 className="mt-4 text-2xl font-bold text-slate-900">Page not found</h1>
			<p className="mt-2 text-slate-500">
				The page you&apos;re looking for doesn&apos;t exist.
			</p>
			<Link
				to="/"
				className="mt-8 inline-block rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
			>
				Back to home
			</Link>
		</main>
	);
}

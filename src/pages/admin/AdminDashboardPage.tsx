import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';

export default function AdminDashboardPage() {
	return (
		<main className="mx-auto max-w-7xl px-6 py-10">
			<h1 className="mb-8 text-2xl font-bold text-slate-900">Admin Dashboard</h1>

			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
				<Link
					to="products"
					className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-blue-300 hover:shadow-md"
				>
					<span className="rounded-lg bg-blue-50 p-3 text-blue-600">
						<Package size={24} aria-hidden="true" />
					</span>
					<div>
						<p className="font-semibold text-slate-900">Manage Products</p>
						<p className="mt-0.5 text-sm text-slate-500">View, create, edit, and delete products</p>
					</div>
				</Link>
			</div>
		</main>
	);
}

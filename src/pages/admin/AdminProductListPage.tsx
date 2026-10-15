import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import type { Product } from '../../types/product';
import { fetchProducts } from '../../services/productService';
import { deleteProduct, ApiError } from '../../services/productService';
import { useAuth } from '../../context/AuthContext';

export default function AdminProductListPage() {
	const { accessToken } = useAuth();
	const [products, setProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(true);
	const [loadError, setLoadError] = useState<string | null>(null);
	const [deletingId, setDeletingId] = useState<string | null>(null);
	const [deleteError, setDeleteError] = useState<string | null>(null);

	function load() {
		setLoading(true);
		setLoadError(null);
		fetchProducts()
			.then((data) => setProducts(data))
			.catch((err: unknown) => {
				setLoadError(err instanceof Error ? err.message : 'Failed to load products.');
			})
			.finally(() => setLoading(false));
	}

	useEffect(() => {
		load();
	}, []);

	async function handleDelete(product: Product) {
		if (!window.confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
		setDeletingId(product.id);
		setDeleteError(null);
		try {
			await deleteProduct(product.id, accessToken!);
			setProducts((prev) => prev.filter((p) => p.id !== product.id));
		} catch (err: unknown) {
			const message =
				err instanceof ApiError
					? err.message
					: err instanceof Error
						? err.message
						: 'Failed to delete product.';
			setDeleteError(message);
		} finally {
			setDeletingId(null);
		}
	}

	return (
		<main className="mx-auto max-w-7xl px-6 py-10">
			<div className="mb-6 flex items-center justify-between">
				<div>
					<Link to="/admin" className="text-sm text-slate-500 hover:text-slate-700 hover:underline">
						← Admin
					</Link>
					<h1 className="mt-1 text-2xl font-bold text-slate-900">Products</h1>
				</div>
				<Link
					to="new"
					className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
				>
					<Plus size={16} aria-hidden="true" />
					Add Product
				</Link>
			</div>

			{deleteError && (
				<div role="alert" className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
					{deleteError}
				</div>
			)}

			{loading && (
				<div aria-live="polite" aria-busy="true" className="py-12 text-center text-slate-500">
					Loading products…
				</div>
			)}

			{!loading && loadError && (
				<div className="py-12 text-center">
					<p className="text-red-600">{loadError}</p>
					<button
						type="button"
						onClick={load}
						className="mt-4 rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
					>
						Retry
					</button>
				</div>
			)}

			{!loading && !loadError && products.length === 0 && (
				<div className="py-12 text-center">
					<p className="text-slate-500">No products found.</p>
					<Link
						to="new"
						className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
					>
						<Plus size={16} aria-hidden="true" />
						Add your first product
					</Link>
				</div>
			)}

			{!loading && !loadError && products.length > 0 && (
				<div className="overflow-x-auto rounded-xl border border-slate-200">
					<table className="w-full text-sm">
						<thead className="bg-slate-50 text-left">
							<tr>
								<th scope="col" className="px-4 py-3 font-semibold text-slate-700">Name</th>
								<th scope="col" className="px-4 py-3 font-semibold text-slate-700">Category</th>
								<th scope="col" className="px-4 py-3 font-semibold text-slate-700">Price</th>
								<th scope="col" className="px-4 py-3 font-semibold text-slate-700">Stock</th>
								<th scope="col" className="px-4 py-3 font-semibold text-slate-700">
									<span className="sr-only">Actions</span>
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-slate-100 bg-white">
							{products.map((product) => (
								<tr key={product.id} className="hover:bg-slate-50">
									<td className="px-4 py-3 font-medium text-slate-900">{product.name}</td>
									<td className="px-4 py-3 text-slate-600">{product.category}</td>
									<td className="px-4 py-3 text-slate-600">${product.price.toFixed(2)}</td>
									<td className="px-4 py-3 text-slate-600">{product.stockQuantity}</td>
									<td className="px-4 py-3">
										<div className="flex items-center justify-end gap-2">
											<Link
												to={`${product.id}/edit`}
												aria-label={`Edit ${product.name}`}
												className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
											>
												<Pencil size={13} aria-hidden="true" />
												Edit
											</Link>
											<button
												type="button"
												onClick={() => handleDelete(product)}
												disabled={deletingId === product.id}
												aria-label={`Delete ${product.name}`}
												className="flex items-center gap-1 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
											>
												<Trash2 size={13} aria-hidden="true" />
												{deletingId === product.id ? 'Deleting…' : 'Delete'}
											</button>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</main>
	);
}

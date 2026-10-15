import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ProductForm from '../../components/admin/ProductForm';
import type { CreateProductRequest } from '../../types/product';
import { createProduct, ApiError } from '../../services/productService';
import { useAuth } from '../../context/AuthContext';

export default function AdminProductCreatePage() {
	const { accessToken } = useAuth();
	const navigate = useNavigate();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [serverError, setServerError] = useState<string | undefined>();
	const [serverFieldErrors, setServerFieldErrors] = useState<Record<string, string[]> | undefined>();

	async function handleSubmit(data: CreateProductRequest) {
		setIsSubmitting(true);
		setServerError(undefined);
		setServerFieldErrors(undefined);
		try {
			await createProduct(data, accessToken!);
			navigate('/admin/products');
		} catch (err: unknown) {
			if (err instanceof ApiError && err.fieldErrors) {
				setServerFieldErrors(err.fieldErrors);
			} else if (err instanceof ApiError && err.status === 403) {
				setServerError('You do not have permission to perform this action.');
			} else {
				setServerError(
					err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.',
				);
			}
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<main className="mx-auto max-w-2xl px-6 py-10">
			<div className="mb-6">
				<Link to="/admin/products" className="text-sm text-slate-500 hover:text-slate-700 hover:underline">
					← Back to Products
				</Link>
				<h1 className="mt-1 text-2xl font-bold text-slate-900">New Product</h1>
			</div>

			<div className="rounded-xl border border-slate-200 bg-white p-6">
				<ProductForm
					onSubmit={handleSubmit}
					isSubmitting={isSubmitting}
					submitLabel="Create Product"
					serverError={serverError}
					serverFieldErrors={serverFieldErrors}
				/>
			</div>
		</main>
	);
}

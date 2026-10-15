import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ProductForm from '../../components/admin/ProductForm';
import type { Product, CreateProductRequest } from '../../types/product';
import { fetchProductById, updateProduct, NotFoundError, ApiError } from '../../services/productService';
import { useAuth } from '../../context/AuthContext';

export default function AdminProductEditPage() {
	const { productId } = useParams<{ productId: string }>();
	const { accessToken } = useAuth();
	const navigate = useNavigate();

	const [product, setProduct] = useState<Product | null>(null);
	const [loadError, setLoadError] = useState<string | null>(null);
	const [notFound, setNotFound] = useState(false);

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [serverError, setServerError] = useState<string | undefined>();
	const [serverFieldErrors, setServerFieldErrors] = useState<Record<string, string[]> | undefined>();

	useEffect(() => {
		if (!productId) return;
		let ignore = false;

		setProduct(null);
		setLoadError(null);
		setNotFound(false);

		fetchProductById(productId)
			.then((p) => {
				if (!ignore) setProduct(p);
			})
			.catch((err: unknown) => {
				if (ignore) return;
				if (err instanceof NotFoundError) {
					setNotFound(true);
				} else {
					setLoadError(err instanceof Error ? err.message : 'Failed to load product.');
				}
			});

		return () => {
			ignore = true;
		};
	}, [productId]);

	async function handleSubmit(data: CreateProductRequest) {
		if (!productId) return;
		setIsSubmitting(true);
		setServerError(undefined);
		setServerFieldErrors(undefined);
		try {
			await updateProduct(productId, data, accessToken!);
			navigate('/admin/products');
		} catch (err: unknown) {
			if (err instanceof ApiError && err.fieldErrors) {
				setServerFieldErrors(err.fieldErrors);
			} else if (err instanceof ApiError && err.status === 403) {
				setServerError('You do not have permission to perform this action.');
			} else if (err instanceof ApiError && err.status === 409) {
				setServerError('This product was updated by someone else. Please reload and try again.');
			} else {
				setServerError(
					err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.',
				);
			}
		} finally {
			setIsSubmitting(false);
		}
	}

	if (notFound) {
		return (
			<main className="mx-auto max-w-2xl px-6 py-16 text-center">
				<p className="text-lg text-slate-700">Product not found.</p>
				<Link to="/admin/products" className="mt-4 inline-block text-blue-600 hover:underline">
					Back to Products
				</Link>
			</main>
		);
	}

	if (loadError) {
		return (
			<main className="mx-auto max-w-2xl px-6 py-16 text-center">
				<p className="text-red-600">{loadError}</p>
				<Link to="/admin/products" className="mt-4 inline-block text-blue-600 hover:underline">
					Back to Products
				</Link>
			</main>
		);
	}

	return (
		<main className="mx-auto max-w-2xl px-6 py-10">
			<div className="mb-6">
				<Link to="/admin/products" className="text-sm text-slate-500 hover:text-slate-700 hover:underline">
					← Back to Products
				</Link>
				<h1 className="mt-1 text-2xl font-bold text-slate-900">Edit Product</h1>
			</div>

			{product === null ? (
				<div aria-live="polite" aria-busy="true" className="py-12 text-center text-slate-500">
					Loading product…
				</div>
			) : (
				<div className="rounded-xl border border-slate-200 bg-white p-6">
					<ProductForm
						initialValues={{
							name: product.name,
							description: product.description,
							price: String(product.price),
							category: product.category,
							stockQuantity: String(product.stockQuantity),
							imageUrl: product.imageUrl ?? '',
						}}
						onSubmit={handleSubmit}
						isSubmitting={isSubmitting}
						submitLabel="Save Changes"
						serverError={serverError}
						serverFieldErrors={serverFieldErrors}
					/>
				</div>
			)}
		</main>
	);
}

import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { Package, ArrowLeft } from 'lucide-react';
import { fetchProductById, NotFoundError } from '../services/productService';
import type { Product } from '../types/product';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function ProductDetailsPage() {

	const { productId } = useParams<{ productId: string }>();
	const [product, setProduct] = useState<Product | null>(null);
	const [loading, setLoading] = useState(true);
	const [notFound, setNotFound] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [imageError, setImageError] = useState(false);
	const [cartError, setCartError] = useState<string | null>(null);
	const { isAuthenticated } = useAuth();
	const { addItem } = useCart();
	const navigate = useNavigate();
	const location = useLocation();

	function loadProduct() {
		if (!productId) return;
		fetchProductById(productId)
			.then((data) => {
				setProduct(data);
				setImageError(false);
				setLoading(false);
			})
			.catch((err: unknown) => {
				if (err instanceof NotFoundError) {
					setNotFound(true);
				} else {
					setError(err instanceof Error ? err.message : 'Something went wrong.');
				}
				setLoading(false);
			});
	}

	function handleRetry() {
		setLoading(true);
		setNotFound(false);
		setError(null);
		loadProduct();
	}

	function handleAddToCart() {
		if (!isAuthenticated) {
			navigate('/login', { state: { from: location } });
			return;
		}
		if (!product) return;
		setCartError(null);
		addItem(product.id, 1).catch((err: unknown) => {
			setCartError(err instanceof Error ? err.message : 'Failed to add to cart.');
		});
	}

	useEffect(() => {
		loadProduct();
	}, [productId]);

	const showFallback = !product?.imageUrl || imageError;

	return (
		<main className="mx-auto w-full max-w-4xl flex-1 px-6 py-10">
			<Link
				to="/"
				className="mb-8 inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800"
			>
				<ArrowLeft size={16} aria-hidden="true" />
				Back to Products
			</Link>

			{loading && (
				<div className="mt-8 animate-pulse">
					<div className="mb-8 aspect-square w-full max-w-md rounded-xl bg-slate-200" />
					<div className="space-y-4">
						<div className="h-4 w-24 rounded bg-slate-200" />
						<div className="h-8 w-3/4 rounded bg-slate-200" />
						<div className="h-4 rounded bg-slate-200" />
						<div className="h-4 w-2/3 rounded bg-slate-200" />
						<div className="mt-4 h-6 w-32 rounded bg-slate-200" />
						<div className="mt-4 h-12 w-48 rounded-lg bg-slate-200" />
					</div>
				</div>
			)}

			{!loading && notFound && (
				<div className="mt-16 text-center">
					<p className="text-xl font-semibold text-slate-900">Product not found</p>
					<p className="mt-2 text-sm text-slate-500">
						This product may have been removed or the link is invalid.
					</p>
					<Link
						to="/"
						className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
					>
						Back to Products
					</Link>
				</div>
			)}

			{!loading && error !== null && (
				<div className="mt-16 text-center">
					<p className="text-xl font-semibold text-slate-900">Failed to load product</p>
					<p className="mt-2 text-sm text-slate-500">{error}</p>
					<button
						type="button"
						onClick={handleRetry}
						className="mt-6 rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
					>
						Retry
					</button>
				</div>
			)}

			{!loading && !notFound && error === null && product !== null && (
				<div className="mt-8 grid gap-10 md:grid-cols-2">
					<div className="aspect-square overflow-hidden rounded-xl bg-slate-100">
						{showFallback ? (
							<div className="flex h-full items-center justify-center text-slate-300">
								<Package size={80} aria-hidden="true" />
							</div>
						) : (
							<img
								src={product.imageUrl!}
								alt={product.name}
								onError={() => setImageError(true)}
								className="h-full w-full object-cover"
							/>
						)}
					</div>

					<div className="flex flex-col">
						<span className="mb-2 text-sm font-medium text-blue-600">
							{product.category}
						</span>
						<h1 className="mb-4 text-3xl font-bold text-slate-900">{product.name}</h1>
						<p className="mb-6 flex-1 text-base text-slate-600">{product.description}</p>

						<div className="mb-6 flex items-baseline gap-4">
							<span className="text-3xl font-bold text-slate-900">
								${product.price.toFixed(2)}
							</span>
							<span
								className={`text-sm font-medium ${product.stockQuantity > 0 ? 'text-green-600' : 'text-red-500'
									}`}
							>
								{product.stockQuantity > 0
									? `${product.stockQuantity} in stock`
									: 'Out of stock'}
							</span>
						</div>

						<button
							type="button"
							onClick={handleAddToCart}
							disabled={product.stockQuantity === 0}
							className="rounded-lg bg-blue-600 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
							aria-label={`Add ${product.name} to cart`}
						>
							Add to Cart
						</button>
						{cartError && (
							<p className="mt-2 text-sm text-red-600">{cartError}</p>
						)}
					</div>
				</div>
			)}
		</main>
	);
}

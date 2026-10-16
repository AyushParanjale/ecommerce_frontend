import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Package } from 'lucide-react';
import type { Product } from '../types/product';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
	product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {

	const [imageError, setImageError] = useState(false);
	const [cartError, setCartError] = useState<string | null>(null);
	const { isAuthenticated } = useAuth();
	const { addItem } = useCart();
	const navigate = useNavigate();
	const location = useLocation();

	const showFallback = !product.imageUrl || imageError;

	function handleAddToCart() {

		if (!isAuthenticated) {
			navigate('/login', { state: { from: location } });
			return;
		}

		setCartError(null);

		addItem(product.id, 1).catch((err: unknown) => {
			setCartError(err instanceof Error ? err.message : 'Failed to add to cart.');
		});
	}

	return (
		<article className="flex flex-col overflow-hidden rounded-lg bg-white shadow-sm transition-shadow hover:shadow-md">
			<Link to={`/products/${product.id}`} className="flex flex-1 flex-col">
				<div className="aspect-[4/3] bg-slate-100">
					{showFallback ? (
						<div className="flex h-full items-center justify-center text-slate-300">
							<Package size={48} aria-hidden="true" />
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

				<div className="flex flex-1 flex-col px-4 pt-4">
					<span className="mb-1 text-xs font-medium text-blue-600">{product.category}</span>
					<h2 className="mb-1 line-clamp-2 text-sm font-semibold text-slate-900">{product.name}</h2>
					<p className="line-clamp-3 flex-1 text-xs text-slate-500">{product.description}</p>
				</div>
			</Link>

			<div className="px-4 pb-4 pt-3">
				<div className="mb-3 flex items-center justify-between">
					<span className="text-lg font-bold text-slate-900">
						${product.price.toFixed(2)}
					</span>
					<span className="text-xs text-slate-500">
						{product.stockQuantity} in stock
					</span>
				</div>

				<button
					type="button"
					onClick={handleAddToCart}
					className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
					aria-label={`Add ${product.name} to cart`}
				>
					Add to cart
				</button>
				{cartError && (
					<p className="mt-2 text-xs text-red-600">{cartError}</p>
				)}
			</div>
		</article>
	);
}

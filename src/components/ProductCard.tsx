import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';
import type { Product } from '../types/product';

interface ProductCardProps {
	product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
	const [imageError, setImageError] = useState(false);

	const showFallback = !product.imageUrl || imageError;

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
					className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
					aria-label={`Add ${product.name} to cart`}
				>
					Add to cart
				</button>
			</div>
		</article>
	);
}

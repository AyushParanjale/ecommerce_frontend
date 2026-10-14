import type { Product } from '../types/product';
import ProductCard from './ProductCard';

interface ProductGridProps {
	products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
	if (products.length === 0) {
		return (
			<div className="py-20 text-center text-slate-500">
				<p className="text-lg font-medium">No products found</p>
				<p className="mt-1 text-sm">Try selecting a different category.</p>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{products.map((product) => (
				<ProductCard key={product.id} product={product} />
			))}
		</div>
	);
}

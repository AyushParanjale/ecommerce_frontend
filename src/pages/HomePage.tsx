import { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import CategoryFilter from '../components/CategoryFilter';
import ProductGrid from '../components/ProductGrid';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import { fetchProducts } from '../services/productService';
import type { Product } from '../types/product';

export default function HomePage() {
	const [products, setProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [selectedCategory, setSelectedCategory] = useState('All');

	function loadProducts() {
		fetchProducts()
			.then((data) => {
				setProducts(data);
				setLoading(false);
			})
			.catch((err: unknown) => {
				setError(err instanceof Error ? err.message : 'Something went wrong.');
				setLoading(false);
			});
	}

	function handleRetry() {
		setLoading(true);
		setError(null);
		loadProducts();
	}

	useEffect(() => {
		loadProducts();
	}, []);

	const categories = ['All', ...Array.from(new Set(products.map((p) => p.category))).sort()];
	const filteredProducts =
		selectedCategory === 'All'
			? products
			: products.filter((p) => p.category === selectedCategory);

	return (
		<>
			<Hero />
			<main id="products" className="mx-auto w-full max-w-7xl flex-1 px-6 py-10">
				{loading && <LoadingState />}

				{!loading && error !== null && (
					<ErrorState message={error} onRetry={handleRetry} />
				)}

				{!loading && error === null && (
					<>
						<h2 className="mb-6 text-2xl font-bold text-slate-900">Products</h2>
						<CategoryFilter
							categories={categories}
							selected={selectedCategory}
							onSelect={setSelectedCategory}
						/>
						<ProductGrid products={filteredProducts} />
					</>
				)}
			</main>
		</>
	);
}

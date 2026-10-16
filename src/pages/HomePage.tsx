import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
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
	const [searchParams, setSearchParams] = useSearchParams();

	function loadProducts() {

		fetchProducts()
			.then((data) => {
				setProducts(data);
				setLoading(false);
				// Remove the category param if it doesn't match any loaded product
				const urlCategory = searchParams.get('category');
				if (urlCategory) {
					const validCategories = data.map((p) => p.category);
					if (!validCategories.includes(urlCategory)) {
						setSearchParams({});
					}
				}
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

	const categoryParam = searchParams.get('category') ?? 'All';
	const categories = ['All', ...Array.from(new Set(products.map((p) => p.category))).sort()];
	// Only use the URL category if it's present in loaded products; otherwise fall back to All
	const selectedCategory = categories.includes(categoryParam) ? categoryParam : 'All';
	const filteredProducts =
		selectedCategory === 'All'
			? products
			: products.filter((p) => p.category === selectedCategory);

	function handleCategorySelect(category: string) {
		if (category === 'All') {
			setSearchParams({});
		} else {
			setSearchParams({ category });
		}
	}

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
							onSelect={handleCategorySelect}
						/>
						<ProductGrid products={filteredProducts} />
					</>
				)}
			</main>
		</>
	);
}

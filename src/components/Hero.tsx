export default function Hero() {
	return (
		<section className="border-b bg-white">
			<div className="mx-auto max-w-7xl px-6 py-16 text-center">
				<h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
					Discover Quality Products
				</h1>
				<p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
					Browse our curated collection of products. From electronics to essentials,
					find everything you need at Reprua.
				</p>
				<a
					href="#products"
					className="mt-8 inline-block rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
				>
					Shop Now
				</a>
			</div>
		</section>
	);
}

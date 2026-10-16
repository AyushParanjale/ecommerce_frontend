export default function LoadingState() {

	return (
		<div
			className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
			aria-label="Loading products"
			aria-busy="true"
		>
			{Array.from({ length: 8 }, (_, i) => (
				<div key={i} className="animate-pulse overflow-hidden rounded-lg bg-white shadow-sm">
					<div className="aspect-[4/3] bg-slate-200" />
					<div className="space-y-3 p-4">
						<div className="h-3 w-1/4 rounded bg-slate-200" />
						<div className="h-4 w-3/4 rounded bg-slate-200" />
						<div className="h-3 rounded bg-slate-200" />
						<div className="h-3 w-2/3 rounded bg-slate-200" />
						<div className="mt-2 h-5 w-1/4 rounded bg-slate-200" />
						<div className="mt-3 h-9 rounded-lg bg-slate-200" />
					</div>
				</div>
			))}
		</div>
	);
}

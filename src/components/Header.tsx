import { ShoppingCart, User } from 'lucide-react';

export default function Header() {
	return (
		<header className="sticky top-0 z-10 border-b bg-white">
			<div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
				<a href="/" className="text-xl font-bold text-slate-900">
					Reprua
				</a>

				<div className="hidden w-full max-w-md md:block">
					<input
						type="text"
						placeholder="Search items..."
						className="w-full rounded-lg border px-4 py-2 outline-none transition focus:border-blue-500"
					/>
				</div>

				<div className="flex items-center gap-4">
					<button
						type="button"
						aria-label="View cart, 0 items"
						className="relative text-slate-700 hover:text-slate-900"
					>
						<ShoppingCart size={22} aria-hidden="true" />
						<span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs text-white">
							0
						</span>
					</button>

					<button
						type="button"
						aria-label="Sign in"
						className="flex items-center gap-1.5 text-sm font-medium text-slate-700 hover:text-slate-900"
					>
						<User size={18} aria-hidden="true" />
						Sign in
					</button>
				</div>
			</div>
		</header>
	);
}

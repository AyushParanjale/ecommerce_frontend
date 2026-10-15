import { Link } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Package } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export default function Header() {
	const { user, isAuthenticated, logout } = useAuth();
	const { cart } = useCart();

	return (
		<header className="sticky top-0 z-10 border-b bg-white">
			<div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
				<Link to="/" className="text-xl font-bold text-slate-900">
					Reprua
				</Link>

				<div className="hidden w-full max-w-md md:block">
					<input
						type="text"
						placeholder="Search items..."
						className="w-full rounded-lg border px-4 py-2 outline-none transition focus:border-blue-500"
					/>
				</div>

				<div className="flex items-center gap-4">
					<Link
						to="/cart"
						aria-label={`View cart, ${cart?.totalItems ?? 0} items`}
						className="relative text-slate-700 hover:text-slate-900"
					>
						<ShoppingCart size={22} aria-hidden="true" />
						<span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs text-white">
							{cart?.totalItems ?? 0}
						</span>
					</Link>

					{isAuthenticated ? (
						<div className="flex items-center gap-3">
							<Link
								to="/orders"
								className="flex items-center gap-1.5 text-sm font-medium text-slate-700 hover:text-slate-900"
								aria-label="My orders"
							>
								<Package size={18} aria-hidden="true" />
								<span className="hidden sm:inline">My Orders</span>
							</Link>
							<span className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
								<User size={18} aria-hidden="true" />
								{user!.name}
							</span>
							<button
								type="button"
								onClick={logout}
								aria-label="Sign out"
								className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900"
							>
								<LogOut size={16} aria-hidden="true" />
								Sign out
							</button>
						</div>
					) : (
						<Link
							to="/login"
							className="flex items-center gap-1.5 text-sm font-medium text-slate-700 hover:text-slate-900"
						>
							<User size={18} aria-hidden="true" />
							Sign in
						</Link>
					)}
				</div>
			</div>
		</header>
	);
}

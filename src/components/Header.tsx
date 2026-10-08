// components/layout/Header.tsx

import { ShoppingCart, User } from "lucide-react";

export default function Header() {
	return (
		<header className="border-b bg-white">
			<div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
				<a href="/">Reprua</a>

				<div className="hidden w-full max-w-md md:block">
					<input
						type="text"
						placeholder="Search items..."
						className="w-full rounded-lg border px-4 py-2 outline-none transition focus:border-blue-500"
					/>
				</div>

				<div className="flex items-center gap-4">
					<button className="relative">
						<ShoppingCart size={22} />
						<span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
							3
						</span>
					</button>

					<button>
						<User size={22} />
					</button>
				</div>
			</div>
		</header >
	);
}

// components/layout/Footer.tsx

export default function Footer() {
	return (
		<footer className="border-t bg-white">
			<div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-6 text-sm text-slate-600 md:flex-row">
				<p>© {new Date().getFullYear()} Reprua. All rights reserved.</p>

				<div className="flex gap-6">
					<a href="/about" className="hover:text-sm">About</a>
					<a href="/contact" className="hover:text-sm">Contact</a>
					<a href="/privacy" className="hover:text-sm">Privacy</a>
				</div>
			</div>
		</footer >
	);
}

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { createOrder, CheckoutError } from '../services/checkoutService';

export default function CheckoutPage() {
	const { accessToken } = useAuth();
	const { cart, isLoading: cartLoading, refetchCart } = useCart();
	const navigate = useNavigate();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!cartLoading && (!cart || cart.items.length === 0)) {
			navigate('/cart', { replace: true });
		}
	}, [cartLoading, cart, navigate]);

	function handlePlaceOrder() {
		if (!accessToken) return;
		setIsSubmitting(true);
		setError(null);
		createOrder(accessToken)
			.then((order) => {
				refetchCart();
				navigate(`/orders/${order.id}/payment`);
			})
			.catch((err: unknown) => {
				setError(
					err instanceof CheckoutError ? err.message : 'Failed to place order. Please try again.',
				);
				setIsSubmitting(false);
			});
	}

	if (cartLoading || !cart) {
		return (
			<main className="mx-auto w-full max-w-4xl flex-1 px-6 py-10">
				<h1 className="mb-8 text-2xl font-bold text-slate-900">Review your order</h1>
				<div className="animate-pulse space-y-4">
					{[1, 2].map((n) => (
						<div key={n} className="flex justify-between rounded-xl border bg-white p-4">
							<div className="h-4 w-48 rounded bg-slate-200" />
							<div className="h-4 w-16 rounded bg-slate-200" />
						</div>
					))}
				</div>
			</main>
		);
	}

	return (
		<main className="mx-auto w-full max-w-4xl flex-1 px-6 py-10">
			<Link
				to="/cart"
				className="mb-8 inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800"
			>
				← Back to Cart
			</Link>

			<h1 className="mb-8 text-2xl font-bold text-slate-900">Review your order</h1>

			<div className="rounded-xl border bg-white">
				<ul className="divide-y">
					{cart.items.map((item) => (
						<li key={item.id} className="flex items-center justify-between px-6 py-4">
							<div>
								<p className="text-sm font-medium text-slate-900">{item.productName}</p>
								<p className="text-xs text-slate-500">
									{item.quantity} × ${item.currentUnitPrice.toFixed(2)}
								</p>
							</div>
							<span className="text-sm font-semibold text-slate-900">
								${item.lineTotal.toFixed(2)}
							</span>
						</li>
					))}
				</ul>

				<div className="flex items-center justify-between border-t px-6 py-4">
					<span className="text-base font-semibold text-slate-900">Total</span>
					<span className="text-xl font-bold text-slate-900">
						${cart.totalAmount.toFixed(2)}
					</span>
				</div>
			</div>

			{error && (
				<div
					role="alert"
					className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
				>
					{error}
				</div>
			)}

			<div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<Link to="/cart" className="text-sm text-blue-600 hover:text-blue-800 hover:underline">
					← Back to Cart
				</Link>
				<button
					type="button"
					onClick={handlePlaceOrder}
					disabled={isSubmitting}
					className="rounded-lg bg-blue-600 px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-500"
				>
					{isSubmitting ? 'Placing order…' : 'Place Order'}
				</button>
			</div>
		</main>
	);
}

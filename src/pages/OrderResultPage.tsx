import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { OrderResponse } from '../types/order';
import type { PaymentResponse } from '../types/payment';
import { fetchOrder, fetchOrderPayment, OrderError } from '../services/orderService';

const PAYMENT_KEY_PREFIX = 'reprua_payment_key_';

export default function OrderResultPage() {
	const { orderId } = useParams<{ orderId: string }>();
	const { accessToken } = useAuth();

	const [order, setOrder] = useState<OrderResponse | null>(null);
	const [payment, setPayment] = useState<PaymentResponse | null | undefined>(undefined);
	const [isLoading, setIsLoading] = useState(true);
	const [loadError, setLoadError] = useState<string | null>(null);
	const [refreshTick, setRefreshTick] = useState(0);

	useEffect(() => {
		if (!accessToken || !orderId) return;
		setIsLoading(true);
		setLoadError(null);
		Promise.all([
			fetchOrder(accessToken, orderId),
			fetchOrderPayment(accessToken, orderId),
		])
			.then(([fetchedOrder, fetchedPayment]) => {
				setOrder(fetchedOrder);
				setPayment(fetchedPayment);
				if (
					fetchedPayment &&
					(fetchedPayment.status === 'Succeeded' || fetchedPayment.status === 'Failed')
				) {
					localStorage.removeItem(`${PAYMENT_KEY_PREFIX}${orderId}`);
				}
			})
			.catch((err: unknown) => {
				setLoadError(
					err instanceof OrderError
						? err.message
						: 'Failed to load order details. Please try again.',
				);
			})
			.finally(() => setIsLoading(false));
	}, [accessToken, orderId, refreshTick]);

	function handleRefresh() {
		setRefreshTick((t) => t + 1);
	}

	if (isLoading) {
		return (
			<main className="mx-auto w-full max-w-4xl flex-1 px-6 py-10">
				<h1 className="mb-8 text-2xl font-bold text-slate-900">Order Result</h1>
				<div className="animate-pulse space-y-4">
					{[1, 2, 3].map((n) => (
						<div key={n} className="flex justify-between rounded-xl border bg-white p-4">
							<div className="h-4 w-48 rounded bg-slate-200" />
							<div className="h-4 w-16 rounded bg-slate-200" />
						</div>
					))}
				</div>
			</main>
		);
	}

	if (loadError || !order) {
		return (
			<main className="mx-auto w-full max-w-4xl flex-1 px-6 py-10">
				<h1 className="mb-8 text-2xl font-bold text-slate-900">Order Result</h1>
				<div className="mt-16 text-center">
					<p className="text-xl font-semibold text-slate-900">Failed to load order</p>
					<p className="mt-2 text-sm text-slate-500">{loadError ?? 'Order not found.'}</p>
					<button
						type="button"
						onClick={handleRefresh}
						className="mt-6 rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
					>
						Try again
					</button>
				</div>
			</main>
		);
	}

	return (
		<main className="mx-auto w-full max-w-4xl flex-1 px-6 py-10">
			<h1 className="mb-8 text-2xl font-bold text-slate-900">Order Result</h1>

			{payment?.status === 'Succeeded' && (
				<div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-6 py-5">
					<p className="text-lg font-semibold text-green-800">Payment successful!</p>
					<p className="mt-1 text-sm text-green-700">
						Your order has been confirmed. Thank you for your purchase.
					</p>
					<Link
						to="/"
						className="mt-4 inline-block rounded-lg bg-green-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
					>
						Continue Shopping
					</Link>
				</div>
			)}

			{payment?.status === 'Failed' && (
				<div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-6 py-5">
					<p className="text-lg font-semibold text-red-800">Payment failed</p>
					{payment.failureReason && (
						<p className="mt-1 text-sm text-red-700">{payment.failureReason}</p>
					)}
					<p className="mt-1 text-sm text-red-600">
						Your cart has been cleared. Please start a new order.
					</p>
					<Link
						to="/"
						className="mt-4 inline-block rounded-lg bg-red-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
					>
						Browse products
					</Link>
				</div>
			)}

			{payment?.status === 'Pending' && (
				<div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-6 py-5">
					<p className="text-lg font-semibold text-amber-800">Payment is being processed</p>
					<p className="mt-1 text-sm text-amber-700">
						Your payment is pending confirmation. Check back shortly.
					</p>
					<button
						type="button"
						onClick={handleRefresh}
						className="mt-4 rounded-lg border border-amber-300 bg-white px-4 py-2 text-sm font-medium text-amber-800 transition-colors hover:bg-amber-50"
					>
						Refresh status
					</button>
				</div>
			)}

			{payment === null && (
				<div className="mb-6 rounded-xl border border-slate-200 bg-slate-50 px-6 py-5">
					<p className="text-lg font-semibold text-slate-800">Payment not yet submitted</p>
					<p className="mt-1 text-sm text-slate-600">
						You haven't submitted payment for this order yet.
					</p>
					<Link
						to={`/orders/${orderId}/payment`}
						className="mt-4 inline-block rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
					>
						Go to payment
					</Link>
				</div>
			)}

			<h2 className="mb-4 text-lg font-semibold text-slate-900">Order details</h2>
			<div className="rounded-xl border bg-white">
				<ul className="divide-y">
					{order.items.map((item) => (
						<li key={item.id} className="flex items-center justify-between px-6 py-4">
							<div>
								<p className="text-sm font-medium text-slate-900">{item.productName}</p>
								<p className="text-xs text-slate-500">
									{item.quantity} × ${item.unitPrice.toFixed(2)}
								</p>
							</div>
							<span className="text-sm font-semibold text-slate-900">
								${item.lineTotal.toFixed(2)}
							</span>
						</li>
					))}
				</ul>
				<div className="flex items-center justify-between border-t px-6 py-4">
					<div>
						<span className="text-base font-semibold text-slate-900">Total</span>
						<p className="text-xs text-slate-500">
							{new Date(order.orderDate).toLocaleDateString()}
						</p>
					</div>
					<span className="text-xl font-bold text-slate-900">${order.totalAmount.toFixed(2)}</span>
				</div>
			</div>
		</main>
	);
}

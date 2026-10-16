import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { OrderResponse } from '../types/order';
import type { PaymentResponse } from '../types/payment';
import { fetchOrder, fetchOrderPayment, OrderError } from '../services/orderService';
import OrderStatusBadge from '../components/OrderStatusBadge';
import PaymentStatusBadge from '../components/PaymentStatusBadge';

export default function OrderDetailsPage() {

	const { orderId } = useParams<{ orderId: string }>();
	const { accessToken } = useAuth();

	const [order, setOrder] = useState<OrderResponse | null>(null);
	const [payment, setPayment] = useState<PaymentResponse | null | undefined>(undefined);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [isRefreshing, setIsRefreshing] = useState(false);

	useEffect(() => {

		if (!accessToken || !orderId) return;

		let cancelled = false;
		setIsLoading(true);
		setError(null);

		Promise.all([
			fetchOrder(accessToken, orderId),
			fetchOrderPayment(accessToken, orderId),
		])
			.then(([fetchedOrder, fetchedPayment]) => {
				if (cancelled) return;
				setOrder(fetchedOrder);
				setPayment(fetchedPayment);
			})
			.catch((err: unknown) => {
				if (cancelled) return;
				setError(
					err instanceof OrderError
						? err.message
						: 'Failed to load order details. Please try again.',
				);
			})
			.finally(() => {
				if (!cancelled) setIsLoading(false);
			});
		return () => {
			cancelled = true;
		};
	}, [accessToken, orderId]);

	function handleRefresh() {

		if (!accessToken || !orderId || isRefreshing) return;

		setIsRefreshing(true);

		Promise.all([
			fetchOrder(accessToken, orderId),
			fetchOrderPayment(accessToken, orderId),
		])
			.then(([fetchedOrder, fetchedPayment]) => {
				setOrder(fetchedOrder);
				setPayment(fetchedPayment);
			})
			.catch((err: unknown) => {
				setError(
					err instanceof OrderError
						? err.message
						: 'Failed to refresh order details. Please try again.',
				);
			})
			.finally(() => setIsRefreshing(false));
	}

	const showRefreshButton =
		order?.status === 'PendingPayment' || payment?.status === 'Pending';

	if (isLoading) {
		return (
			<main className="mx-auto w-full max-w-4xl flex-1 px-6 py-10">
				<h1 className="mb-8 text-2xl font-bold text-slate-900">Order Details</h1>
				<div className="animate-pulse space-y-4">
					{[1, 2, 3, 4].map((n) => (
						<div key={n} className="flex justify-between rounded-xl border bg-white p-4">
							<div className="h-4 w-48 rounded bg-slate-200" />
							<div className="h-4 w-16 rounded bg-slate-200" />
						</div>
					))}
				</div>
			</main>
		);
	}

	if (error || !order) {
		return (
			<main className="mx-auto w-full max-w-4xl flex-1 px-6 py-10">
				<h1 className="mb-8 text-2xl font-bold text-slate-900">Order Details</h1>
				<div className="mt-16 text-center">
					<p className="text-xl font-semibold text-slate-900">Failed to load order</p>
					<p className="mt-2 text-sm text-slate-500">{error ?? 'Order not found.'}</p>
					<Link
						to=".."
						className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
					>
						Back to My Orders
					</Link>
				</div>
			</main>
		);
	}

	return (
		<main className="mx-auto w-full max-w-4xl flex-1 px-6 py-10">
			<div className="mb-6 flex items-center gap-4">
				<Link to=".." className="text-sm font-medium text-blue-600 hover:underline">
					← Back to My Orders
				</Link>
			</div>

			<div className="mb-6 flex flex-wrap items-center gap-3">
				<h1 className="text-2xl font-bold text-slate-900">Order Details</h1>
				<OrderStatusBadge status={order.status} />
				{showRefreshButton && (
					<button
						type="button"
						onClick={handleRefresh}
						disabled={isRefreshing}
						className="ml-auto rounded-lg border border-slate-300 bg-white px-4 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
					>
						{isRefreshing ? 'Refreshing…' : 'Refresh Status'}
					</button>
				)}
			</div>

			<section className="mb-6 rounded-xl border bg-white px-6 py-5">
				<dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:grid-cols-3">
					<div>
						<dt className="text-xs text-slate-500">Order ID</dt>
						<dd className="font-medium text-slate-900 break-all">{order.id}</dd>
					</div>
					<div>
						<dt className="text-xs text-slate-500">Date</dt>
						<dd className="font-medium text-slate-900">
							{new Date(order.orderDate).toLocaleDateString(undefined, {
								year: 'numeric',
								month: 'long',
								day: 'numeric',
							})}
						</dd>
					</div>
					<div>
						<dt className="text-xs text-slate-500">Status</dt>
						<dd>
							<OrderStatusBadge status={order.status} />
						</dd>
					</div>
				</dl>
			</section>

			<section className="mb-6">
				<h2 className="mb-3 text-base font-semibold text-slate-900">Items</h2>
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
						<span className="text-base font-semibold text-slate-900">Total</span>
						<span className="text-xl font-bold text-slate-900">
							${order.totalAmount.toFixed(2)}
						</span>
					</div>
				</div>
			</section>

			<section>
				<h2 className="mb-3 text-base font-semibold text-slate-900">Payment</h2>

				{payment === undefined && (
					<div className="rounded-xl border bg-white px-6 py-5">
						<p className="text-sm text-slate-500">Loading payment…</p>
					</div>
				)}

				{payment === null && (
					<div className="rounded-xl border bg-white px-6 py-5">
						<p className="text-sm text-slate-600">No payment has been made for this order yet.</p>
						{order.status === 'PendingPayment' && (
							<Link
								to="payment"
								className="mt-4 inline-block rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
							>
								Continue to Payment
							</Link>
						)}
					</div>
				)}

				{payment != null && (
					<div className="rounded-xl border bg-white px-6 py-5">
						<div className="mb-4 flex items-center gap-3">
							<PaymentStatusBadge status={payment.status} />
							<span className="text-lg font-bold text-slate-900">
								${payment.amount.toFixed(2)}
							</span>
						</div>
						<dl className="space-y-2 text-sm">
							{payment.providerReference && (
								<div>
									<dt className="text-xs text-slate-500">Provider Reference</dt>
									<dd className="font-medium text-slate-900">{payment.providerReference}</dd>
								</div>
							)}
							{payment.failureReason && (
								<div>
									<dt className="text-xs text-slate-500">Failure Reason</dt>
									<dd className="font-medium text-red-700">{payment.failureReason}</dd>
								</div>
							)}
							<div className="grid grid-cols-2 gap-x-4">
								<div>
									<dt className="text-xs text-slate-500">Created</dt>
									<dd className="font-medium text-slate-900">
										{new Date(payment.createdAt).toLocaleString()}
									</dd>
								</div>
								<div>
									<dt className="text-xs text-slate-500">Updated</dt>
									<dd className="font-medium text-slate-900">
										{new Date(payment.updatedAt).toLocaleString()}
									</dd>
								</div>
							</div>
						</dl>
					</div>
				)}
			</section>
		</main>
	);
}

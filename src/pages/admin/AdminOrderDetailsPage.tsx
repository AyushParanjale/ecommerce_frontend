import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getAdminOrders, OrderError } from '../../services/orderService';
import OrderStatusBadge from '../../components/OrderStatusBadge';
import type { OrderResponse } from '../../types/order';

function formatDate(iso: string): string {
	return new Date(iso).toLocaleDateString(undefined, {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	});
}

function formatCurrency(amount: number): string {
	return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(amount);
}

export default function AdminOrderDetailsPage() {
	const { orderId } = useParams<{ orderId: string }>();
	const { accessToken } = useAuth();

	const [order, setOrder] = useState<OrderResponse | null>(null);
	const [notFound, setNotFound] = useState(false);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [isRefreshing, setIsRefreshing] = useState(false);

	useEffect(() => {
		if (!orderId) return;

		let ignored = false;
		setLoading(true);
		setError(null);
		setNotFound(false);
		setOrder(null);

		// No admin single-order endpoint exists; GET /api/orders/{id} enforces ownership
		// and would 403 for orders owned by other users. Fetching all orders and filtering
		// is the only documented option for admin access to a specific order.
		getAdminOrders(accessToken!)
			.then((orders) => {
				if (ignored) return;
				const found = orders.find((o) => o.id === orderId) ?? null;
				if (found) {
					setOrder(found);
				} else {
					setNotFound(true);
				}
			})
			.catch((err: unknown) => {
				if (ignored) return;
				if (err instanceof OrderError) {
					setError(err.message);
				} else {
					setError('An unexpected error occurred.');
				}
			})
			.finally(() => {
				if (!ignored) setLoading(false);
			});

		return () => {
			ignored = true;
		};
	}, [accessToken, orderId]);

	function handleRefresh() {
		if (!orderId || isRefreshing) return;
		setIsRefreshing(true);
		setError(null);

		getAdminOrders(accessToken!)
			.then((orders) => {
				const found = orders.find((o) => o.id === orderId) ?? null;
				if (found) {
					setOrder(found);
					setNotFound(false);
				} else {
					setNotFound(true);
				}
			})
			.catch((err: unknown) => {
				setError(
					err instanceof OrderError
						? err.message
						: 'Failed to refresh order. Please try again.',
				);
			})
			.finally(() => setIsRefreshing(false));
	}

	if (loading) {
		return (
			<main className="mx-auto max-w-4xl px-6 py-10" aria-live="polite" aria-busy="true">
				<h1 className="mb-8 text-2xl font-bold text-slate-900">Order Details</h1>
				<div className="animate-pulse space-y-4">
					{[1, 2, 3].map((n) => (
						<div key={n} className="rounded-xl border bg-white p-4">
							<div className="h-4 w-48 rounded bg-slate-200" />
						</div>
					))}
				</div>
			</main>
		);
	}

	if (error && !notFound) {
		const is403 = error.toLowerCase().includes('403') || error.toLowerCase().includes('permission') || error.toLowerCase().includes('forbidden');
		return (
			<main className="mx-auto max-w-4xl px-6 py-10">
				<h1 className="mb-8 text-2xl font-bold text-slate-900">Order Details</h1>
				<div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
					<p className="font-semibold text-red-700">
						{is403
							? 'You do not have permission to view orders.'
							: 'Failed to load order'}
					</p>
					{!is403 && <p className="mt-1 text-sm text-red-600">{error}</p>}
					<Link
						to=".."
						className="mt-4 inline-block text-sm font-medium text-blue-600 hover:underline"
					>
						Back to Orders
					</Link>
				</div>
			</main>
		);
	}

	if (notFound || !order) {
		return (
			<main className="mx-auto max-w-4xl px-6 py-10">
				<h1 className="mb-8 text-2xl font-bold text-slate-900">Order Details</h1>
				<div className="mt-16 text-center">
					<p className="text-xl font-semibold text-slate-900">Order not found</p>
					<Link
						to=".."
						className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700"
					>
						Back to Orders
					</Link>
				</div>
			</main>
		);
	}

	return (
		<main className="mx-auto max-w-4xl px-6 py-10">
			<div className="mb-6 flex items-center justify-between">
				<Link to=".." className="text-sm font-medium text-blue-600 hover:underline">
					← Back to Orders
				</Link>
				<button
					type="button"
					onClick={handleRefresh}
					disabled={isRefreshing}
					className="rounded-lg border border-slate-300 bg-white px-4 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
				>
					{isRefreshing ? 'Refreshing…' : 'Refresh'}
				</button>
			</div>

			{error && (
				<div role="alert" className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
					{error}
				</div>
			)}

			<div className="mb-6 flex flex-wrap items-center gap-3">
				<h1 className="text-2xl font-bold text-slate-900">Order Details</h1>
				<OrderStatusBadge status={order.status} />
			</div>

			<section className="mb-6 rounded-xl border bg-white px-6 py-5">
				<dl className="grid grid-cols-1 gap-x-4 gap-y-3 text-sm sm:grid-cols-2">
					<div>
						<dt className="text-xs text-slate-500">Order ID</dt>
						<dd className="break-all font-medium text-slate-900">{order.id}</dd>
					</div>
					<div>
						<dt className="text-xs text-slate-500">Date</dt>
						<dd className="font-medium text-slate-900">{formatDate(order.orderDate)}</dd>
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
				<div className="overflow-x-auto rounded-xl border bg-white">
					<table className="min-w-full divide-y divide-slate-200 text-sm">
						<thead className="bg-slate-50">
							<tr>
								<th scope="col" className="px-4 py-3 text-left font-semibold text-slate-600">
									Item
								</th>
								<th scope="col" className="px-4 py-3 text-right font-semibold text-slate-600">
									Unit Price
								</th>
								<th scope="col" className="px-4 py-3 text-right font-semibold text-slate-600">
									Qty
								</th>
								<th scope="col" className="px-4 py-3 text-right font-semibold text-slate-600">
									Line Total
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-slate-100">
							{order.items.map((item) => (
								<tr key={item.id}>
									<td className="px-4 py-3 font-medium text-slate-900">{item.productName}</td>
									<td className="px-4 py-3 text-right text-slate-600">
										{formatCurrency(item.unitPrice)}
									</td>
									<td className="px-4 py-3 text-right text-slate-600">{item.quantity}</td>
									<td className="px-4 py-3 text-right font-semibold text-slate-900">
										{formatCurrency(item.lineTotal)}
									</td>
								</tr>
							))}
						</tbody>
						<tfoot>
							<tr className="border-t-2 border-slate-200">
								<td colSpan={3} className="px-4 py-4 text-right font-semibold text-slate-900">
									Total
								</td>
								<td className="px-4 py-4 text-right text-xl font-bold text-slate-900">
									{formatCurrency(order.totalAmount)}
								</td>
							</tr>
						</tfoot>
					</table>
				</div>
			</section>
		</main>
	);
}

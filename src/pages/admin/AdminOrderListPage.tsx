import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getAdminOrders, OrderError } from '../../services/orderService';
import OrderStatusBadge from '../../components/OrderStatusBadge';
import type { OrderResponse, OrderStatus } from '../../types/order';

const ORDER_STATUSES: OrderStatus[] = ['PendingPayment', 'Confirmed', 'PaymentFailed', 'Cancelled'];

function isValidStatus(value: string): value is OrderStatus {
	return (ORDER_STATUSES as string[]).includes(value);
}

function formatDate(iso: string): string {
	return new Date(iso).toLocaleDateString(undefined, {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
	});
}

function formatCurrency(amount: number): string {
	return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(amount);
}

export default function AdminOrderListPage() {
	const { accessToken } = useAuth();
	const [searchParams, setSearchParams] = useSearchParams();
	const [orders, setOrders] = useState<OrderResponse[] | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const rawStatus = searchParams.get('status') ?? '';
	const activeStatus: OrderStatus | null = isValidStatus(rawStatus) ? rawStatus : null;

	function loadOrders() {
		setLoading(true);
		setError(null);
		getAdminOrders(accessToken!)
			.then((data) => {
				// Sort newest-first; endpoints.md documents no ordering for GET /api/admin/orders
				const sorted = [...data].sort(
					(a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime(),
				);
				setOrders(sorted);
			})
			.catch((err: unknown) => {
				if (err instanceof OrderError) {
					setError(err.message);
				} else {
					setError('An unexpected error occurred.');
				}
			})
			.finally(() => setLoading(false));
	}

	useEffect(() => {
		loadOrders();
	}, []);

	const filteredOrders = orders
		? activeStatus
			? orders.filter((o) => o.status === activeStatus)
			: orders
		: [];

	return (
		<main className="mx-auto max-w-7xl px-6 py-10">
			<h1 className="mb-6 text-2xl font-bold text-slate-900">All Orders</h1>

			<div className="mb-6 flex items-center gap-3">
				<label htmlFor="status-filter" className="text-sm font-medium text-slate-700">
					Filter by status
				</label>
				<select
					id="status-filter"
					value={activeStatus ?? ''}
					onChange={(e) => {
						const val = e.target.value;
						if (val) {
							setSearchParams({ status: val });
						} else {
							setSearchParams({});
						}
					}}
					className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
				>
					<option value="">All</option>
					{ORDER_STATUSES.map((s) => (
						<option key={s} value={s}>
							{s.replace(/([A-Z])/g, ' $1').trim()}
						</option>
					))}
				</select>
			</div>

			{loading && (
				<div aria-live="polite" aria-busy="true" className="py-12 text-center text-slate-500">
					Loading orders…
				</div>
			)}

			{!loading && error && (
				<div role="alert" className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
					<p className="font-medium">Failed to load orders</p>
					<p className="mt-1 text-sm">{error}</p>
					<button
						onClick={loadOrders}
						className="mt-3 rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
					>
						Retry
					</button>
				</div>
			)}

			{!loading && !error && orders !== null && orders.length === 0 && (
				<p className="py-12 text-center text-slate-500">No orders yet.</p>
			)}

			{!loading && !error && orders !== null && orders.length > 0 && filteredOrders.length === 0 && (
				<div className="py-12 text-center">
					<p className="text-slate-500">No orders match this status.</p>
					<button
						onClick={() => setSearchParams({})}
						className="mt-3 text-sm font-medium text-blue-600 hover:underline"
					>
						Show all orders
					</button>
				</div>
			)}

			{!loading && !error && filteredOrders.length > 0 && (
				<div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
					<table className="min-w-full divide-y divide-slate-200 text-sm">
						<thead className="bg-slate-50">
							<tr>
								<th scope="col" className="px-4 py-3 text-left font-semibold text-slate-600">
									Order ID
								</th>
								<th scope="col" className="px-4 py-3 text-left font-semibold text-slate-600">
									Date
								</th>
								<th scope="col" className="px-4 py-3 text-left font-semibold text-slate-600">
									Status
								</th>
								<th scope="col" className="px-4 py-3 text-right font-semibold text-slate-600">
									Items
								</th>
								<th scope="col" className="px-4 py-3 text-right font-semibold text-slate-600">
									Total
								</th>
								<th scope="col" className="px-4 py-3 text-left font-semibold text-slate-600">
									<span className="sr-only">Actions</span>
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-slate-100">
							{filteredOrders.map((order) => (
								<tr key={order.id} className="hover:bg-slate-50">
									<td className="px-4 py-3 font-mono text-slate-700">
										<span aria-hidden="true">{order.id.slice(0, 8)}…</span>
										<span className="sr-only">{order.id}</span>
									</td>
									<td className="px-4 py-3 text-slate-600">{formatDate(order.orderDate)}</td>
									<td className="px-4 py-3">
										<OrderStatusBadge status={order.status} />
									</td>
									<td className="px-4 py-3 text-right text-slate-600">
										{order.items.reduce((sum, item) => sum + item.quantity, 0)}
									</td>
									<td className="px-4 py-3 text-right text-slate-700">
										{formatCurrency(order.totalAmount)}
									</td>
									<td className="px-4 py-3">
										<Link
											to={order.id}
											className="text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
											aria-label={`View order ${order.id}`}
										>
											View
										</Link>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</main>
	);
}

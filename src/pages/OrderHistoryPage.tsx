import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { OrderResponse } from '../types/order';
import { getMyOrders, OrderError } from '../services/orderService';
import OrderStatusBadge from '../components/OrderStatusBadge';

export default function OrderHistoryPage() {
  const { accessToken } = useAuth();
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function load() {
    if (!accessToken) return;
    setIsLoading(true);
    setError(null);
    getMyOrders(accessToken)
      .then((data) => {
        setOrders(data);
      })
      .catch((err: unknown) => {
        setError(
          err instanceof OrderError ? err.message : 'Failed to load orders. Please try again.',
        );
      })
      .finally(() => setIsLoading(false));
  }

  useEffect(() => {
    load();
  }, [accessToken]);

  if (isLoading) {
    return (
      <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-10">
        <h1 className="mb-8 text-2xl font-bold text-slate-900">My Orders</h1>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="rounded-xl border bg-white p-4">
              <div className="mb-2 h-4 w-48 rounded bg-slate-200" />
              <div className="h-4 w-32 rounded bg-slate-200" />
            </div>
          ))}
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-10">
        <h1 className="mb-8 text-2xl font-bold text-slate-900">My Orders</h1>
        <div className="mt-16 text-center">
          <p className="text-xl font-semibold text-slate-900">Failed to load orders</p>
          <p className="mt-2 text-sm text-slate-500">{error}</p>
          <button
            type="button"
            onClick={load}
            className="mt-6 rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            Try again
          </button>
        </div>
      </main>
    );
  }

  if (orders.length === 0) {
    return (
      <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-10">
        <h1 className="mb-8 text-2xl font-bold text-slate-900">My Orders</h1>
        <div className="mt-16 text-center">
          <p className="text-xl font-semibold text-slate-900">No orders yet</p>
          <p className="mt-2 text-sm text-slate-500">
            You haven't placed any orders. Start shopping to see them here.
          </p>
          <Link
            to="/"
            className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-10">
      <h1 className="mb-8 text-2xl font-bold text-slate-900">My Orders</h1>
      <ul className="space-y-4">
        {orders.map((order) => {
          const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
          const shortId = order.id.slice(0, 8);
          return (
            <li key={order.id}>
              <Link
                to={order.id}
                className="block rounded-xl border bg-white p-5 transition-shadow hover:shadow-md"
                aria-label={`Order ${order.id}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900" aria-hidden="true">
                      Order <span>#{shortId}…</span>
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {new Date(order.orderDate).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {itemCount} {itemCount === 1 ? 'item' : 'items'}
                    </p>
                  </div>
                  <div className="flex flex-shrink-0 flex-col items-end gap-2">
                    <OrderStatusBadge status={order.status} />
                    <span className="text-base font-bold text-slate-900">
                      ${order.totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </main>
  );
}

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';
import { useCart } from '../context/CartContext';
import type { CartItemResponse } from '../types/cart';

function CartItem({
  item,
  onUpdateQuantity,
  onRemove,
}: {
  item: CartItemResponse;
  onUpdateQuantity: (id: string, qty: number) => Promise<void>;
  onRemove: (id: string) => Promise<void>;
}) {
  const [imageError, setImageError] = useState(false);
  const showFallback = !item.imageUrl || imageError;

  function handleDecrement() {
    if (item.quantity === 1) {
      onRemove(item.id);
    } else {
      onUpdateQuantity(item.id, item.quantity - 1);
    }
  }

  function handleIncrement() {
    if (item.quantity < item.availableStock) {
      onUpdateQuantity(item.id, item.quantity + 1);
    }
  }

  return (
    <li className="flex gap-4 rounded-xl border bg-white p-4">
      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100">
        {showFallback ? (
          <div className="flex h-full items-center justify-center text-slate-300">
            <Package size={32} aria-hidden="true" />
          </div>
        ) : (
          <img
            src={item.imageUrl!}
            alt={item.productName}
            onError={() => setImageError(true)}
            className="h-full w-full object-cover"
          />
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1">
        <span className="text-xs font-medium text-blue-600">{item.category}</span>
        <p className="text-sm font-semibold text-slate-900">{item.productName}</p>
        <p className="text-sm text-slate-500">${item.currentUnitPrice.toFixed(2)} each</p>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleDecrement}
          aria-label="Decrease quantity"
          className="flex h-8 w-8 items-center justify-center rounded-lg border text-slate-600 hover:bg-slate-50"
        >
          −
        </button>
        <span className="w-6 text-center text-sm font-medium text-slate-900">
          {item.quantity}
        </span>
        <button
          type="button"
          onClick={handleIncrement}
          disabled={item.quantity >= item.availableStock}
          aria-label="Increase quantity"
          className="flex h-8 w-8 items-center justify-center rounded-lg border text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-300"
        >
          +
        </button>
      </div>

      <div className="flex flex-col items-end justify-between">
        <span className="text-sm font-semibold text-slate-900">${item.lineTotal.toFixed(2)}</span>
        <button
          type="button"
          onClick={() => onRemove(item.id)}
          aria-label={`Remove ${item.productName} from cart`}
          className="text-xs text-slate-400 hover:text-red-500"
        >
          Remove
        </button>
      </div>
    </li>
  );
}

export default function CartPage() {
  const { cart, isLoading, error, updateItemQuantity, removeItem, refetchCart } = useCart();

  if (isLoading) {
    return (
      <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-10">
        <h1 className="mb-8 text-2xl font-bold text-slate-900">Your Cart</h1>
        <ul className="animate-pulse space-y-4">
          {[1, 2, 3].map((n) => (
            <li key={n} className="flex gap-4 rounded-xl border bg-white p-4">
              <div className="h-20 w-20 rounded-lg bg-slate-200" />
              <div className="flex flex-1 flex-col gap-2 pt-1">
                <div className="h-3 w-16 rounded bg-slate-200" />
                <div className="h-4 w-48 rounded bg-slate-200" />
                <div className="h-3 w-24 rounded bg-slate-200" />
              </div>
            </li>
          ))}
        </ul>
      </main>
    );
  }

  if (error !== null) {
    return (
      <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-10">
        <h1 className="mb-8 text-2xl font-bold text-slate-900">Your Cart</h1>
        <div className="mt-16 text-center">
          <p className="text-xl font-semibold text-slate-900">Failed to load cart</p>
          <p className="mt-2 text-sm text-slate-500">{error}</p>
          <button
            type="button"
            onClick={refetchCart}
            className="mt-6 rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            Try again
          </button>
        </div>
      </main>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-10">
        <h1 className="mb-8 text-2xl font-bold text-slate-900">Your Cart</h1>
        <div className="mt-16 text-center">
          <p className="text-xl font-semibold text-slate-900">Your cart is empty</p>
          <p className="mt-2 text-sm text-slate-500">
            Add items from the product catalogue to get started.
          </p>
          <Link
            to="/"
            className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            Browse products
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-10">
      <h1 className="mb-8 text-2xl font-bold text-slate-900">
        Your Cart ({cart.totalItems} {cart.totalItems === 1 ? 'item' : 'items'})
      </h1>

      <ul className="space-y-4">
        {cart.items.map((item) => (
          <CartItem
            key={item.id}
            item={item}
            onUpdateQuantity={updateItemQuantity}
            onRemove={removeItem}
          />
        ))}
      </ul>

      <div className="mt-8 border-t pt-6">
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-slate-900">Total</span>
          <span className="text-2xl font-bold text-slate-900">
            ${cart.totalAmount.toFixed(2)}
          </span>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link to="/" className="text-sm text-blue-600 hover:text-blue-800 hover:underline">
            ← Continue shopping
          </Link>
          <button
            type="button"
            disabled
            className="rounded-lg bg-slate-300 px-8 py-3 text-sm font-medium text-slate-500 cursor-not-allowed"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </main>
  );
}

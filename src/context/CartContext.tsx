import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { CartResponse } from '../types/cart';
import { useAuth } from './AuthContext';
import {
  fetchCart,
  addCartItem,
  updateCartItem,
  removeCartItem,
} from '../services/cartService';

interface CartContextValue {
  cart: CartResponse | null;
  isLoading: boolean;
  error: string | null;
  addItem: (productId: string, quantity: number) => Promise<void>;
  updateItemQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  refetchCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, accessToken } = useAuth();
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function loadCart() {
    if (!accessToken) return;
    setIsLoading(true);
    setError(null);
    fetchCart(accessToken)
      .then((data) => {
        setCart(data);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Failed to load cart.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  useEffect(() => {
    if (isAuthenticated && accessToken) {
      loadCart();
    } else {
      setCart(null);
      setError(null);
    }
  }, [isAuthenticated, accessToken]);

  function addItem(productId: string, quantity: number): Promise<void> {
    if (!accessToken) return Promise.reject(new Error('Not authenticated.'));
    return addCartItem(accessToken, productId, quantity).then((updatedCart) => {
      setCart(updatedCart);
    });
  }

  function updateItemQuantity(itemId: string, quantity: number): Promise<void> {
    if (!accessToken) return Promise.reject(new Error('Not authenticated.'));
    return updateCartItem(accessToken, itemId, quantity).then((updatedCart) => {
      setCart(updatedCart);
    });
  }

  function removeItem(itemId: string): Promise<void> {
    if (!accessToken) return Promise.reject(new Error('Not authenticated.'));
    return removeCartItem(accessToken, itemId).then(() => {
      loadCart();
    });
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        error,
        addItem,
        updateItemQuantity,
        removeItem,
        refetchCart: loadCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}

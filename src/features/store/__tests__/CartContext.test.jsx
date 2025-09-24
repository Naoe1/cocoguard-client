import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { CartProvider, useCart } from '../context/CartContext';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn(), info: vi.fn() },
}));

const wrapperWithParams = ({ children, initialEntries = ['/market/42'] }) => (
  <MemoryRouter initialEntries={initialEntries}>
    <Routes>
      <Route
        path="/market/:marketId"
        element={<CartProvider>{children}</CartProvider>}
      />
    </Routes>
  </MemoryRouter>
);

describe('CartContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('adds and persists items in cart', () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: wrapperWithParams,
    });

    const product = {
      id: 1,
      price: 10,
      amount_to_sell: 5,
      inventory: { name: 'Coconut' },
    };

    act(() => {
      result.current.addToCart(product, 2);
    });

    expect(result.current.cartItems).toHaveLength(1);
    expect(result.current.cartCount).toBe(2);
    expect(result.current.cartTotal).toBe(20);

    const stored = JSON.parse(localStorage.getItem('cocoguard_cart_42'));
    expect(stored).toBeTruthy();
    expect(stored[0].quantity).toBe(2);
  });

  it('updates quantity and removes item', () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: wrapperWithParams,
    });

    const product = {
      id: 5,
      price: 7,
      amount_to_sell: 10,
      inventory: { name: 'Oil' },
    };

    act(() => {
      result.current.addToCart(product, 1);
    });

    act(() => {
      result.current.updateQuantity(5, 3);
    });

    expect(result.current.cartCount).toBe(3);
    expect(result.current.cartTotal).toBe(21);

    act(() => {
      result.current.removeFromCart(5);
    });

    expect(result.current.cartItems).toHaveLength(0);
  });

  it('addToCart merges existing item (increments)', () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: wrapperWithParams,
    });

    const product = {
      id: 9,
      price: 3,
      amount_to_sell: 10,
      inventory: { name: 'Juice' },
    };

    act(() => {
      result.current.addToCart(product, 1);
    });
    act(() => {
      result.current.addToCart(product, 2);
    });

    expect(result.current.cartItems).toHaveLength(1);
    expect(result.current.cartCount).toBe(3);
    expect(result.current.cartTotal).toBe(9);

    const stored = JSON.parse(localStorage.getItem('cocoguard_cart_42'));
    expect(stored).toBeTruthy();
    expect(stored).toHaveLength(1);
    expect(stored[0].quantity).toBe(3);
  });

  it('removeFromCart removes item', () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: wrapperWithParams,
    });

    const product = {
      id: 13,
      price: 6,
      amount_to_sell: 5,
      inventory: { name: 'Butter' },
    };

    act(() => {
      result.current.addToCart(product, 1);
    });

    expect(result.current.cartItems).toHaveLength(1);

    act(() => {
      result.current.removeFromCart(13);
    });

    expect(result.current.cartItems).toHaveLength(0);
    expect(result.current.cartCount).toBe(0);
    expect(result.current.cartTotal).toBe(0);

    const stored = localStorage.getItem('cocoguard_cart_42');
    expect(stored === null || JSON.parse(stored).length === 0).toBe(true);
  });

  it('clearCart empties state', () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: wrapperWithParams,
    });

    const item = {
      id: 12,
      price: 4,
      amount_to_sell: 8,
      inventory: { name: 'Milk' },
    };

    act(() => {
      result.current.addToCart(item, 2);
    });

    expect(result.current.cartCount).toBe(2);
    expect(result.current.cartItems).toHaveLength(1);

    act(() => {
      result.current.clearCart();
    });

    expect(result.current.cartItems).toHaveLength(0);
    expect(result.current.cartCount).toBe(0);
    expect(result.current.cartTotal).toBe(0);

    const stored = localStorage.getItem('cocoguard_cart_42');
    expect(stored === null || JSON.parse(stored).length === 0).toBe(true);
  });

  it('cartCount sums quantities correctly', () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: wrapperWithParams,
    });

    const productA = {
      id: 101,
      price: 2,
      amount_to_sell: 100,
      inventory: { name: 'A' },
    };
    const productB = {
      id: 102,
      price: 5,
      amount_to_sell: 100,
      inventory: { name: 'B' },
    };

    act(() => {
      result.current.addToCart(productA, 3);
    });
    act(() => {
      result.current.addToCart(productB, 4);
    });
    act(() => {
      result.current.addToCart(productA, 2);
    });

    expect(result.current.cartItems).toHaveLength(2);
    expect(result.current.cartCount).toBe(9);
  });

  it('cartTotal sums price × quantity correctly', () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: wrapperWithParams,
    });

    const productA = {
      id: 201,
      price: 4,
      amount_to_sell: 10,
      inventory: { name: 'A' },
    };
    const productB = {
      id: 202,
      price: 7,
      amount_to_sell: 10,
      inventory: { name: 'B' },
    };

    act(() => {
      result.current.addToCart(productA, 2); // 8
    });
    act(() => {
      result.current.addToCart(productB, 3); // 21
    });
    act(() => {
      result.current.addToCart(productA, 1); // +4 -> productA total 12
    });

    expect(result.current.cartItems).toHaveLength(2);
    expect(result.current.cartTotal).toBe(33); // 12 + 21

    act(() => {
      result.current.updateQuantity(202, 1); // productB 7
    });

    expect(result.current.cartTotal).toBe(19); // 12 + 7
  });
});

import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import type { CartLine } from '@/types';
import { readStore, writeStore, STORE_KEYS } from '@/lib/storage';

interface CartState {
  lines: CartLine[];
}

type CartAction =
  | { type: 'ADD'; line: CartLine }
  | { type: 'REMOVE'; lineId: string }
  | { type: 'SET_QUANTITY'; lineId: string; quantity: number }
  | { type: 'CLEAR' };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD': {
      const existing = state.lines.find((l) => l.id === action.line.id);
      if (existing) {
        return {
          lines: state.lines.map((l) =>
            l.id === action.line.id ? { ...l, quantity: l.quantity + action.line.quantity } : l
          ),
        };
      }
      return { lines: [...state.lines, action.line] };
    }
    case 'REMOVE':
      return { lines: state.lines.filter((l) => l.id !== action.lineId) };
    case 'SET_QUANTITY':
      return {
        lines: state.lines.map((l) =>
          l.id === action.lineId ? { ...l, quantity: Math.max(1, action.quantity) } : l
        ),
      };
    case 'CLEAR':
      return { lines: [] };
    default:
      return state;
  }
}

interface CartContextValue {
  lines: CartLine[];
  addLine: (line: CartLine) => void;
  removeLine: (lineId: string) => void;
  setQuantity: (lineId: string, quantity: number) => void;
  clear: () => void;
  subtotal: number;
  itemCount: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, undefined, () => ({
    lines: readStore<CartLine[]>(STORE_KEYS.cart, []),
  }));

  useEffect(() => {
    writeStore(STORE_KEYS.cart, state.lines);
  }, [state.lines]);

  const value = useMemo<CartContextValue>(() => {
    const subtotal = state.lines.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0);
    const itemCount = state.lines.reduce((sum, l) => sum + l.quantity, 0);
    return {
      lines: state.lines,
      addLine: (line) => dispatch({ type: 'ADD', line }),
      removeLine: (lineId) => dispatch({ type: 'REMOVE', lineId }),
      setQuantity: (lineId, quantity) => dispatch({ type: 'SET_QUANTITY', lineId, quantity }),
      clear: () => dispatch({ type: 'CLEAR' }),
      subtotal,
      itemCount,
    };
  }, [state.lines]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}

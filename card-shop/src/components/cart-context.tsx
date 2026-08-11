"use client";

import { createContext, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "cardshop-cart";

type CartApi = {
  ids: string[];
  add: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
  has: (id: string) => boolean;
  ready: boolean;
};

const CartContext = createContext<CartApi>({
  ids: [],
  add: () => {},
  remove: () => {},
  clear: () => {},
  has: () => false,
  ready: false,
});

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) setIds(JSON.parse(stored));
    } catch {}
    setReady(true);
  }, []);

  function persist(next: string[]) {
    setIds(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {}
  }

  const api: CartApi = {
    ids,
    ready,
    add: (id) => persist(ids.includes(id) ? ids : [...ids, id]),
    remove: (id) => persist(ids.filter((x) => x !== id)),
    clear: () => persist([]),
    has: (id) => ids.includes(id),
  };

  return <CartContext.Provider value={api}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}

"use client";

import { useEffect } from "react";
import { useCart } from "@/components/cart-context";

// Empties the local cart once a paid checkout lands on the success page.
export function ClearCart() {
  const cart = useCart();
  useEffect(() => {
    if (cart.ready && cart.ids.length > 0) cart.clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart.ready]);
  return null;
}

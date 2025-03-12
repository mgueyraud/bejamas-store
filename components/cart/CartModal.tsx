"use client";

import { useEffect } from "react";
import { useCart } from "./CartContext";
import { createCartAndSetCookie } from "./actions";
import Cart from "../icons/Cart";

export default function CartModal() {
  const { cart } = useCart();

  useEffect(() => {
    if (!cart) {
      createCartAndSetCookie();
    }
  }, [cart]);

  return (
    <>
      <button aria-label="Cart" className="cursor-pointer ml-auto relative">
        <Cart className="size-6" />
        {cart?.lines && cart.lines.length > 0 ? (
          <span className="size-6 flex items-center justify-center text-xs absolute -top-3 -right-3 rounded-full bg-accent text-black font-bold border-3 border-background">
            {cart.lines.length}
          </span>
        ) : null}
      </button>
    </>
  );
}

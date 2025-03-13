"use client";

import Button from "@/components/Button";
import { redirectToCheckout } from "@/components/cart/actions";
import { useCart } from "@/components/cart/CartContext";
import CartItem from "@/components/cart/CartItem";
import { DeleteItemButton } from "@/components/cart/DeleteItemButton";
import { EditItemQuantityButton } from "@/components/cart/EditItemQuantityButton";
import Cart from "@/components/icons/Cart";
import Link from "next/link";
import { useFormStatus } from "react-dom";

export default function CartPage() {
  const { cart, updateCartItem } = useCart();

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold md:text-3xl">Cart</h1>

      {cart && cart.lines.length > 0 ? (
        <ul className="flex-grow overflow-auto flex flex-col gap-6 py-4">
          {cart.lines
            .sort((a, b) =>
              a.merchandise.product.title.localeCompare(
                b.merchandise.product.title
              )
            )
            .map((item) => (
              <CartItem
                key={item.id}
                item={item}
                actions={
                  <>
                    <DeleteItemButton
                      item={item}
                      optimisticUpdate={updateCartItem}
                    />
                    <div className=" flex h-9 flex-row items-center rounded-full border border-neutral-200 dark:border-neutral-700">
                      <EditItemQuantityButton
                        item={item}
                        type="minus"
                        optimisticUpdate={updateCartItem}
                      />
                      <p className="w-6 text-center">
                        <span className="w-full text-sm">{item.quantity}</span>
                      </p>
                      <EditItemQuantityButton
                        item={item}
                        type="plus"
                        optimisticUpdate={updateCartItem}
                      />
                    </div>
                  </>
                }
              />
            ))}
        </ul>
      ) : (
        <div className="flex flex-col items-center mt-20">
          <Cart className="w-20 color-foreground" />
          <Button as={Link} href="/" className="mt-10 grid place-items-center">
            Start shopping
          </Button>
        </div>
      )}

      {cart?.lines.length && cart.lines.length > 0 ? (
        <form action={redirectToCheckout} className="flex justify-end">
          <CheckoutButton />
        </form>
      ) : null}
    </main>
  );
}

function CheckoutButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      className="ml-auto disabled:cursor-not-allowed disabled:opacity-60 md:ml-0 md:w-fit"
      type="submit"
      disabled={pending}
    >
      {pending ? "Loading..." : "Proceed to Checkout"}
    </Button>
  );
}

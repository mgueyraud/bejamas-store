"use client";

import { redirectToCheckout } from "@/components/cart/actions";
import { useCart } from "@/components/cart/CartContext";
import { DeleteItemButton } from "@/components/cart/DeleteItemButton";
import { EditItemQuantityButton } from "@/components/cart/EditItemQuantityButton";
import Cart from "@/components/icons/Cart";
import { DEFAULT_OPTION } from "@/lib/constants";
import { createUrl } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useFormStatus } from "react-dom";

type MerchandiseSearchParams = {
  [key: string]: string;
};

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
            .map((item, i) => {
              const merchandiseSearchParams = {} as MerchandiseSearchParams;

              item.merchandise.selectedOptions.forEach(({ name, value }) => {
                if (value !== DEFAULT_OPTION) {
                  merchandiseSearchParams[name.toLocaleLowerCase()] = value;
                }
              });
              const merchandiseUrl = createUrl(
                `/products/${item.merchandise.product.handle}`,
                new URLSearchParams(merchandiseSearchParams)
              );

              return (
                <li
                  key={i}
                  className="lex w-full flex-col pb-6 border-b border-neutral-300 dark:border-neutral-700"
                >
                  <div className="flex flex-row">
                    <div className="relative h-24 w-24 overflow-hidden rounded-md border border-neutral-300 bg-neutral-300 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800">
                      <Image
                        className="h-full w-full object-cover"
                        width={96}
                        height={96}
                        alt={
                          item.merchandise.product.featuredImage.altText ||
                          item.merchandise.product.title
                        }
                        src={item.merchandise.product.featuredImage.url}
                      />
                    </div>
                    <div className="ml-2">
                      <Link
                        href={merchandiseUrl}
                        className="z-30flex flex-row space-x-4"
                      >
                        <div className="flex flex-1 flex-col text-base">
                          <span className="text-lg font-bold">
                            {item.merchandise.product.title}
                          </span>
                          {item.merchandise.title !== DEFAULT_OPTION ? (
                            <p className="text-md">{item.merchandise.title}</p>
                          ) : null}
                        </div>
                      </Link>
                      <span>{item.cost.totalAmount.amount} USD</span>
                    </div>
                    <div className="ml-auto flex flex-col items-end gap-4">
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
                          <span className="w-full text-sm">
                            {item.quantity}
                          </span>
                        </p>
                        <EditItemQuantityButton
                          item={item}
                          type="plus"
                          optimisticUpdate={updateCartItem}
                        />
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
        </ul>
      ) : (
        <div className="flex flex-col items-center mt-20">
          <Cart className="w-20 color-foreground" />
          <Link
            href="/"
            className="mt-10 grid place-items-center cursor-pointer bg-accent text-black font-bold px-6 h-12 rounded-full"
          >
            Start shopping
          </Link>
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
    <button
      className="cursor-pointer bg-accent text-black font-bold px-6 h-12 rounded-full ml-auto disabled:cursor-not-allowed disabled:opacity-60 md:ml-0 md:w-fit"
      type="submit"
      disabled={pending}
    >
      {pending ? "Loading..." : "Proceed to Checkout"}
    </button>
  );
}

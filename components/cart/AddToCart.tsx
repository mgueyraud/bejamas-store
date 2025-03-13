"use client";

import { useProduct } from "../product/ProductContext";
import clsx from "clsx";
import { Product, ProductVariant } from "@/types/shopify";
import { useCart } from "./CartContext";
import { addItem } from "./actions";
import { useActionState } from "react";
import { toast } from "sonner";
import Button from "../Button";

function SubmitButton({
  availableForSale,
  selectedVariantId,
  isPending = false,
}: {
  availableForSale: boolean;
  selectedVariantId: string | undefined;
  isPending?: boolean;
}) {
  const buttonClasses = "ml-auto md:ml-0 md:w-fit";
  const disabledClasses = "cursor-not-allowed opacity-60 hover:opacity-60";

  if (!availableForSale) {
    return (
      <Button disabled className={clsx(buttonClasses, disabledClasses)}>
        Out of Stock
      </Button>
    );
  }

  if (isPending) {
    return (
      <Button disabled className={clsx(buttonClasses, disabledClasses)}>
        Adding...
      </Button>
    );
  }

  if (!selectedVariantId) {
    return (
      <Button
        aria-label="Please select an option"
        disabled
        className={clsx(buttonClasses, disabledClasses)}
      >
        Add to Cart
      </Button>
    );
  }

  return (
    <Button
      aria-label="Add to cart"
      className={clsx(buttonClasses, {
        "hover:opacity-90": true,
      })}
    >
      Add To Cart
    </Button>
  );
}

export function AddToCart({ product }: { product: Product }) {
  const { variants, availableForSale } = product;
  const { addCartItem } = useCart();
  const { state } = useProduct();
  const [message, formAction, isPending] = useActionState(addItem, null);
  const variant = variants.find((variant: ProductVariant) =>
    variant.selectedOptions.every(
      (option) => option.value === state[option.name.toLowerCase()]
    )
  );
  const defaultVariantId = variants.length === 1 ? variants[0]?.id : undefined;
  const selectedVariantId = variant?.id || defaultVariantId;
  const actionWithVariant = formAction.bind(null, selectedVariantId);
  const finalVariant = variants.find(
    (variant) => variant.id === selectedVariantId
  )!;
  return (
    <form
      action={async () => {
        addCartItem(finalVariant, product);
        await actionWithVariant();
        console.log(finalVariant);
        toast.success("Added to cart succesfully", {
          description:
            finalVariant.selectedOptions.length > 1
              ? finalVariant.selectedOptions
                  .map((option) => `${option.name}: ${option.value}`)
                  .join(", ")
              : "",
        });
      }}
      className="flex"
    >
      <SubmitButton
        availableForSale={availableForSale}
        selectedVariantId={selectedVariantId}
        isPending={isPending}
      />
      <p className="sr-only" role="status" aria-label="polite">
        {message}
      </p>
    </form>
  );
}

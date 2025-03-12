"use client";

import { ProductOption, ProductVariant } from "@/types/shopify";
import { useProduct, useUpdateURL } from "./ProductContext";
import clsx from "clsx";
import * as RadioGroup from "@radix-ui/react-radio-group";

type Combination = {
  id: string;
  availableForSale: boolean;
  [key: string]: string | boolean;
};

export default function VariantSelector({
  options,
  variants,
}: {
  options: ProductOption[];
  variants: ProductVariant[];
}) {
  const { state, updateOption } = useProduct();
  const updateURL = useUpdateURL();
  const hasNoOptionsOrJustOneOption =
    !options.length ||
    (options.length === 1 && options[0]?.values.length === 1);

  if (hasNoOptionsOrJustOneOption) {
    return null;
  }

  const combinations: Combination[] = variants.map((variant) => ({
    id: variant.id,
    availableForSale: variant.availableForSale,
    ...variant.selectedOptions.reduce(
      (accumulator, option) => ({
        ...accumulator,
        [option.name.toLowerCase()]: option.value,
      }),
      {}
    ),
  }));

  return options.map((option) => (
    <RadioGroup.Root
      key={option.id}
      className="RadioGroupRoot"
      aria-label={option.name}
    >
      <form>
        <dl className="mb-8">
          <dt className="mb-4 text-sm uppercase tracking-wide">
            {option.name}
          </dt>
          <dd className="flex flex-wrap gap-3">
            {option.values.map((value) => {
              const optionNameLowerCase = option.name.toLowerCase();

              // Base option params on current selectedOptions so we can preserve any other param state
              const optionParams = { ...state, [optionNameLowerCase]: value };

              // Filter out invalid options and check if the options combination is available for sale
              const filtered = Object.entries(optionParams).filter(
                ([key, value]) =>
                  options.find(
                    (option) =>
                      option.name.toLowerCase() === key &&
                      option.values.includes(value)
                  )
              );

              const isAvailableForSale = combinations.find((combination) =>
                filtered.every(
                  ([key, value]) =>
                    combination[key] === value && combination.availableForSale
                )
              );

              // The option is active if it's in the selected options
              const isActive = state[optionNameLowerCase] === value;

              return (
                <RadioGroup.Item
                  value={value}
                  type="submit"
                  formAction={() => {
                    const newState = updateOption(optionNameLowerCase, value);
                    updateURL(newState);
                  }}
                  key={value}
                  aria-disabled={!isAvailableForSale}
                  disabled={!isAvailableForSale}
                  title={`${option.name} ${value}${
                    !isAvailableForSale ? " (Out of Stock)" : ""
                  }`}
                  className={clsx(
                    "flex min-w-[48px] items-center justify-center rounded-full border bg-neutral-100 px-2 py-1 text-sm dark:border-neutral-800 dark:bg-neutral-900 focus-visible:outline-2 focus-visible:outline-accent",
                    {
                      "cursor-default ring-2 ring-accent": isActive,
                      "ring-1 ring-transparent transition duration-300 ease-in-out hover:ring-accent":
                        !isActive && isAvailableForSale,
                      "relative z-10 cursor-not-allowed overflow-hidden bg-neutral-100 text-neutral-500 ring-1 ring-neutral-300 before:absolute before:inset-x-0 before:-z-10 before:h-px before:-rotate-45 before:bg-neutral-300 before:transition-transform dark:bg-neutral-900 dark:text-neutral-400 dark:ring-neutral-700 before:dark:bg-neutral-700":
                        !isAvailableForSale,
                    }
                  )}
                >
                  {value}
                </RadioGroup.Item>
              );
            })}
          </dd>
        </dl>
      </form>
    </RadioGroup.Root>
  ));
}

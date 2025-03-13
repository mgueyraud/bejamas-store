import { DEFAULT_OPTION } from "@/lib/constants";
import { createUrl } from "@/lib/utils";
import { CartItem as ShCartItem } from "@/types/shopify";
import Image from "next/image";
import Link from "next/link";

type MerchandiseSearchParams = {
  [key: string]: string;
};

export default function CartItem({
  item,
  actions,
}: {
  item: ShCartItem;
  actions: React.ReactNode;
}) {
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
    <li className="lex w-full flex-col pb-6 border-b border-neutral-300 dark:border-neutral-700">
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
          <Link href={merchandiseUrl} className="z-30flex flex-row space-x-4">
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
        <div className="ml-auto flex flex-col items-end gap-4">{actions}</div>
      </div>
    </li>
  );
}

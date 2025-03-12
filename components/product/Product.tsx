import Image from "next/image";
import Link from "next/link";
import React from "react";

type Props = {
  name: string;
  price: string;
  image: string;
  slug: string;
};

export default function Product({ name, price, image, slug }: Props) {
  return (
    <div className="w-full">
      <Link
        href={`/products/${slug}`}
        prefetch
        className="block outline-offset-6 focus-visible:outline-2 focus-visible:outline-accent"
      >
        <Image
          src={image}
          width={0}
          height={0}
          layout="responsive"
          objectFit="cover"
          alt={name}
          className="rounded-sm w-full aspect-square"
        />
      </Link>
      <div className="flex justify-between font-bold text-xl mt-4">
        <span>{name}</span>
        <span>{price} USD</span>
      </div>
    </div>
  );
}

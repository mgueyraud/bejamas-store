import { AddToCart } from "@/components/cart/AddToCart";
import Product from "@/components/product/Product";
import { ProductProvider } from "@/components/product/ProductContext";
import VariantSelector from "@/components/product/VariantSelector";
import { getProduct, getProductRecommendations } from "@/lib/shopify";
import Image from "next/image";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const product = await getProduct(handle);

  return {
    title: product?.seo.title ?? product?.title,
    description: product?.seo.description ?? product?.description,
    openGraph: {
      images: [product?.featuredImage.url],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const product = await getProduct(handle);

  if (!product) return notFound();

  return (
    <ProductProvider>
      <div className="p-4 md:p-6">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          <div className="flex flex-col gap-5">
            {product.images.map((image) => (
              <Image
                key={image.url}
                src={image.url}
                width={0}
                height={0}
                layout="responsive"
                objectFit="cover"
                alt={image.altText}
                fetchPriority="high"
                className="rounded-sm not-first:hidden md:not-first:block"
              />
            ))}
          </div>
          <div className="relative">
            <div className="flex flex-col md:sticky md:top-5">
              <div className="flex justify-between text-2xl font-bold md:text-3xl">
                <h1>{product.title}</h1>
                <span>{product.priceRange.maxVariantPrice.amount} USD</span>
              </div>

              <p className="text-lg my-5">{product.description}</p>

              <VariantSelector
                options={product.options}
                variants={product.variants}
              />

              <AddToCart product={product} />
            </div>
          </div>
        </div>
        <RelatedProducts id={product.id} />
      </div>
    </ProductProvider>
  );
}

async function RelatedProducts({ id }: { id: string }) {
  const relatedProducts = await getProductRecommendations(id);

  if (!relatedProducts || relatedProducts.length === 0) return null;

  return (
    <div className="py-8 mt-10">
      <h2 className="mb-4 text-2xl font-bold">Related Products</h2>
      <ul className="grid grid-cols-2 w-full gap-4 overflow-x-auto pt-1 md:grid-cols-4">
        {relatedProducts.map((product) => (
          <li key={product.handle}>
            <Product
              key={product.handle}
              name={product.title}
              price={product.priceRange.maxVariantPrice.amount}
              image={product.featuredImage?.url}
              slug={product.handle}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

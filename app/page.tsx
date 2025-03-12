import Product from "@/components/product/Product";
import { getProducts } from "@/lib/shopify";

export default async function Home() {
  const products = await getProducts({ sortKey: "CREATED_AT" });
  console.log(products);
  return (
    <main>
      <div className="grid grid-cols-1 gap-x-5 gap-y-8 p-4 md:grid-cols-2 lg:grid-cols-3 md:p-6">
        {products.map((product) => (
          <Product
            key={product.handle}
            name={product.title}
            price={product.priceRange.maxVariantPrice.amount}
            image={product.featuredImage?.url}
            slug={product.handle}
          />
        ))}
      </div>
    </main>
  );
}

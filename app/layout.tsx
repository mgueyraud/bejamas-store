import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/Header";
import { cookies } from "next/headers";
import { getCart } from "@/lib/shopify";
import { CartProvider } from "@/components/cart/CartContext";

const neueMontreal = localFont({
  src: [
    {
      path: "./fonts/NeueMontreal-Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/NeueMontreal-BoldItalic.otf",
      weight: "700",
      style: "italic",
    },
    {
      path: "./fonts/NeueMontreal-Light.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/NeueMontreal-LightItalic.otf",
      weight: "400",
      style: "italic",
    },
  ],
});

export const metadata: Metadata = {
  title: "Bejamas Store",
  description: "a",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cartId = (await cookies()).get("cartId")?.value;

  const cart = getCart(cartId);

  return (
    <html lang="en">
      <body className={`${neueMontreal.className} antialiased`}>
        <CartProvider cartPromise={cart}>
          <Header />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}

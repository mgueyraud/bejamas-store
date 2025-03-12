import Link from "next/link";
import Logo from "./icons/Logo";
import CartModal from "./cart/CartModal";

export default function Header() {
  return (
    <header className="w-full flex items-center justify-between py-5 px-6 border-b relative">
      <div className="gap-4 hidden md:flex">
        <Link href="/" className="font-bold text-lg">
          Shop
        </Link>
        <Link href="/" className="font-bold text-lg">
          Blog
        </Link>
        <Link href="/" className="font-bold text-lg">
          About
        </Link>
      </div>
      <Link href="/" className="absolute left-1/2 -translate-x-1/2">
        <Logo height={30} />
      </Link>
      <CartModal />
    </header>
  );
}

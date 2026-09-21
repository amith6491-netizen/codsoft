"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";

export function NavbarCart() {
  const { itemCount } = useCart();

  return (
    <Link href="/cart" className="relative p-2 text-foreground/80 hover:text-primary transition-colors">
      <ShoppingBag className="w-6 h-6" />
      {itemCount > 0 && (
        <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
          {itemCount}
        </span>
      )}
    </Link>
  );
}

'use client';

import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { logoutAction } from '@/actions/auth';
import { useCart } from '@/context/CartContext';

export function LogoutButton() {
  const router = useRouter();
  const { clearCart } = useCart();

  const handleLogout = async () => {
    clearCart();
    const result = await logoutAction();
    if (result?.success && result?.redirectTo) {
      router.push(result.redirectTo);
      router.refresh();
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg bg-foreground/5 hover:bg-foreground/10 text-foreground/70 hover:text-foreground transition-all border border-border/30"
    >
      <LogOut className="w-4 h-4" />
      <span className="hidden sm:inline">Logout</span>
    </button>
  );
}

import Link from "next/link";
import { Utensils, ShoppingBag, LogIn, LogOut, UserPlus, User } from "lucide-react";
import { getSession } from "@/lib/auth";
import { logoutAction } from "@/actions/auth";
import { NavbarCart } from "./NavbarCart";

export async function Navbar() {
  const session = await getSession();
  const user = session?.user as { name?: string; email?: string; role?: string } | undefined;

  return (
    <header className="sticky top-0 z-50 w-full glass-effect">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-primary/10 p-2 rounded-xl group-hover:bg-primary/20 transition-colors">
            <Utensils className="w-6 h-6 text-primary" />
          </div>
          <span className="font-outfit text-xl font-bold tracking-tight">DineDesk</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-8 font-medium">
          <Link href="/menu" className="text-foreground/80 hover:text-primary transition-colors">Menu</Link>
          <Link href="/reservations" className="text-foreground/80 hover:text-primary transition-colors">Reservations</Link>
          {user?.role === 'ADMIN' || user?.role === 'STAFF' ? (
            <Link href="/kitchen" className="text-foreground/80 hover:text-primary transition-colors">Kitchen</Link>
          ) : null}
        </nav>
        
        <div className="flex items-center gap-3">
          <NavbarCart />

          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 text-sm text-foreground/70">
                <div className="bg-primary/10 p-1.5 rounded-full">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <span className="font-medium">{user.name || user.email}</span>
              </div>
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg bg-foreground/5 hover:bg-foreground/10 text-foreground/70 hover:text-foreground transition-all border border-border/30"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </form>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-foreground/5 text-foreground/70 hover:text-foreground transition-all"
              >
                <LogIn className="w-4 h-4" />
                <span className="hidden sm:inline">Login</span>
              </Link>
              <Link
                href="/register"
                className="flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-xl bg-primary text-white hover:bg-primary/90 transition-all"
              >
                <UserPlus className="w-4 h-4" />
                <span className="hidden sm:inline">Sign Up</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

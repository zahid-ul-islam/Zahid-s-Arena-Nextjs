"use client";

import Link from "next/link";
import { ShoppingCart, User, Menu, X, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { cart } = useCart();

  useEffect(() => {
    // Simple cookie check for client-side UI updates
    // In a real app, you might use a context or a more robust method
    const checkAuth = () => {
      const cookies = document.cookie.split(";");
      let role = null;
      let userId = null;

      for (const cookie of cookies) {
        const [name, value] = cookie.trim().split("=");
        if (name === "role") role = value;
        if (name === "user_id") userId = value;
      }

      setUserRole(role);
      // auth_token is httpOnly, so we can't read it. Use user_id/role to determine UI state.
      setIsLoggedIn(!!userId || !!role);
    };

    checkAuth();
    // Listen for storage events or custom events if needed, but for now simple mount check
  }, [pathname]); // Re-check on path change as cookies might change on login/logout

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUserRole(null);
      setIsLoggedIn(false);
      router.push("/auth/signin");
      router.refresh();
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "New Arrivals", href: "/shop?sort=newest" },
  ];

  if (userRole === "admin") {
    navLinks.push({ name: "Admin Dashboard", href: "/admin" });
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-bold tracking-tighter hover:opacity-80 transition-opacity"
        >
          ZAHID<span className="text-yellow-500">&apos;S</span>
          <span className="text-primary"> ARENA</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === link.href
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <>
              {userRole !== "admin" && (
                <Link
                  href="/cart"
                  className="relative p-2 hover:bg-muted rounded-full transition-colors"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span className="absolute top-0 right-0 w-4 h-4 bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center rounded-full">
                    {cart.length}
                  </span>
                </Link>
              )}
              <Link
                href={userRole === "admin" ? "/admin" : "/account"}
                className="p-2 hover:bg-muted rounded-full transition-colors"
                title={userRole === "admin" ? "Admin Dashboard" : "Account"}
              >
                <User className="w-5 h-5" />
              </Link>
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-muted rounded-full transition-colors text-red-500"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/auth/signin"
                className="text-sm font-medium hover:text-primary"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-full hover:opacity-90"
              >
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:bg-muted rounded-md"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden border-t border-border">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={clsx(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === link.href
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            {isLoggedIn ? (
              <>
                {userRole !== "admin" && (
                  <Link
                    href="/cart"
                    onClick={() => setIsOpen(false)}
                    className="text-sm font-medium hover:text-primary flex items-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" /> Cart
                  </Link>
                )}
                <Link
                  href={userRole === "admin" ? "/admin" : "/account"}
                  onClick={() => setIsOpen(false)}
                  className="text-sm font-medium hover:text-primary flex items-center gap-2"
                >
                  <User className="w-4 h-4" />{" "}
                  {userRole === "admin" ? "Dashboard" : "Account"}
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="text-sm font-medium text-red-500 text-left flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  onClick={() => setIsOpen(false)}
                  className="text-sm font-medium"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  onClick={() => setIsOpen(false)}
                  className="text-sm font-medium"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

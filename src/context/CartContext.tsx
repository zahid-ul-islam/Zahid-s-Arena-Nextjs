"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

import { toast } from "react-toastify";

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  size: string;
  quantity: number;
  stock?: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string, size: string) => void;
  clearCart: () => void;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from local storage
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      // eslint-disable-next-line
      setCart(JSON.parse(savedCart));
    }
    setIsLoaded(true);
  }, []);

  // Save to local storage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart, isLoaded]);

  const addToCart = (item: CartItem) => {
    const existing = cart.find(
      (i) => i.productId === item.productId && i.size === item.size
    );

    if (existing) {
      const newQuantity = existing.quantity + item.quantity;
      if (item.stock !== undefined && newQuantity > item.stock) {
        toast.error(`Cannot add more. Only ${item.stock} items in stock.`);
        return;
      }
      // Removed toast.success("Cart updated!") as requested
      setCart((prev) =>
        prev.map((i) =>
          i.productId === item.productId && i.size === item.size
            ? { ...i, quantity: newQuantity }
            : i
        )
      );
    } else {
      if (item.stock !== undefined && item.quantity > item.stock) {
        toast.error(`Cannot add more. Only ${item.stock} items in stock.`);
        return;
      }

      toast.success("Added to cart!");
      setCart((prev) => [...prev, item]);
    }
  };

  const removeFromCart = (productId: string, size: string) => {
    setCart((prev) =>
      prev.filter((i) => !(i.productId === productId && i.size === size))
    );
  };

  const clearCart = () => setCart([]);

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart, total }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

"use client";

import { useCart } from "@/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Minus, Plus } from "lucide-react";
import CheckoutForm from "@/components/CheckoutForm";
import { useState } from "react";

export default function CartPage() {
  const { cart, removeFromCart, addToCart, total } = useCart();
  const [isCheckout, setIsCheckout] = useState(false);

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
        <Link href="/shop" className="text-primary hover:underline">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          {cart.map((item) => (
            <div
              key={`${item.productId}-${item.size}`}
              className="flex gap-4 p-4 bg-card rounded-xl border border-border"
            >
              <div className="relative w-24 h-32 bg-muted rounded-md overflow-hidden shrink-0">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="font-bold">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Size: {item.size}
                  </p>
                  <p className="font-semibold text-primary">${item.price}</p>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => addToCart({ ...item, quantity: -1 })}
                      disabled={item.quantity <= 1}
                      className="p-1 hover:bg-muted rounded disabled:opacity-50"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => addToCart({ ...item, quantity: 1 })}
                      className="p-1 hover:bg-muted rounded"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.productId, item.size)}
                    className="text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-card p-6 rounded-xl border border-border sticky top-24">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-2 mb-4 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>
            </div>
            <div className="border-t border-border pt-4 mb-6">
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {!isCheckout ? (
              <button
                onClick={() => setIsCheckout(true)}
                className="w-full py-3 bg-primary text-primary-foreground rounded-full font-bold hover:opacity-90 transition-opacity"
              >
                Proceed to Checkout
              </button>
            ) : (
              <CheckoutForm total={total} cart={cart} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

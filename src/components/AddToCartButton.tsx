"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { ShoppingCart } from "lucide-react";
import { IProduct } from "@/models/Product";
import clsx from "clsx";

export default function AddToCartButton({
  product,
}: {
  product: IProduct & { _id: string };
}) {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState<string>("");

  const handleAddToCart = () => {
    if (!selectedSize) return;

    addToCart({
      productId: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: selectedSize,
      quantity: 1,
      stock: product.stock,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-3">Select Size</h3>
        <div className="flex gap-3">
          {(product.sizes || []).map((size: string) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={clsx(
                "w-12 h-12 rounded-full border flex items-center justify-center transition-all",
                selectedSize === size
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border hover:border-primary"
              )}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleAddToCart}
        disabled={!selectedSize}
        className={clsx(
          "w-full py-4 rounded-full font-bold text-lg flex items-center justify-center gap-2 transition-all",
          "bg-foreground text-background hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
        )}
      >
        <ShoppingCart className="w-5 h-5" /> Add to Cart
      </button>
    </div>
  );
}

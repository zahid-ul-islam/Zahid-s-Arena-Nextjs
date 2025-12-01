"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { useCart, CartItem } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  zip: z.string().min(3, "Zip code is required"),
  country: z.string().min(2, "Country is required"),
});

type FormData = z.infer<typeof schema>;

export default function CheckoutForm({
  total,
  cart,
}: {
  total: number;
  cart: CartItem[];
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { clearCart } = useCart();
  const router = useRouter();

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      // Create Order via API
      // Note: User ID is hardcoded for demo as Auth is not fully integrated in this snippet
      // In real app, get session.user.id
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // User ID is handled by backend via auth token
          products: cart.map((item) => ({
            product: item.productId,
            quantity: item.quantity,
            size: item.size,
          })),
          total,
          address: {
            street: data.address,
            city: data.city,
            state: "N/A",
            zip: data.zip,
            country: data.country,
          },
        }),
      });

      if (res.ok) {
        clearCart();
        toast.success("Order placed successfully!");
        router.push("/order-success"); // Need to create this page
      } else {
        toast.error("Failed to place order");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error placing order");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 animate-in fade-in slide-in-from-top-4"
    >
      <div>
        <input
          {...register("name")}
          placeholder="Full Name"
          className="w-full p-2 rounded border border-border bg-background"
        />
        {errors.name && (
          <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
        )}
      </div>
      <div>
        <input
          {...register("email")}
          placeholder="Email"
          className="w-full p-2 rounded border border-border bg-background"
        />
        {errors.email && (
          <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
        )}
      </div>
      <div>
        <input
          {...register("address")}
          placeholder="Address"
          className="w-full p-2 rounded border border-border bg-background"
        />
        {errors.address && (
          <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <input
            {...register("city")}
            placeholder="City"
            className="w-full p-2 rounded border border-border bg-background"
          />
          {errors.city && (
            <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>
          )}
        </div>
        <div>
          <input
            {...register("zip")}
            placeholder="Zip Code"
            className="w-full p-2 rounded border border-border bg-background"
          />
          {errors.zip && (
            <p className="text-red-500 text-xs mt-1">{errors.zip.message}</p>
          )}
        </div>
      </div>
      <div>
        <input
          {...register("country")}
          placeholder="Country"
          className="w-full p-2 rounded border border-border bg-background"
        />
        {errors.country && (
          <p className="text-red-500 text-xs mt-1">{errors.country.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 bg-primary text-primary-foreground rounded-full font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {isSubmitting ? "Processing..." : `Pay $${total.toFixed(2)}`}
      </button>
    </form>
  );
}

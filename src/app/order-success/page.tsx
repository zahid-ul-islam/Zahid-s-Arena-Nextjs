import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function OrderSuccessPage() {
  return (
    <div className="container mx-auto px-4 py-20 text-center">
      <div className="flex justify-center mb-6">
        <CheckCircle className="w-20 h-20 text-green-500" />
      </div>
      <h1 className="text-4xl font-bold mb-4">Order Placed Successfully!</h1>
      <p className="text-muted-foreground mb-8">
        Thank you for your purchase. You will receive an email confirmation
        shortly.
      </p>
      <Link
        href="/shop"
        className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-bold hover:opacity-90 transition-opacity"
      >
        Continue Shopping
      </Link>
    </div>
  );
}

import dbConnect from "@/lib/db";
import Order from "@/models/Order";
import Product from "@/models/Product";
import Link from "next/link";
import { Package, ShoppingBag, DollarSign, LogOut } from "lucide-react";

async function getStats() {
  await dbConnect();
  const productCount = await Product.countDocuments();
  const orderCount = await Order.countDocuments();

  // Calculate total revenue
  const orders = await Order.find({ status: { $ne: "cancelled" } });
  const totalRevenue = orders.reduce((acc, order) => acc + order.total, 0);

  return { productCount, orderCount, totalRevenue };
}

export default async function AdminDashboard() {
  const stats = await getStats();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <form action="/api/auth/logout" method="POST">
          <button
            type="submit"
            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="bg-card p-6 rounded-xl border border-border flex items-center gap-4">
          <div className="p-4 bg-blue-100 dark:bg-blue-900/20 rounded-full text-blue-600">
            <DollarSign className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Revenue</p>
            <p className="text-2xl font-bold">
              ${stats.totalRevenue.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="bg-card p-6 rounded-xl border border-border flex items-center gap-4">
          <div className="p-4 bg-purple-100 dark:bg-purple-900/20 rounded-full text-purple-600">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Orders</p>
            <p className="text-2xl font-bold">{stats.orderCount}</p>
          </div>
        </div>

        <div className="bg-card p-6 rounded-xl border border-border flex items-center gap-4">
          <div className="p-4 bg-green-100 dark:bg-green-900/20 rounded-full text-green-600">
            <Package className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Products</p>
            <p className="text-2xl font-bold">{stats.productCount}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Link
          href="/admin/products"
          className="block p-8 bg-card border border-border rounded-xl hover:border-primary transition-colors group"
        >
          <h2 className="text-xl font-bold mb-2 group-hover:text-primary">
            Manage Products
          </h2>
          <p className="text-muted-foreground">
            Add, edit, or delete football kits.
          </p>
        </Link>

        <Link
          href="/admin/orders"
          className="block p-8 bg-card border border-border rounded-xl hover:border-primary transition-colors group"
        >
          <h2 className="text-xl font-bold mb-2 group-hover:text-primary">
            Manage Orders
          </h2>
          <p className="text-muted-foreground">View and update order status.</p>
        </Link>
      </div>
    </div>
  );
}

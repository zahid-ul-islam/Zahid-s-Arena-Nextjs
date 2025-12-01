"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Package, User as UserIcon, LogOut, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Loader from "@/components/Loader";

type User = {
  name: string;
  email: string;
  image?: string;
  role: "admin" | "user";
};
type Order = {
  _id: string;
  total: number;
  status: string;
  createdAt: string;
  products: {
    product: {
      name: string;
      image: string;
    };
    size: string;
    quantity: number;
  }[];
};

export default function AccountPage() {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"profile" | "orders">("profile");
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const [userRes, ordersRes] = await Promise.all([
          fetch("/api/users/me"),
          fetch("/api/orders/my-orders"),
        ]);

        if (userRes.ok) {
          const u = await userRes.json();
          setUser(u);
        }
        if (ordersRes.ok) {
          const o = await ordersRes.json();
          setOrders(o);
        }
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const updateImage = async (base64: string) => {
    if (!user) return;
    const res = await fetch("/api/users/me", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: base64 }),
    });
    if (res.ok) {
      const u = await res.json();
      setUser(u);
    }
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/auth/signin");
    router.refresh();
  };

  if (loading)
    return (
      <div className="container mx-auto px-4 py-20 text-center h-[50vh] flex items-center justify-center">
        <Loader />
      </div>
    );
  if (!user)
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        Please sign in to view your account.
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-64 space-y-2">
          <div className="p-6 bg-card rounded-xl border border-border text-center">
            <div className="relative w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-2 border-primary">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <UserIcon className="w-10 h-10 text-muted-foreground" />
                </div>
              )}
            </div>
            <h2 className="font-bold text-lg">{user.name}</h2>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>

          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab("profile")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === "profile"
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }`}
            >
              <UserIcon className="w-5 h-5" />
              Profile
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === "orders"
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }`}
            >
              <Package className="w-5 h-5" />
              Orders
            </button>
            <button
              onClick={() => router.push("/cart")}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              My Cart
            </button>
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </nav>
        </aside>

        {/* Content */}
        <main className="flex-1 bg-card rounded-xl border border-border p-6 min-h-[500px]">
          {activeTab === "profile" && (
            <div className="space-y-6 animate-in fade-in">
              <h2 className="text-2xl font-bold">Profile Settings</h2>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Profile Picture
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = () =>
                        updateImage(reader.result as string);
                      reader.readAsDataURL(file);
                    }}
                    className="block w-full text-sm text-muted-foreground
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-primary file:text-primary-foreground
                      hover:file:opacity-90"
                  />
                </div>
              </div>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const name = formData.get("name") as string;
                  const email = formData.get("email") as string; // Note: Email update might require re-verification in a real app

                  if (!user) return;

                  try {
                    const res = await fetch("/api/users/me", {
                      method: "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ name, email }),
                    });

                    if (res.ok) {
                      const u = await res.json();
                      setUser(u);
                      alert("Profile updated successfully!");
                    } else {
                      const err = await res.json();
                      alert(err.message || "Failed to update profile");
                    }
                  } catch (error) {
                    console.error(error);
                    alert("An error occurred");
                  }
                }}
                className="grid gap-4"
              >
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Full Name
                  </label>
                  <input
                    name="name"
                    type="text"
                    defaultValue={user.name}
                    className="w-full p-2 rounded border border-border bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Email Address
                  </label>
                  <input
                    name="email"
                    type="email"
                    defaultValue={user.email}
                    className="w-full p-2 rounded border border-border bg-background"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-primary text-primary-foreground px-4 py-2 rounded hover:opacity-90 transition-opacity w-fit"
                >
                  Save Changes
                </button>
              </form>
            </div>
          )}

          {activeTab === "orders" && (
            <div className="space-y-6 animate-in fade-in">
              <h2 className="text-2xl font-bold">Order History</h2>
              {orders.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No orders found.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order._id}
                      className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="font-bold">
                            Order #{order._id.slice(-6)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">${order.total.toFixed(2)}</p>
                          <span
                            className={`inline-block px-2 py-1 text-xs rounded-full ${
                              order.status === "delivered"
                                ? "bg-green-100 text-green-800"
                                : order.status === "shipped"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {order.status.charAt(0).toUpperCase() +
                              order.status.slice(1)}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {order.products.map((p, i: number) => (
                          <div
                            key={i}
                            className="flex items-center gap-3 text-sm"
                          >
                            <div className="w-10 h-10 relative bg-muted rounded overflow-hidden">
                              {p.product?.image && (
                                <Image
                                  src={p.product.image}
                                  alt={p.product.name}
                                  fill
                                  className="object-cover"
                                />
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">
                                {p.product?.name || "Unknown Product"}
                              </p>
                              <p className="text-muted-foreground">
                                Size: {p.size} x {p.quantity}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

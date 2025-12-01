import dbConnect from "@/lib/db";
import Order, { IOrder } from "@/models/Order";
import OrderStatusUpdater from "@/components/OrderStatusUpdater";

import User from "@/models/User";
import SearchBar from "@/components/SearchBar";
import mongoose from "mongoose";

async function getOrders(searchParams: {
  [key: string]: string | string[] | undefined;
}) {
  await dbConnect();
  const search = Array.isArray(searchParams.search)
    ? searchParams.search[0]
    : searchParams.search;
  const query: Record<string, unknown> = {};

  if (search) {
    if (mongoose.Types.ObjectId.isValid(search)) {
      query._id = search;
    } else {
      const users = await User.find({
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      }).select("_id");
      const userIds = users.map((u) => u._id);
      query.user = { $in: userIds };
    }
  }

  const orders = await Order.find(query)
    .sort({ createdAt: -1 })
    .populate("user", "name email")
    .populate("products.product", "name")
    .lean<IOrder[]>();

  return orders.map((o) => ({
    ...o,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    _id: (o._id as any).toString(),
    user: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      _id: (o.user as any)?._id?.toString(),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      name: (o.user as any)?.name || "Unknown",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      email: (o.user as any)?.email || "N/A",
    },
    products: o.products.map((p) => ({
      ...p,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      _id: (p as any)._id?.toString(),
      product: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        _id: (p.product as any)?._id?.toString(),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        name: (p.product as any)?.name || "Unknown Product",
      },
    })),
    createdAt: (o.createdAt as Date)?.toISOString(),
  }));
}

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const orders = await getOrders(params);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Orders</h1>
        <SearchBar placeholder="Search orders..." />
      </div>

      <div className="space-y-4">
        {orders.length === 0 ? (
          <p className="text-center text-muted-foreground py-20">
            No orders yet.
          </p>
        ) : (
          orders.map((order) => (
            <div
              key={order._id}
              className="bg-card rounded-xl border border-border p-6"
            >
              <div className="flex flex-col md:flex-row justify-between mb-4">
                <div>
                  <h3 className="font-bold text-lg">
                    Order #{order._id.slice(-8)}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Customer: {order.user.name} ({order.user.email})
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right mt-4 md:mt-0">
                  <p className="text-2xl font-bold text-primary">
                    ${order.total}
                  </p>
                  <OrderStatusUpdater
                    orderId={order._id}
                    currentStatus={order.status}
                  />
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <h4 className="font-semibold mb-2">Items:</h4>
                <ul className="space-y-1 text-sm">
                  {order.products.map((item, idx: number) => (
                    <li key={idx}>
                      {item.product.name} - Size: {item.size} - Qty:{" "}
                      {item.quantity}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-border pt-4 mt-4">
                <h4 className="font-semibold mb-2">Shipping Address:</h4>
                <p className="text-sm text-muted-foreground">
                  {order.address.street}, {order.address.city},{" "}
                  {order.address.zip}, {order.address.country}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

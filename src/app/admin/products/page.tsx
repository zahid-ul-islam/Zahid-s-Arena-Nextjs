import dbConnect from "@/lib/db";
import Product, { IProduct } from "@/models/Product";
import Image from "next/image";
import Link from "next/link";
import { Plus, Edit } from "lucide-react";
import DeleteProductButton from "@/components/DeleteProductButton";

import SearchBar from "@/components/SearchBar";

async function getProducts(searchParams: {
  [key: string]: string | string[] | undefined;
}) {
  await dbConnect();
  const search = searchParams.search;
  const query: Record<string, unknown> = {};

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { team: { $regex: search, $options: "i" } },
    ];
  }

  const products = await Product.find(query)
    .sort({ createdAt: -1 })
    .lean<IProduct[]>();
  return products.map((p) => ({
    ...p,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    _id: (p._id as any).toString(),
  }));
}

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const products = await getProducts(params);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Products</h1>
        <div className="flex items-center gap-4">
          <SearchBar placeholder="Search products..." />
          <Link
            href="/admin/products/new"
            className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full font-bold hover:opacity-90"
          >
            <Plus className="w-5 h-5" /> Add New Kit
          </Link>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr className="text-left">
              <th className="p-4">Image</th>
              <th className="p-4">Name</th>
              <th className="p-4">Team</th>
              <th className="p-4">Price</th>
              <th className="p-4">Stock</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={product._id}
                className="border-t border-border hover:bg-muted/20"
              >
                <td className="p-4">
                  <div className="relative w-12 h-16 bg-muted rounded overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </td>
                <td className="p-4 font-medium">{product.name}</td>
                <td className="p-4 text-muted-foreground">{product.team}</td>
                <td className="p-4">${product.price}</td>
                <td className="p-4">{product.stock}</td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/products/${product._id}/edit`}
                      className="p-2 hover:bg-blue-100 text-blue-600 rounded transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <DeleteProductButton id={product._id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

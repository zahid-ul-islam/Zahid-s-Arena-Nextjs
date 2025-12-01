import dbConnect from "@/lib/db";
import Product from "@/models/Product";
import Image from "next/image";
import Link from "next/link";

export default async function FeaturedKits() {
  await dbConnect();

  // Fetch featured products directly without caching
  const products = await Product.find({ isFeatured: true }).limit(4).lean();

  // Convert _id to string and ensure other fields are serializable
  const serializedProducts = products.map((p) => ({
    ...p,
    _id: (p._id as any).toString(),
    createdAt: (p.createdAt as Date)?.toISOString(),
    updatedAt: (p.updatedAt as Date)?.toISOString(),
  }));

  if (serializedProducts.length === 0) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Featured Kits</h2>
          <p className="text-muted-foreground">
            No featured products found. (Seed the database!)
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12 text-center">Featured Kits</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {serializedProducts.map((product) => (
            <Link
              key={product._id}
              href={`/product/${product._id}`}
              className="group"
            >
              <div className="bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-border h-full flex flex-col">
                <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                </div>
                <div className="p-4 flex-grow flex flex-col justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {product.team}
                    </p>
                    <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                  </div>
                  <p className="font-semibold text-primary mt-2">
                    ${product.price}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

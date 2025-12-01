import dbConnect from "@/lib/db";
import Product, { IProduct } from "@/models/Product";
import Image from "next/image";
import { notFound } from "next/navigation";
import AddToCartButton from "@/components/AddToCartButton"; // Client component

async function getProduct(id: string) {
  await dbConnect();
  try {
    const product = await Product.findById(id).lean();
    if (!product) return null;

    // Map to IProduct compatible object
    return {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      _id: (product._id as any).toString(),
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image,
      productType: product.productType,
      category: product.category,
      team: product.team,
      sizes: product.sizes,
      brand: product.brand,
      size: product.size,
      color: product.color,
      stock: product.stock,
      isFeatured: product.isFeatured,
      isNewArrival: product.isNewArrival,
      createdAt: product.createdAt as Date,
      updatedAt: product.updatedAt as Date,
    } as IProduct & { _id: string };
  } catch {
    return null;
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <div className="relative aspect-4/5 bg-muted rounded-2xl overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Details */}
        <div className="space-y-8">
          <div>
            <h2 className="text-sm font-medium text-muted-foreground mb-2">
              {product.team} • {product.category}
            </h2>
            <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
            <p className="text-2xl font-semibold text-primary">
              ${product.price}
            </p>
          </div>

          <div className="prose prose-sm dark:prose-invert text-muted-foreground">
            <p>{product.description}</p>
          </div>

          <AddToCartButton product={product} />
        </div>
      </div>
    </div>
  );
}

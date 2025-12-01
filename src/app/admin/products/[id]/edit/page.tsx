import dbConnect from "@/lib/db";
import Product, { IProduct } from "@/models/Product";
import ProductForm from "@/components/ProductForm";
import { notFound } from "next/navigation";

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

export default async function EditProductPage({
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
      <h1 className="text-3xl font-bold mb-8">Edit Product</h1>
      <ProductForm initialData={product} />
    </div>
  );
}

"use server";

import { revalidatePath } from "next/cache";
import dbConnect from "@/lib/db";
import Product from "@/models/Product";

export async function deleteProduct(id: string) {
  try {
    await dbConnect();
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return { success: false, message: "Product not found" };
    }

    // Revalidate the admin products page and home page
    revalidatePath("/admin/products");
    revalidatePath("/");

    return { success: true, message: "Product deleted successfully" };
  } catch (error) {
    console.error("Error deleting product:", error);
    return { success: false, message: "Error deleting product" };
  }
}

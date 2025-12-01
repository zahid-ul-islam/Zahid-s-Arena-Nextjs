import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  image: string;
  productType: "kit" | "football" | "shoes" | "equipment";
  // Kit-specific fields
  category?: string;
  team?: string;
  sizes?: string[];
  // Other product fields
  brand?: string;
  size?: string; // Single size for shoes
  color?: string;
  stock: number;
  isFeatured: boolean;
  isNewArrival: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema<IProduct> = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    productType: {
      type: String,
      enum: ["kit", "football", "shoes", "equipment"],
      required: true,
      default: "kit",
    },
    // Kit-specific fields
    category: { type: String }, // Optional - only for kits
    team: { type: String }, // Optional - only for kits
    sizes: { type: [String], default: ["S", "M", "L", "XL"] }, // For kits
    // Other product fields
    brand: { type: String }, // For footballs, shoes, equipment
    size: { type: String }, // Single size for shoes
    color: { type: String }, // For footballs, shoes, equipment
    stock: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);

export default Product;

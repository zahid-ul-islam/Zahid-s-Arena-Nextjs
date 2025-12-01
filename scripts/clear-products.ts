import "dotenv/config";
import mongoose from "mongoose";
import Product from "../src/models/Product";

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb://localhost:27017/football-kits-ecommerce";

async function clearProducts() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    // Delete all products
    const result = await Product.deleteMany({});
    console.log(`✅ Deleted ${result.deletedCount} products from database`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Clear failed:", error);
    process.exit(1);
  }
}

clearProducts();

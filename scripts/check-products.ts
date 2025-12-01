import "dotenv/config";
import mongoose from "mongoose";
import Product from "../src/models/Product";

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb://localhost:27017/football-kits-ecommerce";

async function checkProducts() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    const all = await Product.find({});
    const featured = await Product.find({ isFeatured: true });

    console.log(`Total products: ${all.length}`);
    console.log(`Featured products: ${featured.length}`);

    if (all.length > 0) {
      console.log("\nProducts in database:");
      all.forEach((p: any) => {
        console.log(`- ${p.name} (Featured: ${p.isFeatured})`);
      });
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Check failed:", error);
    process.exit(1);
  }
}

checkProducts();

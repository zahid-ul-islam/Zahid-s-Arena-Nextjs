console.log("Testing imports...");

async function test() {
  try {
    console.log("Attempting to import Product model...");
    const Product = (await import("./src/models/Product")).default;
    console.log("Product imported successfully:", Product);

    console.log("Attempting to import products route...");
    const productRoutes = (await import("./src/server/routes/products"))
      .default;
    console.log("Products route imported successfully:", productRoutes);

    console.log("All imports successful!");
  } catch (error) {
    console.error("Import failed:", error);
    process.exit(1);
  }
}

test();

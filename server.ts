import express, { Request, Response } from "express";
import next from "next";
import mongoose from "mongoose";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
const port = process.env.PORT || 3000;

(async () => {
  try {
    await app.prepare();
    const server = express();

    // Middleware
    server.use(express.json());
    server.use(express.urlencoded({ extended: true }));

    // Database Connection
    const MONGODB_URI =
      process.env.MONGODB_URI ||
      "mongodb://localhost:27017/football-kits-ecommerce";
    try {
      await mongoose.connect(MONGODB_URI);
      console.log("Connected to MongoDB");
    } catch (err) {
      console.error("MongoDB connection error:", err);
    }

    // Custom API Routes (Express)
    // Dynamic imports to avoid issues before app.prepare() or if needed
    const productRoutes = (await import("@/server/routes/products")).default;
    const orderRoutes = (await import("@/server/routes/orders")).default;
    const authRoutes = (await import("@/server/routes/auth")).default;
    const userRoutes = (await import("@/server/routes/users")).default;

    server.use("/api/auth", authRoutes);
    server.use("/api/users", userRoutes);
    server.use("/api/products", productRoutes);
    server.use("/api/orders", orderRoutes);

    server.get("/api/health", (req: Request, res: Response) => {
      res.json({ status: "ok", message: "Server is running" });
    });

    server.use((req: Request, res: Response) => {
      return handle(req, res);
    });

    server.listen(port, () => {
      console.log(`> Ready on http://localhost:${port}`);
    });
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();

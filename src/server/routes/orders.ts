import express from "express";
import Order from "@/models/Order";
import { requireAuth, requireAdmin } from "@/server/middleware/auth";

const router = express.Router();

// Create Order
router.post("/", requireAuth, async (req, res) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const order = new Order({ ...req.body, user: (req as any).user.id });
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: "Error creating order", error });
  }
});

// Get user orders (TODO: Filter by user from Auth)
router.get("/my-orders", requireAuth, async (req, res) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const orders = await Order.find({ user: (req as any).user.id })
      .sort({ createdAt: -1 })
      .populate("products.product");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders", error });
  }
});

// Get all orders (Admin)
router.get("/", requireAdmin, async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate("user", "name email")
      .populate("products.product");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders", error });
  }
});

// Update order status (Admin)
router.put("/:id/status", requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: "Error updating order", error });
  }
});

export default router;

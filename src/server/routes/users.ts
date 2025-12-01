import express from "express";
import User from "@/models/User";
import { requireAuth } from "@/server/middleware/auth";

const router = express.Router();

router.get("/me", requireAuth, async (req, res) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const user = await User.findById((req as any).user.id).select(
      "name email image role"
    );
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching profile", error });
  }
});

router.put("/me", requireAuth, async (req, res) => {
  try {
    const { name, email, image } = req.body;
    const updated = await User.findByIdAndUpdate(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (req as any).user.id,
      { name, email, image },
      { new: true }
    ).select("name email image role");
    if (!updated) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: "Error updating profile", error });
  }
});

export default router;

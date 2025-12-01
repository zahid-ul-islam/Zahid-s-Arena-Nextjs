import express from "express";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import { signToken } from "@/lib/auth";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, image } = req.body;
    if (!name || !email || !password) {
      res.status(400).json({ message: "Missing fields" });
      return;
    }
    const exists = await User.findOne({ email });
    if (exists) {
      res.status(409).json({ message: "Email already in use" });
      return;
    }
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hash, role: "user", image });
    res.status(201).json({ id: user._id, name: user.name, email: user.email, role: user.role });
  } catch (error) {
    res.status(500).json({ message: "Registration failed", error });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !user.password) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }
    const token = signToken({ id: String(user._id), role: user.role });
    const isProd = process.env.NODE_ENV === "production";
    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });
    res.cookie("role", user.role, {
      httpOnly: false,
      secure: isProd,
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });
    res.cookie("user_id", String(user._id), {
      httpOnly: false,
      secure: isProd,
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });
    res.json({ id: user._id, name: user.name, email: user.email, role: user.role });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error });
  }
});

router.post("/logout", async (_req, res) => {
  const isProd = process.env.NODE_ENV === "production";
  res.cookie("auth_token", "", {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  res.cookie("role", "", { httpOnly: false, secure: isProd, sameSite: "lax", path: "/", maxAge: 0 });
  res.cookie("user_id", "", { httpOnly: false, secure: isProd, sameSite: "lax", path: "/", maxAge: 0 });
  res.json({ message: "Logged out" });
});

export default router;
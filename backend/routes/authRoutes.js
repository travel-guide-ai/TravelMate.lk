import express from "express";
import { registerUser } from "../controllers/authController.js";

const router = express.Router();

// Test route
router.get("/test", (req, res) => {
  res.json({ message: "Auth route working!" });
});

// Register route
router.post("/register", registerUser);

export default router;

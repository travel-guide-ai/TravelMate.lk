import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRouter from "./routes/authRoutes.js";
dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Database connected...");
  } catch (error) {
    console.error("Database not connected...", error);
    process.exit(1);
  }
};

app.get("/", (req, res) => {
  res.json("Welcome to server...");
});

app.use("/api/v1/auth", authRouter);

app.listen(PORT, () => {
  console.log("Server is running...");
});

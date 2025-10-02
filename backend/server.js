import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRouter from "./routes/authRoutes.js";
import webhookRoutes from "./routes/webhookRoutes.js";
import userRoutes from "./routes/userRoutes.js";
dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

// Raw body parser for webhooks (before express.json())
app.use('/api/v1/webhooks', express.raw({ type: 'application/json' }));

app.use(express.json());
app.use(cors());

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Database connected...");
  } catch (error) {
    console.error("Database not connected...", error);
    process.exit(1);
  }
};

// Connect to database
connectDB();

app.get("/", (req, res) => {
  res.json("Welcome to TravelMate.lk API...");
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/webhooks", webhookRoutes);
app.use("/api/v1/users", userRoutes);

app.listen(PORT, () => {
  console.log("Server is running...");
});

import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth_routes.js";
import userRoutes from "./routes/user_routes.js";
import chatRoutes from "./routes/chat_routes.js";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "https://chatter-box-3.onrender.com",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);

connectDB().then(() => {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
});

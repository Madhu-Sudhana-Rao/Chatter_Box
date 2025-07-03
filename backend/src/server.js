import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth_routes.js";
import userRoutes from "./routes/user_routes.js";
import chatRoutes from "./routes/chat_routes.js";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors({
    origin: true,
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);

app.use(express.static(path.join(__dirname, "../../frontend/dist")));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"));
});

connectDB().then(() => {
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
});

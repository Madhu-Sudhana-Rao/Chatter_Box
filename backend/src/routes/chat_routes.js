import express from "express";
import { protectRoute } from "../middlewares/auth_middleware.js";
import { getStreamToken } from "../controllers/chat_controllers.js";

const router = express.Router();

router.get("/token", protectRoute, getStreamToken);

export default router;

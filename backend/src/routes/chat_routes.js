import express from "express";
import { getChatToken } from "../controllers/chat_controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/token", protectRoute, getChatToken);

export default router;

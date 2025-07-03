import { generateStreamToken } from "../lib/stream.js";

export const getChatToken = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const token = generateStreamToken(userId);
        return res.status(200).json({ token });
    } catch (error) {
        console.error("Token Error:", error.message);
        res.status(500).json({ message: "Token generation failed" });
    }
};

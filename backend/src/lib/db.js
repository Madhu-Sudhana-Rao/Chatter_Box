import { generateStreamToken, upsertStreamUser } from "../lib/stream.js";

export async function getStreamToken(req, res) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: User ID missing" });
    }

    await upsertStreamUser({
      id: userId,
      name: req.user?.fullName || "Anonymous",
      image: req.user?.profilePic || "",
    });

    const token = generateStreamToken(userId);

    if (!token) {
      return res.status(500).json({ message: "Token generation failed" });
    }

    res.status(200).json({ token });
  } catch (error) {
    console.error("Error in getStreamToken controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

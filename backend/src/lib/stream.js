import { StreamChat } from "stream-chat";
import "dotenv/config";

const getStreamClient = () => {
    const apiKey = process.env.STEAM_API_KEY;
    const apiSecret = process.env.STEAM_API_SECRET;

    if (!apiKey || !apiSecret) {
        console.error("Stream API key or Secret is missing");
        throw new Error("Missing Stream credentials");
    }

    return StreamChat.getInstance(apiKey, apiSecret);
};

export const upsertStreamUser = async (userData) => {
    try {
        const client = getStreamClient();
        await client.upsertUsers([userData]);
        return userData;
    } catch (error) {
        console.error("Error creating stream user:", error.message);
        throw error;
    }
};

export const generateStreamToken = (userId) => {
    try {
        if (!userId) {
            throw new Error("Missing userId for token generation");
        }

        const client = getStreamClient();
        return client.createToken(userId.toString());
    } catch (error) {
        console.error("Error generating Stream token:", error.message);
        return null;
    }
};

import { StreamChat } from "stream-chat";
import "dotenv/config";

const apiKey = process.env.STEAM_API_KEY;         
const apiSecret = process.env.STEAM_API_SECRET;

if (!apiKey || !apiSecret) {
    console.error("Stream API key or Secret is missing");
}

const streamClient = StreamChat.getInstance(apiKey, apiSecret);

export const upsertStreamUser = async (userData) => {
    try {
        await streamClient.upsertUsers([userData]);
        return userData;
    } catch (error) {
        console.error("Error creating stream user", error.message);
    }
};

export const generateStreamToken = (userId) => {
    try {
        if (!userId) {
            console.error("Missing userId for token generation");
            return null;
        }

        return streamClient.createToken(userId.toString());
    } catch (error) {
        console.error("Error generating Stream token", error.message);
        return null;
    }
};

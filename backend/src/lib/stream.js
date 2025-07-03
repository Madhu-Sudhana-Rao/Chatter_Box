import { StreamChat } from "stream-chat";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

if (!apiKey || !apiSecret) {
    throw new Error("STREAM_API_KEY or STREAM_API_SECRET is missing in environment variables.");
}


const streamClient = StreamChat.getInstance(apiKey, apiSecret);

export const upsertStreamUser = async (userData) => {
    try {
        await streamClient.upsertUsers([userData]);
        return userData;
    } catch (error) {
        console.error("Error creating Stream user:", error.message);
        throw new Error("Stream user creation failed.");
    }
};

export const generateStreamToken = (userId) => {
    try {
        if (!userId) throw new Error("Missing user ID");
        return streamClient.createToken(userId.toString());
    } catch (error) {
        console.error("Error generating Stream token:", error.message);
        throw new Error("Token generation failed.");
    }
};

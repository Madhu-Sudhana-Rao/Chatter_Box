import { StreamChat } from "stream-chat";
import "dotenv/config";

let streamClient = null;

const getStreamClient = () => {
  if (streamClient) return streamClient;

  const apiKey = process.env.STEAM_API_KEY;
  const apiSecret = process.env.STEAM_API_SECRET;

  if (!apiKey || !apiSecret) {
    console.error("Stream API key or Secret is missing");
    throw new Error("Missing Stream credentials");
  }

  streamClient = StreamChat.getInstance(apiKey, apiSecret);
  return streamClient;
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

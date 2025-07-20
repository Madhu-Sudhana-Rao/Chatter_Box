import { StreamChat } from "stream-chat";
import "dotenv/config";

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

if (!apiKey || !apiSecret) {
  console.error("Missing STREAM_API_KEY or STREAM_API_SECRET");
  throw new Error("Missing Stream credentials");
}

let chatClient = null;

const getChatClient = () => {
  if (!chatClient) {
    chatClient = StreamChat.getInstance(apiKey, apiSecret);
  }
  return chatClient;
};

export const upsertStreamUser = async (userData) => {
  try {
    const client = getChatClient();
    await client.upsertUsers([userData]);
    return userData;
  } catch (error) {
    console.error("Error creating Stream user:", error.message);
    throw error;
  }
};

export const generateStreamToken = (userId) => {
  try {
    if (!userId) throw new Error("Missing userId for chat token");
    const client = getChatClient();
    return client.createToken(userId.toString());
  } catch (error) {
    console.error("Error generating chat token:", error.message);
    return null;
  }
};

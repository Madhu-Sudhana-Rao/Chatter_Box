import { StreamChat } from "stream-chat";
import { StreamVideoClient } from "@stream-io/video-node-sdk";
import "dotenv/config";

const apiKey = process.env.STEAM_API_KEY;
const apiSecret = process.env.STEAM_API_SECRET;

if (!apiKey || !apiSecret) {
  console.error("Missing STEAM_API_KEY or STEAM_API_SECRET");
  throw new Error("Missing Stream credentials");
}

let chatClient = null;
let videoClient = null;

const getChatClient = () => {
  if (!chatClient) {
    chatClient = StreamChat.getInstance(apiKey, apiSecret);
  }
  return chatClient;
};

const getVideoClient = () => {
  if (!videoClient) {
    videoClient = new StreamVideoClient({ apiKey, apiSecret });
  }
  return videoClient;
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

export const generateChatToken = (userId) => {
  try {
    if (!userId) throw new Error("Missing userId for chat token");
    const client = getChatClient();
    return client.createToken(userId.toString());
  } catch (error) {
    console.error("Error generating chat token:", error.message);
    return null;
  }
};

export const generateStreamToken = (userId) => {
  try {
    if (!userId) throw new Error("Missing userId for video token");
    const client = getVideoClient();
    return client.createToken(userId.toString());
  } catch (error) {
    console.error("Error generating video token:", error.message);
    return null;
  }
};

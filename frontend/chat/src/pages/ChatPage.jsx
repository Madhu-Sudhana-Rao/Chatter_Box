import { useEffect, useState } from "react";
import { useParams } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";

import {
  Channel,
  ChannelHeader,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";

import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";

import ChatLoader from "../components/ChatLoader";
import CallButton from "../components/CallButton";

import "stream-chat-react/dist/css/v2/index.css";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const ChatPage = () => {
  const { id: targetUserId } = useParams();
  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const { authUser } = useAuthUser();

  const { data: tokenData, isError, error, isLoading } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  useEffect(() => {
    let isMounted = true;

    const initChat = async () => {
      console.log("initChat called");
      if (!authUser) {
        console.warn("authUser is missing");
        setLoading(false);
        return;
      }

      if (!tokenData?.token) {
        console.warn("Stream token is missing", tokenData);
        setLoading(false);
        return;
      }

      try {
        console.log("Connecting user to Stream...");
        const client = StreamChat.getInstance(STREAM_API_KEY);

        await client.connectUser(
          {
            id: authUser._id,
            name: authUser.fullName,
            image: authUser.profilePic,
          },
          tokenData.token
        );

        const channelId = [authUser._id, targetUserId].sort().join("-");
        console.log("Creating/Watching channel:", channelId);
        const currChannel = client.channel("messaging", channelId, {
          members: [authUser._id, targetUserId],
        });

        await currChannel.watch();

        if (isMounted) {
          setChatClient(client);
          setChannel(currChannel);
        }
      } catch (error) {
        console.error("Error initializing chat:", error);
        toast.error("Could not connect to chat. Please try again.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    initChat();

    return () => {
      isMounted = false;
      if (chatClient) {
        chatClient.disconnectUser().catch((err) =>
          console.warn("Error disconnecting user:", err)
        );
      }
    };
  }, [tokenData, authUser, targetUserId]);

  const handleVideoCall = () => {
    if (channel) {
      const callUrl = `${window.location.origin}/call/${channel.id}`;
      channel.sendMessage({
        text: `I've started a video call. Join me here: ${callUrl}`,
      });
      toast.success("Video call link sent successfully!");
    }
  };

  if (loading || !chatClient || !channel) {
    console.log("Loading:", loading);
    console.log("authUser:", authUser);
    console.log("tokenData:", tokenData);
    console.log("chatClient:", chatClient);
    console.log("channel:", channel);
    return <ChatLoader />;
  }

  return (
    <div className="h-[93vh] w-full overflow-hidden bg-base-100">
      <Chat client={chatClient} theme="str-chat__theme-light">
        <Channel channel={channel}>
          <div className="flex flex-col h-full">
            <CallButton handleVideoCall={handleVideoCall} />
            <Window className="flex flex-col flex-1 overflow-hidden">
              <ChannelHeader className="!bg-base-300" />
              <div className="flex-1 overflow-y-auto">
                <MessageList className="bg-base-200" />
              </div>
              <MessageInput className="!bg-base-300" focus />
            </Window>
            <Thread className="hidden" />
          </div>
        </Channel>
      </Chat>
    </div>
  );
};

export default ChatPage;

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useAuthUser from '../hooks/useAuthUser';
import { useQuery } from '@tanstack/react-query';
import { getStreamToken } from '../lib/api';

import {
  Chat,
  Channel,
  ChannelHeader,
  MessageList,
  MessageInput,
  Thread,
  Window,
} from 'stream-chat-react';

import { StreamChat } from 'stream-chat';
import toast from 'react-hot-toast';

import ChatLoader from '../components/ChatLoader';
import CallButton from '../components/CallButton';

import 'stream-chat-react/dist/css/v2/index.css';

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const ChatPage = () => {
  const { id: targetUserId } = useParams();
  const [chatClient, setChatClient] = useState(null);
  const [chatChannel, setChatChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const { authUser } = useAuthUser();

  const { data: tokenData } = useQuery({
    queryKey: ['streamToken', authUser?._id],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  useEffect(() => {
    if (!tokenData?.token || !authUser) return;

    const client = StreamChat.getInstance(STREAM_API_KEY);

    const initChat = async () => {
      try {
        await client.connectUser(
          {
            id: authUser._id,
            name: authUser.fullName,
            image: authUser.profilePic,
          },
          tokenData.token
        );

        const channelId = [authUser._id, targetUserId].sort().join('-');

        const currChannel = client.channel('messaging', channelId, {
          members: [authUser._id, targetUserId],
        });

        await currChannel.watch();

        setChatClient(client);
        setChatChannel(currChannel);
      } catch (error) {
        console.error('Error initializing chat:', error);
        toast.error('Could not connect to chat. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    initChat();

    return () => {
      client.disconnectUser().catch((err) =>
        console.warn('Error disconnecting user:', err)
      );
    };
  }, [tokenData, authUser, targetUserId]);

  const handleVideoCall = () => {
    if (chatChannel) {
      const callUrl = `${window.location.origin}/call/${chatChannel.id}`;

      chatChannel.sendMessage({
        text: `I've started a video call. Join me here: ${callUrl}`,
      });

      toast.success('Video call link sent successfully!');
    }
  };

  if (loading || !chatClient || !chatChannel) {
    return <ChatLoader />;
  }

  return (
    <div className="flex items-center justify-center h-[93vh] bg-base-100">
      <div className="w-full max-w-4xl h-full rounded-xl border border-base-300 bg-base-200 shadow-md overflow-hidden">
        <Chat client={chatClient} theme="str-chat__theme-light">
          <Channel channel={chatChannel}>
            <div className="flex flex-col h-full">
              <CallButton handleVideoCall={handleVideoCall} />

              <div className="flex flex-col flex-1 overflow-hidden">
                <Window>
                  <div className="flex flex-col h-full">
                    <ChannelHeader className="!bg-base-300 !rounded-t-xl" />
                    <div className="flex-1 overflow-y-auto">
                      <MessageList className="!bg-base-200" />
                    </div>
                    <MessageInput className="!bg-base-300 !rounded-b-xl" focus />
                  </div>
                </Window>

                <div className="h-0 overflow-y-auto">
                  <Thread />
                </div>
              </div>
            </div>
          </Channel>
        </Chat>
      </div>
    </div>
  );
};

export default ChatPage;
